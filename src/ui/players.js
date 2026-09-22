/**
 * Player cards, piece count panel, and move history log components.
 */

import { PLAYERS, PIECE_TYPES, MODES } from '../game/constants.js';
import { countActivePieces } from '../game/winCondition.js';
import { getPieceSvg } from './pieces.js';

export function renderPlayerCards(container, state, myPlayerSlot) {
  if (!container || !state) return;

  const activeCounts = countActivePieces(state.pieces);
  const currentTurn = state.turn;
  const isPlaying = state.status === 'playing';
  const isLocal = state.mode === MODES.LOCAL;

  function renderCard(playerKey, label) {
    const isTurn = isPlaying && currentTurn === playerKey;
    const isMe = !isLocal && myPlayerSlot === playerKey;
    const counts = activeCounts[playerKey] || { rock: 0, paper: 0, scissors: 0 };
    const playerObj = state.players?.[playerKey];
    const isOccupied = !!playerObj;

    const borderClass = isTurn
      ? (playerKey === PLAYERS.PLAYER1 ? 'border-indigo-500 shadow-lg shadow-indigo-950/50' : 'border-rose-500 shadow-lg shadow-rose-950/50')
      : 'border-zinc-800 bg-zinc-900/60';

    const bgClass = playerKey === PLAYERS.PLAYER1 ? 'bg-indigo-950/20' : 'bg-rose-950/20';
    const textTheme = playerKey === PLAYERS.PLAYER1 ? 'text-indigo-400' : 'text-rose-400';
    const badgeBg = playerKey === PLAYERS.PLAYER1 ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white';
    const goalTarget = playerKey === PLAYERS.PLAYER1 ? 'a1' : 'i9';

    let connStatusText = isLocal ? 'Connected' : isOccupied ? 'Connected' : 'Waiting for Player 2...';
    let connStatusClass = (isLocal || isOccupied) ? 'text-emerald-400' : 'text-amber-400 animate-pulse';

    return `
      <div class="p-4 rounded-xl border transition-all duration-200 ${borderClass} ${bgClass} flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm ${textTheme}">${label}</span>
              ${isMe ? `<span class="px-1.5 py-0.5 text-[10px] font-black rounded uppercase ${badgeBg}">YOU</span>` : ''}
            </div>
            ${isTurn ? `
              <span class="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse">
                Active Turn
              </span>
            ` : ''}
          </div>

          <div class="flex items-center justify-between text-xs text-zinc-400 font-mono mb-3">
            <span>Goal: <strong class="text-amber-400">${goalTarget}</strong></span>
            <span class="${connStatusClass} text-[11px] font-sans font-semibold">${connStatusText}</span>
          </div>
        </div>

        <!-- Piece Count Grid -->
        <div class="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-800/80">
          <div class="bg-zinc-950/60 p-1.5 rounded border border-zinc-800/60 text-center flex flex-col items-center">
            ${getPieceSvg(PIECE_TYPES.ROCK, playerKey, 20)}
            <span class="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">Rock</span>
            <span class="font-mono font-bold text-sm text-zinc-100">${counts.rock}</span>
          </div>
          <div class="bg-zinc-950/60 p-1.5 rounded border border-zinc-800/60 text-center flex flex-col items-center">
            ${getPieceSvg(PIECE_TYPES.PAPER, playerKey, 20)}
            <span class="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">Paper</span>
            <span class="font-mono font-bold text-sm text-zinc-100">${counts.paper}</span>
          </div>
          <div class="bg-zinc-950/60 p-1.5 rounded border border-zinc-800/60 text-center flex flex-col items-center">
            ${getPieceSvg(PIECE_TYPES.SCISSORS, playerKey, 20)}
            <span class="text-[10px] uppercase tracking-wider text-zinc-400 mt-1">Scissors</span>
            <span class="font-mono font-bold text-sm text-zinc-100">${counts.scissors}</span>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      ${renderCard(PLAYERS.PLAYER1, 'Player 1')}
      ${renderCard(PLAYERS.PLAYER2, 'Player 2')}
    </div>
  `;
}

export function renderMoveHistory(container, moveHistory) {
  if (!container) return;

  if (!Array.isArray(moveHistory) || moveHistory.length === 0) {
    container.innerHTML = `
      <div class="text-xs text-zinc-500 italic p-4 text-center">
        No moves played yet.
      </div>
    `;
    return;
  }

  const items = [...moveHistory].reverse().map((move) => {
    const isP1 = move.player === PLAYERS.PLAYER1;
    const playerBadge = isP1 ? 'P1' : 'P2';
    const badgeColor = isP1 ? 'bg-indigo-950 text-indigo-400 border-indigo-800' : 'bg-rose-950 text-rose-400 border-rose-800';

    const colNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    const rowNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    const fromNotation = `${colNames[move.from.col]}${rowNames[move.from.row]}`;
    const toNotation = `${colNames[move.to.col]}${rowNames[move.to.row]}`;

    let captureHtml = '';
    if (move.capturedPiece) {
      captureHtml = `
        <span class="text-rose-400 font-bold flex items-center gap-0.5 ml-1">
          ⚔ ${move.capturedPiece.type.toUpperCase()}
        </span>
      `;
    }

    return `
      <div class="flex items-center justify-between p-2 rounded bg-zinc-950/80 border border-zinc-800/80 text-xs font-mono">
        <div class="flex items-center gap-2">
          <span class="text-zinc-500">#${move.number}</span>
          <span class="px-1.5 py-0.5 text-[10px] font-bold rounded border ${badgeColor}">${playerBadge}</span>
          <span class="text-zinc-200 capitalize font-semibold">${move.pieceType}</span>
        </div>
        <div class="flex items-center gap-1.5 text-zinc-300">
          <span>${fromNotation}</span>
          <span class="text-zinc-500">→</span>
          <span class="font-bold text-zinc-100">${toNotation}</span>
          ${captureHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="space-y-1.5">
      ${items}
    </div>
  `;
}
