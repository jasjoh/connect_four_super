import { BrowserRouter } from "react-router-dom";
import "./App.css";

import RoutesList from "./RoutesList.js";
import NavBar from "./NavBar.js";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <RoutesList />
      </div>
    </BrowserRouter>
  );
}

export default App;
