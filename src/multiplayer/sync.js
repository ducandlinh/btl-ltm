/**
 * State synchronization controller bridge.
 */

import { initPlayHtmlSync, getSyncedState, setSyncedState, getMyUserId } from './playhtml.js';
import { ensurePlayerRegistration } from './room.js';
import { executeMove, applyRematchVote } from '../game/state.js';
import { showToast } from '../ui/toast.js';

let currentState = null;
let currentMySlot = null;
let uiRenderCallback = null;

export async function startMultiplayerSync(roomId, renderUi) {
  uiRenderCallback = renderUi;
  const myUserId = getMyUserId();

  await initPlayHtmlSync(roomId, (remoteState) => {
    if (!remoteState) return;

    // Check player registration
    const { updatedState, stateChanged, mySlot } = ensurePlayerRegistration(remoteState, myUserId);
    currentState = updatedState;
    currentMySlot = mySlot;

    if (stateChanged) {
      setSyncedState(updatedState);
    }

    if (uiRenderCallback) {
      uiRenderCallback(currentState, currentMySlot);
    }
  });
}

export function getCurrentSyncedState() {
  return currentState;
}

export function getMySlot() {
  return currentMySlot;
}

export function dispatchPlayerMove(pieceId, targetRow, targetCol) {
  if (!currentState) return false;

  const mySlot = getMySlot();
  if (!mySlot) {
    showToast('You are a spectator. Only active players can make moves!', 'warning');
    return false;
  }

  const result = executeMove(currentState, mySlot, pieceId, targetRow, targetCol);
  if (!result.success) {
    showToast(result.error, 'error');
    return false;
  }

  // Update synchronized state across all clients
  setSyncedState(result.newState);
  return true;
}

export function dispatchRematchVote() {
  if (!currentState) return;
  const mySlot = getMySlot();
  if (!mySlot) return;

  const nextState = applyRematchVote(currentState, mySlot);
  setSyncedState(nextState);
}
