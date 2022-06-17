import { left, right } from './either'
import { Either, Left, Right } from '../types'

export const tryCatch = <A>(tryFn: () => A): Either<unknown, A> => {
	try {
		return right(tryFn())
	} catch (e) {
		return left(e)
	}
}

type EitherPartition<E, A> = [Left<E, A>[], Right<E, A>[]]

export const partition = <E, A>(array: Either<E, A>[]): EitherPartition<E, A> => {
	const seed: EitherPartition<E, A> = [[], []]
	return array.reduce((acc, item): EitherPartition<E, A> => {
		const [lefts, rights] = acc
		if (item.isLeft) lefts.push(item)
		if (item.isRight) rights.push(item)
		return acc
	}, seed)
}
