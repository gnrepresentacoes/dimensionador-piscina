/* Tela do Dimensionador: le o formulario, recalcula a cada alteracao e desenha a previa do PDF. */
(function () {
  'use strict';
  var CFG = window.DIM_CONFIG, C = window.DimCalc;
  var $ = function (id) { return document.getElementById(id); };
  var fmtInt = function (n) { return Math.round(n).toLocaleString('pt-BR'); };
  var fmt1 = function (n) { return n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };
  var brl = function (n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var rot = { capa: { sim: 'com capa', nao: 'sem capa' }, tipo: { aberta: 'aberta', fechada: 'fechada' }, vento: { fraco: 'fraco', moderado: 'moderado', forte: 'forte' } };

  var modoVolume = 'medidas', escolhaIdx = 0, opcoes = [];
  window.__modoVolumeBomba = modoVolume;

  Object.keys(CFG.clima).sort().forEach(function (uf) { var o = document.createElement('option'); o.value = uf; o.textContent = uf; $('uf').appendChild(o); });
  $('uf').value = 'MG';

  function ler() {
    return {
      modoVolume: modoVolume, litros: $('litros').value,
      principal: { comprimento: $('pComp').value, largura: $('pLarg').value, profundidade: $('pProf').value },
      temPrainha: $('temPrainha').checked, prainha: { comprimento: $('prComp').value, largura: $('prLarg').value, profundidade: $('prProf').value },
      tempInicial: $('tIni').value, tempDesejada: $('tDes').value, tarifa: $('tarifa').value,
      capa: $('capa').value, tipo: $('tipo').value, vento: $('vento').value,
      temCascata: $('temCascata').checked, cascataCm: $('cascataCm').value,
      temInfinita: $('temInfinita').checked, infinita: { comprimento: '', largura: '', profundidade: '' }, infinitaBordaM: $('inBorda').value,
      horasRecirculacao: $('hRec').value, mca: $('mca').value,
    };
  }
  function cliente() {
    return { nome: $('cliente').value.trim(), cidade: $('cidade').value.trim(), uf: $('uf').value, fone: $('fone').value.trim(), numero: $('numero').value.trim() };
  }

  function recalcular() {
    var f = ler(), c = C.cargaTermica(CFG, f);
    $('volPreview').textContent = 'Volume considerado: ' + fmtInt(c.volumeLitros) + ' litros.';
    var valido = c.volumeLitros >= 1000 && C.num(f.tempDesejada) > C.num(f.tempInicial);
    if (!valido) { $('opcoes').innerHTML = '<p class="hint">Preencha volume e temperaturas para ver as opções.</p>'; $('page').innerHTML = ''; $('status').textContent = 'Dados incompletos'; return; }
    opcoes = C.opcoes(CFG, f);
    if (!opcoes.length) opcoes = [C.selecionar(CFG, f)];
    if (escolhaIdx >= opcoes.length) escolhaIdx = 0;
    $('opcoes').innerHTML = opcoes.map(function (o, i) {
      return '<button type="button" class="opt' + (i === escolhaIdx ? ' on' : '') + '" data-i="' + i + '"><div><strong>' + o.quantidade + ' × ' + esc(o.modelo.nome) + '</strong>' +
        '<small>' + fmtInt(o.totalBtu) + ' BTU/h · ' + fmt1(o.horasDia) + ' h/dia · primeiro aquecimento ' + fmt1(o.horasPrimeiroAquecimento) + ' h · ' + fmt1(o.kwMax) + ' kW</small></div>' +
        '<span class="tag' + (o.recomendado ? '' : ' line') + '">' + (i === 0 ? 'Automática' : esc(o.modelo.linha)) + '</span></button>';
    }).join('');
    document.querySelectorAll('.opt').forEach(function (b) { b.addEventListener('click', function () { escolhaIdx = Number(b.dataset.i); recalcular(); }); });
    desenharDocumento(f, opcoes[escolhaIdx]);
    preencherFinal(f, opcoes[escolhaIdx]);
    $('status').textContent = 'Atualizado ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function desenharDocumento(f, s) {
    var cl = cliente(), c = s.carga, p = C.projecaoAnual(CFG, f, s, cl.uf);
    var maxKwh = Math.max.apply(null, p.meses.map(function (m) { return m.kwh; }));
    var hid = s.hidraulica;
    var h = '';
    h += '<div class="doc-head">' +
      '<div class="t"><strong>Dimensionamento de bomba de calor</strong><span>Indicação preliminar para piscina · ' + esc(CFG.marca.nome) + '</span></div>' +
      '<img class="sy" src="../../assets/logo-syllent.png" alt="Syllent" /></div>';
    h += '<div class="doc-meta"><span>Cliente: <b>' + esc(cl.nome || '—') + '</b></span><span>Data: <b>' + new Date().toLocaleDateString('pt-BR') + '</b></span>' +
      '<span>Local: <b>' + esc((cl.cidade ? cl.cidade + ' / ' : '') + cl.uf) + '</b></span><span>Orçamento nº: <b>' + esc(cl.numero || '—') + '</b></span></div>';
    h += '<div class="doc-main"><div><div class="k">Equipamento indicado</div><div class="v">' + s.quantidade + ' × ' + esc(s.modelo.nome) + '</div><div class="s">Linha ' + esc(s.modelo.linha) + ' · ' + fmtInt(s.totalKcal) + ' kcal/h · consumo máximo ' + fmt1(s.kwMax) + ' kW</div></div>' +
      '<div class="b"><div class="k">Capacidade total</div><div class="v">' + fmtInt(s.totalBtu) + ' BTU/h</div></div></div>';
    h += '<div class="doc-kpis">' +
      kpi('Carga térmica', fmtInt(c.kcal), 'kcal', fmtInt(c.btu) + ' BTU') +
      kpi('Aquecimento diário', fmt1(s.horasDia), 'h/dia', 'critério: abaixo de ' + CFG.constantes.limiteHorasDia + ' h', s.horasDia < CFG.constantes.limiteHorasDia ? 'ok' : 'warn') +
      kpi('Primeiro aquecimento', fmt1(s.horasPrimeiroAquecimento), 'h', 'critério: abaixo de ' + CFG.constantes.limitePrimeiroAquecH + ' h', s.horasPrimeiroAquecimento < CFG.constantes.limitePrimeiroAquecH ? 'ok' : 'warn') + '</div>';
    h += blocoBomba(hid);
    h += '<div class="doc-h">Custo de energia estimado · ' + esc(p.referencia) + ' · tarifa R$ ' + Number(f.tarifa).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '/kWh</div><div class="doc-chart">';
    p.meses.forEach(function (m) { h += '<div class="' + (m === p.mesPico ? 'peak' : '') + '" style="height:' + Math.max(4, m.kwh / maxKwh * 100) + '%"><span>' + brl(m.custo) + '</span><i>' + m.mes.slice(0, 3) + '</i></div>'; });
    h += '</div><div class="doc-cost"><div><div class="k">Custo anual</div><div class="v">' + brl(p.custoAno) + '</div></div><div><div class="k">Primeiro aquecimento</div><div class="v">' + brl(p.custoPrimeiroAquecimento) + '</div></div>' +
      '<div><div class="k">Mês de pico</div><div class="v">' + esc(p.mesPico.mes) + ' · ' + fmt1(p.mesPico.horasDia) + ' h/dia</div></div><div><div class="k">Consumo anual</div><div class="v">' + fmtInt(p.kwhAno) + ' kWh</div></div></div>';
    h += '<div class="doc-h">Dados considerados</div><table class="doc-tab">' +
      tr('Volume total', fmtInt(c.volumeLitros) + ' litros' + (f.modoVolume === 'medidas' ? ' (' + f.principal.comprimento + ' × ' + f.principal.largura + ' × ' + f.principal.profundidade + ' m' + (f.temPrainha ? ' + prainha' : '') + ')' : '')) +
      tr('Temperaturas', f.tempInicial + ' °C → ' + f.tempDesejada + ' °C (Δ ' + fmt1(c.deltaC) + ' °C)') +
      tr('Condição', rot.capa[f.capa] + ' · ' + rot.tipo[f.tipo] + ' · vento ' + rot.vento[f.vento] + ' (fatores ' + c.fatores.capa + ' × ' + c.fatores.tipo + ' × ' + c.fatores.vento + ')') +
      tr('Acessórios', acess(f) + (c.acessoriosKcal ? ' · +' + fmtInt(c.acessoriosKcal) + ' kcal' : '')) +
      tr('Hidráulica', 'vazão de projeto ' + fmt1(hid.vazaoNecessaria) + ' m³/h (bomba de calor ' + fmt1(hid.vazaoBombaCalor) + ' · renovação ' + fmt1(hid.vazaoRenovacao) + ' em ' + hid.horasRecirculacao + ' h) · altura manométrica ' + hid.mca + ' mca') +
      '</table>';
    h += '<div class="doc-foot"><span>' + esc(CFG.marca.nome) + ' · representante ' + esc(CFG.marca.fabricante) + '</span><span>Resultado preliminar, sem valor de projeto executivo ou garantia de desempenho.</span></div>';
    $('page').innerHTML = h;
  }
  var resumoTexto = '';
  function preencherFinal(f, s) {
    var hb = s.hidraulica, c = s.carga, cl = cliente(), p = C.projecaoAnual(CFG, f, s, cl.uf);
    $('finEquip').textContent = s.quantidade + ' × ' + s.modelo.nome;
    $('finEquipSub').textContent = 'Linha ' + s.modelo.linha + ' · ' + fmtInt(s.totalBtu) + ' BTU/h · ' + fmt1(s.kwMax) + ' kW';
    var card = $('finPumpCard');
    if (hb.bomba) {
      card.classList.remove('warn');
      $('finPump').textContent = hb.bomba.linha + ' ' + hb.bomba.cv + ' CV';
      $('finPumpSub').textContent = hb.bomba.modelo220 + ' · ' + fmt1(hb.vazaoDisponivel) + ' m³/h a ' + hb.mca + ' mca' + (hb.bomba.filtro ? ' · filtro ' + hb.bomba.filtro : '');
    } else {
      card.classList.add('warn');
      $('finPump').textContent = 'Validar com a engenharia';
      $('finPumpSub').textContent = fmt1(hb.vazaoNecessaria) + ' m³/h a ' + hb.mca + ' mca excede a linha Pré-Filtro';
    }
    $('finChecks').innerHTML = (s.recomendado ? '<span class="ok">✓ Atende aos critérios da planilha</span>' : '<span class="bad">✗ Fora dos critérios da planilha</span>') +
      '<span>Vazão necessária ' + fmt1(hb.vazaoNecessaria) + ' m³/h</span><span>Custo anual estimado ' + brl(p.custoAno) + '</span>';
    resumoTexto = ['Dimensionamento de bomba de calor · ' + CFG.marca.nome,
      cl.nome ? 'Cliente: ' + cl.nome + (cl.cidade ? ' · ' + cl.cidade : '') + '/' + cl.uf : null,
      'Piscina: ' + fmtInt(c.volumeLitros) + ' L · ' + f.tempInicial + ' → ' + f.tempDesejada + ' °C',
      'Equipamento: ' + s.quantidade + ' × ' + s.modelo.nome + ' (' + fmtInt(s.totalBtu) + ' BTU/h · ' + fmt1(s.horasDia) + ' h/dia)',
      'Bomba: ' + (hb.bomba ? hb.bomba.linha + ' ' + hb.bomba.cv + ' CV · ' + hb.bomba.modelo220 + ' (' + fmt1(hb.vazaoDisponivel) + ' m³/h a ' + hb.mca + ' mca)' : 'validar com a engenharia'),
      'Custo anual estimado: ' + brl(p.custoAno) + ' (tarifa R$ ' + f.tarifa + '/kWh)'].filter(Boolean).join(String.fromCharCode(10));
  }
  function blocoBomba(hid) {
    var b = hid.bomba;
    var h = '<div class="doc-pump' + (b ? '' : ' warn') + '"><div class="k">Motobomba de circulação indicada</div>';
    if (!b) {
      h += '<div class="v">Acima da linha Pré-Filtro · validar com a engenharia</div><div class="s">Vazão de projeto ' + fmt1(hid.vazaoNecessaria) + ' m³/h a ' + hid.mca + ' mca excede a maior bomba do catálogo nessa altura.</div></div>';
      return h;
    }
    h += '<div class="v">' + esc(b.linha) + ' ' + esc(b.cv) + ' CV · ' + esc(b.modelo220) + '</div>' +
      '<div class="s">' + fmt1(hid.vazaoDisponivel) + ' m³/h a ' + hid.mca + ' mca · necessário ' + fmt1(hid.vazaoNecessaria) + ' m³/h · ' + esc(b.fase) + (b.modelo120 ? ' · 120 V: ' + esc(b.modelo120) : '') + ' · pressão máx. ' + fmt1(b.mcaMax) + ' mca' + (b.filtro ? ' · filtro de areia ' + esc(b.filtro) : '') + '</div>';
    if (hid.alternativaTrifasica) {
      var t = hid.alternativaTrifasica.bomba;
      h += '<div class="s">Opção trifásica: ' + esc(t.linha) + ' ' + esc(t.cv) + ' CV · ' + esc(t.modelo220) + ' / ' + esc(t.modelo120) + ' · ' + fmt1(hid.alternativaTrifasica.vazaoDisponivel) + ' m³/h</div>';
    }
    h += '</div>';
    return h;
  }
  function kpi(k, v, u, c, cls) { return '<div class="doc-kpi ' + (cls || '') + '"><div class="k">' + k + '</div><div class="v">' + v + ' <small>' + u + '</small></div><div class="c">' + c + '</div></div>'; }
  function tr(k, v) { return '<tr><th>' + k + '</th><td>' + v + '</td></tr>'; }
  function acess(f) {
    var a = [];
    if (f.temPrainha && f.modoVolume === 'medidas') a.push('prainha');
    if (f.temCascata) a.push('cascata ' + f.cascataCm + ' cm');
    if (f.temInfinita) a.push('borda infinita ' + f.infinitaBordaM + ' m');
    return a.length ? a.join(', ') : 'nenhum';
  }

  /* eventos */
  document.querySelectorAll('#modBomba .seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      modoVolume = b.dataset.v; window.__modoVolumeBomba = modoVolume;
      document.querySelectorAll('#modBomba .seg button').forEach(function (x) { x.classList.toggle('on', x === b); });
      $('modoMedidas').hidden = modoVolume !== 'medidas'; $('modoLitros').hidden = modoVolume !== 'litros';
      recalcular();
    });
  });
  $('temPrainha').addEventListener('change', function () { $('prainhaBox').hidden = !this.checked; });
  $('temCascata').addEventListener('change', function () { $('cascataBox').hidden = !this.checked; });
  $('temInfinita').addEventListener('change', function () { $('infinitaBox').hidden = !this.checked; });
  document.querySelectorAll('#modBomba input, #modBomba select').forEach(function (el) { el.addEventListener('input', function () { el.dataset.editado = '1'; recalcular(); }); el.addEventListener('change', recalcular); });
  window.__recalcularBomba = recalcular;
  window.__setModoBomba = function (m) { modoVolume = m; window.__modoVolumeBomba = m; document.querySelectorAll('#modBomba .seg button').forEach(function (x) { x.classList.toggle('on', x.dataset.v === m); }); $('modoMedidas').hidden = m !== 'medidas'; $('modoLitros').hidden = m !== 'litros'; };
  $('btnLimpar').addEventListener('click', function () { ['cliente', 'cidade', 'fone'].forEach(function (id) { $(id).value = ''; }); recalcular(); });

  /* PDF: no Electron, a ponte window.dim.gerarPdf() salva o arquivo; no navegador cai na impressao. */
  $('btnPdf').addEventListener('click', function () {
    var cl = cliente();
    var nome = 'Dimensionamento - ' + (cl.nome || 'cliente').replace(/[\/:*?"<>|]/g, '').trim() + ' - ' + new Date().toISOString().slice(0, 10) + '.pdf';
    if (!(window.dim && window.dim.gerarPdf)) { var t = document.title; document.title = nome.replace(/.pdf$/, ''); window.print(); document.title = t; return; }
    $('status').textContent = 'Gerando PDF…';
    window.dim.gerarPdf({ nome: nome, html: $('page').innerHTML, formulario: { f: ler(), cliente: cl } }).then(function (r) {
      if (r && r.ok) {
        $('status').textContent = 'PDF salvo em ' + r.caminho;
        ultimoPdf = r.caminho; $('btnAbrirPdf').hidden = false;
        proximoNumero();
      } else { $('status').textContent = r && r.cancelado ? 'Salvamento cancelado' : 'Falha ao gerar PDF'; }
    });
  });
  $('btnPdf2').addEventListener('click', function () { $('btnPdf').click(); });
  $('btnCopiar').addEventListener('click', function () {
    var ok = function () { $('copiado').textContent = 'Resumo copiado'; setTimeout(function () { $('copiado').textContent = ''; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(resumoTexto).then(ok, function () { $('copiado').textContent = 'Não foi possível copiar'; });
    else { var t = document.createElement('textarea'); t.value = resumoTexto; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (e) {} document.body.removeChild(t); }
  });
  $('btnPasta').addEventListener('click', function () { if (window.dim && window.dim.abrirPasta) window.dim.abrirPasta(); });
  $('btnAbrirPdf').addEventListener('click', function () { if (ultimoPdf && window.dim) window.dim.abrirPdf(ultimoPdf); });
  $('pasta').addEventListener('click', function () { if (window.dim && window.dim.escolherPasta) window.dim.escolherPasta().then(function (p) { $('pasta').textContent = p; }); });

  var ultimoPdf = null;
  function numeroAno(n) { return new Date().getFullYear() + '-' + String(n).padStart(4, '0'); }
  function proximoNumero() { if (window.dim) window.dim.lerConfig().then(function (c) { $('numero').value = numeroAno(c.proximoNumero || 1); }); }
  function carregarConfig() {
    if (!(window.dim && window.dim.lerConfig)) return;
    window.dim.lerConfig().then(function (c) {
      $('pasta').textContent = c.pasta; $('pasta').title = 'Clique para trocar a pasta';
      $('numero').value = numeroAno(c.proximoNumero || 1);
      var u = c.ultimo && c.ultimo.f;
      if (u) {
        modoVolume = u.modoVolume || 'medidas';
        window.__modoVolumeBomba = modoVolume; document.querySelectorAll('#modBomba .seg button').forEach(function (x) { x.classList.toggle('on', x.dataset.v === modoVolume); });
        $('modoMedidas').hidden = modoVolume !== 'medidas'; $('modoLitros').hidden = modoVolume !== 'litros';
        $('litros').value = u.litros; $('pComp').value = u.principal.comprimento; $('pLarg').value = u.principal.largura; $('pProf').value = u.principal.profundidade;
        $('tIni').value = u.tempInicial; $('tDes').value = u.tempDesejada; $('tarifa').value = u.tarifa;
        $('capa').value = u.capa; $('tipo').value = u.tipo; $('vento').value = u.vento; $('hRec').value = u.horasRecirculacao; $('mca').value = u.mca;
        if (c.ultimo.cliente && c.ultimo.cliente.uf) $('uf').value = c.ultimo.cliente.uf;
      }
      recalcular();
    });
  }
  carregarConfig();
  if (!window.dim) { $('pasta').hidden = true; $('btnPasta').hidden = true; $('btnPdf').textContent = 'Salvar PDF'; $('btnPdf2').textContent = 'Salvar PDF'; document.querySelectorAll('.preview-label').forEach(function (e) { e.textContent = 'Prévia do PDF · A4 · 1 página · no Mac, escolha "Salvar como PDF" na janela de impressão'; }); }

  recalcular();
})();


/* ===================== Navegação entre módulos e módulo Gerador de cloro ===================== */
(function () {
  'use strict';
  var CFG = window.DIM_CONFIG, C = window.DimCalc;
  var $ = function (id) { return document.getElementById(id); };
  var fmtInt = function (n) { return Math.round(n).toLocaleString('pt-BR'); };
  var fmt1 = function (n) { return n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); };
  var pct = function (p) { return (p > 0 ? '+' : '') + Math.round(p * 100) + '%'; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ---------- navegação ---------- */
  var titulos = { bomba: ['Dimensionador de bomba de calor', 'Aquecimento de piscina · indicação preliminar'], cloro: ['Dimensionador de gerador de cloro', 'Tratamento da água · indicação preliminar'] };
  var atual = null;
  function sincronizar(para) {
    // Copia cliente e piscina do módulo que estava aberto para o que vai abrir, sem sobrescrever o que já foi digitado.
    var de = para === 'cloro' ? '' : 'c_', pa = para === 'cloro' ? 'c_' : '';
    ['cliente', 'cidade', 'uf', 'fone', 'numero', 'pComp', 'pLarg', 'pProf', 'prComp', 'prLarg', 'prProf', 'litros'].forEach(function (id) {
      var o = $(de + id), d = $(pa + id);
      if (o && d && o.value && !d.dataset.editado) d.value = o.value;
    });
    var oChk = $(de + 'temPrainha'), dChk = $(pa + 'temPrainha');
    if (oChk && dChk) { dChk.checked = oChk.checked; $(pa + 'prainhaBox').hidden = !dChk.checked; }
    var modoOrigem = para === 'cloro' ? window.__modoVolumeBomba : modoVolume;
    if (modoOrigem) { if (para === 'cloro') setModo(modoOrigem); else if (window.__setModoBomba) window.__setModoBomba(modoOrigem); }
  }
  function abrir(mod) {
    if (atual && atual !== mod) sincronizar(mod);
    atual = mod;
    $('home').hidden = true; $('modBomba').hidden = mod !== 'bomba'; $('modCloro').hidden = mod !== 'cloro';
    $('btnHome').hidden = false; $('topTitulo').textContent = titulos[mod][0]; $('topSub').textContent = titulos[mod][1];
    document.title = titulos[mod][0] + ' · ' + CFG.marca.nome;
    if (mod === 'cloro') recalcular(); else if (window.__recalcularBomba) window.__recalcularBomba();
    try { localStorage.setItem('dim_modulo', mod); } catch (e) {}
  }
  function inicio() {
    atual = null;
    $('home').hidden = false; $('modBomba').hidden = true; $('modCloro').hidden = true; $('btnHome').hidden = true;
    $('topTitulo').textContent = 'Dimensionadores Syllent'; $('topSub').textContent = 'Piscinas · indicação preliminar';
    document.title = 'Dimensionadores Syllent · ' + CFG.marca.nome;
  }
  document.querySelectorAll('.home-card').forEach(function (b) { b.addEventListener('click', function () { abrir(b.dataset.mod); }); });
  $('btnHome').addEventListener('click', inicio);
  window.__abrirModulo = abrir;

  /* ---------- módulo cloro ---------- */
  var modoVolume = 'medidas', ultimoPdf = null, resumoTexto = '';
  Object.keys(CFG.clima).sort().forEach(function (uf) { var o = document.createElement('option'); o.value = uf; o.textContent = uf; $('c_uf').appendChild(o); });
  $('c_uf').value = 'MG';

  function setModo(m) {
    modoVolume = m;
    document.querySelectorAll('#c_seg button').forEach(function (x) { x.classList.toggle('on', x.dataset.v === m); });
    $('c_modoMedidas').hidden = m !== 'medidas'; $('c_modoLitros').hidden = m !== 'litros';
  }
  function ler() {
    return {
      modoVolume: modoVolume, litros: $('c_litros').value,
      principal: { comprimento: $('c_pComp').value, largura: $('c_pLarg').value, profundidade: $('c_pProf').value },
      temPrainha: $('c_temPrainha').checked, prainha: { comprimento: $('c_prComp').value, largura: $('c_prLarg').value, profundidade: $('c_prProf').value },
      aquecida: $('c_aquecida').value, tipo: $('c_tipo').value, uso: $('c_uso').value, horasFiltracao: $('c_horas').value,
    };
  }
  function cliente() { return { nome: $('c_cliente').value.trim(), cidade: $('c_cidade').value.trim(), uf: $('c_uf').value, fone: $('c_fone').value.trim(), numero: $('c_numero').value.trim() }; }

  function recalcular() {
    var f = ler(), r = C.dimensionarCloro(CFG, f), cl = cliente();
    $('c_volPreview').textContent = 'Volume considerado: ' + fmtInt(r.volumeLitros) + ' litros.';
    if (!(r.volumeLitros >= 1000)) { $('c_page').innerHTML = ''; $('c_status').textContent = 'Dados incompletos'; return; }
    var nomeGer = r.faixa ? r.faixa.qtd + ' × ' + CFG.cloro.linha + ' ' + r.faixa.modelo : 'Acima da tabela · consultar';
    $('c_finCard').classList.toggle('warn', !r.faixa);
    $('c_finGer').textContent = nomeGer;
    $('c_finGerSub').textContent = r.faixa ? 'faixa de ' + r.faixa.min + ' a ' + r.faixa.max + ' g/h' : 'produção acima de ' + r.maxGh + ' g/h';
    $('c_finGh').textContent = fmt1(r.gh) + ' g/h';
    $('c_finGhSub').textContent = fmtInt(r.ajustado) + ' g/dia em ' + r.horas + ' h de filtração';
    $('c_finChecks').innerHTML = '<span>Cloro base ' + fmtInt(r.base) + ' g/dia</span><span>Ajustes ' + pct(r.pctTotal) + '</span><span>' + fmt1(r.volumeM3) + ' m³ × ' + CFG.cloro.concentracaoBase.toLocaleString('pt-BR') + ' g/m³</span>';
    desenharDocumento(f, r, cl);
    resumoTexto = ['Dimensionamento de gerador de cloro · ' + CFG.marca.nome,
      cl.nome ? 'Cliente: ' + cl.nome + (cl.cidade ? ' · ' + cl.cidade : '') + '/' + cl.uf : null,
      'Piscina: ' + fmtInt(r.volumeLitros) + ' L · ' + (f.aquecida === 'sim' ? 'aquecida' : 'não aquecida') + ' · ' + f.tipo + ' · uso ' + (CFG.cloro.usos[f.uso] || f.uso).toLowerCase(),
      'Produção necessária: ' + fmt1(r.gh) + ' g/h (' + fmtInt(r.ajustado) + ' g/dia em ' + r.horas + ' h de filtração)',
      'Gerador: ' + nomeGer].filter(Boolean).join(String.fromCharCode(10));
    $('c_status').textContent = 'Atualizado ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function desenharDocumento(f, r, cl) {
    var h = '';
    h += '<div class="doc-head">' +
      '<div class="t"><strong>Dimensionamento de gerador de cloro</strong><span>Indicação preliminar para piscina · ' + esc(CFG.marca.nome) + '</span></div>' +
      '<img class="sy" src="../../assets/logo-syllent.png" alt="Syllent" /></div>';
    h += '<div class="doc-meta"><span>Cliente: <b>' + esc(cl.nome || '—') + '</b></span><span>Data: <b>' + new Date().toLocaleDateString('pt-BR') + '</b></span>' +
      '<span>Local: <b>' + esc((cl.cidade ? cl.cidade + ' / ' : '') + cl.uf) + '</b></span><span>Orçamento nº: <b>' + esc(cl.numero || '—') + '</b></span></div>';
    var nomeGer = r.faixa ? r.faixa.qtd + ' × ' + CFG.cloro.linha + ' ' + r.faixa.modelo : 'Acima da tabela · consultar a engenharia';
    h += '<div class="doc-main' + (r.faixa ? '' : ' warn') + '"><div><div class="k">Gerador indicado</div><div class="v">' + esc(nomeGer) + '</div><div class="s">' + (r.faixa ? 'Faixa de ' + r.faixa.min + ' a ' + r.faixa.max + ' g/h · linha ' + esc(CFG.cloro.linha) : 'Produção necessária acima de ' + r.maxGh + ' g/h') + '</div></div>' +
      '<div class="b"><div class="k">Produção necessária</div><div class="v">' + fmt1(r.gh) + ' g/h</div></div></div>';
    h += '<div class="doc-kpis">' +
      kpi('Cloro base', fmtInt(r.base), 'g/dia', fmt1(r.volumeM3) + ' m³ × ' + CFG.cloro.concentracaoBase.toLocaleString('pt-BR') + ' g/m³') +
      kpi('Cloro ajustado', fmtInt(r.ajustado), 'g/dia', 'ajustes ' + pct(r.pctTotal) + ' sobre a base') +
      kpi('Filtração', r.horas, 'h/dia', 'produção = cloro ajustado ÷ horas') + '</div>';
    h += '<div class="doc-h">Ajustes aplicados</div><table class="doc-tab">';
    r.ajustes.forEach(function (a) { h += tr(a.nome, pct(a.pct) + (a.g ? ' · ' + fmt1(a.g) + ' g/dia' : '')); });
    if (f.aquecida !== 'sim') h += tr('Piscina não aquecida', '+0%');
    if (f.tipo !== 'aberta') h += tr('Piscina fechada', '+0%');
    h += '</table>';
    h += '<div class="doc-h">Tabela de faixas</div><table class="doc-tab doc-faixas">';
    var faixas = CFG.cloro.faixas, cols = 2, por = Math.ceil(faixas.length / cols);
    for (var i = 0; i < por; i++) {
      h += '<tr>';
      for (var c = 0; c < cols; c++) { var fx = faixas[i + c * por]; if (fx) h += '<th>' + fx.min + ' a ' + fx.max + ' g/h</th><td' + (fx === r.faixa ? ' class="sel"' : '') + '>' + fx.qtd + ' × ' + esc(fx.modelo) + '</td>'; else h += '<th></th><td></td>'; }
      h += '</tr>';
    }
    h += '</table>';
    h += '<div class="doc-h">Dados considerados</div><table class="doc-tab">' +
      tr('Volume total', fmtInt(r.volumeLitros) + ' litros' + (f.modoVolume === 'medidas' ? ' (' + f.principal.comprimento + ' × ' + f.principal.largura + ' × ' + f.principal.profundidade + ' m' + (f.temPrainha ? ' + prainha' : '') + ')' : '')) +
      tr('Condição', (f.aquecida === 'sim' ? 'aquecida' : 'não aquecida') + ' · ' + f.tipo + ' · uso ' + (CFG.cloro.usos[f.uso] || f.uso).toLowerCase()) +
      tr('Filtração', r.horas + ' h/dia') + '</table>';
    h += '<div class="doc-foot"><span>' + esc(CFG.marca.nome) + ' · representante ' + esc(CFG.marca.fabricante) + '</span><span>Resultado preliminar, sem valor de projeto executivo ou garantia de desempenho.</span></div>';
    $('c_page').innerHTML = h;
  }
  function kpi(k, v, u, c) { return '<div class="doc-kpi"><div class="k">' + k + '</div><div class="v">' + v + ' <small>' + u + '</small></div><div class="c">' + c + '</div></div>'; }
  function tr(k, v) { return '<tr><th>' + k + '</th><td>' + v + '</td></tr>'; }

  /* eventos */
  document.querySelectorAll('#c_seg button').forEach(function (b) { b.addEventListener('click', function () { setModo(b.dataset.v); recalcular(); }); });
  $('c_temPrainha').addEventListener('change', function () { $('c_prainhaBox').hidden = !this.checked; });
  document.querySelectorAll('#modCloro input, #modCloro select').forEach(function (el) {
    el.addEventListener('input', function () { el.dataset.editado = '1'; recalcular(); });
    el.addEventListener('change', recalcular);
  });
  $('c_btnPdf').addEventListener('click', function () {
    var cl = cliente();
    var nome = 'Gerador de cloro - ' + (cl.nome || 'cliente').replace(/[\\/:*?"<>|]/g, '').trim() + ' - ' + new Date().toISOString().slice(0, 10) + '.pdf';
    if (!(window.dim && window.dim.gerarPdf)) { var t = document.title; document.title = nome.replace(/\.pdf$/, ''); window.print(); document.title = t; return; }
    $('c_status').textContent = 'Gerando PDF…';
    window.dim.gerarPdf({ nome: nome, html: $('c_page').innerHTML, formulario: null }).then(function (r) {
      if (r && r.ok) { $('c_status').textContent = 'PDF salvo em ' + r.caminho; ultimoPdf = r.caminho; $('c_btnAbrirPdf').hidden = false; }
      else $('c_status').textContent = r && r.cancelado ? 'Salvamento cancelado' : 'Falha ao gerar PDF';
    });
  });
  $('c_btnPdf2').addEventListener('click', function () { $('c_btnPdf').click(); });
  $('c_btnAbrirPdf').addEventListener('click', function () { if (ultimoPdf && window.dim) window.dim.abrirPdf(ultimoPdf); });
  $('c_btnPasta').addEventListener('click', function () { if (window.dim && window.dim.abrirPasta) window.dim.abrirPasta(); });
  $('c_pasta').addEventListener('click', function () { if (window.dim && window.dim.escolherPasta) window.dim.escolherPasta().then(function (p) { $('c_pasta').textContent = p; $('pasta').textContent = p; }); });
  $('c_btnCopiar').addEventListener('click', function () {
    var ok = function () { $('c_copiado').textContent = 'Resumo copiado'; setTimeout(function () { $('c_copiado').textContent = ''; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(resumoTexto).then(ok, function () { $('c_copiado').textContent = 'Não foi possível copiar'; });
  });
  if (window.dim && window.dim.lerConfig) window.dim.lerConfig().then(function (c) { $('c_pasta').textContent = c.pasta; });
  if (!window.dim) { $('c_pasta').hidden = true; $('c_btnPasta').hidden = true; $('c_btnPdf').textContent = 'Salvar PDF'; $('c_btnPdf2').textContent = 'Salvar PDF'; }

  recalcular();
  // Em modo de teste automatizado, abre direto a bomba de calor para o smoke test continuar valendo.
  if (window.__modoTeste) abrir('bomba');
})();
