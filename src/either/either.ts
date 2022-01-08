import equal from 'fast-deep-equal/es6/react'
import { Either, Left, Right } from '../types'
import { createSerializable } from './serializer'

const PROTOTYPE = {}

export const isEither = <E, A>(input: E | A | Either<E, A>): input is Either<E, A> => {
	try {
		return Object.getPrototypeOf(input) === PROTOTYPE
	} catch (_) {
		return false
	}
}

const seal = <T>(adt: T): T => Object.freeze(Object.assign(Object.create(PROTOTYPE), adt))

const createRight = <E, A>(data: A) =>
	seal<Right<E, A>>({
		...createSerializable('Right', data),
		isLeft: false,
		isRight: true,
		equals: (operand) =>
			operand.fold(
				() => false,
				(it) => equal(it, data)
			),
		fold: <B>(_?: any, ifRight?: (data: A) => B) => (ifRight ? ifRight(data) : data),
		mapRight: (ifRight) => rightOf<E, any>(ifRight(data)),
		// ap: (fn) => fn(rightOf(data)),
		mapLeft: () => rightOf(data),
	})

const createLeft = <E, A>(data: E) =>
	seal<Left<E, A>>({
		...createSerializable('Left', data),
		isLeft: true,
		isRight: false,
		equals: (operand) =>
			operand.fold(
				(it) => equal(it, data),
				() => false
			),
		fold: <B>(ifLeft?: (value: E) => B) => (ifLeft ? ifLeft(data) : data),
		mapRight: () => leftOf(data),
		// ap: (fn) => fn(leftOf(data)),
		mapLeft: (ifLeft) => leftOf<any, A>(ifLeft(data)),
	})

export const rightOf = <E, A>(data: A | Either<E, A>): Either<E, A> => (isEither(data) ? data : createRight(data))

export const leftOf = <E, A>(data: E | Either<E, A>): Either<E, A> => (isEither(data) ? data : createLeft(data))

export const right = <E = [Error, 'Specify Left type in right()'], A = [Error, 'Specify Right type in right()']>(
	value: A
): Either<E, A> => createRight(value)

export const left = <E = [Error, 'Specify Left type in left()'], A = [Error, 'Specify Right type in left()']>(
	value: E
): Either<E, A> => createLeft(value)
