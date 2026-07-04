/* ==========================================================================
   SCRIPT.JS - NÚCLEO LÓGICO E COMPORTAMENTO DO SISTEMA OPERACIONAL
   ========================================================================== */

const FS_DATA = {
    "/": { type: "dir", children: ["home"] },
    "/home": { type: "dir", children: ["arthur"] },
    "/home/arthur": { type: "dir", children: ["Desktop", "Pictures", "Music", "Memories", "Heart"] },
    "/home/arthur/Desktop": { type: "dir", children: [] },
    "/home/arthur/Pictures": { type: "dir", children: ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg", "photo6.jpg", "photo7.jpg", "photo8.jpg"] },
    "/home/arthur/Music": { type: "dir", children: ["our_song.mp3", "until_i_found_you.mp3", "apocalypse.mp3", "nothing.mp3"] },
    "/home/arthur/Memories": { type: "dir", children: ["day001.log", "day045.log", "day092.log"] },
    "/home/arthur/Heart": { type: "dir", children: ["heart.sys", "letter.txt"] },
    
    "/home/arthur/Heart/letter.txt": {
        type: "file",
        content: `Querida Evie,

Hoje completamos 3 meses de namoro. Três meses desde que minha vida ganhou um novo rumo, uma nova cor e um propósito infinitamente mais bonito. 

Eu criei o HEART://OS porque queria te dar algo que fosse único, feito linha por linha com o mesmo carinho e dedicação que sinto quando penso em você. Cada detalhe desse sistema reflete o espaço absoluto que você ocupa na minha mente e no meu coração.

Você é a minha linha de código favorita, o sistema operacional que roda em segundo plano em todos os meus pensamentos, o porto seguro onde meu kernel encontra paz. Obrigado por ser minha namorada, minha companheira e o amor da minha vida.

Feliz 3 meses de namoro! Isso é apenas o começo da nossa grande história juntos.

Com todo o amor do mundo,
Arthur ఌ︎.`
    },
    "/home/arthur/Heart/heart.sys": {
        type: "file",
        content: "CRITICAL ERROR: Acesso direto não recomendado. Use 'sudo open heart.sys' para liberar energia total."
    },
    "/home/arthur/Memories/day001.log": {
        type: "file",
        content: "[LOG: DIA 001] O dia em que nossos olhares se cruzaram de verdade pela primeira vez. Meu coração disparou instantaneamente. Ali, eu soube que nada mais seria igual. Foi o início do carregamento de tudo."
    },
    "/home/arthur/Memories/day045.log": {
        type: "file",
        content: "[LOG: DIA 045] Nosso primeiro beijo demorado sob as luzes da cidade. Lembro da sensação exata de perceber que meus lábios encaixavam perfeitamente nos teus. O mundo parou ao redor."
    },
    "/home/arthur/Memories/day092.log": {
        type: "file",
        content: "[LOG: DIA 092] Três meses completos hoje. Olho para trás e vejo quantas risadas, conversas e momentos inesquecíveis nós construímos. Cada segundo ao seu lado vale por uma eternidade de sorrisos."
    },
    "/home/arthur/Pictures/photo1.jpg": { type: "image", src: "assets/photos/1.jpg", title: "O seu sorriso iluminando o meu dia inteiro" },
    "/home/arthur/Pictures/photo2.jpg": { type: "image", src: "assets/photos/2.jpg", title: "A nossa primeira foto juntos (Inesquecível)" },
    "/home/arthur/Pictures/photo3.jpg": { type: "image", src: "assets/photos/3.jpg", title: "Aquele momento espontâneo que eu tanto amo" },
    "/home/arthur/Pictures/photo4.jpg": { type: "image", src: "assets/photos/4.jpg", title: "Mais um dia perfeito bem colado em você" },
    "/home/arthur/Pictures/photo5.jpg": { type: "image", src: "assets/photos/5.jpg", title: "Mais um momento especial ao seu lado" },
    "/home/arthur/Pictures/photo6.jpg": { type: "image", src: "assets/photos/6.jpg", title: "O brilho dos seus olhos me encanta" },
    "/home/arthur/Pictures/photo7.jpg": { type: "image", src: "assets/photos/7.jpg", title: "Sua risada é minha sinfonia predileta" },
    "/home/arthur/Pictures/photo8.jpg": { type: "image", src: "assets/photos/8.jpg", title: "Para sempre, lado a lado" },
    "/home/arthur/Music/our_song.mp3": { type: "audio", trackIndex: 0 },
    "/home/arthur/Music/until_i_found_you.mp3": { type: "audio", trackIndex: 0 },
    "/home/arthur/Music/apocalypse.mp3": { type: "audio", trackIndex: 1 },
    "/home/arthur/Music/nothing.mp3": { type: "audio", trackIndex: 2 }
};

const MUSIC_PLAYLIST = [
    {
        title: "Until I Found You",
        artist: "Stephen Sanchez",
        desc: "A música que me faz lembrar exatamente de como eu andava sem rumo no mundo até finalmente encontrar o seu abraço.",
        src: "assets/music/until-i-found-you.mp3"
    },
    {
        title: "Apocalypse",
        artist: "Cigarettes After Sex",
        desc: "Sua vibe cinematográfica me faz sentir que mesmo se o mundo estivesse desabando lá fora, eu estaria em paz se estivesse com você.",
        src: "assets/music/apocalypse.mp3"
    },
    {
        title: "Nothing",
        artist: "Bruno Major",
        desc: "Porque fazer absolutamente nada ao seu lado é muito melhor e mais especial do que fazer qualquer outra coisa com qualquer outra pessoa.",
        src: "assets/music/nothing.mp3"
    }
];

const VirtualFS = (() => {
    let currentPath = "/home/arthur";
    let historyStack = [];
    const getCurrentPath = () => currentPath;
    const resolvePath = (relPath) => {
        if (!relPath) return currentPath;
        if (relPath === "/") return "/";
        let target = currentPath;
        if (relPath.startsWith("/")) { target = relPath; } 
        else { target = target === "/" ? target + relPath : target + "/" + relPath; }
        let parts = target.split("/").filter(p => p !== "" && p !== ".");
        let stack = [];
        for (let p of parts) {
            if (p === "..") { if (stack.length > 0) stack.pop(); } 
            else { stack.push(p); }
        }
        let resolved = "/" + stack.join("/");
        return resolved === "" ? "/" : resolved;
    };
    const cd = (pathArg) => {
        if (!pathArg) { currentPath = "/home/arthur"; return null; }
        let target = resolvePath(pathArg);
        if (FS_DATA[target] && FS_DATA[target].type === "dir") { currentPath = target; return null; }
        return `cd: no such file or directory: ${pathArg}`;
    };
    const ls = () => {
        let node = FS_DATA[currentPath];
        return (node && node.type === "dir") ? [...node.children] : [];
    };
    const getFile = (pathArg) => { return FS_DATA[resolvePath(pathArg)] || null; };
    const addHistory = (cmd) => { if (cmd.trim() !== "") historyStack.push(cmd); };
    const getHistory = () => historyStack;
    return { getCurrentPath, cd, ls, getFile, addHistory, getHistory, resolvePath };
})();

const AudioManager = (() => {
    let audio = null;
    let currentTrackIndex = 0;
    let isPlaying = false;
    const init = () => { audio = document.getElementById("audio-player"); setupEvents(); };
    const setupEvents = () => {
        audio.addEventListener("timeupdate", () => ui.updateAudioProgress(audio.currentTime, audio.duration));
        audio.addEventListener("loadedmetadata", () => ui.updateAudioProgress(audio.currentTime, audio.duration));
        audio.addEventListener("ended", () => next());
    };
    const loadTrack = (index) => {
        if (index < 0 || index >= MUSIC_PLAYLIST.length) return;
        currentTrackIndex = index;
        audio.src = MUSIC_PLAYLIST[index].src;
        ui.updatePlayerCard(MUSIC_PLAYLIST[index], index);
    };
    const play = () => { audio.play().then(() => { isPlaying = true; ui.updatePlayButtonState(true); }).catch(e => console.log(e)); };
    const pause = () => { audio.pause(); isPlaying = false; ui.updatePlayButtonState(false); };
    const togglePlay = () => { if (isPlaying) pause(); else play(); };
    const next = () => { loadTrack((currentTrackIndex + 1) % MUSIC_PLAYLIST.length); play(); };
    const prev = () => { let idx = currentTrackIndex - 1; if (idx < 0) idx = MUSIC_PLAYLIST.length - 1; loadTrack(idx); play(); };
    const seek = (percent) => { if (audio.duration) audio.currentTime = audio.duration * percent; };
    return { init, loadTrack, play, pause, togglePlay, next, prev, seek, getPlaylist: () => MUSIC_PLAYLIST };
})();

const EngineSequences = (() => {
    const runBoot = async () => {
        const container = document.getElementById("boot-terminal");
        const lines = [
            { text: "[ CORING KERNEL STAGE INITIALIZATION ]", delay: 60 },
            { text: "[ OK ] Loading Core Components...", delay: 100 },
            { text: "[ OK ] Verifying RAM Sectors...", delay: 100 },
            { text: "[ OK ] Loading Core Love Engine...", delay: 150 },
            { text: "Scanning Face Biometrics...", delay: 200 },
            { text: "================================================", delay: 60 },
            { text: "CRITICAL MATCH: Heart Signature Authenticated!", delay: 150, class: "success-line" },
            { text: "WELCOME BACK, EVIE ৻ ⋆˙⟡ ྀི", delay: 200, class: "success-line" },
            { text: "================================================", delay: 60 }
        ];
        for (let item of lines) {
            let div = document.createElement("div");
            if (item.class) div.className = item.class;
            div.textContent = item.text;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            await new Promise(r => setTimeout(r, item.delay));
        }
        setTimeout(() => { ui.switchScreen("boot-screen", "login-screen"); runLoginScan(); }, 400);
    };
    const runLoginScan = () => {
        const status = document.getElementById("scan-status");
        const profile = document.getElementById("user-profile");
        setTimeout(() => { status.textContent = "Analisando batimentos cardíacos..."; }, 600);
        setTimeout(() => { status.className = "scan-text hidden"; profile.classList.remove("hidden"); }, 1400);
    };
    const runShutdown = async () => {
        ui.switchScreen("desktop-screen", "final-screen");
        AudioManager.pause();
        const container = document.getElementById("final-terminal");
        container.innerHTML = "<div>HEART://OS em hibernação segura. [Desconectado]</div>";
    };
    return { runBoot, runShutdown };
})();

const CommandInterpreter = (() => {
    const execute = (inputLine) => {
        const trimmed = inputLine.trim();
        VirtualFS.addHistory(trimmed);
        if (!trimmed) return "";
        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        return typeof commands[cmd] === "function" ? commands[cmd](parts.slice(1)) : `heartsh: command not found: ${cmd}`;
    };
    const commands = {
        help: () => `Comandandos: help, whoami, pwd, ls, cd, tree, find, history, about, stats, love, letter, playlist, music, gallery, clear, cat, open, sudo, shutdown, reboot`,
        whoami: () => "You are the only person who never needed permission to access my heart.",
        pwd: () => VirtualFS.getCurrentPath(),
        ls: () => VirtualFS.ls().join("   "),
        cd: (args) => { let err = VirtualFS.cd(args[0]); if (err) return err; ui.updateFolderDisplay(VirtualFS.getCurrentPath()); return ""; },
        tree: () => `/\n├── home\n    └── arthur\n        ├── Desktop\n        ├── Pictures (photo1-8.jpg)\n        ├── Music\n        ├── Memories\n        └── Heart`,
        find: (args) => {
            if (!args[0]) return "Uso: find [nome]";
            let found = Object.keys(FS_DATA).filter(k => k.toLowerCase().includes(args[0].toLowerCase()) && FS_DATA[k].type !== "dir");
            return found.length ? found.join("\n") : "Nenhum arquivo encontrado.";
        },
        history: () => VirtualFS.getHistory().map((c, i) => `  ${i+1}  ${c}`).join("\n"),
        about: () => `HEART://OS v1.0.3\nDesenvolvido por Arthur para Evie.`,
        stats: () => `Tempo de Namoro: 3 Meses\nUptime: 100% focado em nós dois`,
        love: () => "Too many results found 𓆩❤︎𓆪",
        letter: () => { setTimeout(() => ui.openLetter(), 50); return "Abrindo carta..."; },
        playlist: () => AudioManager.getPlaylist().map((m, i) => `[Track ${i+1}] - ${m.title}`).join("\n"),
        music: () => { setTimeout(() => ui.openMusic(), 50); return "Abrindo player..."; },
        gallery: () => { setTimeout(() => ui.openGallery(), 50); return "Abrindo galeria..."; },
        clear: () => { ui.clearTerminalHistory(); return "CLEAR_SIGNAL"; },
        cat: (args) => {
            if (!args[0]) return "Uso: cat [arquivo]";
            let file = VirtualFS.getFile(args[0]);
            if (!file || file.type === "dir") return "Arquivo não encontrado.";
            if (args[0].endsWith("letter.txt")) { setTimeout(() => ui.openLetter(), 50); return "Exibindo..."; }
            return file.content || "Não legível.";
        },
        open: (args) => {
            if (!args[0]) return "Uso: open [arquivo]";
            let file = VirtualFS.getFile(args[0]);
            if (!file) return "Arquivo não encontrado.";
            if (file.type === "image") { setTimeout(() => ui.openImageViewer(file.src, file.title), 50); return "Abrindo imagem..."; }
            if (file.type === "audio") { setTimeout(() => { ui.openMusic(); AudioManager.loadTrack(file.trackIndex); AudioManager.play(); }, 50); return "Tocando..."; }
            return "Não suportado.";
        },
        sudo: (args) => {
            if (args[0] === "open" && args[1] === "heart.sys") { setTimeout(() => ui.openSecret(), 50); return "Acesso concedido ao núcleo."; }
            return execute(args.join(" "));
        },
        shutdown: () => { setTimeout(() => EngineSequences.runShutdown(), 500); return "Desligando..."; },
        reboot: () => { setTimeout(() => window.location.reload(), 400); return "Reiniciando..."; }
    };
    return { execute };
})();

const ui = (() => {
    let elements = {};
    const init = () => {
        const ids = ["boot-screen", "login-screen", "desktop-screen", "final-screen", "btn-enter-os", "terminal-body", "terminal-history", "terminal-input", "current-folder-display", "os-clock", "letter-window", "letter-text-container", "music-window", "player-title", "player-artist", "player-desc", "audio-disc", "btn-play-pause", "btn-prev", "btn-next", "progress-timeline", "progress-bar", "time-current", "time-duration", "playlist-ul", "gallery-window", "gallery-grid-content", "image-viewer-popup", "expanded-image", "image-viewer-title", "secret-window"];
        ids.forEach(id => elements[id] = document.getElementById(id));
        setupDOMEvents();
        startClock();
        buildPlaylistDOM();
        buildGalleryDOM();
    };
    const setupDOMEvents = () => {
        elements["btn-enter-os"].addEventListener("click", () => { switchScreen("login-screen", "desktop-screen"); setTimeout(() => elements["terminal-input"].focus(), 150); });
        elements["terminal-input"].addEventListener("keydown", (e) => { if (e.key === "Enter") { let v = elements["terminal-input"].value; elements["terminal-input"].value = ""; handleCommandSubmit(v); } });
        document.getElementById("terminal-window"].addEventListener("click", () => elements["terminal-input"].focus());
        document.addEventListener("click", (e) => { if(!e.target.closest('.window-popup') && elements["terminal-input"]) elements["terminal-input"].focus(); });
        document.addEventListener("touchstart", (e) => { if(!e.target.closest('.window-popup') && elements["terminal-input"]) elements["terminal-input"].focus(); }, { passive: true });
        elements["btn-play-pause"].addEventListener("click", () => AudioManager.togglePlay());
        elements["btn-prev"].addEventListener("click", () => AudioManager.prev());
        elements["btn-next"].addEventListener("click", () => AudioManager.next());
        elements["progress-timeline"].addEventListener("click", (e) => { const r = elements["progress-timeline"].getBoundingClientRect(); AudioManager.seek((e.clientX - r.left) / r.width); });
    };
    const switchScreen = (from, to) => { if (elements[from]) elements[from].classList.remove("active"); if (elements[to]) elements[to].classList.add("active"); };
    const startClock = () => { setInterval(() => { let d = new Date(); if (elements["os-clock"]) elements["os-clock"].textContent = d.toTimeString().split(' ')[0]; }, 1000); };
    const handleCommandSubmit = (cmdText) => {
        const hist = elements["terminal-history"];
        let div = document.createElement("div"); div.className = "terminal-line";
        div.innerHTML = `<span class="prompt">evie@heart:${VirtualFS.getCurrentPath()}$</span> <span>${cmdText.replace(/</g, "&lt;")}</span>`;
        hist.appendChild(div);
        let out = CommandInterpreter.execute(cmdText);
        if (out !== "CLEAR_SIGNAL" && out) {
            let oDiv = document.createElement("div"); oDiv.className = "terminal-line"; oDiv.style.whiteSpace = "pre-wrap"; oDiv.textContent = out;
            hist.appendChild(oDiv);
        }
        elements["terminal-body"].scrollTop = elements["terminal-body"].scrollHeight;
    };
    let twTimeout = null;
    const openLetter = () => {
        elements["letter-window"].classList.remove("hidden"); const c = elements["letter-text-container"]; c.textContent = "";
        let txt = FS_DATA["/home/arthur/Heart/letter.txt"].content; let idx = 0;
        if (twTimeout) clearInterval(twTimeout);
        twTimeout = setInterval(() => { if (idx < txt.length) { c.textContent += txt.charAt(idx++); } else clearInterval(twTimeout); }, 20);
    };
    const buildPlaylistDOM = () => {
        const ul = elements["playlist-ul"]; ul.innerHTML = "";
        AudioManager.getPlaylist().forEach((track, index) => {
            let li = document.createElement("li"); li.className = "playlist-item";
            li.innerHTML = `<div class="item-meta"><div class="item-title">${track.title}</div></div><div class="item-play-icon">▶</div>`;
            li.addEventListener("click", () => { AudioManager.loadTrack(index); AudioManager.play(); });
            ul.appendChild(li);
        });
    };
    const updatePlayerCard = (track, activeIndex) => {
        elements["player-title"].textContent = track.title; elements["player-artist"].textContent = track.artist; elements["player-desc"].textContent = track.desc;
        const items = elements["playlist-ul"].querySelectorAll(".playlist-item");
        items.forEach((item, idx) => { item.classList.toggle("active-track", idx === activeIndex); item.querySelector(".item-play-icon").textContent = idx === activeIndex ? "⏸" : "▶"; });
    };
    const updatePlayButtonState = (p) => { elements["btn-play-pause"].textContent = p ? "⏸" : "▶"; elements["audio-disc"].classList.toggle("playing", p); };
    const updateAudioProgress = (c, d) => { if (!d) return; elements["progress-bar"].style.width = `${(c / d) * 100}%`; elements["time-current"].textContent = `${Math.floor(c/60)}:${String(Math.floor(c%60)).padStart(2,'0')}`; elements["time-duration"].textContent = `${Math.floor(d/60)}:${String(Math.floor(d%60)).padStart(2,'0')}`; };
    const buildGalleryDOM = () => {
        const grid = elements["gallery-grid-content"]; grid.innerHTML = "";
        const photoKeys = ["/home/arthur/Pictures/photo1.jpg", "/home/arthur/Pictures/photo2.jpg", "/home/arthur/Pictures/photo3.jpg", "/home/arthur/Pictures/photo4.jpg", "/home/arthur/Pictures/photo5.jpg", "/home/arthur/Pictures/photo6.jpg", "/home/arthur/Pictures/photo7.jpg", "/home/arthur/Pictures/photo8.jpg"];
        photoKeys.forEach(key => {
            let item = FS_DATA[key]; let div = document.createElement("div"); div.className = "gallery-item";
            div.innerHTML = `<img src="${item.src}" alt="${item.title}" onerror="this.style.display='none';"><div class="gallery-caption">${item.title}</div>`;
            div.addEventListener("click", () => openImageViewer(item.src, item.title));
            grid.appendChild(div);
        });
    };
    const openImageViewer = (src, title) => { elements["image-viewer-popup"].classList.remove("hidden"); elements["expanded-image"].src = src; elements["image-viewer-title"].textContent = title; };
    return {
        init, switchScreen, clearTerminalHistory, updateFolderDisplay: (p) => { elements["current-folder-display"].textContent = p; },
        openLetter, closeLetter: () => { clearInterval(twTimeout); elements["letter-window"].classList.add("hidden"); },
        openMusic, closeMusic: () => elements["music-window"].classList.add("hidden"), updatePlayerCard, updatePlayButtonState, updateAudioProgress,
        openGallery, closeGallery: () => elements["gallery-window"].classList.add("hidden"), closeImageViewer: () => elements["image-viewer-popup"].classList.add("hidden"),
        openSecret, closeSecret: () => elements["secret-window"].classList.add("hidden")
    };
})();

document.addEventListener("DOMContentLoaded", () => { ui.init(); AudioManager.init(); AudioManager.loadTrack(0); EngineSequences.runBoot(); });