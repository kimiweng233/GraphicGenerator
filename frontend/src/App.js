import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Help from "../src/pages/Help";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/help" exact element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
