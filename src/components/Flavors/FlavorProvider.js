import React, { useState } from 'react'

export const FlavorContext = React.createContext()

export const FlavorProvider = (props) => {

const [flavorItem, setFlavors] = useState([])

const GetFlavors = () => {
  return fetch("http://localhost:8088/flavors")
    .then(res => res.json())
    .then(setFlavors)  //.then((data) => console.log("HERES THE DATA", data))
  // .then(parsedFlavors => setFlavors(parsedFlavors))
}


return (
  <FlavorContext.Provider value={
    {
       GetFlavors, flavorItem
    }
  }>
    {props.children}
  </FlavorContext.Provider>
)
}