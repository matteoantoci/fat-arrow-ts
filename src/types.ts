export type AnyEither = Either<any, any>

export type RightValueOrEither<E, A> = A | Either<E, A>

export type LeftValueOrEither<E, A> = E | Either<E, A>

interface EitherProto<E, A> {
	toString(): string

	equals(value: AnyEither): boolean

	fold(): E | A

	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B

	flatMap<B = A>(ifRight: (right: A) => RightValueOrEither<E, B>): Either<E, B>

	mapIf(predicate: (right: A) => boolean, ifTrue: (right: A) => RightValueOrEither<E, A>): Either<E, A>

	mapLeft<G = E>(fn: (left: E) => LeftValueOrEither<G, A>): Either<G, A>

	orElse(ifLeft: (left: E) => RightValueOrEither<E, A>): Either<E, A>

	bimap<G = E, B = A>(
		ifLeft: (left: E) => LeftValueOrEither<G, B>,
		ifRight: (right: A) => RightValueOrEither<G, B>
	): Either<G, B>
}

export interface Right<E, A> extends EitherProto<E, A> {
	isLeft: false
	isRight: true
}

export interface Left<E, A> extends EitherProto<E, A> {
	isLeft: true
	isRight: false
}

export type Either<E, A> = Right<E, A> | Left<E, A>

export type Maybe<A> = Either<void, A>
