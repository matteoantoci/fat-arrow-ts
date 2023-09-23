import { left, right } from '../either/either'
import { Maybe } from '../types'

export const just = <A>(value: NonNullable<A>): Maybe<A> => right(value)

export const nothing = <A = unknown>(): Maybe<A> => left<void, NonNullable<A>>(undefined)

const isNonNullable = <T>(data: T): data is NonNullable<T> => {
	try {
		return !!Object.getPrototypeOf(data)
	} catch (_) {
		return false
	}
}

export const maybe = <A>(value: A | undefined | null): Maybe<A> => (isNonNullable(value) ? just(value) : nothing())
