// JQuery constants
const $guessForm = $("#guess-form");
const $newGameForm = $("#new-game-form").toggle();
const $guessedWordsContainer = $("#guessed-words-container");
const $guessedWordsUl = $("#guessed-words");
const $message = $("#message");
const $score = $("#score");
const $highscore = $("#highscore");
const $time = $("#time");
const $submitBtn = $("#submit-guess");
const $startBtn = $("#submit-start");

// JS variables
const guesses = new Set();
let score = 0;
let highscore = 0;
let time = 60;
let hasStarted = false;
let hasFinished = false;

/* Handles guess form submission */
async function getGuess(e) {
  e.preventDefault();

  //  Conditional logic handles cases where the game has not started or has finished
  if (!hasStarted) {
    hasStarted = true;
    startGame();
  } else if (hasFinished) {
    return;
  }

  const $guess = $("#guess").val().toLowerCase();

  if (!isValid($guess)) {
    return;
  }

  guesses.add($guess);

  const response = await axios.post("/guess", {
    guess: `${$guess}`,
  });

  const { result } = response.data;

  if (result === "ok") {
    const points = $guess.length;
    score += points;
  }
  $message.text(`${$guess} is ${result}`);
  const wordClass = result;
  updateUI(score, $guess, wordClass);
}
$guessForm.on("submit", getGuess);

function isValid(guess) {
  const isBlank = guess === "";
  const isPlural = guess.includes(" ");
  const hasBeenGuessed = guesses.has(guess);
  console.log(isBlank, isPlural);
  if (isBlank || isPlural) {
    $message.text("Your guess cannot contain spaces");
    $("#guess").val("");
    return false;
  } else if (hasBeenGuessed) {
    $message.text(`${guess} has already been guessed!`);
    $("#guess").val("");
    return false;
  }
  return true
}

function startGame() {
  const intervalID = setInterval(() => {
    $time.text(`Time: ${--time}`);
    if (time <= 0) {
      clearInterval(intervalID);
      endGame();
    }
  }, 1000);
}

function updateUI(score, guess, wordClass) {
  $("#guess").val("");
  $score.text(`Score: ${score}`);
  $guessedWordsUl.append(`<li class="${wordClass} guess">${guess}\n</li>`);
}

function endGame() {
  $time.text("Done!");
  hasFinished = true;

  $guessForm.toggle();
  $newGameForm.toggle();
  getHighscore();

  if (score > highscore) {
    highscore = score;
  }
  $highscore.text(`Highscore: ${highscore}`);
  $score.text("Score: 0");
}

async function getHighscore() {
  const response = await axios.post("/finished", {
    currentScore: `${score}`,
  });

  return response;
}
