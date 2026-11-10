/* main.js — lê tudo de window.DADOS (dados.js). Sem bibliotecas. */
(function () {
  "use strict";
  var D = window.DADOS || {};
  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  }
  function juntar(arr) { return arr.length < 2 ? (arr[0] || "") : arr.slice(0, -1).join(", ") + " e " + arr[arr.length - 1]; }

  /* ---------- WhatsApp: UMA função monta todos os links ---------- */
  function waLink(origem, vars) {
    var msg = (D.mensagens && D.mensagens[origem]) || (D.mensagens && D.mensagens.rodape) || "";
    Object.keys(vars || {}).forEach(function (k) { msg = msg.split("{" + k + "}").join(vars[k]); });
    return "https://wa.me/" + D.whatsapp + "?text=" + encodeURIComponent(msg);
  }

  /* ---------- Dados do dados.js no HTML ---------- */
  function cidades() {
    var c = [];
    (D.locais || []).forEach(function (l) { if (c.indexOf(l.cidade) < 0) c.push(l.cidade); });
    return juntar(c);
  }
  /* Itens opcionais: somem se o dado estiver vazio no dados.js (ex.: registro profissional) */
  $$("[data-se]").forEach(function (el) { if (!get(el.getAttribute("data-se"))) el.hidden = true; });
  $$("[data-bind]").forEach(function (el) {
    var k = el.getAttribute("data-bind");
    var v = k === "cidades" ? cidades() : get(k);
    if (v) el.textContent = v;
  });
  $$("[data-wa]").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa")); });
  $$("[data-ig]").forEach(function (a) { a.href = "https://www.instagram.com/" + D.instagram + "/"; });
  if (D.agenda && D.agenda.url) { var alk = $("#abrir-agenda"); if (alk) alk.href = D.agenda.url; }
  if (!(D.flags && D.flags.mostrarPreco)) $$("[data-preco]").forEach(function (e) { e.hidden = true; e.style.display = "none"; });

  /* Provas reais (só com flag e dados) */
  if (D.flags && D.flags.mostrarProvas && D.provas && D.provas.length) {
    var sp = $("#provas"), lista = $("#provas-lista");
    D.provas.forEach(function (p) {
      var f = document.createElement("blockquote"); f.className = "prova-item";
      var t = document.createElement("p"); t.textContent = p.texto;
      var c = document.createElement("cite"); c.textContent = p.autor + (p.fonte ? " · " + p.fonte : "");
      f.appendChild(t); f.appendChild(c); lista.appendChild(f);
    });
    sp.hidden = false;
  }

  /* Locais: o botão agenda direto naquele local */
  var cont = $("#locais-lista");
  (D.locais || []).forEach(function (l) {
    var d = document.createElement("div"); d.className = "local";
    var q = encodeURIComponent(l.endereco);
    d.innerHTML = '<div class="local-foto" hidden></div><div class="local-txt"><h3></h3><p class="cidade"></p><p class="desc"></p><p class="end"></p><p class="hor"></p><p class="ace"></p><div class="acoes"></div></div>';
    d.querySelector("h3").textContent = l.nome;
    if (l.descricao) d.querySelector(".desc").textContent = l.descricao; else d.querySelector(".desc").remove();
    if (l.foto) {
      var lf = d.querySelector(".local-foto"), im = new Image();
      im.alt = "Local de atendimento: " + l.nome;
      im.onload = function () { lf.appendChild(im); lf.hidden = false; };
      im.src = l.foto;
    }
    d.querySelector(".cidade").textContent = l.cidade;
    d.querySelector(".end").textContent = l.endereco;
    if (l.horarios) d.querySelector(".hor").textContent = "Horários: " + l.horarios; else d.querySelector(".hor").remove();
    if (l.acesso) d.querySelector(".ace").textContent = "Acesso: " + l.acesso; else d.querySelector(".ace").remove();
    var ac = d.querySelector(".acoes");
    var rota = document.createElement("a");
    rota.className = "btn btn-ghost"; rota.target = "_blank"; rota.rel = "noopener";
    rota.href = l.mapsUrl || "https://www.google.com/maps/dir/?api=1&destination=" + q;
    rota.setAttribute("data-origem", "local-rota");
    rota.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-pin"/></svg> Traçar rota';
    var ag = document.createElement("a");
    ag.className = "btn btn-ouro"; ag.href = "#agendar";
    ag.setAttribute("data-origem", "local-agendar-" + l.nome);
    ag.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-cal"/></svg> Agendar neste local';
    ag.addEventListener("click", function () {
      E.cidade = l.cidade; salvar();
      var fc = $("#f-cidade"); if (fc) fc.value = l.cidade;
    });
    ac.appendChild(rota); ac.appendChild(ag);
    cont.appendChild(d);
  });

  /* ---------- Copiar (chave Pix, Pix copia e cola, resumo da queixa) ---------- */
  function copiar(botao, texto, rotulo) {
    var ok = function () { botao.textContent = "Copiado"; setTimeout(function () { botao.textContent = rotulo; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(texto).then(ok, function () {}); return; }
    var ta = document.createElement("textarea"); ta.value = texto; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) {}
    ta.remove();
  }
  /* Pix "copia e cola" (BR Code estático com valor). Chave de celular entra como +55. */
  function crc16(s) {
    var c = 0xFFFF;
    for (var i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (var j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF; }
    return ("0000" + c.toString(16).toUpperCase()).slice(-4);
  }
  function tlv(id, v) { return id + ("0" + v.length).slice(-2) + v; }
  function semAcento(t) { return t.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase(); }
  window.__pixCopiaECola = function (p) {
    var chave = /^\d{11}$/.test(p.chave) ? "+55" + p.chave : p.chave;
    var conta = tlv("00", "br.gov.bcb.pix") + tlv("01", chave);
    var corpo = tlv("00", "01") + tlv("01", "11") + tlv("26", conta) + tlv("52", "0000") + tlv("53", "986") +
      tlv("54", p.valorNumero.toFixed(2)) + tlv("58", "BR") + tlv("59", semAcento(p.favorecido).slice(0, 25)) +
      tlv("60", semAcento(p.cidade).slice(0, 15)) + tlv("62", tlv("05", "***")) + "6304";
    return corpo + crc16(corpo);
  };
  var bcp = $("#copiar-pix"), bcc = $("#copiar-pixcc");
  if (D.pix && D.pix.chave) {
    bcp.hidden = false;
    bcp.addEventListener("click", function () { copiar(bcp, D.pix.chave, "Copiar chave Pix"); });
    if (D.pix.copiaECola && D.pix.valorNumero) {
      bcc.hidden = false;
      bcc.addEventListener("click", function () { copiar(bcc, window.__pixCopiaECola(D.pix), "Copiar Pix copia e cola (já com o valor)"); });
    }
  }

  /* Fotos reais: só entram se o caminho estiver preenchido e o arquivo existir */
  function foto(id, src, alt) {
    var el = document.getElementById(id); if (!src || !el) return;
    var im = new Image(); im.alt = alt; im.decoding = "async";
    im.onload = function () { el.innerHTML = ""; el.appendChild(im); el.classList.add("tem-foto"); el.hidden = false; };
    im.src = src;
  }
  var F = D.fotos || {};
  foto("foto-rafael", F.rafael, "Rafael Bicudo, quiropraxista");
  foto("foto-quem", F.quem, "Rafael Bicudo atendendo");
  foto("foto-atendimento", F.atendimento, "Atendimento de quiropraxia com Rafael Bicudo");

  /* Vídeo da consulta: mudo, em loop, só carrega e toca quando aparece na tela */
  var VV = D.videos || {}, vf = $("#video-consulta");
  if (VV.consulta && vf) {
    var vd = vf.querySelector("video");
    vf.hidden = false;
    vd.setAttribute("aria-label", "Trecho de um atendimento de quiropraxia, sem som");
    if (reduzir || !("IntersectionObserver" in window)) {
      vd.controls = true; vd.preload = "metadata"; vd.src = VV.consulta;
    } else {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) {
            if (!vd.getAttribute("src")) vd.src = VV.consulta;
            var p = vd.play(); if (p && p.catch) p.catch(function () { vd.controls = true; });
          } else { vd.pause(); }
        });
      }, { threshold: 0.35 }).observe(vd);
    }
  }

  var anoEl = $("#ano"); if (anoEl) anoEl.textContent = new Date().getFullYear();

  /* =====================================================================
     AGENDAMENTO EM 4 PASSOS
     1 Onde dói -> 1ª mensagem (queixa)   2 Horário e cidade na agenda do Rafael
     3 Pix da reserva                     4 Mensagem completa (queixa, horário, cidade)
     O comprovante do Pix é enviado depois, quando o Rafael confirmar o horário.
     O que a pessoa digita fica só no aparelho (localStorage, 3 dias), para ela poder
     abrir o WhatsApp, a agenda ou o banco e voltar sem perder nada.
     ===================================================================== */
  var CHAVE = "agendamento-v2", TTL = 72 * 3600 * 1000;
  var E = { passo: 1, regioes: [], det: "", nome: "", data: "", hora: "", cidade: "", abriu: false, enviouEm: 0, horarioEnviado: "", t: 0 };
  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (salvo && Date.now() - salvo.t < TTL) E = Object.assign(E, salvo);
  } catch (e) {}
  function salvar() { E.t = Date.now(); try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch (e) {} }

  /* --- Passo 1: onde dói (pode marcar várias regiões) + 1ª mensagem --- */
  var R = D.regioes || {};
  E.regioes = (E.regioes || []).filter(function (k) { return R[k]; });
  var chips = $$(".chip"), spots = $$(".spot");
  var tit = $("#regiao-titulo"), txt = $("#regiao-texto"), wrap = $(".regiao-corpo-wrap");
  var TIT_PADRAO = tit.textContent, TXT_PADRAO = txt.innerHTML, timerReg;
  var p1prox = $("#p1-prox"), p1dica = $("#p1-dica"), fDet = $("#f-det"), detCont = $("#det-cont"), MIN_DET = 20;
  function rotulos() { return E.regioes.map(function (k) { return R[k].rotulo; }); }
  function queixaTexto() { return juntar(rotulos()) + (E.det ? ". Relato: " + E.det : ""); }
  /* Passo 1 só avança com região marcada E descrição do que a pessoa sente (mínimo de caracteres) */
  function detOk() { return (E.det || "").length >= MIN_DET; }
  function atualizarP1() {
    var faltam = MIN_DET - (E.det || "").length, ok = E.regioes.length > 0 && faltam <= 0;
    p1prox.disabled = !ok;
    detCont.textContent = faltam > 0 ? "Faltam " + faltam + " caracteres." : "Obrigado, isso ajuda o Rafael.";
    p1dica.textContent = !E.regioes.length ? "Marque pelo menos uma região no bonequinho." : (faltam > 0 ? "Descreva o que você sente para continuar." : "");
    p1dica.hidden = ok;
  }
  function atualizarRegioes(animar) {
    var tem = function (el) { return E.regioes.indexOf(el.getAttribute("data-regiao")) >= 0; };
    chips.forEach(function (c) { c.setAttribute("aria-pressed", tem(c) ? "true" : "false"); });
    spots.forEach(function (s) { s.classList.toggle("on", tem(s)); });
    atualizarP1();
    var trocar = function () {
      if (!E.regioes.length) { tit.textContent = TIT_PADRAO; txt.innerHTML = TXT_PADRAO; }
      else {
        tit.textContent = E.regioes.length === 1 ? R[E.regioes[0]].titulo : E.regioes.length + " regiões escolhidas";
        txt.innerHTML = "";
        E.regioes.forEach(function (k) {
          var p = document.createElement("p");
          if (E.regioes.length > 1) { var b = document.createElement("strong"); b.textContent = R[k].titulo + ". "; p.appendChild(b); }
          p.appendChild(document.createTextNode(R[k].texto)); txt.appendChild(p);
        });
      }
      wrap.classList.remove("fechado");
    };
    clearTimeout(timerReg);
    if (!animar || reduzir) { trocar(); return; }
    wrap.classList.add("fechado");
    timerReg = setTimeout(trocar, 200);
  }
  function alternar(chave) {
    if (!R[chave]) return;
    var i = E.regioes.indexOf(chave);
    if (i >= 0) E.regioes.splice(i, 1); else E.regioes.push(chave);
    salvar(); atualizarRegioes(true);
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { alternar(c.getAttribute("data-regiao")); }); });
  spots.forEach(function (s) { s.addEventListener("click", function () { alternar(s.getAttribute("data-regiao")); }); });
  fDet.addEventListener("input", function () { E.det = fDet.value.trim(); salvar(); atualizarP1(); });
  p1prox.addEventListener("click", function () { if (E.regioes.length && detOk()) irPara(2, true); });

  /* --- Navegação entre os passos --- */
  var paineis = $$(".wiz-painel"), itens = $$("#wiz-barra li"), status = $("#wiz-status"), topoWiz = $("#wiz-topo");
  var NOMES = ["Onde dói", "Horário e cidade", "Mensagem ao Rafael", "Pix da reserva"];
  function irPara(n, rolar) {
    if (n < 1) n = 1;
    if (n > 1 && (!E.regioes.length || !detOk())) n = 1;
    E.passo = n;
    paineis.forEach(function (p) { p.classList.toggle("ativo", +p.getAttribute("data-passo") === n); });
    itens.forEach(function (li) {
      var i = +li.getAttribute("data-n");
      li.classList.toggle("atual", i === n); li.classList.toggle("feito", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    status.textContent = "Passo " + n + " de 4: " + NOMES[n - 1];
    if (n === 2) mostrarAvisoVolta();
    if (n !== 3) clearInterval(timerCron);
    if (n === 3) preencherFinal();
    if (n === 4) montarComprovante();
    salvar();
    if (rolar) {
      topoWiz.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
      var h = $(".wiz-painel.ativo .wiz-tit");
      if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, reduzir ? 0 : 400);
    }
  }
  $$("[data-voltar]").forEach(function (b) { b.addEventListener("click", function () { irPara(E.passo - 1, true); }); });

  /* --- Passo 2: abrir a agenda (uma aba) e confirmar horário e cidade --- */
  var avisoVolta = $("#aviso-volta"), abrirAg = $("#abrir-agenda"), formH = $("#form-horario");
  var fData = $("#f-data"), fHora = $("#f-hora"), fCidade = $("#f-cidade"), fNome = $("#f-nome"), erro = $("#f-erro");
  var cidadesLista = [];
  (D.locais || []).forEach(function (l) { if (cidadesLista.indexOf(l.cidade) < 0) cidadesLista.push(l.cidade); });
  cidadesLista.forEach(function (c) { var o = document.createElement("option"); o.value = c; o.textContent = c; fCidade.appendChild(o); });
  function hoje() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  fData.min = hoje();
  function dataBonita(iso) {
    var p = iso.split("-"), d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString("pt-BR", { weekday: "long" }) + ", " + p[2] + "/" + p[1];
  }
  /* Depois que a pessoa abriu a agenda, ao voltar para esta aba destacamos o que falta preencher */
  function mostrarAvisoVolta() {
    var abriu = !!E.abriu;
    avisoVolta.hidden = !abriu; formH.classList.toggle("destaque-form", abriu);
  }
  abrirAg.addEventListener("click", function () { E.abriu = true; salvar(); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && E.passo === 2) mostrarAvisoVolta(); });
  window.addEventListener("focus", function () { if (E.passo === 2) mostrarAvisoVolta(); });
  var bres = $("#copiar-resumo");
  bres.addEventListener("click", function () { copiar(bres, "Queixa: " + queixaTexto(), "Copiar resumo da queixa"); });
  function lerHorario() { E.nome = fNome.value.trim(); E.data = fData.value; E.hora = fHora.value; E.cidade = fCidade.value; }
  [fData, fHora, fCidade, fNome].forEach(function (c) { c.addEventListener("input", function () { lerHorario(); salvar(); }); c.addEventListener("change", function () { lerHorario(); salvar(); }); });
  $("#p2-prox").addEventListener("click", function () {
    lerHorario();
    var msg = null, alvo = null;
    if (!E.data) { msg = "Escolha o dia que você reservou na agenda."; alvo = fData; }
    else if (E.data < hoje()) { msg = "Esse dia já passou. Confira a data."; alvo = fData; }
    else if (!E.hora) { msg = "Escolha o horário que você reservou."; alvo = fHora; }
    else if (!E.cidade) { msg = "Escolha a cidade de atendimento."; alvo = fCidade; }
    if (msg) { erro.textContent = msg; erro.hidden = false; alvo.focus(); return; }
    erro.hidden = true; irPara(3, true);
  });

  /* --- Passo 3: mensagem completa (queixa, horário e cidade), pedindo a confirmação --- */
  $("#p3-prox").addEventListener("click", function () { irPara(4, true); });
  var enviar = $("#final-enviar"), resumo = $("#resumo-final"), okMsg = $("#f-ok");
  function montarMensagem() {
    return waLink("agendamento", {
      valor: (D.pix && D.pix.valor) || "",
      queixa: queixaTexto(),
      horario: dataBonita(E.data) + " às " + E.hora,
      cidade: E.cidade,
      nome: E.nome ? "\n*Nome:* " + E.nome : ""
    });
  }
  function chaveHorario() { return E.data + "|" + E.hora + "|" + E.cidade; }
  function preencherFinal() {
    if (E.enviouEm && E.horarioEnviado !== chaveHorario()) { E.enviouEm = 0; E.horarioEnviado = ""; salvar(); }
    okMsg.hidden = true;
    enviar.href = montarMensagem();
    iniciarCron();
    resumo.innerHTML = "";
    [["Queixa", queixaTexto()], ["Horário", dataBonita(E.data) + " às " + E.hora], ["Cidade", E.cidade],
     ["Reserva", "Pix de " + ((D.pix && D.pix.valor) || "") + " depois que o Rafael confirmar o horário."]].forEach(function (l) {
      var p = document.createElement("p"), b = document.createElement("strong");
      b.textContent = l[0] + ": "; p.appendChild(b); p.appendChild(document.createTextNode(l[1])); resumo.appendChild(p);
    });
  }
  enviar.addEventListener("click", function () {
    enviar.href = montarMensagem(); okMsg.hidden = false;
    if (PRAZO && !E.enviouEm) { E.enviouEm = Date.now(); E.horarioEnviado = chaveHorario(); salvar(); }
    iniciarCron();
  });

  /* Cronômetro do prazo REAL: o Rafael segura o horário por N minutos depois do envio (dados.js, reserva.prazoMinutos) */
  var PRAZO = (((D.reserva && D.reserva.prazoMinutos) || 0) * 60000);
  var cron = $("#cronometro"), cronTempo = $("#cron-tempo"), cronFim = $("#cron-fim"), cronOutro = $("#cron-outro"), timerCron;
  $("#cron-obs").textContent = "O Rafael segura o horário escolhido por " + ((D.reserva && D.reserva.prazoMinutos) || 0) +
    " minutos, contados a partir do primeiro envio da mensagem, esperando a confirmação dele. Depois disso, o horário pode ser liberado para outra pessoa.";
  function desenharCron() {
    if (!PRAZO || !E.enviouEm) { cron.hidden = true; return; }
    cron.hidden = false;
    var resta = E.enviouEm + PRAZO - Date.now();
    if (resta <= 0) {
      cronTempo.textContent = "00:00"; cron.classList.add("acabou"); cronFim.hidden = false; cronOutro.hidden = false;
      clearInterval(timerCron); return;
    }
    cron.classList.remove("acabou"); cronFim.hidden = true; cronOutro.hidden = true;
    var s = Math.ceil(resta / 1000);
    cronTempo.textContent = ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2);
  }
  function iniciarCron() {
    clearInterval(timerCron); desenharCron();
    if (PRAZO && E.enviouEm && E.enviouEm + PRAZO > Date.now()) timerCron = setInterval(desenharCron, 1000);
  }
  cronOutro.addEventListener("click", function () { E.enviouEm = 0; E.horarioEnviado = ""; salvar(); irPara(2, true); });

  /* --- Passo 4: Pix (depois da confirmação) e envio do comprovante --- */
  var comprovanteBtn = $("#comprovante-enviar");
  function montarComprovante() {
    comprovanteBtn.href = waLink("comprovante", {
      valor: (D.pix && D.pix.valor) || "",
      horario: dataBonita(E.data) + " às " + E.hora,
      cidade: E.cidade
    });
  }
  $("#reiniciar").addEventListener("click", function () {
    E = { passo: 1, regioes: [], det: "", nome: "", data: "", hora: "", cidade: "", abriu: false, enviouEm: 0, horarioEnviado: "", t: 0 };
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    clearInterval(timerCron); cron.hidden = true;
    fDet.value = ""; fData.value = ""; fHora.value = ""; fCidade.value = ""; fNome.value = "";
    atualizarRegioes(false); irPara(1, true);
  });

  /* Estado inicial (restaura o que a pessoa já tinha feito) */
  fDet.value = E.det; fData.value = E.data; fHora.value = E.hora; fCidade.value = E.cidade; fNome.value = E.nome;
  atualizarRegioes(false);
  irPara(E.passo, false);

  /* ---------- Coluna vertebral: alinha conforme a rolagem ---------- */
  var spine = $("#spine"), fin = $("#final"), fim = 1;
  function medir() {
    fim = fin.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
    progresso();
  }
  function progresso() {
    var p = fim <= 0 ? 1 : Math.min(1, Math.max(0, window.scrollY / fim));
    spine.style.setProperty("--p", p.toFixed(3));
    spine.classList.toggle("alinhada", p >= 0.985);
  }
  if (reduzir) {
    spine.style.setProperty("--p", "1"); spine.classList.add("alinhada");
  } else {
    medir();
    window.addEventListener("scroll", progresso, { passive: true });
    window.addEventListener("resize", medir);
    window.addEventListener("load", medir);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
  }

  /* Barra fixa some quando o agendamento ou o CTA final estão na tela (nunca cobre o que importa) */
  var barra = $("#barra-fixa"), visiveis = 0;
  if ("IntersectionObserver" in window) {
    var ioBarra = new IntersectionObserver(function (es) {
      es.forEach(function (e) { visiveis += e.isIntersecting ? 1 : -1; });
      barra.classList.toggle("oculta", visiveis > 0);
    }, { threshold: 0.1 });
    ioBarra.observe($("#agendar")); ioBarra.observe(fin);
  }

  /* ---------- Menu: indicador da seção atual e folha de menu no celular ---------- */
  var navLinks = $$(".nav a"), navSecs = navLinks.map(function (a) { return $(a.getAttribute("href")); });
  function marcarAtivo() {
    var lim = window.innerHeight * 0.35, cur = -1;
    navSecs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= lim) cur = i; });
    navLinks.forEach(function (a, i) {
      a.classList.toggle("ativo", i === cur);
      if (i === cur) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", marcarAtivo, { passive: true });
  marcarAtivo();

  var menu = $("#menu"), burger = $("#burger"), fechar = $("#menu-fechar");
  function abrirMenu(ab) {
    menu.classList.toggle("aberto", ab);
    menu.setAttribute("aria-hidden", ab ? "false" : "true");
    burger.setAttribute("aria-expanded", ab ? "true" : "false");
    document.body.style.overflow = ab ? "hidden" : "";
    if (ab) fechar.focus(); else burger.focus();
  }
  function fecharSemFoco() {
    menu.classList.remove("aberto"); menu.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
  }
  if (menu && burger) {
    burger.addEventListener("click", function () { abrirMenu(true); });
    fechar.addEventListener("click", function () { abrirMenu(false); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", fecharSemFoco); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("aberto")) abrirMenu(false); });
  }

  /* ---------- Entradas discretas: só passos, locais, "para quem" e FAQ ---------- */
  if (!reduzir && "IntersectionObserver" in window) {
    var alvos = $$(".passos li, .duas > div, .local, .faq-lista details");
    alvos.forEach(function (a) {
      var irmaos = Array.prototype.slice.call(a.parentNode.children);
      a.style.setProperty("--i", irmaos.indexOf(a) % 4);
      a.classList.add("rv");
    });
    var ioRv = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ioRv.unobserve(e.target); } });
    }, { threshold: 0.12 });
    alvos.forEach(function (a) { ioRv.observe(a); });
    setTimeout(function () { alvos.forEach(function (a) { a.classList.add("in"); }); }, 5000); /* garantia: nada fica invisível */
  }

  /* ---------- Rastreamento (desligado sem ID; GA4/Pixel só após aceite) ---------- */
  var T = D.rastreamento || {};
  var consentido = false;
  try { consentido = localStorage.getItem("consent-rastreio") === "sim"; } catch (e) {}
  function carregar(src, cb) { var s = document.createElement("script"); s.async = true; s.src = src; if (cb) s.onload = cb; document.head.appendChild(s); }
  function ligarRastreio() {
    if (T.ga4) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", T.ga4);
      carregar("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(T.ga4));
    }
    if (T.metaPixel) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", T.metaPixel); window.fbq("track", "PageView");
    }
  }
  if (T.ga4 || T.metaPixel) {
    if (consentido) ligarRastreio();
    else {
      var cb = document.createElement("div"); cb.className = "consent";
      cb.innerHTML = '<p>Posso usar cookies de medição para saber quais botões ajudam mais? Nada pessoal é guardado por mim.</p><div><button type="button" class="btn btn-ouro" data-c="sim">Aceitar</button> <button type="button" class="btn btn-ghost-dark" data-c="nao">Recusar</button></div>';
      document.body.appendChild(cb);
      cb.addEventListener("click", function (e) {
        var c = e.target.getAttribute && e.target.getAttribute("data-c"); if (!c) return;
        try { localStorage.setItem("consent-rastreio", c); } catch (x) {}
        if (c === "sim") ligarRastreio();
        cb.remove();
      });
    }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-origem]"); if (!a) return;
    var origem = a.getAttribute("data-origem"), wa = a.hasAttribute("data-wa") || a.id === "final-enviar";
    if (window.gtag) window.gtag("event", wa ? "click_whatsapp" : "click_cta", { origem: origem });
    if (window.fbq && wa) window.fbq("track", "Contact", { origem: origem });
  });
})();
