"use strict";
define("src/jsxrender", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function render(element, container) {
        container.innerHTML = renderToString(element);
    }
    exports.render = render;
    function renderToString(element) {
        const { type, props, children } = element;
        let str = '';
        if (type) {
            str += '<' + type;
            for (const name in props) {
                str += doProp(name, props[name]);
            }
            str += '>';
        }
        if (children)
            str += doChildren(children);
        if (type)
            str += '</' + type + '>';
        return str;
    }
    exports.renderToString = renderToString;
    function createElement(type, props, ...children) {
        props = props || {};
        if (typeof type === 'function') {
            props.children = children;
            return type(props);
        }
        return { type, props, children };
    }
    exports.createElement = createElement;
    const h = createElement;
    exports.h = h;
    function Fragment(props) {
        return createElement('', null, ...props.children);
    }
    exports.Fragment = Fragment;
    function doProp(name, value) {
        if (name === 'key' || name === 'ref' || value == null || value === false)
            return '';
        if (name === 'className')
            name = 'class';
        else if (name === 'forHtml')
            name = 'for';
        else if (name === 'defaultValue')
            name = 'value';
        else if (name === 'style' && typeof value === 'object') {
            value = Object.keys(value).map(key => `${key}:${value[key]};`).join('');
        }
        return ' ' + name + '="' + value + '"';
    }
    function doChildren(children) {
        let str = '';
        for (const child of children) {
            if (child == null || typeof child === 'boolean') { }
            else if (Array.isArray(child))
                str += doChildren(child);
            else if (typeof child === 'object')
                str += renderToString(child);
            else
                str += child;
        }
        return str;
    }
});
define("demo/src/view", ["require", "exports", "src/jsxrender"], function (require, exports, jsxrender_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function doRender(cmd, arg, data, elem) {
        const vnode = typeof data === 'string' ? ErrorView(data) :
            cmd === 'user' ? UserView({ user: data }) :
                cmd === 'item' ? ItemView({ item: data }) :
                    ItemsView({ items: data, cmd: cmd, page: Number.parseInt(arg) });
        jsxrender_1.render(vnode, elem);
    }
    exports.doRender = doRender;
    function ItemsView(props) {
        const prev = props.page === 1 ? jsxrender_1.h("span", { className: 'grey' }, "Prev Page") :
            jsxrender_1.h("a", { href: `/${props.cmd}/${props.page - 1}`, "data-cmd": true }, "Prev Page");
        return (jsxrender_1.h("div", null,
            jsxrender_1.h("ol", { start: (props.page - 1) * 30 + 1 }, props.items.map(item => jsxrender_1.h("li", null,
                jsxrender_1.h(ItemView, { item: item })))),
            prev,
            jsxrender_1.h("span", null,
                " | Page ",
                props.page,
                " | "),
            jsxrender_1.h("a", { href: `/${props.cmd}/${props.page + 1}`, "data-cmd": true }, "Next Page")));
    }
    function ItemView(props) {
        const i = props.item;
        const url = i.domain ? i.url : '/' + i.url.replace('?id=', '/');
        const domain = i.domain && jsxrender_1.h("span", { className: 'smallgrey' },
            "(",
            i.domain,
            ")");
        const points = i.points > 0 && jsxrender_1.h("span", null,
            i.points,
            " points");
        const user = i.user && jsxrender_1.h("span", null,
            "by ",
            jsxrender_1.h(UserNameView, { user: i.user }));
        const comments = i.comments_count > 0 &&
            jsxrender_1.h("span", null,
                "| ",
                jsxrender_1.h("a", { href: '/item/' + i.id, "data-cmd": true },
                    i.comments_count,
                    " comments"));
        return (jsxrender_1.h("div", null,
            jsxrender_1.h("a", { href: url, "data-cmd": !i.domain }, i.title),
            " ",
            domain,
            jsxrender_1.h("div", { className: 'smallgrey' },
                points,
                " ",
                user,
                " ",
                i.time_ago,
                " ",
                comments),
            jsxrender_1.h(CommentsView, { comments: i.comments })));
    }
    function CommentsView(props) {
        return (jsxrender_1.h("div", null,
            props.comments && jsxrender_1.h("p", null),
            props.comments && props.comments.map(comment => jsxrender_1.h(CommentView, { comment: comment }))));
    }
    function CommentView(props) {
        const c = props.comment;
        return (jsxrender_1.h("details", { open: true },
            jsxrender_1.h("summary", null,
                jsxrender_1.h(UserNameView, { user: c.user }),
                " ",
                c.time_ago),
            c.content,
            jsxrender_1.h(CommentsView, { comments: c.comments })));
    }
    function UserNameView(props) {
        return jsxrender_1.h("a", { className: 'bold', href: '/user/' + props.user, "data-cmd": true }, props.user);
    }
    const Y_URL = 'https://news.ycombinator.com/';
    function UserView(props) {
        const u = props.user;
        return (jsxrender_1.h("div", null,
            jsxrender_1.h("p", null,
                "user ",
                jsxrender_1.h("span", { className: 'bold large' },
                    u.id,
                    " "),
                "(",
                u.karma,
                ") created ",
                u.created),
            jsxrender_1.h("div", null, u.about),
            jsxrender_1.h("p", null,
                jsxrender_1.h("a", { href: Y_URL + 'submitted?id=' + u.id }, "submissions"),
                jsxrender_1.h("span", null, " | "),
                jsxrender_1.h("a", { href: Y_URL + 'threads?id=' + u.id }, "comments"))));
    }
    function ErrorView(err) {
        return jsxrender_1.h("div", null,
            "Error: ",
            err);
    }
});
define("demo/src/main", ["require", "exports", "demo/src/view"], function (require, exports, view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let prepath;
    main();
    function main() {
        console.log('main');
        const pathname = document.location.pathname;
        prepath = pathname.substring(0, pathname.lastIndexOf('/'));
        fetchRender(pathname);
        window.onpopstate = onPopState;
        document.body.onclick = onClick;
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('../dist/sw.js');
        }
    }
    function onPopState(e) {
        fetchRender(document.location.pathname);
    }
    function onClick(e) {
        if (e.target instanceof HTMLAnchorElement && e.target.dataset.cmd != null) {
            fetchRender(prepath + e.target.pathname, {});
            e.preventDefault();
        }
    }
    async function fetchRender(pathname, state) {
        console.log('fetchRender', pathname);
        const { cmd, arg, url } = link2cmd(pathname);
        const datap = doFetch(url);
        if (state)
            window.history.pushState(state, '', pathname);
        const elem = document.getElementsByTagName('main')[0];
        elem.firstElementChild.className = 'loading';
        //  const doRender = (await import('./view.js')).doRender;
        view_1.doRender(cmd, arg, await datap, elem);
    }
    function link2cmd(pathname) {
        const strs = pathname.substring(prepath.length).split('/');
        if (strs[1] === 'index.html')
            strs[1] = '';
        const cmd = strs[1] || 'news';
        const arg = strs[2] || '1';
        const url = 'https://node-hnapi.herokuapp.com/' + cmd +
            ((cmd === 'user' || cmd === 'item') ? '/' : '?page=') + arg;
        return { cmd, arg, url };
    }
    async function doFetch(url) {
        try {
            const resp = await fetch(url);
            if (!resp.ok)
                return resp.statusText;
            const json = await resp.json();
            return json.error ? json.error.toString() : json;
        }
        catch (err) {
            return err.toString();
        }
    }
});
// hacked fake requirejs - use AMD modules with single output file
function define(name, params, func) {
    self.myexports = self.myexports || {};
    const args = [null, self.myexports[name] = {}];
    for (let i = 2; i < params.length; ++i) {
        args[i] = self.myexports[params[i]];
    }
    func.apply(null, args);
}
