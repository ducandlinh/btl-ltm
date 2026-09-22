/**
 * Online Presence tracking module using PlayHTML presence.
 */

import { playhtml } from 'playhtml';

export function setupOnlinePresence(onUsersChanged) {
  try {
    if (playhtml.users?.onChange) {
      return playhtml.users.onChange((users) => {
        if (onUsersChanged) {
          onUsersChanged(users);
        }
      });
    }
  } catch (err) {
    console.warn('[Presence] PlayHTML users listener notice:', err);
  }
  return () => {};
}

export function getOnlineUserCount() {
  try {
    return playhtml.users?.getAll()?.length || 1;
  } catch (e) {
    return 1;
  }
}
