// logika kvízu
const quizData = [
      { question: "otázka", options: ["1","2","3","4"], correctAnswer: "1" },
]

const QuizModule = (function() {
  let shuffledQuestions = [];  // promíchané otázky
  let currentIndex = 0; //index aktuální otázky
  let score = 0; 
  let timerInterval; //interval časovače
  const MAX_TIME = 20; // kolik sekund na otázku
  let timeLeft; 
  let soundEnabled = true; // zvuk ano/ne


 // promíchá pole
  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

})
