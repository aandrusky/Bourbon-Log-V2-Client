import React from "react"
import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { ApplicationViews } from "./ApplicationViews"

export const BourbonLog = (props) => (
<>
<Route render={() => {
  
    if (localStorage.getItem("app_user")) {
        return (
            <div className="app">
                 <ApplicationViews/>        
            </div>
        )
    } else {
        return <Redirect to="/login" />
    }
}} />

<Route path="/login" render={props => <Login {...props} />} />
<Route path="/register" render={props => <Register {...props} />} />
</>

)
