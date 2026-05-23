# Risk Plus — Landing Page (Protótipo Navegável)

Protótipo interativo da landing page da Risk Plus.

## Stack
- HTML + CSS puro
- React 18 (via UMD)
- Babel standalone (transpila JSX no browser)
- Ícones: Phosphor Icons (regular) — paths embutidos em `phosphor-paths.js`

## Como rodar localmente
Por usar Babel standalone via `<script type="text/babel">`, é necessário servir os arquivos via HTTP (não abrir o `index.html` direto pelo `file://`).

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Depois acesse `http://localhost:8000`.

## Deploy
Todos os arquivos estão na raiz — basta subir tudo. Compatível com Vercel, Netlify, GitHub Pages e qualquer hosting estático.

## Estrutura
- `index.html` — shell HTML e imports
- `styles.css` — design system + motion
- `phosphor-paths.js` — paths SVG dos ícones Phosphor (MIT)
- `icons.jsx` — componente <Icon /> que monta SVGs do Phosphor
- `sections.jsx` — componentes de seção (Hero, Pricing, FAQ, etc)
- `app.jsx` — App raiz + integração de Tweaks
- `tweaks-panel.jsx` — painel de tweaks (cores, motion, plano destacado)
- `logo-*.svg` / `icon-*.svg` — logos e ícones da marca
- `MomoTrustDisplay-Regular.ttf` — fonte dos títulos

## Licença
Uso interno Risk Plus. Phosphor Icons: MIT.
