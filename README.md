# Cash for Your Home

This repository contains the static site for Cash for Your Home.

## Setup

To install dependencies, run:

```bash
npm install
```

(The previous command `npm instal` is misspelled and will fail.)
\nA modern landing page with enhanced styles and a Google Maps widget is available at `public/modern.html`.
An example demonstrating animated gradient text can be found at `public/gradient-text.html`.

## React Example

If you'd like to experiment with React on this site, install the dependencies:

```bash
npm install react react-dom
```

You can render components in the browser:

```javascript
import { createRoot } from 'react-dom/client';

function App() {
  return <div>Hello World</div>;
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

On the server you can stream markup:

```javascript
import { renderToPipeableStream } from 'react-dom/server';

function App() {
  return <div>Hello World</div>;
}

function handleRequest(res) {
  const stream = renderToPipeableStream(<App />, {
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
  });
}
```

See the React DOM documentation for more details:
- <https://react.dev/reference/react-dom>
- <https://react.dev/reference/react-dom/client>
- <https://react.dev/reference/react-dom/server>
