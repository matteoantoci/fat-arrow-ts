import { Either } from '../types'
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

const createRight = <E, A>(data: A) => {
	const equals = (operand: Either<E, A>) =>
		operand.fold(
			() => false,
			(it) => it === data
		)
	const map = <B>(ifRight: (right: A) => B) => rightOf<E, any>(ifRight(data))
	const fold = <B>(_: (left: E) => B, ifRight: (right: A) => B) => ifRight(data)
	return seal<Either<E, A>>({
		...createSerializable('Right', data),
		isLeft: false,
		isRight: true,
		equals: equals,
		fold,
		getOrElse: () => data,
		map,
		flatMap: map,
		mapLeft: () => rightOf(data),
	})
}

const createLeft = <E, A>(data: E) => {
	const equals = (operand: Either<E, A>) =>
		operand.fold(
			(it) => it === data,
			() => false
		)
	const map = <B>() => leftOf<E, B>(data)
	const fold = <B>(ifLeft: (value: E) => B) => ifLeft(data)
	return seal<Either<E, A>>({
		...createSerializable('Left', data),
		isLeft: true,
		isRight: false,
		equals: equals,
		fold,
		getOrElse: fold,
		map: map,
		flatMap: map,
		mapLeft: (ifLeft) => leftOf<any, A>(ifLeft(data)),
	})
}

export const rightOf = <E, A>(data: A): Either<E, A> => (isEither<E, A>(data) ? data : createRight(data))

export const leftOf = <E, A>(data: E): Either<E, A> => (isEither<E, A>(data) ? data : createLeft(data))

export const right = <E = [Error, 'Specify Left type in right()'], A = [Error, 'Specify Right type in right()']>(
	data: A
) => createRight<E, A>(data)

export const left = <E = [Error, 'Specify Left type in left()'], A = [Error, 'Specify Right type in left()']>(
	data: E
) => createLeft<E, A>(data)
