import React, { useState } from 'react';
import Template from "../components/Template"

const Login = ({ setIsLoggedIn }) => {

    return (
        <Template formtype="login"
        setIsLoggedIn={setIsLoggedIn} />
    )
}

export default Login;