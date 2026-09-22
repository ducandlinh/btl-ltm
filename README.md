# OTTv2 (Strategic Rock-Paper-Scissors)

## Overview
**OTTv2** is a strategic 9×9 turn-based board game combining classic Rock-Paper-Scissors hand-gesture combat with tactical spatial positioning. Players maneuver Rock (Closed Fist), Paper (Open Palm), and Scissors (Two-Finger Hand) units across the board to capture enemy pieces or reach the opponent's target goal cell.

OTTv2 supports **BOTH**:
- **Local 2-Player Hot-Seat Mode**: Two players play on a single shared device without needing an internet connection.
- **Online PlayHTML Matchmaking**: Automated 2-player random matchmaking powered by PlayHTML, pairing online players into isolated rooms automatically.

---

## Features
- **9×9 Tactical Grid**: Coordinates `a1` through `i9` (`a1` = row 0, col 0; `i9` = row 8, col 8).
- **Official Initial Formation**: Player 1 occupies row 8 (rank 9, `a9..i9`) and Player 2 occupies row 0 (rank 1, `a1..i1`).
- **Authentic Hand-Gesture RPS SVGs**: Closed Fist (Rock), Open Palm (Paper), and Two-Finger Scissors Hand (Scissors).
- **Random Matchmaking Lobby**: Click `[ FIND MATCH ]` to automatically get paired into isolated 2-player rooms.
- **Tactical Audio System (`AudioManager`)**: Reusable Web Audio API sound generator for clicks, selections, moves, captures, turns, player join, victory, defeat, and rematch chimes.
- **HUD Audio Controls**: Local Sound ON/OFF toggle and Volume slider.
- **Dual Play Modes**: Selectable Local Hot-Seat mode and Online Matchmaking mode.
- **Shared Decoupled Engine**: Core game rules, validation, and state transitions are 100% DOM-independent.
- **PlayHTML Integration**: Uses documented PlayHTML APIs (`playhtml.init({ room })`, `await playhtml.ready`, `createPageData()`, `users`, `presence`).
- **Move History Log**: Compact, capped move history tracking piece movements and captures.
- **Rematch & Restart**: Voting system for online rematches, immediate restart for local mode.
- **Responsive Dark Tactical UI**: Modern zinc/slate dark theme built with Vanilla JS ES Modules and Tailwind CSS.

---

## Game Rules & Initial Setup

### Official Initial Setup (Final)
Each player starts with **9 pieces** occupying one entire row at their home end of the board:

- **Player 1 (Indigo)**: Occupies rank 9 (row 8 in 0-indexed coords) from `a9` to `i9`.
- **Player 2 (Rose)**: Occupies rank 1 (row 0 in 0-indexed coords) from `a1` to `i1`.

**Piece Type Distribution**:
```text
Player 2 starting row (row 0 / rank 1):
a1: Rock | b1: Paper | c1: Scissors | d1: Rock | e1: Paper | f1: Scissors | g1: Rock | h1: Paper | i1: Scissors

Player 1 starting row (row 8 / rank 9):
a9: Rock | b9: Paper | c9: Scissors | d9: Rock | e9: Paper | f9: Scissors | g9: Rock | h9: Paper | i9: Scissors
```

### Visual Representation (Hand Gestures)
The piece icons represent actual real-world Rock-Paper-Scissors hand gestures:
- ✊ **Rock**: Closed clenched fist hand SVG
- 🖐️ **Paper**: Open palm hand SVG with 5 extended fingers *(not a sheet of paper)*
- ✌️ **Scissors**: Two-finger V-formation scissors hand SVG *(not a tool)*

---

## PlayHTML Random Matchmaking Architecture

```text
                  PLAYHTML MATCHMAKING LOBBY
                (room: ottv2-matchmaking-lobby)
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
 Player A & B            Player C & D            Player E & F
     │                       │                       │
     ▼                       ▼                       ▼
  Match #1                Match #2                Match #3
(Room: OTT-A1B2)        (Room: OTT-C3D4)        (Room: OTT-E5F6)
 [P1 & P2 Only]          [P1 & P2 Only]          [P1 & P2 Only]
```

### Matchmaking Flow
1. **Lobby Entry**:
   - Clicking `Online Multiplayer` opens the matchmaking menu showing live online player counts (`Players Online: X`).
2. **Find Match**:
   - Player clicks `FIND MATCH`.
   - The matchmaker checks the waiting queue in `ottv2-matchmaking-lobby`.
   - If another player is waiting, the system pairs them into an isolated unique game room (e.g. `ottv2-OTT-A1B2`).
   - One becomes **Player 1**, the other becomes **Player 2**.
   - Both users display `MATCH FOUND! Opponent connected. Starting game...` and auto-transition to the board.
3. **Room Isolation**:
   - Match #1 (A & B) and Match #2 (C & D) are completely separate rooms. Actions in Match 1 cannot affect or leak into Match 2.
   - Max 2 active players per game room.

---

## Sound System (`AudioManager`)

OTTv2 features a reusable audio manager (`src/audio/audioManager.js`) built with the Web Audio API:

- **Sound Events**: `click`, `select`, `move`, `capture`, `invalid`, `turn`, `playerJoined`, `victory`, `defeat`, `rematch`.
- **Autoplay Compliance**: AudioContext unlocks on the first user interaction.
- **HUD Settings**: Local Mute ON/OFF button and Volume slider.
- **Deduplication**: Prevents duplicate sound triggers across UI handlers and state observer updates.

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Run local Vite development server
npm run dev

# Run automated test suite
npm test

# Build production bundle
npm run build
```

---

## Testing

Run the automated engine test suite:
```bash
npm test
```

### Tested Matchmaking Scenarios
1. **Multi-Session Isolation Test**:
   - Sessions A & B click `FIND MATCH` → Paired into Match 1 (`Room 1`).
   - Sessions C & D click `FIND MATCH` → Paired into Match 2 (`Room 2`).
   - Verified Match 1 moves do NOT leak into Match 2.
2. **Simultaneous Join Safety**:
   - Multiple sessions clicking `FIND MATCH` simultaneously are cleanly paired without duplicate slot assignments.
3. **Leave & Rematch**:
   - Rematch restarts the active match room when both accept.
   - Leaving match returns remaining player to matchmaking lobby.
