import AdminRouter from "./routes/AdminRouter"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserRouter from "./routes/UserRouter";


function App() {

  return (
    <Router>
        <Routes>
        <Route path="/admin*" element={<AdminRouter/>}/>
        <Route path="/*" element={<UserRouter/>}/>
        </Routes>
    </Router>
  )
}

export default App
