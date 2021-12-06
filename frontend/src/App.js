import NavbarComponent from "./components/navbar/NavbarComponent";
import StudentHomeView from "./views/studentHome/StudentHomeView";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginView from "./views/login/LoginView";
import { Link } from "react-router-dom";

function App() {
  return (
      <div className="app">
          <Routes>
              <Route path="/" element={<LoginView/>}/>
              <Route path="studentHome" element={<div><p>Test</p></div>} />
          </Routes>
          <Link to="/test">Invoices</Link>
      </div>
  );
}

export default App;
