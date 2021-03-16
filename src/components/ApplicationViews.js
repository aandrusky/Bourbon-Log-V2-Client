import React from 'react'
import { Route } from 'react-router-dom'
import { BourbonForm } from './Bourbon/BourbonForm'
import { BourbonList } from './Bourbon/BourbonList'
// import { FlavorFunctionGenerator } from "./Flavors/FlavorFunction"
import { Home } from './Nav/Home'
import { LogProvider } from "./Bourbon/LogProvider"
import { FlavorSumProvider } from './Flavors/FlavorSumProvider'
import { FlavorDetail } from './Flavors/FlavorDetail'
import { FlavorProvider } from './Flavors/FlavorProvider'

export const ApplicationViews = (props) => {
    return (
        <>
            <LogProvider>
                <FlavorProvider>
                    <FlavorSumProvider>
                <Route exact path="/" render={
                    props => <Home {...props}
                    />
                } />
                <Route path="/NewLog" render={
                    props => <BourbonForm {...props} />
                } />
                <Route path="/logs/edit/:logId(\d+)" render={
                    props => <BourbonForm {...props} />
                } />
                <Route path="/ViewList" render={
                    props => <>
                    <BourbonList {...props} />
                    {/* <FlavorFunctionGenerator {...props}/> */}
                   </>
                } />
                    </FlavorSumProvider>
                </FlavorProvider>
            </LogProvider>

            <LogProvider>
            <FlavorSumProvider>
                <Route path="/NewLog/:flavorId(\d+)" render={
                    props => <FlavorDetail {...props}/>
                } />
            </FlavorSumProvider>
            </LogProvider>
        </>
    )
}
