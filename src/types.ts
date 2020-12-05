export type AnyEither = Either<any, any>

export type RightValue<E, A> = A | Either<E, A>

export type LeftValue<E, A> = E | Either<E, A>

interface EitherProto<E, A> {
	toString(): string
	equals(value: AnyEither): boolean
	map<B>(ifRight: (right: A) => RightValue<E, B>): Either<E, B>
	mapLeft<G>(fn: (left: E) => LeftValue<G, A>): Either<G, A>
	catch(ifLeft: (left: E) => RightValue<E, A>): Either<E, A>
	mapIf(predicate: (value: A) => boolean, ifTrue: (right: A) => RightValue<E, A>): Either<E, A>
}

export interface Right<E, A> extends EitherProto<E, A> {
	isLeft: false
	isRight: true
	fold(): A
	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
}

export interface Left<E, A> extends EitherProto<E, A> {
	isLeft: true
	isRight: false
	fold(): E
	fold<B>(ifLeft: (left: E) => B, ifRight: (right: A) => B): B
}

export type Either<E, A> = Right<E, A> | Left<E, A>
