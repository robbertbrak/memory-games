"use strict";

const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const messageElement = document.getElementById("message");
const gameElement = document.getElementById("game");
const currentLevelElement = document.getElementById("current-level");
const currentScoreElement = document.getElementById("current-score");
const nextButton = document.getElementById("next-button");

let correctSequence = [];
let userSequence = [];
let currentLevel = 5;
let score = 0;
let isUsersTurn = false;

function initializeGame() {
  cells.forEach((cellNumber) => {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.setAttribute("id", `cell-${cellNumber}`);
    cell.textContent = `${cellNumber}`;
    gameElement.appendChild(cell);
    cell.addEventListener("click", handleCellClick);
  });

  nextButton.addEventListener("click", startNextGame);
}

function generateSequence(length) {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * 9) + 1,
  );
}

function handleCellClick(event) {
  if (!isUsersTurn) return;

  const cell = event.target;
  const cellNumber = parseInt(cell.textContent);

  if (userSequence.length < currentLevel) {
    userSequence.push(cellNumber);

    const isCorrect = cellNumber === correctSequence[userSequence.length - 1];
    const feedbackClass = isCorrect ? "grid-cellclicked-correct" : "grid-cellclicked-wrong";
    // Visual feedback
    cell.classList.add(feedbackClass);
    setTimeout(() => cell.classList.remove(feedbackClass), 300);

    if (!isCorrect) {
      handleWrongAnswer();
    } else if (userSequence.length === currentLevel) {
      handleCorrectAnswer();
      setTimeout(startNextGame, 1000)
    }
  }
}

function handleWrongAnswer() {
  messageElement.textContent = "Incorrect! Press Next to start the next sequence.";
  isUsersTurn = false;
  score = Math.min(score, 0) - 1;
  currentScoreElement.textContent = `${score}`;
  nextButton.classList.remove("hidden");

  setTimeout(() => {
    const cell = document.getElementById(`cell-${correctSequence[userSequence.length - 1]}`);
    cell.classList.add("grid-cellclicked-correct");
    setTimeout(() => cell.classList.remove("grid-cellclicked-correct"), 100);
  }, 200)

  if (score === -3) {
    currentLevel = Math.max(1, currentLevel - 1);
    score = 0;
    messageElement.textContent = messageElement.textContent + ` Next level: ${currentLevel}.`;
  }

}

function handleCorrectAnswer() {
  messageElement.textContent = "Correct!";
  isUsersTurn = false;
  score = Math.max(score, 0) + 1;
  currentScoreElement.textContent = `${score}`;

  if (score === 3) {
    currentLevel++;
    score = 0;
    messageElement.textContent = messageElement.textContent + ` Next level: ${currentLevel}.`;
  }
}

function startNextGame() {
  correctSequence = generateSequence(currentLevel);
  messageElement.textContent = "";
  nextButton.classList.add("hidden");
  nextButton.textContent = "Next";
  userSequence = [];
  currentLevelElement.textContent = `${currentLevel}`;
  currentScoreElement.textContent = `${score}`;

  correctSequence.forEach((cellNumber, index) => {
    setTimeout(() => {
      document
        .getElementById(`cell-${cellNumber}`)
        .classList.add("active");
      setTimeout(
        () =>
          document
            .getElementById(`cell-${cellNumber}`)
            .classList.remove("active"),
        500,
      );
    }, 700 * index);
  });
  setTimeout(() => isUsersTurn = true, 700 * correctSequence.length);
}

window.addEventListener("load", () => {
  initializeGame();
});

