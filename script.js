// ---------- MUSIC ----------
const enterBtn = document.getElementById("enterBtn");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

enterBtn.addEventListener("click", () => {
  music.play().catch(() => {});
  musicToggle.classList.add("visible");
  musicToggle.textContent = "♪";
  document.body.classList.remove("no-scroll");
  document.querySelector(".intro").scrollIntoView({ behavior: "smooth" });
});

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play().catch(() => {});
    musicToggle.textContent = "♪";
  } else {
    music.pause();
    musicToggle.textContent = "✕";
  }
});

// ---------- SEEDED ROTATION (stable across reloads) ----------
function seededAngle(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  const frac = x - Math.floor(x);
  return (frac * 10 - 5).toFixed(2); // -5deg .. 5deg
}

// ---------- GALLERY ----------
const gallery = document.getElementById("galleryGrid");
const totalPhotos = 46; // change if you add/remove photos
const photoPaths = [];

for (let i = 1; i <= totalPhotos; i++) {
  photoPaths.push(`assets/photos/${i}.webp`);
}

// small thematic cards, scattered between photos — edit freely
const wordPetals = [
  { bn: "বাঁশি", en: "the sound of a flute", icon: "♪" },
  { bn: "এসরাজ", en: "esraj, playing softly", icon: "♫" },
  { bn: "সূর্যমুখী", en: "sunflowers, always turning", icon: "❀" },
  { bn: "চাঁদ", en: "moonlight", icon: "☾" },
  { bn: "নদী", en: "a river, unhurried", icon: "≈" },
  { bn: "কবিতা", en: "the poems only she recites", icon: "✒" },
  { bn: "খেলনা", en: "little toys", icon: "✦" },
  { bn: "রবীন্দ্রনাথ", en: "Rabindranath, always on every emotions", icon: "✎" },
  { bn: "হিমু", en: "a wanderer under the moon", icon: "◈" },
];
let petalIdx = 0;

photoPaths.forEach((src, idx) => {
  const fig = document.createElement("figure");
  fig.className = "polaroid reveal";
  fig.style.setProperty("--rot", seededAngle(idx + 1) + "deg");
  fig.dataset.index = idx;
  fig.tabIndex = 0;
  fig.setAttribute("role", "button");
  fig.setAttribute("aria-label", `Open photo ${idx + 1}`);

  const img = document.createElement("img");
  img.src = src;
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = `Diparna ${idx + 1}`;

  fig.appendChild(img);
  gallery.appendChild(fig);

  // drop in a thematic card roughly every 5 photos
  if ((idx + 1) % 5 === 0 && petalIdx < wordPetals.length) {
    const w = wordPetals[petalIdx++];
    const petal = document.createElement("div");
    petal.className = "word-petal reveal";
    petal.style.setProperty("--rot", seededAngle(idx + 50) + "deg");
    petal.innerHTML =
      `<div class="word-petal__icon" aria-hidden="true">${w.icon}</div>` +
      `<span class="word-petal__bn">${w.bn}</span>` +
      `<span class="word-petal__en">${w.en}</span>`;
    gallery.appendChild(petal);
  }
});

// ---------- REVEAL ANIMATION ----------
const reveals = document.querySelectorAll(".reveal");

function revealElements() {
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    const visible = window.innerHeight - 90;
    if (top < visible) el.classList.add("active");
  });
}
window.addEventListener("scroll", revealElements);
revealElements();

// ---------- STARS ----------
const starsContainer = document.querySelector(".stars");
for (let i = 0; i < 120; i++) {
  const star = document.createElement("span");
  star.classList.add("star");
  star.style.top = Math.random() * 100 + "%";
  star.style.left = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 5 + "s";
  starsContainer.appendChild(star);
}

// ---------- AMBIENT FLOATERS (notes / petals in landing) ----------
const floaterHost = document.getElementById("floaters");
if (floaterHost && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const glyphs = ["♪", "❀", "✦", "♫"];
  const count = window.innerWidth < 600 ? 6 : 11;
  for (let f = 0; f < count; f++) {
    const span = document.createElement("span");
    span.className = "floater";
    span.textContent = glyphs[f % glyphs.length];
    span.style.left = Math.random() * 96 + 2 + "%";
    span.style.fontSize = 12 + Math.random() * 14 + "px";
    span.style.color = f % 2 === 0 ? "#e6c66b" : "#f6ecc9";
    span.style.animationDuration = 10 + Math.random() * 10 + "s";
    span.style.animationDelay = Math.random() * 12 + "s";
    floaterHost.appendChild(span);
  }
}

// ---------- SUNFLOWER SILHOUETTE ROW ----------
const sunflowerHost = document.getElementById("sunflowerRow");
if (sunflowerHost) {
  const sfSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 70" width="100%25" height="100%25">' +
    '<line x1="13" y1="26" x2="13" y2="70" stroke="%23cfa233" stroke-width="2"/>' +
    '<circle cx="13" cy="14" r="7" fill="%23cfa233"/>' +
    '<circle cx="13" cy="14" r="3" fill="%23241c0d"/></svg>';
  const count = window.innerWidth < 600 ? 6 : 10;
  for (let s = 0; s < count; s++) {
    const div = document.createElement("div");
    div.className = "sunflower";
    div.style.backgroundImage = `url('data:image/svg+xml,${sfSvg}')`;
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "bottom";
    div.style.backgroundSize = "contain";
    div.style.transform = `translateY(${Math.random() * 8}px)`;
    sunflowerHost.appendChild(div);
  }
}

// ---------- LIGHTBOX ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");
let currentIndex = 0;

function openLightbox(i) {
  currentIndex = i;
  lbImg.src = photoPaths[currentIndex];
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}
function shift(delta) {
  currentIndex = (currentIndex + delta + photoPaths.length) % photoPaths.length;
  lbImg.src = photoPaths[currentIndex];
}

gallery.addEventListener("click", (e) => {
  const card = e.target.closest(".polaroid");
  if (card) openLightbox(parseInt(card.dataset.index, 10));
});
gallery.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("polaroid")) {
    e.preventDefault();
    openLightbox(parseInt(e.target.dataset.index, 10));
  }
});
lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => shift(-1));
lbNext.addEventListener("click", () => shift(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") shift(-1);
  if (e.key === "ArrowRight") shift(1);
});
