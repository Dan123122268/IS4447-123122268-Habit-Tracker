import { hashPassword, isValidPassword, isValidUsername } from '../utils/auth';

describe('auth helpers', () => {
  it('hashes the same local credentials consistently', () => {
    expect(hashPassword('demo', 'password')).toBe(hashPassword('demo', 'password'));
    expect(hashPassword('demo', 'password')).not.toBe(hashPassword('demo', 'different'));
  });

  it('validates username and password lengths', () => {
    expect(isValidUsername('ab')).toBe(false);
    expect(isValidUsername('alex')).toBe(true);
    expect(isValidPassword('short')).toBe(false);
    expect(isValidPassword('longer')).toBe(true);
  });
});
