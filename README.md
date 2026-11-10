# Site Rafael Bicudo | Quiropraxia

Site estático (HTML, CSS e JavaScript puros, sem etapa de build). Funciona no GitHub Pages e na Vercel.

## Onde editar
Quase tudo fica em **`dados.js`**: WhatsApp, Instagram, locais (com o WhatsApp de cada um), mensagens do WhatsApp, textos do "Onde dói?", e os caminhos das fotos e do vídeo.

- Campo vazio (`""`) não aparece no site. Exemplo: `registro`.
- **WhatsApp por local:** em `locais`, cada local tem o seu `whatsapp` (só dígitos, com 55 na frente). Sem número, usa o principal.
- Fotos em `assets/fotos/` (WebP), vídeo em `assets/video/` e logo em `assets/logo.webp`.
- Os textos das seções (hero, consulta, "Quem vai cuidar", FAQ) estão no `index.html`.

## Como o agendamento funciona
1. A pessoa marca onde dói (pode ser mais de uma região) e é obrigada a contar o que sente (mínimo de 20 caracteres).
2. Escolhe o local de atendimento. Ao escolher, o WhatsApp daquele local abre com a dor e o pedido de horário já escritos.
3. Se o WhatsApp não abrir, a tela final tem um botão para abrir de novo.

O botão "Agendar neste local", na seção "Onde eu atendo", faz o mesmo: se a pessoa já contou a dor, ela vai na mensagem.
O site não envia a mensagem sozinho: a pessoa precisa tocar em enviar no WhatsApp. O que ela digita fica só no aparelho dela (3 dias).

## Cores
Amarelo `#FDE400` e preto `#1B1F1A` (do logo), com cinzas neutros nos fundos. Ficam no começo de `css/style.css`.

## Estrutura
```
index.html   404.html   dados.js   robots.txt   sitemap.xml
css/style.css   js/main.js
assets/logo.webp   assets/og.png   assets/fotos/   assets/video/
```

## Publicar
- **GitHub Pages:** Settings, Pages, "Deploy from a branch", `main` e `/ (root)`.
- **Vercel:** importar o repositório, sem framework e sem comando de build.

Endereço usado em `sitemap.xml`, `robots.txt`, `canonical` e `og:image`: `https://orafaelbicudo.vercel.app/`. Se mudar, troque nesses arquivos e no `index.html`.

## Antes de divulgar
- Guardar por escrito as autorizações: paciente do vídeo, fotos de atendimento e imagens do Instagram.
- Conferir as regras de publicidade do conselho profissional (há textos com promessa de resultado e "100%").
- Testar um agendamento de ponta a ponta no celular.
