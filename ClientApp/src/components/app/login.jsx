import React, { useState } from "react";
import { userService } from "../../services/user.service";
import notify from "devextreme/ui/notify";
import { useDispatch } from "react-redux";
import * as actions from '../../store/user/userActions';

function Login(props) {

    console.log(props);

    const dispatch = useDispatch();
    const [user, setUser] = useState({ username: "", password: "" });

    const onValueChange = e => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    }

    const sendUser = () => {

        userService.login(user).then(userResp => {

            let pathname = props?.location?.state?.from?.pathname || '/';

            dispatch(actions.updateUser({ username: userResp.username }));
            props.history.push({ pathname });

        }).catch(err => notify(err, "error"));

    }

    return (
        <div className="wrapper-login">
            <form className="form-signin">
                <h2 className="form-signin-heading">Iniciar sesión</h2>
                <input value={user.username} onChange={onValueChange} type="text" className="form-control" name="username" placeholder="Usuario" required="" autoFocus={true} />
                <input value={user.password} onChange={onValueChange} type="password" className="form-control" name="password" placeholder="Contraseña" required="" />
                <a href="/">Olvide mi Contraseña</a>
                <br />
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={sendUser}>Login</button>
            </form>
        </div>
    );

}


export default Login;
