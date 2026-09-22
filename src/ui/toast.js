/**
 * Toast notification component.
 */

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, type = 'warning', durationMs = 3000) {
  ensureToastContainer();

  const toast = document.createElement('div');
  
  let bgBorder = 'bg-zinc-900 border-zinc-700 text-zinc-100';
  let icon = `
    <svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>
  `;

  if (type === 'error') {
    bgBorder = 'bg-rose-950/90 border-rose-800 text-rose-100';
    icon = `
      <svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    `;
  } else if (type === 'success') {
    bgBorder = 'bg-emerald-950/90 border-emerald-800 text-emerald-100';
    icon = `
      <svg class="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    `;
  } else if (type === 'info') {
    bgBorder = 'bg-indigo-950/90 border-indigo-800 text-indigo-100';
    icon = `
      <svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    `;
  }

  toast.className = `pointer-events-auto flex items-center gap-3 p-3.5 rounded-lg border shadow-xl text-sm font-medium transition-all duration-200 transform translate-y-2 opacity-0 ${bgBorder}`;
  toast.innerHTML = `
    ${icon}
    <div class="flex-1">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger smooth fade/slide in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, durationMs);
}
