const songs = [
{
title: "TOGETHER FOREVER",
artist: "Rick Astley",
file: "assets/música1.aac",
cover: "assets/portada1.jpg"
},
{
title: "MILITARY FASHION SHOW",
artist: "And One",
file: "assets/música2.aac",
cover: "assets/portada2.jpg"
},
{
title: "PEOPLE ARE PEOPLE",
artist: "Depeche Mode",
file: "assets/música3.aac",
cover: "assets/portada3.jpg"
}
];

document.addEventListener("DOMContentLoaded", () => {

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const songTitle = document.getElementById("song-title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const totalTime = document.getElementById("total-time");
const playPause = document.getElementById("play-pause");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volume-value");
const status = document.getElementById("status");
const trackNumber = document.getElementById("track-number");

let currentSong = 0;

// =========================
// CARGAR CANCIÓN
// =========================

function loadSong(index, autoplay = false) {

    currentSong = (index + songs.length) % songs.length;

    const song = songs[currentSong];

    audio.pause();

    audio.src = song.file;
    audio.load();

    cover.src = song.cover;
    cover.alt = `Portada de ${song.title}`;

    songTitle.textContent = song.title;
    artist.textContent = song.artist;

    trackNumber.textContent =
        `${String(currentSong + 1).padStart(2, "0")} / ${String(songs.length).padStart(2, "0")}`;

    progress.value = 0;
    currentTime.textContent = "0:00";
    totalTime.textContent = "0:00";

    playPause.textContent = "▶";
    playPause.setAttribute("aria-label", "Reproducir");

    status.textContent = "● READY";

    if (autoplay) {
        playAudio();
    }
}

// =========================
// REPRODUCIR
// =========================

function playAudio() {

    const promise = audio.play();

    if (promise !== undefined) {

        promise
            .then(() => {
                playPause.textContent = "⏸";
                playPause.setAttribute("aria-label", "Pausar");
                status.textContent = "● PLAYING";
            })
            .catch((error) => {
                console.error("Error al reproducir:", error);

                status.textContent = "● ERROR";

                alert(
                    "No se pudo reproducir la canción.\n\n" +
                    "Revisa que el archivo MP3 exista y que la ruta sea correcta:\n" +
                    songs[currentSong].file
                );
            });
    }
}

// =========================
// PLAY / PAUSE
// =========================

function togglePlay() {

    if (audio.paused) {
        playAudio();
    } else {
        audio.pause();
    }
}

// =========================
// SIGUIENTE
// =========================

function nextSong() {
    loadSong(currentSong + 1, true);
}

// =========================
// ANTERIOR
// =========================

function previousSong() {
    loadSong(currentSong - 1, true);
}

// =========================
// FORMATO DEL TIEMPO
// =========================

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// =========================
// BOTONES
// =========================

playPause.addEventListener("click", togglePlay);

next.addEventListener("click", nextSong);

previous.addEventListener("click", previousSong);

// =========================
// METADATOS DEL AUDIO
// =========================

audio.addEventListener("loadedmetadata", () => {

    totalTime.textContent = formatTime(audio.duration);

    progress.value = 0;
});

// =========================
// ACTUALIZAR PROGRESO
// =========================

audio.addEventListener("timeupdate", () => {

    if (Number.isFinite(audio.duration) && audio.duration > 0) {

        progress.value =
            (audio.currentTime / audio.duration) * 100;
    }

    currentTime.textContent =
        formatTime(audio.currentTime);
});

// =========================
// MOVER LA CANCIÓN
// =========================

progress.addEventListener("input", () => {

    if (Number.isFinite(audio.duration) && audio.duration > 0) {

        audio.currentTime =
            (progress.value / 100) * audio.duration;
    }
});

// =========================
// VOLUMEN
// =========================

volume.addEventListener("input", () => {

    audio.volume = Number(volume.value);

    volumeValue.textContent =
        `${Math.round(audio.volume * 100)}%`;
});

// =========================
// EVENTO PLAY
// =========================

audio.addEventListener("play", () => {

    playPause.textContent = "⏸";
    playPause.setAttribute("aria-label", "Pausar");

    status.textContent = "● PLAYING";
});

// =========================
// EVENTO PAUSE
// =========================

audio.addEventListener("pause", () => {

    if (!audio.ended) {

        playPause.textContent = "▶";
        playPause.setAttribute("aria-label", "Reproducir");

        status.textContent = "● PAUSED";
    }
});

// =========================
// CUANDO TERMINA UNA CANCIÓN
// =========================

audio.addEventListener("ended", () => {

    nextSong();
});

// =========================
// ERROR DEL AUDIO
// =========================

audio.addEventListener("error", () => {

    console.error(
        "No se pudo cargar el audio:",
        songs[currentSong].file
    );

    status.textContent = "● AUDIO ERROR";
});

// =========================
// ERROR DE PORTADA
// =========================

cover.addEventListener("error", () => {

    cover.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="500"
                 height="500">

                <rect width="100%"
                      height="100%"
                      fill="#c76f9a"/>

                <text x="50%"
                      y="50%"
                      dominant-baseline="middle"
                      text-anchor="middle"
                      fill="white"
                      font-family="Arial"
                      font-size="32">
                    PORTADA
                </text>

            </svg>
        `);
});

// =========================
// VOLUMEN INICIAL
// =========================

audio.volume = Number(volume.value);

volumeValue.textContent =
    `${Math.round(audio.volume * 100)}%`;

// =========================
// CARGAR PRIMERA CANCIÓN
// =========================

loadSong(0);


});