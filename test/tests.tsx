import * as React from '../src/jsxrender';
import * as ReactDOMServer from '../src/jsxrender';
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
