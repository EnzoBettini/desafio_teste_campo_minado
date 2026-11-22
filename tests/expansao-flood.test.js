const { CampoMinado, CELL_REVEALED } = require('../src/campoMinado');

describe('expansão flood fill', () => {
  it('revelar célula 0 abre vizinhança em cadeia', () => {
    const game = new CampoMinado({ minePositions: [] });
    const result = game.reveal(7, 7);
    expect(result.changed).toBe(true);
    expect(result.revealedCount).toBeGreaterThan(1);
    const view = game.getCellView(8, 7);
    expect(view.state).toBe(CELL_REVEALED);
    expect(view.adjacentMines).toBe(0);
  });

  it('flood não atravessa minas', () => {
    const game = new CampoMinado({
      minePositions: [
        { row: 7, col: 8 },
        { row: 7, col: 9 },
        { row: 8, col: 7 },
      ],
    });
    game.reveal(5, 5);
    expect(game.getCellView(7, 8).state).not.toBe(CELL_REVEALED);
  });

  it('célula com adjacentMines > 0 não dispara flood além dela', () => {
    const game = new CampoMinado({
      minePositions: [{ row: 1, col: 2 }],
    });
    const result = game.reveal(2, 2);
    expect(result.revealedCount).toBe(1);
    expect(game.getCellView(2, 2).adjacentMines).toBe(1);
    expect(game.getCellView(2, 1).state).not.toBe(CELL_REVEALED);
  });
});