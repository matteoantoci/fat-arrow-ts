export type AnyEither = Either<any, any>

export type RightValueOrEither<E, A> = A | Either<E, A>

export type LeftValueOrEither<E, A> = E | Either<E, A>

interface Serializable {
	toString(): string

	toJSON(): never
}

interface EQ {
	equals(value: AnyEither): boolean
}

interface Chainable<E, A> {
	flatMap<B = A>(ifRight: (right: A) => RightValueOrEither<E, B>): Either<E, B>

	mapLeft<G = E>(ifLeft: (left: E) => LeftValueOrEither<G, A>): Either<G, A>
}

interface Foldable<E, A, T> {
	fold(): T

	fold(ifLeft: (left: E) => A): A

	fold<B = A>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
}

interface EitherPrototype<E, A, T> extends Serializable, EQ, Chainable<E, A>, Foldable<E, A, T> {}

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
