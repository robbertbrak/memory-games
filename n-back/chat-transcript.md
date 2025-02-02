


Create a pure Javascript version of the 3-back game. In this game, you are shown a sequence of letters, one after the other. Starting from the fourth letter, the user has to type the letter that was shown 3 positions earlier in the sequence. For example, if the sequence so far was B-A-C-A, then the user has to type B. After typing the letter, show an indication whether it was correct or wrong and show the next letter. Continuing the example, suppose the next letter is D. The user has to type A, because in the sequence B-A-C-A-D, the letter A was shown 3 positions earlier. If the user has 25 correct answers in a row, the game advances to the next level, where the user has to type the letter 4 positions earlier, i.e. in the sequence B-A-C-A-D, the correct answer is B.

<think>
Okay, so I need to create a pure JavaScript version of the 3-back game. Let me think about how to approach this.

First, I'll start by understanding the game mechanics. The game shows a sequence of letters one after another. Starting from the fourth letter, the user has to type the letter that was shown three positions earlier. For example, if the sequence is B-A-C-A, the user needs to type B because it's three back from A.

As the user progresses, if they get 25 correct answers in a row, the game advances to the next level. In this case, instead of looking back three letters, they look back four. So, for instance, with the sequence B-A-C-A-D, the correct answer would be B because it's four positions back from D.

I'll need to structure the game with increasing levels where each level increases the number of positions the user needs to look back by one. Each level starts after 25 correct answers in the previous level.

Next, I'll outline the steps needed:

1. **Game Structure**: The game will have multiple levels. Each level tracks the current sequence and requires looking back a certain number of positions (initially 3, then 4, etc.).

2. **User Interaction**: After each letter is displayed starting from the fourth, the user inputs their answer. The game checks if it's correct.

3. **Feedback System**: After each input, display whether the answer was correct or wrong. Also, show the next letter after a slight delay to keep the sequence moving smoothly.

4. **Progression to Next Level**: Track consecutive correct answers. Once 25 corrects are achieved, increment the look-back position and reset the counter.

Now, breaking it down into components:

- **HTML Elements**:
  - A container for letters display.
  - An input field for user input.
  - A feedback area (correct/wrong).
  - Buttons to start or reset the game.

- **JavaScript Variables**:
  - `letters` array: Holds the sequence of letters displayed so far.
  - `currentLevel`: Tracks the current look-back position (starts at 3, increases by 1 every 25 corrects).
  - `correctCount`: Counts consecutive correct answers to track when a level is completed.

- **Functions**:
  - `addLetter()`: Adds a new letter to the sequence and checks if it's time to show the user input.
  - `checkAnswer()`: Verifies if the user's input matches the expected letter.
  - Handles adding letters, checking answers, updating the UI, and managing levels.

I'll need to initialize the game with some starting letters (like A, B, C) and then proceed to add new letters. Each time a letter is added beyond the third, the user can input their answer, which will be checked against the appropriate previous letter based on the current level's look-back position.

For example, in level 1, they look back 3 letters; after 25 corrects, level 2 requires looking back 4, and so on.

I should also consider the user interface. Letters need to be displayed one by one with a slight delay (maybe 500ms) between each to simulate a sequence. After each letter beyond the third, an input field can appear for the user to type their answer, followed by feedback after submission.

Testing is crucial here. I should ensure that:

- The initial letters are displayed correctly.
- User input triggers the check function and updates the UI accordingly.
- After 25 corrects, the level increases, and the look-back changes.
- The game resets properly on a wrong answer or when the user wants to restart.

Potential issues to consider:

- Timing: Ensuring that each letter appears with a delay, and after the third letter, the input is ready.
- Input handling: Only allowing one character and immediately checking against the expected letter.
- Level progression: Correctly incrementing the level after 25 corrects without resetting the sequence.

I'll structure the code step by step. Start by setting up the HTML structure with necessary elements. Then initialize variables in JavaScript, set up event listeners for input submission. Implement functions to add letters, check answers, update UI, and manage levels.

As I write each part, I'll test it in the browser to ensure everything works as expected. For example, starting with level 1, after adding the fourth letter, the user should see an input field and provide the third-back letter. If correct, the count increases; else, reset.

Once the initial functionality is working, I can enhance it by adding transitions between levels and making sure the feedback is clear and timely.

In summary, the key steps are setting up the structure, handling each part of the game loop (add letters, check input, give feedback), managing level progression based on correct answers, and ensuring smooth UI interactions.
</think>

Here's a pure JavaScript implementation of the 3-back game:

```html
<!DOCTYPE html>
<html>
<head>
    <title>3-Back Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
            background-color: #f0f0f0;
        }

        #gameContainer {
            max-width: 600px;
            margin: 0 auto;
        }

        #lettersDisplay {
            width: 100%;
            height: 200px;
            border: 2px solid #333;
            padding: 20px;
            font-size: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
        }

        #userInput {
            font-size: 24px;
            width: 100px;
            padding: 5px;
            margin: 20px auto;
        }

        #feedback {
            font-size: 36px;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
            min-height: 40px;
        }

        #levelIndicator {
            font-size: 24px;
            text-align: center;
            margin: 10px;
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <div id="levelIndicator">Level: 1</div>
        <div id="lettersDisplay"></div>
        <input type="text" id="userInput" maxlength="1">
        <div id="feedback"></div>
        <button onclick="addLetter()">Next Letter</button>
        <button onclick="resetGame()">Reset Game</button>
    </div>

    <script>
        let letters = ['A', 'B', 'C'];
        let currentLevel = 1;
        let correctCount = 0;
        let feedbackTimeout;

        function updateDisplay() {
            const display = document.getElementById('lettersDisplay');
            display.innerHTML = letters.slice(-4).join(' ');

            // Clear previous feedback
            clearTimeout(feedbackTimeout);
            document.getElementById('feedback').textContent = '';

            // Show input after delay for better UX
            setTimeout(() => {
                if (letters.length >= currentLevel + 2) {
                    showInput();
                }
            }, 500);
        }

        function showInput() {
            const userInput = document.getElementById('userInput');
            userInput.value = '';
            userInput.focus();
        }

        function checkAnswer(letter) {
            let expectedIndex = letters.length - 1 - currentLevel;

            if (expectedIndex >= 0 && letter.toUpperCase() === letters[expectedIndex]) {
                document.getElementById('feedback').textContent = 'Correct!';
                correctCount++;

                // Check if we've reached the next level threshold
                if (correctCount === 25) {
                    currentLevel++;
                    correctCount = 0;
                    document.getElementById('levelIndicator').textContent = `Level: ${currentLevel}`;
                }

            } else {
                document.getElementById('feedback').textContent = 'Wrong!';
                correctCount = 0;
            }

            // Hide input after feedback
            setTimeout(() => {
                const userInput = document.getElementById('userInput');
                userInput.style.display = 'none';
            }, 1500);
        }

        function addLetter() {
            if (letters.length < currentLevel + 2) {
                letters.push(getRandomLetter());
                updateDisplay();
            }

            const userInput = document.getElementById('userInput');
            if (userInput.value && letters.length >= currentLevel + 3) {
                checkAnswer(userInput.value);
                userInput.style.display = 'none';
                document.getElementById('feedback').textContent = '';
            }
        }

        function getRandomLetter() {
            return ['A', 'B', 'C', 'D'].[Math.floor(Math.random() * 4)];
        }

        function resetGame() {
            letters = ['A', 'B', 'C'];
            currentLevel = 1;
            correctCount = 0;
            document.getElementById('levelIndicator').textContent = `Level: ${currentLevel}`;
            updateDisplay();
        }

        // Initialize the game
        updateDisplay();

        // Handle user input
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const letter = e.target.value.toUpperCase();
                checkAnswer(letter);
            }
        });
    </script>
</body>
</html>
```

This implementation includes:

1. A clean UI with clear feedback
2. Increasing levels of difficulty:
   - Level 1: Remember 3 letters back
   - Level 2: Remember 4 letters back, etc.
3. Features:
   - Random letter generation
   - Visual feedback for correct/wrong answers
   - Next letter button to manually progress through the game
   - Reset button to start over
   - Counter for consecutive correct answers
   - Level indicator

To play the game:

1. Click "Next Letter" to add letters to the sequence
2. When prompted, type the required letter from memory (3 positions back initially)
3. Keep track of your score and level up after 25 consecutive correct answers
4. The feedback will show if your answer was correct or wrong
5. If you make a mistake, the game resets your correct count

The game is completely pure JavaScript with HTML and CSS for presentation. It's easy to customize the styling by modifying the CSS section to match your preferences.
