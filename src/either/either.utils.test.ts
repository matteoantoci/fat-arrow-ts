import { partition, tryCatch } from './either.utils'
import { right } from './either'
import { just, nothing } from '../maybe/maybe'
import { Maybe } from '../types'

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
						(it) => ({ data: it.message })
					)
				).toBeLeft({ data: 'some error' })
			})
		})
	})

	describe('partition', () => {
		const eithers: Maybe<number>[] = [nothing(), just(4), nothing(), nothing(), right(6)]

		it('partitions an either array', () => {
			const [lefts, rights] = partition(eithers)

			expect(lefts[0]).toBeNothing()
			expect(lefts[1]).toBeNothing()
			expect(lefts[2]).toBeNothing()

			expect(rights[0]).toBeRight(4)
			expect(rights[1]).toBeRight(6)
		})
	})
})
