export type AnyEither = Either<any, any>

export type RightValueOrEither<E, A> = A | Either<E, A>

export type LeftValueOrEither<E, A> = E | Either<E, A>

interface EitherProto<E, A> {
	toString(): string

	toJSON(): never

	equals(value: AnyEither): boolean

	flatMap<B = A>(ifRight: (right: A) => RightValueOrEither<E, B>): Either<E, B>

	mapIf(predicate: (right: A) => boolean, ifTrue: (right: A) => RightValueOrEither<E, A>): Either<E, A>

	mapLeft<G = E>(fn: (left: E) => LeftValueOrEither<G, A>): Either<G, A>

	bimap<G = E, B = A>(
		ifLeft: (left: E) => LeftValueOrEither<G, B>,
		ifRight: (right: A) => RightValueOrEither<G, B>
	): Either<G, B>
}

interface Fold<E, A, T> {
	fold(): T

	fold(ifLeft: (left: E) => A): A

	fold<B = A>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
}

export interface Right<E, A> extends EitherProto<E, A>, Fold<E, A, A> {
	isLeft: false
	isRight: true
}

export interface Left<E, A> extends EitherProto<E, A>, Fold<E, A, E> {
	isLeft: true
	isRight: false
}

export type Either<E, A> = Right<E, A> | Left<E, A>

export type Maybe<A> = Either<void, A>
