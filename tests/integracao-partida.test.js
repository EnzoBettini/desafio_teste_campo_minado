const {
  CampoMinado,
  STATUS_PLAYING,
  MINE_COUNT,
  ROWS,
  COLS,
} = require('../src/campoMinado');
const { integrationSeed } = require('./fixtures/boards');

describe('integração de partida 18×14', () => {
  it('sequência com seed: primeiro clique, minas, vários reveals', () => {
    const game = new CampoMinado({ seed: integrationSeed });
    const first = game.reveal(0, 0);
    expect(first.hitMine).toBeFalsy();
    expect(game.getStatus()).toBe(STATUS_PLAYING);

    let mineTotal = 0;
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (game.isMine(r, c)) mineTotal += 1;
      }
    }
    expect(mineTotal).toBe(MINE_COUNT);

    game.reveal(6, 6);
    game.reveal(10, 3);
    game.toggleFlag(12, 15);
    expect(game.getCellView(12, 15).state).toBe('flagged');
    expect(game.reveal(12, 15).changed).toBe(false);
  });

  it('duas instâncias com mesmo seed e mesmo primeiro clique geram mesmo mapa', () => {
    const a = new CampoMinado({ seed: 100 });
    const b = new CampoMinado({ seed: 100 });
    a.reveal(4, 4);
    b.reveal(4, 4);
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        expect(a.isMine(r, c)).toBe(b.isMine(r, c));
      }
    }
  });
});