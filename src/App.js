import React, { Component } from "react";
import "./App.css";
import StandardView from "./containers/StandardView/StandardView";
import Dashboard from "./containers/DashBoard/Dashboard";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Dashboard />
      </div>
    );
  }
}

export default App;
