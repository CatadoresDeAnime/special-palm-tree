import Matrix from '../src/models/Matrix';
import Vector2 from '../src/models/Vector2';

describe('Matrix', () => {
  test('playerId', () => {
    const matrix = new Matrix(10, 10);
    expect(matrix.getPlayerId(0, 0)).toBe(0);
    expect(matrix.getPlayerId(4, 4)).toBe(0);

    expect(matrix.getPlayerId(0, 5)).toBe(1);
    expect(matrix.getPlayerId(2, 9)).toBe(1);

    expect(matrix.getPlayerId(9, 4)).toBe(2);
    expect(matrix.getPlayerId(8, 3)).toBe(2);

    expect(matrix.getPlayerId(9, 9)).toBe(3);
    expect(matrix.getPlayerId(5, 5)).toBe(3);
  });

  test('getPlayerCoords', () => {
    const matrix = new Matrix(10, 10);
    expect(matrix.getPlayerCoords(0)).toBeVector2(new Vector2(2.5, 2.5));
    expect(matrix.getPlayerCoords(1)).toBeVector2(new Vector2(7.5, 2.5));
    expect(matrix.getPlayerCoords(2)).toBeVector2(new Vector2(2.5, 7.5));
    expect(matrix.getPlayerCoords(3)).toBeVector2(new Vector2(7.5, 7.5));
  });
});
