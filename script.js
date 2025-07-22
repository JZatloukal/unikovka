function checkAnswer(level) {
  const answers = {
    1: ["chleba s rajcetem", "chléb s rajčetem", "chleba s rajčetem"],
    2: ["brno", "v brně", "brně", "do brna"],
    3: ["slovní fotbal", "fotbal", "slovní", "slovní hra", "hra na slova"],
    4: ["lilek", "baklažán", "ten lilek", "kus lilku"],
    5: ["na tady máš chlapáku"],
    6: ["úniková místnost", "uniková místnost", "escape room", "escape", "room", "ta únikovka"],
    7: ["prezentaci", "prezentace", "udělat prezentaci", "slíbila jsem ti prezentaci"],
    8: ["arkády", "levels", "V arkádách"],
  };
  const input = document.getElementById("answer" + level).value.toLowerCase().trim();
  const lock = document.getElementById("lock" + level);

  if (answers[level].includes(input)) {
    lock.textContent = "🔓";
    setTimeout(() => flashTransition(level), 1000);
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

music.volume = 0.5;
musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play().catch((e) => {
      console.warn("Autoplay blokován:", e);
    });
    musicToggle.textContent = "🔊 Hudba";
  } else {
    music.pause();
    musicToggle.textContent = "🔇 Hudba";
  }
});

function showFinale() {
  const currentCard = document.querySelector(".card.active");
  if (currentCard) currentCard.classList.remove("active");

  const finale = document.getElementById("finale");
  finale.classList.add("active");
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
