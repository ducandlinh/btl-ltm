/**
 * RPS Capture and piece removal functions.
 */

import { RPS_RULES } from './constants.js';

export function canCapture(attackerType, defenderType) {
  if (!attackerType || !defenderType) return false;
  return RPS_RULES[attackerType] === defenderType;
}

export function capturePiece(pieces, pieceIdToCapture) {
  if (!Array.isArray(pieces)) return [];
  return pieces.filter((p) => p.id !== pieceIdToCapture);
}
