import { Either, RightValueOrEither } from '../either/either.types'
import { left, right } from '../either/either'

export type Result<A> = Either<Error, A>

export const tryCatch = <A>(factory: () => RightValueOrEither<A>): Result<A> => {
	try {
		return right(factory())
	} catch (e) {
		return left(e)
	}
}
