function checkAnswer(level) {
  const answers = {
    1: ["chleba s rajcetem", "chléb s rajčetem", "chleba s rajčetem", "chlebík a rajčátko"],
    2: ["brno", "v brně", "brně", "do brna", "V Brně", "V brně"],
    3: ["slovní fotbal", "fotbal", "slovní", "slovní hra", "hra na slova"],
    4: ["lilek", "baklažán", "ten lilek", "kus lilku","Lilek"],
    6: ["Na tady máš chlapáku", "na tady mas chlapaku"],
    7: ["úniková místnost", "uniková místnost", "escape room", "escape", "room", "ta únikovka", "Únikovou místnost", "úniková místnost", "Únikovou Místnost"],
    8: ["prezentaci", "prezentace", "udělat prezentaci", "slíbila jsem ti prezentaci"],
    9: ["arkády", "levels", "V arkádách", "Arkády"],
  };
  const input = document.getElementById("answer" + level).value.toLowerCase().trim();
  const lock = document.getElementById("lock" + level);

  if (answers[level].includes(input)) {
    lock.textContent = "🔓";
    const feedbackEl = document.getElementById("answer-feedback" + level);
    if (feedbackEl) {
      feedbackEl.textContent = "✔️ Správná odpověď!";
      feedbackEl.classList.add("correct-feedback");
      feedbackEl.style.color = "limegreen";
      feedbackEl.style.fontWeight = "bold";
    }
    setTimeout(() => {
      const momentCard = document.getElementById("moment" + level);
      if (momentCard) {
        const currentCard = document.getElementById("level" + level);
        currentCard.classList.remove("active");
        momentCard.classList.add("active");
      } else {
        flashTransition(level);
      }
      // --- Zobrazit tlačítko Pokračovat místo automatického přechodu ---
      if (momentCard) {
        const continueBtn = document.createElement("button");
        continueBtn.textContent = "➡️ Pokračovat";
        continueBtn.className = "continue-btn";
        continueBtn.onclick = () => {
          momentCard.classList.remove("active");
          const nextLevel = document.getElementById("level" + (level + 1));
          if (nextLevel) nextLevel.classList.add("active");
          continueBtn.remove();
        };
        momentCard.appendChild(continueBtn);
      }
    }, 1000);
  } else {
    lock.textContent = "❌";
    setTimeout(() => lock.textContent = "🔒", 1500);
  }
}

function flashTransition(current) {
  const flash = document.createElement("div");
  flash.classList.add("flash-overlay");
  document.body.appendChild(flash);

  setTimeout(() => {
    flash.classList.add("visible");
  }, 10);

  setTimeout(() => {
    goToNextLevel(current);
    flash.classList.remove("visible");
  }, 700);

  setTimeout(() => {
    flash.remove();
  }, 1500);
}

function goToNextLevel(current) {
  const currentCard = document.getElementById("level" + current);
  const nextCard = document.getElementById("level" + (current + 1));
  if (nextCard) {
    currentCard.classList.remove("active");
    nextCard.classList.add("active");
  } else {
    showFinale();
  }
}

function startGame() {
  const intro = document.getElementById("intro");
  const level1 = document.getElementById("level1");
  intro.classList.remove("active");

  // Spuštění hudby při startu hry
  const music = document.getElementById("background-music");
  if (music && music.paused) {
    music.play().catch(() => {});
  }

  setTimeout(() => {
    level1.classList.add("active");
  }, 300);
}

const music = document.getElementById("background-music");
const musicToggle = document.getElementById("toggle-music");

if (music && musicToggle) {
  music.volume = 0.5;
  musicToggle.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch((e) => console.warn("Autoplay blokován:", e));
      musicToggle.textContent = "🔊 Hudba";
    } else {
      music.pause();
      musicToggle.textContent = "🔇 Hudba";
    }
  });
}

function showFinale() {
  const currentCard = document.querySelector(".card.active");
  if (currentCard) currentCard.classList.remove("active");

  const finale = document.getElementById("finale");
  finale.classList.add("active");
}

function unlockLevel(n) {
  const lock = document.getElementById("lock" + n);
  if (lock) lock.textContent = "🔓";
}


function downloadCertificate() {
  const cert = document.getElementById("certificate");
  html2canvas(cert).then(canvas => {
    const link = document.createElement("a");
    link.download = "certifikat_kristyna.png";
    link.href = canvas.toDataURL();
    link.click();
    document.getElementById("after-download").classList.add("show");
  });
}

function checkMemoryOrder() {
  const items = document.querySelectorAll("#memory-quiz li");
  const feedback = document.getElementById("memory-feedback");
  let correct = true;

  items.forEach(item => {
    const select = item.querySelector("select");
    const expected = select.dataset.order;
    const actual = select.value;
    if (expected !== actual) {
      correct = false;
    }
  });

  if (correct) {
    feedback.textContent = "🎉 Skvělé! Paměť tě nezklamala.";
    unlockLevel(5);
    const nextButton = document.getElementById("next-level5-btn");
    if (nextButton) {
      nextButton.classList.remove("hidden");
      nextButton.onclick = () => {
        flashTransition(5);
      };
    }
  } else {
    feedback.textContent = "❌ Skoro! Zkus si vzpomenout znovu 💡";
  }
}

// ===== Minihra – sbírání srdíček (Level 10) =====
let heartsTimer = null;
let heartsSpawnInterval = null;
let heartsTimeLeft = 20;
let heartsScore = 0;
const HEARTS_GOAL = 23;

function startHeartsGame() {
  const area = document.getElementById('hearts-area');
  const timerEl = document.getElementById('hearts-timer');
  const scoreEl = document.getElementById('hearts-score');
  const feedback = document.getElementById('hearts-feedback');
  const startBtn = document.getElementById('hearts-start-btn');
  const nextBtn = document.getElementById('next-level10-btn');

  if (!area || !timerEl || !scoreEl) {
    console.warn('Level10 elements missing');
    return;
  }

  // jistota správného kontextu
  area.style.position = 'relative';

  // reset
  area.innerHTML = '';
  heartsTimeLeft = 20;
  heartsScore = 0;
  timerEl.textContent = heartsTimeLeft;
  scoreEl.textContent = heartsScore;
  feedback.textContent = '';
  nextBtn.classList.add('hidden');

  clearInterval(heartsTimer);
  clearInterval(heartsSpawnInterval);

  startBtn.disabled = true;

  // spawn srdíček
  heartsSpawnInterval = setInterval(() => spawnHeart(area), 600);

  // odpočet
  heartsTimer = setInterval(() => {
    heartsTimeLeft--;
    timerEl.textContent = heartsTimeLeft;
    if (heartsTimeLeft <= 0) {
      clearInterval(heartsTimer);
      clearInterval(heartsSpawnInterval);
      endHeartsGame();
    }
  }, 1000);
}

function spawnHeart(area) {
  const heart = document.createElement('div');
  heart.className = 'heart-click';
  heart.textContent = '💖';
  heart.style.pointerEvents = 'auto';
  heart.style.zIndex = 5;

  const maxX = area.offsetWidth - 32;
  const maxY = area.offsetHeight - 32;
  const x = Math.floor(Math.random() * (maxX > 0 ? maxX : 1));
  const y = Math.floor(Math.random() * (maxY > 0 ? maxY : 1));
  heart.style.left = x + 'px';
  heart.style.top = y + 'px';

  heart.onclick = () => {
    heartsScore++;
    const scoreEl = document.getElementById('hearts-score');
    if (scoreEl) scoreEl.textContent = heartsScore;
    heart.remove();
    if (heartsScore >= HEARTS_GOAL) {
      clearInterval(heartsTimer);
      clearInterval(heartsSpawnInterval);
      endHeartsGame(true);
    }
  };

  area.appendChild(heart);
  setTimeout(() => heart.remove(), 1800);
}

function endHeartsGame(winEarly = false) {
  clearInterval(heartsTimer);
  clearInterval(heartsSpawnInterval);

  const feedback = document.getElementById('hearts-feedback');
  const startBtn = document.getElementById('hearts-start-btn');
  const nextBtn = document.getElementById('next-level10-btn');

  startBtn.disabled = false;

  if (heartsScore >= HEARTS_GOAL) {
    feedback.textContent = '🎉 Krása! Máš všechna srdíčka!';
    unlockLevel(10);
    nextBtn.classList.remove('hidden');
    nextBtn.onclick = () => {
      flashTransition(10);
    };
  } else {
    feedback.textContent = '❌ Ještě to zkus! Chce to víc lásky 💘';
  }
}