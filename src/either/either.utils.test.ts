import { tryCatch } from './either.utils'

describe('Either utils', () => {
	describe('tryCatch', () => {
		describe('when callback runs successfully', () => {
			it('runs safely', () => {
				expect(
					tryCatch(
						() => 5,
						() => Error('some error')
					)
				).toBeRight(5)
			})
		})

		describe('when callback throws', () => {
			it('runs safely', () => {
				expect(
					tryCatch(
						() => {
							throw new Error('some error')
						},
						(it) => it
					)
				).toBeLeft(new Error('some error'))
			})
		})
	})
})
