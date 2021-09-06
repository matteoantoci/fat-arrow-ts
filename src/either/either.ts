import equal from 'fast-deep-equal/es6/react'
import { Either, Left, Right } from '../types'
import { maybe, none } from '../maybe/maybe'

const PROTOTYPE = {}

export const isEither = <E, A>(input: E | A | Either<E, A>): input is Either<E, A> => {
	try {
		return Object.getPrototypeOf(input) === PROTOTYPE
	} catch (_) {
		return false
	}
}

const seal = <O>(adt: object): O => Object.freeze(Object.assign(Object.create(PROTOTYPE), adt))

export const right = <
	E = [Error, 'Please specify E type in right<E, A>'],
	A = [Error, 'Please specify A type in right<E, A>']
>(
	value: A
): Either<E, A> => {
	const flatten = <X, Y>(data: Y | Either<X, Y>): Either<X, Y> => (isEither(data) ? data : seal(identity(data)))

	const identity = <X, Y>(data: Y): Right<X, Y> => ({
		isLeft: false,
		isRight: true,
		toString: () => `right(${data})`,
		of: flatten,
		equals: (operand) =>
			operand.fold(
				() => false,
				(it) => equal(it, data)
			),
		fold: <B>(_?: any, ifRight?: (data: Y) => B) => (ifRight ? ifRight(data) : data),
		bimap: (_, ifRight) => flatten(ifRight(data)),
		flatMap: (ifRight) => flatten(ifRight(data)),
		mapIf: (predicate, ifTrue) => (predicate(data) ? flatten(ifTrue(data)) : flatten(data)),
		mapLeft: () => flatten(data),
		orElse: () => flatten(data),
		toMaybe: () => maybe(data),
	})

	return seal(identity(value))
}

export const left = <
	E = [Error, 'Please specify E type in left<E, A>'],
	A = [Error, 'Please specify A type in left<E, A>']
>(
	value: E
): Either<E, A> => {
	const flatten = <X, Y>(data: X | Either<X, Y>): Either<X, Y> => (isEither(data) ? data : seal(identity(data)))

	const identity = <X, Y>(data: X): Left<X, Y> => ({
		isLeft: true,
		isRight: false,
		toString: () => `left(${data})`,
		of: flatten,
		equals: (operand) =>
			operand.fold(
				(it) => equal(it, data),
				() => false
			),
		fold: <B>(ifLeft?: (value: X) => B) => (ifLeft ? ifLeft(data) : data),
		bimap: (ifLeft) => flatten(ifLeft(data)),
		flatMap: () => flatten(data),
		mapIf: () => flatten(data),
		mapLeft: (ifLeft) => flatten(ifLeft(data)),
		orElse: (ifLeft) => {
			const result = ifLeft(data)
			return isEither(result) ? result : right(result)
		},
		toMaybe: () => none(),
	})

	return seal(identity(value))
}
