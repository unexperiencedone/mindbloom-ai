// src/lib/password-utils.ts
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

// Note: In a real-world production app, it's highly recommended to use a battle-tested
// library like 'bcrypt' or 'argon2' which are more robust against a wider range of attacks.
// The native 'crypto' module is used here for simplicity and to avoid adding new dependencies.

const saltLength = 16;
const keyLength = 64;

/**
 * Hashes a password with a random salt.
 * @param password The plain-text password to hash.
 * @returns An object containing the salt and the derived hash.
 */
export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = randomBytes(saltLength).toString('hex');
  const hash = scryptSync(password, salt, keyLength).toString('hex');
  return { salt, hash };
}

/**
 * Verifies a password against a stored salt and hash.
 * @param password The plain-text password to verify.
 * @param salt The salt used when the original password was hashed.
 * @param storedHash The stored hash to compare against.
 * @returns True if the password is correct, false otherwise.
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hashFromInput = scryptSync(password, salt, keyLength);
  const storedHashBuffer = Buffer.from(storedHash, 'hex');

  // Use timingSafeEqual to prevent timing attacks
  return timingSafeEqual(hashFromInput, storedHashBuffer);
}
