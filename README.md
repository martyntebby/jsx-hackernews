JSX Render
----------
A stateless subset of React that just handles rendering.
No state management, change tracking nor event handlers.

It is small (~100 loc), designed for fast initial page load,
and also for server side rendering using isomorphic code.

It is written in typescript and useable with the React @type files
(see package.json).
The generated file out/jsxrender.js can be used with regular javascript.

Build
-----
npm install

npm run build

npm test

Hacker News Demo
----------------
A simple Hacker News demo app using jsxrender.

[jsxdemo](https://github.com/martyntebby/jsxdemo)

Try it
------
[westinca.com](https://jsxdemo.westinca.com/public/)
