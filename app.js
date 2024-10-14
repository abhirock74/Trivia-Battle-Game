let player1 = '';
let player2 = '';
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let currentQuestionIndex = 0;
let questions = [];
let selectedCategory = '';

const API_BASE_URL = 'https://the-trivia-api.com/api';

/**
 * Start Game: Capture player names and move to category selection.
 */
function startGame() {
  player1 = document.getElementById('player1').value.trim();
  player2 = document.getElementById('player2').value.trim();

  if (!player1 || !player2) {
    alert('Please enter names for both players.');
    return;
  }

  document.getElementById('player-setup').style.display = 'none';
  document.getElementById('category-selection').style.display = 'block';
  fetchCategories();
}

/**
 * Fetch available trivia categories from API.
 */
async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  const categories = await response.json();

  const dropdown = document.getElementById('category-dropdown');
  dropdown.innerHTML = Object.entries(categories)
    .map(([key, value]) => `<option value="${key}">${value}</option>`)
    .join('');
}

/**
 * Fetch questions based on selected category and difficulty.
 */
async function fetchQuestions() {
  selectedCategory = document.getElementById('category-dropdown').value;
  const difficulties = ['easy', 'medium', 'hard'];
  questions = [];

  for (const difficulty of difficulties) {
    const response = await fetch(
      `${API_BASE_URL}/questions?categories=${selectedCategory}&limit=2&difficulty=${difficulty}`
    );
    const data = await response.json();
    questions = questions.concat(data);
  }

  document.getElementById('category-selection').style.display = 'none';
  document.getElementById('question-section').style.display = 'block';
  displayQuestion();
}

/**
 * Display the current question and answers.
 */
function displayQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('player-turn').innerText = 
    `Current Turn: ${currentPlayer === 1 ? player1 : player2}`;
  document.getElementById('question-text').innerText = question.question;

  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = question.incorrectAnswers
    .concat(question.correctAnswer)
    .sort(() => Math.random() - 0.5) // Shuffle answers
    .map(answer => 
      `<button class="btn btn-outline-secondary" onclick="checkAnswer('${answer}')">${answer}</button>`
    ).join('');
}

/**
 * Check if the selected answer is correct and update score.
 */
function checkAnswer(selectedAnswer) {
  const question = questions[currentQuestionIndex];

  if (selectedAnswer === question.correctAnswer) {
    const points = getPointsForDifficulty(question.difficulty);
    scores[currentPlayer] += points;
    alert('Correct! +' + points + ' points');
  } else {
    alert('Wrong answer!');
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    displayQuestion();
  } else {
    endGame();
  }
}

/**
 * Get points based on difficulty.
 */
function getPointsForDifficulty(difficulty) {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 15;
    case 'hard': return 20;
    default: return 0;
  }
}

/**
 * End the game and display the final score.
 */
function endGame() {
  document.getElementById('question-section').style.display = 'none';
  document.getElementById('game-end').style.display = 'block';

  const resultText = `
    ${player1}: ${scores[1]} points<br>
    ${player2}: ${scores[2]} points<br><br>
    ${getWinnerMessage()}
  `;
  document.getElementById('final-score').innerHTML = resultText;
}

/**
 * Determine the winner.
 */
function getWinnerMessage() {
  if (scores[1] > scores[2]) {
    return `${player1} wins! 🎉`;
  } else if (scores[2] > scores[1]) {
    return `${player2} wins! 🎉`;
  } else {
    return "It's a draw! 🤝";
  }
}

/**
 * Reset the game to play again.
 */
function resetGame() {
  scores = { 1: 0, 2: 0 };
  currentQuestionIndex = 0;
  currentPlayer = 1;
  questions = [];

  document.getElementById('game-end').style.display = 'none';
  document.getElementById('player-setup').style.display = 'block';
}
