const {
  CampoMinado,
  STATUS_PLAYING,
  STATUS_LOST,
} = require('../src/campoMinado');

describe('primeira jogada segura', () => {
  it('primeiro reveal não perde com seed aleatório', () => {
    for (const seed of [1, 2, 99, 12345]) {
      const game = new CampoMinado({ seed });
      const result = game.reveal(7, 9);
      expect(result.changed).toBe(true);
      expect(result.hitMine).toBe(false);
      expect(game.getStatus()).toBe(STATUS_PLAYING);
    }
  });

  it('célula do primeiro clique não é mina', () => {
    const game = new CampoMinado({ seed: 50 });
    game.reveal(3, 4);
    expect(game.isMine(3, 4)).toBe(false);
  });

  it('primeiro reveal em minePositions fixo não altera mapa', () => {
    const game = new CampoMinado({
      minePositions: [{ row: 10, col: 10 }],
    });
    game.reveal(0, 0);
    expect(game.isMine(0, 0)).toBe(false);
    expect(game.getStatus()).not.toBe(STATUS_LOST);
  });
});