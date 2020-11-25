/*
  Implements React.createElement and jsx
  to return string instead of JSX.Element.
*/
export { h, h as createElement, jsx, jsx as jsxs, Fragment, renderToStaticMarkup };

type Mapped = { [key: string]: unknown; };
type Props = Mapped & { children?: NodeType; };
type NodeType = NodeType[] | string | number | boolean | null | undefined;
type ElementType = string;

function h(type: string|Function, props?: Props|null, ...children: NodeType[]): ElementType {
  if(typeof type === 'string') return doElement(type, props, children);
  if(type === Fragment) return doChildren(children);
  const props2 = props || {};
  props2.children = children;
  return type(props2);
}

function jsx(type: string|Function, props: Props, key?: unknown
//    ,isStaticChildren?: boolean, source?: unknown, self?: unknown // jsxDEV
    ): ElementType {
  if(typeof type === 'string') return doElement(type, props, [props.children]);
  if(type === Fragment) return doChildren([props.children]);
  return type(props);
}

function Fragment(props: Props): ElementType {
  return doChildren([props.children]);
}

function renderToStaticMarkup(element: ElementType): string {
  return element;
}

function doElement(type: string, props: Props|null|undefined, children: NodeType[]): string {
  let str = '<' + type;
  for(const name in props) str += doProp(name, props[name]);
  return str + '>' + doChildren(children) + '</' + type + '>';
}

function doChildren(children: NodeType[]): string {
  let str = '';
  for(const child of children) {
    if(typeof child === 'string') str += child;
    else if(typeof child === 'number') str += child.toString();
    else if(typeof child === 'boolean' || child === null || child === undefined) {}
    else str += doChildren(child);
  }
  return str;
}

function doChild(child: NodeType): string {
  if(typeof child === 'string') return child;
  if(typeof child === 'number') return child.toString();
  if(typeof child === 'boolean' || child === null || child === undefined) return '';
  let str = '';
  for(const child2 of child) str += doChild(child2);
  return str;
}

function doProp(name: string, value: unknown): string {
  if(name === 'children' || name === 'key' || name === 'ref' ||
    value === null || value === undefined || value === false) return '';
  if(name === 'className') name = 'class';
  else if(name === 'forHtml') name = 'for';
  else if(name === 'defaultValue') name = 'value';
  else if(name === 'style' && typeof value === 'object') value = doStyle(<Mapped>value);
  else if(value === true) value = '';
  return ' ' + name + '="' + value + '"';
}

const styleRegex = /([A-Z])/g;

function doStyle(style: Mapped): string {
  return Object.keys(style).map(key => {
    const key2 = key.replace(styleRegex, '-$1'); // slow
    return key2.toLowerCase() + ':' + style[key];
  }).join(';');
}
