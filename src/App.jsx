import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import tools from "./data/tools";
import Login from "./page/Login";
import HomePage from "./page/HomePage";
import BioWriter from "./page/Tools/BioWriter";
import ToolRunnerPage from "./page/ToolRunnerPage";
import UpgradePage from "./page/UpgradePage";

function ToolRoute({ tool }) {
  if (!tool.enabled || tool.comingSoon) {
    return <Navigate to="/" replace />;
  }

  const content = tool.id === "bio-writer" ? <BioWriter /> : <ToolRunnerPage tool={tool} />;
  return <ProtectedRoute>{content}</ProtectedRoute>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
        {tools.map((tool) => (
          <Route key={tool.id} path={tool.route} element={<ToolRoute tool={tool} />} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
