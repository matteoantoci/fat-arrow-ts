import { maybeFirst, maybeLast, constant, repeat } from './lambda'

describe('Lambda', () => {
	describe('constant', () => {
		it('runs function only once', () => {
			const fn = jest.fn().mockReturnValue('value')
			const wrapped = constant(fn)

			wrapped()
			wrapped()
			wrapped()

			expect(fn).toHaveBeenCalledTimes(1)
		})
	})

	describe('repeat', () => {
		it('runs a function n times', () => {
			const fn = jest.fn().mockReturnValue('value')
			const times = 5

			const result = repeat(times, fn)

			expect(fn).toHaveBeenCalledTimes(times)
			expect(fn).toHaveBeenLastCalledWith(times - 1)
			expect(result.length).toBe(times)
		})
	})

	describe('maybeFirst', () => {
		describe('when array is empty', () => {
			const array: number[] = []

			it('returns nothing', () => {
				const actual = maybeFirst(array)

				expect(actual).toBeNothing()
			})
		})

		describe('when array is not empty', () => {
			const array: number[] = [1, 2, 3]

			it('returns right', () => {
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

				expect(actual).toBeNothing()
			})
		})

		describe('when array is not empty', () => {
			const array: number[] = [1, 2, 3]

			it('returns right', () => {
				const actual = maybeLast(array)

				expect(actual).toBeRight(3)
			})
		})
	})
})
