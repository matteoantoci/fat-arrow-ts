import { leftOf, rightOf } from './either'
import { AnyEither, Either, FlatMapArgs, Left, MapLeftArgs, Right } from '../types'

export const tryCatch = <A>(
	tryFn: () => FlatMapArgs<Error, A>,
	catchFn: (e: any) => MapLeftArgs<Error, A>
): Either<Error, A> => {
	try {
		return rightOf(tryFn())
	} catch (e: any) {
		return leftOf(catchFn(e))
	}
}

type EitherPartition = [Left<any, any>[], Right<any, any>[]]

export const partition = (array: AnyEither[]): EitherPartition => {
	const seed: EitherPartition = [[], []]
	return array.reduce((acc, item): EitherPartition => {
		const [lefts, rights] = acc
		if (item.isLeft) lefts.push(item)
		if (item.isRight) rights.push(item)
		return acc
	}, seed)
}
