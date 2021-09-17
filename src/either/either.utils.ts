import { leftOf, rightOf } from './either'
import { Either, Left, Right } from '../types'

export const tryCatch = <A>(
	tryFn: () => A | Either<Error, A>,
	catchFn: (e: any) => Error | Either<Error, A>
): Either<Error, A> => {
	try {
		return rightOf(tryFn())
	} catch (e: any) {
		return leftOf(catchFn(e))
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
