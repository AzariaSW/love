const PHOTO_FILES = [
  "pictures/HBDB(1).png",
  "pictures/photo_2025-08-30_19-20-54.jpg",
  "pictures/photo_2025-08-30_19-20-55 (2).jpg",
  "pictures/photo_2025-08-30_19-20-55.jpg",
  "pictures/photo_2025-11-14_16-55-32.jpg",
  "pictures/photo_2025-11-30_15-58-52.jpg",
  "pictures/photo_2025-11-30_15-59-09.jpg",
  "pictures/photo_2025-11-30_15-59-16.jpg",
  "pictures/photo_2025-11-30_15-59-32.jpg",
  "pictures/photo_2025-11-30_15-59-38.jpg",
  "pictures/photo_2025-11-30_15-59-51.jpg",
  "pictures/photo_2025-11-30_16-00-02.jpg",
  "pictures/photo_2025-11-30_16-00-07.jpg",
  "pictures/photo_2025-11-30_16-00-18.jpg",
  "pictures/photo_2025-11-30_16-00-35.jpg",
  "pictures/photo_2025-11-30_16-00-51.jpg",
];

const CAPTIONS = [
  "The beginning of another beautiful forever.",
  "Your smile, still undefeated.",
  "The kind of moment I replay quietly.",
  "You make ordinary days look cinematic.",
  "A memory with its own heartbeat.",
  "The world gets softer around you.",
  "Every laugh becomes part of home.",
  "The best view is still us.",
  "One more reason I am lucky.",
  "Love, caught in motion.",
  "A small piece of always.",
  "My favorite person, again and again.",
  "A page I never want to close.",
  "The future, already glowing.",
  "First-date magic that stayed.",
  "My favorite chapter.",
];

const REASONS = [
  "You make peace feel possible.",
  "Your laugh changes the room.",
  "You are beautiful in ways pictures can only begin to explain.",
  "You make love feel like a daily choice, not a performance.",
  "You are my best conversation and my favorite silence.",
  "You inspire me to become gentler, braver, and better.",
  "You turn memories into treasures without even trying.",
];

const orbit = document.getElementById("photoOrbit");
const river = document.getElementById("memoryRiver");
const reasons = document.getElementById("reasons");
const starfield = document.getElementById("starfield");
const petals = document.getElementById("petals");
let photos = PHOTO_FILES.map((src, index) => ({
  src,
  caption: CAPTIONS[index % CAPTIONS.length],
}));

function renderPhotos() {
  orbit.innerHTML = "";
  river.innerHTML = "";

  const count = Math.max(photos.length, 1);
  const radius = Math.min(Math.max(window.innerWidth * 0.32, 210), 430);

  photos.forEach((photo, index) => {
    const angle = (360 / count) * index;
    const orbitCard = document.createElement("figure");
    orbitCard.className = "orbit-card";
    orbitCard.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px) rotateY(${-angle}deg) rotateZ(${index % 2 ? -2 : 2}deg)`;
    orbitCard.innerHTML = `<img src="${photo.src}" alt="Memory ${index + 1}" loading="lazy">`;
    orbit.appendChild(orbitCard);

    const riverCard = document.createElement("article");
    riverCard.className = "memory-card";
    riverCard.dataset.caption = photo.caption;
    riverCard.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy">`;
    river.appendChild(riverCard);
  });

  observeReveal();
}

function renderReasons() {
  reasons.innerHTML = REASONS.map(
    (reason) => `<div class="reason">${reason}</div>`,
  ).join("");
  observeReveal();
}

function observeReveal() {
  const revealItems = document.querySelectorAll(
    ".memory-card:not(.watched), .reason:not(.watched)",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  revealItems.forEach((item, index) => {
    item.classList.add("watched");
    item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
    observer.observe(item);
  });
}

function makeAmbientLayer(
  container,
  total,
  className,
  durationMin,
  durationRange,
) {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < total; index += 1) {
    const element = document.createElement("span");
    element.className = className;
    element.style.left = `${Math.random() * 100}%`;
    element.style.animationDuration = `${durationMin + Math.random() * durationRange}s`;
    element.style.animationDelay = `${Math.random() * -30}s`;
    element.style.transform = `scale(${0.6 + Math.random() * 1.4})`;
    fragment.appendChild(element);
  }
  container.appendChild(fragment);
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelector(button.dataset.scroll)
      .scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("photoInput").addEventListener("change", (event) => {
  const selected = Array.from(event.target.files || []).filter((file) =>
    file.type.startsWith("image/"),
  );
  if (!selected.length) {
    return;
  }

  const added = selected.map((file, index) => ({
    src: URL.createObjectURL(file),
    caption: `A new memory added today ${index + 1}`,
  }));

  photos = added.concat(photos);
  renderPhotos();
});

window.addEventListener("resize", renderPhotos);

makeAmbientLayer(starfield, 48, "star", 12, 18);
makeAmbientLayer(petals, 28, "petal", 14, 20);
renderPhotos();
renderReasons();
