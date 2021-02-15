import equal from 'fast-deep-equal/es6/react'
import { once } from '../lambda'
import { createAdtBuilder } from '../utils/adt-builder'
import { Just, Maybe, None, ValueOrMaybe } from './maybe.types'
import { createSerializer } from '../utils/serializer'
import { left, right } from '../either/either'

const builder = createAdtBuilder({ __adt: true })

export const just = <A>(value: NonNullable<ValueOrMaybe<A>>): Maybe<A> =>
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
			flatMap: (ifJust) => maybe(ifJust(data)),
			mapIf: (predicate, ifTrue) => (predicate(data) ? maybe(ifTrue(data)) : maybe(data)),
			orElse: () => maybe(data),
			toEither: () => right(data),
		})
	)

const VOID = (() => {
})()

export const none = once(
	<A = any>(): Maybe<A> =>
		builder.flatten<void, Maybe<A>>(VOID).seal(
			(): None<A> => ({
				...createSerializer('none', VOID),
				isJust: false,
				isNone: true,
				equals: (operand) =>
					operand.fold(
						() => true,
						() => false
					),
				flatMap: <B>() => none<B>(),
				mapIf: <B>() => none<B>(),
				orElse: (ifNone) => maybe(ifNone()),
				fold: <B>(ifNone?: () => B) => (ifNone ? ifNone() : null),
				toEither: (ifNone) => left(ifNone())
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

export const maybe = <A>(value: ValueOrMaybe<A>): Maybe<A> => (isNonNullable(value) ? just(value) : none())
