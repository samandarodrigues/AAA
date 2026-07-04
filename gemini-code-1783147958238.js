/* ==========================================================================
   SCRIPT.JS - NÚCLEO LÓGICO E COMPORTAMENTO DO SISTEMA OPERACIONAL
   ========================================================================== */

// ==========================================================================
// MÓDULO 1: BANCO DE DADOS DO SISTEMA DE ARQUIVOS E PLAYLISTS
// ==========================================================================
const FS_DATA = {
    "/": { type: "dir", children: ["home"] },
    "/home": { type: "dir", children: ["arthur"] },
    "/home/arthur": { type: "dir", children: ["Desktop", "Pictures", "Music", "Memories", "Heart"] },
    "/home/arthur/Desktop": { type: "dir", children: [] },
    "/home/arthur/Pictures": { type: "dir", children: ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg", "photo6.jpg", "photo7.jpg", "photo8.jpg"] },
    "/home/arthur/Music": { type: "dir", children: ["our_song.mp3", "until_i_found_you.mp3", "apocalypse.mp3", "nothing.mp3"] },
    "/home/arthur/Memories": { type: "dir", children: ["day001.log", "day045.log", "day092.log"] },
    "/home/arthur/Heart": { type: "dir", children: ["heart.sys", "letter.txt"] },
    
    // Conteúdos dos Arquivos (Strings de Texto Puros)
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
    "/home/arthur/Pictures/photo5.jpg": { type: "image", src: "assets/photos/5.jpg", title: "Mais um dia perfeito bem colado em você" },
    "/home/arthur/Pictures/photo6.jpg": { type: "image", src: "assets/photos/6.jpg", title: "Mais um dia perfeito bem colado em você" },
    "/home/arthur/Pictures/photo7.jpg": { type: "image", src: "assets/photos/7.jpg", title: "Mais um dia perfeito bem colado em você" },
    "/home/arthur/Pictures/photo8.jpg": { type: "image", src: "assets/photos/8.jpg", title: "Mais um dia perfeito bem colado em você" },
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

// ==========================================================================
// MÓDULO 2: CONTROLADOR LÓGICO DO ARQUIVO FALSO DE DIRETÓRIOS
// ==========================================================================
const VirtualFS = (() => {
    let currentPath = "/home/arthur";
    let historyStack = [];

    const getCurrentPath = () => currentPath;

    const resolvePath = (relPath) => {
        if (!relPath) return currentPath;
        if (relPath === "/") return "/";
        
        let target = currentPath;
        if (relPath.startsWith("/")) {
            target = relPath;
        } else {
            if (target === "/") target = target + relPath;
            else target = target + "/" + relPath;
        }

        let parts = target.split("/").filter(p => p !== "" && p !== ".");
        let stack = [];
        for (let p of parts) {
            if (p === "..") {
                if (stack.length > 0) stack.pop();
            } else {
                stack.push(p);
            }
        }
        let resolved = "/" + stack.join("/");
        return resolved === "" ? "/" : resolved;
    };

    const cd = (pathArg) => {
        if (!pathArg) {
            currentPath = "/home/arthur";
            return null;
        }
        let target = resolvePath(pathArg);
        if (FS_DATA[target] && FS_DATA[target].type === "dir") {
            currentPath = target;
            return null;
        }
        return `cd: no such file or directory: ${pathArg}`;
    };

    const ls = () => {
        let node = FS_DATA[currentPath];
        if (node && node.type === "dir") {
            return [...node.children];
        }
        return [];
    };

    const getFile = (pathArg) => {
        let target = resolvePath(pathArg);
        return FS_DATA[target] || null;
    };

    const addHistory = (cmd) => {
        if (cmd.trim() !== "") {
            historyStack.push(cmd);
        }
    };

    const getHistory = () => historyStack;

    return { getCurrentPath, cd, ls, getFile, addHistory, getHistory, resolvePath };
})();

// ==========================================================================
// MÓDULO 3: GERENCIADOR DE ÁUDIO E PLAYLIST
// ==========================================================================
const AudioManager = (() => {
    let audio = null;
    let currentTrackIndex = 0;
    let isPlaying = false;

    const init = () => {
        audio = document.getElementById("audio-player");
        setupEvents();
    };

    const setupEvents = () => {
        audio.addEventListener("timeupdate", () => {
            ui.updateAudioProgress(audio.currentTime, audio.duration);
        });
        audio.addEventListener("loadedmetadata", () => {
            ui.updateAudioProgress(audio.currentTime, audio.duration);
        });
        audio.addEventListener("ended", () => {
            next();
        });
    };

    const loadTrack = (index) => {
        if (index < 0 || index >= MUSIC_PLAYLIST.length) return;
        currentTrackIndex = index;
        const track = MUSIC_PLAYLIST[index];
        audio.src = track.src;
        ui.updatePlayerCard(track, index);
    };

    const play = () => {
        audio.play().then(() => {
            isPlaying = true;
            ui.updatePlayButtonState(true);
        }).catch(err => console.log("Áudio pendente de interação do usuário:", err));
    };

    const pause = () => {
        audio.pause();
        isPlaying = false;
        ui.updatePlayButtonState(false);
    };

    const togglePlay = () => {
        if (isPlaying) pause();
        else play();
    };

    const next = () => {
        let idx = (currentTrackIndex + 1) % MUSIC_PLAYLIST.length;
        loadTrack(idx);
        play();
    };

    const prev = () => {
        let idx = currentTrackIndex - 1;
        if (idx < 0) idx = MUSIC_PLAYLIST.length - 1;
        loadTrack(idx);
        play();
    };

    const seek = (percent) => {
        if (audio.duration) {
            audio.currentTime = audio.duration * percent;
        }
    };

    return { init, loadTrack, play, pause, togglePlay, next, prev, seek, getPlaylist: () => MUSIC_PLAYLIST };
})();

// ==========================================================================
// MÓDULO 4: SEQUÊNCIAS CINEMATOGRÁFICAS (BOOT E SHUTDOWN)
// ==========================================================================
const EngineSequences = (() => {
    
    const runBoot = async () => {
        const container = document.getElementById("boot-terminal");
        const lines = [
            { text: "[ CORING KERNEL STAGE INITIALIZATION ]", delay: 100 },
            { text: "[ OK ] Loading Kernel Core Architecture Components...", delay: 300 },
            { text: "[ OK ] Verifying RAM Sectors Blocks... Stable Structure.", delay: 200 },
            { text: "[ OK ] Loading Memories Repositories Database Framework...", delay: 400 },
            { text: "[ OK ] Loading Core Love Engine Process Model...", delay: 300 },
            { text: "[ OK ] Connection Secure over HEART://PROTOCOLS...", delay: 350 },
            { text: "[DONE] System Modules Loaded Successfully.", delay: 400 },
            { text: "", delay: 150 },
            { text: ">> ACCESS WARNING: RESTRICTED DOMAIN DETECTED", delay: 200, class: "error-line" },
            { text: ">> STATUS: Unauthorized User Detected! Threat Evaluation Activated.", delay: 400, class: "error-line" },
            { text: "", delay: 100 },
            { text: "Scanning Face Biometrics...", delay: 500 },
            { text: "Scanning Voice Frequency Matrix...", delay: 500 },
            { text: "Scanning Heart Rate Signature Code...", delay: 600 },
            { text: "", delay: 200 },
            { text: "================================================", delay: 100 },
            { text: "CRITICAL MATCH: Heart Signature Authenticated!", delay: 300, class: "success-line" },
            { text: "WELCOME BACK, EVIE ৻ ⋆˙⟡ ྀི", delay: 500, class: "success-line" },
            { text: "================================================", delay: 100 },
            { text: "Instantiating Interactive Workspace Interface Terminal...", delay: 600 }
        ];

        for (let item of lines) {
            let div = document.createElement("div");
            if (item.class) div.className = item.class;
            div.textContent = item.text;
            container.appendChild(div);
            container.scrollTop = container.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, item.delay));
        }

        setTimeout(() => {
            ui.switchScreen("boot-screen", "login-screen");
            runLoginScan();
        }, 800);
    };

    const runLoginScan = () => {
        const status = document.getElementById("scan-status");
        const profile = document.getElementById("user-profile");
        
        setTimeout(() => { status.textContent = "Analisando batimentos cardíacos..."; }, 1000);
        setTimeout(() => { status.textContent = "Identificando Padrão Emocional: Puro e Infinito."; }, 2200);
        
        setTimeout(() => {
            status.className = "scan-text hidden";
            profile.classList.remove("hidden");
        }, 3200);
    };

    const runShutdown = async () => {
        ui.switchScreen("desktop-screen", "final-screen");
        AudioManager.pause();
        
        const container = document.getElementById("final-terminal");
        container.innerHTML = "";
        
        const lines = [
            { text: "Iniciando processo de salvamento de estado do sistema...", delay: 300 },
            { text: "[ OK ] Saving Memories Framework Cache Databases...", delay: 400 },
            { text: "[ OK ] Saving Love Engine Runtime States Core...", delay: 400 },
            { text: "Enviando pulsos remotos sincronizados para Arthur...", delay: 500 },
            { text: "Sincronização concluída com sucesso perfeita.", delay: 300 },
            { text: "", delay: 200 },
            { text: "Good Night,", delay: 600 },
            { text: "Evie 𓆩❤︎𓆪", delay: 800, class: "neon-text" },
            { text: "", delay: 300 },
            { text: "HEART://OS em hibernação segura. [Desconectado]", delay: 200 }
        ];

        for (let item of lines) {
            let div = document.createElement("div");
            if (item.class) div.className = item.class;
            div.textContent = item.text;
            container.appendChild(div);
            await new Promise(resolve => setTimeout(resolve, item.delay));
        }
    };

    return { runBoot, runShutdown };
})();

// ==========================================================================
// MÓDULO 5: INTERPRETADOR DE COMANDOS DO TERMINAL (SHELL ENGINE)
// ==========================================================================
const CommandInterpreter = (() => {
    const execute = (inputLine) => {
        const trimmed = inputLine.trim();
        VirtualFS.addHistory(trimmed);
        if (!trimmed) return "";

        const parts = trimmed.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (typeof commands[cmd] === "function") {
            return commands[cmd](args);
        } else {
            return `heartsh: command not found: ${cmd}. Digite 'help' para ver a lista de ferramentas disponíveis.`;
        }
    };

    const commands = {
        help: () => {
            return `Lista de comandos disponíveis no HEART://OS:
------------------------------------------------------
help             - Exibe este menu explicativo de ajuda
whoami           - Retorna a identidade do usuário logado
pwd              - Mostra o diretório de trabalho atual
ls               - Lista os arquivos e pastas do diretório atual
cd [dir]         - Altera o diretório de trabalho
tree             - Exibe árvore estrutural completa do sistema
find [nome]      - Procura por arquivos específicos
history          - Mostra o histórico de comandos executados
about            - Informações sobre a criação deste OS
stats            - Estatísticas em tempo real do sistema amoroso
love             - Executa uma varredura profunda de sentimentos
letter           - Abre diretamente a interface de carta integrada
playlist         - Exibe a lista de reprodução musical completa
music            - Abre a interface flutuante do reprodutor de música
gallery          - Abre a galeria de imagens e memórias visuais
clear            - Limpa o histórico de saídas do terminal
cat [arq]        - Lê e exibe o conteúdo de um arquivo de texto
open [arq]       - Abre imagens (.jpg) ou executa músicas (.mp3)
sudo [cmd]       - Executa comandos em modo superusuário administrador
date             - Exibe a data e hora atual do sistema
echo [txt]       - Retorna o texto digitado no prompt
exit             - Solicita saída segura do console
shutdown         - Desliga e encerra o HEART://OS completamente
reboot           - Reinicia o ciclo completo do sistema computacional`;
        },
        whoami: () => "You are the only person who never needed permission to access my heart.",
        pwd: () => VirtualFS.getCurrentPath(),
        ls: () => {
            let items = VirtualFS.ls();
            if (items.length === 0) return "";
            return items.join(" ");
        },
        cd: (args) => {
            let err = VirtualFS.cd(args[0]);
            if (err) return err;
            ui.updateFolderDisplay(VirtualFS.getCurrentPath());
            return "";
        },
        tree: () => {
            return `/
├── home
└── arthur
    ├── Desktop
    ├── Pictures
    │   ├── photo1.jpg
    │   ├── photo2.jpg
    │   ├── photo3.jpg
    │   └── photo4.jpg
    ├── Music
    │   ├── our_song.mp3
    │   ├── until_i_found_you.mp3
    │   ├── apocalypse.mp3
    │   └── nothing.mp3
    ├── Memories
    │   ├── day001.log
    │   ├── day045.log
    │   └── day092.log
    └── Heart
        ├── heart.sys
        └── letter.txt`;
        },
        find: (args) => {
            if (!args[0]) return "find: missing search target name pattern.";
            const target = args[0].toLowerCase();
            let matches = [];
            for (let path in FS_DATA) {
                if (path.toLowerCase().includes(target) && FS_DATA[path].type !== "dir") {
                    matches.push(path);
                }
            }
            if (matches.length === 0) return `find: no matches found for '${args[0]}'`;
            return matches.join("\n");
        },
        history: () => VirtualFS.getHistory().map((c, i) => `  ${i + 1}  ${c}`).join("\n"),
        about: () => {
            return `======================================================
               HEART://OS (v3.0.0-PROUD)
======================================================
Desenvolvido sob medida por Arthur para Evie.
Criado usando amor puro estruturado, noites sem sono,
foco absoluto e JavaScript Vanilla de alta fidelidade.

[!] Objetivo: Celebrar a existência da pessoa mais incrível
do mundo e eternizar nossos primeiros 3 meses juntos.`;
        },
        stats: () => {
            return `[ HEART CORE REALTIME PERFORMANCE MONITOR ]
------------------------------------------------------
Uso de Processador (CPU): 100% Sincronizado em Evie
Alocação de Memória RAM: Incalculável (Armazenando sorrisos)
Espaço em Disco Rígido: Expandindo Infinitamente a cada dia
Estabilidade do Sistema: Perfeita quando estamos juntos
Temperatura do Núcleo: Quente e Protegida (Fogo estável)`;
        },
        love: () => {
            return `[ RUNNING DEEP SYSTEM SENTIMENT SCAN ]
......................................................
[+] Analisando pacotes emocionais... OK
[+] Verificando conexões de afeto... OK
[+] Mensurando batimentos cardíacos... ESTÁVEL / ACELERADO
------------------------------------------------------
RESULTADO DA VARREDURA COMPLETA:
Amor detectado em níveis astronômicos. Não há métricas ou
limitações físicas capazes de calcular o tamanho do que sinto.
Status do Diagnóstico: Completamente e perdidamente apaixonado.`;
        },
        letter: () => { ui.openLetter(); return "Abrindo visualizador de carta confidencial na interface gráfica..."; },
        playlist: () => {
            return AudioManager.getPlaylist().map((track, idx) => {
                return `[FAIXA ${idx + 1}] ${track.title} - ${track.artist}\n   "${track.desc}"`;
            }).join("\n\n");
        },
        music: () => { ui.openMusic(); return "Abrindo Reprodutor de Áudio Integrado..."; },
        gallery: () => { ui.openGallery(); return "Carregando memórias visuais na Galeria Gráfica..."; },
        clear: () => { ui.clearTerminalHistory(); return ""; },
        cat: (args) => {
            if (!args[0]) return "cat: especifique um arquivo de texto para leitura. Ex: cat letter.txt";
            let file = VirtualFS.getFile(args[0]);
            if (!file) return `cat: ${args[0]}: No such file.`;
            if (file.type !== "file") return `cat: ${args[0]}: Is a directory or special source block.`;
            return file.content;
        },
        open: (args) => {
            if (!args[0]) return "open: especifique o nome de um arquivo válido (.jpg ou .mp3).";
            let file = VirtualFS.getFile(args[0]);
            if (!file) return `open: ${args[0]}: arquivo não encontrado.`;
            
            if (file.type === "image") {
                ui.openImageViewer(file.src, file.title);
                return `Exibindo imagem '${args[0]}' em alta definição...`;
            } else if (file.type === "audio") {
                AudioManager.loadTrack(file.trackIndex);
                AudioManager.play();
                ui.openMusic();
                return `Reproduzindo arquivo de áudio digital '${args[0]}'...`;
            }
            return `open: não há suporte nativo para abrir arquivos do tipo '${file.type}' diretamente.`;
        },
        sudo: (args) => {
            if (!args[0]) return "sudo: missing command string parameter.";
            const action = args[0].toLowerCase();
            const target = args[1] ? args[1].toLowerCase() : "";
            
            if (action === "open" && (target === "heart.sys" || target === "/home/arthur/heart/heart.sys")) {
                ui.openSecret();
                return "Autenticação Sudo Aprovada! Desbloqueando Núcleo Oculto do Sentimento.";
            }
            return `sudo: permissão negada para executar '${args.join(" ")}'. Usuário administrativo não autorizado para este comando específico.`;
        },
        date: () => new Date().toString(),
        echo: (args) => args.join(" "),
        exit: () => { EngineSequences.runShutdown(); return "Encerrando sessão interativa segura..."; },
        shutdown: () => { EngineSequences.runShutdown(); return "Desligando o HEART://OS..."; },
        reboot: () => { window.location.reload(); return "Reiniciando o sistema..."; }
    };

    return { execute };
})();

// ==========================================================================
// MÓDULO 6: GERENCIADOR COMPLETO DA INTERFACE GRÁFICA (UI CONTROL)
// ==========================================================================
const ui = (() => {
    let elements = {};

    const init = () => {
        cacheElements();
        setupGlobalEvents();
        EngineSequences.runBoot();
    };

    const cacheElements = () => {
        const ids = [
            "boot-screen", "login-screen", "desktop-screen", "final-screen",
            "btn-enter-os", "terminal-output", "terminal-input", "folder-path-display",
            "folder-grid", "letter-window", "btn-close-letter", "music-window",
            "btn-close-music", "gallery-window", "btn-close-gallery", "image-viewer-popup",
            "expanded-image", "image-viewer-title", "btn-close-viewer", "secret-window",
            "btn-close-secret", "player-title", "player-artist", "player-desc",
            "btn-prev", "btn-play", "btn-next", "progress-bar-fill", "progress-time", "gallery-grid"
        ];
        ids.forEach(id => {
            elements[id] = document.getElementById(id);
        });
    };

    const setupGlobalEvents = () => {
        // Botão da Tela de Login
        if (elements["btn-enter-os"]) {
            elements["btn-enter-os"].addEventListener("click", () => {
                switchScreen("login-screen", "desktop-screen");
                updateFolderDisplay(VirtualFS.getCurrentPath());
            });
        }

        // Evento do Prompt do Terminal
        if (elements["terminal-input"]) {
            elements["terminal-input"].addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const value = e.target.value;
                    e.target.value = "";
                    appendTerminalCommand(value);
                }
            });
            // Mantém foco contínuo no input ao clicar na caixa do terminal
            const wrapper = document.querySelector(".terminal-wrapper");
            if (wrapper) {
                wrapper.addEventListener("click", () => elements["terminal-input"].focus());
            }
        }

        // Atalhos de Fechamento de Janelas Gráficas
        if (elements["btn-close-letter"]) elements["btn-close-letter"].addEventListener("click", closeLetter);
        if (elements["btn-close-music"]) elements["btn-close-music"].addEventListener("click", closeMusic);
        if (elements["btn-close-gallery"]) elements["btn-close-gallery"].addEventListener("click", closeGallery);
        if (elements["btn-close-viewer"]) elements["btn-close-viewer"].addEventListener("click", closeImageViewer);
        if (elements["btn-close-secret"]) elements["btn-close-secret"].addEventListener("click", closeSecret);

        // Controladores de Áudio Gráficos
        if (elements["btn-play"]) elements["btn-play"].addEventListener("click", () => AudioManager.togglePlay());
        if (elements["btn-next"]) elements["btn-next"].addEventListener("click", () => AudioManager.next());
        if (elements["btn-prev"]) elements["btn-prev"].addEventListener("click", () => AudioManager.prev());

        // Barra de progresso interativa para clique (seek)
        const progressContainer = document.querySelector(".progress-bar-container");
        if (progressContainer) {
            progressContainer.addEventListener("click", (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                AudioManager.seek(clickX / width);
            });
        }
    };

    const switchScreen = (fromId, toId) => {
        const fromScreen = document.getElementById(fromId);
        const toScreen = document.getElementById(toId);
        if (fromScreen) fromScreen.classList.remove("active");
        if (toScreen) toScreen.classList.add("active");
    };

    const appendTerminalCommand = (line) => {
        const output = elements["terminal-output"];
        if (!output) return;

        const cmdDiv = document.createElement("div");
        cmdDiv.className = "terminal-input-row";
        cmdDiv.innerHTML = `<span class="prompt-user">evie@heart-os:</span><span class="prompt-path">${VirtualFS.getCurrentPath()}</span><span class="prompt-arrow">$</span> <span class="input-logged"></span>`;
        cmdDiv.querySelector(".input-logged").textContent = line;
        output.appendChild(cmdDiv);

        const result = CommandInterpreter.execute(line);
        if (result !== "") {
            const resDiv = document.createElement("div");
            resDiv.className = "terminal-result-row";
            resDiv.innerHTML = escapeHTML(result).replace(/\n/g, "<br>");
            output.appendChild(resDiv);
        }

        const view = document.querySelector(".terminal-scroll-area");
        if (view) view.scrollTop = view.scrollHeight;
    };

    const clearTerminalHistory = () => {
        if (elements["terminal-output"]) elements["terminal-output"].innerHTML = "";
    };

    const updateFolderDisplay = (path) => {
        if (elements["folder-path-display"]) elements["folder-path-display"].textContent = path;
        const grid = elements["folder-grid"];
        if (!grid) return;
        grid.innerHTML = "";

        let items = VirtualFS.ls();
        items.forEach(item => {
            let fullPath = VirtualFS.resolvePath(item);
            let fileNode = FS_DATA[fullPath];
            let icon = "📁";
            if (fileNode) {
                if (fileNode.type === "file") icon = "📄";
                if (fileNode.type === "image") icon = "🖼️";
                if (fileNode.type === "audio") icon = "🎵";
            }

            let div = document.createElement("div");
            div.className = "folder-item";
            div.innerHTML = `<div class="folder-icon">${icon}</div><div class="folder-name">${item}</div>`;
            div.addEventListener("click", () => {
                if (!fileNode || fileNode.type === "dir") {
                    VirtualFS.cd(item);
                    updateFolderDisplay(VirtualFS.getCurrentPath());
                } else {
                    appendTerminalCommand(`open ${item}`);
                }
            });
            grid.appendChild(div);
        });
    };

    const openLetter = () => elements["letter-window"].classList.remove("hidden");
    const closeLetter = () => elements["letter-window"].classList.add("hidden");
    const openMusic = () => elements["music-window"].classList.remove("hidden");
    const closeMusic = () => elements["music-window"].classList.add("hidden");

    const updatePlayerCard = (track, index) => {
        if (elements["player-title"]) elements["player-title"].textContent = track.title;
        if (elements["player-artist"]) elements["player-artist"].textContent = track.artist;
        if (elements["player-desc"]) elements["player-desc"].textContent = track.desc;
        
        const trackItems = document.querySelectorAll(".track-item");
        trackItems.forEach((item, i) => {
            if (i === index) item.classList.add("active");
            else item.classList.remove("active");
        });
    };

    const updatePlayButtonState = (playing) => {
        if (elements["btn-play"]) elements["btn-play"].textContent = playing ? "⏸ PAUSAR" : "▶ REPRODUZIR";
    };

    const updateAudioProgress = (currentTime, duration) => {
        if (!duration) return;
        const pct = (currentTime / duration) * 100;
        if (elements["progress-bar-fill"]) elements["progress-bar-fill"].style.width = pct + "%";
        
        const format = (t) => {
            if (isNaN(t)) return "00:00";
            let m = Math.floor(t / 60);
            let s = Math.floor(t % 60);
            return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        };
        if (elements["progress-time"]) elements["progress-time"].textContent = `${format(currentTime)} / ${format(duration)}`;
    };

    const openGallery = () => {
        elements["gallery-window"].classList.remove("hidden");
        const grid = elements["gallery-grid"];
        if (!grid || grid.children.length > 0) return; 

        let paths = Object.keys(FS_DATA).filter(k => FS_DATA[k].type === "image");
        paths.forEach(p => {
            let item = FS_DATA[p];
            let div = document.createElement("div");
            div.className = "gallery-item";
            div.innerHTML = `
                <img src="${item.src}" alt="${item.title}" onerror="this.src='https://placehold.co/400?text=Memória+Visual'; this.nextElementSibling.style.bottom='40%';">
                <div class="gallery-caption">${item.title}</div>
            `;
            div.addEventListener("click", () => { openImageViewer(item.src, item.title); });
            grid.appendChild(div);
        });
    };

    const closeGallery = () => elements["gallery-window"].classList.add("hidden");
    const openImageViewer = (src, title) => {
        elements["image-viewer-popup"].classList.remove("hidden");
        elements["expanded-image"].src = src;
        elements["image-viewer-title"].textContent = title;
    };
    const closeImageViewer = () => elements["image-viewer-popup"].classList.add("hidden");
    const openSecret = () => elements["secret-window"].classList.remove("hidden");
    const closeSecret = () => elements["secret-window"].classList.add("hidden");

    const escapeHTML = (str) => {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    return {
        init, switchScreen, clearTerminalHistory, updateFolderDisplay,
        openLetter, closeLetter, openMusic, closeMusic, updatePlayerCard,
        updatePlayButtonState, updateAudioProgress, openGallery, closeGallery,
        openImageViewer, closeImageViewer, openSecret, closeSecret
    };
})();

// Inicializa a árvore unificada ao carregar completamente o DOM
document.addEventListener("DOMContentLoaded", () => {
    ui.init();
    AudioManager.init();
    AudioManager.loadTrack(0);
});