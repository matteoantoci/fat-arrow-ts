import { left, right } from './either/either'
import { maybe } from './maybe/maybe'

describe('Integration', () => {
	it('can be chained', () => {
		const actual: string = right<string, number>(0)
			.flatMap((it) => right(it + 10))
			.flatMap((it) => right(it * 2))
			.flatMap(() => left('nooo'))
			.mapLeft(() => right(100))
			.flatMap((it) => right(it === 100 ? 'happy' : 'very sad'))
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
