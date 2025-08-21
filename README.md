# Javalingo (Starter)

App web simples (React + Vite) para demonstrar o Javalingo funcionando: login (mock),
teste de nivelamento, 1 fase de quiz por nível, moedas/XP persistindo no navegador,
loja de skins e perfil.

## Requisitos
- Node.js 18+ instalado
- VS Code (recomendado)

## Como rodar
```bash
npm install
npm run dev
```
Abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## Como apresentar no vídeo
1. Faça login com um nome e e-mail qualquer.
2. Execute o **Teste de Nivelamento** (5 perguntas) → define seu nível.
3. Clique em **Jogar** → responda 5 perguntas do seu nível → ganhe moedas/XP.
4. Abra a **Loja**, compre/ative a skin Pixel e volte ao início para ver o mascote com a nova skin.
5. Abra o **Perfil**, mostre o XP, a barra de progresso e o botão de reset.
6. Recarregue a página para mostrar que as moedas/XP/skin permanecem salvos (LocalStorage).

## Estrutura
- `src/data/questions.json` → perguntas (adicione mais se quiser)
- `src/data/skins.json` → itens da loja
- `src/lib/storage.js` → persistência no `localStorage`
- `src/pages/*` → telas
- `src/components/*` → componentes reutilizáveis

## Deploy rápido (opcional)
1. Suba o repositório no GitHub.
2. Crie um projeto no Vercel e importe o repo.
3. Build command: `npm run build`, Output: `dist` (padrão do Vite).
4. Use a URL pública do Vercel na loja da UniFil e no vídeo.

---
> Dica: Edite `questions.json` com perguntas de Java/lógica do seu curso para deixar a demo mais rica.
