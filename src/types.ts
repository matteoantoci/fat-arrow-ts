export type AnyEither = Either<any, any>

interface Serializable {
	toString(): string

	toJSON(): never
}

interface EQ<E, A> {
	equals(value: Either<E, A>): boolean
}

export type FlatMapArgs<E, A, B = A> = A | B | Either<E, A> | Either<E, B>

export type MapLeftArgs<E, A, G = E> = E | G | Either<G, A> | Either<E, A>

interface Chainable<E, A> {
	flatMap<B = A>(ifRight: (right: A) => FlatMapArgs<E, A, B>): Either<E, B>

	mapLeft<G = E>(ifLeft: (left: E) => MapLeftArgs<E, A, G>): Either<G, A>
}

interface Foldable<E, A, T> {
	fold(): T

	fold(ifLeft: (left: E) => A): A

	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
}

interface EitherPrototype<E, A, T> extends Serializable, EQ<E, A>, Chainable<E, A>, Foldable<E, A, T> {}

export interface Right<E, A> extends EitherPrototype<E, A, A> {
	isLeft: false
	isRight: true
}

export interface Left<E, A> extends EitherPrototype<E, A, E> {
	isLeft: true
	isRight: false
}

export type Either<E, A> = Right<E, A> | Left<E, A>

export type Maybe<A> = Either<void, A>
