/**
 * State creation and mutation functions.
 */

import { PLAYERS, MODES, INITIAL_SETUP } from './constants.js';
import { validateMove } from './rules.js';
import { capturePiece } from './capture.js';
import { countActivePieces, checkWin } from './winCondition.js';
import { switchTurn } from './turn.js';

export const MAX_MOVE_HISTORY = 50;

export function createInitialState(mode = MODES.LOCAL, roomId = null) {
  const initialPieces = JSON.parse(JSON.stringify(INITIAL_SETUP.pieces));
  const initialCounts = countActivePieces(initialPieces);
  const isLocal = mode === MODES.LOCAL;

  return {
    roomId: roomId || null,
    mode: mode || MODES.LOCAL,
    status: isLocal ? 'playing' : 'waiting', // 'waiting' | 'playing' | 'finished'
    turn: PLAYERS.PLAYER1,
    winner: null,
    winReason: null,
    players: {
      player1: isLocal ? { id: 'local_p1', name: 'Player 1' } : null,
      player2: isLocal ? { id: 'local_p2', name: 'Player 2' } : null,
    },
    pieces: initialPieces,
    initialPieceCounts: initialCounts,
    rematchVotes: {
      player1: false,
      player2: false,
    },
    moveHistory: [],
    moveNumber: 0,
  };
}

export function executeMove(state, playerSlot, pieceId, targetRow, targetCol) {
  const validation = validateMove(state, playerSlot, pieceId, targetRow, targetCol);
  if (!validation.valid) {
    return {
      ok: false,
      reason: validation.error,
      state,
      move: null,
      capturedPiece: null,
      winner: null,
    };
  }

  const newState = JSON.parse(JSON.stringify(state));
  const piece = newState.pieces.find((p) => p.id === pieceId);
  const fromPos = { row: piece.row, col: piece.col };
  const toPos = { row: targetRow, col: targetCol };

  piece.row = targetRow;
  piece.col = targetCol;

  let capturedPieceInfo = null;
  if (validation.capturedPiece) {
    capturedPieceInfo = {
      id: validation.capturedPiece.id,
      player: validation.capturedPiece.player,
      type: validation.capturedPiece.type,
    };
    newState.pieces = capturePiece(newState.pieces, validation.capturedPiece.id);
  }

  const moveNumber = newState.moveNumber + 1;
  newState.moveNumber = moveNumber;

  const moveRecord = {
    number: moveNumber,
    player: playerSlot,
    pieceId: piece.id,
    pieceType: piece.type,
    from: fromPos,
    to: toPos,
    capturedPiece: capturedPieceInfo,
  };

  newState.moveHistory.push(moveRecord);

  // Cap move history to avoid unbounded state growth
  if (newState.moveHistory.length > MAX_MOVE_HISTORY) {
    newState.moveHistory.shift();
  }

  const winCheck = checkWin(newState.pieces, newState.initialPieceCounts, piece);

  if (winCheck) {
    newState.status = 'finished';
    newState.winner = winCheck.winner;
    newState.winReason = winCheck.reason;
  } else {
    newState.turn = switchTurn(newState.turn);
  }

  return {
    ok: true,
    reason: null,
    state: newState,
    move: moveRecord,
    capturedPiece: capturedPieceInfo,
    winner: newState.winner,
  };
}

export function applyRematchVote(state, playerSlot) {
  if (!state) return state;

  const newState = JSON.parse(JSON.stringify(state));

  if (newState.mode === MODES.LOCAL) {
    // Local mode restarts immediately
    return createInitialState(MODES.LOCAL, null);
  }

  if (playerSlot === PLAYERS.PLAYER1 || playerSlot === PLAYERS.PLAYER2) {
    newState.rematchVotes[playerSlot] = true;
  }

  if (newState.rematchVotes.player1 && newState.rematchVotes.player2) {
    const freshState = createInitialState(MODES.ONLINE, newState.roomId);
    freshState.players = newState.players;
    freshState.status = 'playing';
    return freshState;
  }

  return newState;
}
