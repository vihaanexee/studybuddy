import * as argon2 from 'argon2';
import { badRequest } from '../utils/errors.js';

const PASSWORD_MIN_LENGTH = 10;
const HAS_LETTER = /[a-zA-Z]/;
const HAS_NUMBER = /[0-9]/;

export function validatePasswordPolicy(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw badRequest(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  if (!HAS_LETTER.test(password)) {
    throw badRequest('Password must contain at least 1 letter');
  }
  if (!HAS_NUMBER.test(password)) {
    throw badRequest('Password must contain at least 1 number');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}
