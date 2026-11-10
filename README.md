# Site Rafael Bicudo | Quiropraxia

Site estático (HTML, CSS e JavaScript puros, sem etapa de build). Funciona no GitHub Pages e na Vercel.

## Onde editar
Quase tudo fica em **`dados.js`**: WhatsApp, Instagram, locais e horários, Pix da reserva (chave, favorecido, valor), política de cancelamento, prazo do cronômetro, textos do "Onde dói?", mensagens do WhatsApp e caminhos das fotos e do vídeo.

- Campo vazio (`""`) não aparece no site. Exemplo: `horarios` de um local, `registro`.
- Fotos em `assets/fotos/` (WebP) e vídeo em `assets/video/`.
- O aviso, a política da reserva e o prazo de 30 minutos estão em `reserva` e `avisoVolume`.
- Prazo `reserva.prazoMinutos: 0` desliga o cronômetro.

## Como o agendamento funciona
1. O paciente marca onde dói e envia a queixa pelo WhatsApp.
2. Escolhe horário e cidade na agenda do consultorio.me (abre em uma aba) e confirma no site.
3. Envia a mensagem completa ao Rafael e aguarda a confirmação (prazo de 30 minutos).
4. Depois da confirmação, faz o Pix da reserva e envia o comprovante pelo WhatsApp.

O site não verifica pagamento nem confirmação: o Rafael confirma pelo WhatsApp. O progresso fica salvo só no aparelho do paciente (3 dias).

## Estrutura
```
index.html   404.html   dados.js   robots.txt   sitemap.xml
css/style.css   js/main.js
assets/fotos/   assets/video/   assets/og.png
```

## Publicar
- **GitHub Pages:** Settings, Pages, "Deploy from a branch", `main` e `/ (root)`.
- **Vercel:** importar o repositório, sem framework e sem comando de build.

Endereço usado em `sitemap.xml`, `robots.txt`, `canonical` e `og:image`: `https://orafaelbicudo.vercel.app/`. Se o endereço mudar, troque nesses arquivos e no `index.html`.

## Antes de divulgar
- Guardar por escrito as autorizações: paciente do vídeo, fotos de atendimento e imagens do Instagram.
- Conferir as regras de publicidade do conselho profissional.
- Testar um agendamento de ponta a ponta e o Pix copia e cola no app do banco (sem pagar).
- Preencher `horarios` de Bem Estar e Studio Hoc quando houver.
