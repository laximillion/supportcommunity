import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(express.static("build"));
app.get('/', (req, res) => {
    res.send('API is running');
});

app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/generate-question', async (req, res) => {
    const answers = req.body;
    const questionNumber = answers.length + 1;
    const prompt = generatePrompt(answers);

    let fullPrompt;

    if (questionNumber <= 5) {
        fullPrompt = `Мы создаем тест определяющий навык который интересует пользователя. Вот предыдущие вопросы и ответы:\n${prompt}\nСледующий вопрос номер ${questionNumber} он должен быть связан с прошлым вопросом.\nФормат ответа СТРОГО:\nВопрос: [новый вопрос]\nОтвет 1: [вариант ответа 1]\nОтвет 2: [вариант ответа 2]\nОтвет 3: [вариант ответа 3]\nОтвет 4: [вариант ответа 4]\nУбедитесь, что вопрос релевантен и не спрашивал одно и то же по смыслу с прошлыми вопросами, а все ответы четкие. Не пиши номер вопроса, просто Вопрос:. Обязательно предоставьте ровно 4 варианта ответа, каждый из которых не должен превышать 50 символов, включая все знаки!`;
    } else {
        fullPrompt = `Я компания создающяя сообщества по интересам, по типу "Создание 2д и 3д игр", "Изучение культур", "Агрокультура" и тд. Ты бот который помогает этому клиенту найти подходящий себе навык взависимости от хобби, интересы, характер и тд. Вот предыдущие вопросы и ответы которые ты создал:\n${prompt}\nСейчас тебе нужно либо создать новый вопрос номер ${questionNumber}, либо если посчитаешь что ТОЧНО у тебя достаточно информации чтобы в деталях найти подходяший навык для человека дай навык. Если выбрал дать вопрос, то он может учитывать ответ прошлого вопроса для создания нового. Но если того что дал уже пользователь ТОЧНО ДОСТАТОЧНО для ТОЧНОГО определения навыка дай навык. \nМинимальное количество вопросов — 5, максимальное — 15. Если создаем вопрос номер 16, это крайний случай, где нужно выдать навык, в остальных одно из двух.\nФормат ответа СТРОГО одно из двух, И СТРОГО В ТАКОМ ФОРМАТЕ так как твой ответ автоматически редактируется для нашего сайта:\nНавык: [название навыка]\nОбъяснение: [почему этот навык подходит]\nИЛИ\nВопрос: [следующий вопрос]\nОтвет 1: [вариант ответа 1]\nОтвет 2: [вариант ответа 2]\nОтвет 3: [вариант ответа 3]\nОтвет 4: [вариант ответа 4]\nУбедитесь, что вопрос релевантен и был оригинальным, а все ответы четкие. Если выбрал вопрос создать НЕ ПИШИ номер вопроса, просто Вопрос:. Обязательно предоставьте ровно 4 варианта ответа, каждый из которых не должен превышать 50 символов, включая все знаки!`;
    }

    console.log(`Full prompt sent to OpenAI for question ${questionNumber}:\n${fullPrompt}`);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: [{ role: 'user', content: fullPrompt }],
                max_tokens: 150,
                temperature: 0.7,
                top_p: 1
            })
        });

        const data = await response.json();
        console.log('Response from OpenAI:', JSON.stringify(data, null, 2));

        if (data.choices && data.choices.length > 0) {
            const message = data.choices[0].message.content.trim();
            const lines = message.split('\n').map(line => line.trim()).filter(line => line);

            if (message.match(/^Вопрос(:|\s\d+:)?/)) {
                const question = lines[0].replace(/^Вопрос(:|\s\d+:)?/, '').trim();
                const answerOptions = lines.slice(1, 5).map(line => line.replace(/^Ответ \d+: /, '').trim());

                if (answerOptions.length === 4 && answerOptions.every(answer => answer.length <= 50)) {
                    res.json({ question, answers: answerOptions });
                } else {
                    console.error('Invalid number of answer options:', answerOptions);
                    res.status(500).json({ error: 'Неверное количество вариантов ответов' });
                }
            } else if (message.startsWith('Навык:')) {
                const skill = lines[0].replace('Навык: ', '').trim();
                const explanation = lines.slice(1).join(' ').replace('Объяснение: ', '').trim();
                res.json({ skill, explanation });
            } else {
                console.error('Unexpected content in message:', message);
                res.status(500).json({ error: 'Неверный формат ответа: неожиданный контент' });
            }
        } else {
            console.error('No choices found in OpenAI response:', data);
            res.status(500).json({ error: 'Неверный формат ответа: нет вариантов ответов' });
        }
    } catch (error) {
        console.error('Error generating question:', error.message);
        res.status(500).json({ error: 'Ошибка при генерации вопроса' });
    }
});

app.post('/api/get-result', async (req, res) => {
    const answers = req.body;
    const prompt = generateFinalPrompt(answers);

    const fullPrompt = `Мы создаем тест определяющий навык который интересует пользователя. Вот предыдущие вопросы и ответы:\n${prompt}\nТеперь тебе нужно определить подходящий навык человека. Формат ответа СТРОГО:\nНавык: [название навыка]\nОбъяснение: [почему этот навык подходит]`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: [{ role: 'user', content: fullPrompt }],
                max_tokens: 150,
                temperature: 0.7,
                top_p: 1
            })
        });

        const data = await response.json();
        console.log('Response from OpenAI:', JSON.stringify(data, null, 2));

        if (data.choices && data.choices.length > 0) {
            const message = data.choices[0].message.content.trim();
            const lines = message.split('\n').map(line => line.trim()).filter(line => line);

            if (message.startsWith('Навык:')) {
                const skill = lines[0].replace('Навык: ', '').trim();
                const explanation = lines.slice(1).join(' ').replace('Объяснение: ', '').trim();
                res.json({ skill, explanation });
            } else {
                console.error('Unexpected content in result message:', message);
                res.status(500).json({ error: 'Неверный формат ответа: неожиданный контент' });
            }
        } else {
            console.error('No choices found in OpenAI response:', data);
            res.status(500).json({ error: 'Неверный формат ответа: нет вариантов ответов' });
        }
    } catch (error) {
        console.error('Error generating result:', error.message);
        res.status(500).json({ error: 'Ошибка при генерации результата' });
    }
});

app.post('/api/get-category', async (req, res) => {
    const { skill } = req.body;

    const fullPrompt = `У пользователя определен навык "${skill}". Определи, какая из этих восьми категорий наиболее подходит для этого навыка: Математика, Науки, Агрокультура, Культура, Политика, Творчество, Спорт, Учеба. Так как это ответ будет обрабатываться, Формат ответа ОЧЕНЬ СТРОГО такой же:\nСообщество: [Подходящая категория из восьми]\nОбъяснение: Это сообщество супер крутое`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: [{ role: 'user', content: fullPrompt }],
                max_tokens: 100,
                temperature: 0.7,
                top_p: 1
            })
        });

        const data = await response.json();
        console.log('Response from OpenAI for category:', JSON.stringify(data, null, 2));

        if (data.choices && data.choices.length > 0) {
            const message = data.choices[0].message.content.trim();
            const lines = message.split('\n').map(line => line.trim()).filter(line => line);

            if (message.startsWith('Сообщество:')) {
                const category = lines[0].replace('Сообщество: ', '').trim();
                const explanation = lines.slice(1).join(' ').replace('Объяснение: ', '').trim();
                res.json({ category, explanation });
            } else {
                console.error('Unexpected content in category message:', message);
                res.status(500).json({ error: 'Неверный формат ответа: неожиданный контент' });
            }
        } else {
            console.error('No choices found in OpenAI response:', data);
            res.status(500).json({ error: 'Неверный формат ответа: нет вариантов ответов' });
        }
    } catch (error) {
        console.error('Error generating category:', error.message);
        res.status(500).json({ error: 'Ошибка при определении категории' });
    }
});

function generatePrompt(answers) {
    let prompt = '';
    answers.forEach((answer, index) => {
        if (answer) {
            prompt += `Вопрос ${index + 1}: ${answer.question}\nОтвет ${index + 1}: ${answer.answer}\n`;
        }
    });
    return prompt;
}

function generateFinalPrompt(answers) {
    let prompt = '';
    answers.forEach((answer, index) => {
        if (answer) {
            prompt += `Вопрос ${index + 1}: ${answer.question}\nОтвет ${index + 1}: ${answer.answer}\n`;
        }
    });
    return prompt;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

