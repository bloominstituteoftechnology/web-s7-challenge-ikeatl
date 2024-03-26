import React from 'react'
import Home from './Home'
import Form from './Form'
import { NavLink, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div id="app">

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
      </nav>
      <Routes>

        <Route exact path="/" element={<Home />} />
        <Route exact path="/order" element={<Form />} />
      </Routes>

      {/* <Home /> */}
      {/* <Form /> */}
    </div>
  )
}

export default App
