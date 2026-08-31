// bgm/ フォルダに曲を追加したら、ここにも1行追加してください。
const PLAYLIST = [
  { title: "カフェの午後", src: "bgm/cafe-no-gogo.mp3", thumbnail: "images/cafe-no-gogo.jpg" },
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const trackTitleEl = document.getElementById("trackTitle");
const trackThumbEl = document.getElementById("trackThumb");
const playlistEl = document.getElementById("playlist");

let currentIndex = -1;
let isSeeking = false;

function formatTime(seconds) {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = "";

  if (PLAYLIST.length === 0) {
    const empty = document.createElement("p");
    empty.className = "playlist-empty";
    empty.textContent = "bgm/ フォルダに曲を追加すると、ここに一覧が表示されます。";
    playlistEl.appendChild(empty);
    return;
  }

  PLAYLIST.forEach((track, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    if (index === currentIndex) li.classList.add("active");
    li.addEventListener("click", () => loadTrack(index, true));

    const titleSpan = document.createElement("span");
    titleSpan.className = "track-title";
    titleSpan.textContent = track.title;
    li.appendChild(titleSpan);

    const downloadLink = document.createElement("a");
    downloadLink.className = "track-download";
    downloadLink.href = track.src;
    downloadLink.download = "";
    downloadLink.textContent = "⬇ ダウンロード";
    downloadLink.setAttribute("aria-label", `${track.title}をダウンロード`);
    downloadLink.addEventListener("click", (e) => e.stopPropagation());
    li.appendChild(downloadLink);

    playlistEl.appendChild(li);
  });
}

function loadTrack(index, autoplay) {
  if (index < 0 || index >= PLAYLIST.length) return;
  currentIndex = index;
  const track = PLAYLIST[currentIndex];
  audio.src = track.src;
  trackTitleEl.textContent = track.title;

  if (track.thumbnail) {
    trackThumbEl.src = track.thumbnail;
    trackThumbEl.hidden = false;
  } else {
    trackThumbEl.hidden = true;
  }

  document.querySelectorAll(".playlist li").forEach((li) => {
    li.classList.toggle("active", Number(li.dataset.index) === currentIndex);
  });

  if (autoplay) {
    audio.play();
    playBtn.textContent = "⏸";
  }
}

function togglePlay() {
  if (PLAYLIST.length === 0) return;

  if (currentIndex === -1) {
    loadTrack(0, true);
    return;
  }

  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
}

function playNext() {
  if (PLAYLIST.length === 0) return;
  loadTrack((currentIndex + 1) % PLAYLIST.length, true);
}

function playPrev() {
  if (PLAYLIST.length === 0) return;
  loadTrack((currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length, true);
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

audio.addEventListener("timeupdate", () => {
  if (isSeeking) return;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  if (audio.duration) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", playNext);

seekBar.addEventListener("input", () => {
  isSeeking = true;
  currentTimeEl.textContent = formatTime((seekBar.value / 100) * audio.duration);
});

seekBar.addEventListener("change", () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
  isSeeking = false;
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});

audio.volume = volumeBar.value / 100;

renderPlaylist();
