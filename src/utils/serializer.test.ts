import { createSerializer } from "./serializer";

describe('Serializer', () => {
	describe('when using primitives', () => {
		const value = 2

		it('serializes to string', () => {
			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('wrapper(2)')
		})

		it('serializes to JSON', () => {
			const serializer = createSerializer('wrapper', value)

			expect(JSON.stringify(serializer)).toBe('2')
		})
	})

	describe('when using objects', () => {
		const value = { prop: 2 }

		it('serializes to string', () => {

			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('wrapper({"prop":2})')
		})

		it('serializes to JSON', () => {
			const serializer = createSerializer('wrapper', value)

			expect(JSON.stringify(serializer)).toBe('{"prop":2}')
		})
	})
})
