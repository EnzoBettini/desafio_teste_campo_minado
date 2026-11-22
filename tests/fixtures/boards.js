/** Minas em região superior para testes de contagem e flood (18×14). */
const floodMineCluster = [
  { row: 0, col: 17 },
  { row: 1, col: 17 },
];

/** Mapa para contagem: uma mina adjacente a (1,1). */
const singleNeighborMine = [{ row: 0, col: 1 }];

/** Minas para forçar derrota no (2,2). */
const mineAt22 = [{ row: 2, col: 2 }];

/** Seed reprodutível para partida completa. */
const integrationSeed = 42;

/** Posição conhecida de mina após seed 42 + primeiro reveal em (0,0) — preenchido em runtime nos testes se necessário */
module.exports = {
  floodMineCluster,
  singleNeighborMine,
  mineAt22,
  integrationSeed,
};