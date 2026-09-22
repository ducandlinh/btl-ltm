/**
 * Online Room and Player Slot Manager.
 */

import { PLAYERS } from '../../game/constants.js';

export function resolvePlayerSlot(state, userId) {
  if (!state || !userId) return null;

  const p1 = state.players?.player1;
  const p2 = state.players?.player2;

  // 1. Existing slot assignment check
  if (p1?.id === userId) return PLAYERS.PLAYER1;
  if (p2?.id === userId) return PLAYERS.PLAYER2;

  // 2. Open slot assignment
  if (!p1) return PLAYERS.PLAYER1;
  if (!p2) return PLAYERS.PLAYER2;

  // 3. Additional users are spectators
  return null;
}

export function registerPlayerInRoom(state, userId, userName) {
  if (!state || !userId) {
    return { updatedState: state, mySlot: null, stateChanged: false };
  }

  const slot = resolvePlayerSlot(state, userId);
  let stateChanged = false;
  const newState = JSON.parse(JSON.stringify(state));

  if (slot === PLAYERS.PLAYER1 && !newState.players.player1) {
    newState.players.player1 = { id: userId, name: userName || 'Player 1' };
    stateChanged = true;
  } else if (slot === PLAYERS.PLAYER2 && !newState.players.player2) {
    newState.players.player2 = { id: userId, name: userName || 'Player 2' };
    stateChanged = true;
  }

  // Auto-start match when both player slots are occupied
  if (newState.players.player1 && newState.players.player2 && newState.status === 'waiting') {
    newState.status = 'playing';
    stateChanged = true;
  }

  return {
    updatedState: stateChanged ? newState : state,
    mySlot: slot,
    stateChanged,
  };
}
