import { constant } from '../lambda/lambda'
import { Serializable, Variants } from '../types'
import { isEither } from './either'

const isError = (data: any): data is Error => data instanceof Error || Object.getPrototypeOf(data) === Error.prototype

const wrap = (variant: Variants, serialized: string): string => `${variant}(${serialized})`

const stringify = <T>(value: T): string => {
	if (isError(value)) return `${value.name}("${value.message}")`

	if (isEither(value)) {
		const variant = value.isRight ? 'Right' : 'Left'
		return wrap(variant, stringify(value.fold()))
	}

	return JSON.stringify(value)
}

const toJSON = () => {
	console.warn(`Either values can't be serialized to JSON. Please, "fold" them first.`)
	return {}
}

export const createSerializable = <T>(variant: Variants, value: T): Serializable => ({
	toString: constant(() => wrap(variant, stringify(value))),
	toJSON,
})
