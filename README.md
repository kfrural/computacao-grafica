# Computacao Grafica - Topico 2 (Three.js)

Projeto desenvolvido com Vite + TypeScript (vanilla) para os exercicios solicitados.

## Requisitos

- Node.js 20+
- npm 10+

## Como executar

```bash
npm install
npm run dev
```

Abra o navegador no endereco mostrado pelo Vite (normalmente `http://localhost:5173`).

## Como gerar build de producao

```bash
npm run build
npm run preview
```

## Exercicios implementados

1. Recriacao de cena com `PlaneGeometry`, `BoxGeometry` e `SphereGeometry`, incluindo eixos (`AxesHelper`).
2. Animacao de cubo verde com movimento circular e rotacao no proprio eixo.
3. Pong simples em Three.js com:
   - raquete do jogador (teclas `W` e `S`),
   - raquete da IA,
   - bola com colisao,
   - placar em tempo real.
4. Desafio: animacao inspirada na piramide usando transformacoes de escala.

## Estrutura principal

- `src/main.ts`: composicao da interface e implementacao das 4 cenas.
- `src/style.css`: estilos da pagina e layout responsivo.
- `package.json`: scripts e dependencias do projeto.
