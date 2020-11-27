import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { left, right } from './either'

type AdtMock = {
	isRight: boolean
	isLeft: boolean
	equals: (value: any) => boolean
	fold: () => any
}

declare global {
	namespace jest {
		interface Matchers<R> {
			toBeRight(expected: any): CustomMatcherResult

			toBeLeft(expected: any): CustomMatcherResult

			toHaveBeenLastCalledWithRight(expected: any): CustomMatcherResult

			toHaveBeenLastCalledWithLeft(expected: any): CustomMatcherResult
		}
	}
}

type TestValues = { expected: AdtMock; received: AdtMock, side: 'left' | 'right' }

const getLastCallArgument = (mock: jest.Mock) => {
	const lastCall = mock.mock.calls[mock.mock.calls.length - 1]
	return lastCall ? lastCall[0] : undefined
}

const getReportHeader = (fnName: string, pass: boolean) => `${matcherHint(
	`${pass ? '.not' : ''}.${fnName}`,
	'received',
	'expected'
)}
`

const getExpectedMessage = (values: TestValues) => printExpected(`${values.side}(${values.received.fold()})`)

const getReceivedMessage = (values: TestValues) => `Received: ${printReceived(values.received.toString())}`

const getExpectedValueMessage = (pass: boolean, values: TestValues) =>
	`Expected value${pass ? ' not ' : ' '}to be: ${getExpectedMessage(values)}`

const getExpectedSpyMessage = (pass: boolean, values: TestValues) =>
	`Expected spy${pass ? ' not ' : ' '}to have been last called with: ${getExpectedMessage(values)}`

const getValueCheckResults = (fnName: string, values: TestValues, pass: boolean) => ({
	pass,
	message: () => `${getReportHeader(fnName, pass)}
${getExpectedValueMessage(pass, values)}
${getReceivedMessage(values)}`,
})

const getSpyCheckResults = (fnName: string, values: TestValues, pass: boolean) => ({
	pass,
	message: () => `${getReportHeader(fnName, pass)}
${getExpectedSpyMessage(pass, values)}
${getReceivedMessage(values)}`,
})

const isRight = (values: TestValues) => values.received.isRight && values.received.equals(values.expected)

const isLeft = (values: TestValues) => values.received.isLeft && values.received.equals(values.expected)

expect.extend({
	toBeRight: <T>(received: AdtMock, expected: T) => {
		const values: TestValues = { expected: right(expected), received: right(received), side: 'right' }
		const pass = isRight(values)
		return getValueCheckResults('toBeRight', values, pass)
	},
	toBeLeft: <T>(received: AdtMock, expected: T) => {
		const values: TestValues = { expected: left(expected), received: left(received), side: 'left' }
		const pass = isLeft(values)
		return getValueCheckResults('toBeLeft', values, pass)
	},
	toHaveBeenLastCalledWithRight: <T>(received: jest.Mock, expected: T) => {
		const values: TestValues = { expected: right(expected), received: right(getLastCallArgument(received)), side: 'right' }
		const pass = isRight(values)
		return getSpyCheckResults('toHaveBeenLastCalledWithRight', values, pass)
	},
	toHaveBeenLastCalledWithLeft: <T>(received: jest.Mock, expected: T) => {
		const values: TestValues = { expected: left(expected), received: left(getLastCallArgument(received)), side: 'left' }
		const pass = isLeft(values)
		return getSpyCheckResults('toHaveBeenLastCalledWithLeft', values, pass)
	},
})
