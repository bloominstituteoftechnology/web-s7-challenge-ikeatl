import React from 'react'
import pizza from './images/pizza.jpg'
import { Link } from 'react-router-dom';

function Home() {
  const handleClick = () => {
    console.log("Image clicked")
  }
  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>
      {/* clicking on the img should navigate to "/order" */}
      <Link to='/order'>
        <img alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} onClick={handleClick} />
      </Link>
    </div>
  )
}

export default Home
