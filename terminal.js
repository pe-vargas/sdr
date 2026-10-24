const files = {
  readme: {
    title: "LEIA-ME.TXT",
    meta: "TEXTO / 1 KB / ÚLTIMA ALTERAÇÃO: 03-11-1989",
    body: `LE VOLEUR — TERMINAL LOCAL
---------------------------

Este equipamento foi recuperado da antiga secretaria da escola.

Não está ligado à rede municipal.
Não contém registros oficiais completos.
Alguns arquivos foram copiados à mão e podem estar errados.

INSTRUÇÕES:
- Use os ícones para abrir arquivos.
- Digite HELP no terminal para ver os comandos.
- Este computador não sabe nada que a gangue ainda não tenha descoberto.

AVISO ESCRITO A LÁPIS:
"Se começar a fazer barulho, dá dois tapas do lado direito."`
  },
  mapa: {
    title: "ASHGATE.MAP",
    meta: "MAPA / 4 KB / CÓPIA INCOMPLETA",
    body: `ASHGATE — MAPA DE REFERÊNCIA
----------------------------

[NORTE]       IL PIACERE
              Distrito ferroviário / zona fortificada

[LESTE]       BESY
              Indústria / oficinas / cúpulas de tijolo

[OESTE]       DER PROZESS
              Quadras administrativas / ruas em grade

[SUL]         LE VOLEUR
              Bairros pobres / comércio informal

[CENTRO]      ESTAÇÃO CENTRAL
              Incêndio antigo. Acesso parcial.

NOTA:
Mapa montado com relatos e páginas arrancadas de um atlas.
Ruas secundárias e limites dos distritos não estão confirmados.`
  },
  missao: {
    title: "TRABALHOS.DAT",
    meta: "REGISTRO / 2 KB / ARQUIVO LOCAL",
    body: `REGISTRO DE TRABALHOS
---------------------

[SEM REGISTROS AUTOMÁTICOS]

Este terminal não recebe ordens da gangue nem se conecta
a outras bases. Os trabalhos precisam ser anotados manualmente.

MODELO DE REGISTRO:

DATA:
CONTATO:
LOCAL:
OBJETIVO:
RESULTADO:
INFORMAÇÕES A CONFIRMAR:

DICA: anote apenas o que os integrantes realmente descobriram.`
  },
  inventario: {
    title: "INVENTARIO.DAT",
    meta: "BANCO LOCAL / SEM SINCRONIZAÇÃO",
    body: `INVENTÁRIO DA SEDE
-------------------

Este arquivo ainda não foi atualizado.

ARMAS:       [VERIFICAR MANUALMENTE]
MUNIÇÃO:     [VERIFICAR MANUALMENTE]
MEDICAMENTOS:[VERIFICAR MANUALMENTE]
FERRAMENTAS: [VERIFICAR MANUALMENTE]

ATENÇÃO:
Os números neste terminal não são sincronizados com o inventário
físico. Confira os suprimentos antes de sair em missão.`
  },
  relatorios: {
    title: "RELATORIOS.DIR",
    meta: "DIRETÓRIO / 0 ARQUIVOS INDEXADOS",
    body: `C:\\LEVOLEUR\\RELATORIOS

O diretório está vazio.

Para adicionar relatórios de sessões futuras, edite o arquivo
js/terminal.js e inclua novos documentos no banco local.

> 0 arquivo(s) encontrado(s).`
  },
  sistema: {
    title: "SISTEMA.TXT",
    meta: "ARQUIVO DE CONFIGURAÇÃO / 1989",
    body: `LV-DOS 2.1
----------

PROCESSADOR: 8-BIT COMPATÍVEL
MEMÓRIA:     640 KB
ARMAZENAMENTO: DISCO RÍGIDO 10 MB
UNIDADE:     DISQUETE 5,25"
VÍDEO:       MONOCROMÁTICO
REDE:        NÃO INSTALADA
IMPRESSORA:  DESLIGADA

ESTADO: FUNCIONANDO, COM LIMITAÇÕES

ERROS CONHECIDOS:
- Relógio interno perde alguns minutos.
- Unidade de disquete emperra de vez em quando.
- Tecla ENTER precisa ser pressionada com firmeza.
- A ventoinha faz um ruído irregular.

MENSAGEM DO ÚLTIMO TÉCNICO:
"Não mexer nos cabos. Não temos outros."`
  }
};

const boot = document.getElementById("boot");
const desktop = document.getElementById("desktop");
const bootText = document.getElementById("bootText");
const fileWindow = document.getElementById("fileWindow");
const fileTitle = document.getElementById("fileTitle");
const fileContent = document.getElementById("fileContent");
const fileMeta = document.getElementById("fileMeta");
const message = document.getElementById("message");
const command = document.getElementById("command");
const output = document.getElementById("output");

const bootLines = [
  "LV-DOS SYSTEM BOOT 2.1",
  "(C) 1988-1989 LEV-TECH REPAIR SERVICE",
  "",
  "CPU CHECK.............. OK",
  "640 KB RAM............. OK",
  "HDD 10 MB.............. WARNING",
  "LOCAL FILE SYSTEM...... OK",
  "NETWORK CARD........... NOT FOUND",
  "",
  "BOOT COMPLETE WITH 1 WARNING."
];
bootText.textContent = bootLines.join("\n");

function startSystem() {
  boot.classList.add("hidden");
  desktop.classList.remove("hidden");
  message.textContent = "SISTEMA PRONTO — 1 AVISO";
  command.focus();
}
boot.addEventListener("click", startSystem);
document.addEventListener("keydown", (e) => {
  if (!boot.classList.contains("hidden") && e.key !== "Tab") startSystem();
  if (e.key === "Escape") closeFile();
  if (e.key === "F1") {
    e.preventDefault();
    output.textContent = "HELP | DIR | STATUS | CLEAR | OPEN nome-do-arquivo";
  }
});
document.querySelectorAll("[data-file]").forEach(btn => {
  btn.addEventListener("click", () => openFile(btn.dataset.file));
});
function openFile(key) {
  const file = files[key];
  if (!file) return;
  fileTitle.textContent = file.title;
  fileContent.textContent = file.body;
  fileMeta.textContent = file.meta;
  fileWindow.classList.remove("hidden");
  message.textContent = "ARQUIVO ABERTO: " + file.title;
  document.getElementById("closeWindow").focus();
}
function closeFile() {
  fileWindow.classList.add("hidden");
  if (!desktop.classList.contains("hidden")) command.focus();
}
document.getElementById("closeWindow").addEventListener("click", closeFile);
function runCommand() {
  const raw = command.value.trim();
  const parts = raw.split(/\s+/);
  const cmd = (parts.shift() || "").toUpperCase();
  const arg = parts.join(" ").toLowerCase();
  const names = Object.keys(files);
  if (!cmd) return;
  if (cmd === "HELP") output.textContent = "COMANDOS DISPONÍVEIS:\nHELP — esta ajuda\nDIR — lista arquivos\nSTATUS — estado do computador\nCLEAR — limpa a tela\nOPEN nome — abre um arquivo (ex.: OPEN MAPA)";
  else if (cmd === "DIR") output.textContent = "LEIA-ME.TXT   ASHGATE.MAP   TRABALHOS.DAT\nINVENTARIO.DAT   RELATORIOS.DIR   SISTEMA.TXT\n6 arquivo(s) listados.";
  else if (cmd === "STATUS") output.textContent = "MEMÓRIA: 640 KB | DISCO: 10 MB | REDE: NÃO DISPONÍVEL\nAVISO: relógio interno instável.";
  else if (cmd === "CLEAR") output.textContent = "";
  else if (cmd === "OPEN") {
    const found = names.find(k => k === arg || files[k].title.toLowerCase() === arg || files[k].title.toLowerCase().startsWith(arg));
    if (found) openFile(found);
    else output.textContent = "ERRO: arquivo não encontrado. Digite DIR para listar arquivos.";
  } else output.textContent = `COMANDO NÃO RECONHECIDO: ${cmd}\nDigite HELP para obter ajuda.`;
  command.value = "";
}
document.getElementById("runCommand").addEventListener("click", runCommand);
command.addEventListener("keydown", e => { if (e.key === "Enter") runCommand(); });
function tick() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"});
}
tick();
setInterval(tick, 30000);

// Optional PHP logging: if hosted on a PHP-enabled server, record opened files.
// On GitHub Pages this request will fail harmlessly because PHP is not supported.
document.querySelectorAll("[data-file]").forEach(btn => btn.addEventListener("click", () => {
  fetch("php/log.php", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({event:"open_file", file:btn.dataset.file, timestamp:new Date().toISOString()})}).catch(() => {});
}));
