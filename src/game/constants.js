/**
 * Core game constants for OTTv2.
 */

export const BOARD_SIZE = 9;

export const PIECE_TYPES = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors',
};

export const PLAYERS = {
  PLAYER1: 'player1',
  PLAYER2: 'player2',
};

export const MODES = {
  LOCAL: 'local',
  ONLINE: 'online',
};

// Target Goal Cells:
// Player 1 Goal -> a1 (row 0, col 0)
// Player 2 Goal -> i9 (row 8, col 8)
export const PLAYER_GOALS = {
  [PLAYERS.PLAYER1]: { row: 0, col: 0 }, // a1
  [PLAYERS.PLAYER2]: { row: 8, col: 8 }, // i9
};

// RPS Combat Matrix:
// Rock > Scissors, Scissors > Paper, Paper > Rock
export const RPS_RULES = {
  [PIECE_TYPES.ROCK]: PIECE_TYPES.SCISSORS,
  [PIECE_TYPES.SCISSORS]: PIECE_TYPES.PAPER,
  [PIECE_TYPES.PAPER]: PIECE_TYPES.ROCK,
};

// OFFICIAL INITIAL SETUP (FINALized)
// Player 1 occupies row 8 (rank 9, a9..i9).
// Player 2 occupies row 0 (rank 1, a1..i1).
// Pattern: Rock, Paper, Scissors, Rock, Paper, Scissors, Rock, Paper, Scissors
export const INITIAL_SETUP = {
  pieces: [
    // Player 1 starting row (row 8 / rank 9: a9 to i9)
    { id: 'p1-rock-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.ROCK, row: 8, col: 0 },
    { id: 'p1-paper-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.PAPER, row: 8, col: 1 },
    { id: 'p1-scissors-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.SCISSORS, row: 8, col: 2 },
    { id: 'p1-rock-2', player: PLAYERS.PLAYER1, type: PIECE_TYPES.ROCK, row: 8, col: 3 },
    { id: 'p1-paper-2', player: PLAYERS.PLAYER1, type: PIECE_TYPES.PAPER, row: 8, col: 4 },
    { id: 'p1-scissors-2', player: PLAYERS.PLAYER1, type: PIECE_TYPES.SCISSORS, row: 8, col: 5 },
    { id: 'p1-rock-3', player: PLAYERS.PLAYER1, type: PIECE_TYPES.ROCK, row: 8, col: 6 },
    { id: 'p1-paper-3', player: PLAYERS.PLAYER1, type: PIECE_TYPES.PAPER, row: 8, col: 7 },
    { id: 'p1-scissors-3', player: PLAYERS.PLAYER1, type: PIECE_TYPES.SCISSORS, row: 8, col: 8 },

    // Player 2 starting row (row 0 / rank 1: a1 to i1)
    { id: 'p2-rock-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.ROCK, row: 0, col: 0 },
    { id: 'p2-paper-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.PAPER, row: 0, col: 1 },
    { id: 'p2-scissors-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.SCISSORS, row: 0, col: 2 },
    { id: 'p2-rock-2', player: PLAYERS.PLAYER2, type: PIECE_TYPES.ROCK, row: 0, col: 3 },
    { id: 'p2-paper-2', player: PLAYERS.PLAYER2, type: PIECE_TYPES.PAPER, row: 0, col: 4 },
    { id: 'p2-scissors-2', player: PLAYERS.PLAYER2, type: PIECE_TYPES.SCISSORS, row: 0, col: 5 },
    { id: 'p2-rock-3', player: PLAYERS.PLAYER2, type: PIECE_TYPES.ROCK, row: 0, col: 6 },
    { id: 'p2-paper-3', player: PLAYERS.PLAYER2, type: PIECE_TYPES.PAPER, row: 0, col: 7 },
    { id: 'p2-scissors-3', player: PLAYERS.PLAYER2, type: PIECE_TYPES.SCISSORS, row: 0, col: 8 },
  ],
};
