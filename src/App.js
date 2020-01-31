import React, { Component } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";

import Dashboard from "./containers/DashBoard/Dashboard";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Dashboard />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
