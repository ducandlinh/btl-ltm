/**
 * Main application orchestrator for OTTv2.
 * Connects Local Hot-Seat Mode, PlayHTML Random Matchmaking Lobby, and AudioManager.
 */

import './style.css';
import { getRoomIdFromUrl, updateRoomUrl, isDebugMode } from './utils/roomId.js';
import { startLocalGame, makeLocalMove, restartLocalGame } from './modes/local/localGame.js';
import { initMatchmaker, startMatchmaking, cancelMatchmaking, leaveCurrentMatch } from './modes/online/matchmaker.js';
import { startOnlineSync, makeOnlineMove, voteOnlineRematch } from './modes/online/sync.js';
import { setupOnlinePresence, getOnlineUserCount } from './modes/online/presence.js';
import { audioManager } from './audio/audioManager.js';
import { renderMainMenu, renderOnlineLobby } from './ui/menu.js';
import { renderBoard } from './ui/board.js';
import { renderPlayerCards, renderMoveHistory } from './ui/players.js';
import { renderHud } from './ui/hud.js';
import { renderVictoryModal, renderRulesModal } from './ui/modal.js';
import { renderDebugPanel } from './ui/debug.js';
import { MODES } from './game/constants.js';

// Application state
let currentMode = MODES.LOCAL; // 'local' | 'online'
let currentRoomId = null;
let selectedPieceId = null;
let isDebugVisible = isDebugMode();
let isOnlineConnected = true;
let previousMoveNumber = 0;
let previousPlayer2 = null;

// Matchmaking state
let matchmakerStatus = 'idle'; // 'idle' | 'searching' | 'matched'
let matchedRoomId = null;

// DOM Container Elements
const appMenuContainer = document.getElementById('app-menu-container');
const gameScreen = document.getElementById('game-screen');
const hudContainer = document.getElementById('hud-container');
const boardContainer = document.getElementById('board-container');
const playersContainer = document.getElementById('players-container');
const moveHistoryContainer = document.getElementById('move-history-container');
const waitingOverlay = document.getElementById('waiting-overlay');
const modalContainer = document.getElementById('modal-container');
const debugContainer = document.getElementById('debug-container');

function initApp() {
  const roomIdFromUrl = getRoomIdFromUrl();

  if (roomIdFromUrl) {
    launchOnlineRoom(roomIdFromUrl);
  } else {
    showMainMenu();
  }

  setupOnlinePresence(() => {
    isOnlineConnected = true;
    if (currentMode === MODES.ONLINE) {
      updateUi(window._lastState, window._lastMySlot);
    }
  });
}

function showMainMenu() {
  selectedPieceId = null;
  previousMoveNumber = 0;
  previousPlayer2 = null;
  matchmakerStatus = 'idle';
  matchedRoomId = null;
  updateRoomUrl(null);

  appMenuContainer.classList.remove('hidden');
  gameScreen.classList.add('hidden');

  renderMainMenu(appMenuContainer, {
    onStartLocal: () => launchLocalGame(),
    onSelectOnline: () => showOnlineLobby(),
    onOpenRules: () => renderRulesModal(modalContainer),
  });
}

function showOnlineLobby() {
  appMenuContainer.classList.remove('hidden');
  gameScreen.classList.add('hidden');

  const updateLobbyUi = () => {
    const onlineCount = getOnlineUserCount();
    renderOnlineLobby(appMenuContainer, {
      onlineCount,
      status: matchmakerStatus,
      matchedRoomId,
      onFindMatch: () => {
        matchmakerStatus = 'searching';
        startMatchmaking('Player');
        updateLobbyUi();
      },
      onCancelMatch: () => {
        matchmakerStatus = 'idle';
        cancelMatchmaking();
        updateLobbyUi();
      },
      onBackToMenu: () => {
        cancelMatchmaking();
        showMainMenu();
      },
    });
  };

  updateLobbyUi();

  // Initialize PlayHTML matchmaker
  initMatchmaker(
    () => {
      updateLobbyUi();
    },
    (roomId) => {
      if (matchmakerStatus !== 'matched') {
        matchmakerStatus = 'matched';
        matchedRoomId = roomId;
        audioManager.playSound('playerJoined');
        updateLobbyUi();

        // Auto-launch matched room after short delay
        setTimeout(() => {
          launchOnlineRoom(roomId);
        }, 1200);
      }
    }
  );
}

function launchLocalGame() {
  currentMode = MODES.LOCAL;
  currentRoomId = null;
  selectedPieceId = null;
  previousMoveNumber = 0;
  updateRoomUrl(null);

  appMenuContainer.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  startLocalGame((state, activeTurn) => {
    window._lastState = state;
    window._lastMySlot = activeTurn;
    updateUi(state, activeTurn);
  });
}

function launchOnlineRoom(roomId) {
  currentMode = MODES.ONLINE;
  currentRoomId = roomId;
  selectedPieceId = null;
  previousMoveNumber = 0;
  updateRoomUrl(roomId);

  appMenuContainer.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  startOnlineSync(roomId, (state, mySlot) => {
    window._lastState = state;
    window._lastMySlot = mySlot;
    updateUi(state, mySlot);
  });
}

function handleCellClick(row, col, state, mySlot) {
  if (!state || state.status !== 'playing') return;

  const isLocal = currentMode === MODES.LOCAL;
  const activeSlot = isLocal ? state.turn : mySlot;

  const pieceAtCell = state.pieces?.find((p) => p.row === row && p.col === col);

  // Friendly piece selection
  if (pieceAtCell && pieceAtCell.player === activeSlot) {
    if (state.turn !== activeSlot) {
      audioManager.playSound('invalid');
      return;
    }
    selectedPieceId = pieceAtCell.id;
    audioManager.playSound('select');
    updateUi(state, mySlot);
    return;
  }

  // Attempt move if piece selected
  if (selectedPieceId) {
    let result;
    if (isLocal) {
      result = makeLocalMove(selectedPieceId, row, col);
    } else {
      result = makeOnlineMove(selectedPieceId, row, col);
    }

    if (result.ok) {
      selectedPieceId = null;
      if (result.capturedPiece) {
        audioManager.playSound('capture');
      } else {
        audioManager.playSound('move');
      }
    } else {
      audioManager.playSound('invalid');
    }

    updateUi(window._lastState || state, mySlot);
  }
}

function updateUi(state, mySlot) {
  if (!state) return;

  const isLocal = currentMode === MODES.LOCAL;
  const activeSlot = isLocal ? state.turn : mySlot;

  // Sound triggers on state changes (deduplicated)
  if (state.moveNumber > previousMoveNumber && previousMoveNumber > 0) {
    audioManager.playSoundOnce(`turn_${state.moveNumber}`, 'turn');
  }
  previousMoveNumber = state.moveNumber;

  if (!isLocal && state.players?.player2 && !previousPlayer2) {
    audioManager.playSoundOnce('p2_joined', 'playerJoined');
  }
  previousPlayer2 = state.players?.player2 || null;

  if (state.status === 'finished' && state.winner) {
    const isWin = isLocal ? true : (mySlot === state.winner);
    audioManager.playSoundOnce(`finish_${state.moveNumber}`, isWin ? 'victory' : 'defeat');
  }

  // 1. HUD Header
  renderHud(hudContainer, {
    mode: currentMode,
    roomId: currentRoomId,
    isConnected: isLocal ? true : isOnlineConnected,
    isDebug: isDebugMode(),
    onLeave: () => {
      if (!isLocal && currentRoomId) {
        leaveCurrentMatch(currentRoomId);
      }
      showMainMenu();
    },
    onOpenRules: () => renderRulesModal(modalContainer),
    onRestartLocal: () => {
      if (isLocal) {
        audioManager.playSound('rematch');
        restartLocalGame();
      }
    },
    onToggleDebug: () => {
      isDebugVisible = !isDebugVisible;
      updateUi(state, mySlot);
    },
  });

  // 2. Waiting Room Overlay (Online only)
  if (!isLocal && state.status === 'waiting') {
    waitingOverlay.classList.remove('hidden');
    const fullInviteUrl = `${window.location.origin}/?room=${currentRoomId}`;
    
    const inviteLinkText = document.getElementById('waiting-invite-url');
    if (inviteLinkText) {
      inviteLinkText.textContent = fullInviteUrl;
    }

    const copyBtn = document.getElementById('waiting-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = () => {
        audioManager.playSound('click');
        navigator.clipboard.writeText(fullInviteUrl);
      };
    }
  } else {
    waitingOverlay.classList.add('hidden');
  }

  // 3. Board Grid
  renderBoard(boardContainer, state, selectedPieceId, (r, c) => {
    handleCellClick(r, c, state, mySlot);
  });

  // 4. Player Cards
  renderPlayerCards(playersContainer, state, activeSlot);

  // 5. Move History Log
  renderMoveHistory(moveHistoryContainer, state.moveHistory);

  // 6. Victory Modal
  renderVictoryModal(modalContainer, state, activeSlot, {
    onRestart: () => {
      audioManager.playSound('rematch');
      restartLocalGame();
    },
    onRematch: () => {
      audioManager.playSound('rematch');
      voteOnlineRematch();
    },
    onMainMenu: () => {
      if (!isLocal && currentRoomId) {
        leaveCurrentMatch(currentRoomId);
      }
      audioManager.playSound('click');
      showMainMenu();
    },
  });

  // 7. Debug Panel
  renderDebugPanel(debugContainer, {
    roomId: currentRoomId,
    isConnected: isLocal ? true : isOnlineConnected,
    playerSlot: activeSlot,
    state,
    selectedPieceId,
    isVisible: isDebugVisible,
  });
}

document.addEventListener('DOMContentLoaded', initApp);
