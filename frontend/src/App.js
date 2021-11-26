import NavbarComponent from "./components/navbar/NavbarComponent";
import StudentHomeView from "./views/studentHome/StudentHomeView";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <NavbarComponent />
        <StudentHomeView />
      </div>
    </Router>
  );
}

export default App;
