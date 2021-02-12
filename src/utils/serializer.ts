export interface Serializer {
	toJSON(): any
	toString(): string
}

export const createSerializer = (wrapper: string, data: any): Serializer => {
	const valueOf = () => data
	return {
		toJSON: valueOf,
		toString: () => `${wrapper}('${JSON.stringify(valueOf())}')`,
	}
}
