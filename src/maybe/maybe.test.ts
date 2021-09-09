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
			expect(maybe(noop())).toBeLeft(undefined)
		})
	})
})
