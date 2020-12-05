import { Either } from './types'
import { left, right } from './either'

export type Validation<E, A> = Either<E[], A>

type ValidationSuccessValue<E, A> = A | Validation<E, A>

type ValidationFailureValue<E, A> = E | E[] | Validation<E, A>

type ValidationIO<E, A> = (data: A) => ValidationSuccessValue<E, A>

export const success = <E = never, A = never>(data: ValidationSuccessValue<E, A>): Validation<E, A> => right(data)

export const failure = <E = never, A = never>(data: ValidationFailureValue<E, A>): Validation<E, A> =>
	left(data).mapLeft((it) => (Array.isArray(it) ? it : [it]))

export const validate = <E, A>(
	data: ValidationSuccessValue<E, A>,
	validations: ValidationIO<E, A>[]
): Validation<E, A> => {
	const lefts = validations.reduce((acc: E[], validate) => {
		const out = success(data).map(validate)
		return out.isLeft ? acc.concat(out.fold()) : acc
	}, [])
	return lefts.length ? failure(lefts) : success(data)
}
