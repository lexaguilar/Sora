import React, { useState } from "react";
import { userService } from "../../services/user.service";

function Logout(props) {

    console.log(props);

    userService.logout();

    props.history.push({ pathname : '/app/login'});

    return (
        <div></div>
    );

}


export default Logout;
