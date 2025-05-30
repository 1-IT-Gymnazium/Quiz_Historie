// kvízová data
const quizData = [
    { question: "Kdo vydal Zlatou bulu sicilskou?", options: ["Fridrich II.", "Karel IV.", "Václav III.", "Rudolf II."], correctAnswer: "Fridrich II." },
    { question: "Kdo vedl husity u Domažlic?", options: ["Prokop Holý", "Jan Žižka", "Jiří z Poděbrad", "Jan Amos Komenský"], correctAnswer: "Prokop Holý" },
    { question: "Kdy vznikla Karlova univerzita?", options: ["1348", "1415", "1526", "1620"], correctAnswer: "1348" },
    { question: "Kolik bylo pražských defenestrací?", options: ["Tři", "Jedna", "Dvě", "Čtyři"], correctAnswer: "Tři" },
    { question: "Kdy se odehrála bitva na Bílé hoře?", options: ["1620", "1618", "1648", "1600"], correctAnswer: "1620" },
    { question: "Kdo vládl českým zemím po roce 1620?", options: ["Habsburkové", "Jagellonci", "Lucemburkové", "Přemyslovci"], correctAnswer: "Habsburkové" },
    { question: "Kým byl František Palacký?", options: ["Historikem", "Knězem", "Králem", "Generálem"], correctAnswer: "Historikem" },
    { question: "Kdy proběhla revoluce v Praze? (Pražské červnové povstání)", options: ["1848", "1791", "1866", "1905"], correctAnswer: "1848" },
    { question: "Kdy vzniklo Československo?", options: ["1918", "1928", "1939", "1945"], correctAnswer: "1918" },
    { question: "Kdy byla podepsána Mnichovská dohoda?", options: ["1938", "1935", "1941", "1948"], correctAnswer: "1938" },
    { question: "Kdy Němci obsadili Československo?", options: ["1939", "1936", "1942", "1944"], correctAnswer: "1939" },
    { question: "Kdo provedl atentát na Heydricha?", options: ["Gabčík a Kubiš", "Žižka a Prokop", "Beneš a Štefánik", "Mašín a Morávek"], correctAnswer: "Gabčík a Kubiš" },
    { question: "Kdy byl Vítězný únor?", options: ["1948", "1945", "1953", "1938"], correctAnswer: "1948" },
    { question: "Kdy začalo Pražské jaro?", options: ["1968", "1977", "1945", "1989"], correctAnswer: "1968" },
    { question: "Kdy začala sametová revoluce?", options: ["1989", "1969", "1993", "1975"], correctAnswer: "1989" },
];
//logika kvízu
const QuizModule = (function() {
    // Vnitřní proměnné modulu
  let shuffledQuestions = [];// otazky v náhodném pořadí
  let currentIndex = 0;// index aktuální otázky
  let score = 0;   // skóre uživatele
  let timerInterval; // identifikátor časovače
  const MAX_TIME = 20; // 20 sekund na otázku
  let timeLeft;
  let soundEnabled = true;// jestli je zapnutý zvuk

  // funkce pro zamíchání otázek nebo odpovědí
  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

 // Inicializace kvízu
  function init() {
    score = 0;
    shuffledQuestions = shuffle(quizData);
    currentIndex = 0;
    soundEnabled = document.getElementById('sound-toggle').checked;
  }

  // Vrací aktuální otázku
  function getCurrent() {
    return shuffledQuestions[currentIndex];
  }

    // Posune se na další otázku, vrací true pokud existuje další
  function next() {
    currentIndex++;
    return currentIndex < shuffledQuestions.length;
  }

  // Kontrola odpovědi a aktualizace skóre
  function check(answer) {
    const q = getCurrent();
    const isCorrect = answer === q.correctAnswer;
    if (isCorrect) score++;
    return { isCorrect, correct: q.correctAnswer };
  }

    // Spuštění časovače, který volá zpětné funkce při každém ticku a na konci
  function startTimer(onTick, onEnd) {
    timeLeft = MAX_TIME;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;
      onTick((timeLeft / MAX_TIME) * 100);// aktualizace % průběhu
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onEnd(); // volání funkce při vypršení času
      }
    }, 100);  // každých 100ms (pro plynulý pohyb)
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Přehrání zvuku
  function play(type) {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    if (type === 'correct') {
      osc.frequency.value = 440; // tón pro správnou odpověď
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.frequency.value = 220; // tón pro špatnou odpověď
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else { // timeout
      osc.frequency.value = 180; // tón pro vypršení času
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  }

  // Uložení výsledku do localStorage
  function save() {
    const hist = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    hist.push({ score, total: shuffledQuestions.length, date: new Date().toLocaleString('cs-CZ') });
    localStorage.setItem('quizHistory', JSON.stringify(hist));
  }

    // Načtení historie výsledků
  function history() {
    return JSON.parse(localStorage.getItem('quizHistory') || '[]');
  }

    // Vrací průběh kvízu
  function getProgress() {
    return { current: currentIndex + 1, total: shuffledQuestions.length };
  }

    // Vrací skóre
  function getScore() {
    return score;
  }

    // Nastavení zvuku
  function setSoundEnabled(val) {
    soundEnabled = val;
  }

  // Veřejné API
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
    description: document.getElementById('description'),
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

    // Přepínání mezi obrazovkami
  function switchScreen(screen) {
    elems.startScreen.classList.toggle('hide', screen !== 'start');
    elems.description.classList.toggle('hide', screen !== 'start');
    elems.quiz.classList.toggle('hide', screen !== 'quiz');
    elems.result.classList.toggle('hide', screen !== 'result');
    elems.history.classList.toggle('hide', screen !== 'history');
  }

  // Reset UI před novou otázkou
  function resetQuizUI() {
    elems.nextBtn.classList.add('hide');
    elems.feedback.innerText = '';
    elems.answers.innerHTML = '';
    elems.timerBar.style.width = '100%';
  }

    // Aktualizace počitadla otázky
  function updateProgress(current, total) {
    elems.progress.innerText = `Otázka ${current}/${total}`;
  }

    // Zobrazení otázky a vytvoření odpovědních tlačítek
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

    // Zamezení opětovnému klikání na odpovědi
  function disableAnswers() {
    Array.from(elems.answers.children).forEach(b => b.disabled = true);
  }

  // Zpracování odpovědi uživatele
  function handleAnswer(opt) {
    QuizModule.stopTimer();
    disableAnswers();
    const res = QuizModule.check(opt);

    // Projdi všechna tlačítka
    Array.from(elems.answers.children).forEach(button => {
        if (button.innerText === res.correct) {
            button.classList.add('correct');
        } else if (button.innerText === opt) {
            button.classList.add('wrong');
        }
    });

    // Zvuk + zpětná vazba
    if (res.isCorrect) {
        QuizModule.play('correct');
        elems.feedback.innerText = 'Správně!';
    } else {
        QuizModule.play('wrong');
        elems.feedback.innerText = `Špatně! Správná odpověď: ${res.correct}`;
    }

    elems.nextBtn.classList.remove('hide');
}

    // Zpracování vypršení času
  function handleTimeout() {
    QuizModule.stopTimer();
    QuizModule.play('timeout');
    disableAnswers();
    const correct = QuizModule.getCurrent().correctAnswer;
    elems.feedback.innerText = `Čas vypršel! Správná odpověď: ${correct}`;
    elems.nextBtn.classList.remove('hide');
  }

  // Zobrazení výsledků po dokončení kvízu
  function showResults() {
    switchScreen('result');
    const score = QuizModule.getScore();
    elems.scoreText.innerText = `Získané body: ${score}`;
  }

  // Zobrazení uložené historie výsledků
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

// kontroler aplikace
const Controller = (function(qm, ui) {
  function init() {
    const e = ui.elems;
    // Při kliknutí na tlačítka volá
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

  // Spuštění kvízu
  function start() {
    qm.init();
    ui.switchScreen('quiz');
    load();
  }

  // Načtení otázky a spuštění časovače
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