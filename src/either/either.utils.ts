import { leftOf, rightOf } from './either'
import { Either, LeftValueOrEither, RightValueOrEither } from './either.types'

export const tryCatch = <A>(
	tryFn: () => RightValueOrEither<A>,
	catchFn: (e: any) => LeftValueOrEither<Error>
): Either<Error, A> => {
	try {
		return rightOf(tryFn())
	} catch (e: any) {
		return leftOf(catchFn(e))
	}
}
