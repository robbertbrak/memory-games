"use strict";

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']; //, 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let sequence = [];
let currentLevel = 1;
let score = 0;
let isUsersTurn = false;
const nextLevelThreshold = 20;

const startButtonElement = document.getElementById('start-button');
const lettersDisplayElement = document.getElementById('letters-display');
const currentLevelElement = document.getElementById('current-level');
const currentScoreElement = document.getElementById('current-score');
const feedbackElement = document.getElementById("feedback");
const answerContainerElement = document.getElementById("answer-grid");
currentLevelElement.value = currentLevel;

window.addEventListener("load", () => {
  startButtonElement.onclick = startGame;
  currentLevelElement.onchange = (e) => {
    currentLevel = Math.max(parseInt(e.target.value.toString()), 1);
    feedbackElement.textContent = "";
    nextLevel();
  };

  alphabet.forEach(letter => {
    let answerButton = document.createElement("button");
    answerButton.textContent = letter;
    answerButton.onclick = e => checkAnswer(e.target.textContent)
    answerContainerElement.appendChild(answerButton);
  })
});

function checkAnswer(userAnswer) {
  if (!isUsersTurn) {
    return;
  }

  isUsersTurn = false;

  let expectedAnswer = sequence[sequence.length - currentLevel - 1];
  let isCorrect = expectedAnswer === userAnswer;
  if (isCorrect) {
    feedbackElement.textContent = "";
    score = Math.max(score, 0) + 1;
  } else {
    feedbackElement.textContent = `Wrong! The correct answer was ${expectedAnswer}. Click to start a new game.`;
    lettersDisplayElement.textContent = "";
  }

  currentScoreElement.textContent = `${score}`;

  if (score === nextLevelThreshold) {
    currentLevel++;
    feedbackElement.textContent = "Nice!";
    nextLevel();
  } else if (isCorrect) {
    nextLetter();
  } else {
    startButtonElement.style.visibility = "visible";
  }
}

function nextLevel() {
  score = 0;
  feedbackElement.textContent += " The next level will be " + currentLevel + ".";
  startButtonElement.style.visibility = "visible";
}

function nextLetter() {
  const letter = getRandomLetter();

  function showNextLetter() {
    sequence.push(letter);
    lettersDisplayElement.textContent = letter;
    awaitUserInput();
  }

  if (letter === sequence[sequence.length - 1]) {
    lettersDisplayElement.textContent = "";
    setTimeout(showNextLetter, 200);
  } else {
    showNextLetter();
  }
}

function awaitUserInput() {
  isUsersTurn = true;
}

async function showLetter(letter, timeout = 1000) {
  lettersDisplayElement.textContent = letter;
  await new Promise(resolve => setTimeout(resolve, timeout));
}

async function startGame() {
  sequence = [];
  score = 0;
  currentLevelElement.value = currentLevel;
  currentScoreElement.textContent = `${score}`;
  startButtonElement.style.visibility = "hidden";

  for (let i = 0; i < currentLevel; i++) {
    sequence.push(getRandomLetter());
    await showLetter(sequence[sequence.length - 1]);
  }

  nextLetter();
}

function getRandomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}
