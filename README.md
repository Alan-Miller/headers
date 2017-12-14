# Request/Response Headers and CORS
Resources are shared on the web when clients make requests to a server and the server responds. Requests and responses both send headers, which carry information about things like the browser, the requested page, and the server. The request headers give details about the request being made, and response headers give details about the response coming back. The client can send request headers to specify the type or format of content that is desired (e.g., JSON instead of HTML) or Spanish instead of English. Similarly, servers can send response headers to indicate which types of requests are allowed.

An origin is a tuple (ordered set) of 3 things: (1) protocol/scheme, (2) host, and (3) port. In `https://www.example.com:80`, for example, `https` is the protocol, `www.example.com` is the host, and `80` is the port. Together, they are the origin. When any one of these parts differs between the client and the server, like `http://localhost:3000` and `http://localhost:3001`, the two are said to have different origins.

---

## Requests
A request is made of the following parts:
- Head
    - Start-line (method, target URL, and version) (e.g., `POST / HTTP/1.1`)
    - One or more Headers (each a case-insensitive string followed by a value)
- Body (optional)
    - Data

### Request methods
- GET: Request to retrieve content.
- POST: Request to add new content. Typically includes a message body in the request.
- PUT: Request to edit content.
- DELETE: Request to delete content.
- HEAD: Request for the Head portion of a page. This is basically a `GET` request without any response message body.
- OPTIONS: A request for information about the communication options available.

### Format a request
<details> <summary> curl </summary>

- `GET` is the default, so you can omit the `-X GET` and just write `curl URL`.
- The `-d` option introduces data (the message body).
- The default Content-Type when sending data (`-d`) is "application/x-www-form-urlencoded". This is the format used when submitting web forms, like a contact page on a website.
- To send JSON data, use the -H (header) flag to change the Content-Type to "application/json"

```sh
# GET
curl https://requestb.in/1d27kk31

# POST
curl -X POST -d '{"name":"Ollie","age":3}' -H "Content-Type: application/json" https://requestb.in/1d27kk31

# PUT
curl -X PUT -d "name=Ollie" https://requestb.in/1d27kk31

# DELETE
curl -X DELETE -d "id=1" https://requestb.in/1d27kk31

# HEAD
curl --head -d '{"name":"Ollie","age":3}' -H "Content-Type: application/json" https://requestb.in/1d27kk31
    # -I or --head are used instead of -X HEAD
```
</details>


<details> <summary> XMLHttpRequest </summary>

```js
// GET
const xhrGET = new XMLHttpRequest();
xhrGET.open('GET', 'http://example.com/api', true);
xhrGET.onload = () => {
    const response = JSON.parse(xhrGET.response);
    // xhr.response has response which can be parsed into JSON
    // write logic here for when response comes back
};
xhrGET.send();

// POST
const xhrPOST = new XMLHttpRequest();
xhrPOST.open('POST', 'http://example.com/api', true);
xhrPOST.onload = () => {
    const response = JSON.parse(xhrPOST.response);
    // write logic here
};
xhrPOST.send({name: 'Ollie', age: 3});

// PUT
const xhrPUT = new XMLHttpRequest();
xhrPUT.open('PUT', 'http://example.com/api', true);
xhrPUT.onload = () => {
    const response = JSON.parse(xhrPUT.response);
    // write logic here
};
xhrPUT.send("name=Cole");

// DELETE
const xhrDELETE = new XMLHttpRequest();
xhrDELETE.open('DELETE', 'http://example.com/api/3', true); // params ID
xhrDELETE.onload = () => {
    const response = JSON.parse(xhrDELETE.response);
    // write logic here
};
xhrDELETE.send(null);
```

</details>

<details> <summary> fetch </summary>

- `GET` is the default, so you can omit the method and just write `fetch(url)`.
```js
fetch.get('http://example.com/api')
    .then(response => response.json()) // parse into JSON
    .then(response => {
        // write logic for when response comes back
    });
```
</details>

<details> <summary> axios </summary>

```js
// GET
axios.get('http://example.com/api')
    .then(response => {
        // write logic for when response comes back
    });

// POST
axios.post('http://example.com/api', {name: 'Ollie', age: 3})
    .then(response => {
        // write logic here
    });

// PUT
axios.put('http://example.com/api?name=Cole')
    .then(response => {
        // write logic here
    });

// DELETE
axios.delete('http://example.com/api/3') // params ID
    .then(response => {
        // write logic here
    });
```
</details>

### <span>requestb.in</span>
[requestb.in](https://requestb.in/) acts as back end, so you can practice making requests to see what headers were sent by your request.

1. Go to [requestb.in](https://requestb.in/).
1. Click `Create a RequestBin` (check `Private` if desired).
1. Copy the URL using the round green button (or by copying it from the URL bar, making sure to omit the `?inspect` query at the end).
1. The copied URL is the URL to which you will make requests using any of the normal methods for requests. [requestb.in](https://requestb.in/) will track the request data for the last 20 requests, which you can see by refreshing the web site.

---

## Responses
A response is made of the following parts:
- Head
    - Start-line (version, status code, status text) (e.g., `HTTP/1.1 404 Not Found`)
    - One or more Headers (each a case-insensitive string followed by a value)
- Body (optional)
    - Data

### Headers
Below are some common HTTP headers. For more on these and other headers, see [the docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).
- **Access-Control-Allow-Origin**: Whether the response can be shared with resources with a given origin.
    - `*`: all origins
    - `'http://example.com:3000'`: specific origin
- **Access-Control-Allow-Headers**: Used in preflight requests. Indicates which headers will be available through `Access-Control-Expose-Headers`.
- **Access-Control-Expose-Headers**: Indicates which headers can be exposed as part of the response.
- **Access-Control-Allow-Methods**: HTTP methods allowed. 'GET' and 'POST' requests can skip `Access-Control-Allow-Methods` and are not prevented.
- **Content-Security-Policy**: Scripts in the HTML body will be ignored except those coming from origins specified by Content-Security-Policy.
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

NOTE: `*` is dangerous as a value for `Access-Control-Allow-Origin` if the server has sensitive information. If the `withCredentials` property is set to `include`, the browser will likely deny access and give an error saying the `Access-Control-Allow-Origin` response header may not be a * if credentials are set to `include`.

---

## CORS
By default, there are restrictions about what can be shared through requests and responses across different origins on the web. This is where CORS comes in. CORS provides loosened headers that allow resources to be shared from one origin to another. It allows the `Same Origin Policy` to be relaxed for a domain, like example.com and example.org.

CORS adds new headers that let servers describe which origins are allowed to access that information. For request methods other than a simple `GET`, `HEAD`, or `POST`, CORS requires browsers to "preflight" the request by asking for supported methods from the server with an `OPTIONS` request method and then, if approved by the server, sending the main request with the request method. Servers can also notify clients whether credentials (like cookies) should be sent, too.

NOTE ABOUT PROXIES: A proxy can act as an alternative to using CORS. For example, if you would like to make client-side requests to a server which you do not control and whose CORS policy does not allow such client-side requests, you can make requests to your own server, which will already share a matching origin or whose CORS policy you do control, and your server in turn can make server-side requests to the other server.

### Cookies

By default, same-origin requests DO send cookies.
If your front-end code authenticates to your own server, even if the server proxies the request to another server, the same origin policy means that any authentication cookies will be sent and user information will be received.

By default, cross-origin requests do NOT send or set cookies.
Try authenticating to a different server than the one from which your JavaScript code was served. For example, you might serve JavaScript from port 3000 and authenticate to a service running on port 3001. Because the front end is on a different port than the back end, the two are not of the same origin. Without a proxy, or without the appropriate CORS policy, no cookies will be sent. You may see a 404 (Not Found) error in the console.

Interestingly, if you open an authenticated URL in a new browser tab, it may show you as authenticated, even though the cross-origin XHR request failed. This is because requests initiated by the user, (e.g., opening a new tab and entering a URL) and requests initiated by a script (e.g., an XHR request from inside JavaScript) have different security policies. By default, user-initiated requests send cookies, while script-originated requests to other origins do not send cookies.

As an example of why this is important, imagine what might happen if your bank's CORS policy was too lax, e.g. they use `'Access-Control-Allow-Origin': *` and `Access-Control-Allow-Credentials: true` on their website. One day you login to your bank to check your balance. A website in another tab of your browser has been hacked and is running malicious code. Without your knowledge, this malicious code makes a POST request to your bank, e.g., `axios.post('https://www.yourbank.com/transfer?amount=5000&to=attacker@example.com')`. Because the request came from your browser, the bank believes it's you and honors the transfer request.

As an aside, the name for one type of attack that results in a website running foreign code is "cross-site scripting" (XSS). The type of attack in which someone else initiates requests from your browser as if they were you is called "cross-site request forgery" (CSRF).

If you intend to authenticate (i.e., send cookies) to another origin, not only will you need the appropriate server-side CORS policy, you'll also need to enable the `Access-Control-Allow-Credentials` header in your client-side requests. With axios this can be done using the option `withCredentials: true` on the request object. Alternatively, you can set axios options globally to apply to all axios requests.

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

On the server, we add a configuration object to the CORS instance, specifying the front end origin and setting the `credentials` property to `true`.

```js
// server file CORS middleware
// port matches front end origin

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
```

Instead of importing `cors`, we could just write our own headers. Below are the `origin` and `credentials` headers we can use to get the same result as the `cors` options above. Below are also some other headers (commented out) that we might consider, and there are still others.

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

---

## Chrome Network tab

See response headers
`Network` > `XHR` > `Headers` > [`Response`/`Request`] `Headers` > `Name`


