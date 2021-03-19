import React, { useContext, useEffect, useState } from 'react'
import { FlavorSumsContext } from "./FlavorSumProvider"
import { FlavorContext } from "./FlavorProvider"
import { Pie } from 'react-chartjs-2';

export const FlavorFunctionGenerator = (props) => {       //purpose of this function is to take flavorweights from flavorSums with like logId's, and convert them to percentages.

const { GetFlavorSums, flavors, GetFlavorsById } = useContext(FlavorSumsContext)
const { GetFlavors, flavorItem } = useContext(FlavorContext)

const [flavorLabels, setflavorLabels] = useState([])
const [flavorDataPoints, setflavorDataPoints] = useState([])




useEffect(() => {
    
    GetFlavorsById(props.logId)  
}, [])

    useEffect(() => {
        console.log(flavors)
        const flavorLabels = flavors.map(flavorObj => {
            
            return flavorObj.flavor.flavor
        })
        const flavorDataPoints = flavors.map(flavorObj => {
            console.log("flavorObj", flavorObj)
            return flavorObj.flavor_weight
        }) 
        setflavorLabels(flavorLabels)
        setflavorDataPoints(flavorDataPoints)
    },[flavors])
    
    return (
        <div className="chartContainer">
            <Pie data={{
                labels: flavorLabels,
                datasets: [
                    {
                        label: 'flavor weight by %',
                        data: flavorDataPoints,
                        backgroundColor: [
                            'rgba(242, 184, 75)',
                            'rgba(242, 157, 53)',
                            'rgba(191, 104, 54)',
                            'rgba(125, 93, 70)',
                            'rgba(38, 21, 15)',
                            'rgba(87, 79, 79)',
                            'rgba(140, 34, 24)',
                            'rgba(140, 138, 125)',
                            'rgba(89, 4, 4)',
                            'rgba(189, 111, 71)',
                          ]
                    }
                ]
            }}/>
            
        </div>
    )



}
