import { just, maybe, none } from './maybe'
import { Maybe } from './maybe.types'

const runMonadChecks = (adt: Maybe<number>, of: (value: any) => Maybe<number>) => {
	describe('Monad', () => {
		it('has unit', () => {
			expect(of(adt).equals(adt)).toBe(true)
		})

		it('has identity', () => {
			expect(adt.equals(adt)).toBe(true)
		})

		it('has left identity', () => {
			const f = (a: any) => of(a).flatMap((x: number) => x * 2)

			expect(adt.flatMap(f).equals(f(adt))).toBe(true)
		})

		it('has right identity', () => {
			expect(adt.flatMap(of).equals(adt)).toBe(true)
		})

		it('has associativity', () => {
			const f = (a: any) => of(a).flatMap((x: number) => x * 2)
			const g = (a: any) => of(a).flatMap((x: number) => x + 2)

			adt
				.flatMap(f)
				.flatMap(f)
				.equals(adt.flatMap((x: any) => f(x).flatMap(g)))
		})
	})
}

describe('Maybe', () => {
	describe('just', () => {
		const value = 2
		const adt = just(value)

		runMonadChecks(adt, just)

		it('is just', () => {
			expect(adt.isJust).toBe(true)
		})

		it('toString', () => {
			expect(adt.toString()).toBe('just(2)')
		})

		it('flattens', () => {
			expect(just(adt)).toBeJust(2)
			expect(just(adt)).toBeJust(adt)
		})

		describe('equals', () => {
			it('asserts equality', () => {
				expect(adt.equals(just(2))).toBeTruthy()
				expect(adt.equals(just(1))).toBeFalsy()
				expect(adt.equals(none())).toBeFalsy()
			})

			it('asserts deep equality', () => {
				expect(just({ foo: 1 }).equals(just({ foo: 1 }))).toBeTruthy()
				expect(just({ foo: 1 }).equals(just({ foo: 2 }))).toBeFalsy()
			})
		})

		describe('map', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeJust(newAdt)
			})

			it('supports just return', () => {
				const newAdt = just(999)

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeJust(newAdt)
			})

			it('supports none return', () => {
				const newAdt = none()

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeNone()
			})
		})

		describe('fold', () => {
			describe('without params', () => {
				it('folds', () => {
					expect(adt.fold()).toBe(value)
				})
			})

			describe('with params', () => {
				it('folds', () => {
					const expected = 'expected'
					const spy = jest.fn().mockReturnValue(expected)

					const actual = adt.fold(() => 999, spy)

					expect(spy).toHaveBeenCalledWith(value)
					expect(actual).toBe(expected)
				})
			})
		})

		describe('catch', () => {
			it('supports data return', () => {
				const newAdt = 999
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.orElse(spy)

				expect(actual).toBeJust(adt)
				expect(spy).not.toHaveBeenCalled()
			})

			it('supports just return', () => {
				const newAdt = just(999)
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.orElse(spy)

				expect(actual).toBeJust(adt)
				expect(spy).not.toHaveBeenCalled()
			})

			it('supports none return', () => {
				const newAdt = none()
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.orElse(spy)

				expect(actual).toBeJust(adt)
				expect(spy).not.toHaveBeenCalled()
			})
		})

		describe('mapIf', () => {
			describe('when predicate is truthy', () => {
				it('maps correctly', () => {
					const expected = just('foo')
					const predicate = jest.fn().mockReturnValue(true)
					const ifTrue = jest.fn().mockReturnValue(expected)

					expect(adt.mapIf(predicate, ifTrue)).toBeRight(expected)
					expect(predicate).toHaveBeenLastCalledWith(value)
					expect(ifTrue).toHaveBeenLastCalledWith(value)
				})
			})

			describe('when predicate is falsy', () => {
				it('maps correctly', () => {
					const predicate = jest.fn().mockReturnValue(false)
					const ifTrue = jest.fn().mockReturnValue('foo')

					expect(adt.mapIf(predicate, ifTrue)).toBeRight(adt)
					expect(predicate).toHaveBeenLastCalledWith(value)
					expect(ifTrue).not.toHaveBeenCalled()
				})
			})
		})

		describe('toEither', () => {
			it('maps to right', () => {
				const actual = adt.toEither(() => 'left');

				expect(actual).toBeRight(value)
			})
		})
	})

	describe('none', () => {
		const adt = none()

		runMonadChecks(adt, none)

		it('is none', () => {
			expect(adt.isNone).toBe(true)
		})

		it('toString', () => {
			expect(adt.toString()).toBe('none()')
		})

		it('toJSON', () => {
			expect(() => {
				JSON.stringify(adt)
			}).toThrow('You are trying to serialize a none(). Please fold it before doing it.')
		})

		it('has identity', () => {
			expect(adt).toBe(none())
		})

		describe('equals', () => {
			it('asserts equality', () => {
				expect(adt.equals(none())).toBeTruthy()
				expect(adt.equals(just(5))).toBeFalsy()
			})
		})

		describe('map', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeNone()
			})

			it('supports just return', () => {
				const newAdt = just(999)

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeNone()
			})

			it('supports none return', () => {
				const newAdt = none()

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeNone()
			})
		})

		describe('fold', () => {
			describe('without params', () => {
				it('folds', () => {
					expect(none().fold()).toBe(null)
				})
			})

			describe('with params', () => {
				it('folds', () => {
					const expected = 'value'
					const spy = jest.fn().mockReturnValue(expected)

					const actual = adt.fold(spy, () => 'just')

					expect(spy).toHaveBeenCalled()
					expect(actual).toBe(expected)
				})
			})
		})

		describe('catch', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.orElse(() => newAdt)

				expect(actual).toBeJust(newAdt)
			})

			it('supports just return', () => {
				const newAdt = just(999)

				const actual = adt.orElse(() => newAdt)

				expect(actual).toBeJust(newAdt)
			})

			it('supports none return', () => {
				const newAdt = none()

				const actual = adt.orElse(() => newAdt)

				expect(actual).toBeNone()
			})
		})

		describe('mapIf', () => {
			describe('when predicate is truthy', () => {
				it('maps correctly', () => {
					const predicate = jest.fn().mockReturnValue(true)
					const ifTrue = jest.fn().mockReturnValue('foo')

					expect(adt.mapIf(predicate, ifTrue)).toBeLeft(adt)
					expect(predicate).not.toHaveBeenCalled()
					expect(ifTrue).not.toHaveBeenCalled()
				})
			})

			describe('when predicate is falsy', () => {
				it('maps correctly', () => {
					const predicate = jest.fn().mockReturnValue(false)
					const ifTrue = jest.fn().mockReturnValue('foo')

					expect(adt.mapIf(predicate, ifTrue)).toBeLeft(adt)
					expect(predicate).not.toHaveBeenCalled()
					expect(ifTrue).not.toHaveBeenCalled()
				})
			})
		})

		describe('toEither', () => {
			it('maps to left', () => {
				const expected = 'left';

				const actual = adt.toEither(() => expected);

				expect(actual).toBeLeft(expected)
			})
		})
	})

	describe('maybe', () => {
		it('handles values', () => {
			expect(maybe(5)).toBeJust(5)
			expect(maybe('')).toBeJust('')
			expect(maybe(false)).toBeJust(false)
		})

		it('handles nullables', () => {
			expect(maybe(null)).toBeNone()
			expect(maybe(undefined)).toBeNone()
			expect(maybe((() => {
			})())).toBeNone()
		})
	})
})
