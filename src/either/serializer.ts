import { constant } from '../lambda/lambda'
import { Serializable, Variants } from '../types'

const isError = (data: any): data is Error => data instanceof Error || Object.getPrototypeOf(data) === Error.prototype

const stringify = (variant: Variants, serialized: string): string => `${variant}(${serialized})`

const stringifyError = (data: Error): string => `${data.name}("${data.message}")`

export const createSerializable = <T>(variant: Variants, value: T): Serializable<T> => ({
	toString: constant(() => stringify(variant, isError(value) ? stringifyError(value) : JSON.stringify(value))),
	toJSON: constant(() => {
		console.warn(`Either values should not be serialized directly to JSON. Please, consider applying "fold" first.`)
		return { variant, value }
	}),
})
