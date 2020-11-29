import { ifElse, left, right } from './either'
import { Either } from './types'

const runMonadChecks = (adt: Either<Error, number>, of: (value: any) => Either<Error, number>) => {
	describe('Monad', () => {
		it('has unit', () => {
			expect(of(adt).equals(adt)).toBe(true)
		})

		it('has identity', () => {
			expect(adt.equals(adt)).toBe(true)
		})

		it('has left identity', () => {
			const f = (a: any) => of(a).map((x: number) => x * 2)

			expect(adt.map(f).equals(f(adt))).toBe(true)
		})

		it('has right identity', () => {
			expect(adt.map(of).equals(adt)).toBe(true)
		})

		it('has associativity', () => {
			const f = (a: any) => of(a).map((x: number) => x * 2)
			const g = (a: any) => of(a).map((x: number) => x + 2)

			adt
				.map(f)
				.map(f)
				.equals(adt.map((x: any) => f(x).map(g)))
		})
	})
}

describe('Either', () => {
	describe('right', () => {
		const value = 2
		const adt = right<Error, number>(value)

		runMonadChecks(adt, right)

		it('is right', () => {
			expect(adt.isRight).toBe(true)
		})

		it('is serializable', () => {
			expect(adt.toString()).toBe('right(2)')
		})

		describe('equals', () => {
			describe('when using adt', () => {
				it('asserts equality', () => {
					expect(adt.equals(right(2))).toBeTruthy()
					expect(adt.equals(right(1))).toBeFalsy()
					expect(adt.equals(left(2))).toBeFalsy()
				})
			})
		})

		describe('map', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.map(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.map(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.map(() => newAdt)

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

		describe('catch', () => {
			it('supports data return', () => {
				const newAdt = 999
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.catch(spy)

				expect(actual).toBeRight(adt)
				expect(spy).not.toHaveBeenCalled()
			})

			it('supports right return', () => {
				const newAdt = right(999)
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.catch(spy)

				expect(actual).toBeRight(adt)
				expect(spy).not.toHaveBeenCalled()
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())
				const spy = jest.fn().mockReturnValue(newAdt)

				const actual = adt.catch(spy)

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

				it('maps correctly', () => {
					const expected = left('foo')
					const predicate = jest.fn().mockReturnValue(true)
					const ifTrue = jest.fn().mockReturnValue(expected)

					expect(adt.mapIf(predicate, ifTrue)).toBeLeft(expected)
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
	})

	describe('left', () => {
		const error = new Error()
		const adt = left<Error, number>(error)

		runMonadChecks(adt, left)

		it('is left', () => {
			expect(adt.isLeft).toBe(true)
		})

		it('is serializable', () => {
			expect(adt.toString()).toBe('left(Error)')
		})

		describe('equals', () => {
			describe('when using adt', () => {
				it('asserts equality', () => {
					expect(adt.equals(right(error))).toBeFalsy()
					expect(adt.equals(left(error))).toBeTruthy()
				})

				it('asserts deep equality', () => {
					expect(adt.equals(left(new Error()))).toBeTruthy()
					expect(adt.equals(left(new Error('foooo')))).toBeFalsy()
				})
			})
		})

		describe('map', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.map(() => newAdt)

				expect(actual).toBeLeft(adt)
			})

			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.map(() => newAdt)

				expect(actual).toBeLeft(adt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.map(() => newAdt)

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

		describe('catch', () => {
			it('supports data return', () => {
				const newAdt = 999

				const actual = adt.catch(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports right return', () => {
				const newAdt = right<Error, number>(999)

				const actual = adt.catch(() => newAdt)

				expect(actual).toBeRight(newAdt)
			})

			it('supports left return', () => {
				const newAdt = left<Error, number>(new Error())

				const actual = adt.catch(() => newAdt)

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
	})

	describe('ifElse', () => {
		describe('when predicate is truthy', () => {
			it('creates Either', () => {
				expect(
					ifElse(
						true,
						() => new Error(),
						() => 5
					)
				).toBeRight(5)
			})
		})

		describe('when predicate is falsy', () => {
			it('creates Either', () => {
				const error = new Error()
				expect(
					ifElse(
						false,
						() => left<Error, number>(error),
						() => right<Error, number>(5)
					)
				).toBeLeft(error)
			})
		})
	})

	describe('integration', () => {
		it('works', () => {
			const actual = right<string, number>(0)
				.map((it) => it + 10)
				.map((it) => it * 2)
				.map(() => left<string, number>('nooo'))
				.mapLeft(() => right<Error, number>(100))
				.map((it) => (it === 100 ? right<Error, string>('happy') : left<Error, string>(new Error())))
				.fold(
					() => 'very sad',
					(it) => it
				)

			expect(actual).toBe('happy')
		})
	})
})
