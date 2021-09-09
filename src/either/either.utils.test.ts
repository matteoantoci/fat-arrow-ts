import { partition, tryCatch } from './either.utils'
import { left, right } from './either'
import { nothing } from '../maybe/maybe'

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

	describe('partition', () => {
		const eithers = [left(1), right(4), left(5), nothing(), right(6)]

		it('partitions an either array', () => {
			const [lefts, rights] = partition(eithers)

			expect(lefts[0]).toBeLeft(1)
			expect(lefts[1]).toBeLeft(5)
			expect(lefts[2]).toBeNothing()

			expect(rights[0]).toBeRight(4)
			expect(rights[1]).toBeRight(6)
		})
	})
})
