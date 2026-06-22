// Der Die Das Quiz - Game Logic

// Screens
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

// Buttons
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const choiceButtons = document.querySelectorAll('.choice-btn');

// Quiz Elements
const scoreDisplay = document.getElementById('score-display');
const questionCount = document.getElementById('question-count');
const totalCount = document.getElementById('total-count');
const timerDisplay = document.getElementById('timer-display');
const timerBar = document.getElementById('timer-bar');
const wordText = document.getElementById('word-text');
const feedbackText = document.getElementById('feedback-text');

// Results Elements
const finalScore = document.getElementById('final-score');
const finalTotal = document.getElementById('final-total');
const resultsMessage = document.getElementById('results-message');
const missedList = document.getElementById('missed-list');

// Settings
const TIME_LIMIT = 10; // seconds per question

// Variables
let quizWords = [];
let currentQuestion = 0;
let score = 0;
let missedWords = [];
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let answered = false;

// Shuffle Array (Fisher-Yates)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Start Quiz
function startQuiz() {
    quizWords = shuffleArray(words);
    currentQuestion = 0;
    score = 0;
    missedWords = [];

    totalCount.textContent = quizWords.length;
    scoreDisplay.textContent = score;

    startScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    quizScreen.style.display = 'block';

    loadQuestion();
}

// Load Question
function loadQuestion() {
    answered = false;
    feedbackText.textContent = '';

    const current = quizWords[currentQuestion];
    wordText.textContent = current.word;
    questionCount.textContent = currentQuestion + 1;

    choiceButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });

    startTimer();
}

// Timer
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = TIME_LIMIT;
    timerDisplay.textContent = timeLeft;
    timerBar.style.width = '100%';
    timerBar.classList.remove('urgent');

    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        timerBar.style.width = `${(timeLeft / TIME_LIMIT) * 100}%`;

        if (timeLeft <= 3) {
            timerBar.classList.add('urgent');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

// Handle Timeout
function handleTimeout() {
    if (answered) return;
    answered = true;

    const current = quizWords[currentQuestion];
    feedbackText.textContent = `⏰ Time's up! It was "${current.article} ${current.word}"`;

    missedWords.push(current);

    choiceButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.article === current.article) {
            btn.classList.add('correct');
        }
    });

    setTimeout(nextQuestion, 1500);
}

// Handle Answer
function handleAnswer(selectedBtn) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const current = quizWords[currentQuestion];
    const selectedArticle = selectedBtn.dataset.article;

    choiceButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.article === current.article) {
            btn.classList.add('correct');
        }
    });

    if (selectedArticle === current.article) {
        score++;
        scoreDisplay.textContent = score;
        feedbackText.textContent = `✅ Correct! "${current.article} ${current.word}"`;
    } else {
        selectedBtn.classList.add('wrong');
        feedbackText.textContent = `❌ Nope! It's "${current.article} ${current.word}"`;
        missedWords.push(current);
    }

    setTimeout(nextQuestion, 1200);
}

// Next Question
function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizWords.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show Results
function showResults() {
    clearInterval(timerInterval);

    quizScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    finalScore.textContent = score;
    finalTotal.textContent = quizWords.length;

    const percent = Math.round((score / quizWords.length) * 100);

    if (percent === 100) {
        resultsMessage.textContent = '🏆 Perfect score! You really know your articles!';
    } else if (percent >= 80) {
        resultsMessage.textContent = '🎉 Great job! Just a little more practice!';
    } else if (percent >= 50) {
        resultsMessage.textContent = '💪 Good effort! Keep practicing those articles!';
    } else {
        resultsMessage.textContent = '📚 Der, die, das take time - don\'t give up!';
    }

    displayMissedWords();
}

// Display Missed Words
function displayMissedWords() {
    missedList.innerHTML = '';

    if (missedWords.length === 0) {
        missedList.innerHTML = '<p class="no-missed">🎯 You got everything right - amazing!</p>';
        return;
    }

    missedWords.forEach(item => {
        const row = document.createElement('div');
        row.className = 'missed-item';
        row.innerHTML = `
            <span class="missed-word">${item.word}</span>
            <span class="missed-answer">${item.article} ${item.word}</span>
            <span class="missed-meaning">${item.meaning}</span>
        `;
        missedList.appendChild(row);
    });
}

// Event Listeners
startBtn.onclick = startQuiz;
restartBtn.onclick = startQuiz;

choiceButtons.forEach(btn => {
    btn.onclick = () => handleAnswer(btn);
});
