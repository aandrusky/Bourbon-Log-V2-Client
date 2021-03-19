import React, { useContext, useState, useEffect } from 'react'
import { LogContext } from "./LogProvider"
import { FlavorSumsContext } from "../Flavors/FlavorSumProvider"
import { FlavorContext } from "../Flavors/FlavorProvider"
import { Form, Button } from "react-bootstrap"
// import { FlavorFunctionGenerator } from "../Flavors/FlavorFunction"
import 'bootstrap/dist/css/bootstrap.min.css'


export const BourbonForm = (props) => {

  // Use the required context providers for data
  const { AddLog, logs, EditLog, GetLogs } = useContext(LogContext)
  const { flavors, GetFlavorSums, AddFlavorSums } = useContext(FlavorSumsContext)
  const { GetFlavors, flavorItem } = useContext(FlavorContext)

  // Component state
  const [log, setLog] = useState({})
  const [flavorSumObjects, setFlavorSumObjects] = useState([])

  //This checks if my object has a "logId" tied to it. If it does, then it means it's been created, and exists, therefore, not new.
  const editMode = props.match.params.hasOwnProperty("logId")  





  const flavorSumLogger = (event) => {                                      //this gets called everytime a slider is adjusted (onChange)
    const logId = parseInt(props.match.params.logId)
    const flavorId = parseInt(event.target.id)                              //gets our id from our flavorsums resource- declared by the context provider above
    const newFlavorSumObjects = flavorSumObjects.slice()                    //<newFlavorSumObjects is a copy of our state variable array
    const foundFlavorObject = flavorSumObjects.find(flavor => flavor.flavorId === flavorId)  //loops through my array to find any instance of flavorId
    const flavorweight = parseInt(event.target.value)                       //gets our flavorweight from the flavorsums resources and sticks it in a variable. 
    if (foundFlavorObject !== undefined) {                                  //checks if found items from loop are undefined (empty object with no value- slider was never adjusted)
      foundFlavorObject.flavorweight = flavorweight                         //and if they are NOT undefined, then we can take that value and assign it as flavorweight
    } else {
      newFlavorSumObjects.push({ flavorId, flavorweight, logId })           //otherwise add the found ID and WEIGHT to our array copy
    }
    setFlavorSumObjects(newFlavorSumObjects)                                //I call my setState function and pass in my now filled array copy as an its new

    
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

  // Get animals from API when component initializes- do I also need to get flavorSums here?
  useEffect(() => {
    GetLogs()
  }, [])

  // Once provider state is updated, determine the log (if edit)
  useEffect(() => {
    getLogInEditMode()
  }, [logs])

  useEffect(() => {
    GetFlavors()
  }, [])


  const constructNewBourbon = () => {

    if (editMode) {
      EditLog({
        id: log.id, 
        bourbonName: log.bourbonName,
        distiller: log.distiller,
        proof: log.proof,
        age: log.age,
        batchNum: log.batchNum,
        owned: log.owned,
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
        bourbonName: log.bourbonName,
        distiller: log.distiller,
        proof: log.proof,
        age: log.age,
        batchNum: log.batchNum,
        owned: log.owned,
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
          
        //.then addflavorsums, pass flavorSumLogger, which will need to loop through the sliders and grab values that !0
        
    }
  }


  return (
    
    <div className="BourbonFormContainer">
      <h1 className="bourbonForm__title"> {editMode ? "Update Log" : "New Bourbon Log"}</h1>
      <Form >
        <Form.Group controlId="formBourbonName">
          <Form.Label >Bourbon Name</Form.Label>
          <Form.Control type="text" name="bourbonName" onChange={handleControlledInputChange} value={log.bourbon_name} placeholder="Bourbon name here" />
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
          <Form.Control type="text" name="batchNum" onChange={handleControlledInputChange} value={log.batch_num} placeholder="Batch number/name here" />
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

        {/*my console log does grab the slider value. that number is the user's assigned 'weight'. On save, I need to grab only the values >0. */}



        {/* <Form > */}
          <Form.Group >
            {
              flavorItem.map(flavorObj => {
                return (
                  <>
                    <Form.Label>{flavorObj.flavor}</Form.Label>
                    <Form.Control id={flavorObj.id} defaultValue="0" type="range" onChange={flavorSumLogger} />
                  </>
                )
              }
              )}
          </Form.Group>
        {/* </Form> */}

        <Button className="SaveButton" onClick={(evt) => {
          evt.preventDefault()
          console.log("FSOBJ", flavorSumObjects)
          constructNewBourbon()
          
        }}
          variant="primary" size="lg" type="submit" block>
          Save Log
  </Button>
      </Form>
    
    </div>
  )
}
