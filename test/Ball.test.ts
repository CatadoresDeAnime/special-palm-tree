import Ball from '../src/game/Ball';
import KillReporter from '../src/game/KillReporter';
import Matrix from '../src/game/Matrix';
import {PieceType} from '../src/game/types';
import Vector2 from '../src/game/Vector2';

describe('Ball', () => {
  test('move', () => {
    let ball = new Ball(PieceType.KING, new Vector2(5, 5), 1, new Vector2(0, 1));
    ball.move(1);
    expect(ball.position).toEqual(new Vector2(5, 6));
    expect(ball.direction).toEqual(new Vector2(0, 1));
    expect(ball.speed).toEqual(1);

    ball = new Ball(PieceType.KING, new Vector2(0, 0), 1, new Vector2(0.5, -0.5));
    ball.move(5.5);
    expect(ball.position.length()).toBeCloseTo(5.5);
    expect(ball.position.x).toBeCloseTo(3.88908);
    expect(ball.position.y).toBeCloseTo(-3.88908);
  });

  test('checkCollision', () => {
    let ball = new Ball(PieceType.QUEEN, new Vector2(3.5, 9.9999), 1, new Vector2(1, 1));
    const matrix = new Matrix(10, 10);
    const killReporters = [
      new KillReporter(),
      new KillReporter(),
      new KillReporter(),
      new KillReporter(),
    ];
    // QUEEN, KNIGHT and PAWN
    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(true);

    expect(ball.checkCollision({playerId: 2, matrix, killReporters})).toBe(false);

    matrix.get(9, 3).health = 0;
    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(false);

    ball.position = new Vector2(-7, -12);
    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(false);

    // BISHOP
    ball = new Ball(PieceType.BISHOP, new Vector2(3.5, 9.9999), 1, new Vector2(1, 1));

    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(false);

    matrix.get(9, 3).health = 0;
    expect(ball.checkCollision({playerId: 2, matrix, killReporters})).toBe(true);

    matrix.get(9, 3).health = 100;
    expect(ball.checkCollision({playerId: 2, matrix, killReporters})).toBe(false);

    ball.position = new Vector2(0, 11);
    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(false);

    // BISHOP
    ball = new Ball(PieceType.ROOK, new Vector2(3.5, 9.9999), 1, new Vector2(1, 1));

    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(false);

    matrix.get(9, 3).defense = 0;
    expect(ball.checkCollision({playerId: 2, matrix, killReporters})).toBe(true);

    matrix.get(9, 3).defense = 100;
    expect(ball.checkCollision({playerId: 2, matrix, killReporters})).toBe(false);

    ball.position = new Vector2(11, -4);
    expect(ball.checkCollision({playerId: 1, matrix, killReporters})).toBe(false);
  });
});
