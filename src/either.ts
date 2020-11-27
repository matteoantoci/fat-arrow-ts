import equal from 'fast-deep-equal/es6/react'
import { createAdtBuilder } from './utils/adt-builder'
import { Either, LeftValue, RightValue } from './types'

const builder = createAdtBuilder({})

const rightOf = <E, A>(value: RightValue<E, A>): Either<E, A> =>
	builder.flatten<A, Either<E, A>>(value).seal(
		(data): Either<E, A> => ({
			toString: () => `right(${data})`,
			isLeft: false,
			isRight: true,
			equals: (operand) =>
				operand.fold(
					() => false,
					(it) => equal(it, data)
				),
			map: (ifRight) => rightOf(ifRight(data)),
			mapLeft: () => rightOf(data),
			catch: () => rightOf(data),
			fold: <B>(_?: (value: E) => B, ifRight?: (value: A) => B) => (ifRight ? ifRight(data) : data),
			mapIf: (predicate, ifTrue) => (predicate(data) ? rightOf(ifTrue(data)) : rightOf(data)),
		})
	)

const leftOf = <E, A>(value: LeftValue<E, A>): Either<E, A> =>
	builder.flatten<E, Either<E, A>>(value).seal(
		(data): Either<E, A> => ({
			toString: () => `left(${data})`,
			isLeft: true,
			isRight: false,
			equals: (operand) =>
				operand.fold(
					(it) => equal(it, data),
					() => false
				),
			map: () => leftOf(data),
			mapLeft: (f) => leftOf(f(data)),
			catch: (ifLeft) => rightOf(ifLeft(data)),
			fold: <B>(ifLeft?: (value: E) => B) => (ifLeft ? ifLeft(data) : data),
			mapIf: () => leftOf(data),
		})
	)

export const right = <E = [Error, 'Cannot infer E in Right<E, A>'], A = [Error, 'Cannot infer A in Right<E, A>']>(
	r: RightValue<E, A>
): Either<E, A> => rightOf(r)

export const left = <E = [Error, 'Cannot infer E in Left<E, A>'], A = [Error, 'Cannot infer A in Left<E, A>']>(
	l: LeftValue<E, A>
): Either<E, A> => leftOf(l)

export const tryCatch = <A>(factory: () => RightValue<Error, A>): Either<Error, A> => {
	try {
		return right(factory())
	} catch (e) {
		return left(e)
	}
}

// TODO: add docs
export const ifElse = <E, A>(
	bool: boolean,
	ifFalse: () => LeftValue<E, A>,
	ifTrue: () => RightValue<E, A>
): Either<E, A> => (bool ? right(ifTrue()) : left(ifFalse()))
