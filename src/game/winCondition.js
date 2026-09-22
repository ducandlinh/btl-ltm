/**
 * Win condition checks: Goal win (a1/i9) and Type Elimination win.
 */

import { PLAYER_GOALS, PLAYERS, PIECE_TYPES } from './constants.js';

export function checkGoalWin(piece) {
  if (!piece) return null;
  const goal = PLAYER_GOALS[piece.player];
  if (goal && piece.row === goal.row && piece.col === goal.col) {
    return piece.player;
  }
  return null;
}

export function countActivePieces(pieces) {
  const counts = {
    [PLAYERS.PLAYER1]: { [PIECE_TYPES.ROCK]: 0, [PIECE_TYPES.PAPER]: 0, [PIECE_TYPES.SCISSORS]: 0 },
    [PLAYERS.PLAYER2]: { [PIECE_TYPES.ROCK]: 0, [PIECE_TYPES.PAPER]: 0, [PIECE_TYPES.SCISSORS]: 0 },
  };

  if (Array.isArray(pieces)) {
    for (const p of pieces) {
      if (counts[p.player] && counts[p.player][p.type] !== undefined) {
        counts[p.player][p.type]++;
      }
    }
  }

  return counts;
}

export function checkTypeEliminationWin(pieces, initialPieceCounts) {
  const activeCounts = countActivePieces(pieces);
  const playersList = [PLAYERS.PLAYER1, PLAYERS.PLAYER2];

  for (const player of playersList) {
    const opponent = player === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
    const oppInitial = initialPieceCounts?.[opponent] || {};
    const oppActive = activeCounts[opponent];

    for (const type of Object.values(PIECE_TYPES)) {
      const initialCount = oppInitial[type] || 0;
      // If initial piece count was 0, it must NOT count as eliminated
      if (initialCount > 0 && oppActive[type] === 0) {
        return player; // Winner!
      }
    }
  }

  return null;
}

export function checkWin(pieces, initialPieceCounts, lastMovedPiece = null) {
  if (lastMovedPiece) {
    const goalWinner = checkGoalWin(lastMovedPiece);
    if (goalWinner) return { winner: goalWinner, reason: 'goal' };
  } else {
    for (const p of pieces) {
      const goalWinner = checkGoalWin(p);
      if (goalWinner) return { winner: goalWinner, reason: 'goal' };
    }
  }

  const elimWinner = checkTypeEliminationWin(pieces, initialPieceCounts);
  if (elimWinner) return { winner: elimWinner, reason: 'elimination' };

  return null;
}
