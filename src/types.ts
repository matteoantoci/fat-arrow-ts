export type Variants = 'Right' | 'Left'

export interface Serializable {
	toString(): string

	toJSON(): object
}

interface EQ<E, A> {
	equals(value: Either<E, A>): boolean
}

export type FlatMapArgs<E, A, B = A> = A | B | Either<E, A> | Either<E, B>

export type MapLeftArgs<E, A, G = E> = E | G | Either<G, A> | Either<E, A>

interface Chainable<E, A> {
	flatMap<B = A>(ifRight: (right: A) => FlatMapArgs<E, A, B>): Either<E, B>

	mapLeft<G = E>(ifLeft: (left: E) => MapLeftArgs<E, A, G>): Either<G, A>

	// ap<B = A>(fn: (either: Either<E, A>) => FlatMapArgs<E, A, B>): Either<E, B>
}

interface Foldable<E, A> {
	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B

	fold(ifLeft: (left: E) => A): A

	fold(): A | E
}

interface EitherPrototype<E, A> extends Serializable, EQ<E, A>, Chainable<E, A>, Foldable<E, A> {}

export interface Right<E, A> extends EitherPrototype<E, A> {
	isLeft: false
	isRight: true
}

export interface Left<E, A> extends EitherPrototype<E, A> {
	isLeft: true
	isRight: false
}

export type Either<E, A> = Right<E, A> | Left<E, A>

export type Maybe<A> = Either<void, A>
