/*
  Simple nodejs program to serve static and dynamic demo content.
*/
export { nodejs };
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { link2cmd, renderToMarkup, mylog, updateConfig, config } from './control';

let indexHtmlStr = '';
let mainPos = 0;

function nodejs() {
  mylog('nodejs');
  updateConfig(process.argv.slice(2));
  indexHtmlStr = fs.readFileSync('public/index.html', 'utf8');
  mainPos = indexHtmlStr.indexOf('</main>');
  http.createServer(serverRequest).listen(config.port);
}

function serverRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  let url = req.url;
  mylog('serverRequest', url);
  if(!url) return;
  const pos = url.indexOf('?');
  if(pos > 0) url = url.substring(0, pos);

  // hack - should handle with nginx
  if(url.startsWith('/static/')) url = '/public' + url;
  if(url.startsWith('/public/')) {
    fs.readFile('.' + url, null, (err, data) => {
      if(err) mylog(err.message);
      res.statusCode = 200;
      res.end(data);
    });
    return;
  }
  serveNews(url, res);
}

function serveNews(path: string, res: http.ServerResponse) {
  const { cmd, arg, url } = link2cmd(path);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(indexHtmlStr.substring(0, mainPos));

  https.get(url, clientRequest)
    .on('error', err => sendResp(err.message))

  function sendResp(data: unknown) {
    res.write(renderToMarkup(cmd, arg, data));
    res.end(indexHtmlStr.substring(mainPos));
  }

  function clientRequest(res2: http.IncomingMessage) {
    if(res2.statusCode !== 200) {
      res2.resume();
      sendResp(res2.statusCode + ': ' + res2.statusMessage);
    }
    else {
      let data = '';
      res2.on('data', chunk => data += chunk);
      res2.on('end', () => {
        try {
          const json = JSON.parse(data);
          data = !json ? 'No data' : json.error ? json.error.toString() : json;
        }
        catch(err) {
          data = err.toString();
        }
        sendResp(data);
      });
    }
  }
}
