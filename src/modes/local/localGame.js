/**
 * Local 2-Player Hot-Seat Mode Adapter.
 * Manages local game state without network or PlayHTML synchronization.
 */

import { MODES } from '../../game/constants.js';
import { createInitialState, executeMove } from '../../game/state.js';

let localState = null;
let updateListener = null;

export function startLocalGame(onStateChange) {
  updateListener = onStateChange;
  localState = createInitialState(MODES.LOCAL, null);
  notifyUpdate();
  return localState;
}

export function getLocalState() {
  return localState;
}

export function makeLocalMove(pieceId, targetRow, targetCol) {
  if (!localState) return { ok: false, reason: 'No active local game.' };

  const currentTurn = localState.turn;
  const result = executeMove(localState, currentTurn, pieceId, targetRow, targetCol);

  if (result.ok) {
    localState = result.state;
    notifyUpdate();
  }

  return result;
}

export function restartLocalGame() {
  localState = createInitialState(MODES.LOCAL, null);
  notifyUpdate();
  return localState;
}

function notifyUpdate() {
  if (updateListener && localState) {
    updateListener(localState, localState.turn);
  }
}
