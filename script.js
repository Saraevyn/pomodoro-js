let timerDisplay = document.getElementById("timer");
let startBtn = document.getElementById("startBtn");
let modeButtons = document.querySelectorAll(".modes .btn");

let timeLeft = 25 * 60;
let timerInterval;
let currentMode = "focus";
let focusCount = 0;

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent =
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);

      let audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
      audio.play();

      if (Notification.permission === "granted") {
        new Notification("Pomodoro", {
          body: "Seu tempo de foco terminou!",
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827504.png"
        });
      } else {
        alert("Tempo acabou!");
      }

      if (currentMode === "focus") {
        focusCount++;
        if (focusCount >= 4) {
          currentMode = "long";
          timeLeft = 15 * 60;
          focusCount = 0;
        } else {
          currentMode = "short";
          timeLeft = 5 * 60;
        }
        updateDisplay();
      }
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

updateDisplay();
