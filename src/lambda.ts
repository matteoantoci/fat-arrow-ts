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

export const repeat = <A>(factory: () => A, times: number) => Array(times).fill(null).map(factory)
