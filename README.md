# => Fat Arrow &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/fat-arrow-ts.svg?style=flat)](https://www.npmjs.com/package/fat-arrow-ts) ![Tests](https://github.com/matteoantoci/fat-arrow-ts/actions/workflows/tests.yml/badge.svg)

Fat Arrow is a library for Typed Functional Programming in TypeScript compatible with Node.js and all major browsers.

:warning: **Alpha release! API may change** :warning:


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

import 'fat-arrow-ts/src/jest-matchers'
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


## Docs

SOON...
