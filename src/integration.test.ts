import { left, right } from './either/either'
import { maybe } from './maybe/maybe'

describe('Integration', () => {
	it('can be chained', () => {
		const actual = right<string, number>(0)
			.flatMap((it) => it + 10)
			.flatMap((it) => it * 2)
			.flatMap(() => left<string, number>('nooo'))
			.mapLeft(() => right<Error, number>(100))
			.flatMap((it) => (it === 100 ? right<Error, string>('happy') : left<Error, string>(new Error())))
			.fold(
				() => 'very sad',
				(it) => it
			)

		expect(actual).toBe('happy')
	})

	it('can be nested', () => {
		const actual = maybe(right<string, number>(0))

		expect(actual.equals(actual)).toBe(true)
		expect(actual.fold()).toBeRight(0)
	})
})
