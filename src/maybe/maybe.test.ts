import { just, maybe, nothing } from './maybe'
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
})
