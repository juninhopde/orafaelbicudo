/* ============================================================
   dados.js — ÚNICO lugar para trocar textos, links e flags.
   Campos vazios ("") não aparecem no site.
   ============================================================ */
window.DADOS = {
  nome: "Rafael Bicudo",
  nomeConsultorio: "Quiropraxia | Rafael Bicudo",
  // Registro profissional: o Rafael pediu para NÃO exibir. Vazio = some do site.
  registro: "",
  registroCurto: "",

  // WhatsApp principal (formato internacional, só dígitos). Usado no topo, no menu, na barra e no rodapé,
  // e nos locais que não tiverem número próprio.
  whatsapp: "5511917098089",
  whatsappExibicao: "(11) 91709-8089",

  instagram: "orafaelbicudo",
  perfilGoogle: "", // link do Perfil da Empresa no Google (opcional)

  // Locais de atendimento. Cada local tem o seu WhatsApp: é para ele que vai a mensagem de "Agendar".
  locais: [
    {
      nome: "Clínica Bem Estar",
      etiqueta: "Bragança 01",
      cidade: "Bragança Paulista",
      endereco: "Rua José Domingues, 30 - Centro, Bragança Paulista - SP",
      acesso: "Estacionamento na rua.",
      whatsapp: "5511917098089",
      foto: "assets/fotos/bem-estar.webp"
    },
    {
      nome: "Studio HOC",
      etiqueta: "Bragança 02",
      cidade: "Bragança Paulista",
      endereco: "Av. Marcelo Stefani, 15 - Jaguari Cond. Empresarial, Jd. do Lago, Bragança Paulista - SP",
      exclusivo: "Atendimento exclusivo para o público masculino.",
      acesso: "Estacionamento no local.",
      // Confirmado: o Studio HOC usa o mesmo WhatsApp (+55 11 91709-8089).
      // (O número "11 914044-9555", passado antes, tinha um dígito a mais e foi descartado.)
      // Se um dia o HOC tiver número próprio, escreva aqui só os dígitos, com 55 na frente.
      whatsapp: "5511917098089",
      foto: "assets/fotos/studio-hoc.webp"
    },
    {
      nome: "Atlas Academia",
      etiqueta: "Nazaré Paulista",
      cidade: "Nazaré Paulista",
      endereco: "Rua José Faria Júnior, 105 - Vicente Nunes, Nazaré Paulista - SP",
      acesso: "Estacionamento na rua.",
      whatsapp: "5511917098089",
      mapsUrl: "https://maps.app.goo.gl/JQqq3LwHA6umjgJV9",
      foto: "assets/fotos/atlas.webp"
    }
  ],

  // Fotos reais (com autorização do Rafael). Coloque os arquivos em assets/fotos/ (WebP, até 1600 px)
  // e escreva o caminho aqui. Vazio = aparece o espaço reservado.
  fotos: {
    rafael: "assets/fotos/rafael.webp",       // retrato, aparece no início do site (vertical, 4:5)
    quem: "assets/fotos/atendimento.webp",    // foto na seção "Quem vai cuidar de você" (vertical, 4:5)
    atendimento: ""                           // foto de atendimento na seção da primeira consulta (horizontal, 3:2)
  },

  // Vídeo curto (mudo, em loop) da primeira consulta. Só publicar com autorização da paciente que aparece.
  // Vazio = o vídeo não aparece.
  videos: {
    consulta: "assets/video/atendimento.mp4"
  },

  duracao: "Até 60 minutos.",

  // Textos do "Onde dói?" (botão e texto de cada região).
  regioes: {
    cabeca: {
      rotulo: "cabeça",
      titulo: "Cabeça",
      texto: "Dor de cabeça tem muitas causas. Algumas vêm de tensão no pescoço e nos ombros, e a avaliação serve para entender se esse é o seu caso. Dor de cabeça muito forte e repentina, ou com febre, fala enrolada ou fraqueza, precisa de atendimento médico."
    },
    pescoco: {
      rotulo: "pescoço",
      titulo: "Pescoço",
      texto: "O pescoço sustenta a cabeça o dia todo e sofre com postura, celular e computador. Na avaliação eu observo o movimento da cervical e dos ombros e conversamos sobre o que pode estar contribuindo."
    },
    ombro: {
      rotulo: "ombro / escápula",
      titulo: "Ombro e escápula",
      texto: "A dor no ombro pode vir do próprio ombro, mas também do pescoço ou da parte de cima das costas. A avaliação ajuda a separar uma coisa da outra."
    },
    lombar: {
      rotulo: "lombar / glúteo",
      titulo: "Lombar e glúteo",
      texto: "A lombar é uma das queixas mais comuns: ficar muito tempo sentado, fazer esforço ou acordar travado. Na avaliação olho movimento, postura e histórico. Dor que desce pela perna com perda de força, ou dificuldade de controlar xixi ou fezes, precisa de médico."
    },
    quadril: {
      rotulo: "quadril",
      titulo: "Quadril",
      texto: "A dor no quadril pode estar ligada à lombar, à bacia ou à própria articulação. Observo como você anda, senta e se movimenta para entender de onde ela parte."
    },
    joelho: {
      rotulo: "dor que irradia para a perna",
      titulo: "Dor que irradia para a perna",
      texto: "A dor que irradia para a perna pode ser uma hérnia de disco nas vértebras da lombar, compressão neural por desalinhamento do quadril e até mesmo a síndrome do piriforme, com a avaliação e ajuste."
    },
    formigamento: {
      rotulo: "formigamento em braços ou dedos",
      titulo: "Formigamento em braços ou dedos",
      texto: "O formigamento pode ter origem em nervos da coluna ou em outras causas. Por isso a conversa e a avaliação vêm antes de qualquer ajuste."
    },
    outra: {
      rotulo: "outra região",
      titulo: "Outra região",
      texto: "Sente dor na sola do pé ao levantar ou no antebraço que vai até o cotovelo, dores nos dedos da mão, na parte da frente da perna ou queimação e dor na canela, pode ser alguma disfunção como tendinites, bursites ou desajustes articulares de pequenas articulações que raio-x ou ressonância não pega."
    }
  },

  // Flags
  flags: {
    mostrarProvas: false   // true só quando houver avaliações/depoimentos reais e autorizados
  },

  provas: [
    // { texto: "...", autor: "...", fonte: "Google" }  -> somente reais e autorizados
  ],

  // Rastreamento: vazio = desligado.
  rastreamento: { ga4: "", metaPixel: "" },

  // Mensagens do WhatsApp. Variáveis: {local} {queixa}
  mensagens: {
    // Ao escolher o local (depois de contar o que sente):
    agendar: "Olá, Rafael! Vim pelo seu site e gostaria de agendar um horário em {local}.\n\n*Dor:* {queixa}",
    // Botão "Agendar neste local" quando a pessoa ainda não contou o que sente:
    agendarSemQueixa: "Olá, Rafael! Vim pelo seu site e gostaria de agendar um horário em {local}.",
    // Ícone de WhatsApp do topo, do menu, da barra e do rodapé:
    geral: "Olá, Rafael! Vim pelo seu site."
  }
};
