import { left, rightOf } from '../either/either'
import { Either, RightValueOrEither } from '../either/either.types'

export type Result<A> = Either<Error, A>

export const tryCatch = <A>(factory: () => RightValueOrEither<A>): Result<A> => {
	try {
		return rightOf(factory())
	} catch (e: any) {
		return left<Error, A>(e)
	}
}
