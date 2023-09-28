import { left, right } from './either/either'

describe('Jest matchers', () => {
	describe('toBeRight', () => {
		it('asserts correctly', () => {
			expect(right(undefined)).toBeRight(undefined)
			expect(right(null)).toBeRight(null)
			expect(right(5)).toBeRight(5)
			expect(right(5)).toBeRight(right(5))

			expect(right({})).not.toBeRight({ foo: 'bar' })
			expect(right(5)).not.toBeRight(6)
			expect(left(5)).not.toBeRight(5)
		})
	})

	describe('toBeLeft', () => {
		it('asserts correctly', () => {
			expect(left(undefined)).toBeLeft(undefined)
			expect(left(null)).toBeLeft(null)
			expect(left(5)).toBeLeft(5)
			expect(left(5)).toBeLeft(left(5))

			expect(left({})).not.toBeLeft({ foo: 'bar' })
			expect(left(5)).not.toBeLeft(6)
			expect(right(5)).not.toBeLeft(5)
		})
	})

	describe('toBeNothing', () => {
		it('asserts correctly', () => {
			expect(left(undefined)).toBeNothing()

			expect(left(null)).not.toBeNothing()
			expect(right(null)).not.toBeNothing()
			expect(right(undefined)).not.toBeNothing()
			expect(right(5)).not.toBeNothing()
		})
	})
})
