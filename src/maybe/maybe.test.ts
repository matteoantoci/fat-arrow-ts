import { just, maybe, maybeFirst, maybeLast, nothing } from './maybe'
import { noop } from '../lambda/lambda'

describe('Maybe', () => {
	describe('just', () => {
		const adt = just(5)

		it('is right', () => {
			expect(adt).toBeRight(5)
		})
	})

	describe('nothing', () => {
		const adt = nothing()

		it('is left', () => {
			expect(adt).toBeLeft(undefined)
		})

		it('is nothing', () => {
			expect(adt).toBeNothing()
		})
	})

	describe('maybe', () => {
		it('handles values', () => {
			expect(maybe(5)).toBeRight(5)
			expect(maybe('')).toBeRight('')
			expect(maybe(false)).toBeRight(false)
		})

		it('handles nullables', () => {
			expect(maybe(null)).toBeNothing()
			expect(maybe(undefined)).toBeNothing()
			expect(maybe(noop())).toBeNothing()
		})
	})

	describe('maybeFirst', () => {
		describe('when array is empty', () => {
			const array: number[] = []

			it('returns nothing', () => {
				const actual = maybeFirst(array)

				expect(actual).toBeLeft(undefined)
			})
		})

		describe('when array is not empty', () => {
			const array: number[] = [1, 2, 3]

			it('returns nothing', () => {
				const actual = maybeFirst(array)

				expect(actual).toBeRight(1)
			})
		})
	})

	describe('maybeLast', () => {
		describe('when array is empty', () => {
			const array: number[] = []

			it('returns nothing', () => {
				const actual = maybeLast(array)

				expect(actual).toBeLeft(undefined)
			})
		})

		describe('when array is not empty', () => {
			const array: number[] = [1, 2, 3]

			it('returns nothing', () => {
				const actual = maybeLast(array)

				expect(actual).toBeRight(3)
			})
		})
	})
})
