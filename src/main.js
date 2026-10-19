'use strict';

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const RAIZ = path.join(__dirname, '..');
const ASSETS = path.join(RAIZ, 'assets');
let janela = null;

/* ---------- configuracao persistida (pasta de saida, ultimos dados) ---------- */
function arquivoConfig() { return path.join(app.getPath('userData'), 'config.json'); }
function pastaPadrao() { return path.join(app.getPath('documents'), 'Dimensionamentos'); }
function lerConfig() {
  try { return Object.assign({ pasta: pastaPadrao(), ultimo: null, proximoNumero: 1 }, JSON.parse(fs.readFileSync(arquivoConfig(), 'utf8'))); }
  catch (e) { return { pasta: pastaPadrao(), ultimo: null, proximoNumero: 1 }; }
}
function salvarConfig(cfg) {
  fs.mkdirSync(path.dirname(arquivoConfig()), { recursive: true });
  fs.writeFileSync(arquivoConfig(), JSON.stringify(cfg, null, 2));
}

/* ---------- janela ---------- */
function criarJanela() {
  janela = new BrowserWindow({
    width: 1366, height: 860, minWidth: 1100, minHeight: 680,
    title: 'Dimensionador de Bomba de Calor',
    backgroundColor: '#eef2f7',
    icon: path.join(RAIZ, 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  janela.setMenuBarVisibility(false);
  janela.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  janela.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/i.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  janela.on('closed', () => { janela = null; });
}

/* ---------- PDF ---------- */
function urlArquivo(p) { return 'file:///' + p.replace(/\\/g, '/'); }

function montarHtmlImpressao(htmlDoc) {
  const css = fs.readFileSync(path.join(__dirname, 'renderer', 'app.css'), 'utf8');
  // Troca os caminhos relativos das logos por caminhos absolutos.
  const corpo = htmlDoc.replace(/\.\.\/\.\.\/assets\//g, urlArquivo(ASSETS) + '/');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><style>${css}
    @page { size: A4; margin: 14mm 14mm 12mm; }
    html, body { background: #fff !important; overflow: visible !important; display: block !important; height: auto !important; }
    .page { margin: 0 !important; padding: 0 !important; box-shadow: none !important; overflow: visible !important; font-size: 14px; }
    .doc-head img.gn { height: 60px; } .doc-head img.sy { height: 38px; } .doc-head .t strong { font-size: 18px; } .doc-head .t span { font-size: 12px; }
    .doc-main .v { font-size: 24px; } .doc-main .b .v { font-size: 20px; } .doc-main .k, .doc-kpi .k, .doc-h, .doc-cost .k { font-size: 11px; } .doc-main .s, .doc-kpi .c { font-size: 12px; }
    .doc-kpi .v { font-size: 20px; } .doc-kpi .v small { font-size: 12px; } .doc-chart { height: 120px; margin-top: 22px; } .doc-chart div span, .doc-chart div i { font-size: 10px; } .doc-chart div span { top: -16px; } .doc-chart div i { bottom: -17px; }
    .doc-cost { margin-top: 30px; } .doc-cost .v { font-size: 16px; } .doc-tab th, .doc-tab td { font-size: 12.5px; padding: 7px 8px; } .doc-meta { font-size: 13px; } .doc-foot { font-size: 11px; margin-top: 22px; }
    .doc-chart div, .doc-main, .doc-kpi, .opt { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style></head><body><div class="page">${corpo}</div></body></html>`;
}

async function gerarPdf(dados, opcoes) {
  const cfg = lerConfig();
  const silencioso = !!(opcoes && opcoes.silencioso);
  let destino = path.join(cfg.pasta, dados.nome);
  if (!silencioso) {
    const r = await dialog.showSaveDialog(janela, { title: 'Salvar PDF do dimensionamento', defaultPath: destino, filters: [{ name: 'PDF', extensions: ['pdf'] }] });
    if (r.canceled || !r.filePath) return { ok: false, cancelado: true };
    destino = r.filePath;
    cfg.pasta = path.dirname(destino);
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });

  const tmp = path.join(app.getPath('temp'), 'dimensionador-impressao.html');
  fs.writeFileSync(tmp, montarHtmlImpressao(dados.html));
  const oculta = new BrowserWindow({ show: false, width: 900, height: 1200, webPreferences: { sandbox: true, offscreen: false } });
  try {
    await oculta.loadFile(tmp);
    await new Promise((res) => setTimeout(res, 300)); // tempo para as imagens
    const pdf = await oculta.webContents.printToPDF({ pageSize: 'A4', printBackground: true, preferCSSPageSize: true, margins: { marginType: 'none' } });
    fs.writeFileSync(destino, pdf);
  } finally { oculta.destroy(); }

  cfg.ultimo = dados.formulario || cfg.ultimo;
  cfg.proximoNumero = (cfg.proximoNumero || 1) + 1;
  salvarConfig(cfg);
  return { ok: true, caminho: destino };
}

/* ---------- IPC ---------- */
ipcMain.handle('config:ler', () => lerConfig());
ipcMain.handle('config:salvarUltimo', (_e, formulario) => { const c = lerConfig(); c.ultimo = formulario; salvarConfig(c); return true; });
ipcMain.handle('pasta:escolher', async () => {
  const cfg = lerConfig();
  const r = await dialog.showOpenDialog(janela, { title: 'Pasta onde os PDFs serão salvos', defaultPath: cfg.pasta, properties: ['openDirectory', 'createDirectory'] });
  if (r.canceled || !r.filePaths[0]) return cfg.pasta;
  cfg.pasta = r.filePaths[0]; salvarConfig(cfg); return cfg.pasta;
});
ipcMain.handle('pasta:abrir', async () => { const cfg = lerConfig(); fs.mkdirSync(cfg.pasta, { recursive: true }); await shell.openPath(cfg.pasta); return true; });
ipcMain.handle('pdf:gerar', (_e, dados) => gerarPdf(dados, { silencioso: !!process.env.DIM_TESTE_DIR }));
ipcMain.handle('pdf:abrir', (_e, caminho) => shell.openPath(caminho));

/* ---------- modo de teste (npm test): gera o PDF sem dialogo, tira captura e encerra ---------- */
const TESTE = process.env.DIM_TESTE_DIR;
if (TESTE) app.setPath('userData', TESTE);

function rodarTeste() {
  let erros = 0;
  janela.webContents.on('console-message', (_e, nivel, msg, linha, origem) => {
    if (nivel >= 2 && !/Electron Security Warning/.test(msg)) erros++;
    console.log(`[renderer ${nivel >= 2 ? 'ERRO' : 'log'}] ${msg} (${path.basename(origem || '')}:${linha})`);
  });
  janela.webContents.once('did-finish-load', async () => {
    try {
      const cfg = lerConfig(); cfg.pasta = path.join(TESTE, 'pdf'); salvarConfig(cfg);
      await new Promise((res) => setTimeout(res, 800));
      const resumo = await janela.webContents.executeJavaScript(`document.querySelector('.doc-main .v') ? document.querySelector('.doc-main .v').innerText + ' | ' + document.querySelectorAll('.opt').length + ' opcoes' : 'SEM DOCUMENTO'`);
      console.log('[tela] ' + resumo);
      const img = await janela.webContents.capturePage();
      fs.writeFileSync(path.join(TESTE, 'tela.png'), img.toPNG());
      await janela.webContents.executeJavaScript(`document.getElementById('btnPdf').click(); true`);
      await new Promise((res) => setTimeout(res, 2500));
      const status = await janela.webContents.executeJavaScript(`document.getElementById('status').innerText`);
      console.log('[status] ' + status);
      const pdfs = fs.existsSync(path.join(TESTE, 'pdf')) ? fs.readdirSync(path.join(TESTE, 'pdf')) : [];
      console.log('[pdf] ' + (pdfs.length ? pdfs.map((f) => f + ' (' + fs.statSync(path.join(TESTE, 'pdf', f)).size + ' bytes)').join(', ') : 'NENHUM'));
      if (!pdfs.length) erros++;
    } catch (e) { console.log('[teste] falhou: ' + e.message); erros++; }
    app.exit(erros ? 1 : 0);
  });
}

app.whenReady().then(() => {
  criarJanela();
  if (TESTE) rodarTeste();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) criarJanela(); });
});
app.on('window-all-closed', () => app.quit());
