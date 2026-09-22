/**
 * PlayHTML Random Matchmaking Lobby Controller.
 * Pairs waiting players into isolated 2-player rooms automatically.
 */

import { playhtml } from 'playhtml';
import { generateRoomId } from '../../utils/roomId.js';
import { getPlayHtmlUserIdentity } from './playhtml.js';

let lobbyHandle = null;
let currentLobbyState = null;
let lobbyCallback = null;
let matchFoundCallback = null;
let myUserId = null;

export async function initMatchmaker(onLobbyUpdated, onMatchFound) {
  lobbyCallback = onLobbyUpdated;
  matchFoundCallback = onMatchFound;
  myUserId = getPlayHtmlUserIdentity().id;

  try {
    playhtml.init({
      room: 'ottv2-matchmaking-lobby',
      developmentMode: false,
    });

    if (playhtml.ready) {
      await playhtml.ready;
    }
  } catch (err) {
    console.warn('[Matchmaker] Lobby init notice:', err);
  }

  const defaultLobby = {
    queue: [],
    matches: [],
  };

  try {
    const channel = playhtml.createPageData('ottv2-lobby-channel', defaultLobby);
    if (channel && channel.onChange) {
      channel.onChange((data) => {
        handleLobbyStateUpdate(data || defaultLobby);
      });
    }
    lobbyHandle = {
      getData: () => channel.get() || defaultLobby,
      setData: (data) => channel.set(data),
    };
  } catch (e) {
    lobbyHandle = playhtml.register('ottv2-lobby-root', {
      defaultData: defaultLobby,
      updateElement: ({ data }) => {
        handleLobbyStateUpdate(data || defaultLobby);
      },
    });
  }

  const initialData = lobbyHandle?.getData() || defaultLobby;
  handleLobbyStateUpdate(initialData);
}

function handleLobbyStateUpdate(data) {
  currentLobbyState = data;

  // Check if I am matched in any active match
  if (data?.matches && myUserId) {
    const activeMatch = data.matches.find(
      (m) => m.status === 'active' && (m.p1Id === myUserId || m.p2Id === myUserId)
    );

    if (activeMatch && matchFoundCallback) {
      matchFoundCallback(activeMatch.roomId);
    }
  }

  if (lobbyCallback) {
    lobbyCallback(currentLobbyState);
  }
}

export function startMatchmaking(userName) {
  if (!lobbyHandle || !currentLobbyState || !myUserId) return;

  const data = JSON.parse(JSON.stringify(currentLobbyState));
  data.queue = data.queue || [];
  data.matches = data.matches || [];

  // 1. Check if user is already in an active match
  const existingMatch = data.matches.find(
    (m) => m.status === 'active' && (m.p1Id === myUserId || m.p2Id === myUserId)
  );

  if (existingMatch) {
    if (matchFoundCallback) matchFoundCallback(existingMatch.roomId);
    return;
  }

  // 2. Look for another waiting candidate in queue
  const candidateIndex = data.queue.findIndex((q) => q.userId !== myUserId);

  if (candidateIndex !== -1) {
    // Found opponent! Pair them into an isolated room
    const candidate = data.queue[candidateIndex];

    // Remove candidate and self from queue
    data.queue = data.queue.filter((q) => q.userId !== myUserId && q.userId !== candidate.userId);

    const newRoomId = generateRoomId();

    data.matches.push({
      matchId: 'match_' + newRoomId,
      roomId: newRoomId,
      p1Id: candidate.userId,
      p2Id: myUserId,
      createdAt: Date.now(),
      status: 'active',
    });

    lobbyHandle.setData(data);

    if (matchFoundCallback) {
      matchFoundCallback(newRoomId);
    }
  } else {
    // No opponent yet, add self to waiting queue if not present
    const inQueue = data.queue.some((q) => q.userId === myUserId);
    if (!inQueue) {
      data.queue.push({
        userId: myUserId,
        userName: userName || 'Player',
        joinedAt: Date.now(),
      });
      lobbyHandle.setData(data);
    }
  }
}

export function cancelMatchmaking() {
  if (!lobbyHandle || !currentLobbyState || !myUserId) return;

  const data = JSON.parse(JSON.stringify(currentLobbyState));
  data.queue = (data.queue || []).filter((q) => q.userId !== myUserId);
  lobbyHandle.setData(data);
}

export function leaveCurrentMatch(roomId) {
  if (!lobbyHandle || !currentLobbyState || !roomId) return;

  const data = JSON.parse(JSON.stringify(currentLobbyState));
  data.matches = (data.matches || []).filter((m) => m.roomId !== roomId);
  data.queue = (data.queue || []).filter((q) => q.userId !== myUserId);
  lobbyHandle.setData(data);
}
