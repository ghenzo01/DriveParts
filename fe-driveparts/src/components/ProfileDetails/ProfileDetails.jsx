import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { getUserParts } from '../../services/partService'
import './ProfileDetails.css'

const ProfileDetails = () => {
  const { user, token } = useContext(UserContext)
  const navigate = useNavigate()
  const [insertedPartsCount, setInsertedPartsCount] = useState(0)

  useEffect(() => {
    if (user && token) {
      getUserParts(token, 1, 0) 
        .then(data => {
          setInsertedPartsCount(data.parts.length)
        })
        .catch(error => {
          console.error('Failed to fetch user parts:', error)
        })
    }
  }, [user, token])

  if (!user) {
    return <div className="container my-5">No user data</div>
  }

  const handleEdit = () => {
    navigate('/edit-profile')
  }

  const safeValue = (value) => value || ""

  const websiteContent = user.website 
    ? <a href={user.website} target="_blank" rel="noreferrer" className="profile-website-link">{user.website}</a>
    : ""

  return (
    <div className="profile-details-container">
      <h1 className="profile-main-title">My Profile</h1>
      <div className="profile-seller-info-box">
        <div className="profile-seller-info-row">
          <div className="profile-seller-logo-wrap">
            <img
              src={user.logo || 'https://via.placeholder.com/300'}
              alt="User Logo"
              className="profile-seller-logo-large"
            />
          </div>
          <div className="profile-seller-data-wrap">
            <p className="profile-seller-name-line">
              <span className="profile-name-label">Name:</span> 
              <span className="profile-name-value">{safeValue(user.businessName)}</span>
            </p>

            <div className="profile-pairs-container">
              <div className="profile-label">Phone:</div>
              <div className="profile-value">{safeValue(user.phone)}</div>

              <div className="profile-label">Business Type:</div>
              <div className="profile-value">{safeValue(user.businessType)}</div>

              <div className="profile-label">VAT ID:</div>
              <div className="profile-value">{safeValue(user.vatId)}</div>

              <div className="profile-label">Email:</div>
              <div className="profile-value">{safeValue(user.email)}</div>

              <div className="profile-label">WhatsApp:</div>
              <div className="profile-value">{safeValue(user.whatsApp)}</div>

              <div className="profile-label">Website:</div>
              <div className="profile-value">{websiteContent}</div>

              <div className="profile-label">Promotional Phrase:</div>
              <div className="profile-value">{user.promotionalPhrase ? <em>{user.promotionalPhrase}</em> : ""}</div>

              <div className="profile-label">Business Description:</div>
              <div className="profile-value profile-multiline-description">
                {safeValue(user.businessDescription)}
              </div>

              <div className="profile-label">Inserted Parts:</div>
              <div className="profile-value">{insertedPartsCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-buttons-container">
        <button className="profile-btn-edit" onClick={handleEdit}>Edit</button>
      </div>
    </div>
  )
}

export default ProfileDetails
