/// <reference types="@types/jest" />
import { loginSchema, registerSchema } from '../../../schemas/auth';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate a correct login payload', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject short password (less than 6 chars)', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
        expect(result.error.issues[0].message).toContain('6 caracteres');
      }
    });

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const invalidData = {};
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('should validate a correct registration payload', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short name (less than 2 chars)', () => {
      const invalidData = {
        name: 'J',
        email: 'juan@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123',
        confirmPassword: 'different456',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('confirmPassword');
        expect(result.error.issues[0].message).toContain('no coinciden');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'not-an-email',
        password: 'password123',
        confirmPassword: 'password123',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('should reject short passwords in registration', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: '123',
        confirmPassword: '123',
      };
      
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
