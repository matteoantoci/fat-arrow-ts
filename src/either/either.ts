import equal from 'fast-deep-equal/es6/react'
import { Either, Left, Right } from '../types'
import { createSerializable } from './serializer'

const PROTOTYPE = {}

const isEither = <E, A>(input: E | A | Either<E, A>): input is Either<E, A> => {
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
		flatMap: (ifRight) => {
			const next = ifRight(data)
			if (!isEither<any, any>(next)) return rightOf(next)
			return next.isLeft ? leftOf<E, any>(next) : rightOf<E, any>(next)
		},
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
		flatMap: () => leftOf(data),
		mapLeft: (ifLeft) => {
			const next = ifLeft(data)
			if (!isEither<any, any>(next)) return leftOf(next)
			return next.isRight ? rightOf<any, A>(next) : leftOf<any, A>(next)
		},
	})

export const rightOf = <E, A>(data: A | Either<E, A>): Either<E, A> => (isEither(data) ? data : createRight(data))

export const leftOf = <E, A>(data: E | Either<E, A>): Either<E, A> => (isEither(data) ? data : createLeft(data))

export const right = <
	E = [Error, 'Cannot infer E type in right<E, A>'],
	A = [Error, 'Cannot infer A type in right<E, A>']
>(
	value: A
): Either<E, A> => createRight(value)

export const left = <
	E = [Error, 'Cannot infer E type in left<E, A>'],
	A = [Error, 'Cannot infer A type in left<E, A>']
>(
	value: E
): Either<E, A> => createLeft(value)
