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
  function waLink(numero, texto) { return "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto); }
  function waGeral() { return waLink(D.whatsapp, (D.mensagens && D.mensagens.geral) || ""); }
  function numeroDoLocal(l) { return l.whatsapp || D.whatsapp; }   /* sem número próprio, usa o principal */

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
  $$("[data-wa]").forEach(function (a) { a.href = waGeral(); });
  $$("[data-ig]").forEach(function (a) { a.href = "https://www.instagram.com/" + D.instagram + "/"; });

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

  /* =====================================================================
     AGENDAMENTO EM 3 PASSOS: 1 Onde dói (com relato)  2 Local  3 WhatsApp
     Escolher o local abre o WhatsApp daquele local com a dor e o pedido de horário.
     O que a pessoa digita fica só no aparelho (localStorage, 3 dias).
     ===================================================================== */
  var CHAVE = "agendamento-v3", TTL = 72 * 3600 * 1000, MIN_DET = 20;
  var E = { passo: 1, regioes: [], det: "", local: "", t: 0 };
  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (salvo && Date.now() - salvo.t < TTL) E = Object.assign(E, salvo);
  } catch (e) {}
  function salvar() { E.t = Date.now(); try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch (e) {} }

  var R = D.regioes || {};
  E.regioes = (E.regioes || []).filter(function (k) { return R[k]; });
  function rotulos() { return E.regioes.map(function (k) { return R[k].rotulo; }); }
  function queixaTexto() {
    if (!E.regioes.length) return "";
    return juntar(rotulos()) + (E.det ? ". Relato: " + E.det : "");
  }
  function localPorNome(n) { var r = null; (D.locais || []).forEach(function (l) { if (l.nome === n) r = l; }); return r; }
  function nomeCompleto(l) { return l.nome + " (" + l.etiqueta + ")"; }
  /* Link do WhatsApp para um local, com a dor se a pessoa já contou */
  function linkLocal(l) {
    var q = queixaTexto(), m = D.mensagens || {};
    var texto = (q ? m.agendar : m.agendarSemQueixa).split("{local}").join(nomeCompleto(l)).split("{queixa}").join(q);
    return waLink(numeroDoLocal(l), texto);
  }

  /* --- Passo 1: onde dói (várias regiões) e relato obrigatório --- */
  var chips = $$(".chip"), spots = $$(".spot");
  var tit = $("#regiao-titulo"), txt = $("#regiao-texto"), wrap = $(".regiao-corpo-wrap");
  var TIT_PADRAO = tit.textContent, TXT_PADRAO = txt.innerHTML, timerReg;
  var p1prox = $("#p1-prox"), p1dica = $("#p1-dica"), fDet = $("#f-det"), detCont = $("#det-cont");
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
  var NOMES = ["Onde dói", "Local de atendimento", "WhatsApp"];
  function irPara(n, rolar) {
    if (n < 1) n = 1;
    if (n > 1 && (!E.regioes.length || !detOk())) n = 1;
    if (n === 3 && !E.local) n = 2;
    E.passo = n;
    paineis.forEach(function (p) { p.classList.toggle("ativo", +p.getAttribute("data-passo") === n); });
    itens.forEach(function (li) {
      var i = +li.getAttribute("data-n");
      li.classList.toggle("atual", i === n); li.classList.toggle("feito", i < n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    status.textContent = "Passo " + n + " de 3: " + NOMES[n - 1];
    if (n === 2) desenharOpcoes();
    if (n === 3) desenharResumo();
    salvar();
    if (rolar) {
      topoWiz.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
      var h = $(".wiz-painel.ativo .wiz-tit");
      if (h) setTimeout(function () { h.focus({ preventScroll: true }); }, reduzir ? 0 : 400);
    }
  }
  $$("[data-voltar]").forEach(function (b) { b.addEventListener("click", function () { irPara(E.passo - 1, true); }); });

  /* --- Passo 2: escolher o local (abre o WhatsApp daquele local) --- */
  var opcoes = $("#escolha-local");
  function desenharOpcoes() {
    opcoes.innerHTML = "";
    (D.locais || []).forEach(function (l) {
      var a = document.createElement("a");
      a.className = "local-opcao"; a.href = linkLocal(l); a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("data-origem", "escolher-local-" + l.nome);
      var marca = document.createElement("span"); marca.className = "lo-etiqueta"; marca.textContent = l.etiqueta;
      var nome = document.createElement("span"); nome.className = "lo-nome"; nome.textContent = l.nome;
      var end = document.createElement("span"); end.className = "lo-end"; end.textContent = l.endereco;
      a.appendChild(marca); a.appendChild(nome); a.appendChild(end);
      if (l.exclusivo) { var ex = document.createElement("span"); ex.className = "lo-aviso"; ex.textContent = l.exclusivo; a.appendChild(ex); }
      var go = document.createElement("span"); go.className = "lo-acao"; go.textContent = "Escolher e abrir o WhatsApp"; a.appendChild(go);
      a.addEventListener("click", function () {
        a.href = linkLocal(l); E.local = l.nome; salvar();
        setTimeout(function () { irPara(3, true); }, 500);
      });
      opcoes.appendChild(a);
    });
  }

  /* --- Passo 3: resumo e botão para abrir o WhatsApp de novo --- */
  var resumo = $("#resumo-final"), reabrir = $("#reabrir-wa");
  function desenharResumo() {
    var l = localPorNome(E.local); if (!l) return;
    reabrir.href = linkLocal(l);
    resumo.innerHTML = "";
    [["Local", nomeCompleto(l)], ["Dor", queixaTexto()]].forEach(function (x) {
      var p = document.createElement("p"), b = document.createElement("strong");
      b.textContent = x[0] + ": "; p.appendChild(b); p.appendChild(document.createTextNode(x[1])); resumo.appendChild(p);
    });
  }
  $("#reiniciar").addEventListener("click", function () {
    E = { passo: 1, regioes: [], det: "", local: "", t: 0 };
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    fDet.value = ""; atualizarRegioes(false); irPara(1, true);
  });

  /* Estado inicial (restaura o que a pessoa já tinha feito) */
  fDet.value = E.det;
  atualizarRegioes(false);
  irPara(E.passo, false);

  /* --- Locais: o botão agenda direto no WhatsApp daquele local --- */
  var cont = $("#locais-lista");
  (D.locais || []).forEach(function (l) {
    var d = document.createElement("div"); d.className = "local";
    var q = encodeURIComponent(l.endereco);
    d.innerHTML = '<div class="local-foto" hidden></div><div class="local-txt"><h3></h3><p class="cidade"></p><p class="end"></p><p class="exc"></p><p class="ace"></p><div class="acoes"></div></div>';
    d.querySelector("h3").textContent = l.nome;
    if (l.foto) {
      var lf = d.querySelector(".local-foto"), im = new Image();
      im.alt = "Local de atendimento: " + l.nome;
      im.onload = function () { lf.appendChild(im); lf.hidden = false; };
      im.src = l.foto;
    }
    d.querySelector(".cidade").textContent = l.etiqueta;
    d.querySelector(".end").textContent = l.endereco;
    if (l.exclusivo) d.querySelector(".exc").textContent = l.exclusivo; else d.querySelector(".exc").remove();
    if (l.acesso) d.querySelector(".ace").textContent = "Acesso: " + l.acesso; else d.querySelector(".ace").remove();
    var ac = d.querySelector(".acoes");
    var rota = document.createElement("a");
    rota.className = "btn btn-ghost"; rota.target = "_blank"; rota.rel = "noopener";
    rota.href = l.mapsUrl || "https://www.google.com/maps/dir/?api=1&destination=" + q;
    rota.setAttribute("data-origem", "local-rota");
    rota.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-pin"/></svg> Traçar rota';
    var ag = document.createElement("a");
    ag.className = "btn btn-ouro"; ag.target = "_blank"; ag.rel = "noopener"; ag.href = linkLocal(l);
    ag.setAttribute("data-origem", "local-agendar-" + l.nome);
    ag.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg> Agendar neste local';
    ag.addEventListener("click", function () { ag.href = linkLocal(l); });   /* leva a dor, se a pessoa já contou */
    ac.appendChild(rota); ac.appendChild(ag);
    cont.appendChild(d);
  });

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

  /* ---------- Entradas discretas: só passos, locais e FAQ ---------- */
  if (!reduzir && "IntersectionObserver" in window) {
    var alvos = $$(".passos li, .local, .faq-lista details");
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
    var origem = a.getAttribute("data-origem"), wa = /wa\.me/.test(a.href || "");
    if (window.gtag) window.gtag("event", wa ? "click_whatsapp" : "click_cta", { origem: origem });
    if (window.fbq && wa) window.fbq("track", "Contact", { origem: origem });
  });
})();
