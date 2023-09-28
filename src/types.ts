export type Variants = 'Right' | 'Left'

export interface Serializable {
	toString(): string

	toJSON(): object
}

interface EQ<E, A> {
	equals(value: Either<E, A>): boolean
}

// type AnyNonEither = Exclude<any, Either<any, any>>

interface Chainable<E, A> {
	// map<B extends AnyNonEither = A>(ifRight: (right: A) => B): Either<E, B>

	flatMap<B = A>(ifRight: (right: A) => Left<E, A> | Right<E, B>): Either<E, B>

	mapLeft<G = E>(ifLeft: (left: E) => Left<G, A> | Right<E, A>): Either<G, A>
}

interface Foldable<E, A> {
	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B

	getOrElse(ifLeft: (left: E) => A): A
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

export type Maybe<A> = Either<void, NonNullable<A>>
