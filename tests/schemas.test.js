"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schemas_1 = require("../src/core/validation/schemas");
describe('Validation Schemas', () => {
    describe('EmailSchema', () => {
        it('should validate correct email', () => {
            const result = schemas_1.EmailSchema.safeParse('test@example.com');
            expect(result.success).toBe(true);
        });
        it('should reject invalid email', () => {
            const result = schemas_1.EmailSchema.safeParse('invalid-email');
            expect(result.success).toBe(false);
        });
        it('should reject empty email', () => {
            const result = schemas_1.EmailSchema.safeParse('');
            expect(result.success).toBe(false);
        });
    });
    describe('PasswordSchema', () => {
        it('should validate strong password', () => {
            const result = schemas_1.PasswordSchema.safeParse('Test1234');
            expect(result.success).toBe(true);
        });
        it('should reject short password', () => {
            const result = schemas_1.PasswordSchema.safeParse('Test1');
            expect(result.success).toBe(false);
        });
        it('should reject password without uppercase', () => {
            const result = schemas_1.PasswordSchema.safeParse('test1234');
            expect(result.success).toBe(false);
        });
        it('should reject password without lowercase', () => {
            const result = schemas_1.PasswordSchema.safeParse('TEST1234');
            expect(result.success).toBe(false);
        });
        it('should reject password without numbers', () => {
            const result = schemas_1.PasswordSchema.safeParse('TestPass');
            expect(result.success).toBe(false);
        });
    });
    describe('GenderSchema', () => {
        it('should validate M', () => {
            const result = schemas_1.GenderSchema.safeParse('M');
            expect(result.success).toBe(true);
        });
        it('should validate F', () => {
            const result = schemas_1.GenderSchema.safeParse('F');
            expect(result.success).toBe(true);
        });
        it('should reject other values', () => {
            const result = schemas_1.GenderSchema.safeParse('X');
            expect(result.success).toBe(false);
        });
    });
    describe('RegisterUserDto', () => {
        it('should validate correct data', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Test1234',
                gender: 'M'
            };
            const result = schemas_1.RegisterUserDto.safeParse(data);
            expect(result.success).toBe(true);
        });
        it('should reject short name', () => {
            const data = {
                name: 'J',
                email: 'john@example.com',
                password: 'Test1234',
                gender: 'M'
            };
            const result = schemas_1.RegisterUserDto.safeParse(data);
            expect(result.success).toBe(false);
        });
        it('should reject invalid email', () => {
            const data = {
                name: 'John Doe',
                email: 'invalid',
                password: 'Test1234',
                gender: 'M'
            };
            const result = schemas_1.RegisterUserDto.safeParse(data);
            expect(result.success).toBe(false);
        });
        it('should reject weak password', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'weak',
                gender: 'M'
            };
            const result = schemas_1.RegisterUserDto.safeParse(data);
            expect(result.success).toBe(false);
        });
        it('should reject invalid gender', () => {
            const data = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'Test1234',
                gender: 'X'
            };
            const result = schemas_1.RegisterUserDto.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
    describe('LoginUserDto', () => {
        it('should validate correct data', () => {
            const data = {
                email: 'john@example.com',
                password: 'Test1234'
            };
            const result = schemas_1.LoginUserDto.safeParse(data);
            expect(result.success).toBe(true);
        });
        it('should reject empty email', () => {
            const data = {
                email: '',
                password: 'Test1234'
            };
            const result = schemas_1.LoginUserDto.safeParse(data);
            expect(result.success).toBe(false);
        });
        it('should reject empty password', () => {
            const data = {
                email: 'john@example.com',
                password: ''
            };
            const result = schemas_1.LoginUserDto.safeParse(data);
            expect(result.success).toBe(false);
        });
    });
});
