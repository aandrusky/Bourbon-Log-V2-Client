import React, { useContext, useState, useEffect, useRef } from 'react'
import { LogContext } from "./LogProvider"
import { FlavorSumsContext } from "../Flavors/FlavorSumProvider"
import { FlavorContext } from "../Flavors/FlavorProvider"
import { Form, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'


export const BourbonForm = (props) => {

  // Use the required context providers for data
  const { AddLog, logs, EditLog, GetLogs } = useContext(LogContext)
  const { flavors, GetFlavorSums, AddFlavorSums, GetFlavorsById } = useContext(FlavorSumsContext)
  const { GetFlavors, flavorItem } = useContext(FlavorContext)

  // Component state
  const [log, setLog] = useState({})
  const [flavorSumObjects, setFlavorSumObjects] = useState([])
  const [defaultSliderValues, setDefaultSliderValues] = useState({})
  //This checks if my object has a "logId" tied to it. If it does, then it means it's been created, and exists, therefore, not new.
  const editMode = props.match.params.hasOwnProperty("logId")  

  const owned = useRef(null)



  const flavorSumLogger = (event) => {
    const foundFlavor = flavorItem.find((flavorObj) => flavorObj.id === parseInt(event.target.id))                                     
    const logId = parseInt(props.match.params.logId)                         //this gets called everytime a slider is adjusted (onChange)
    const flavorId = parseInt(event.target.id)                              //gets our id from our flavorsums resource- declared by the context provider above
    const newFlavorSumObjects = flavorSumObjects.slice()                    //<newFlavorSumObjects is a copy of our state variable array
    const foundFlavorObject = flavorSumObjects.find(flavor => flavor.flavorId === flavorId)  //loops through my array to find any instance of flavorId
    const flavorweight = parseInt(event.target.value)                       //gets our flavorweight from the flavorsums resources and sticks it in a variable. 
    if (foundFlavorObject !== undefined) {                                  //checks if found items from loop are undefined (empty object with no value- slider was never adjusted)
      foundFlavorObject.flavorweight = flavorweight                         //and if they are NOT undefined, then we can take that value and assign it as flavorweight
    } else {
      
      newFlavorSumObjects.forEach((singleSum, index) => {
        if (singleSum.flavorId === flavorId) {
          newFlavorSumObjects.splice(index, 1)
        }
      } )
      newFlavorSumObjects.push({ flavorId, flavorweight, logId })           //otherwise add the found ID and WEIGHT to our array copy
    }
    setFlavorSumObjects(newFlavorSumObjects)                                //I call my setState function and pass in my now filled array copy as an its new
    if (editMode) {
    const newDefaultValues = Object.assign({}, defaultSliderValues)
     
    newDefaultValues[foundFlavor.flavor] = event.target.value
    setDefaultSliderValues(newDefaultValues)
    }
    
  } 
  

  const handleControlledInputChange = (event) => {
    /*
        When changing a state object or array, always create a new one
        and change state instead of modifying current one
    */
    const newBourbon = Object.assign({}, log)
    newBourbon[event.target.name] = event.target.value
    setLog(newBourbon)

  }

  /*
         If there is a URL parameter, then the user has chosen to
         edit a log.
             1. Get the value of the URL parameter.
             2. Use that `id` to find the animal.
             3. Update component state variable.
     */

  //how do I add flavors to this so that they can also be adjusted in edit mode?
  const getLogInEditMode = () => {
    if (editMode) {
      const logId = parseInt(props.match.params.logId)
      const selectedBourbon = logs.find(l => l.id === logId) || {}
      setLog(selectedBourbon)
    }
  }
  
  // Once provider state is updated, determine the log (if edit)
  useEffect(() => {
    getLogInEditMode()
  }, [logs])
  
  

  useEffect(() => {
    GetFlavors()
    .then(() => GetLogs())
    .then(() => GetFlavorsById(props.match.params.logId))
  }, [])

  useEffect(() => {
    if (flavors.length > 0 && editMode) {
      const newDefaultValues = Object.assign({}, defaultSliderValues)
      
      for (let index = 0; index < flavorItem.length; index++) {
        const flavorObj = flavorItem[index];
        const foundFlavorSum = flavors.find((singleSum) => flavorObj.id === singleSum.flavor.id) || {flavor_weight:"0"}
        newDefaultValues[flavorObj.flavor] = foundFlavorSum.flavor_weight
      }
      setDefaultSliderValues(newDefaultValues)
    }
  }, [flavors]
  )


  const constructNewBourbon = () => {

    if (editMode) {
      EditLog({
        id: log.id, 
        bourbon_name: log.bourbon_name,
        distiller: log.distiller,
        proof: log.proof,
        age: log.age,
        batch_num: log.batch_num,
        owned: owned.current.checked,
        price: log.price,
        notes: log.notes,
        rating: log.rating,
        userId: parseInt(localStorage.getItem("app_user"))
      })
      .then(() => {

        flavorSumObjects.forEach(singleFlavorSumObj=>AddFlavorSums(singleFlavorSumObj))
      })
      .then(() => props.history.push("/ViewList"))
    } else {
      AddLog({
        bourbon_name: log.bourbon_name,
        distiller: log.distiller,
        proof: log.proof,
        age: log.age,
        batch_num: log.batch_num,
        owned: owned.current.checked,
        price: log.price,
        notes: log.notes,
        rating: log.rating,
        userId: parseInt(localStorage.getItem("app_user"))
      }) 
      .then((logReturnedFromApi) => {

        flavorSumObjects.forEach(singleFlavorSumObj=> {
          
          singleFlavorSumObj.logId = logReturnedFromApi.id
          AddFlavorSums(singleFlavorSumObj)
      })
      })
      .then(() => props.history.push("/ViewList"))
    }
  }


  return (
    
    <div className="BourbonFormContainer">
      <h1 className="bourbonForm__title"> {editMode ? "Update Log" : "New Bourbon Log"}</h1>
      <Form >

      <h6 className="bourbonForm__title-Owned">Do you own this bottle?</h6>

        <Form.Group controlId="ownedSwitch">
        <Form.Check
            type="switch"
            ref={owned}
            name="owned"
            id="ownedIndicator-switch"
            label="Owned"
            onChange={handleControlledInputChange}
            value={log.owned}
        />
        </Form.Group> 

        <Form.Group controlId="formbourbon_name">
          <Form.Label >Bourbon Name</Form.Label>
          <Form.Control type="text" name="bourbon_name" onChange={handleControlledInputChange} value={log.bourbon_name} placeholder="Bourbon name here" />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group controlId="formDistillery">
          <Form.Label>Distillery</Form.Label>
          <Form.Control type="text" name="distiller" onChange={handleControlledInputChange} value={log.distiller} placeholder="Distillery name here" />
        </Form.Group>

        <Form.Group controlId="formProof">
          <Form.Label>Proof</Form.Label>
          <Form.Control type="text" name="proof" onChange={handleControlledInputChange} value={log.proof} placeholder="Proof # here" />
        </Form.Group>

        <Form.Group controlId="formAge">
          <Form.Label>Age</Form.Label>
          <Form.Control type="text" name="age" onChange={handleControlledInputChange} value={log.age} placeholder="Age of bourbon here" />
        </Form.Group>

        <Form.Group controlId="formBatch">
          <Form.Label>Batch Number</Form.Label>
          <Form.Control type="text" name="batch_num" onChange={handleControlledInputChange} value={log.batch_num} placeholder="Batch number/name here" />
        </Form.Group>

        <Form.Group controlId="formPrice">
          <Form.Label>Price Paid</Form.Label>
          <Form.Control type="text" name="price" onChange={handleControlledInputChange} value={log.price} placeholder="Price for bottle or pour here" />
        </Form.Group>

        <Form.Group controlId="formNotes">
          <Form.Label>Notes</Form.Label>
          <Form.Control type="text" name="notes" onChange={handleControlledInputChange} value={log.notes} as="textarea" rows={3} placeholder="Overall impression here" />
        </Form.Group>

        <Form.Group controlId="formRating">
          <Form.Label>Rating</Form.Label>
          <Form.Control type="text" name="rating" onChange={handleControlledInputChange} value={log.rating} placeholder="How would you rate this bottle?" />
        </Form.Group>


        <h3 className="NotesHeader">Tasting Notes</h3>

          <Form.Group >
            {
              flavorItem.map(flavorObj => {
                
                
                  if (editMode && defaultSliderValues.hasOwnProperty(flavorObj.flavor)) {
        
                  return (
                    <>
                    <Form.Label>{flavorObj.flavor}</Form.Label>
                    <Form.Control id={flavorObj.id} name={flavorObj.flavor} value= {defaultSliderValues[flavorObj.flavor]} type="range" onChange={flavorSumLogger} />
                  </>
                  )
                  }
                  else {
                    return (
                      <>
                    <Form.Label>{flavorObj.flavor}</Form.Label>
                    <Form.Control id={flavorObj.id} defaultValue="0" type="range" onChange={flavorSumLogger} />
                  </>
                    )
                    }
              }
              )}

          </Form.Group>
        

        <Button className="SaveButton" onClick={(evt) => {
          evt.preventDefault()
          console.log("flavorSumObjects", flavorSumObjects)
          constructNewBourbon()
          
        }}
          variant="primary" size="lg" type="submit" block>
          Save Log
  </Button>
      </Form>
    
    </div>
  )
}



