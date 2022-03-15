import NavbarComponent from "./components/navbar/NavbarComponent";
import StudentHomeView from "./views/studentHome/StudentHomeView";
import TeacherHomeView from "./views/teacherHome/TeacherHomeView";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginView from "./views/login/LoginView";
import RegisterView from "./views/register/RegisterView";
import { UserContextProvider } from "./userContext";

function App() {
  return (
    <div>
      <UserContextProvider>
        <NavbarComponent />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="studentHome" element={<StudentHomeView />} />
            <Route path="teacherHome" element={<TeacherHomeView />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  );
}

export default App;
