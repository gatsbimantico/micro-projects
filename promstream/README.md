# PromStream.js

> An event to trigger them all

This library is just about one object, which is basically like a Promise,
but able to be `defined once, called many`.

```
var s = new PromStream();

s.then((v) => console.log(v));

s.resolve('hi'); // hi
s.resolve('hi'); // hi
```