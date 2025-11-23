import { add } from '../../utils/math.js';

describe('math util', () => {
  test('add sums two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
