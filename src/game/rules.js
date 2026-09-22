/**
 * Game validation rules engine facade.
 */

import { PLAYERS } from './constants.js';
import { isInsideBoard, isValidMovement, getPieceAt } from './movement.js';
import { canCapture } from './capture.js';

export function validateMove(state, playerSlot, pieceId, targetRow, targetCol) {
  if (!state) {
    return { valid: false, error: 'Game state missing.' };
  }

  if (state.status !== 'playing') {
    return { valid: false, error: 'Game is not in playing state.' };
  }

  if (state.winner) {
    return { valid: false, error: 'Game has already ended.' };
  }

  if (!playerSlot || (playerSlot !== PLAYERS.PLAYER1 && playerSlot !== PLAYERS.PLAYER2)) {
    return { valid: false, error: 'Invalid player or spectator.' };
  }

  if (state.turn !== playerSlot) {
    return { valid: false, error: "It is not your turn!" };
  }

  const piece = state.pieces?.find((p) => p.id === pieceId);
  if (!piece) {
    return { valid: false, error: 'Selected piece does not exist.' };
  }

  if (piece.player !== playerSlot) {
    return { valid: false, error: 'You do not own this piece!' };
  }

  if (!isInsideBoard(targetRow, targetCol)) {
    return { valid: false, error: 'Destination is outside the board bounds.' };
  }

  const from = { row: piece.row, col: piece.col };
  const to = { row: targetRow, col: targetCol };

  if (!isValidMovement(from, to)) {
    return { valid: false, error: 'Must move exactly 1 square in any direction.' };
  }

  const occupant = getPieceAt(state.pieces, targetRow, targetCol);

  if (occupant) {
    if (occupant.player === playerSlot) {
      return { valid: false, error: 'Friendly cell is blocked.' };
    }

    if (piece.type === occupant.type) {
      return { valid: false, error: `Blocked! Same-type piece (${piece.type.toUpperCase()}) cannot be captured.` };
    }

    if (!canCapture(piece.type, occupant.type)) {
      return { valid: false, error: `Invalid capture! ${piece.type.toUpperCase()} loses to ${occupant.type.toUpperCase()}.` };
    }

    return { valid: true, capturedPiece: occupant };
  }

  return { valid: true, capturedPiece: null };
}

export function getValidDestinationsForPiece(state, pieceId) {
  if (!state || !pieceId) return [];
  const piece = state.pieces?.find((p) => p.id === pieceId);
  if (!piece) return [];

  const destinations = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dr, dc] of directions) {
    const nr = piece.row + dr;
    const nc = piece.col + dc;
    const res = validateMove(state, piece.player, pieceId, nr, nc);
    if (res.valid) {
      destinations.push({
        row: nr,
        col: nc,
        isCapture: !!res.capturedPiece,
        capturedPiece: res.capturedPiece,
      });
    }
  }

  return destinations;
}
