/**
 * 9x9 Tactical Board Renderer Component.
 */

import { BOARD_SIZE, PLAYERS, PLAYER_GOALS } from '../game/constants.js';
import { getPieceSvg } from './pieces.js';
import { getValidDestinationsForPiece } from '../game/rules.js';

export function renderBoard(container, state, selectedPieceId, onCellClick) {
  if (!container || !state) return;

  const pieces = state.pieces || [];
  const validDestinations = selectedPieceId ? getValidDestinationsForPiece(state, selectedPieceId) : [];

  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let boardHtml = '';

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const piece = pieces.find((p) => p.row === r && p.col === c);
      const isSelected = piece && piece.id === selectedPieceId;
      const destinationInfo = validDestinations.find((d) => d.row === r && d.col === c);
      const isValidDestination = !!destinationInfo;
      const isCaptureTarget = isValidDestination && destinationInfo.isCapture;

      const isP1Goal = r === PLAYER_GOALS[PLAYERS.PLAYER1].row && c === PLAYER_GOALS[PLAYERS.PLAYER1].col; // a1
      const isP2Goal = r === PLAYER_GOALS[PLAYERS.PLAYER2].row && c === PLAYER_GOALS[PLAYERS.PLAYER2].col; // i9

      // Chessboard cell alternating background tint
      const isDarkSquare = (r + c) % 2 === 1;
      let cellBg = isDarkSquare ? 'bg-zinc-900/90' : 'bg-zinc-800/80';

      let borderRing = 'border-zinc-800';

      if (isSelected) {
        cellBg = piece.player === PLAYERS.PLAYER1 ? 'bg-indigo-950/80' : 'bg-rose-950/80';
        borderRing = piece.player === PLAYERS.PLAYER1 ? 'ring-2 ring-indigo-400 z-10' : 'ring-2 ring-rose-400 z-10';
      } else if (isCaptureTarget) {
        cellBg = 'bg-rose-950/90';
        borderRing = 'ring-2 ring-rose-500 ring-offset-1 ring-offset-zinc-950 z-10 animate-pulse';
      } else if (isValidDestination) {
        cellBg = 'bg-emerald-950/40 hover:bg-emerald-900/60';
        borderRing = 'border-emerald-600/60';
      }

      // Goal cell highlights
      let goalOverlay = '';
      if (isP1Goal) {
        goalOverlay = `
          <span class="absolute top-0.5 left-0.5 text-[8px] font-black text-indigo-400 opacity-70 tracking-tighter uppercase">
            P1 GOAL
          </span>
        `;
      } else if (isP2Goal) {
        goalOverlay = `
          <span class="absolute bottom-0.5 right-0.5 text-[8px] font-black text-rose-400 opacity-70 tracking-tighter uppercase">
            P2 GOAL
          </span>
        `;
      }

      // Coordinate notation labels for edges
      let notationLabel = '';
      if (r === 8 || c === 0) {
        const colLabel = r === 8 ? `<span class="absolute bottom-0.5 left-1 text-[9px] font-mono text-zinc-500 uppercase">${cols[c]}</span>` : '';
        const rowLabel = c === 0 ? `<span class="absolute top-0.5 left-1 text-[9px] font-mono text-zinc-500">${rows[r]}</span>` : '';
        notationLabel = `${colLabel}${rowLabel}`;
      }

      // Piece rendering
      let pieceHtml = '';
      let ariaPieceText = 'empty';
      if (piece) {
        const isP1 = piece.player === PLAYERS.PLAYER1;
        const playerColorClass = isP1
          ? 'bg-indigo-900/90 border-indigo-600 text-indigo-200 shadow-indigo-950'
          : 'bg-rose-900/90 border-rose-600 text-rose-200 shadow-rose-950';

        const selectedClass = isSelected ? 'scale-110 shadow-xl' : 'hover:scale-105';

        ariaPieceText = `${piece.player === PLAYERS.PLAYER1 ? 'Player 1' : 'Player 2'} ${piece.type}`;

        pieceHtml = `
          <div class="piece-card w-full h-full p-1 rounded-lg border shadow-md flex items-center justify-center transition-all ${playerColorClass} ${selectedClass}">
            ${getPieceSvg(piece.type, piece.player, 28)}
          </div>
        `;
      }

      // Valid destination dot indicator
      let destinationDot = '';
      if (isValidDestination && !isCaptureTarget) {
        destinationDot = `
          <div class="w-3 h-3 rounded-full bg-emerald-400/90 shadow-md shadow-emerald-950 animate-pulse pointer-events-none"></div>
        `;
      }

      const cellCoordNotation = `${cols[c]}${rows[r]}`;
      const ariaLabel = `Cell ${cellCoordNotation}, ${ariaPieceText}${isValidDestination ? ', valid move target' : ''}`;

      boardHtml += `
        <button type="button"
                data-row="${r}"
                data-col="${c}"
                data-notation="${cellCoordNotation}"
                aria-label="${ariaLabel}"
                tabindex="0"
                class="relative aspect-square p-1 border transition-all duration-150 flex items-center justify-center select-none outline-none focus:ring-2 focus:ring-amber-400 ${cellBg} ${borderRing}">
          ${goalOverlay}
          ${notationLabel}
          ${pieceHtml}
          ${destinationDot}
        </button>
      `;
    }
  }

  container.innerHTML = `
    <div class="board-grid w-full rounded-xl overflow-hidden border-2 border-zinc-800 bg-zinc-950 shadow-2xl p-1 gap-1">
      ${boardHtml}
    </div>
  `;

  // Attach click delegate
  const buttons = container.querySelectorAll('button[data-row]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const r = parseInt(btn.getAttribute('data-row'), 10);
      const c = parseInt(btn.getAttribute('data-col'), 10);
      if (onCellClick) onCellClick(r, c);
    });
  });
}
