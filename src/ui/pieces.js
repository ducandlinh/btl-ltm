/**
 * SVG Hand-Gesture Icon rendering for Rock (Fist), Paper (Open Palm), and Scissors (Two-Finger V Hand).
 */

import { PIECE_TYPES, PLAYERS } from '../game/constants.js';

export function getPieceSvg(type, player, size = 32) {
  const isP1 = player === PLAYERS.PLAYER1;
  const strokeColor = isP1 ? '#93c5fd' : '#fda4af';

  let iconContent = '';

  switch (type) {
    case PIECE_TYPES.ROCK:
      // ROCK: Closed Clenched Fist Hand Gesture ✊
      iconContent = `
        <path d="M7 11V7.5a1.5 1.5 0 0 1 3 0V11m0-3.5V5.5a1.5 1.5 0 0 1 3 0V11m0-5.5V6a1.5 1.5 0 0 1 3 0v5m0-3.5a1.5 1.5 0 0 1 3 0v5a5.5 5.5 0 0 1-11 0v-1.5" 
              stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M7 12.5c.8 1 2.2 1.5 3.5 1.5h3" 
              stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
      `;
      break;
    case PIECE_TYPES.PAPER:
      // PAPER: Open Palm Hand Gesture with 5 Extended Fingers 🖐️
      iconContent = `
        <path d="M5.5 11.5V7a1.5 1.5 0 0 1 3 0v4.5m0-5V4.5a1.5 1.5 0 0 1 3 0v7m0-7V3.5a1.5 1.5 0 0 1 3 0v8m0-7.5a1.5 1.5 0 0 1 3 0v6.5a6 6 0 0 1-12 0v-4" 
              stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M5.5 11.5a2.5 2.5 0 0 0 2.5 2.5h2" 
              stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
      `;
      break;
    case PIECE_TYPES.SCISSORS:
      // SCISSORS: Two-Finger Extended V Scissors Hand Gesture ✌️
      iconContent = `
        <path d="M9 3.5l2.5 7.5m3.5-7.5l-2.5 7.5" 
              stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M7.5 12.5a3.5 3.5 0 0 0 3.5 3.5h2a3.5 3.5 0 0 0 3.5-3.5v-1.5a2 2 0 0 0-2-2h-6a1.5 1.5 0 0 0-1 2.5z" 
              stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      `;
      break;
    default:
      iconContent = '';
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" class="inline-block transition-transform duration-150">
      ${iconContent}
    </svg>
  `;
}

export function getPieceName(type) {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}
