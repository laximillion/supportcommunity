import React from 'react';
import { InfoComponent, Carousel, Questionnaire, Warning } from '../components'; // Adjusted import to assume components are in the components folder
import QuizComponent from '../components/QuizComponent'; // Ensure this path is correct
import image1 from '../assets/pfp1.png';
import image2 from '../assets/pfp2.png';
import image3 from '../assets/pfp3.png';
import { questions } from '../data';
import '../App.css';

const title = "SUPPORT COMMUNITY";
const description = `Почему это важно для тебя?\n—Наше поколение разделилось на тех, кто активно двигается вперед и улучшает свои таланты. А есть те, кто ничего до последнего в себе не развивает, но имеет потенциал! Так развивай его!`;
const subtitle = 'Преврати свою привычку в полезный навык!';
const buttonText = 'Преврати свою привычку в полезный навык!';
const WarningTitle = 'Потенциальные навыки которые у тебя могут хорошо получится.Важно: Твой навык может меняться в зависимости от твоего интереса';
const cards = [
  {
    image: image2,
    title: 'Айзере, Астана, БИЛ',
    description: 'Я присоединилась к сообществу Support в качестве дизайнера с самого его основания. За это время я совершила значительный прогресс в улучшении навыков оформления постов, однако самое ценное для меня — это знакомство с потрясающими людьми и обогащение своих знаний благодаря вдохновляющим спикерам, которые были приглашены. В целом, Support — это сообщество, которое строится на взаимопомощи, вдохновении и обмене опытом',
    color: '#2A416A'
  },
  {
    image: image1,
    title: 'Тансу, Бином, г.Астана',
    description: 'Я начала больше ценить то что каждый из нас может приподнести какую-то ценность в нашу жизнь. Мой проект объединял единомышленников и каждый оказывал влияние на другого. Используя свои знания в сфере психологии с пользой я думаю что выполнила главную цель нашего клуба- стремление к личностному росту. Ресурсы и время которое мы предоставляли участникам для работы над собой определенно помогло им в саморазвитии.',
    color: '#518CCC'
  },
  {
    image: image3,
    title: 'Мелинда, Азербайджан',
    description: 'Я страстно увлечена дипломатией и правом. Мое участие в IMUN говорит о моей готовности решать мировые проблемы через диалог и компромиссы. Моя цель - стать юристом, чтобы защищать интересы других. Я стремлюсь к этим целям с решимостью и страстью.',
    color: '#4DDCE9'
  }
];

function Home() {
  return (
    <div className="Home">
      <div className="Container">
        <InfoComponent 
          title={title}
          subtitle={subtitle} 
          description={description}
          buttonText={buttonText}
        />
        <Carousel items={cards} />
        <QuizComponent /> {/* Embed the QuizComponent here */}
        <Warning title={WarningTitle}/>
      </div>
    </div>
  );
}

export default Home;
