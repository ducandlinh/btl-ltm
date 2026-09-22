/**
 * Presence and online user tracking module.
 */

import { playhtml } from 'playhtml';

export function setupPresenceTracker(onUsersChanged) {
  try {
    if (playhtml?.users?.onChange) {
      return playhtml.users.onChange((users) => {
        if (onUsersChanged) {
          onUsersChanged(users);
        }
      });
    }
  } catch (err) {
    console.warn('[Presence] Warning setting up presence:', err);
  }
  return () => {};
}

export function getActiveUserCount() {
  try {
    return playhtml?.users?.getAll()?.length || 1;
  } catch (e) {
    return 1;
  }
}
