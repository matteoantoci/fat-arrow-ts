import { Maybe } from './types'
import { left, right } from './either'
import { once } from './lambda'

const isNonNullable = <T>(data: T): data is NonNullable<T> => {
	try {
		return !!Object.getPrototypeOf(data)
	} catch (_) {
		return false
	}
}

type MaybeValue<T> = T | null | undefined | Maybe<T>

export const just = <A>(value: NonNullable<MaybeValue<A>>): Maybe<A> => right<void, A>(value)

const VOID = (() => {})()

export const none = once(<A = never>(): Maybe<A> => left<void, A>(VOID))

export const maybe = <A>(value: MaybeValue<A>): Maybe<A> => (isNonNullable(value) ? just(value) : none())