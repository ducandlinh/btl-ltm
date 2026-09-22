/**
 * Coordinate utility functions for 9x9 board.
 * Columns: 'a' (0) to 'i' (8)
 * Rows: '1' (0) to '9' (8)
 * Example: row 0, col 0 -> 'a1'
 * Example: row 8, col 8 -> 'i9'
 */

export const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
export const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toChessNotation(row, col) {
  if (row < 0 || row > 8 || col < 0 || col > 8) return null;
  return `${COLUMNS[col]}${ROWS[row]}`;
}

export function fromChessNotation(notation) {
  if (!notation || typeof notation !== 'string' || notation.length !== 2) return null;
  const colStr = notation[0].toLowerCase();
  const rowStr = notation[1];
  
  const col = COLUMNS.indexOf(colStr);
  const row = ROWS.indexOf(rowStr);
  
  if (col === -1 || row === -1) return null;
  return { row, col };
}

export function isValidCoord(row, col) {
  return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < 9 && col >= 0 && col < 9;
}
