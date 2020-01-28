import React, { Component } from "react";
import "./App.css";
import StandardView from "./containers/StandardView/StandardView";

class App extends Component {
  render() {
    return (
      <div className="App">
        <StandardView />
      </div>
    );
  }
}

export default App;
