/**
 * Realtime online state synchronization controller.
 */

import { initOnlinePlayHtml, getPlayHtmlUserIdentity } from './playhtml.js';
import { registerPlayerInRoom } from './room.js';
import { executeMove, applyRematchVote } from '../../game/state.js';
import { showToast } from '../../ui/toast.js';

let adapter = null;
let currentOnlineState = null;
let myPlayerSlot = null;
let uiCallback = null;

export async function startOnlineSync(roomId, onStateChanged) {
  uiCallback = onStateChanged;
  const user = getPlayHtmlUserIdentity();

  adapter = await initOnlinePlayHtml(roomId, (remoteState) => {
    if (!remoteState) return;

    const { updatedState, mySlot, stateChanged } = registerPlayerInRoom(remoteState, user.id, user.name);
    currentOnlineState = updatedState;
    myPlayerSlot = mySlot;

    if (stateChanged && adapter?.setState) {
      adapter.setState(updatedState);
    }

    if (uiCallback) {
      uiCallback(currentOnlineState, myPlayerSlot);
    }
  });
}

export function getOnlineState() {
  return currentOnlineState;
}

export function getOnlinePlayerSlot() {
  return myPlayerSlot;
}

export function makeOnlineMove(pieceId, targetRow, targetCol) {
  if (!currentOnlineState || !myPlayerSlot) {
    showToast('You are a spectator. Only active players can move!', 'warning');
    return { ok: false, reason: 'Spectator move prohibited.' };
  }

  const result = executeMove(currentOnlineState, myPlayerSlot, pieceId, targetRow, targetCol);
  if (!result.ok) {
    showToast(result.reason, 'error');
    return result;
  }

  // Synchronize new state across online room
  currentOnlineState = result.state;
  if (adapter?.setState) {
    adapter.setState(result.state);
  }

  return result;
}

export function voteOnlineRematch() {
  if (!currentOnlineState || !myPlayerSlot) return;
  const newState = applyRematchVote(currentOnlineState, myPlayerSlot);
  currentOnlineState = newState;
  if (adapter?.setState) {
    adapter.setState(newState);
  }
}
