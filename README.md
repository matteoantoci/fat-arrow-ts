# => Fat Arrow &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/fat-arrow-ts.svg?style=flat)](https://www.npmjs.com/package/fat-arrow-ts) ![Tests status](https://github.com/matteoantoci/fat-arrow-ts/actions/workflows/tests.yml/badge.svg)

Fat Arrow is a library for Typed Functional Programming in TypeScript compatible with Node.js and all major browsers.

:warning: **Alpha release! API may change** :warning:


- [Installation](#installation)
	+ [Setup Jest matchers](#setup-jest-matchers)
- [Quick start](#quick-start)
- [Essentials](#essentials)
	* [Either](#either)
		+ [`right`](#right)
		+ [`left`](#left)
		+ [Either API](#either-api)
		+ [Either Jest matchers](#either-jest-matchers)
            + [`toBeRight`](#toberight)
            + [`toBeLeft`](#tobeleft)
            + [`toHaveBeenLastCalledWithRight`](#tohavebeenlastcalledwithright)
            + [`toHaveBeenLastCalledWithLeft`](#tohavebeenlastcalledwithleft)
	* [Maybe](#maybe)
		+ [`maybe`](#maybe)
		+ [`just`](#just)
		+ [`none`](#none)
	* [Result](#result)
		+ [`tryCatch`](#trycatch)
- [Examples](#examples)



## Installation

```bash  
npm install fat-arrow-ts   
```



#### Setup Jest matchers

Be sure to have a reference to a setup file in your `jest.config.ts`

```ts
// In jest.config.ts

export default {
	setupFilesAfterEnv: [
	  './setupTests.ts'
	],
}
```


Include this in your setup file

```ts
// In setupTests.ts

import 'fat-arrow-ts/jest-matchers'
```


## Quick start

```ts  
import { left, right, Either } from 'fat-arrow-ts';  
  
const getDivision = (numerator: number, denominator: number): Either<Error, number> => {  
    if (denominator === 0) {  
        return left(new Error('Division by zero!'))  
    }  
  
    return right(numerator / denominator)
}
  
const addTwo = (number: number) => number + 2  
  
const print = (value: Either<Error, number>) =>  
    value.fold(  
        (error) => console.error('Doh!', error.message),  
        (result) => console.log(`Result is ${result}. Hooray!`)  
    )  
  
print(getDivision(10, 0).flatMap(addTwo)) // Doh! Division by zero!  
print(getDivision(10, 5).flatMap(addTwo)) // Result is 4. Hooray!  
```


## Essentials


### Either

An `Either<E, A>` value may contain either a value of type `E` or a value of type `A`, at any given time. In other words, it could be in *left* state or *right* state.

#### `right`

Takes a value in input and creates an `Either<E, A>` object with _right_ state.

```ts  
import { right } from 'fat-arrow-ts';  
  
const myValue = right<Error, number>(5)  
  
console.log(myValue.fold()) // 5  
  
// Flattening  
console.log(left(myValue).isRight) // true  
console.log(right(myValue).equals(myValue)) // true  
```


#### `left`

Takes a value in input and creates an `Either<E, A>` object with _left_ state.

```ts  
import { left } from 'fat-arrow-ts';  
  
const myValue = left<Error, number>(new Error('Ouch!'))  
  
console.log(myValue.fold()) // Error  
  
// Flattening  
console.log(left(myValue).equals(myValue)) // true  
console.log(right(myValue).isLeft) // true  
```


#### Either API

Let's go through all `Either<E, A>` properties and methods



##### `isRight`

States if `Either<E, A>` is in _right_ state.

```ts
import { right } from 'fat-arrow-ts';  
  
const myValue = right<Error, number>(5)  
  
console.log(myValue.isRight) // true 
```



##### `isLeft`

States if `Either<E, A>` is in _left_ state.

```ts
import { left } from 'fat-arrow-ts';  
  
const myValue = left<Error, number>(new Error('Ouch!'))  
  
console.log(myValue.isLeft) // true 
```



##### `equals`

Takes an `Either<any, any>` in input and asserts if the passed value has the same state and **structural equality**.

```ts
import { right, left } from 'fat-arrow-ts';  
  
const aRightValue = right<object, object>({ foo: 'foo' })
console.log(aRightValue.equals(aRightValue)) // true

const anotherRightValue = right<object, object>({ bar: 'bar' })
console.log(anotherRightValue.equals(aRightValue)) // false

const aLeftValueWithSameContents = left<object, object>({ foo: 'foo' })
console.log(aLeftValueWithSameContents.equals(aRightValue)) // false

// Deep comparison
console.log(aRightValue.equals(right({ foo: 'foo' }))) // true
```



##### `fold`

It lets you handle or unwrap the raw value in your data type instances.

It comes with two overloaded call signatures
* `() => E | A`: will return the value as it is
* `(ifLeft: (left: E) => B, ifRight: (right: A) => B) => B`: will accept two callbacks that will let you trigger side effects or map the value before returning it.

```ts
import { right, left } from 'fat-arrow-ts';  
  
const aRightValue = right<Error, number>(5)

console.log(myValue.fold()) // 5

// Mapping values
const aLeftValue = left<Error, number>(new Error('Ouch!'))

console.log(aLeftValue.fold(e => 0, it => it)) // 0

// Triggering side effects
aLeftValue.fold(
  e => {
    // Only the left callback will be applied to the value
    console.error(e) // Error
  }, 
  it => {
    console.log(it)
  }
)
```



##### `flatMap`

Takes a callback of type `(value: A) => B | Either<E, B>` and applies it to the _right_ value of your type class instances.

By default `flatMap` method will try to convert the returned value to an `Either<E, B>` _right_ state so that you can also produce raw values from your callback.

Returning a _left_ value, you can switch to a _left_ state.

If you are used to ES Promises you may find similarities with the `.then()` method.

```ts
import { right, left } from 'fat-arrow-ts'; 
  
const myValue = right<Error, number>(5)
 
const rightResult: Either<Error, number> = myValue.flatMap(
  it => it + 5
)

console.log(rightResult.isRight) // true 
console.log(rightResult.fold()) // 5

// Will be flattened
const sameTypeResult: Either<Error, number> = myValue.flatMap(
  it => right(it + 5)
)

console.log(sameTypeResult.isRight) // true 
console.log(sameTypeResult.fold()) // 5

// You can return right values with a different type
const anotherTypeRightResult: Either<Error, string> = myValue.flatMap(
  it => right('foo')
)

console.log(anotherTypeRightResult.isRight) // true 
console.log(anotherTypeRightResult.fold()) // 'foo'

// Will be flattened to a Either<Error, number> with left state
const leftResult: Either<Error, number> = myValue.flatMap(
  it => left<Error, number>(new Error())
) 

console.log(leftResult.isLeft) // true 
console.log(leftResult.fold()) // Error
```



##### `mapIf`

Works very similar to `flatMap` but it also accepts a _predicate_ `(value: A) => boolean` as first parameter.

It will map your type class instances only if the predicate returns `true`.

```ts
import { right, left } from 'fat-arrow-ts'; 

const isFizzBuzz = (it: number) => it % 15 === 0
const isFizz = (it: number) => it % 3 === 0
const isBuzz = (it: number) => it % 5 === 0

const fizzBuzz = (i: number) =>
	right<string, number>(i)
		.mapIf(isFizzBuzz, () => left('FizzBuzz'))
		.mapIf(isFizz, () => left('Fizz'))
		.mapIf(isBuzz, () => left('Buzz'))
		.fold()

console.log(fizzBuzz(3)) // Fizz
console.log(fizzBuzz(5)) // Buzz
console.log(fizzBuzz(15)) // FizzBuzz
console.log(fizzBuzz(2)) // 2
```



##### `mapLeft`

Similar to `flatMap`, it will let you apply callbacks of type `(value: E) => G | Either<G, A>` to the _left_ value of your type class instances.

By default `mapLeft` method will try to convert the returned value to an `Either<G, A>` _left_ state so that you can also produce raw values from your callback.

Returning a _right_ value, you can switch your type class instances to a _right_ state.

```ts
import { right, left } from 'fat-arrow-ts';
  
const myValue = left<Error, number>(new Error('Ouch!'))
 
const leftResult: Either<Error, number> = myValue.mapLeft(
  it => new Error(`Error was ${it.message}`)
)

console.log(leftResult.isLeft) // true 
console.log(leftResult.fold()) // Error

// Will be flattened
const sameTypeLeftResult: Either<Error, number> = myValue.mapLeft(
  it => left(new Error(`Error was ${it.message}`))
)

console.log(sameTypeLeftResult.isLeft) // true 
console.log(sameTypeLeftResult.fold()) // Error

// You can return left values with a different type
const anotherTypeLeftResult: Either<string, number> = myValue.mapLeft(
  it => left('foo')
)

console.log(anotherTypeLeftResult.isLeft) // true 
console.log(anotherTypeLeftResult.fold()) // 'foo'

// Will be flattened to a Either<Error, number> with right state
const rightResult: Either<Error, number> = myValue.mapLeft(
  it => right(5)
)

console.log(rightResult.isRight) // true 
console.log(rightResult.fold()) // 5
```



##### `orElse`

It takes a callback of type `(value: E) => A | Either<E, A>` and applies it to the _left_ value of your type class instances. 

The main difference with `mapLeft` is that it will try to convert the mapped value to a _right_ state. A useful tool to recover from errors.

If you are used to ES Promises you may find similarities with the `.catch()` method.


```ts
import { Either } from 'fat-arrow-ts'; 

const getUserInput = (): Either<Error, string> => {
  //...
}

const userInput = getUserInput()

const recovered = userInput.orElse(e => {
  console.error(e) // Error
  return 'Who cares!'
})

console.log(recovered.isRight) // true
console.log(recovered.fold()) // 'Who cares!'
```


##### `bimap`

TBD...


##### `toMaybe`

TBD...


#### Either Jest matchers

See [Setup Jest matchers](#setup-jest-matchers) for installation instructions.



##### toBeRight

Asserts if `expected` is _right_ and has the expected value. It accepts both raw values and data type instances.

```ts
import { right } from 'fat-arrow-ts'
 
it('is right', () => {
    const actual = right<Error, number>(5)

    expect(actual).toBeRight(5);
})
```



##### toBeLeft

Asserts if `expected` is _left_ and has the expected value. It accepts both raw values and data type instances.

```ts
import { left } from 'fat-arrow-ts'
 
it('is left', () => {
    const actual = left<Error, number>(new Error())

    expect(actual).toBeLeft(new Error());
})
```



##### toHaveBeenLastCalledWithRight

Asserts if a `jest.Mock` has been called last time with the expected _right_ value

```ts
it('is called with right', () => {
    const spy = jest.fn()

    runYourCode(spy)

    expect(spy).toHaveBeenLastCalledWithRight('expected right value');
})
```



##### toHaveBeenLastCalledWithLeft

Asserts if a `jest.Mock` has been called last time with the expected _left_ value

```ts
it('is called with left', () => {
    const spy = jest.fn()

    runYourCode(spy)

    expect(spy).toHaveBeenLastCalledWithLeft('expected left value');
})
```

### Maybe

An `Maybe<A>` value is useful to model nullable values.


#### `maybe`

Takes a value in input and creates a `Maybe<A>` object.
* if the input value is non-nullable the produced object will have _just_ state.
* if the input value is nullable (`null | undefined`) the produced object will have _none_ state;

```ts  
import { Maybe, maybe } from 'fat-arrow-ts';  
  
const myMap = new Map([  
    ['key1', 'value1'],  
    ['key2', 'value2'],  
])  
  
const getValue = (key: string): Maybe<string> => maybe(myMap.get(key))

//-- If value is "just" --//

const existing = getValue('key1')  
  
console.log(existing.fold()) // 'value1'  
console.log(existing.isJust) // true  
  
// Flattening  
console.log(maybe(existing).equals(existing)) // true  
console.log(maybe(existing).isJust) // true  

//-- If value is "none" --//
  
const missing = getValue('foo')  
  
console.log(missing.fold()) // undefined  
console.log(missing.isNone) // true  
  
// Flattening  
console.log(maybe(missing).equals(missing)) // true  
console.log(maybe(missing).isNone) // true  
```


#### `just`

Takes a non-nullable value in input and creates a `Maybe<A>` object with _just_ state.

```ts  
import { just, none, maybe } from 'fat-arrow-ts';  
  
const myValue = just(5)  
  
console.log(myValue.fold()) // 5  
console.log(myValue.isJust) // true  
  
// Flattening  
console.log(maybe(myValue).equals(myValue)) // true  
console.log(just(myValue).equals(myValue)) // true  
```


#### `none`

Creates a `Maybe<A>` object with _none_ state.

```ts  
import { just, none, maybe } from 'fat-arrow-ts';  
  
const myValue = none()  
  
console.log(myValue.fold()) // null 
console.log(myValue.isLeft) // true
console.log(myValue === none()) // true
  
// Flattening  
console.log(maybe(myValue).equals(myValue)) // true  
console.log(just(myValue).equals(myValue)) // true  
```


##### toBeJust

Asserts if `expected` is _just_ and has the expected value. It accepts both raw values and data type instances.

```ts
import { just } from 'fat-arrow-ts'
 
it('is just', () => {
    const actual = maybe(5) // or just(5)

    expect(actual).toBeJust(5);
})
```



##### toBeNone

Asserts if `expected` is _none_.

```ts
import { none } from 'fat-arrow-ts'
 
it('is none', () => {
    const actual = none()

    expect(actual).toBeNone();
})
```



##### toHaveBeenLastCalledWithJust

Asserts if a `jest.Mock` has been called last time with the expected _just_ value

```ts
it('is called with just', () => {
    const spy = jest.fn()

    runYourCode(spy)

    expect(spy).toHaveBeenLastCalledWithJust('expected just value');
})
```



##### toHaveBeenLastCalledWithNone

Asserts if a `jest.Mock` has been called last time with a _none_ value

```ts
it('is called with none', () => {
    const spy = jest.fn()

    runYourCode(spy)

    expect(spy).toHaveBeenLastCalledWithNone();
})
```

### Result

A `Result<A>` is a type alias for `Either<Error, A>`.


#### `tryCatch`

It takes a callback `() => A | Result<A>` in input that will be run safely and returns a `Result<A>` instance.
* if the callback runs correctly the result of the callback will be returned as a `Result<A>` with _right_ state.
* if the callback throws an error, the `Error` will be returned as a `Result<A>` with _left_ state.

```ts  
import { tryCatch, Result } from 'fat-arrow-ts';

const getFullName = (name: string, surname: string): string => {
    if (name.length < 1 || name.surname < 1) {
        throw new Error()
    }
    return `${name} ${surname}` 
}

//-- If callback runs correctly --//

const result: Result<string> = tryCatch(() => getFullName('John', 'Doe'))

const myValue = result.flatMap((it) => it.toUpperCase())
  
console.log(myValue.fold()) // JOHN DOE
console.log(myValue.isRight) // true
  
//-- If callback throws --//

const safeResult: Result<string> = tryCatch(() => getFullName('', ''))

const mySafeValue = safeResult.flatMap((it) => it.toUpperCase())
  
console.log(mySafeValue.fold()) // Error
console.log(mySafeValue.isLeft) // true  
```


## Examples

* [Game of life](examples/game-of-life/game-of-life.ts)
* [Tennis game](examples/tennis-game/game.ts)
