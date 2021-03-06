import Board from '../src/game/Board';
import {Events} from '../src/game/Event';
import Player from '../src/game/Player';
import Roulette from '../src/game/Roulette';
import {EventCode, PieceType} from '../src/game/types';

describe('Event', () => {
  test('TRIGGERED_ROULETTE & ACKNOWLEDGED_ROULETTE', async () => {
    const players = [
      new Player('Player 1', 0),
      new Player('Player 2', 1),
      new Player('Player 3', 2),
      new Player('Player 4', 3),
    ];
    const board = new Board(10, 10);
    const oldTriggeredAt = Date.now();
    const ctx = {
      playerId: 0,
      triggeredAt: oldTriggeredAt,
      players,
      board,
      arrows: board.arrows,
    };
    const event = Events.get(EventCode.TRIGGERED_ROULETTE);
    const ackEvent = Events.get(EventCode.ACKNOWLEDGED_ROULETTE);
    expect(event).toBeDefined();
    event?.action(ctx);
    expect(players[0].roulette.lastTriggered).toBeCloseTo(oldTriggeredAt);

    // call roulete before completing delay
    ctx.triggeredAt += Roulette.rouletteDelay / 2;
    event?.action(ctx);
    expect(players[0].roulette.lastTriggered).toBeCloseTo(oldTriggeredAt);

    ctx.triggeredAt += Roulette.rouletteDelay;
    ackEvent?.action(ctx);
    event?.action(ctx);
    expect(players[0].roulette.lastTriggered)
      .toBeCloseTo(oldTriggeredAt + (3 * Roulette.rouletteDelay) / 2);
  });

  test('CHANGED_ACTIVE_PIECE', () => {
    const players = [
      new Player('Player 1', 0),
      new Player('Player 2', 1),
      new Player('Player 3', 2),
      new Player('Player 4', 3),
    ];
    const board = new Board(10, 10);
    const ctx = {
      playerId: 0,
      newActivePiece: PieceType.ROOK,
      players,
      board,
      arrows: board.arrows,
    };
    players[0].hand[PieceType.ROOK].quantity = 1;
    const event = Events.get(EventCode.CHANGED_ACTIVE_PIECE);
    expect(event).toBeDefined();
    event?.action(ctx);
    expect(players[0].activePiece.type).toBe(PieceType.ROOK);
  });

  test('RELEASED_PIECE', () => {
    const players = [
      new Player('Player 1', 0),
      new Player('Player 2', 1),
      new Player('Player 3', 2),
      new Player('Player 4', 3),
    ];
    const board = new Board(10, 10);
    const ctx = {
      playerId: 0,
      pieceType: PieceType.QUEEN,
      players,
      board,
      arrows: board.arrows,
    };
    players[0].hand[PieceType.QUEEN].quantity = 10;
    const event = Events.get(EventCode.RELEASED_PIECE);
    expect(event).toBeDefined();
    event?.action(ctx);
    expect(board.ballsToRelease[0].length).toBeGreaterThan(0);
    expect(board.ballsToRelease[0][0].quantity).toBeGreaterThan(0);
  });

  test('Missing values', () => {
    const players = [
      new Player('Player 1', 0),
      new Player('Player 2', 1),
      new Player('Player 3', 2),
      new Player('Player 4', 3),
    ];
    const board = new Board(10, 10);
    const ctx = {
      playerId: 0,
      players,
      board,
      arrows: board.arrows,
    };
    let event = Events.get(EventCode.TRIGGERED_ROULETTE);
    expect(event).toBeDefined();
    expect(() => event?.action(ctx)).toThrowError('triggeredAt');

    event = Events.get(EventCode.CHANGED_ACTIVE_PIECE);
    expect(event).toBeDefined();
    expect(() => event?.action(ctx)).toThrowError('newActivePiece');

    event = Events.get(EventCode.RELEASED_PIECE);
    expect(event).toBeDefined();
    expect(() => event?.action(ctx)).toThrowError('pieceType');
  });
});
