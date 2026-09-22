/**
 * Room ID and URL parameter utilities.
 */

export function generateRoomId(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid lookalikes (0/O, 1/I)
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getRoomIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  return room ? room.trim().toUpperCase() : null;
}

export function isDebugMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('debug') === 'true' || params.get('debug') === '1';
}

export function updateRoomUrl(roomId) {
  const url = new URL(window.location.href);
  if (roomId) {
    url.searchParams.set('room', roomId);
  } else {
    url.searchParams.delete('room');
  }
  window.history.pushState({}, '', url.toString());
}
