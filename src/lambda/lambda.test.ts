import { chunk, maybeFirst, maybeLast, constant, repeat, rotate } from './lambda'

describe('Lambda', () => {
	describe('Once', () => {
		it('runs function only once', () => {
			const fn = jest.fn().mockReturnValue('value')
			const wrapped = constant(fn)

			wrapped()
			wrapped()
			wrapped()

			expect(fn).toHaveBeenCalledTimes(1)
		})
	})

	describe('Repeat', () => {
		it('runs a function n times', () => {
			const fn = jest.fn().mockReturnValue('value')
			const times = 5

			const result = repeat(times, fn)

			expect(fn).toHaveBeenCalledTimes(times)
			expect(fn).toHaveBeenLastCalledWith(times - 1)
			expect(result.length).toBe(times)
		})
	})

	describe('Rotate', () => {
		it('rotates an array', () => {
			const arr = [1, 2, 3]
			const positions = 2

			const result = rotate(positions, arr)

			expect(result).toEqual([3, 1, 2])
		})
	})

	describe('Chunk', () => {
		it('chunks an array', () => {
			const arr = [1, 2, 3]
			const size = 2

			const result = chunk(size, arr)

			expect(result).toEqual([[1, 2], [3]])
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
