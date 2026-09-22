/**
 * Main Menu & Random Matchmaking Lobby Screen Components.
 */

import { audioManager } from '../audio/audioManager.js';

export function renderMainMenu(container, { onStartLocal, onSelectOnline, onOpenRules }) {
  if (!container) return;

  container.innerHTML = `
    <main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div class="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center backdrop-blur-sm">
        <!-- Logo Header -->
        <div class="inline-flex p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 mb-4 shadow-inner">
          <svg class="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>

        <h1 class="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 mb-1">
          OTTv2
        </h1>
        <p class="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-8">
          Strategic Rock · Paper · Scissors
        </p>

        <!-- Mode Select Buttons -->
        <div class="space-y-3.5">
          <button id="menu-local-btn" 
                  class="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-950/50 transition-all transform active:scale-95 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            LOCAL 2 PLAYERS (HOT-SEAT)
          </button>

          <button id="menu-online-btn" 
                  class="w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg shadow-indigo-950/50 transition-all transform active:scale-95 flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.6 9h16.8M3.6 15h16.8"/>
            </svg>
            ONLINE MULTIPLAYER
          </button>

          <button id="menu-rules-btn" 
                  class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center gap-1.5 pt-2">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            HOW TO PLAY
          </button>
        </div>
      </div>
    </main>
  `;

  const localBtn = container.querySelector('#menu-local-btn');
  const onlineBtn = container.querySelector('#menu-online-btn');
  const rulesBtn = container.querySelector('#menu-rules-btn');

  if (localBtn && onStartLocal) {
    localBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onStartLocal();
    });
  }
  if (onlineBtn && onSelectOnline) {
    onlineBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onSelectOnline();
    });
  }
  if (rulesBtn && onOpenRules) {
    rulesBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onOpenRules();
    });
  }
}

export function renderOnlineLobby(container, { onlineCount = 1, status = 'idle', matchedRoomId = null, onFindMatch, onCancelMatch, onBackToMenu }) {
  if (!container) return;

  const isSearching = status === 'searching';
  const isMatched = status === 'matched';

  container.innerHTML = `
    <main class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      <div class="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center backdrop-blur-sm">
        <h2 class="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300 mb-2 uppercase">
          ONLINE MATCHMAKING
        </h2>

        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-400 mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Players Online: <span class="text-indigo-400 font-bold">${onlineCount}</span>
        </div>

        ${
          isMatched
            ? `
          <div class="p-6 rounded-xl bg-emerald-950/60 border border-emerald-700/80 text-center animate-fade-in mb-6">
            <div class="w-12 h-12 rounded-full bg-emerald-900 border border-emerald-600 flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-emerald-300 mb-1">MATCH FOUND!</h3>
            <p class="text-xs text-emerald-200/80 mb-2">Opponent connected.</p>
            <div class="font-mono text-xs text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded inline-block border border-zinc-800 mb-3">
              Room: <span class="text-indigo-400 font-bold">${matchedRoomId}</span>
            </div>
            <p class="text-[11px] text-zinc-400 italic">Starting game...</p>
          </div>
        `
            : isSearching
              ? `
          <div class="p-6 rounded-xl bg-zinc-950/80 border border-indigo-900/80 text-center mb-6">
            <div class="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-3"></div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">Status:</span>
            <span class="text-sm font-semibold text-zinc-200 block mb-4">Waiting for opponent...</span>

            <button id="lobby-cancel-btn" 
                    class="py-2 px-5 rounded-lg font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-colors">
              Cancel Search
            </button>
          </div>
        `
              : `
          <button id="lobby-find-btn" 
                  class="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wider bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-xl shadow-indigo-950/50 transition-all transform active:scale-95 flex items-center justify-center gap-2 mb-6">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            FIND MATCH
          </button>
        `
        }

        <button id="lobby-back-btn" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Return to Main Menu
        </button>
      </div>
    </main>
  `;

  const findBtn = container.querySelector('#lobby-find-btn');
  const cancelBtn = container.querySelector('#lobby-cancel-btn');
  const backBtn = container.querySelector('#lobby-back-btn');

  if (findBtn && onFindMatch) {
    findBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onFindMatch();
    });
  }

  if (cancelBtn && onCancelMatch) {
    cancelBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onCancelMatch();
    });
  }

  if (backBtn && onBackToMenu) {
    backBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onBackToMenu();
    });
  }
}
