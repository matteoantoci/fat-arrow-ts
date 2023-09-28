import { left, leftOf, right, rightOf } from './either'
import { Either } from '../types'

const runMonadChecks = (adt: Either<Error, number>, of: (value: any) => Either<Error, number>) => {
	it('has unit', () => {
		expect(of(adt).equals(adt)).toBe(true)
	})

	it('has reflexivity', () => {
		expect(adt.equals(adt)).toBe(true)
	})

	it('has left identity', () => {
		const f = (a: any) => of(a).flatMap((x: number) => of(x * 2))

		expect(adt.flatMap(f).equals(f(adt))).toBe(true)
	})

	it('has right identity', () => {
		expect(adt.flatMap(of).equals(adt)).toBe(true)
	})

	it('has associativity', () => {
		const f = (a: any) => of(a).flatMap((x: number) => of(x * 2))
		const g = (a: any) => of(a).flatMap((x: number) => of(x + 2))

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
			})
		})

		describe('flatMap', () => {
			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				expect(adt.flatMap(() => newAdt)).toBeRight(newAdt)
				expect(adt.flatMap(() => right(newAdt))).toBeRight(right(newAdt))
				expect(adt.flatMap(() => right(newAdt))).not.toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.flatMap(() => newAdt)

				expect(actual).toBeLeft(newAdt)
			})

			it('supports nested return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.flatMap(() => right(newAdt))

				expect(actual).toBeRight(right(newAdt))
			})
		})

		describe('mapLeft', () => {
			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

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
			it('runs the proper callback', () => {
				const spy = jest.fn()

				adt.fold(() => 999, spy)

				expect(spy).toHaveBeenCalledWith(value)
			})

			describe('with both callbacks', () => {
				it('folds', () => {
					const actual = adt.fold(
						() => 'left',
						() => 'right'
					)

					expect(actual).toBe('right')
				})
			})
		})

		describe('getOrElse', () => {
			it('runs the proper callback', () => {
				const actual = adt.getOrElse(() => 999)

				expect(actual).toBe(value)
			})
		})

		describe('when serialized', () => {
			it('serializes to string', () => {
				expect(adt.toString()).toBe('Right(2)')
			})

			it('serializes to JSON', () => {
				expect(JSON.stringify(adt)).toBe('{}')
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
				expect(adt.equals(left(error))).toBeTruthy()
			})
		})

		describe('flatMap', () => {
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

			it('supports nested return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.mapLeft(() => left(newAdt))

				expect(actual).toBeLeft(left(newAdt))
			})
		})

		describe('fold', () => {
			it('runs the proper callback', () => {
				const spy = jest.fn()

				adt.fold(spy, () => 111)

				expect(spy).toHaveBeenCalledWith(error)
			})

			describe('with both callbacks', () => {
				it('folds', () => {
					const actual = adt.fold(
						() => 'left',
						() => 'right'
					)

					expect(actual).toBe('left')
				})
			})
		})

		describe('getOrElse', () => {
			it('runs the proper callback', () => {
				const actual = adt.getOrElse(() => 999)

				expect(actual).toBe(999)
			})
		})

		describe('when serialized', () => {
			it('serializes to string', () => {
				expect(adt.toString()).toBe('Left(Error("error"))')
			})

			it('serializes to JSON', () => {
				expect(JSON.stringify(adt)).toBe('{}')
			})
		})
	})
})
