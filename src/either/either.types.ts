import { Serializer } from '../utils/serializer'
import { Maybe } from '../maybe/maybe.types'

export type RightValueOrEither<A> = A | Either<any, A>

export type LeftValueOrEither<E> = E | Either<E, any>

interface EitherProto<E, A> extends Serializer {
	equals(value: AnyEither): boolean

	flatMap<B>(ifRight: (right: A) => RightValueOrEither<B>): Either<E, B>

	mapIf(predicate: (right: A) => boolean, ifTrue: (right: A) => RightValueOrEither<A>): Either<E, A>

	mapLeft<G>(fn: (left: E) => LeftValueOrEither<G>): Either<G, A>

	orElse(ifLeft: (left: E) => RightValueOrEither<A>): Either<E, A>

	bimap<G, B>(ifLeft: (left: E) => LeftValueOrEither<G>, ifRight: (right: A) => RightValueOrEither<B>): Either<G, B>

	toMaybe(): Maybe<A>
}

interface Fold<E, A, T> {
	fold(): T

	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
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

type AnyEither = Either<any, any>
