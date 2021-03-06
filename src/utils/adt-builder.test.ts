import { Adt, createAdtBuilder, isAdt } from "./adt-builder";

describe('Adt builder', () => {
	const proto: Adt = { __adt: true }

	it('builds objects', () => {
		const props = { properties: true }
		const builder = createAdtBuilder(proto)

		const actual = builder.flatten(props).seal(() => props)

		expect(actual).toStrictEqual(props)
		expect(isAdt(actual)).toBe(true)
	})

	it('uses a prototype', () => {
		const props = { properties: true }
		const builder = createAdtBuilder(proto)

		const actual = builder.flatten(props).seal(() => props)

		expect(Object.getPrototypeOf(actual) === proto).toBe(true)
	})

	it('it builds immutable objects', () => {
		const props = { properties: true }
		const builder = createAdtBuilder(proto)

		const actual = builder.flatten(props).seal(() => props)

		expect(() => {
			Object.assign(actual, { foo: 'bar' })
		}).toThrow()
	})

	describe('when using nullable values', () => {
		it('flattens the input', () => {
			const props = { properties: true }
			const builder = createAdtBuilder(proto)

			const actual = builder.flatten(null).seal(() => props)

			expect(actual).toStrictEqual(props)
		})
	})

	describe('when using same prototype objects', () => {
		it('flattens the input', () => {
			const props = { properties: true }
			const builder = createAdtBuilder(proto)
			const parent = builder.flatten(props).seal(() => props)

			const actual = builder.flatten(parent).seal(() => props)

			expect(actual).toStrictEqual(props)
			expect(actual).toBe(parent)
		})
	})

	describe('when using different prototype objects', () => {
		it('flattens the input', () => {
			const props = { properties: true }
			const builder = createAdtBuilder(proto)
			const parent = builder.flatten(props).seal(() => props)

			const actual = builder.flatten(props).seal(() => props)

			expect(actual).toStrictEqual(props)
			expect(actual).not.toBe(parent)
		})
	})
})
