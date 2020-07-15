import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import CatchyPass from "./components/CatchyPass";
import Header from "./components/Header";
import About from "./components/About";
import Tutorial from "./components/Tutorial";
import "./sass/bulmastyles.scss";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Route exact={true} path="/" component={CatchyPass} />
        <Route exact={true} path="/about" component={About} />
        <Route exact={true} path="/tutorial" component={Tutorial} />
      </BrowserRouter>
    </div>
  );
}

export default App;
