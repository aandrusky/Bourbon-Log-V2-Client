import React, { useState } from 'react'

export const LogContext = React.createContext()

export const LogProvider = (props) => {

  const [logs, setLogs] = useState([])
  // useState returns [initial value of state variable, a function to set the value of the state variable]

  const GetLogs = () => {
    return fetch("http://localhost:8000/logs", {
      headers: {
        "Authorization": `Token ${localStorage.getItem("app_user")}`
      }
    }
    )
      .then(res => res.json())
        .then(setLogs)   //.then((data) => console.log("HERES THE DATA", data))
    // .then(parsedLogs => setLogs(parsedLogs))
  }

  const AddLog = log => {
    return fetch("http://localhost:8000/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("app_user")}`
      },
      body: JSON.stringify(log)
    })
       .then(res => res.json())
       // .then(GetLogs)
  }

  const DeleteLog = log => {
    return fetch(`http://localhost:8000/logs/${log}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Token ${localStorage.getItem("app_user")}`
      }
    })
    // .then(res => res.json())
       .then(GetLogs)  
     //.then((data) => console.log("HERES THE DELETE", data))
  }

  const EditLog = log => {
    return fetch(`http://localhost:8000/logs/${log.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem("app_user")}`
      },
      body: JSON.stringify(log)
    })
      .then(GetLogs)
  }

  return (
    <LogContext.Provider value={
      {
        logs, AddLog, GetLogs, DeleteLog, EditLog
      }
    }>
      {props.children}
    </LogContext.Provider>
  )
}

