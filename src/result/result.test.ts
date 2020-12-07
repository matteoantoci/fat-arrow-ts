import { tryCatch } from './result'

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
})
