# CORS (Cross Origin Resources Sharing)
Resources are shared on the web when clients make requests to a server and the server responds. Both requests and responses send headers, which carry information about the browser, the requested page, the server, etc. The request headers give details about the request being made, and response headers give details about the response coming back. Response headers can be written to specify the type and format of requests that are allowed.

An origin is a tuple (ordered set) of 3 things: (1) protocol/scheme, (2) host, and (3) port. In `https://www.example.com:80`, for example `https` is the protocol, `www.example.com` is the host, and `80` is the port. Together, they are the origin. When any one of these parts differs between the client and the server, like `http://localhost:3000` and `http://localhost:3001`, the two are said to have different origins.

By default, there are restrictions about what can be shared through requests and responses across different origins on the web. This is where CORS comes in. CORS provides loosened headers that allow resources to be shared from one origin to another.

NOTE ABOUT PROXIES: A proxy can act as an alternative to using CORS. For example, if you are not able to edit the server to include CORS, a proxy can return the `Access-Control-Allow-Origin` header. Instead of making requests to a remote server, you'll make requests to your proxy, which will forward the requests to the server.

---

## Requests
A request is made of the following parts:
- Head
    - Start-line (method, target URL, and version) (e.g., `POST / HTTP/1.1`)
    - Headers (case-insensitive string followed by a value)
- Body (optional)
    - Data 

### Request methods
- GET: Request to retrieve content.
- POST: Request to add new content. Typically includes a message body in the request.
- PUT: Request to edit content.
- DELETE: Request to delete content.
- HEAD: Request for Head. Basically a `GET` request without any response message body.
- OPTIONS: A request for information about the communication options available.

### Format a request
- **curl**

    ```sh
    curl -X GET https://requestb.in/1d27kk31
    ```
    NOTE: `GET` is the default, so you can omit the `-X GET` and just write `curl URL`.
- **XMLHttpRequest**
    ```js
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://example.com/api');
    xhr.onload = () => {
        const response = JSON.parse(xhr.response); 
        // xhr.response has response which can be parsed into JSON
        // write logic here for when response comes back
    };
    xhr.send();
    ```
- **fetch**
    ```js
    fetch.get('http://example.com/api')
        .then(response => response.json()) // parse into JSON
        .then(response => {
            // write logic for when response comes back
        });
    ```
    NOTE: `GET` is the default, so you can omit the method and just write `fetch(url)`.
- **axios**
    ```js
    axios.get('http://example.com/api')
        .then(response => response.json()) // parse into JSON
        .then(response => {
        // write logic for when response comes back
        });
    ```

## [requestb.in](https://requestb.in/)

Acts as back end.

Create a RequestBin (can check Private).

--- 

## Responses


### Headers
Below are some common HTTP headers. For more on these and other headers, see [the docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).
- **Access-Control-Allow-Origin**: Whether the response can be shared with resources with a given origin.
    - `*`: all origins
    - `'http://example.com:3000'`: specific origin
- **Access-Control-Allow-Headers**: Used in preflight requests. Indicates which headers will be available through `Access-Control-Expose-Headers`.
- **Access-Control-Expose-Headers**: Indicates which headers can be exposed as part of the response.
- **Access-Control-Allow-Methods**: HTTP methods allowed. 'GET' and 'POST' requests can skip `Access-Control-Allow-Methods` and are not prevented.
- **Content-Security-Policy**: Scripts in the HTML body, will be ignored except those coming from origins specified by Content-Security-Policy.
    - `default-src`: fallback for fetch directives
    - `'self'`: scripts from own origin
    - `unsafe-eval`
    - `unsafe-inline`
- **Content-Type**: Tells the server what the content type of the returned content is.
- **X-Frame-Options**: Indicates whether a browser may render in a \<frame>, \<iframe>, or \<object>.
    - `DENY`
    - `SAMEORIGIN`
    - `ALLOW-FROM https://example.com/`
- **X-XSS-Protection**: Stops pages from loading when detecting reflected cross-site scripting attacks. When `Content-Security-Policy` disables unsafe inline JavaScript, these protections are often unnecessary in modern browsers, but might still help with older browsers that don't support CSP.

```js
app.use((req, res, next) => {
  res.set({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Credentials': true,
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'Content-Security-Policy': "default-src 'self'"
  })
  next();
});
```

curl

CORS loosens up headers to allow across origins. It allows the Same Origin Policy to be relaxed for a domain. Like example.org and example.com.

\* is dangerous if the server has sensitive information. If the `withCredentials` property is set to `include`, the browser console will likely deny access and give an error saying the `Access-Control-Allow-Origin` response header may not be a * if credentials are set to `include`.







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


