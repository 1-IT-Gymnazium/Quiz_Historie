// logika kvízu
const quizData = [
    { question: "Kdo vydal Zlatou bulu sicilskou?", options: ["Fridrich II.", "Karel IV.", "Václav III.", "Rudolf II."], correctAnswer: "Fridrich II." },
    { question: "Kdo vedl husity u Domažlic?", options: ["Prokop Holý", "Jan Žižka", "Jiří z Poděbrad", "Jan Amos Komenský"], correctAnswer: "Prokop Holý" },
    { question: "Kdy vznikla Karlova univerzita?", options: ["1348", "1415", "1526", "1620"], correctAnswer: "1348" },
    { question: "Kolik bylo pražských defenestrací?", options: ["Tři", "Jedna", "Dvě", "Čtyři"], correctAnswer: "Tři" },
    { question: "Kdy se odehrála bitva na Bílé hoře?", options: ["1620", "1618", "1648", "1600"], correctAnswer: "1620" },
    { question: "Kdo vládl českým zemím po roce 1620?", options: ["Habsburkové", "Jagellonci", "Lucemburkové", "Přemyslovci"], correctAnswer: "Habsburkové" },
    { question: "Kým byl František Palacký?", options: ["Historikem", "Knězem", "Králem", "Generálem"], correctAnswer: "Historikem" },
    { question: "Kdy proběhla revoluce v Praze?", options: ["1848", "1791", "1866", "1905"], correctAnswer: "1848" },
    { question: "Kdy vzniklo Československo?", options: ["1918", "1928", "1939", "1945"], correctAnswer: "1918" },
    { question: "Kdy byla podepsána Mnichovská dohoda?", options: ["1938", "1935", "1941", "1948"], correctAnswer: "1938" },
    { question: "Kdy Němci obsadili Československo?", options: ["1939", "1936", "1942", "1944"], correctAnswer: "1939" },
    { question: "Kdo provedl atentát na Heydricha?", options: ["Gabčík a Kubiš", "Žižka a Prokop", "Beneš a Štefánik", "Mašín a Morávek"], correctAnswer: "Gabčík a Kubiš" },
    { question: "Kdy byl Vítězný únor?", options: ["1948", "1945", "1953", "1938"], correctAnswer: "1948" },
    { question: "Kdy začalo Pražské jaro?", options: ["1968", "1977", "1945", "1989"], correctAnswer: "1968" },
    { question: "Kdy začala sametová revoluce?", options: ["1989", "1969", "1993", "1975"], correctAnswer: "1989" },
];

const QuizModule = (function() {
  let shuffledQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let timerInterval;
  const MAX_TIME = 20; // 20 sekund na otázku
  let timeLeft;
  let soundEnabled = true;

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function init() {
    score = 0;
    shuffledQuestions = shuffle(quizData);
    currentIndex = 0;
    soundEnabled = document.getElementById('sound-toggle').checked;
  }

  function getCurrent() {
    return shuffledQuestions[currentIndex];
  }

  function next() {
    currentIndex++;
    return currentIndex < shuffledQuestions.length;
  }

  function check(answer) {
    const q = getCurrent();
    const isCorrect = answer === q.correctAnswer;
    if (isCorrect) score++;
    return { isCorrect, correct: q.correctAnswer };
  }

  function startTimer(onTick, onEnd) {
    timeLeft = MAX_TIME;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;
      onTick((timeLeft / MAX_TIME) * 100);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onEnd();
      }
    }, 100);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function play(type) {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    if (type === 'correct') {
      osc.frequency.value = 440;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.frequency.value = 220;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else { // timeout
      osc.frequency.value = 180;
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  }

  function save() {
    const hist = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    hist.push({ score, total: shuffledQuestions.length, date: new Date().toLocaleString('cs-CZ') });
    localStorage.setItem('quizHistory', JSON.stringify(hist));
  }

  function history() {
    return JSON.parse(localStorage.getItem('quizHistory') || '[]');
  }

  function getProgress() {
    return { current: currentIndex + 1, total: shuffledQuestions.length };
  }

  function getScore() {
    return score;
  }

  function setSoundEnabled(val) {
    soundEnabled = val;
  }

  return {
    init,
    getCurrent,
    next,
    check,
    startTimer,
    stopTimer,
    play,
    save,
    history,
    getProgress,
    getScore,
    setSoundEnabled
  };
})();

// Modul UI
const UIModule = (function() {
  const elems = {
    startScreen: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz'),
    result: document.getElementById('result-screen'),
    history: document.getElementById('history-screen'),
    startBtn: document.getElementById('start-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    historyBtn: document.getElementById('history-btn'),
    backBtn: document.getElementById('back-btn'),
    question: document.getElementById('question'),
    answers: document.getElementById('answer-buttons'),
    feedback: document.getElementById('feedback'),
    timerBar: document.getElementById('timer-bar'),
    progress: document.getElementById('progress'),
    scoreText: document.getElementById('score-text'),
    historyList: document.getElementById('history-list')
  };

  function switchScreen(screen) {
    elems.startScreen.classList.toggle('hide', screen !== 'start');
    elems.quiz.classList.toggle('hide', screen !== 'quiz');
    elems.result.classList.toggle('hide', screen !== 'result');
    elems.history.classList.toggle('hide', screen !== 'history');
  }

  function resetQuizUI() {
    elems.nextBtn.classList.add('hide');
    elems.feedback.innerText = '';
    elems.answers.innerHTML = '';
    elems.timerBar.style.width = '100%';
  }

  function updateProgress(current, total) {
    elems.progress.innerText = `Otázka ${current}/${total}`;
  }

  function showQuestion(q) {
    elems.question.innerText = q.question;
    const opts = [...q.options].sort(() => Math.random() - 0.5);
    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.innerText = opt;
      btn.addEventListener('click', () => handleAnswer(opt));
      elems.answers.appendChild(btn);
    });
  }

  function disableAnswers() {
    Array.from(elems.answers.children).forEach(b => b.disabled = true);
  }

  function handleAnswer(opt) {
    QuizModule.stopTimer();
    disableAnswers();
    const res = QuizModule.check(opt);
    if (res.isCorrect) {
      QuizModule.play('correct');
      elems.feedback.innerText = 'Správně!';
    } else {
      QuizModule.play('wrong');
      elems.feedback.innerText = `Špatně! Správná odpověď: ${res.correct}`;
    }
    elems.nextBtn.classList.remove('hide');
  }

  function handleTimeout() {
    QuizModule.stopTimer();
    QuizModule.play('timeout');
    disableAnswers();
    const correct = QuizModule.getCurrent().correctAnswer;
    elems.feedback.innerText = `Čas vypršel! Správná odpověď: ${correct}`;
    elems.nextBtn.classList.remove('hide');
  }

  function showResults() {
    switchScreen('result');
    const score = QuizModule.getScore();
    elems.scoreText.innerText = `Získané body: ${score}`;
  }

  function showHistory() {
    switchScreen('history');
    elems.historyList.innerHTML = '';
    const hist = QuizModule.history();
    hist.slice().reverse().forEach(e => {
      const div = document.createElement('div');
      div.innerText = `${e.date}: ${e.score}/${e.total}`;
      elems.historyList.appendChild(div);
    });
  }

  return { elems, switchScreen, resetQuizUI, updateProgress, showQuestion, handleTimeout, showResults, showHistory };
})();

// Controller
const Controller = (function(qm, ui) {
  function init() {
    const e = ui.elems;
    e.startBtn.addEventListener('click', start);
    e.nextBtn.addEventListener('click', () => {
      if (qm.next()) load();
      else { qm.save(); ui.showResults(); }
    });
    e.restartBtn.addEventListener('click', () => ui.switchScreen('start'));
    e.historyBtn.addEventListener('click', ui.showHistory);
    e.backBtn.addEventListener('click', () => ui.switchScreen('result'));
    document.getElementById('sound-toggle').addEventListener('change', e => qm.setSoundEnabled(e.target.checked));
  }

  function start() {
    qm.init();
    ui.switchScreen('quiz');
    load();
  }

  function load() {
    ui.resetQuizUI();
    const q = qm.getCurrent();
    const prog = qm.getProgress();
    ui.updateProgress(prog.current, prog.total);
    showQuestionUI(q);
    qm.startTimer(pct => ui.elems.timerBar.style.width = pct + '%', ui.handleTimeout);
  }

  function showQuestionUI(question) {
    ui.showQuestion(question);
  }

  return { init };
})(QuizModule, UIModule);

// Spuštění aplikace po načtení DOM
document.addEventListener('DOMContentLoaded', () => {
  Controller.init();
});