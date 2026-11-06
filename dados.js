/* ============================================================
   dados.js — ÚNICO lugar para trocar textos, links e flags.
   Tudo que estiver como [PREENCHER: ...] aparece destacado no site
   até ser substituído por um dado real e confirmado.
   ============================================================ */
window.DADOS = {
  nome: "Rafael Bicudo",
  nomeConsultorio: "Quiropraxia | Rafael Bicudo",
  registro: "[PREENCHER: registro profissional / formação]",

  // WhatsApp: formato internacional, só dígitos. Fonte: bio do Instagram.
  whatsapp: "5511917098089",
  whatsappExibicao: "(11) 91709-8089",

  instagram: "orafaelbicudo",
  perfilGoogle: "", // [PREENCHER: link do Perfil da Empresa no Google, se existir]

  // Fonte: bio do Instagram e post fixado. CONFIRMAR endereços e horários.
  locais: [
    {
      nome: "Clínica Bem Estar",
      cidade: "Bragança Paulista",
      endereco: "Rua José Domingues, 30 - Centro, Bragança Paulista - SP",
      horarios: "[PREENCHER: dias e horários neste local]",
      acesso: "[PREENCHER: estacionamento / ponto de referência]",
      foto: "assets/fotos/bem-estar.webp"
    },
    {
      nome: "Studio Hoc",
      cidade: "Bragança Paulista",
      endereco: "Av. Marcelo Stefani, 15 - Jaguari Cond. Empresarial, Jd. do Lago, Bragança Paulista - SP",
      horarios: "[PREENCHER: dias e horários neste local]",
      acesso: "[PREENCHER: estacionamento / ponto de referência]",
      foto: "assets/fotos/studio-hoc.webp"
    },
    {
      nome: "Atlas Academia",
      cidade: "Nazaré Paulista",
      endereco: "Rua José Faria Júnior, 105 - Vicente Nunes, Nazaré Paulista - SP",
      descricao: "Sala reservada e confortável dentro da academia.",
      horarios: "16h às 20h [PREENCHER: confirmar os dias da semana]",
      acesso: "Ao lado da Escola Prof. Fabio Hacl Pinola. [PREENCHER: estacionamento]",
      mapsUrl: "https://maps.app.goo.gl/JQqq3LwHA6umjgJV9",
      foto: "assets/fotos/atlas.webp"
    }
  ],

  publico: "Crianças, adultos e idosos", // [PREENCHER: confirmar a restrição do asterisco do Instagram]

  // Fotos reais (com autorização do Rafael). Coloque os arquivos em assets/fotos/ (WebP, até 1600 px)
  // e escreva o caminho aqui, ex.: "assets/fotos/rafael.webp". Vazio = aparece o espaço reservado.
  fotos: {
    rafael: "assets/fotos/rafael.webp",       // retrato, aparece no início do site (vertical, 4:5)
    quem: "",         // foto na seção "Quem vai cuidar de você" (vertical, 4:5)
    atendimento: ""   // foto de atendimento na seção da primeira consulta (horizontal, 3:2)
  },

  // Vídeo curto (mudo, em loop) da primeira consulta. Só publicar com autorização da paciente que aparece.
  // Vazio = o vídeo não aparece.
  videos: {
    consulta: "assets/video/atendimento.mp4"
  },

  // Fluxo Pix -> comprovante -> agenda
  pix: {
    chave: "11917098089",                  // chave Pix: celular
    tipoChave: "Celular",
    favorecido: "RAFAEL BICUDO DEBONI",    // nome do favorecido da chave Pix
    valor: "R$ 70,00",                     // valor da RESERVA (descontado no valor da sessão)
    valorNumero: 70.00,
    cidade: "BRAGANCA PTA",                // até 15 letras, sem acento (usado no Pix copia e cola)
    copiaECola: true                       // gera o código "Pix copia e cola" com o valor já preenchido
  },

  // Política da reserva (aparece em destaque na seção de reserva e no FAQ)
  reserva: {
    explicacao: "Esse valor é descontado do valor da sessão, no dia do atendimento.",
    politica: "Se você faltar ou desmarcar com 4 horas de antecedência ou menos, a reserva não é devolvida."  // texto do Rafael: "faltar ou desmarcar com 4h de antecedência, não tem estorno"
  },
  valorSessao: "[PREENCHER: valor da sessão]",

  // Sistema de agendamento (consultorio.me)
  agenda: {
    url: "https://consultorio.me/pre/selectexternal/351958?external=true"
  },

  convenio: "[PREENCHER: aceita convênio ou reembolso?]",
  horarioResumo: "[PREENCHER: dias e horários de atendimento]",
  duracao: "[PREENCHER: duração da primeira consulta]",

  // Textos do "Onde dói?". Informativos, sem diagnóstico e sem promessa de resultado.
  regioes: {
    cabeca: {
      rotulo: "cabeça / enxaqueca",
      titulo: "Cabeça e enxaqueca",
      texto: "Dor de cabeça tem muitas causas. Algumas vêm de tensão no pescoço e nos ombros, e a avaliação serve para entender se esse é o seu caso. Dor de cabeça muito forte e repentina, ou com febre, fala enrolada ou fraqueza, precisa de atendimento médico."
    },
    pescoco: {
      rotulo: "pescoço",
      titulo: "Pescoço",
      texto: "O pescoço sustenta a cabeça o dia todo e sofre com postura, celular e computador. Na avaliação eu observo o movimento da cervical e dos ombros e conversamos sobre o que pode estar contribuindo."
    },
    ombro: {
      rotulo: "ombro",
      titulo: "Ombro",
      texto: "A dor no ombro pode vir do próprio ombro, mas também do pescoço ou da parte de cima das costas. A avaliação ajuda a separar uma coisa da outra."
    },
    lombar: {
      rotulo: "lombar",
      titulo: "Lombar",
      texto: "A lombar é uma das queixas mais comuns: ficar muito tempo sentado, fazer esforço ou acordar travado. Na avaliação olho movimento, postura e histórico. Dor que desce pela perna com perda de força, ou dificuldade de controlar xixi ou fezes, precisa de médico."
    },
    quadril: {
      rotulo: "quadril",
      titulo: "Quadril",
      texto: "A dor no quadril pode estar ligada à lombar, à bacia ou à própria articulação. Observo como você anda, senta e se movimenta para entender de onde ela parte."
    },
    joelho: {
      rotulo: "joelho",
      titulo: "Joelho",
      texto: "A dor no joelho pode ter origem no próprio joelho, mas também no quadril ou no pé. Olhamos o conjunto do movimento. Joelho inchado, quente ou dolorido depois de uma pancada deve ser visto por um médico."
    },
    formigamento: {
      rotulo: "formigamento em braços ou pernas",
      titulo: "Formigamento em braços ou pernas",
      texto: "O formigamento pode ter origem em nervos da coluna ou em outras causas. Por isso a conversa e a avaliação vêm antes de qualquer ajuste. Se for repentino, em um lado só do corpo ou com fala enrolada, procure atendimento de urgência."
    }
  },

  // Flags
  flags: {
    mostrarProvas: false,   // true só quando houver avaliações/depoimentos reais e autorizados
    mostrarPreco: true     // true quando o valor acima estiver preenchido
  },

  provas: [
    // { texto: "...", autor: "...", fonte: "Google" }  -> somente reais e autorizados
  ],

  // Rastreamento: vazio = desligado.
  rastreamento: { ga4: "", metaPixel: "" },

  // Mensagens do WhatsApp por origem (primeira pessoa, curtas).
  mensagens: {
    barra: "Olá, Rafael! Vim pelo seu site e gostaria de agendar uma avaliação.",
    hero: "Olá, Rafael! Vim pelo seu site e queria contar onde está doendo para saber se a quiropraxia pode me ajudar.",
    regiao: "Olá, Rafael! Vim pelo seu site. Estou com dor/desconforto em: {regiao}. Gostaria de saber se a quiropraxia pode me ajudar.",
    consulta: "Olá, Rafael! Li como funciona a primeira consulta e tenho algumas dúvidas antes de agendar.",
    comprovante: "Olá, Rafael! Fiz o Pix da reserva de {valor} e estou enviando o comprovante. Minha queixa é em: {regiao}. Vou escolher o horário pelo site.",
    local: "Olá, Rafael! Gostaria de saber os horários disponíveis em {local}.",
    faq: "Olá, Rafael! Li as perguntas frequentes e queria tirar uma dúvida.",
    final: "Olá, Rafael! Quero começar a cuidar da minha coluna. Como faço para agendar?",
    rodape: "Olá, Rafael! Vim pelo seu site."
  }
};
