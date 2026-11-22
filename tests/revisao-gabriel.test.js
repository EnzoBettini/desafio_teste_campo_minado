const {
  CampoMinado,
  ROWS,
  COLS,
  STATUS_PLAYING,
  STATUS_WON,
  STATUS_LOST,
  CELL_HIDDEN,
  CELL_FLAGGED,
  CELL_REVEALED,
} = require('../src/campoMinado');
const { floodMineCluster } = require('./fixtures/boards');

function revealAllSafeCells(game, mines) {
  const mineKeys = new Set(mines.map(({ row, col }) => `${row},${col}`));
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (!mineKeys.has(`${r},${c}`)) game.reveal(r, c);
    }
  }
}

describe('revisão Gabriel — casos de borda', () => {
  it('bandeira em célula segura bloqueia o flood e adia a vitória até ser removida', () => {
    const game = new CampoMinado({ minePositions: [] });
    game.toggleFlag(5, 5);

    const result = game.reveal(0, 0);
    expect(result.revealedCount).toBe(ROWS * COLS - 1);
    expect(game.getCellView(5, 5)).toEqual({ state: CELL_FLAGGED });
    expect(game.getStatus()).toBe(STATUS_PLAYING);
    expect(game.getRemainingSafeCells()).toBe(1);

    expect(game.toggleFlag(5, 5)).toEqual({ changed: true });
    expect(game.reveal(5, 5)).toMatchObject({ changed: true, hitMine: false, revealedCount: 1 });
    expect(game.getStatus()).toBe(STATUS_WON);
  });

  it('vence com a mina apenas flagrada, sem revelá-la', () => {
    const mines = [{ row: 6, col: 9 }];
    const game = new CampoMinado({ minePositions: mines });
    game.toggleFlag(6, 9);

    revealAllSafeCells(game, mines);

    expect(game.getStatus()).toBe(STATUS_WON);
    expect(game.getRemainingSafeCells()).toBe(0);
    expect(game.getCellView(6, 9)).toEqual({ state: CELL_FLAGGED });
    expect(game.toggleFlag(6, 9)).toEqual({ changed: false });
  });

  it('no modo seed, reveal bloqueado por bandeira não conta como primeira jogada', () => {
    const game = new CampoMinado({ seed: 2024 });
    expect(game.toggleFlag(4, 4)).toEqual({ changed: true });
    expect(game.reveal(4, 4)).toEqual({ changed: false });
    expect(() => game.isMine(0, 0)).toThrow(/not placed/i);

    game.toggleFlag(4, 4);
    const first = game.reveal(4, 4);
    expect(first).toMatchObject({ changed: true, hitMine: false });
    expect(game.isMine(4, 4)).toBe(false);
  });

  it('na derrota a mina flagrada aparece revelada e células seguras ocultas continuam ocultas', () => {
    const game = new CampoMinado({
      minePositions: [
        { row: 1, col: 1 },
        { row: 10, col: 15 },
      ],
    });
    game.toggleFlag(10, 15);

    expect(game.reveal(1, 1)).toMatchObject({ changed: true, hitMine: true });
    expect(game.getStatus()).toBe(STATUS_LOST);
    expect(game.getCellView(10, 15)).toEqual({ state: CELL_REVEALED, mine: true });
    expect(game.getCellView(7, 7)).toEqual({ state: CELL_HIDDEN });
  });

  it('célula cercada por oito minas mostra adjacentMines 8 e não expande', () => {
    const mines = [];
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr !== 0 || dc !== 0) mines.push({ row: 6 + dr, col: 8 + dc });
      }
    }
    const game = new CampoMinado({ minePositions: mines });

    expect(game.reveal(6, 8)).toEqual({ changed: true, hitMine: false, revealedCount: 1 });
    expect(game.getCellView(6, 8)).toEqual({ state: CELL_REVEALED, adjacentMines: 8 });
    expect(game.getStatus()).toBe(STATUS_PLAYING);
  });

  it('flood a partir do canto oposto ao cluster abre o tabuleiro inteiro e vence em um clique', () => {
    const game = new CampoMinado({ minePositions: floodMineCluster });
    const result = game.reveal(ROWS - 1, 0);

    expect(result.revealedCount).toBe(ROWS * COLS - floodMineCluster.length);
    expect(game.getStatus()).toBe(STATUS_WON);
    expect(game.getCellView(0, 16).adjacentMines).toBe(2);
    expect(game.getCellView(2, 17).adjacentMines).toBe(1);
  });
});
