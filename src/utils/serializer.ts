import { isAdt } from "./adt-builder";

export interface Serializer {
	toJSON(): string

	toString(): string
}

const stringify = (wrapper: string, data: any) => {
	const toJson = () => (typeof data === 'undefined' ? '' : JSON.stringify(data))
	return isAdt(data) ? data.toString() : `${wrapper}(${toJson()})`
}

export const createSerializer = (wrapper: string, data: any): Serializer => ({
	toJSON: () => {
		throw new Error(`You are trying to serialize a ${stringify(wrapper, data)}. Please fold it before doing it.`)
	},
	toString: () => stringify(wrapper, data),
})
