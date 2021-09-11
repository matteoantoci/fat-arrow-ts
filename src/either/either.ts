import equal from 'fast-deep-equal/es6/react'
import safeStringify from 'fast-safe-stringify'
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

const toJSON = (): never => {
	throw new Error(`Either value can't be serialized to JSON. Please fold it first.`)
}

const isError = (data: any): data is Error => Object.getPrototypeOf(data) === Error.prototype

const toString = (kind: string, data: any) =>
	isError(data) ? `${kind}(${data.name}("${data.message}"))` : `${kind}(${safeStringify(data)})`

const createRight = <E, A>(data: A) =>
	seal<Right<E, A>>({
		isLeft: false,
		isRight: true,
		toJSON,
		toString: () => toString('Right', data),
		equals: (operand) =>
			operand.fold(
				() => false,
				(it) => equal(it, data)
			),
		fold: <B>(_?: any, ifRight?: (data: A) => B) => (ifRight ? ifRight(data) : data),
		flatMap: (ifRight) => rightOf(ifRight(data)),
		mapLeft: () => rightOf(data),
	})

const createLeft = <E, A>(data: E) =>
	seal<Left<E, A>>({
		isLeft: true,
		isRight: false,
		toString: () => toString('Left', data),
		toJSON,
		equals: (operand) =>
			operand.fold(
				(it) => equal(it, data),
				() => false
			),
		fold: <B>(ifLeft?: (value: E) => B) => (ifLeft ? ifLeft(data) : data),
		flatMap: () => leftOf(data),
		mapLeft: (ifLeft) => leftOf(ifLeft(data)),
	})

export const rightOf = <E, A>(data: A | Either<E, A>): Either<E, A> => (isEither(data) ? data : createRight(data))

export const leftOf = <E, A>(data: E | Either<E, A>): Either<E, A> => (isEither(data) ? data : createLeft(data))

export const right = <E, A>(value: A): Either<E, A> => createRight(value)

export const left = <E, A>(value: E): Either<E, A> => createLeft(value)
