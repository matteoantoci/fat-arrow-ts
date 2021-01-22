import equal from 'fast-deep-equal/es6/react'
import { once } from '../lambda'
import { createAdtBuilder } from '../utils/adt-builder'
import { Just, JustValueOrMaybe, Maybe, None } from './maybe.types'
import { createSerializer } from '../utils/serializer'

const builder = createAdtBuilder({})

export const just = <A>(value: NonNullable<JustValueOrMaybe<A>>): Maybe<A> =>
	builder.flatten<A, Maybe<A>>(value).seal(
		(data): Just<A> => ({
			...createSerializer('just', data),
			isJust: true,
			isNone: false,
			equals: (operand) =>
				operand.fold(
					() => false,
					(it) => equal(it, data)
				),
			fold: <B>(_?: () => B, ifJust?: (value: A) => B) => (ifJust ? ifJust(data) : data),
			map: (ifJust) => maybe(ifJust(data)),
			mapIf: (predicate, ifTrue) => (predicate(data) ? maybe(ifTrue(data)) : maybe(data)),
			orElse: () => maybe(data),
		})
	)

const VOID = (() => {
})()

export const none = once(
	<A = [Error, 'Please specify type in none']>(): Maybe<A> =>
		builder.flatten<void, Maybe<A>>(VOID).seal(
			(): None<A> => ({
				toJSON: () => null,
				toString: () => `none()`,
				isJust: false,
				isNone: true,
				equals: (operand) =>
					operand.fold(
						() => true,
						() => false
					),
				map: <B>() => none<B>(),
				mapIf: <B>() => none<B>(),
				orElse: (ifNone) => maybe(ifNone()),
				fold: <B>(ifNone?: () => B) => (ifNone ? ifNone() : VOID),
			})
		)
)

const isNonNullable = <T>(data: T): data is NonNullable<T> => {
	try {
		return !!Object.getPrototypeOf(data)
	} catch (_) {
		return false
	}
}

export const maybe = <A>(value?: JustValueOrMaybe<A> | null): Maybe<A> => (isNonNullable(value) ? just(value) : none())
