import React, { useContext, useEffect, useState } from 'react'
import { LogContext } from './LogProvider'
import { FlavorSumsContext } from '../Flavors/FlavorSumProvider'
import { FlavorFunctionGenerator } from "../Flavors/FlavorFunction"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import 'bootstrap/dist/css/bootstrap.min.css'
import "../../Bourbon.css"



export const BourbonList = (props) => {

    //State variables get set by provider functions by calling 'setX' at the end of the call. The useContext argument returns 1 array with 2 things in it. 

    const { DeleteLog, GetLogs, logs, searchTerms } = useContext(LogContext)
    const { GetFlavorSums, flavors } = useContext(FlavorSumsContext)

    const [selectedBourbon, setSelectedBourbon] = useState({})
    const [flavorSumObj, setFlavorsSums] = useState({})
    const [ filteredLogs, setFiltered ] = useState([])

    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = (logObj) => {
        setSelectedBourbon(logObj)
        setShow(true)

    };

    useEffect(() => {
        GetLogs()
    }, [])  //update on component initialization

    useEffect(() => {
        GetFlavorSums()
    }, []) //update on component initialization

    useEffect(() => {
        if (searchTerms !== "") {
          // If the search field is not blank, display matching animals
          const subset = logs.filter(log => log.name.toLowerCase().includes(searchTerms))
          setFiltered(subset)
        } else {
          // If the search field is blank, display all animals
          setFiltered(logs)
        }
      }, [searchTerms, logs])

    return (
        <>

            <div className="BourbonListContainer">

                <h1 className="BourbonListHeader">Bourbon List </h1>



                <div className="CardContainer">
                    {
                        logs.map(logObj => {
                            
                           
                            return (
                                
                                
                                <div className="Cards">

                                    <Card className="text-center" key={logObj.id} style={{ width: '13rem' }}>

                                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                        <Card.Body>
                                            <Card.Title>{logObj.bourbon_name}</Card.Title>
                                            <Card.Text >
                                                <div className="Card_Data">Proof: {logObj.proof}</div>
                                                <div className="Card_Data">batch#: {logObj.batch_num}</div>
                                            </Card.Text>
                                            <Button className="Buttoncard" size="lg" onClick={() => {
                                                
                                                handleShow(logObj)
                                                
                                            }}
                                            >
                                                View Log
                                            </Button>

                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        })
                    }



                </div>



                            {/* show modal if selected bourbon exists */}
                {selectedBourbon.id
                    ? <Modal show={show} onHide={handleClose}
                    {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>

                     

                        <Modal.Header >
                            <Modal.Title>{selectedBourbon.bourbon_name }
                            </Modal.Title>


                        </Modal.Header>
                        
                        <Modal.Body>
                            <div className="bourbonDataCard">                         
                                <p>Distillery: {selectedBourbon.distiller} </p>
                                <p>Proof: {selectedBourbon.proof} </p>
                                <p> Age: {selectedBourbon.age} years </p>
                                <p> Batch: {selectedBourbon.batch_num} </p>
                                <p> Rated: {selectedBourbon.rating} </p>
                                <p> Price: {selectedBourbon.price} </p>
                                <p> Notes: {selectedBourbon.notes} </p>
                                <FlavorFunctionGenerator logId={selectedBourbon.id} />
                            </div>

                          



                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => {
                                setShowAlert(false)
                                handleClose()
                            }}>
                                Close
                            </Button>





                            <Alert show={showAlert} variant="danger">
                                <Alert.Heading>Are you sure?</Alert.Heading>
                                <div>
                                    This action will result in permanant deletion of this bourbon log! Are you sure you want to continue?
                                </div>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button variant="secondary" onClick={() => setShowAlert(false)} >
                                        No, go back
                                    </Button>
                                    <Button onClick={() => {
                                        
                                        setShowAlert(false)
                                        handleClose()
                                        DeleteLog(selectedBourbon.id)
                                        .then(() => {
                                            props.history.push("/ViewList")
                                        })
                                    }}
                                    variant="danger">
                                        Yes, delete permanantly
                                    </Button>

                                </div>
                            </Alert>

                            {!showAlert && <Button variant="danger" onClick={() => setShowAlert(true)}>Delete</Button>}


                            {/* ↓ edit button ↓ */}
                            <Button variant="primary" onClick={() => {

                                props.history.push(`/logs/edit/${selectedBourbon.id}`)

                            }}>
                                Edit
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    : ""}
            </div>

            <div className="backButtonDiv">
                <Button className="Back-Button" variant="secondary" size="lg" type="submit" block onClick={() => props.history.push("/")}>Back</Button>
            </div>
        </>
    )
}

