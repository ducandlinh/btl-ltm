/**
 * PlayHTML Realtime Synchronization Wrapper.
 */

import { playhtml } from 'playhtml';
import { createInitialState } from '../game/state.js';

let stateHandle = null;
let onStateUpdateCallback = null;

export async function initPlayHtmlSync(roomId, onStateUpdated) {
  onStateUpdateCallback = onStateUpdated;

  // 1. Initialize playhtml with the specified room namespace
  try {
    await playhtml.init({
      room: `ottv2-${roomId}`,
      developmentMode: false,
    });
  } catch (err) {
    console.warn('[PlayHTML] Init warning or fallback:', err);
  }

  const defaultState = createInitialState(roomId);

  // 2. Register the custom state element using playhtml.register
  stateHandle = playhtml.register('ottv2-state-root', {
    defaultData: defaultState,
    updateElement: ({ data }) => {
      if (onStateUpdateCallback && data) {
        onStateUpdateCallback(data);
      }
    },
  });

  // Trigger initial callback with current data if available
  const currentData = stateHandle?.getData() || defaultState;
  if (onStateUpdateCallback) {
    onStateUpdateCallback(currentData);
  }

  return stateHandle;
}

export function getSyncedState() {
  return stateHandle?.getData() || null;
}

export function setSyncedState(nextState) {
  if (!stateHandle) return;
  stateHandle.setData(nextState);
}

export function getMyUserId() {
  try {
    return playhtml.users?.me?.pid || getFallbackClientId();
  } catch (e) {
    return getFallbackClientId();
  }
}

function getFallbackClientId() {
  let id = sessionStorage.getItem('ottv2_client_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('ottv2_client_id', id);
  }
  return id;
}
