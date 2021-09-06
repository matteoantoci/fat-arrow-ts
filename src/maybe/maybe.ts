import { Maybe } from '../types'
import { left, right } from '../either/either'

const isNonNullable = <T>(data: T): data is NonNullable<T> => {
	try {
		return !!Object.getPrototypeOf(data)
	} catch (_) {
		return false
	}
}

export const just = <A>(value: NonNullable<A>): Maybe<A> => right<void, A>(value)

export const none = <A>(): Maybe<A> => left<void, A>(undefined)

export const maybe = <A>(value: A): Maybe<A> => (isNonNullable(value) ? just(value) : none())
