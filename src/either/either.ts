import equal from 'fast-deep-equal/es6/react'
import { createAdtBuilder } from '../utils/adt-builder'
import { Either, Left, LeftValueOrEither, Right, RightValueOrEither } from './either.types'
import { createSerializer } from '../utils/serializer'

const builder = createAdtBuilder({})

export const right = <
	E = [Error, 'Please specify E type in right<E, A>'],
	A = [Error, 'Please specify A type in right<E, A>']
>(
	value: RightValueOrEither<A>
): Either<E, A> =>
	builder.flatten<A, Either<E, A>>(value).seal(
		(data): Right<E, A> => ({
			...createSerializer('right', data),
			isLeft: false,
			isRight: true,
			equals: (operand) =>
				operand.fold(
					() => false,
					(it) => equal(it, data)
				),
			fold: <B>(_?: any, ifRight?: (value: A) => B) => (ifRight ? ifRight(data) : data),
			map: (ifRight) => right(ifRight(data)),
			mapIf: (predicate, ifTrue) => (predicate(data) ? right(ifTrue(data)) : right(data)),
			mapLeft: () => right(data),
			orElse: () => right(data),
		})
	)

export const left = <E = [Error, 'Please specify E type in left<E, A>'], A = [Error, 'Please specify A type in left<E, A>']>(
	value: LeftValueOrEither<E>
): Either<E, A> =>
	builder.flatten<E, Either<E, A>>(value).seal(
		(data): Left<E, A> => ({
			...createSerializer('left', data),
			isLeft: true,
			isRight: false,
			equals: (operand) =>
				operand.fold(
					(it) => equal(it, data),
					() => false
				),
			fold: <B>(ifLeft?: (value: E) => B) => (ifLeft ? ifLeft(data) : data),
			map: () => left(data),
			mapIf: () => left(data),
			mapLeft: (ifLeft) => left(ifLeft(data)),
			orElse: (ifLeft) => right(ifLeft(data)),
		})
	)

// TODO: add docs
export const ifElse = <E, A>(
	bool: boolean,
	ifFalse: () => LeftValueOrEither<E>,
	ifTrue: () => RightValueOrEither<A>
): Either<E, A> => (bool ? right(ifTrue()) : left(ifFalse()))
