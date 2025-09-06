import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home/homepage";
import WeatherDetails from "./pages/Weather Details/weatherDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/weather/:cityName" element={<WeatherDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
