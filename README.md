# Pseudodo
Polyfill for animatable content properties on pseudo elements in non-supportive browsers (eg. Safari).

# Why?

Safari doesn't support animatable psuedo elements just yet, this package remedies this with a sneaky polyfill. Just dump it in and your pseudo elements animated by your CSS should get going across platforms.

I use this on my personal site, to animate the dancing bars on the [RTL Watch square](https://ericdaddio.co.uk) for Safari.

_Why not just use a gif?_ That's far less fun.

# Usage

This is an npm package, download & require it like you normally would anything else. The package exports a listener to the DOM to get going once its safe to.

```
npm install pseudodo
```
```
require('pseudodo')
```

# Contributors

This was built from a gist so its pretty rough, if you can improve it please contribute away!
