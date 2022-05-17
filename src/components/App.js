import React from "react";
import './App.css';
import NavigationBar from "./navigation-bar";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import MetamaskConnection from "./metamask-connection";
import NFT from "./Nft.js";
import Token from "./token";
import Record from "./record";
import MainPage from "./mainPage";
import AssignmentPage from "./assignmentPage";
import Teacher from "./teacher";
import Student from "./student";

function App() {

    return (
        <div>
            <Router>
                <div>
                    <NavigationBar/>
                    <Routes>
                    <Route
                            exact
                            path='/'
                            element={<MetamaskConnection/>}
                        />
                        <Route
                            exact
                            path='/nft'
                            element={<NFT/>}
                        />
                         <Route
                            exact
                            path='/token'
                            element={<Token/>}
                        />
                        <Route
                            exact
                            path='/record'
                            element={<Record/>}
                        />
                        <Route
                            exact
                            path='/mainPage'
                            element={<MainPage/>}
                        />
                         <Route
                            exact
                            path='/assigPage/:student/:subject'
                            element={<AssignmentPage/>}
                        />
                          <Route
                            exact
                            path='/teacher'
                            element={<Teacher/>}
                        />
                         <Route
                            exact
                            path='/student'
                            element={<Student/>}
                        />


                    </Routes>
                </div>
            </Router>

        </div>

    )

}

export default App;
