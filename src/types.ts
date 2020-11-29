export interface AnyEither extends Either<any, any> {}

export type RightValue<E, A> = A | Either<E, A>

export type LeftValue<E, A> = E | Either<E, A>

export interface Either<E, A> {
	isLeft: boolean
	isRight: boolean
	toString(): string
	equals(value: AnyEither): boolean
	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
	fold(): E | A
	map<B>(ifRight: (right: A) => RightValue<E, B>): Either<E, B>
	mapLeft<G>(fn: (left: E) => LeftValue<G, A>): Either<G, A>
	catch(ifLeft: (left: E) => RightValue<E, A>): Either<E, A>
	mapIf(predicate: (value: A) => boolean, ifTrue: (right: A) => RightValue<E, A>): Either<E, A>
}

export interface Maybe<A> extends Either<void, A> {}

export interface Result<A> extends Either<Error, A> {}
