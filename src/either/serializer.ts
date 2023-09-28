import { Serializable, Variants } from '../types'
import { isEither } from './either'

const isError = (data: any): data is Error => {
	if (data instanceof Error) return true
	try {
		return Object.getPrototypeOf(data) === Error.prototype
	} catch (_) {
		return false
	}
}

const wrap = (variant: Variants, serialized: string): string => `${variant}(${serialized})`

const stringify = <T>(value: T): string => {
	if (isError(value)) return `${value.name}("${value.message}")`

	if (isEither(value)) {
		const variant = value.isRight ? 'Right' : 'Left'
		return wrap(
			variant,
			value.fold(() => '', stringify)
		)
	}

	return JSON.stringify(value)
}

const toJSON = () => {
	console.warn(`Either values can't be serialized to JSON. Please, "fold" them first.`)
	return {}
}

export const createSerializable = <T>(variant: Variants, value: T): Serializable => ({
	toString: () => wrap(variant, stringify(value)),
	toJSON,
})
