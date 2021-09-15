import { createSerializable } from './serializer'

describe('Serializer', () => {
	describe('when value is Number', () => {
		const serializable = createSerializable('Right', 1)

		it('serializes to string', () => {
			expect(serializable.toString()).toBe('Right(1)')
		})

		it('serializes to JSON', () => {
			expect(JSON.stringify(serializable)).toBe('{"variant":"Right","value":1}')
		})
	})

	describe('when value is Boolean', () => {
		const serializable = createSerializable('Right', true)

		it('serializes to string', () => {
			expect(serializable.toString()).toBe('Right(true)')
		})

		it('serializes to JSON', () => {
			expect(JSON.stringify(serializable)).toBe('{"variant":"Right","value":true}')
		})
	})

	describe('when value is Number', () => {
		const serializable = createSerializable('Right', 'some string')

		it('serializes to string', () => {
			expect(serializable.toString()).toBe('Right("some string")')
		})

		it('serializes to JSON', () => {
			expect(JSON.stringify(serializable)).toBe('{"variant":"Right","value":"some string"}')
		})
	})

	describe('when value is Object', () => {
		const serializable = createSerializable('Right', { foo: 'foo', bar: 'bar' })

		it('serializes to string', () => {
			expect(serializable.toString()).toBe('Right({"foo":"foo","bar":"bar"})')
		})

		it('serializes to JSON', () => {
			expect(JSON.stringify(serializable)).toBe('{"variant":"Right","value":{"foo":"foo","bar":"bar"}}')
		})
	})

	describe('when value is Error', () => {
		class CustomError extends Error {}

		const serializable = createSerializable('Right', new CustomError('error'))

		it('serializes to string', () => {
			expect(serializable.toString()).toBe('Right(Error("error"))')
		})

		it('serializes to JSON', () => {
			expect(JSON.stringify(serializable)).toBe('{"variant":"Right","value":{}}')
		})
	})
})
