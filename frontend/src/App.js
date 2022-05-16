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
import AdminHomeView from "./views/adminHome/AdminHomeView";
import AdminPersonalPageView from "./views/adminPersonalPage/AdminPersonalPageView";
import {useState} from "react";

function App() {

  const [stateShouldUpdate, setStateShouldUpdate] = useState(false);

  return (
    <div className="main">
      <UserContextProvider>
        <NavbarComponent update={stateShouldUpdate}/>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView update={stateShouldUpdate}/>} />
            <Route path="/login" element={<LoginView update={stateShouldUpdate}/>} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/studentHome" element={<StudentHomeView />} />
            <Route path="/teacherHome" element={<TeacherHomeView />} />
            <Route path="/coordinatorHome" element={<CoordinatorHomeView />} />
            <Route path="/adminHome" element={<AdminHomeView />} />
            <Route path="/adminPersonal" element={<AdminPersonalPageView />} />
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
