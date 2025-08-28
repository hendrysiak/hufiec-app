import { Buffer } from "buffer";

import React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import store from "./store/store";

// Polyfill for Buffer
(window as any).Buffer = Buffer;

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onSuccess: () => console.log("Service worker registered successfully"),
  onUpdate: (registration) => {
    console.log("New content is available; please refresh.");
    // You can show a notification to the user here
  },
});
