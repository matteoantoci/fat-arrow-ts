import { createSerializer } from "./serializer";
import { maybe } from "../maybe/maybe";
import { right } from "../either/either";

describe('Serializer', () => {
	describe('when using primitives', () => {
		const value = 2

		it('serializes to string', () => {
			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('wrapper(2)')
		})

		it('prevents serialization', () => {
			const serializer = createSerializer('wrapper', value)

			expect(() => {
				JSON.stringify(serializer)
			}).toThrow(new Error('You are trying to serialize a wrapper(2). Please fold it before doing it.'))
		})
	})

	describe('when using objects', () => {
		const value = { prop: 2 }

		it('serializes to string', () => {

			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('wrapper({"prop":2})')
		})

		it('prevents serialization', () => {
			const serializer = createSerializer('wrapper', value)

			expect(() => {
				JSON.stringify(serializer)
			}).toThrow(new Error('You are trying to serialize a wrapper({"prop":2}). Please fold it before doing it.'))
		})
	})

	describe('when using Maybe', () => {
		const value = maybe(2)

		it('serializes to string', () => {
			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('just(2)')
		})

		it('prevents serialization', () => {
			const serializer = createSerializer('wrapper', value)

			expect(() => {
				JSON.stringify(serializer)
			}).toThrow(new Error('You are trying to serialize a just(2). Please fold it before doing it.'))
		})
	})

	describe('when using Either', () => {
		const value = right(2)

		it('serializes to string', () => {
			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('right(2)')
		})

		it('prevents serialization', () => {
			const serializer = createSerializer('wrapper', value)

			expect(() => {
				JSON.stringify(serializer)
			}).toThrow(new Error('You are trying to serialize a right(2). Please fold it before doing it.'))
		})
	})

	describe('when using undefined', () => {
		const value = undefined

		it('serializes to string', () => {
			const serializer = createSerializer('wrapper', value)

			expect(serializer.toString()).toBe('wrapper()')
		})

		it('prevents serialization', () => {
			const serializer = createSerializer('wrapper', value)

			expect(() => {
				JSON.stringify(serializer)
			}).toThrow(new Error('You are trying to serialize a wrapper(). Please fold it before doing it.'))
		})
	})
})
