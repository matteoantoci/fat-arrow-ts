import { failure, success, validate, Validation } from './validation'

describe('validation', () => {
	const isPasswordLongEnough = (password: string): Validation<string, string> =>
		password.length > 6 ? success(password) : failure('Password must have more than 6 characters.')

	const isPasswordStrongEnough = (password: string): Validation<string, string> =>
		/[\W]/.test(password) ? success(password) : failure('Password must contain a special character.')

	const validations = [isPasswordLongEnough, isPasswordStrongEnough]

	it('works', () => {
		expect(validate('qwerty', validations)).toBeLeft([
			'Password must have more than 6 characters.',
			'Password must contain a special character.',
		])

		expect(validate('qwertyu', validations)).toBeLeft(['Password must contain a special character.'])

		expect(validate('qwertyu!', validations)).toBeRight('qwertyu!')
	})
})
