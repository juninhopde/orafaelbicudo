/* ============================================================
   dados.js — ÚNICO lugar para trocar textos, links e flags.
   Campos vazios ("") não aparecem no site.
   ============================================================ */
window.DADOS = {
  nome: "Rafael Bicudo",
  nomeConsultorio: "Quiropraxia | Rafael Bicudo",
  // Registro profissional: o Rafael pediu para NÃO exibir. Vazio = some do topo, do início, do "Quem sou eu", do selo e do rodapé.
  // Para ligar de novo, escreva aqui (ex.: "CREFITO-3 12345-F") e em registroCurto.
  registro: "",
  registroCurto: "",   // versão curta, usada no topo (ex.: "CREFITO-3 12345-F")

  // Texto "Quem sou eu". Versão ajustada do briefing (sem "especialista", "causa raiz", "viva sem dor", "máxima performance").
  // ORIGINAL do cliente, caso queira restaurar depois de conferir as regras do conselho:
  // "Prazer, sou Rafael Bicudo. Sou especialista em Quiropraxia e dedicado a devolver mobilidade, bem-estar e qualidade de vida aos meus
  //  pacientes. Meu foco é identificar e tratar a causa raiz de dores articulares e desalinhamentos da coluna vertebral, prevenindo
  //  limitações e promovendo a saúde integral do corpo. Com atendimento humanizado e técnicas específicas para cada fase da vida, desde
  //  crianças e adultos até idosos, estruturo planos de cuidado individualizados para que você viva sem dor e com máxima performance."
  quemSou: "Prazer, sou Rafael Bicudo, quiropraxista. Meu trabalho é ajudar você a recuperar mobilidade, bem-estar e qualidade de vida. Meu foco é entender o que está por trás das suas dores articulares e das alterações na coluna, para cuidar delas com calma e orientar você no dia a dia. O atendimento é humanizado, com técnicas pensadas para cada fase da vida, de crianças e adultos a idosos, e cada plano de cuidado é individual.",

  // WhatsApp: formato internacional, só dígitos. Fonte: bio do Instagram.
  whatsapp: "5511917098089",
  whatsappExibicao: "(11) 91709-8089",

  instagram: "orafaelbicudo",
  perfilGoogle: "", // link do Perfil da Empresa no Google (opcional)

  // Fonte: bio do Instagram e post fixado. CONFIRMAR endereços e horários.
  locais: [
    {
      nome: "Clínica Bem Estar",
      cidade: "Bragança Paulista",
      endereco: "Rua José Domingues, 30 - Centro, Bragança Paulista - SP",
      horarios: "",   // ex.: "Segundas a sextas, 8h às 19h"
      acesso: "Estacionamento na rua.",
      foto: "assets/fotos/bem-estar.webp"
    },
    {
      nome: "Studio Hoc",
      cidade: "Bragança Paulista",
      endereco: "Av. Marcelo Stefani, 15 - Jaguari Cond. Empresarial, Jd. do Lago, Bragança Paulista - SP",
      horarios: "",   // ex.: "Segundas a sextas, 8h às 19h"
      acesso: "Estacionamento na rua.",
      foto: "assets/fotos/studio-hoc.webp"
    },
    {
      nome: "Atlas Academia",
      cidade: "Nazaré Paulista",
      endereco: "Rua José Faria Júnior, 105 - Vicente Nunes, Nazaré Paulista - SP",
      descricao: "Sala reservada e confortável dentro da academia.",
      horarios: "16h às 20h",   // acrescente os dias da semana, se quiser
      acesso: "Ao lado da Escola Prof. Fabio Hacl Pinola. Estacionamento na rua.",
      mapsUrl: "https://maps.app.goo.gl/JQqq3LwHA6umjgJV9",
      foto: "assets/fotos/atlas.webp"
    }
  ],

  publico: "Crianças, adultos e idosos",

  // Fotos reais (com autorização do Rafael). Coloque os arquivos em assets/fotos/ (WebP, até 1600 px)
  // e escreva o caminho aqui, ex.: "assets/fotos/rafael.webp". Vazio = aparece o espaço reservado.
  fotos: {
    rafael: "assets/fotos/rafael.webp",       // retrato, aparece no início do site (vertical, 4:5)
    quem: "assets/fotos/atendimento.webp",         // foto na seção "Quem vai cuidar de você" (vertical, 4:5)
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
  valorSessao: "a partir de R$ 210,00. O valor final depende da avaliação inicial do histórico clínico",

  // Sistema de agendamento (consultorio.me)
  agenda: {
    // Lista de horários do Rafael. Abre em UMA aba nova: o formulário do consultorio.me não pode ser embutido
    // (X-Frame-Options: SAMEORIGIN). Sem "external=true" a lista e o formulário ficam na mesma aba.
    url: "https://consultorio.me/pro/rafael-bicudo?list=true"
  },

  convenio: "O atendimento é exclusivamente particular. Eu forneço nota fiscal ou recibo completo para você pedir reembolso ao seu plano de saúde (o reembolso depende do plano).",
  horarioResumo: "",   // aparece no início da página; ex.: "Segundas a sextas, 8h às 19h"
  duracao: "Até 60 minutos.",

  // Textos do "Onde dói?". Informativos, sem diagnóstico e sem promessa de resultado.
  regioes: {
    outra: {
      rotulo: "outra região",
      titulo: "Outra região",
      texto: "Sem problema. No último passo você pode contar, em poucas palavras, onde sente o incômodo."
    },
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
    // Mensagem final do agendamento. Variáveis: {nome} {queixa} {horario} {local} {valor}
    agendamento: "Olá, Rafael! Já fiz o Pix da reserva de {valor} e já agendei o meu horário pelo site. Estou com dor em: {queixa}.\n\n*Nome:* {nome}\n*Horário agendado:* {horario}\n*Local:* {local}\n\nSegue o comprovante do Pix em anexo.",
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
