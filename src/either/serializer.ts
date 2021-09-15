import { constant } from '../lambda/lambda'
import { Serializable, Variants } from '../types'

const isError = (data: any): data is Error => data instanceof Error || Object.getPrototypeOf(data) === Error.prototype

const wrap = (variant: Variants, serialized: string): string => `${variant}(${serialized})`

const stringify = <T>(value: T) => (isError(value) ? `${value.name}("${value.message}")` : JSON.stringify(value))

export const createSerializable = <T>(variant: Variants, value: T): Serializable<T> => ({
	toString: constant(() => wrap(variant, stringify(value))),
	toJSON: constant(() => {
		console.warn(`Either values should not be serialized directly to JSON. Please, consider applying "fold" first.`)
		return { variant, value }
	}),
})
