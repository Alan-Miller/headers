CORS loosens up headers to allow across origins. Like example.org and example.com.

\* is dangerous if the server has sensitive information. If the `withCredentials` property is set to `include`, the browser console will likely deny access and give an error saying the `Access-Control-Allow-Origin` response header may not be a * if credentials are set to `include`.

Origin is
1. protocol/scheme
1. host
1. port


See request headers

requestb.in

Acts as back end
Create a RequestBin (can check Private)

See response headers
Network > XHR > Headers > [Response/Request] Headers > Name



By default same-origin requests DO send cookie. 
Try logging in with a proxy. A proxy makes treats both back end and front end like the same origin, so a cookie is sent and user information is received.

By default, cross-origin requests do NOT send cookie. CORS requests by default do not send or set cookies.
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


