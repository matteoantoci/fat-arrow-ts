import equal from 'fast-deep-equal/es6/react'
import { Either, Left, Right } from '../types'

const PROTOTYPE = {}

const isEither = <E, A>(input: E | A | Either<E, A>): input is Either<E, A> => {
	try {
		return Object.getPrototypeOf(input) === PROTOTYPE
	} catch (_) {
		return false
	}
}

const seal = <O>(adt: O): O => Object.freeze(Object.assign(Object.create(PROTOTYPE), adt))

const toJSON = () => {
	throw new Error(`Either value can't be serialized to JSON. Please fold it first.`)
}

const createRight = <E, A>(data: A): Right<E, A> =>
	seal({
		isLeft: false,
		isRight: true,
		toString: () => `right(${data})`,
		equals: (operand) =>
			operand.fold(
				() => false,
				(it) => equal(it, data)
			),
		fold: <B>(_?: any, ifRight?: (data: A) => B) => (ifRight ? ifRight(data) : data),
		bimap: (_, ifRight) => rightOf(ifRight(data)),
		flatMap: (ifRight) => rightOf(ifRight(data)),
		mapIf: (predicate, ifTrue) => (predicate(data) ? rightOf(ifTrue(data)) : rightOf(data)),
		mapLeft: () => rightOf(data),
		orElse: () => rightOf(data),
		toJSON,
	})

const createLeft = <E, A>(data: E): Left<E, A> =>
	seal({
		isLeft: true,
		isRight: false,
		toString: () => `left(${data})`,
		equals: (operand) =>
			operand.fold(
				(it) => equal(it, data),
				() => false
			),
		fold: <B>(ifLeft?: (value: E) => B) => (ifLeft ? ifLeft(data) : data),
		bimap: (ifLeft) => leftOf(ifLeft(data)),
		flatMap: () => leftOf(data),
		mapIf: () => leftOf(data),
		mapLeft: (ifLeft) => leftOf(ifLeft(data)),
		orElse: (ifLeft) => rightOf(ifLeft(data)),
		toJSON,
	})

export const rightOf = <E, A>(data: A | Either<E, A>): Either<E, A> => (isEither(data) ? data : createRight(data))

export const leftOf = <E, A>(data: E | Either<E, A>): Either<E, A> => (isEither(data) ? data : createLeft(data))

export const right = <E, A>(value: A): Either<E, A> => createRight(value)

export const left = <E, A>(value: E): Either<E, A> => createLeft(value)
