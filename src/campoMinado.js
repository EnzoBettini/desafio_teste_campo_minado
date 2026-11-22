const ROWS = 14;
const COLS = 18;
const MINE_COUNT = 40;

const CELL_HIDDEN = 'hidden';
const CELL_FLAGGED = 'flagged';
const CELL_REVEALED = 'revealed';

const STATUS_PLAYING = 'playing';
const STATUS_WON = 'won';
const STATUS_LOST = 'lost';

function cellKey(row, col) {
  return `${row},${col}`;
}

function assertInBounds(row, col) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
    throw new Error(`Out of bounds: (${row}, ${col})`);
  }
}

function countAdjacentMines(mineSet, row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr += 1) {
    for (let dc = -1; dc <= 1; dc += 1) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (mineSet.has(cellKey(nr, nc))) count += 1;
    }
  }
  return count;
}

function createEmptyMineSet() {
  return new Set();
}

function createRng(seed) {
  let t = seed >>> 0;
  return function next() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

class CampoMinado {
  constructor(options = {}) {
    this.seed = options.seed ?? 1;
    this.status = STATUS_PLAYING;
    this.mines = new Set();
    this.minesPlaced = false;
    this.flagged = new Set();
    this.revealed = new Set();
    this.fixedMines = Array.isArray(options.minePositions);

    if (this.fixedMines) {
      for (const { row, col } of options.minePositions) {
        assertInBounds(row, col);
        this.mines.add(cellKey(row, col));
      }
      this.minesPlaced = true;
    }
  }

  _placeMines(excludeRow, excludeCol) {
    if (this.minesPlaced) return;
    const rng = createRng(this.seed);
    const excluded = cellKey(excludeRow, excludeCol);
    while (this.mines.size < MINE_COUNT) {
      const row = Math.floor(rng() * ROWS);
      const col = Math.floor(rng() * COLS);
      const key = cellKey(row, col);
      if (key === excluded) continue;
      this.mines.add(key);
    }
    this.minesPlaced = true;
  }

  getStatus() {
    return this.status;
  }

  isMine(row, col) {
    if (!this.minesPlaced) {
      throw new Error('Mines not placed yet');
    }
    return this.mines.has(cellKey(row, col));
  }

  getCellView(row, col) {
    assertInBounds(row, col);
    const key = cellKey(row, col);
    const isMineCell = this.minesPlaced && this.mines.has(key);

    if (this.flagged.has(key) && !this.revealed.has(key)) {
      return { state: CELL_FLAGGED };
    }

    if (this.revealed.has(key)) {
      if (isMineCell) {
        return { state: CELL_REVEALED, mine: true };
      }
      return {
        state: CELL_REVEALED,
        adjacentMines: countAdjacentMines(this.mines, row, col),
      };
    }

    return { state: CELL_HIDDEN };
  }

  getRemainingSafeCells() {
    if (!this.minesPlaced) {
      return ROWS * COLS - MINE_COUNT;
    }
    let remaining = 0;
    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const key = cellKey(r, c);
        if (!this.mines.has(key) && !this.revealed.has(key)) {
          remaining += 1;
        }
      }
    }
    return remaining;
  }

  _checkWin() {
    if (this.getRemainingSafeCells() === 0) {
      this.status = STATUS_WON;
    }
  }

  _floodReveal(startRow, startCol) {
    const queue = [[startRow, startCol]];
    let revealedCount = 0;

    while (queue.length > 0) {
      const [row, col] = queue.shift();
      const key = cellKey(row, col);

      if (this.flagged.has(key)) continue;
      if (this.revealed.has(key)) continue;
      if (this.mines.has(key)) continue;

      this.revealed.add(key);
      revealedCount += 1;

      if (countAdjacentMines(this.mines, row, col) === 0) {
        for (let dr = -1; dr <= 1; dr += 1) {
          for (let dc = -1; dc <= 1; dc += 1) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
            queue.push([nr, nc]);
          }
        }
      }
    }

    return revealedCount;
  }

  reveal(row, col) {
    if (this.status !== STATUS_PLAYING) {
      return { changed: false };
    }
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return { changed: false };
    }

    const key = cellKey(row, col);
    if (this.flagged.has(key)) return { changed: false };
    if (this.revealed.has(key)) return { changed: false };

    if (!this.minesPlaced) {
      this._placeMines(row, col);
    }

    if (this.mines.has(key)) {
      this.revealed.add(key);
      for (const mineKey of this.mines) {
        this.revealed.add(mineKey);
      }
      this.status = STATUS_LOST;
      return { changed: true, hitMine: true, revealedCount: 1 };
    }

    const revealedCount = this._floodReveal(row, col);
    this._checkWin();
    return { changed: true, hitMine: false, revealedCount };
  }

  toggleFlag(row, col) {
    if (this.status !== STATUS_PLAYING) {
      return { changed: false };
    }
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      return { changed: false };
    }

    const key = cellKey(row, col);
    if (this.revealed.has(key)) return { changed: false };

    if (this.flagged.has(key)) {
      this.flagged.delete(key);
      return { changed: true };
    }
    this.flagged.add(key);
    return { changed: true };
  }
}

module.exports = {
  ROWS,
  COLS,
  MINE_COUNT,
  CELL_HIDDEN,
  CELL_FLAGGED,
  CELL_REVEALED,
  STATUS_PLAYING,
  STATUS_WON,
  STATUS_LOST,
  CampoMinado,
  assertInBounds,
  countAdjacentMines,
  createEmptyMineSet,
  cellKey,
};