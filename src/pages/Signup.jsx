import React from 'react';
import Template from "../components/Template"

const Login = ({ setIsLoggedIn }) => {

    return (
        <Template formtype="signup"
        setIsLoggedIn={setIsLoggedIn} />
    )
}

export default Login;