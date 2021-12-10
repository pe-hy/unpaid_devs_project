import React from 'react';
let userName = "Jan Novák";
let role = "Student"
let empty = "";

const LoginInformationComponent = ({ isLoggedIn }) => {
    if(userName != null && isLoggedIn) {
        return (
            <div className="text-center" style={{marginTop: "12px"}}>
            <p style={{marginBottom: "0px"}}>{userName}</p>
            <p><b>Role:</b> {role}</p>
            </div>
        )
    }else{
        return (
            <div>
                {empty}
            </div>
        )
    }
}
export default LoginInformationComponent;