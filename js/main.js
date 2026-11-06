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
    return c.length > 1 ? c.slice(0, -1).join(", ") + " e " + c[c.length - 1] : (c[0] || "");
  }
  /* Itens opcionais: somem se o dado estiver vazio no dados.js (ex.: registro profissional) */
  $$("[data-se]").forEach(function (el) { if (!get(el.getAttribute("data-se"))) el.hidden = true; });
  $$("[data-bind]").forEach(function (el) {
    var k = el.getAttribute("data-bind");
    var v = k === "cidades" ? cidades() : get(k);
    if (v) el.textContent = v;
  });
  $$("[data-wa]").forEach(function (a) {
    if (a.id === "onde-wa") return;
    a.href = waLink(a.getAttribute("data-wa"));
  });
  $$("[data-ig]").forEach(function (a) { a.href = "https://www.instagram.com/" + D.instagram + "/"; });
  if (D.agenda && D.agenda.url) {
    var fr = $("#agenda-iframe"), al = $("#agenda-link");
    if (fr) fr.src = D.agenda.url;
    if (al) al.href = D.agenda.url;
  }
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

  /* Locais */
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
    var w = document.createElement("a");
    w.className = "btn btn-wa"; w.target = "_blank"; w.rel = "noopener";
    w.href = waLink("local", { local: l.nome });
    w.setAttribute("data-wa", "local"); w.setAttribute("data-origem", "local-" + l.nome);
    w.innerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg> Chamar no WhatsApp e perguntar horários';
    ac.appendChild(rota); ac.appendChild(w);
    cont.appendChild(d);
  });

  /* ---------- Fluxo: região -> Pix -> comprovante -> agenda ---------- */
  var regiaoAtual = "";
  function setComprovante() {
    var a = $('[data-wa="comprovante"]'); if (!a) return;
    a.href = waLink("comprovante", { valor: (D.pix && D.pix.valor) || "", regiao: regiaoAtual || "não informei" });
  }
  setComprovante();

  function copiar(botao, texto, rotulo) {
    var ok = function () { botao.textContent = "Copiado"; setTimeout(function () { botao.textContent = rotulo; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok, function () {});
  }
  /* Pix "copia e cola" (BR Code estático com valor). Chave de celular entra como +55. */
  function crc16(s) {
    var c = 0xFFFF;
    for (var i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (var j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF; }
    return ("0000" + c.toString(16).toUpperCase()).slice(-4);
  }
  function tlv(id, v) { return id + ("0" + v.length).slice(-2) + v; }
  function semAcento(t) { return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(); }
  window.__pixCopiaECola = function (p) {
    var chave = /^\d{11}$/.test(p.chave) ? "+55" + p.chave : p.chave;
    var conta = tlv("00", "br.gov.bcb.pix") + tlv("01", chave);
    var corpo = tlv("00", "01") + tlv("01", "11") + tlv("26", conta) + tlv("52", "0000") + tlv("53", "986") +
      tlv("54", p.valorNumero.toFixed(2)) + tlv("58", "BR") + tlv("59", semAcento(p.favorecido).slice(0, 25)) +
      tlv("60", semAcento(p.cidade).slice(0, 15)) + tlv("62", tlv("05", "***")) + "6304";
    return corpo + crc16(corpo);
  };
  var bcp = $("#copiar-pix"), bcc = $("#copiar-pixcc");
  if (D.pix && D.pix.chave && true) {
    bcp.hidden = false;
    bcp.addEventListener("click", function () { copiar(bcp, D.pix.chave, "Copiar chave Pix"); });
    if (D.pix.copiaECola && D.pix.valorNumero) {
      bcc.hidden = false;
      bcc.addEventListener("click", function () { copiar(bcc, window.__pixCopiaECola(D.pix), "Copiar Pix copia e cola"); });
    }
  }

  /* Agenda: abre depois do comprovante (guia de sequência; não verifica o pagamento) */
  var trava = $("#agenda-trava"), alink = $("#agenda-link");
  function liberarAgenda(rolar) {
    trava.hidden = true; alink.hidden = false;
    try { sessionStorage.setItem("agenda-liberada", "sim"); } catch (e) {}
    if (rolar) { var f = $("#agenda-frame"); if (f) f.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" }); }
  }
  var jaLiberada = false;
  try { jaLiberada = sessionStorage.getItem("agenda-liberada") === "sim"; } catch (e) {}
  if (trava && !jaLiberada) { trava.hidden = false; alink.hidden = true; }
  $("#agenda-liberar").addEventListener("click", function () { liberarAgenda(false); });
  $('[data-wa="comprovante"]').addEventListener("click", function () { setTimeout(function () { liberarAgenda(true); }, 400); });

  /* Fotos reais: só entram se o caminho estiver preenchido e o arquivo existir */
  function foto(id, src, alt, aoCarregar) {
    var el = document.getElementById(id); if (!src || !el) return;
    var im = new Image(); im.alt = alt; im.decoding = "async";
    im.onload = function () { el.innerHTML = ""; el.appendChild(im); el.classList.add("tem-foto"); el.hidden = false; if (aoCarregar) aoCarregar(); };
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


  /* ---------- "Onde dói?" ---------- */
  var R = D.regioes || {};
  var chips = $$(".chip"), spots = $$(".spot");
  var tit = $("#regiao-titulo"), txt = $("#regiao-texto"), wrap = $(".regiao-corpo-wrap");
  var ow = $("#onde-wa"), owt = $("#onde-wa-txt");
  var selecionadas = [], TIT_PADRAO = tit.textContent, TXT_PADRAO = txt.innerHTML, timer;
  ow.href = waLink("hero");
  function juntar(arr) { return arr.length < 2 ? (arr[0] || "") : arr.slice(0, -1).join(", ") + " e " + arr[arr.length - 1]; }
  function atualizar() {
    var juntas = juntar(selecionadas.map(function (k) { return R[k].rotulo; }));
    var tem = function (el) { return selecionadas.indexOf(el.getAttribute("data-regiao")) >= 0; };
    chips.forEach(function (c) { c.setAttribute("aria-pressed", tem(c) ? "true" : "false"); });
    spots.forEach(function (s) { s.classList.toggle("on", tem(s)); });
    ow.href = selecionadas.length ? waLink("regiao", { regiao: juntas }) : waLink("hero");
    regiaoAtual = juntas; setComprovante();
    var at = $("#agenda-regiao-txt"), al = $("#agenda-regiao-link");
    if (at) at.textContent = !selecionadas.length ? "Você ainda não escolheu a região." : (selecionadas.length > 1 ? "Regiões escolhidas: " : "Região escolhida: ") + juntas + ".";
    if (al) al.textContent = selecionadas.length ? "Trocar as regiões" : "Escolher a região";
    var trocar = function () {
      if (!selecionadas.length) {
        tit.textContent = TIT_PADRAO; txt.innerHTML = TXT_PADRAO; owt.textContent = "Chamar no WhatsApp e contar onde dói";
      } else {
        tit.textContent = selecionadas.length === 1 ? R[selecionadas[0]].titulo : selecionadas.length + " regiões escolhidas";
        txt.innerHTML = "";
        selecionadas.forEach(function (k) {
          var p = document.createElement("p");
          if (selecionadas.length > 1) { var b = document.createElement("strong"); b.textContent = R[k].titulo + ". "; p.appendChild(b); }
          p.appendChild(document.createTextNode(R[k].texto)); txt.appendChild(p);
        });
        owt.textContent = selecionadas.length === 1 ? "Chamar no WhatsApp e falar sobre " + juntas : "Chamar no WhatsApp e falar sobre as regiões escolhidas";
      }
      wrap.classList.remove("fechado");
    };
    clearTimeout(timer);
    if (reduzir) { trocar(); return; }
    wrap.classList.add("fechado");
    timer = setTimeout(trocar, 200);
  }
  function alternar(chave) {
    if (!R[chave]) return;
    var i = selecionadas.indexOf(chave);
    if (i >= 0) selecionadas.splice(i, 1); else selecionadas.push(chave);
    atualizar();
  }
  chips.forEach(function (c) { c.addEventListener("click", function () { alternar(c.getAttribute("data-regiao")); }); });
  spots.forEach(function (s) { s.addEventListener("click", function () { alternar(s.getAttribute("data-regiao")); }); });

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

  /* Barra fixa some quando o CTA final está na tela (nunca cobre o CTA) */
  var barra = $("#barra-fixa");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { barra.classList.toggle("oculta", e[0].isIntersecting); }, { threshold: 0.2 }).observe(fin);
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
    var alvos = $$(".passos li, .pix-passos li, .duas > div, .local, .faq-lista details");
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
    var origem = a.getAttribute("data-origem"), wa = a.hasAttribute("data-wa");
    if (window.gtag) window.gtag("event", wa ? "click_whatsapp" : "click_cta", { origem: origem });
    if (window.fbq && wa) window.fbq("track", "Contact", { origem: origem });
  });
})();
