import React, { useContext, useEffect, useState } from 'react'
import { LogContext } from './LogProvider'
import { FlavorSumsContext } from '../Flavors/FlavorSumProvider'
import { FlavorFunctionGenerator } from "../Flavors/FlavorFunction"
import { Pie } from 'react-chartjs-2';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import 'bootstrap/dist/css/bootstrap.min.css'
import "../../Bourbon.css"



export const BourbonList = (props) => {

    //State variables get set by provider functions by calling 'setX' at the end of the call. The useContext argument returns 1 array with 2 things in it. 

    const { DeleteLog, GetLogs, logs } = useContext(LogContext)
    const { GetFlavorSums, flavors } = useContext(FlavorSumsContext)

    const [selectedBourbon, setSelectedBourbon] = useState({})
    const [flavorSumObj, setFlavorsSums] = useState({})

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

    return (
        <>

            <div className="BourbonListContainer">

                <h1 className="BourbonListHeader">BourbonList </h1>



                <div className="CardContainer">
                    {
                        logs.map(logObj => {

                            return (


                                <div className="Cards">

                                    <Card className="text-center" key={logObj.id} style={{ width: '13rem' }}>

                                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                        <Card.Body>
                                            <Card.Title>{logObj.bourbonName}</Card.Title>
                                            <Card.Text >
                                                <div className="Card_Data">Proof: {logObj.proof}</div>
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
                            <Modal.Title>{selectedBourbon.bourbonName}</Modal.Title>


                        </Modal.Header>
                        <Modal.Body>
                            <div className="bourbonDataCard">                         
                                <p>Distillery: {selectedBourbon.distiller} </p>
                                <p>Proof: {selectedBourbon.proof} </p>
                                <p> Age: {selectedBourbon.age} years </p>
                                <p> Batch: {selectedBourbon.batchNum} </p>
                                <p> Rated: {selectedBourbon.rating} </p>
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

