/**
 * Victory modal and How-To-Play rules modal components.
 */

import { PLAYERS, MODES } from '../game/constants.js';

export function renderVictoryModal(container, state, myPlayerSlot, { onRematch, onRestart, onMainMenu }) {
  if (!container) return;

  if (state?.status !== 'finished' || !state?.winner) {
    container.innerHTML = '';
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  const isLocal = state.mode === MODES.LOCAL;
  const winner = state.winner;
  const isP1Winner = winner === PLAYERS.PLAYER1;
  const isMyWin = !isLocal && myPlayerSlot && myPlayerSlot === winner;
  const isSpectator = !isLocal && (!myPlayerSlot || (myPlayerSlot !== PLAYERS.PLAYER1 && myPlayerSlot !== PLAYERS.PLAYER2));

  let title = isP1Winner ? 'Player 1 Wins!' : 'Player 2 Wins!';
  let winnerBadgeClass = isP1Winner ? 'text-indigo-400 bg-indigo-950/60 border-indigo-800' : 'text-rose-400 bg-rose-950/60 border-rose-800';

  if (!isLocal && !isSpectator) {
    title = isMyWin ? 'VICTORY!' : 'DEFEAT';
  }

  const reasonText = state.winReason === 'goal'
    ? `Objective Accomplished: Piece reached target goal cell (${winner === PLAYERS.PLAYER1 ? 'a1' : 'i9'})!`
    : 'Tactical Supremacy: Completely eliminated all opponent pieces of a single type!';

  const p1Voted = state.rematchVotes?.player1;
  const p2Voted = state.rematchVotes?.player2;
  const myVote = !isLocal && myPlayerSlot ? state.rematchVotes?.[myPlayerSlot] : false;

  container.innerHTML = `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-zinc-900 border border-zinc-700 rounded-xl max-w-md w-full p-6 shadow-2xl text-center flex flex-col items-center">
        <!-- Trophy Header -->
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 border ${winnerBadgeClass}">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
          </svg>
        </div>

        <h2 class="text-3xl font-extrabold tracking-wide mb-1 ${isP1Winner ? 'text-indigo-400' : 'text-rose-400'}">
          ${title}
        </h2>
        <p class="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-4">
          ${isP1Winner ? 'Player 1 (Indigo)' : 'Player 2 (Rose)'} ${isLocal ? ' - Hot-Seat Victory' : ''}
        </p>

        <div class="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3.5 mb-6 text-sm text-zinc-300 w-full text-left">
          <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Win Condition</span>
          ${reasonText}
        </div>

        ${!isLocal ? `
          <!-- Online Rematch Status -->
          <div class="flex items-center justify-center gap-4 text-xs font-medium text-zinc-400 mb-6 w-full">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 border ${p1Voted ? 'border-emerald-500 text-emerald-400' : 'border-zinc-700'}">
              <span>P1 Rematch:</span>
              <span>${p1Voted ? '✓ Agreed' : 'Waiting...'}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 border ${p2Voted ? 'border-emerald-500 text-emerald-400' : 'border-zinc-700'}">
              <span>P2 Rematch:</span>
              <span>${p2Voted ? '✓ Agreed' : 'Waiting...'}</span>
            </div>
          </div>
        ` : ''}

        <div class="w-full space-y-2">
          ${isLocal ? `
            <button id="modal-restart-btn" 
                    class="w-full py-3 px-4 rounded-lg font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950 transition-all">
              Restart Game
            </button>
          ` : !isSpectator ? `
            <button id="modal-rematch-btn" 
                    class="w-full py-3 px-4 rounded-lg font-bold text-sm transition-all ${myVote ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'}">
              ${myVote ? 'Waiting for Opponent...' : 'Agree to Rematch'}
            </button>
          ` : `
            <p class="text-xs text-zinc-500">Spectating match finish.</p>
          `}

          <button id="modal-menu-btn" 
                  class="w-full py-2.5 px-4 rounded-lg font-semibold text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/80 hover:bg-zinc-800 transition-colors">
            Return to Main Menu
          </button>
        </div>
      </div>
    </div>
  `;

  const restartBtn = container.querySelector('#modal-restart-btn');
  const rematchBtn = container.querySelector('#modal-rematch-btn');
  const menuBtn = container.querySelector('#modal-menu-btn');

  if (restartBtn && onRestart) restartBtn.addEventListener('click', onRestart);
  if (rematchBtn && !myVote && onRematch) rematchBtn.addEventListener('click', onRematch);
  if (menuBtn && onMainMenu) menuBtn.addEventListener('click', onMainMenu);
}

export function renderRulesModal(container, onClose) {
  if (!container) return;

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
          <h3 class="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            How to Play OTTv2
          </h3>
          <button id="close-rules-btn" class="text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto space-y-4 pr-1 text-sm text-zinc-300 custom-scrollbar">
          <section>
            <h4 class="font-bold text-zinc-100 mb-1 text-xs uppercase tracking-wider text-indigo-400">1. Board & Movement</h4>
            <p class="leading-relaxed text-zinc-300">
              The game is played on a <strong>9×9 grid</strong> (coordinates <code>a1</code> to <code>i9</code>).
              Pieces move <strong>exactly 1 square</strong> in any of the 8 directions (like a chess king: ↖ ↑ ↗ ← → ↙ ↓ ↘).
              No staying still. Friendly occupied cells are blocked.
            </p>
          </section>

          <section>
            <h4 class="font-bold text-zinc-100 mb-1 text-xs uppercase tracking-wider text-indigo-400">2. Combat & Blocking</h4>
            <div class="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs flex justify-around text-center my-2">
              <span class="text-amber-400 font-bold">Rock &gt; Scissors</span>
              <span class="text-emerald-400 font-bold">Scissors &gt; Paper</span>
              <span class="text-blue-400 font-bold">Paper &gt; Rock</span>
            </div>
            <p class="leading-relaxed text-zinc-300">
              Captures occur when moving onto an enemy piece. <strong>Same-type enemy pieces CANNOT be captured</strong> and block the destination cell. Attacking a piece that beats you is invalid.
            </p>
          </section>

          <section>
            <h4 class="font-bold text-zinc-100 mb-1 text-xs uppercase tracking-wider text-indigo-400">3. Win Conditions</h4>
            <ul class="list-disc list-inside space-y-1 text-zinc-300">
              <li><strong>Goal Reach:</strong> Player 1 reaches cell <code>a1</code> OR Player 2 reaches cell <code>i9</code>.</li>
              <li><strong>Type Elimination:</strong> Completely eliminate all pieces of ANY ONE piece type (Rock, Paper, or Scissors) of your opponent. <em>(Initial 0-count piece types do not count as eliminated).</em></li>
            </ul>
          </section>

          <section>
            <h4 class="font-bold text-zinc-100 mb-1 text-xs uppercase tracking-wider text-indigo-400">4. Play Modes</h4>
            <ul class="list-disc list-inside space-y-1 text-zinc-300">
              <li><strong>Local 2 Players:</strong> Hot-seat play on a single shared device without network.</li>
              <li><strong>Online Multiplayer:</strong> Real-time room-based multiplayer via PlayHTML.</li>
            </ul>
          </section>
        </div>

        <div class="pt-4 border-t border-zinc-800 mt-4 text-right">
          <button id="got-it-rules-btn" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold">
            Got it
          </button>
        </div>
      </div>
    </div>
  `;

  const closeBtn = container.querySelector('#close-rules-btn');
  const gotItBtn = container.querySelector('#got-it-rules-btn');

  const closeHandler = () => {
    container.innerHTML = '';
    container.classList.add('hidden');
    if (onClose) onClose();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeHandler);
  if (gotItBtn) gotItBtn.addEventListener('click', closeHandler);
}
