import { left, right } from '../either/either'
import { Maybe } from './maybe.types'

export const just = <A>(value: NonNullable<A>): Maybe<A> => right<void, A>(value)

export const nothing = <A>(): Maybe<A> => left<void, A>(undefined)

const isNonNullable = <T>(data: T): data is NonNullable<T> => {
	try {
		return !!Object.getPrototypeOf(data)
	} catch (_) {
		return false
	}
}

export const maybe = <A>(value: A): Maybe<A> => (isNonNullable(value) ? just(value) : nothing())
