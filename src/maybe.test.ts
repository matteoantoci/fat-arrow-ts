import { just, Maybe, maybe, none } from './maybe'

describe('Maybe', () => {
	describe('maybe', () => {
		it('handles values', () => {
			expect(maybe(5)).toBeRight(5)
			expect(maybe('')).toBeRight('')
			expect(maybe(false)).toBeRight(false)
		})

		it('handles nullables', () => {
			expect(maybe(null)).toBeLeft(undefined)
			expect(maybe(undefined)).toBeLeft(undefined)
		})
	})

	describe('just', () => {
		it('is right', () => {
			expect(just(5)).toBeRight(5)
		})
	})

	describe('none', () => {
		it('is unique', () => {
			const noneNumber: Maybe<number> = none()
			const noneString: Maybe<string> = none()

			expect(noneNumber).toBe(noneString)
		})

		it('is left', () => {
			expect(none()).toBeLeft(undefined)
		})
	})
})
