const {
  CampoMinado,
  CELL_REVEALED,
  CELL_HIDDEN,
  CELL_FLAGGED,
  countAdjacentMines,
  createEmptyMineSet,
  cellKey,
} = require('../src/campoMinado');
const { singleNeighborMine } = require('./fixtures/boards');

describe('revelar e contagem', () => {
  it('countAdjacentMines conta oito vizinhos', () => {
    const mines = createEmptyMineSet();
    mines.add(cellKey(0, 0));
    mines.add(cellKey(0, 1));
    mines.add(cellKey(1, 0));
    expect(countAdjacentMines(mines, 1, 1)).toBe(3);
    expect(countAdjacentMines(mines, 5, 5)).toBe(0);
  });

  it('revelar célula segura mostra adjacentMines', () => {
    const game = new CampoMinado({ minePositions: singleNeighborMine });
    game.reveal(2, 2);
    const view = game.getCellView(1, 1);
    expect(view.state).toBe(CELL_REVEALED);
    expect(view.adjacentMines).toBe(1);
  });

  it('não revela novamente a mesma célula', () => {
    const game = new CampoMinado({ minePositions: [] });
    const first = game.reveal(0, 0);
    const second = game.reveal(0, 0);
    expect(first.changed).toBe(true);
    expect(second).toEqual({ changed: false });
  });

  it('não revela célula flagrada', () => {
    const game = new CampoMinado({ minePositions: [] });
    game.toggleFlag(2, 2);
    expect(game.reveal(2, 2)).toEqual({ changed: false });
    expect(game.getCellView(2, 2).state).toBe(CELL_FLAGGED);
  });

  it('mina permanece oculta até revelação direta ou derrota', () => {
    const game = new CampoMinado({
      minePositions: [{ row: 0, col: 5 }],
    });
    game.reveal(0, 0);
    expect(game.getCellView(0, 5).state).toBe(CELL_HIDDEN);
  });
});