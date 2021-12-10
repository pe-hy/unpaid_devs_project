import NavbarComponent from "./components/navbar/NavbarComponent";
import StudentHomeView from "./views/studentHome/StudentHomeView";
import TeacherHomeView from "./views/teacherHome/TeacherHomeView";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginView from "./views/login/LoginView";

function App() {
  return (
    <div>
      <NavbarComponent />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route
            path="studentHome"
            element={
              localStorage.getItem("role") === "ROLE_STUDENT" ? (
                <StudentHomeView />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="teacherHome"
            element={
              localStorage.getItem("role") === "ROLE_TEACHER" ? (
                <TeacherHomeView />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
