import { just, maybe, none } from './maybe'

describe('Maybe', () => {
	describe('just', () => {
		const adt = just(5)

		it('is right', () => {
			expect(adt).toBeRight(5)
		})
	})

	describe('none', () => {
		const adt = none()

		it('is left', () => {
			expect(adt).toBeLeft(undefined)
		})
	})

	describe('maybe', () => {
		it('handles values', () => {
			expect(maybe(5)).toBeRight(5)
			expect(maybe('')).toBeRight('')
			expect(maybe(false)).toBeRight(false)
		})

		it('handles nullables', () => {
			expect(maybe(null)).toBeLeft(undefined)
			expect(maybe(undefined)).toBeLeft(undefined)
			expect(maybe((() => {})())).toBeLeft(undefined)
		})
	})
})
