import { createSerializable } from './serializer'

describe('Serializer', () => {
	describe('when serialized to JSON', () => {
		const serializable = createSerializable('Right', 1)

		it('prevents JSON serialization', () => {
			expect(JSON.stringify(serializable)).toBe('{}')
		})

		it('logs warning', () => {
			jest.spyOn(console, 'warn')

			JSON.stringify(serializable)

			expect(console.warn).toHaveBeenNthCalledWith(
				1,
				`Either values can't be serialized to JSON. Please, "fold" them first.`
			)
		})
	})

	describe('when value is Number', () => {
		it('serializes to string', () => {
			expect(createSerializable('Right', 1).toString()).toBe('Right(1)')
		})
	})

	describe('when value is Boolean', () => {
		it('serializes to string', () => {
			expect(createSerializable('Right', true).toString()).toBe('Right(true)')
		})
	})

	describe('when value is Number', () => {
		it('serializes to string', () => {
			expect(createSerializable('Right', 'some string').toString()).toBe('Right("some string")')
		})
	})

	describe('when value is Object', () => {
		it('serializes to string', () => {
			expect(createSerializable('Right', { foo: 'foo', bar: 'bar' }).toString()).toBe(
				'Right({"foo":"foo","bar":"bar"})'
			)
		})
	})

	describe('when value is Error', () => {
		class CustomError extends Error {}

		const serializable = createSerializable('Right', new CustomError('error'))

		it('serializes to string', () => {
			expect(serializable.toString()).toBe('Right(Error("error"))')
		})
	})
})
