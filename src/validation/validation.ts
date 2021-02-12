import { Either, LeftValueOrEither, RightValueOrEither } from '../either/either.types'
import { left, right } from '../either/either'

export type Validation<E, A> = Either<E[], A>

type ValidationFailureValue<E> = LeftValueOrEither<E> | LeftValueOrEither<E[]>

type ValidationIO<A> = (data: A) => RightValueOrEither<A>

export const pass = <
	E = [Error, 'Please specify E type in pass<E, A>'],
	A = [Error, 'Please specify A type in pass<E, A>']
>(
	data: RightValueOrEither<A>
): Validation<E, A> => right(data)

export const fail = <
	E = [Error, 'Please specify E type in fail<E, A>'],
	A = [Error, 'Please specify A type in fail<E, A>']
>(
	data: ValidationFailureValue<E>
): Validation<E, A> => left<E | E[], A>(data).mapLeft((it) => (Array.isArray(it) ? it : [it]))

export const validate = <E = never, A = never>(
	data: RightValueOrEither<A>,
	validations: ValidationIO<A>[]
): Validation<E, A> => {
	const lefts = validations.reduce((acc: E[], validate) => {
		const out = pass<E, A>(data).flatMap(validate)
		return out.isLeft ? acc.concat(out.fold()) : acc
	}, [])
	return lefts.length ? fail(lefts) : pass(data)
}
