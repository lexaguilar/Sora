import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userService } from '../../services/user.service';


const PrivateRoute = routeProps => {

      let {component: Component,render: Render, ...rest} = routeProps;

      return (<Route {...rest} render={props => 
        userService.isLogged() 
          ? Component ? <Component {...props} /> : <Render {...props}/>
          : <Redirect to={{pathname:'/app/login', state:{from: props.location}}} />
      } />)
};

export default PrivateRoute;