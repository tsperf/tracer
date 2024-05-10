export const bob = 2
console.log('hi')

type Trim<T extends `${string}`> = T extends `${infer A} ` ? Trim<A> : T

type C = Trim<'bob '> // 'bob'
