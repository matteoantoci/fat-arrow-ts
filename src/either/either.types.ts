import { Maybe } from '../maybe/maybe.types'

export type AnyEither = Either<any, any>

export type RightValueOrEither<A> = A | Either<any, A>

export type LeftValueOrEither<E> = E | Either<E, any>

interface EitherProto<E, A> {
	toString(): string

	equals(value: AnyEither): boolean

	of<B>(value: RightValueOrEither<B>): Either<E, B>

	fold(): E | A

	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B

	flatMap<B>(ifRight: (right: A) => RightValueOrEither<B>): Either<E, B>

	mapIf(predicate: (right: A) => boolean, ifTrue: (right: A) => RightValueOrEither<A>): Either<E, A>

	mapLeft<G>(fn: (left: E) => LeftValueOrEither<G>): Either<G, A>

	orElse(ifLeft: (left: E) => RightValueOrEither<A>): Either<E, A>

	bimap<G, B>(ifLeft: (left: E) => LeftValueOrEither<G>, ifRight: (right: A) => RightValueOrEither<B>): Either<G, B>

	toMaybe(): Maybe<A>
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
