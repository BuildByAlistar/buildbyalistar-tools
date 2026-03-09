import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import Login from "./page/Login";
import BioWriter from "./page/Tools/BioWriter";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/tools/bio-writer"
          element={
            <ProtectedRoute>
              <BioWriter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;