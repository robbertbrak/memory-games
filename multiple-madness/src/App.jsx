import React, { useState, useEffect } from "react";

function MultiplicationGame() {
  const DIFFICULTIES = [
    [1, 3],
    [1, 4],
    [1, 5],
    [2, 2],
    [2, 3],
    [3, 3],
  ]

  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [showSquares, setShowSquares] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectAnswer, setIncorrectAnswer] = useState(null);
  const [timeData, setTimeData] = useState([]);
  const [currentNumbers, setCurrentNumbers] = useState(null);
  const [showNumbers, setShowNumbers] = useState(false);
  const [inputAnswer, setInputAnswer] = useState("");
  const [timerActive, setTimerActive] = useState(0);

  const generateRandomNumber = (digits) => {
    return Math.floor(
      Math.pow(10, digits - 1) +
      Math.random() * (Math.pow(10, digits) - Math.pow(10, digits - 1)),
    );
  };

  const generateNumbers = () => {
    if (!showSquares) {
      const multiplicand = generateRandomNumber(difficulty[1]);
      const multiplier = generateRandomNumber(difficulty[0]);
      return { a: multiplicand, b: multiplier };
    } else {
      const number = generateRandomNumber(
        Math.max(difficulty[0], difficulty[1]),
      );
      return { a: number, b: number };
    }
  };

  const newQuestion = () => {
    setShowNumbers(true);
    setCurrentNumbers(generateNumbers());

    if (timerActive) clearInterval(timerActive);
    setTimerActive(setTimeout(() => {
      setShowNumbers(false)
    }, 1500));
  };

  useEffect(() => {
    newQuestion();
  }, [difficulty, showSquares]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentNumbers) return;

    if (inputAnswer.trim() === "") {
      return;
    }

    const correctAnswer = currentNumbers.a * currentNumbers.b;
    const timeElapsed = Date.now() - new Date(timeData[timeData.length - 1]);


    if (parseInt(inputAnswer) === correctAnswer) {
      setCorrectCount((prev) => prev + 1);
      setIncorrectAnswer(null);
    } else {
      setIncorrectCount((prev) => prev + 1)
      setIncorrectAnswer(correctAnswer);
    }

    const newTimeData = [...timeData];
    newTimeData.push(Date.now());
    setTimeData(newTimeData);

    setInputAnswer("");
    setShowNumbers(false);
    newQuestion();
  };

  const calculateAverageTime = () => {
    if (timeData.length < 2) return 0;
    const times = timeData
      .slice(-20)
      .map((time, index) => timeData[index + 1] - time);
    return Math.round(
      times.reduce((acc, curr) => acc + curr, 0) / times.length,
    );
  };

  return (
    <div className="container">
      <h1>Multiple Madness</h1>

      <div className="options">
        <div>
          {DIFFICULTIES.map((values, index) => (
            <button
              key={`${values[0]}x${values[1]}`}
              onClick={() => setDifficulty(values)}
              className={difficulty === values ? "active" : ""}>
              {values[0]}{'x'}{values[1]}
            </button>
            ))}
        </div>

        <button
          onClick={() => setShowSquares(!showSquares)}
          className={showSquares ? "active" : ""}
        >
          Show Squares
        </button>
      </div>

      {currentNumbers && (
        <>
          <div className="numbers" style={{ visibility: showNumbers ? "visible" : "hidden" }}>
            <h2>{currentNumbers.a}</h2>
            <h2>×</h2>
            <h2>{currentNumbers.b}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              placeholder="Enter answer here..."
            />
            <button type="submit">Check Answer</button>
          </form>
        </>
      )}

      {timeData.length > 0 && (
        <>
          <div className="stats">
            {incorrectAnswer && <p>Incorrect! The answer was: <span>{incorrectAnswer}</span></p>}
            <p>
              Correct Answers (last 20): {correctCount}/
              {Math.min(timeData.length, 20)}
            </p>
            <p>Average Time: {calculateAverageTime()}ms</p>
          </div>
        </>
      )}
    </div>
  );
}

export default MultiplicationGame;
