import NavbarComponent from "./components/UnspecifiedRoles/navbar/NavbarComponent";
import StudentHomeView from "./views/studentHome/StudentHomeView";
import TeacherHomeView from "./views/teacherHome/TeacherHomeView";
import CoordinatorHomeView from "./views/coordinatorHome/CoordinatorHomeView";
import TeacherPersonalPageView from "./views/teacherPersonalPage/TeacherPersonalPageView";
import CoordinatorPersonalPageView from "./views/coordinatorPersonalPage/CoordinatorPersonalPageView";
import StudentPersonalPageView from "./views/studentPersonalPage/StudentPersonalPageView";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginView from "./views/login/LoginView";
import RegisterView from "./views/register/RegisterView";
import { UserContextProvider } from "./userContext";

function App() {
  return (
    <div className="main">
      <UserContextProvider>
        <NavbarComponent />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/studentHome" element={<StudentHomeView />} />
            <Route path="/teacherHome" element={<TeacherHomeView />} />
            <Route path="/coordinatorHome" element={<CoordinatorHomeView />} />
            <Route path="/studentPersonal" element={<StudentPersonalPageView />} />
            <Route path="/teacherPersonal" element={<TeacherPersonalPageView />} />
            <Route path="/coordinatorPersonal" element={<CoordinatorPersonalPageView />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </div>
  );
}

export default App;
