let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let modeButtons = document.querySelectorAll(".modes .btn");
let cycleCounter = document.getElementById("cycleCounter");

let timeLeft = 25 * 60;
let timerInterval;
let currentMode = "focus";
let focusCount = 0;

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function updateCircle() {
  let total = currentMode === "focus" ? 25*60 : currentMode === "short" ? 5*60 : 15*60;
  let percent = 100 - (timeLeft / total) * 100;
  let degrees = (percent / 100) * 360;
  document.getElementById("circle").style.background =
    `conic-gradient(var(--accent) ${degrees}deg, #ddd ${degrees}deg)`;
}

function updateProgress() {
  let total = currentMode === "focus" ? 25*60 : currentMode === "short" ? 5*60 : 15*60;
  let percent = 100 - (timeLeft / total) * 100;
  document.getElementById("progress").style.width = percent + "%";
}

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent =
    `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
  updateCircle();
  updateProgress();
}

function updateCycleCounter() {
  cycleCounter.textContent = `Ciclo ${focusCount}/4`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);

      let audio = new Audio("audio/universfield-new-notification-09-352705.mp3");
      audio.play();

      let message = "";
      if (currentMode === "focus") message = "Seu tempo de foco terminou!";
      if (currentMode === "short") message = "Hora de voltar ao foco!";
      if (currentMode === "long") message = "Pausa longa concluída, vamos recomeçar!";

      if (Notification.permission === "granted") {
        new Notification("Pomodoro", {
          body: message,
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
        });
      } else {
        alert(message);
      }

      if (currentMode === "focus") {
        focusCount++;
        updateCycleCounter();

        if (focusCount >= 4) {
          currentMode = "long";
          timeLeft = 15 * 60;
          focusCount = 0;
        } else {
          currentMode = "short";
          timeLeft = 5 * 60;
        }
      } else {
        currentMode = "focus";
        timeLeft = 25 * 60;
      }

      updateDisplay();
      startTimer();
    }
  }, 1000);
}

startBtn.addEventListener("click", startTimer);

modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    modeButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;

    if (currentMode === "focus") timeLeft = 25 * 60;
    if (currentMode === "short") timeLeft = 5 * 60;
    if (currentMode === "long") timeLeft = 15 * 60;

    updateDisplay();
    clearInterval(timerInterval);
  });
});

let addTaskBtn = document.getElementById("addTask");
let taskInput = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() !== "") {
    let li = document.createElement("li");

    let taskSpan = document.createElement("span");
    taskSpan.textContent = taskInput.value;

    taskSpan.addEventListener("click", () => {
      taskSpan.classList.toggle("done");
    });

    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
    });

    li.appendChild(taskSpan);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
    taskInput.value = "";
  }
});

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

const quotes = [
  { text: "A inspiração existe, mas precisa te encontrar trabalhando.", author: "Stephen King" },
  { text: "Disciplina é liberdade.", author: "Jocko Willink" },
  { text: "Pequenos progressos diários levam a grandes resultados.", author: "" },
  { text: "Persistência supera talento quando o talento não persiste.", author: "" }
];

function rotateQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteText").textContent = quotes[random].text;
  document.getElementById("quoteAuthor").textContent = quotes[random].author ? `- ${quotes[random].author}` : "";
}

function updateProgress() {
  let total = currentMode === "focus" ? 25 * 60 : currentMode === "short" ? 5 * 60 : 15 * 60;
  let percent = 100 - (timeLeft / total) * 100;
  document.getElementById("progress").style.width = percent + "%";
}

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent =
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  updateProgress();
}

function setCardBackground() {
  const card = document.getElementById("pomodoroCard");
  card.classList.remove("focus", "short", "long");
  card.classList.add(currentMode);
}

// Ao terminar ciclo
function endCycle() {
  rotateQuote();
  setCardBackground();
}

updateDisplay();
updateCycleCounter();
