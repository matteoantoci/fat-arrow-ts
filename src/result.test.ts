import { error, ok, tryCatch } from './result'

describe('result', () => {
	describe('tryCatch', () => {
		describe('when callback runs', () => {
			it('runs safely', () => {
				expect(tryCatch(() => 5)).toBeRight(5)
			})
		})

		describe('when callback throws', () => {
			it('runs safely', () => {
				expect(
					tryCatch(() => {
						throw new Error()
					})
				).toBeLeft(new Error())
			})
		})
	})

	describe('ok', () => {
		it('is right', () => {
			expect(ok(5)).toBeRight(5)
		})
	})

	describe('error', () => {
		it('is left', () => {
			expect(error('Ouch!')).toBeLeft(new Error('Ouch!'))
		})
	})
})
