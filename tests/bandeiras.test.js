const {
  CampoMinado,
  CELL_FLAGGED,
  CELL_HIDDEN,
} = require('../src/campoMinado');

describe('bandeiras', () => {
  it('alterna bandeira em célula oculta', () => {
    const game = new CampoMinado({ minePositions: [] });
    expect(game.toggleFlag(1, 1)).toEqual({ changed: true });
    expect(game.getCellView(1, 1).state).toBe(CELL_FLAGGED);
    expect(game.toggleFlag(1, 1)).toEqual({ changed: true });
    expect(game.getCellView(1, 1).state).toBe(CELL_HIDDEN);
  });

  it('não flag após revelar', () => {
    const game = new CampoMinado({ minePositions: [] });
    game.reveal(0, 0);
    expect(game.toggleFlag(0, 0)).toEqual({ changed: false });
  });
});