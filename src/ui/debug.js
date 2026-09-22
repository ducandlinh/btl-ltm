/**
 * Debug panel overlay component.
 */

export function renderDebugPanel(container, { roomId, isConnected, playerSlot, state, selectedPieceId, isVisible }) {
  if (!container) return;

  if (!isVisible) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');

  const formattedJson = JSON.stringify(state, null, 2);

  container.innerHTML = `
    <div class="fixed bottom-4 left-4 z-40 bg-zinc-950/95 border border-amber-800/80 rounded-xl p-4 shadow-2xl max-w-md w-full text-xs font-mono text-amber-200/90 backdrop-blur-md">
      <div class="flex items-center justify-between border-b border-amber-900/60 pb-2 mb-3">
        <h4 class="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
          OTTv2 Debug Inspector
        </h4>
        <span class="px-2 py-0.5 rounded text-[10px] bg-amber-950 border border-amber-800">
          DEBUG ON
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 mb-3 text-[11px]">
        <div><span class="text-zinc-500">Room ID:</span> <span class="font-bold text-zinc-100">${roomId || 'N/A'}</span></div>
        <div><span class="text-zinc-500">PlayHTML:</span> <span class="${isConnected ? 'text-emerald-400' : 'text-rose-400'} font-bold">${isConnected ? 'Connected' : 'Disconnected'}</span></div>
        <div><span class="text-zinc-500">Your Slot:</span> <span class="font-bold text-indigo-400">${playerSlot || 'Spectator'}</span></div>
        <div><span class="text-zinc-500">Active Turn:</span> <span class="font-bold text-rose-400">${state?.turn || 'N/A'}</span></div>
        <div><span class="text-zinc-500">Status:</span> <span class="font-bold text-zinc-100">${state?.status || 'N/A'}</span></div>
        <div><span class="text-zinc-500">Selected Piece:</span> <span class="font-bold text-zinc-100">${selectedPieceId || 'None'}</span></div>
      </div>

      <div class="border-t border-amber-900/60 pt-2">
        <span class="text-zinc-500 text-[10px] block mb-1">Serialized Game State:</span>
        <pre class="bg-zinc-900/90 border border-zinc-800 p-2 rounded text-[10px] max-h-48 overflow-y-auto text-zinc-300 custom-scrollbar">${formattedJson}</pre>
      </div>
    </div>
  `;
}
