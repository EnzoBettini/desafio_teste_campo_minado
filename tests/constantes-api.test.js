const campo = require('../src/campoMinado');

describe('constantes e API', () => {
  it('exporta dimensões e minas do enunciado', () => {
    expect(campo.ROWS).toBe(14);
    expect(campo.COLS).toBe(18);
    expect(campo.MINE_COUNT).toBe(40);
  });

  it('exporta estados de célula e jogo', () => {
    expect(campo.CELL_HIDDEN).toBe('hidden');
    expect(campo.CELL_FLAGGED).toBe('flagged');
    expect(campo.CELL_REVEALED).toBe('revealed');
    expect(campo.STATUS_PLAYING).toBe('playing');
    expect(campo.STATUS_WON).toBe('won');
    expect(campo.STATUS_LOST).toBe('lost');
  });

  it('exporta CampoMinado e utilitários', () => {
    expect(typeof campo.CampoMinado).toBe('function');
    expect(typeof campo.assertInBounds).toBe('function');
    expect(typeof campo.countAdjacentMines).toBe('function');
    expect(typeof campo.createEmptyMineSet).toBe('function');
    expect(typeof campo.cellKey).toBe('function');
  });
});