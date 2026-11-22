const {
  CampoMinado,
  STATUS_WON,
  STATUS_LOST,
  STATUS_PLAYING,
  CELL_REVEALED,
  ROWS,
  COLS,
} = require('../src/campoMinado');
const { mineAt22 } = require('./fixtures/boards');

describe('vitória e derrota', () => {
  it('acertar mina muda status para lost', () => {
    const game = new CampoMinado({ minePositions: mineAt22 });
    const result = game.reveal(2, 2);
    expect(result.hitMine).toBe(true);
    expect(game.getStatus()).toBe(STATUS_LOST);
    expect(game.getCellView(2, 2).mine).toBe(true);
  });

  it('após lost revela todas as minas na visão', () => {
    const game = new CampoMinado({
      minePositions: [
        { row: 1, col: 1 },
        { row: 5, col: 5 },
      ],
    });
    game.reveal(1, 1);
    expect(game.getCellView(5, 5).state).toBe(CELL_REVEALED);
    expect(game.getCellView(5, 5).mine).toBe(true);
  });

  it('revelar todas as seguras vence', () => {
    const game = new CampoMinado({ minePositions: [{ row: 0, col: 17 }] });
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (r === 0 && c === 17) continue;
        game.reveal(r, c);
        if (game.getStatus() === STATUS_WON) break;
      }
      if (game.getStatus() === STATUS_WON) break;
    }
    expect(game.getStatus()).toBe(STATUS_WON);
    expect(game.getRemainingSafeCells()).toBe(0);
  });

  it('após won não aceita reveal', () => {
    const game = new CampoMinado({ minePositions: [] });
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        game.reveal(r, c);
      }
    }
    expect(game.getStatus()).toBe(STATUS_WON);
    expect(game.reveal(0, 0)).toEqual({ changed: false });
    expect(game.toggleFlag(1, 1)).toEqual({ changed: false });
  });

  it('após lost não aceita toggleFlag', () => {
    const game = new CampoMinado({ minePositions: mineAt22 });
    game.reveal(2, 2);
    expect(game.toggleFlag(3, 3)).toEqual({ changed: false });
  });

  it('status playing enquanto ainda há seguras ocultas', () => {
    const game = new CampoMinado({
      minePositions: [{ row: 7, col: 8 }],
    });
    game.reveal(7, 7);
    expect(game.getStatus()).toBe(STATUS_PLAYING);
    expect(game.getRemainingSafeCells()).toBeGreaterThan(0);
  });
});