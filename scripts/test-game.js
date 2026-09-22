import { createInitialState, executeMove, applyRematchVote } from '../src/game/state.js';
import { validateMove } from '../src/game/rules.js';
import { isInsideBoard, isValidMovement } from '../src/game/movement.js';
import { canCapture } from '../src/game/capture.js';
import { checkWin, checkTypeEliminationWin, checkGoalWin } from '../src/game/winCondition.js';
import { PLAYERS, PIECE_TYPES, MODES, INITIAL_SETUP } from '../src/game/constants.js';

console.log('==================================================');
console.log('   OTTv2 FULL GAME ENGINE VERIFICATION TESTS');
console.log('==================================================');

let testsPassed = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  }
  testsPassed++;
  console.log(`✔ ${message}`);
}

// --------------------------------------------------
// 1. FINAL INITIAL SETUP VERIFICATION
// --------------------------------------------------
const initPieces = INITIAL_SETUP.pieces;
assert(initPieces.length === 18, 'Initial setup contains total 18 pieces');

const p1Pieces = initPieces.filter((p) => p.player === PLAYERS.PLAYER1);
const p2Pieces = initPieces.filter((p) => p.player === PLAYERS.PLAYER2);

assert(p1Pieces.length === 9, 'Player 1 has exactly 9 pieces');
assert(p2Pieces.length === 9, 'Player 2 has exactly 9 pieces');

// Check cell overlap
const occupiedCells = new Set();
for (const p of initPieces) {
  const coordKey = `${p.row},${p.col}`;
  assert(!occupiedCells.has(coordKey), `Piece at ${coordKey} has a unique cell (no overlaps)`);
  occupiedCells.add(coordKey);
}

// Check unique IDs
const pieceIds = new Set();
for (const p of initPieces) {
  assert(!pieceIds.has(p.id), `Piece ID '${p.id}' is unique`);
  pieceIds.add(p.id);
}

// Check starting row positions
for (const p of p1Pieces) {
  assert(p.row === 8, `Player 1 piece ${p.id} occupies row 8 (rank 9)`);
}
for (const p of p2Pieces) {
  assert(p.row === 0, `Player 2 piece ${p.id} occupies row 0 (rank 1)`);
}

// Check exact type ordering: Rock, Paper, Scissors across cols 0..8
const expectedOrder = [
  PIECE_TYPES.ROCK, PIECE_TYPES.PAPER, PIECE_TYPES.SCISSORS,
  PIECE_TYPES.ROCK, PIECE_TYPES.PAPER, PIECE_TYPES.SCISSORS,
  PIECE_TYPES.ROCK, PIECE_TYPES.PAPER, PIECE_TYPES.SCISSORS,
];

for (let col = 0; col < 9; col++) {
  const p1Piece = p1Pieces.find((p) => p.col === col);
  const p2Piece = p2Pieces.find((p) => p.col === col);

  assert(p1Piece && p1Piece.type === expectedOrder[col], `P1 col ${col} matches expected type '${expectedOrder[col]}'`);
  assert(p2Piece && p2Piece.type === expectedOrder[col], `P2 col ${col} matches expected type '${expectedOrder[col]}'`);
}

// --------------------------------------------------
// 2. MOVEMENT & BOUNDARY TESTS
// --------------------------------------------------
assert(isInsideBoard(0, 0) === true, 'Cell a1 (0,0) is inside board');
assert(isInsideBoard(8, 8) === true, 'Cell i9 (8,8) is inside board');
assert(isInsideBoard(-1, 0) === false, 'Cell (-1,0) is out of bounds');
assert(isInsideBoard(0, 9) === false, 'Cell (0,9) is out of bounds');

const center = { row: 4, col: 4 };
const directions = [
  { row: 3, col: 3, name: 'NW ↖' },
  { row: 3, col: 4, name: 'N  ↑' },
  { row: 3, col: 5, name: 'NE ↗' },
  { row: 4, col: 3, name: 'W  ←' },
  { row: 4, col: 5, name: 'E  →' },
  { row: 5, col: 3, name: 'SW ↙' },
  { row: 5, col: 4, name: 'S  ↓' },
  { row: 5, col: 5, name: 'SE ↘' },
];
for (const dir of directions) {
  assert(isValidMovement(center, { row: dir.row, col: dir.col }) === true, `Movement ${dir.name} is valid`);
}

assert(isValidMovement(center, center) === false, 'Staying still (zero distance) is rejected');
assert(isValidMovement(center, { row: 2, col: 4 }) === false, 'Moving 2 squares north is rejected');
assert(isValidMovement(center, { row: 4, col: 6 }) === false, 'Moving 2 squares east is rejected');

// --------------------------------------------------
// 3. BLOCKING & COMBAT TESTS
// --------------------------------------------------
const testState = createInitialState(MODES.LOCAL);
testState.status = 'playing';
// Player 1 piece at (8,0) trying to move to friendly cell at (8,1)
const p1Piece1 = testState.pieces.find((p) => p.player === PLAYERS.PLAYER1 && p.row === 8 && p.col === 0);
const friendlyRes = validateMove(testState, PLAYERS.PLAYER1, p1Piece1.id, 8, 1);
assert(friendlyRes.valid === false && friendlyRes.error.includes('blocked'), 'Friendly occupied destination cell is blocked');

// Same-type enemy blocking (Rock vs Rock)
const stateSameType = createInitialState(MODES.LOCAL);
stateSameType.status = 'playing';
stateSameType.pieces = [
  { id: 'p1-rock-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.ROCK, row: 4, col: 4 },
  { id: 'p2-rock-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.ROCK, row: 4, col: 5 },
];
const sameTypeRes = validateMove(stateSameType, PLAYERS.PLAYER1, 'p1-rock-1', 4, 5);
assert(sameTypeRes.valid === false && sameTypeRes.error.includes('Same-type'), 'Same-type enemy piece (Rock vs Rock) is blocked');

// RPS Matrix
assert(canCapture(PIECE_TYPES.ROCK, PIECE_TYPES.SCISSORS) === true, 'Rock captures Scissors');
assert(canCapture(PIECE_TYPES.SCISSORS, PIECE_TYPES.PAPER) === true, 'Scissors captures Paper');
assert(canCapture(PIECE_TYPES.PAPER, PIECE_TYPES.ROCK) === true, 'Paper captures Rock');
assert(canCapture(PIECE_TYPES.ROCK, PIECE_TYPES.PAPER) === false, 'Rock attacking Paper is invalid capture');

// Turn enforcement
const turnState = createInitialState(MODES.LOCAL);
turnState.status = 'playing';
turnState.turn = PLAYERS.PLAYER1;
const p2Piece = turnState.pieces.find((p) => p.player === PLAYERS.PLAYER2);
const wrongTurnRes = executeMove(turnState, PLAYERS.PLAYER2, p2Piece.id, p2Piece.row + 1, p2Piece.col);
assert(wrongTurnRes.ok === false, 'Player 2 cannot move when it is Player 1 turn');

// --------------------------------------------------
// 4. WIN CONDITION TESTS
// --------------------------------------------------
// Player 1 goal a1 (0,0)
const p1GoalPiece = { id: 'p1-rock-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.ROCK, row: 0, col: 0 };
assert(checkGoalWin(p1GoalPiece) === PLAYERS.PLAYER1, 'P1 piece at a1 (0,0) triggers P1 victory');

// Player 2 goal i9 (8,8)
const p2GoalPiece = { id: 'p2-paper-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.PAPER, row: 8, col: 8 };
assert(checkGoalWin(p2GoalPiece) === PLAYERS.PLAYER2, 'P2 piece at i9 (8,8) triggers P2 victory');

// Type elimination win
const initialCounts = {
  [PLAYERS.PLAYER1]: { rock: 3, paper: 3, scissors: 3 },
  [PLAYERS.PLAYER2]: { rock: 3, paper: 3, scissors: 3 },
};
const p2NoScissorsPieces = [
  { id: 'p1-rock-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.ROCK, row: 8, col: 0 },
  { id: 'p1-paper-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.PAPER, row: 8, col: 1 },
  { id: 'p1-scissors-1', player: PLAYERS.PLAYER1, type: PIECE_TYPES.SCISSORS, row: 8, col: 2 },
  { id: 'p2-rock-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.ROCK, row: 0, col: 0 },
  { id: 'p2-paper-1', player: PLAYERS.PLAYER2, type: PIECE_TYPES.PAPER, row: 0, col: 1 },
];
const elimWinner = checkTypeEliminationWin(p2NoScissorsPieces, initialCounts);
assert(elimWinner === PLAYERS.PLAYER1, 'P1 wins when P2 has all Scissors eliminated');

// Zero-initial-count edge case
const initialCountsWithZero = {
  [PLAYERS.PLAYER1]: { rock: 3, paper: 3, scissors: 3 },
  [PLAYERS.PLAYER2]: { rock: 3, paper: 3, scissors: 0 },
};
const zeroCountWinner = checkTypeEliminationWin(p2NoScissorsPieces, initialCountsWithZero);
assert(zeroCountWinner === null, 'Starting with 0 scissors does NOT count as eliminated');

// Finished game rejection
const finishedState = createInitialState(MODES.LOCAL);
finishedState.status = 'finished';
finishedState.winner = PLAYERS.PLAYER1;
const finishedRes = executeMove(finishedState, PLAYERS.PLAYER1, 'p1-rock-1', 7, 0);
assert(finishedRes.ok === false, 'Finished game rejects subsequent move attempts');

// Rematch voting
const onlineFinishState = createInitialState(MODES.ONLINE, 'ROOM_XYZ');
onlineFinishState.status = 'finished';
onlineFinishState.winner = PLAYERS.PLAYER1;
const stateP1Voted = applyRematchVote(onlineFinishState, PLAYERS.PLAYER1);
assert(stateP1Voted.rematchVotes.player1 === true && stateP1Voted.status === 'finished', 'P1 rematch vote recorded');
const stateBothVoted = applyRematchVote(stateP1Voted, PLAYERS.PLAYER2);
assert(stateBothVoted.status === 'playing', 'Match resets to playing when both players agree to rematch');

console.log('==================================================');
console.log(` SUCCESS: All ${testsPassed} unit test cases passed!`);
console.log('==================================================');
