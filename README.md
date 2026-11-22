# desafio_teste_campo_minado

Campo minado clássico **18×14** com **40 minas**. A suite em `tests/` especifica `src/campoMinado.js`.

## Constantes

| Nome | Valor |
|------|------:|
| `COLS` (largura) | 18 |
| `ROWS` (altura) | 14 |
| `MINE_COUNT` | 40 |
| Células seguras | 212 |

Índices: `row` 0…13, `col` 0…17. Vizinhos nas 8 direções.

## Regras

| Regra | Descrição |
|-------|-----------|
| Início | Todas ocultas; status `playing` |
| Minas | 40 minas; modo aleatório coloca no **primeiro** `reveal`; modo fixture usa `minePositions` no construtor |
| Primeira jogada | O primeiro `reveal` **nunca** aciona mina (posição clicada excluída da geração) |
| Revelar | Ignora células já reveladas ou flagradas; mina → `lost` e revela todas as minas; segura mostra `adjacentMines` 0–8 |
| Expansão | Célula revelada com `0` vizinhos mina abre vizinhas seguras em cadeia (flood fill) |
| Bandeira | Alterna em célula oculta; célula flagrada não revela |
| Vitória | Todas as células seguras reveladas (`won`) |
| Fim | `reveal` / `toggleFlag` retornam `{ changed: false }` após `won` ou `lost` |

## API

```javascript
const campo = require('./src/campoMinado');
```

| Export | Descrição |
|--------|-----------|
| `ROWS`, `COLS`, `MINE_COUNT` | Constantes |
| `CELL_HIDDEN`, `CELL_FLAGGED`, `CELL_REVEALED` | Estados de célula |
| `STATUS_PLAYING`, `STATUS_WON`, `STATUS_LOST` | Status da partida |
| `CampoMinado` | Classe principal |
| `assertInBounds(row, col)` | Lança se fora da grade |
| `countAdjacentMines(mineSet, row, col)` | Contagem pura |
| `createEmptyMineSet()` | `new Set()` para testes |
| `cellKey(row, col)` | Chave string da célula |

### `new CampoMinado(options)`

- `seed` — PRNG determinístico (minas lazy no primeiro reveal)
- `minePositions` — `{ row, col }[]` fixos desde o início (fixtures)

### Métodos

| Método | Retorno |
|--------|---------|
| `getStatus()` | `playing` \| `won` \| `lost` |
| `getCellView(row, col)` | `{ state, adjacentMines?, mine? }` |
| `reveal(row, col)` | `{ changed, hitMine?, revealedCount? }` |
| `toggleFlag(row, col)` | `{ changed }` |
| `getRemainingSafeCells()` | Número |
| `isMine(row, col)` | `boolean` (lança se minas ainda não existem no modo lazy) |

## Organização dos testes

`tests/constantes-api.test.js`, `limites-e-bounds.test.js`, `inicializacao.test.js`, `primeira-jogada.test.js`, `revelar-e-contagem.test.js`, `expansao-flood.test.js`, `bandeiras.test.js`, `vitoria-derrota.test.js`, `integracao-partida.test.js`, `fixtures/boards.js`

`tests/revisao-gabriel.test.js` — revisão do Gabriel: bandeira bloqueia o flood e adia a vitória, vitória com mina só flagrada, reveal bloqueado por bandeira não conta como primeira jogada no modo `seed`, mina flagrada aparece na derrota, célula com `adjacentMines` 8 e vitória em um clique via flood (`floodMineCluster`).

## Como executar

```bash
npm install
npm test
```

## Colaboradores

| Nome | RA |
|------|-----|
| Enzo Ayres Bettini | 241955272 |
| Gabriel Henrik de Castro Maia | 24039452-2 |

Formulário: https://forms.gle/bgbV2TwrreR8LiAGA