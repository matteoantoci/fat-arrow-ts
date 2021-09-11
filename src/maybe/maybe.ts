import { left, right } from '../either/either'
import { Maybe } from '../types'

export const just = <A>(value: NonNullable<A>): Maybe<A> => right<void, A>(value)

export const nothing = <A>(): Maybe<A> => left<void, A>(undefined)

const isNonNullable = <T>(data: T): data is NonNullable<T> => {
	try {
		return !!Object.getPrototypeOf(data)
	} catch (_) {
		return false
	}
}

export const maybe = <A>(value: A | undefined | null): Maybe<A> => (isNonNullable(value) ? just(value) : nothing())

export const maybeFirst = <T>(array: T[]): Maybe<T> => maybe(array[0])

export const maybeLast = <T>(array: T[]): Maybe<T> => maybe(array[array.length - 1])

export const maybeFind =
	<T>(predicate: (value: T, index: number, obj: T[]) => unknown): ((array: T[], thisArg?: any) => Maybe<T>) =>
	(array, thisArg) =>
		maybe(array.find(predicate, thisArg))

export const maybeFindIndex =
	<T>(predicate: (value: T, index: number, obj: T[]) => unknown): ((array: T[], thisArg?: any) => Maybe<number>) =>
	(array, thisArg) => {
		const index = array.findIndex(predicate, thisArg)
		return index >= 0 ? just(index) : nothing()
	}
