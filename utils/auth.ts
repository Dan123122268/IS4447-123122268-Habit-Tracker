export function hashPassword(username: string, password: string) {
  const input = `${username.trim().toLowerCase()}:${password}`;
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `local-${(hash >>> 0).toString(16)}`;
}

export function isValidUsername(username: string) {
  return username.trim().length >= 3;
}

export function isValidPassword(password: string) {
  return password.length >= 6;
}
