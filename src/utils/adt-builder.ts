export interface Adt {
	__adt: true
}

export const isAdt = (input: any): input is Adt => !!input && input.__adt

export const createAdtBuilder = (prototype: Adt) => {
	const seal = <I, O>(adt: I): O => {
		return Object.freeze(Object.assign(Object.create(prototype), adt))
	}

	const hasSamePrototype = <M>(data: any): data is M => {
		try {
			return Object.getPrototypeOf(data) === prototype
		} catch (_) {
			return false
		}
	}

	return {
		flatten: <T, M>(value: T | M) => ({
			seal: <A>(factory: (data: T) => A) => (hasSamePrototype<M>(value) ? value : seal<A, M>(factory(value))),
		}),
	}
}
