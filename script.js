const data = {
  cyclesRemaining: 3,
  intervals: [60],
  interval: null,
  currentIntervals: [],
};

const beep = new Audio("casio-chime.wav");

function displayTime() {
  const minutes = Math.floor(data.currentIntervals.at(-1) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (data.currentIntervals.at(-1) % 60)
    .toString()
    .padStart(2, "0");

  document.querySelector("#display").textContent = `${minutes}:${seconds}`;
}

function displayCycles() {
  document.querySelector("#cyclesRemaining").textContent = data.cyclesRemaining
    .toString()
    .padStart(2, "0");
}

async function updateTimer() {
  if (data.currentIntervals.at(-1) !== 0) {
    data.currentIntervals[data.currentIntervals.length - 1]--;
    displayTime();
    return;
  }

  await beep.play();

  data.currentIntervals.pop();
  displayTime();

  if (data.currentIntervals.length !== 0) {
    return;
  }

  if (data.cyclesRemaining !== 0) {
    data.currentIntervals = [...data.intervals].reverse();
    data.cyclesRemaining--;
    displayCycles();
    displayTime();
    return;
  }

  toggleTimer();
  resetTimer();
  displayCycles();
  displayTime();

  await beep.play();
  await new Promise((r) => setTimeout(r, 1000));
  await beep.play();
  await new Promise((r) => setTimeout(r, 1000));
  await beep.play();
  await new Promise((r) => setTimeout(r, 1000));
}

function toggleTimer() {
  if (!data.interval) {
    data.interval = setInterval(updateTimer, 1000);
    return;
  }

  clearInterval(data.interval);
  data.interval = null;
}

function resetTimer() {
  const preset = new URLSearchParams(window.location.search).get("preset");
  if (preset) {
    const [cycles, rest] = preset.split("x");
    data.cyclesRemaining = parseInt(cycles) - 1;
    data.intervals = rest.split("-").map(Number);
  }
  data.currentIntervals = [...data.intervals].reverse();
}

resetTimer();
displayTime();
displayCycles();

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    toggleTimer();
  }
});
