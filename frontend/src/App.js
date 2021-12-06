import NavbarComponent from "./components/navbar/NavbarComponent";
import StudentHomeView from "./views/studentHome/StudentHomeView";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LoginView from "./views/login/LoginView";

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent />
          <LoginView/>
      </div>
    </Router>
  );
}

export default App;
