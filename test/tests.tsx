import * as React from '../src/jsxrender';
import * as ReactDOMServer from '../src/jsxrender';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from '../src/jsxrender';
//import * as React from 'react';
//import * as ReactDOMServer from 'react-dom/server';

let numErrs = 0;
let logCompare = true;

const res = tests();

function tests() {
  functest();
  console.log(numErrs ? numErrs + ' FAILED' : 'All OK');
  if(numErrs === 0) perftest();
  return numErrs;
}

function perftest(iterations = 100000) {
  logCompare = false;
  const start = Date.now();
  for(let i = iterations; i > 0; --i) {
    functest(i);
  }
  const end = Date.now();
  const duration = (end - start) / 1000.0;
  const tps = (iterations / duration).toFixed();
  console.log('iterations', iterations, ' duration', duration, ' tps', tps);
}

function functest(offset = 0): void {
  functest1(offset);
  functest2(offset);
}

function compare(vnode: string|JSX.Element, html: string): void {
  const markup = ReactDOMServer.renderToStaticMarkup(vnode as string);
  const result = markup === html;
  if(!result) ++numErrs;
  if(logCompare) {
    console.log(result ? 'OK' : 'FAIL', html, result ? '' : markup);
  }
}

function functest1(offset = 0) {
  compare(<p></p>, '<p></p>');
  compare(<div/>, '<div></div>');
  compare(<a><div/></a>, '<a><div></div></a>');
  compare(<div key={1} ref='abc'/>, '<div></div>');
  compare(<span className='abc'/>, '<span class="abc"></span>');
  compare(<a href='abc'>link</a>, '<a href="abc">link</a>');
  compare(<script defer/>, '<script defer=""></script>');
  compare(<script noModule={false}/>, '<script></script>');
  compare(<a data-a='true'/>, '<a data-a="true"></a>');
  const style: any = offset ? 'z-index:1' : {zIndex:1}; // object is slow
  compare(<div style={style}/>, '<div style="z-index:1"></div>');
  compare(<><div/></>, '<div></div>');
  compare(<></>, '');
  compare(<>{null}</>, '');
  compare(<>{undefined}</>, '');
  compare(<>{false}</>, '');
  compare(<>{true}</>, '');
  compare(<>{0}</>, '0');
  compare(<>abc</>, 'abc');
  compare(<><div/><span/></>, '<div></div><span></span>');
  compare(<Details/>, '<details></details>');
  compare(<Details summary='abc'/>, '<details><summary>abc</summary></details>');
  compare(<Details>{[<span/>]}<div>abc</div></Details>, '<details><span></span><div>abc</div></details>');
  const a = { summary: 'a', abc: 2 }
  compare(<Details {...a}><Details>abc<div/></Details></Details>,
    '<details><summary>a</summary><details>abc<div></div></details></details>');
}

function Details(props: { summary?: string, children?: unknown }) {
  return (
    <details>
      {props.summary && <summary>{props.summary}</summary>}
      {props.children}
    </details>
  );
}

// generated with babel 7.9 for experimental react compiler functions
function functest2(offset = 0) {
  compare( /*#__PURE__*/_jsx("p", {}), '<p></p>');
  compare( /*#__PURE__*/_jsx("div", {}), '<div></div>');
  compare( /*#__PURE__*/_jsx("a", {
    children: /*#__PURE__*/_jsx("div", {})
  }), '<a><div></div></a>');
  compare( /*#__PURE__*/_jsx("div", {
    ref: "abc"
  }, 1), '<div></div>');
  compare( /*#__PURE__*/_jsx("span", {
    className: "abc"
  }), '<span class="abc"></span>');
  compare( /*#__PURE__*/_jsx("a", {
    href: "abc",
    children: "link"
  }), '<a href="abc">link</a>');
  compare( /*#__PURE__*/_jsx("script", {
    defer: true
  }), '<script defer=""></script>');
  compare( /*#__PURE__*/_jsx("script", {
    noModule: false
  }), '<script></script>');
  compare( /*#__PURE__*/_jsx("a", {
    "data-a": "true"
  }), '<a data-a="true"></a>');
  const style = offset ? 'z-index:1' : {
    zIndex: 1
  };
  compare( /*#__PURE__*/_jsx("div", {
    style: style
  }), '<div style="z-index:1"></div>');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: /*#__PURE__*/_jsx("div", {})
  }), '<div></div>');
  compare( /*#__PURE__*/_jsx(_Fragment, {}), '');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: null
  }), '');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: undefined
  }), '');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: false
  }), '');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: true
  }), '');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: 0
  }), '0');
  compare( /*#__PURE__*/_jsx(_Fragment, {
    children: "abc"
  }), 'abc');
  compare( /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("div", {}), /*#__PURE__*/_jsx("span", {})]
  }), '<div></div><span></span>');
  compare( /*#__PURE__*/_jsx(Details, {}), '<details></details>');
  compare( /*#__PURE__*/_jsx(Details, {
    summary: "abc"
  }), '<details><summary>abc</summary></details>');
  compare( /*#__PURE__*/_jsx(Details, {
    children: /*#__PURE__*/_jsx("div", {
      children: "abc"
    })
  }), '<details><div>abc</div></details>');
  const a = {
    summary: 'a',
    abc: 2
  };
  compare( /*#__PURE__*/_jsx(Details, { ...a,
    children: /*#__PURE__*/_jsxs(Details, {
      children: ["abc", /*#__PURE__*/_jsx("div", {})]
    })
  }), '<details><summary>a</summary><details>abc<div></div></details></details>');
}
