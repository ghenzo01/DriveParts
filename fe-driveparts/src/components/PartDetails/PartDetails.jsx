import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import ReCAPTCHA from 'react-google-recaptcha'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { UserContext } from '../../contexts/UserContext'
import { getPartDetails, deletePart } from '../../services/partService'
import { validateRecaptcha } from '../../services/recaptchaService.js'
import './PartDetails.css'

const PartDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [part, setPart] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const [showContactForm, setShowContactForm] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [message, setMessage] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      try {
        const data = await getPartDetails(id)
        setPart(data.part)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch part details:', error)
        const errorMessage = error.message || ''
        if (errorMessage.toLowerCase().includes('token')) {
          Swal.fire({
            title: 'Session expired',
            text: 'Your session token is expired or not valid. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/login')
          })
        } else {
          Swal.fire('Error', errorMessage || 'Failed to load part details', 'error')
        }
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [id, navigate])

  useEffect(() => {
    if (part && !message) {
      const defaultMessage = `Hello,

I am interested in a product you have listed on Drive Parts:
${part.article} for ${part.brand} ${part.model} with ID: ${part._id}.

Could you please provide more details about its condition, availability, and shipping options?

Thank you.`
      setMessage(defaultMessage)
    }
  }, [part, message])

  const isOwner = part?.user?._id === user?._id

  const handleEdit = () => {
    navigate(`/edit-part/${id}`)
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    if (result.isConfirmed) {
      try {
        await deletePart(id, user?.token)
        Swal.fire('Deleted', 'The part has been deleted.', 'success')
        navigate('/my-parts')
      } catch (error) {
        console.error('Failed to delete part:', error)
        const errorMessage = error.message || ''
        if (errorMessage.toLowerCase().includes('token')) {
          Swal.fire({
            title: 'Session expired',
            text: 'Your session token is expired or not valid. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/login')
          })
        } else {
          Swal.fire('Error', errorMessage || 'Failed to delete part', 'error')
        }
      }
    }
  }

  const handleContactSellerClick = () => {
    setShowContactForm(true)
    const container = document.querySelector('.part-contact-form-container')
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  const handleSendMail = async () => {
    if (!userEmail) {
      Swal.fire('Error', 'Need to provide your email address before sending.', 'error')
      return
    }

    if (!message) {
      Swal.fire('Error', 'The message cannot be empty.', 'error')
      return
    }

    if (!recaptchaToken) {
      Swal.fire('Error', 'Please verify that you are not a robot.', 'error')
      return
    }

    try {
      await validateRecaptcha(recaptchaToken)
      const mailData = {
        to: part?.user?.email || '',
        subject: 'Inquiry about your part on Drive Parts',
        emailText: `${message}\n\nMy email: ${userEmail}`,
        userEmail: userEmail,
        recaptchaToken
      }

      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/email/sendEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mailData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.errors ? errorData.errors.join(', ') : errorData.message)
      }

      Swal.fire('Mail Sent', 'Your message has been sent to the seller. A confirmation has been sent to your email!', 'success')
        .then(() => {
          setShowContactForm(false)
          setUserEmail('')
          if (part) {
            const defaultMessage = `Hello,

I am interested in a product you have listed on Drive Parts:
${part.article} for ${part.brand} ${part.model} with ID: ${part._id}.

Could you please provide more details about its condition, availability, and shipping options?

Thank you.`
            setMessage(defaultMessage)
          } else {
            setMessage('')
          }

          const container = document.querySelector('.part-details-container')
          if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          }
        })
    } catch (error) {
      console.error('Error sending mail:', error)
      Swal.fire('Error', error.message || 'Failed to send email', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="part-spinner-overlay">
        <LoadingSpinner />
      </div>
    )
  }

  if (!part) {
    return <div className="container my-5">No part found</div>
  }

  return (
    <div className="part-details-container">
      <div className="part-meta-row">
        <span><strong>ID:</strong> {part._id}</span>
        <span><strong>Created At:</strong> {new Date(part.createdAt).toLocaleString()}</span>
        <span><strong>Updated At:</strong> {new Date(part.updatedAt).toLocaleString()}</span>
      </div>

      <div className="part-image-row">
        <img
          src={part.image || 'https://via.placeholder.com/300'}
          alt={part.article}
          className="part-hero-image"
        />
      </div>

      <h2 className="part-article-name">{part.article}</h2>

      <div className="part-data-sections">
        <div className="part-data-box">
          <h3>Vehicle Compatibility / Origin</h3>
          <div className="part-data-grid">
            <p><strong>Brand:</strong> {part.brand}</p>
            <p><strong>Model:</strong> {part.model}</p>
            <p><strong>Year:</strong> {part.year}</p>
            <p><strong>Engine Type:</strong> {part.engineType}</p>
            <p><strong>Displacement:</strong> {part.displacement}</p>
            <p><strong>Fuel Type:</strong> {part.fuelType}</p>
            <p><strong>Transmission:</strong> {part.transmission}</p>
            <p><strong>Body Type:</strong> {part.bodyType}</p>
            <p><strong>Doors:</strong> {part.doors}</p>
          </div>
        </div>

        <div className="part-data-box">
          <h3>Article Details</h3>
          <div className="part-data-grid">
            <p><strong>Article Name:</strong> {part.article}</p>
            <p><strong>Condition:</strong> {part.condition}</p>
            <p><strong>Price:</strong> {part.price} €</p>
            <p><strong>Manufacturer Code:</strong> {part.manufacturerCode}</p>
            <p><strong>Description:</strong> {part.description}</p>
          </div>
        </div>
      </div>

      {isOwner ? (
        <div className="part-buttons-container">
          <div className="part-buttons-inner">
            <button className="part-btn-edit" onClick={handleEdit}>Edit Part</button>
            <button className="part-btn-delete" onClick={handleDelete}>Delete Part</button>
          </div>
        </div>
      ) : (
        <>
          <div className="part-buttons-container single-button">
            <button className="part-btn-contact" onClick={handleContactSellerClick}>
              📧 Contact Seller
            </button>
          </div>

          {showContactForm && (
            <div className="part-contact-form-container">
              <h4>Contact the Seller</h4>
              <p>Please provide your email address and edit the message if you wish:</p>
              <input
                type="email"
                placeholder="Your email"
                className="part-user-email-input"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <textarea
                className="part-message-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
              />
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={handleRecaptchaChange}
              />
              <button className="part-btn-send-mail" onClick={handleSendMail}>Send Mail</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PartDetails
