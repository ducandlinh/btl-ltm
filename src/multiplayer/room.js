/**
 * Player slot management and room flow logic.
 */

import { PLAYERS } from '../game/constants.js';

export function resolvePlayerSlot(state, myUserId) {
  if (!state || !myUserId) return null;

  const p1 = state.players?.player1;
  const p2 = state.players?.player2;

  // 1. Check if user is already assigned
  if (p1?.id === myUserId) return PLAYERS.PLAYER1;
  if (p2?.id === myUserId) return PLAYERS.PLAYER2;

  // 2. Assign free slot if available
  if (!p1) return PLAYERS.PLAYER1;
  if (!p2) return PLAYERS.PLAYER2;

  // 3. Otherwise spectator
  return null;
}

export function ensurePlayerRegistration(state, myUserId) {
  if (!state || !myUserId) return { updatedState: state, mySlot: null };

  const slot = resolvePlayerSlot(state, myUserId);

  let stateChanged = false;
  const newState = JSON.parse(JSON.stringify(state));

  if (slot === PLAYERS.PLAYER1 && !newState.players.player1) {
    newState.players.player1 = { id: myUserId, name: 'Player 1' };
    stateChanged = true;
  } else if (slot === PLAYERS.PLAYER2 && !newState.players.player2) {
    newState.players.player2 = { id: myUserId, name: 'Player 2' };
    stateChanged = true;
  }

  // Auto-start match when 2 players exist and status is waiting
  if (newState.players.player1 && newState.players.player2 && newState.status === 'waiting') {
    newState.status = 'playing';
    stateChanged = true;
  }

  return {
    updatedState: stateChanged ? newState : state,
    stateChanged,
    mySlot: slot,
  };
}
