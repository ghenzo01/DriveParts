import React from 'react'
import { useNavigate } from 'react-router-dom'
import './PartCard.css'

const PartCard = ({ part }) => {
  const navigate = useNavigate()

  const handleDetailsClick = () => {
    navigate(`/part-details/${part._id}`)
  }

  return (
    <div className="part-card-container">
      <div className="part-card-content">
        <div className="part-card-left">
          <img
            src={part.image || 'https://via.placeholder.com/150'}
            alt={part.article}
            className="part-image"
          />
        </div>
        <div className="part-card-right">
          <h3>{part.article}</h3>
          <p>
            <span className="label">Brand:</span> {part.brand} | <span className="label">Model:</span> {part.model} | <span className="label">Year:</span> {part.year}
          </p>
          <p>
            <span className="label">Price:</span> {part.price} € | <span className="label">Condition:</span> {part.condition}
          </p>
          <div className="seller-info">
            <img
              src={part.user?.logo || 'https://via.placeholder.com/30'}
              alt="Seller Logo"
              className="seller-logo"
            />
            <span className="seller-name">{part.user?.businessName}</span>
          </div>
        </div>
      </div>
      <div className="manage-button-container">
        <button className="manage-button" onClick={handleDetailsClick}>Details</button>
      </div>
    </div>
  )
}

export default PartCard
