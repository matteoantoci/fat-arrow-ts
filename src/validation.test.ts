import { fail, pass, validate, Validation } from './validation'

describe('Validation', () => {
	describe('validate', () => {
		const isPasswordLongEnough = (password: string): Validation<string, string> =>
			password.length > 6 ? pass(password) : fail('Password must have more than 6 characters.')

		const isPasswordStrongEnough = (password: string): Validation<string, string> =>
			/[\W]/.test(password) ? pass(password) : fail('Password must contain a special character.')

		const validations = [isPasswordLongEnough, isPasswordStrongEnough]

		describe('when no errors occurred', () => {
			it('validates', () => {
				expect(validate('qwertyu!', validations)).toBeRight('qwertyu!')
			})
		})

		describe('when one error occurred', () => {
			it('validates', () => {
				expect(validate('qwertyu', validations)).toBeLeft(['Password must contain a special character.'])
			})
		})

		describe('when multiple errors occurred', () => {
			it('validates', () => {
				expect(validate('qwerty', validations)).toBeLeft([
					'Password must have more than 6 characters.',
					'Password must contain a special character.',
				])
			})
		})
	})

	describe('pass', () => {
		it('is right', () => {
			expect(pass(5)).toBeRight(5)
		})
	})

	describe('fail', () => {
		describe('when output is plain', () => {
			it('wraps', () => {
				expect(fail('error')).toBeLeft(['error'])
			})
		})

		it('is left', () => {
			expect(fail(['foo', 'bar'])).toBeLeft(['foo', 'bar'])
		})
	})
})
