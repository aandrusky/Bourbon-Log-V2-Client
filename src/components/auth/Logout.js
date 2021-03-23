import React, {useRef} from 'react'
import {Link} from 'react-router-dom'
import './Login.css'

export const Logout = (props) => {
    localStorage.setItem("app_user", "")
}