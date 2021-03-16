import React, { useState } from 'react'

export const FlavorSumsContext = React.createContext()

export const FlavorSumProvider = (props) => {


const [flavors, setFlavorsSums] = useState([])

// useState returns [initial value of state variable, a function to set the value of the state variable]



const GetFlavorSums = () => {
  return fetch("http://localhost:8000/flavorsums")
    .then(res => res.json())
    .then(setFlavorsSums)
  // .then(parsedFlavors => setFlavors(parsedFlavors))
}

const AddFlavorSums = (flavor) => {
    return fetch("http://localhost:8000/flavorsums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flavor)
    })
      .then(GetFlavorSums)
  }

  const GetFlavorsById = (logId) => {
    return fetch(`http://localhost:8000/flavorsums?logId=${logId}`)
      .then(res => res.json())
      .then(setFlavorsSums)
     // .then(GetFlavorSums)
  }

  

  return (
    <FlavorSumsContext.Provider value={
      {
        flavors, AddFlavorSums, GetFlavorSums, GetFlavorsById 
      }
    }>
      {props.children}
    </FlavorSumsContext.Provider>
  )
}