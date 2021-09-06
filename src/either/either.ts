import equal from 'fast-deep-equal/es6/react'
import { Either, Left, Right } from './either.types'

const PROTOTYPE = {}

const isEither = <E, A>(input: E | A | Either<E, A>): input is Either<E, A> => {
	try {
		return Object.getPrototypeOf(input) === PROTOTYPE
	} catch (_) {
		return false
	}
}

const seal = <O>(adt: O): O => Object.freeze(Object.assign(Object.create(PROTOTYPE), adt))

const createRight = <X, Y>(data: Y): Right<X, Y> => ({
	isLeft: false,
	isRight: true,
	toString: () => `right(${data})`,
	equals: (operand) =>
		operand.fold(
			() => false,
			(it) => equal(it, data)
		),
	fold: <B>(_?: any, ifRight?: (data: Y) => B) => (ifRight ? ifRight(data) : data),
	bimap: (_, ifRight) => rightOf(ifRight(data)),
	flatMap: (ifRight) => rightOf(ifRight(data)),
	mapIf: (predicate, ifTrue) => (predicate(data) ? rightOf(ifTrue(data)) : rightOf(data)),
	mapLeft: () => rightOf(data),
	orElse: () => rightOf(data),
})

const createLeft = <X, Y>(data: X): Left<X, Y> => ({
	isLeft: true,
	isRight: false,
	toString: () => `left(${data})`,
	equals: (operand) =>
		operand.fold(
			(it) => equal(it, data),
			() => false
		),
	fold: <B>(ifLeft?: (value: X) => B) => (ifLeft ? ifLeft(data) : data),
	bimap: (ifLeft) => leftOf(ifLeft(data)),
	flatMap: () => leftOf(data),
	mapIf: () => leftOf(data),
	mapLeft: (ifLeft) => leftOf(ifLeft(data)),
	orElse: (ifLeft) => rightOf(ifLeft(data)),
})

export const rightOf = <X, Y>(data: Y | Either<X, Y>): Either<X, Y> => (isEither(data) ? data : seal(createRight(data)))

export const leftOf = <X, Y>(data: X | Either<X, Y>): Either<X, Y> => (isEither(data) ? data : seal(createLeft(data)))

export const right = <E, A>(value: A): Either<E, A> => seal(createRight(value))

export const left = <E, A>(value: E): Either<E, A> => seal(createLeft(value))
