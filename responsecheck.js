// Ваш объект ответа от OpenAI API
const response = {
    id: 'chatcmpl-9QT0kOHPDLzs7dNUHFdFm2HL7k4no',
    object: 'chat.completion',
    created: 1716095074,
    model: 'gpt-3.5-turbo-0125',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: 'Ваш текст ответа здесь.'
        },
        logprobs: null,
        finish_reason: 'stop'
      }
    ],
    usage: { prompt_tokens: 271, completion_tokens: 81, total_tokens: 352 },
    system_fingerprint: null
  };
  
  // Извлечение текста ответа
  const answerText = response.choices[0].message.content;
  console.log('Ответ от OpenAI:', answerText);
  