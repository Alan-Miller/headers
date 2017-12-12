## Glossary
- Head: Basically a get request without any message body (response data).
- Options: A request for information about the communication options available.
- Origin: a tuple (ordered set) including 3 things:
    1. protocol/scheme
    1. host
    1. port


## Headers
Below are some common HTTP headers. For more on these and other headers, see [the docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).
- `Access-Control-Allow-Origin`: Whether the response can be shared with resources with a given origin.
    - `*`: all origins
    - `'http://example.com:3000'`: specific origin
- `Access-Control-Allow-Headers`: Used in preflight requests. Indicates which headers will be available through `Access-Control-Expose-Headers`.
- `Access-Control-Expose-Headers`: Indicates which headers can be exposed as part of the response.
- `Access-Control-Allow-Methods`: HTTP methods allowed. 'GET' and 'POST' requests can skip `Access-Control-Allow-Methods` and are not prevented.
- `Content-Security-Policy`: Scripts in the HTML body, will be ignored except those coming from origins specified by Content-Security-Policy.
    - `default-src`: fallback for fetch directives
    - `'self'`: scripts from own origin
    - `unsafe-eval`
    - `unsafe-inline`
- `Content-Type`: Tells the server what the content type of the returned content is.
- `X-Frame-Options`: Indicates whether a browser may render in a \<frame>, \<iframe>, or \<object>.
    - `DENY`
    - `SAMEORIGIN`
    - `ALLOW-FROM https://example.com/`
- `X-XSS-Protection`: Stops pages from loading when detecting reflected cross-site scripting attacks. When `Content-Security-Policy` disables unsafe inline JavaScript, these protections are often unnecessary in modern browsers, but might still help with older browsers that don't support CSP.

curl

CORS loosens up headers to allow across origins. It allows the Same Origin Policy to be relaxed for a domain. Like example.org and example.com.

\* is dangerous if the server has sensitive information. If the `withCredentials` property is set to `include`, the browser console will likely deny access and give an error saying the `Access-Control-Allow-Origin` response header may not be a * if credentials are set to `include`.




See request headers

## [requestb.in](requestb.in)

Acts as back end.

Create a RequestBin (can check Private).

## Chrome Network tab

See response headers
Network > XHR > Headers > [Response/Request] Headers > Name



By default same-origin requests DO send cookies. 
Try logging in with a proxy. A proxy makes treats both back end and front end like the same origin, so a cookie is sent and user information is received.

By default, cross-origin requests do NOT send cookies. CORS requests by default do not send or set cookies.
Try logging in without a proxy. Because the front end is on a different port than the back end, the two are not the same origin. Without a proxy treating them like the same, no cookie is sent. You may see a 404 (Not Found) error in the console. And yet if you click the URL in the console, you may see your data in the browser. That is because the browser is not the same origin. [RICHARD]

But we can put withCredentials header in the HTTP request. axios lets us do this in a request object. Alternatively, you can set axios defaults globally to apply to all axios requests.

```js
// front end HTTP request

axios({
    method: 'GET',
    url: 'http://localhost:3001/auth/me',
    withCredentials: true
});
```
```js
// front end HTTP request

axios.defaults.withCredentials = true;

axios({
    method: 'GET',
    url: 'http://localhost:3001/auth/me',
});
```

Then in the server, we add a configuration object to the CORS instance, specifying the front end origin and setting the `credentials` property to `true`.

```js
// server file CORS middleware
// port matches front end origin

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
```

Instead of importing `cors`, we could just write our own middleware with our own headers. Below are the `origin` and `credentials` headers we can use to get the same result as the `cors` options above. Below are also some other headers (commented out) that we might consider, and there are still others.

```js
app.use((req, res, next) => {
  res.set({
    // 'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    // 'X-XSS-Protection': '1; mode=block',
    // 'Content-Security-Policy': "default-src 'self'"
  })
  next();
});
```


