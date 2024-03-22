import { BrowserRouter } from "react-router-dom";
import RoutesList from "./RoutesList.js";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <RoutesList />
      </div>
    </BrowserRouter>
  );
}

export default App;
