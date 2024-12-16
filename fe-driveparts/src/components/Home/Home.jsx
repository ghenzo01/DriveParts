import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">Welcome to Drive Parts!</h1>
        <p className="subtitle">Your go-to platform for vehicle parts.</p>
      </div>

      <div className="content-section">
        <div className="promotional-message">
          <p>
            Search and find the parts you need for your vehicle by browsing through
            our wide selection from trusted sellers. Whether you’re looking for new, used,
            refurbished, or inspected parts, we have you covered.
          </p>
        </div>

        <div className="product-types">
          <h3>What We Offer</h3>
          <ul>
            <li>New parts</li>
            <li>Used parts</li>
            <li>Refurbished parts</li>
            <li>Inspected parts</li>
          </ul>
        </div>

        <div className="call-to-action">
          <p>
            Still can’t find what you’re looking for?{' '}
            <a href="/request" className="cta-link">
              Submit a request
            </a>{' '}
            to all our connected sellers and let them know what you need!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
