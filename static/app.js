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

  if (guesses.has($guess)) {
    $message.text(`${$guess} has already been guessed!`);
    $("#guess").val("");
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
  const wordClass = result
  updateUI(score, $guess, wordClass);
}
$guessForm.on("submit", getGuess);

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
  $guessedWordsUl.append(`<li class="${wordClass}">${guess}</li>`);
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
