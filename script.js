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
]

const QuizModule = (function () {
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
