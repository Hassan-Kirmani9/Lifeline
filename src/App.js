import React from 'react'
import Home from './pages/Home'
import Bot from './pages/Bot'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Header from './Components/Header'
import Footer from './Components/Footer'
import Navbar from './Components/Navbar'


function App() {
  return (
    <div>
    <>

    <Header/>
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path='/' element={<Home/>}></Route>
    <Route path='bot' element={<Bot/>}></Route>
    </Routes>
    </BrowserRouter>
    <Footer/>
    </>
    </div>
  )
}

export default App

