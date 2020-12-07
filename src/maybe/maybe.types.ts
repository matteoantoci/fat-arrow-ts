export type AnyMaybe = Maybe<any>

export type JustValueOrMaybe<A> = A | Maybe<A>

interface MaybeProto<A> {
	toString(): string
	equals(value: AnyMaybe): boolean
	map<B>(ifJust: (just: A) => JustValueOrMaybe<B>): Maybe<B>
	mapIf(predicate: (just: A) => boolean, ifTrue: (just: A) => JustValueOrMaybe<A>): Maybe<A>
	orElse(ifNone: () => JustValueOrMaybe<A>): Maybe<A>
}

interface Fold<A, T> {
	fold(): T
	fold<B>(ifNone: () => B, ifJust: (just: A) => B): B
}

export interface Just<A> extends MaybeProto<A>, Fold<A, A> {
	isJust: true
	isNone: false
}

export interface None<A> extends MaybeProto<A>, Fold<A, void> {
	isJust: false
	isNone: true
}

export type Maybe<A> = Just<A> | None<A>
