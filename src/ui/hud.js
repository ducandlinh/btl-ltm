/**
 * Top HUD header bar component with Audio Mute/Volume controls.
 */

import { MODES } from '../game/constants.js';
import { audioManager } from '../audio/audioManager.js';
import { showToast } from './toast.js';

export function renderHud(container, { mode, roomId, isConnected, isDebug, onLeave, onOpenRules, onToggleDebug, onRestartLocal }) {
  if (!container) return;

  const isLocal = mode === MODES.LOCAL;
  const isMuted = audioManager.isMuted();
  const volume = audioManager.getVolume();

  container.innerHTML = `
    <header class="w-full bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shadow-md">
      <!-- Title & Mode Badge -->
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">
          OTTv2
        </h1>
        <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
          isLocal
            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
            : isConnected
              ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800'
              : 'bg-amber-950/80 text-amber-400 border-amber-800'
        } flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full ${isLocal ? 'bg-emerald-400' : isConnected ? 'bg-indigo-400 animate-pulse' : 'bg-amber-400'}"></span>
          ${isLocal ? 'Local 2P Hot-Seat' : isConnected ? 'Online Live' : 'Connecting...'}
        </span>
      </div>

      <!-- Center/Right Action Buttons & Sound Preferences -->
      <div class="flex items-center gap-2 sm:gap-3">

        <!-- Sound Mute & Volume Control -->
        <div class="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
          <button id="hud-sound-toggle" 
                  title="${isMuted ? 'Unmute Sound' : 'Mute Sound'}"
                  class="p-1 rounded text-zinc-300 hover:text-white transition-colors">
            ${
              isMuted
                ? `<svg class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                   </svg>`
                : `<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                   </svg>`
            }
          </button>
          <input id="hud-volume-slider" 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.05" 
                 value="${volume}"
                 title="Volume"
                 class="w-14 sm:w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
        </div>

        ${!isLocal && roomId ? `
          <div class="hidden sm:flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 font-mono text-xs font-bold text-zinc-300">
            <span class="text-zinc-500 uppercase">Room:</span>
            <span class="text-indigo-400 tracking-wider">${roomId}</span>
          </div>

          <button id="hud-copy-btn" 
                  title="Copy Invite Link" 
                  class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-medium">
            <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span class="hidden md:inline">Invite</span>
          </button>
        ` : ''}

        ${isLocal ? `
          <button id="hud-restart-btn" 
                  title="Restart Local Game"
                  class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span class="hidden md:inline">Restart</span>
          </button>
        ` : ''}

        <button id="hud-rules-btn" 
                title="How to Play"
                class="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-medium">
          <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="hidden md:inline">Rules</span>
        </button>

        ${isDebug ? `
          <button id="hud-debug-btn" 
                  title="Toggle Debug Panel"
                  class="p-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition-colors text-xs font-medium flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <span class="hidden md:inline">Debug</span>
          </button>
        ` : ''}

        <button id="hud-leave-btn" 
                title="${isLocal ? 'Main Menu' : 'Leave Room'}"
                class="p-2 rounded-lg bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-zinc-400 border border-zinc-700 hover:border-rose-800 transition-colors flex items-center gap-1 text-xs font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="hidden md:inline">${isLocal ? 'Menu' : 'Leave'}</span>
        </button>
      </div>
    </header>
  `;

  // Sound listeners
  const soundToggle = container.querySelector('#hud-sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      audioManager.toggleMute();
      audioManager.playSound('click');
      renderHud(container, { mode, roomId, isConnected, isDebug, onLeave, onOpenRules, onToggleDebug, onRestartLocal });
    });
  }

  const volumeSlider = container.querySelector('#hud-volume-slider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      audioManager.setVolume(val);
    });
  }

  const copyBtn = container.querySelector('#hud-copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Invite link copied to clipboard!', 'success');
      });
    });
  }

  const restartBtn = container.querySelector('#hud-restart-btn');
  if (restartBtn && onRestartLocal) {
    restartBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onRestartLocal();
    });
  }

  const rulesBtn = container.querySelector('#hud-rules-btn');
  if (rulesBtn && onOpenRules) {
    rulesBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onOpenRules();
    });
  }

  const debugBtn = container.querySelector('#hud-debug-btn');
  if (debugBtn && onToggleDebug) {
    debugBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onToggleDebug();
    });
  }

  const leaveBtn = container.querySelector('#hud-leave-btn');
  if (leaveBtn && onLeave) {
    leaveBtn.addEventListener('click', () => {
      audioManager.playSound('click');
      onLeave();
    });
  }
}
