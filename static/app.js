const $guessForm = $("#guess-form");
const $message = $("#message");
const $score = $("#score");
const $time = $("#time");

let score = 0;
let time = 60;
let hasStarted = false;
let hasFinished = false;

async function getGuess(e) {
    // preventDefault(e);
  e.preventDefault();

  if (!hasStarted) {
    hasStarted = true;
    timer();
  } else if (hasFinished) {
    return;
  }

  const $guess = $("#guess").val();

  const response = await axios.post("/guess", {
    guess: `${$guess}`
  });
  const { result } = response.data;

  if (result === "ok") {
    const points = $guess.length;
    score += points;
  }

  $("#guess").val("");
  $score.text(`Score: ${score}`);
  $message.text(`${$guess} is ${result}`);
}
$guessForm.on("submit", getGuess);

// function preventDefault(e) {
//   e.preventDefault();
// }

function timer() {
  // set one minute timer
  setTimeout(() => {
    $("button").attr("disabled", true);
    clearInterval(intervalID);
    hasFinished = true;
    $time.text("Done!");
  }, 60000);
  // decrement time in UI
  const intervalID = setInterval(() => {
    $time.text(`Time: ${--time}`);
  }, 1000);
}
