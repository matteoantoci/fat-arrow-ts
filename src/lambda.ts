type OnceParams<A extends any[], R> = (...arg: A) => R

export const once = <A extends any[], R>(fn: OnceParams<A, R>): OnceParams<A, R> => {
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

export const repeat = <T>(times: number, factory: (index: number) => T) =>
	Array(times)
		.fill(null)
		.map((_, i) => factory(i))

export const rotate = <T>(n: number, arr: T[]): T[] => arr.slice(n, arr.length).concat(arr.slice(0, n))

export const chunk = <T>(size: number, arr: T[]): T[][] =>
	Array(Math.ceil(arr.length / size))
		.fill(undefined)
		.map((_, index) => index * size)
		.map((begin) => arr.slice(begin, begin + size))
