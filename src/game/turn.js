/**
 * Turn switching helper.
 */

import { PLAYERS } from './constants.js';

export function switchTurn(currentTurn) {
  return currentTurn === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
}
