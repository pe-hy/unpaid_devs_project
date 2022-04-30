import {createContext, useContext, useState} from "react";

export const userContext = createContext({
    loggedIn: null,
    logIn: () => {
    },
    logOut: () => {
    },
});

const ROLE = {loggedIn: localStorage.getItem("role") !== null ? true : false};

export function UserContextProvider({children}) {
    const [loggedIn, setLoggedIn] = useState(ROLE);

    function logIn(bool) {
        setLoggedIn({loggedIn: bool});
    }

    function logOut() {
        setLoggedIn(ROLE);
    }

    return (
        <userContext.Provider value={{loggedIn, logIn, logOut}}>
            {children}
        </userContext.Provider>
    );
}

export function useUserContext() {
    const {loggedIn} = useContext(userContext);

    return {loggedIn};
}
