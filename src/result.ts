import { Result, RightValue } from './types'
import { left, right } from './either'

export const ok = <A>(value: A | Result<A>): Result<A> => right(value)

export const error = <A = never>(value: string | Error | Result<A>): Result<A> =>
	left(typeof value === 'string' ? new Error(value) : value)

export const tryCatch = <A>(factory: () => RightValue<Error, A>): Result<A> => {
	try {
		return right(factory())
	} catch (e) {
		return left(e)
	}
}
