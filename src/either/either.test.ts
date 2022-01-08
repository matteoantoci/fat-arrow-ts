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
		const f = (a: any) => of(a).mapRight((x: number) => of(x * 2))

		expect(adt.mapRight(f).equals(f(adt))).toBe(true)
	})

	it('has right identity', () => {
		expect(adt.mapRight(of).equals(adt)).toBe(true)
	})

	it('has associativity', () => {
		const f = (a: any) => of(a).mapRight((x: number) => of(x * 2))
		const g = (a: any) => of(a).mapRight((x: number) => of(x + 2))

		adt
			.mapRight(f)
			.mapRight(f)
			.equals(adt.mapRight((x: any) => f(x).mapRight(g)))
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

			it('asserts deep equality', () => {
				expect(right({}).equals(right({}))).toBeTruthy()
			})
		})

		describe('flatMap', () => {
			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.mapRight(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.mapRight(() => newAdt)

				expect(actual).toBeLeft(newAdt)
			})

			it('supports nested return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.mapRight(() => right(newAdt))

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

			describe('without callbacks', () => {
				it('folds', () => {
					expect(right(5).fold()).toBe(5)
				})
			})

			describe('with left callback', () => {
				it('folds', () => {
					const actual = adt.fold(() => 999)

					expect(actual).toBe(value)
				})
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

			it('asserts deep equality', () => {
				expect(adt.equals(left(new Error('error')))).toBeTruthy()
				expect(adt.equals(left(new Error('foooo')))).toBeFalsy()
			})
		})

		describe('flatMap', () => {
			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.mapRight(() => newAdt)

				expect(actual).toBeLeft(adt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.mapRight(() => newAdt)

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

			describe('without callbacks', () => {
				it('folds', () => {
					expect(left(3).fold()).toBe(3)
				})
			})

			describe('with left callback', () => {
				it('folds', () => {
					const actual = adt.fold(() => 999)

					expect(actual).toBe(999)
				})
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
