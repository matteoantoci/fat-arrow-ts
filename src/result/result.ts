import { isEither, left, right } from '../either/either'
import { Either, RightValueOrEither } from '../types'

export type Result<A> = Either<Error, A>

export const tryCatch = <A>(factory: () => RightValueOrEither<A>): Result<A> => {
	try {
		const result = factory()
		return isEither(result) ? result : right(result)
	} catch (e: any) {
		return left<Error, A>(e)
	}
}
