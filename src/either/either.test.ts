import { left, leftOf, right, rightOf } from './either'
import { Either } from '../types'

const runMonadChecks = (adt: Either<Error, number>, of: (value: any) => Either<Error, number>) => {
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
}

describe('Either', () => {
	describe('right', () => {
		const value = 2
		const adt = right<Error, number>(value)

		describe('is monad', () => {
			runMonadChecks(adt, rightOf)
		})

		it('is right', () => {
			expect(adt.isRight).toBe(true)
		})

		describe('equals', () => {
			it('asserts equality', () => {
				expect(adt.equals(right(2))).toBeTruthy()
				expect(adt.equals(right(1))).toBeFalsy()
				expect(adt.equals(left(2))).toBeFalsy()
			})

			it('asserts deep equality', () => {
				expect(right({}).equals(right({}))).toBeTruthy()
			})
		})

		describe('flatMap', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeLeft(newAdt)
			})
		})

		describe('mapLeft', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.mapLeft(() => newAdt)

				expect(actual).toBeRight(adt)
			})

			it('supports right return', () => {
				const newAdt = right(999)

				const actual = adt.mapLeft(() => newAdt)

				expect(actual).toBeRight(adt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.mapLeft(() => newAdt)

				expect(actual).toBeRight(adt)
			})
		})

		describe('fold', () => {
			describe('without params', () => {
				it('folds', () => {
					expect(right(5).fold()).toBe(5)
				})
			})

			describe('with params', () => {
				it('folds', () => {
					const expected = 'right'
					const spy = jest.fn().mockReturnValue(expected)

					const actual = adt.fold(() => 999, spy)

					expect(spy).toHaveBeenCalledWith(value)
					expect(actual).toBe(expected)
				})
			})
		})

		describe('bimap', () => {
			it('maps right type', () => {
				const expected = 'right'

				const actual = adt.bimap(
					() => 'left',
					() => expected
				)

				expect(actual).toBeRight(expected)
			})
		})

		describe('orElse', () => {
			it('supports data return', () => {
				const newAdt = 999
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.orElse(spy)

				expect(actual).toBeRight(adt)
				expect(spy).not.toHaveBeenCalled()
			})

			it('supports right return', () => {
				const newAdt = right(999)
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.orElse(spy)

				expect(actual).toBeRight(adt)
				expect(spy).not.toHaveBeenCalled()
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.orElse(spy)

				expect(actual).toBeRight(adt)
				expect(spy).not.toHaveBeenCalled()
			})
		})

		describe('mapIf', () => {
			describe('when predicate is truthy', () => {
				it('maps correctly', () => {
					const expected = right('foo')
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

		describe('when serialized', () => {
			describe('toString', () => {
				it('is serializable', () => {
					expect(adt.toString()).toBe('Right(2)')
					expect(right(1).toString()).toBe('Right(1)')
					expect(right(true).toString()).toBe('Right(true)')
					expect(right('some string').toString()).toBe('Right("some string")')
					expect(right({ foo: 'bar' }).toString()).toBe('Right({"foo":"bar"})')
				})
			})

			describe('toJSON', () => {
				it('throws error', () => {
					expect(() => {
						JSON.stringify(adt)
					}).toThrowError(`Either value can't be serialized to JSON. Please fold it first.`)
				})
			})
		})
	})

	describe('left', () => {
		const error = new Error('error')
		const adt = left<Error, number>(error)

		describe('is monad', () => {
			runMonadChecks(adt, leftOf)
		})

		it('is left', () => {
			expect(adt.isLeft).toBe(true)
		})

		describe('equals', () => {
			it('asserts equality', () => {
				expect(adt.equals(right(error))).toBeFalsy()
				expect(adt.equals(left(error))).toBeTruthy()
			})

			it('asserts deep equality', () => {
				expect(adt.equals(left(new Error('error')))).toBeTruthy()
				expect(adt.equals(left(new Error('foooo')))).toBeFalsy()
			})
		})

		describe('flatMap', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeLeft(adt)
			})

			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeLeft(adt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeLeft(adt)
			})
		})

		describe('mapLeft', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.mapLeft(() => newAdt)

				expect(actual).toBeLeft(newAdt)
			})

			it('supports right return', () => {
				const newAdt = right(999)

				const actual = adt.mapLeft(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.mapLeft(() => newAdt)

				expect(actual).toBeLeft(newAdt)
			})
		})

		describe('fold', () => {
			describe('without params', () => {
				it('folds', () => {
					expect(left(3).fold()).toBe(3)
				})
			})

			describe('with params', () => {
				it('folds', () => {
					const expected = 'value'
					const spy = jest.fn().mockReturnValue(expected)

					const actual = adt.fold(spy, () => 'right')

					expect(spy).toHaveBeenCalledWith(error)
					expect(actual).toBe(expected)
				})
			})
		})

		describe('bimap', () => {
			it('maps left type', () => {
				const expected = 'left'

				const actual = adt.bimap(
					() => expected,
					() => 'right'
				)

				expect(actual).toBeLeft(expected)
			})
		})

		describe('orElse', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.orElse(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.orElse(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.orElse(() => newAdt)

				expect(actual).toBeLeft(newAdt)
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

		describe('when serialized', () => {
			describe('toString', () => {
				it('is serializable', () => {
					expect(adt.toString()).toBe('Left(Error("error"))')
					expect(left(1).toString()).toBe('Left(1)')
					expect(left(true).toString()).toBe('Left(true)')
					expect(left('some string').toString()).toBe('Left("some string")')
					expect(left({ foo: 'bar' }).toString()).toBe('Left({"foo":"bar"})')
				})
			})

			describe('toJSON', () => {
				it('throws error', () => {
					expect(() => {
						JSON.stringify(adt)
					}).toThrowError(`Either value can't be serialized to JSON. Please fold it first.`)
				})
			})
		})
	})
})
