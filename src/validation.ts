import { Either } from './types'
import { left, right } from './either'

export type Validation<E, A> = Either<E[], A>

type ValidationSuccessValue<E, A> = A | Validation<E, A>

type ValidationFailureValue<E, A> = E | E[] | Validation<E, A>

type ValidationIO<E, A> = (data: A) => ValidationSuccessValue<E, A>

export const pass = <E = [Error, 'Please specify E type in success<E, A>'], A = never>(
	data: ValidationSuccessValue<E, A>
): Validation<E, A> => right(data)

export const fail = <E = never, A = [Error, 'Please specify A type in failure<E, A>']>(
	data: ValidationFailureValue<E, A>
): Validation<E, A> => left(data).mapLeft((it) => (Array.isArray(it) ? it : [it]))

export const validate = <E, A>(
	data: ValidationSuccessValue<E, A>,
	validations: ValidationIO<E, A>[]
): Validation<E, A> => {
	const lefts = validations.reduce((acc: E[], validate) => {
		const out = pass(data).map(validate)
		return out.isLeft ? acc.concat(out.fold()) : acc
	}, [])
	return lefts.length ? fail(lefts) : pass(data)
}
