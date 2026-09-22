/**
 * Movement and board boundary logic.
 */

import { BOARD_SIZE } from './constants.js';

export function isInsideBoard(row, col) {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getPieceAt(pieces, row, col) {
  if (!Array.isArray(pieces)) return null;
  return pieces.find((p) => p.row === row && p.col === col) || null;
}

export function isValidMovement(from, to) {
  if (!from || !to) return false;
  if (!isInsideBoard(from.row, from.col) || !isInsideBoard(to.row, to.col)) return false;

  const dr = Math.abs(to.row - from.row);
  const dc = Math.abs(to.col - from.col);

  // Cannot stay still
  if (dr === 0 && dc === 0) return false;

  // Moves exactly 1 square in any of 8 directions (chess king movement)
  return dr <= 1 && dc <= 1;
}
