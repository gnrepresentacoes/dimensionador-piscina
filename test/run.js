'use strict';
// Smoke test: calcula com os dados padrao, abre o Electron em modo de teste (gera PDF sem dialogo) e encerra.
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');

const raiz = path.join(__dirname, '..');
global.window = {};
require(path.join(raiz, 'src', 'renderer', 'config.js'));
const CFG = global.window.DIM_CONFIG;
const C = require(path.join(raiz, 'src', 'renderer', 'calc.js'));

const f = { modoVolume: 'litros', litros: '50000', tempInicial: '20', tempDesejada: '32', capa: 'sim', tipo: 'aberta', vento: 'moderado', tarifa: '1.00', horasRecirculacao: '8', mca: '8' };
const s = C.selecionar(CFG, f);
const esperadoKcal = 12 * 1.01 * 1.1 * 1.15 * 50000;
if (Math.abs(s.carga.kcal - esperadoKcal) > 1) { console.error('Carga termica divergente:', s.carga.kcal, 'esperado', esperadoKcal); process.exit(1); }
console.log('[calc] 50.000 L, 20->32 C: ' + Math.round(s.carga.kcal) + ' kcal -> ' + s.quantidade + ' x ' + s.modelo.nome);

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dim-teste-'));
const electron = require('electron');
const r = spawnSync(electron, ['.'], { cwd: raiz, env: Object.assign({}, process.env, { DIM_TESTE_DIR: dir }), stdio: 'inherit' });
console.log('[electron] saida ' + r.status + ' · artefatos em ' + dir);
process.exit(r.status === 0 ? 0 : 1);
