import { Either, Left, Right } from '../types'
import { createSerializable } from './serializer'

const PROTOTYPE = {}

export const isEither = <E, A>(input: unknown): input is Either<E, A> => {
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
				(it) => it === data
			),
		fold: <B>(_: (left: E) => B, ifRight: (right: A) => B) => ifRight(data),
		getOrElse: () => data,
		flatMap: (ifRight) => rightOf<E, any>(ifRight(data)),
		mapLeft: () => rightOf(data),
	})

const createLeft = <E, A>(data: E) => {
	const fold = <B>(ifLeft: (value: E) => B) => ifLeft(data)
	return seal<Left<E, A>>({
		...createSerializable('Left', data),
		isLeft: true,
		isRight: false,
		equals: (operand) =>
			operand.fold(
				(it) => it === data,
				() => false
			),
		fold,
		getOrElse: fold,
		flatMap: () => leftOf(data),
		mapLeft: (ifLeft) => leftOf<any, A>(ifLeft(data)),
	})
}

export const rightOf = <E, A>(data: A): Either<E, A> => (isEither<E, A>(data) ? data : createRight(data))

export const leftOf = <E, A>(data: E): Either<E, A> => (isEither<E, A>(data) ? data : createLeft(data))

export const right = createRight

export const left = createLeft
