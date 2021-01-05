import { chunk, once, repeat, rotate } from "./lambda";

describe('Lambda', () => {
	describe('Once', () => {
		it('runs function only once', () => {
			const fn = jest.fn().mockReturnValue('value')
			const wrapped = once(fn)

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
			expect(result.length).toBe(times)
		})
	})

	describe('Rotate', () => {
		it('rotates an array', () => {
			const arr = [1,2,3]
			const positions = 2

			const result = rotate(positions, arr)

			expect(result).toEqual([3,1,2])
		})
	})

	describe('Chunk', () => {
		it('chunks an array', () => {
			const arr = [1,2,3]
			const size = 2

			const result = chunk(size, arr)

			expect(result).toEqual([[1,2], [3]])
		})
	})
})
