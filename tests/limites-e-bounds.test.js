const { CampoMinado, assertInBounds } = require('../src/campoMinado');

describe('limites da grade', () => {
  let game;

  beforeEach(() => {
    game = new CampoMinado({ minePositions: [] });
  });

  it('assertInBounds aceita cantos', () => {
    expect(() => assertInBounds(0, 0)).not.toThrow();
    expect(() => assertInBounds(13, 17)).not.toThrow();
  });

  it('assertInBounds rejeita fora da grade', () => {
    expect(() => assertInBounds(-1, 0)).toThrow(/bounds/i);
    expect(() => assertInBounds(14, 0)).toThrow(/bounds/i);
    expect(() => assertInBounds(0, 18)).toThrow(/bounds/i);
  });

  it('reveal fora da grade retorna changed false', () => {
    expect(game.reveal(-1, 0)).toEqual({ changed: false });
    expect(game.reveal(0, 99)).toEqual({ changed: false });
  });

  it('toggleFlag fora da grade retorna changed false', () => {
    expect(game.toggleFlag(14, 5)).toEqual({ changed: false });
  });

  it('getCellView fora da grade lança', () => {
    expect(() => game.getCellView(20, 0)).toThrow(/bounds/i);
  });
});