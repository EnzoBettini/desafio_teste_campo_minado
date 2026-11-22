const {
  CampoMinado,
  ROWS,
  COLS,
  MINE_COUNT,
  STATUS_PLAYING,
  CELL_HIDDEN,
} = require('../src/campoMinado');

describe('inicialização', () => {
  it('inicia em playing com células ocultas', () => {
    const game = new CampoMinado({ seed: 1 });
    expect(game.getStatus()).toBe(STATUS_PLAYING);
    expect(game.getCellView(0, 0)).toEqual({ state: CELL_HIDDEN });
  });

  it('minePositions fixa minas imediatamente', () => {
    const mines = [
      { row: 0, col: 0 },
      { row: 1, col: 1 },
    ];
    const game = new CampoMinado({ minePositions: mines });
    expect(game.isMine(0, 0)).toBe(true);
    expect(game.isMine(5, 5)).toBe(false);
  });

  it('isMine lança antes do primeiro reveal no modo seed', () => {
    const game = new CampoMinado({ seed: 99 });
    expect(() => game.isMine(0, 0)).toThrow(/not placed/i);
  });

  it('após primeiro reveal com seed há exatamente MINE_COUNT minas', () => {
    const game = new CampoMinado({ seed: 7 });
    game.reveal(5, 5);
    let count = 0;
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (game.isMine(r, c)) count += 1;
      }
    }
    expect(count).toBe(MINE_COUNT);
  });

  it('getRemainingSafeCells antes de minas colocadas assume 212 seguras ocultas', () => {
    const game = new CampoMinado({ seed: 1 });
    expect(game.getRemainingSafeCells()).toBe(ROWS * COLS - MINE_COUNT);
  });
});