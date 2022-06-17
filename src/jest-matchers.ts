import { diff, matcherHint } from 'jest-matcher-utils'
import { leftOf, rightOf } from './either/either'
import { nothing } from './maybe/maybe'
import { Either } from './types'

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeRight(expected: any): CustomMatcherResult

			toBeLeft(expected: any): CustomMatcherResult

			toBeNothing(): CustomMatcherResult
		}
	}
}

type AnyEither = Either<any, any>
type TestValues = { expected: AnyEither; received: AnyEither }

const getValueCheckResults = (fnName: string, values: TestValues, pass: boolean) => ({
	pass,
	message: () => {
		const matcher = `${pass ? '.not' : ''}.${fnName}`
		return [matcherHint(matcher), '', diff(values.expected.toString(), values.received.toString())].join('\n')
	},
})

const equals = (values: TestValues) => values.received.equals(values.expected)

const toBeRight = <T>(received: AnyEither, expected: T) => {
	const values: TestValues = { expected: rightOf(expected), received: rightOf(received) }
	const pass = equals(values)
	return getValueCheckResults('toBeRight', values, pass)
}

const toBeLeft = <T>(received: AnyEither, expected: T) => {
	const values: TestValues = { expected: leftOf(expected), received: leftOf(received) }
	const pass = equals(values)
	return getValueCheckResults('toBeLeft', values, pass)
}

const toBeNothing = (received: AnyEither) => {
	const values: TestValues = { expected: nothing(), received: leftOf(received) }
	const pass = equals(values)
	return getValueCheckResults('toBeNothing', values, pass)
}

expect.extend({
	toBeRight,
	toBeLeft,
	toBeNothing,
})
