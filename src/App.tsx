import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CommandCenter } from "./pages/CommandCenter";
import { SensorNode } from "./pages/SensorNode";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/node" element={<SensorNode />} />
      </Routes>
    </Router>
  )
}

export default App
