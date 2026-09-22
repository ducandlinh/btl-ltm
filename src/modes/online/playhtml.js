/**
 * PlayHTML Online Multiplayer Adapter using documented PlayHTML APIs.
 */

import { playhtml } from 'playhtml';
import { createInitialState } from '../../game/state.js';
import { MODES } from '../../game/constants.js';

let pageDataChannel = null;

export async function initOnlinePlayHtml(roomId, onStateUpdated) {
  try {
    playhtml.init({
      room: `ottv2-${roomId}`,
      developmentMode: false,
    });

    if (playhtml.ready) {
      await playhtml.ready;
    }
  } catch (err) {
    console.warn('[PlayHTML] Init notification:', err);
  }

  const defaultState = createInitialState(MODES.ONLINE, roomId);

  try {
    pageDataChannel = playhtml.createPageData('ottv2-shared-state', defaultState);
    if (pageDataChannel && pageDataChannel.onChange) {
      pageDataChannel.onChange((data) => {
        if (onStateUpdated && data) {
          onStateUpdated(data);
        }
      });
    }
  } catch (e) {
    console.warn('[PlayHTML] PageData fallback:', e);
  }

  // Fallback to playhtml.register for state handle if pageDataChannel is unavailable
  if (!pageDataChannel || !pageDataChannel.get) {
    const handle = playhtml.register('ottv2-state-root', {
      defaultData: defaultState,
      updateElement: ({ data }) => {
        if (onStateUpdated && data) {
          onStateUpdated(data);
        }
      },
    });

    return {
      getState: () => handle.getData() || defaultState,
      setState: (newState) => handle.setData(newState),
    };
  }

  return {
    getState: () => pageDataChannel.get() || defaultState,
    setState: (newState) => pageDataChannel.set(newState),
  };
}

export function getPlayHtmlUserIdentity() {
  try {
    if (playhtml.users?.me?.pid) {
      return {
        id: playhtml.users.me.pid,
        name: playhtml.users.me.name || 'User ' + playhtml.users.me.pid.substring(0, 4),
      };
    }
  } catch (e) {
    // ignore
  }

  // Session storage fallback if playhtml user identity unavailable
  let fallbackId = sessionStorage.getItem('ottv2_online_pid');
  if (!fallbackId) {
    fallbackId = 'u_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('ottv2_online_pid', fallbackId);
  }
  return { id: fallbackId, name: 'User ' + fallbackId.substring(2, 6) };
}
