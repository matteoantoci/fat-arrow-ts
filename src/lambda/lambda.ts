import { Maybe } from '../types'
import { maybe } from '../maybe/maybe'

type OnceParams<A extends any[], R> = (...arg: A) => R

export const constant = <A extends any[], R>(fn: OnceParams<A, R>): OnceParams<A, R> => {
	let cache: R
	return (...args: A) => {
		if (cache) {
			return cache
		} else {
			cache = fn(...args)
			return cache
		}
	}
}

const createArray = (times: number): undefined[] => Array(times).fill(undefined)

export const repeat = <T>(times: number, factory: (index: number) => T) => createArray(times).map((_, i) => factory(i))

export const rotate = <T>(n: number, arr: T[]): T[] => arr.slice(n, arr.length).concat(arr.slice(0, n))

export const chunk = <T>(size: number, arr: T[]): T[][] =>
	repeat(Math.ceil(arr.length / size), (index) => index * size).map((begin) => arr.slice(begin, begin + size))

export const noop = () => {}

export const maybeFirst = <T>(array: T[]): Maybe<T> => maybe(array[0])

export const maybeLast = <T>(array: T[]): Maybe<T> => maybe(array[array.length - 1])
