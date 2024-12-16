import React, { useState } from 'react'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import VehicleSpecifications from '../VehicleSpecifications/VehicleSpecifications'
import './RequestMailForm.css'

const RequestMailForm = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    residence: '',
    email: '',
    phone: '',
    licensePlate: '',
    vin: '',
  })

  const [vehicleSpecs, setVehicleSpecs] = useState({
    articleSelection: '',
    brand: '',
    model: '',
    article: '',
    year: '',
    engineType: '',
    displacement: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    doors: '',
  })

  const [showMailPreview, setShowMailPreview] = useState(false)

  const [message, setMessage] = useState(
`Hello,
I am looking for a spare part for my vehicle. Could you please let me know if you have something suitable?

Best regards,`
  )

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleVehicleChange = (field, value) => {
    setVehicleSpecs((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateMail = () => {
    if (!formData.name || !formData.surname || !formData.residence || !formData.email || !formData.phone) {
      Swal.fire('Error', 'Please fill all required fields.', 'error')
      return
    }

    if (Object.values(vehicleSpecs).some(v => v === '')) {
      Swal.fire('Error', 'Please fill all vehicle specifications.', 'error')
      return
    }

    setShowMailPreview(true)
  }

  const handleBack = () => {
    setShowMailPreview(false)
  }

  const handleQuickFill = () => {
    setFormData({
      name: 'Lorenzo',
      surname: 'Ghidini',
      residence: 'Parma',
      email: 'lorenzo.ghidini1@gmail.com',
      phone: '1234567890',
      licensePlate: 'AB123CD',
      vin: '1HGCM82633A004352',
    })
    setVehicleSpecs({
      articleSelection: 'Brake Pads',
      brand: 'Ford',
      model: 'Focus',
      article: 'Brake Pads',
      year: '2015',
      engineType: 'Diesel',
      displacement: '1.5L',
      fuelType: 'Diesel',
      transmission: 'Manual',
      bodyType: 'Hatchback',
      doors: '5',
    })
    setMessage(`Hello,
I am looking for brake pads for my 2015 Ford Focus.
Could you please let me know if you have something suitable?

Best regards,`)
  }

  const handleSendMail = async () => {
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Do you want to send this inquiry to all our registered sellers?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33'
    })

    if (!result.isConfirmed) {
      return
    }

    const emailText =
`A new inquiry has been submitted with the following data:

Name: ${formData.name}
Surname: ${formData.surname}
Residence: ${formData.residence}
Email: ${formData.email}
Phone: ${formData.phone}

${formData.licensePlate ? 'License Plate: ' + formData.licensePlate : ''}
${formData.vin ? 'VIN: ' + formData.vin : ''}

Selected Article: ${vehicleSpecs.articleSelection}
Brand: ${vehicleSpecs.brand}
Model: ${vehicleSpecs.model}
Article: ${vehicleSpecs.article}
Year: ${vehicleSpecs.year}
Engine Type: ${vehicleSpecs.engineType}
Displacement: ${vehicleSpecs.displacement}
Fuel Type: ${vehicleSpecs.fuelType}
Transmission: ${vehicleSpecs.transmission}
Body Type: ${vehicleSpecs.bodyType}
Doors: ${vehicleSpecs.doors}

Message:
${message}
`

    const mailData = {
      to: 'autoparts.warehouse@libero.it',
      subject: 'New Inquiry from Drive Parts',
      emailText: emailText,
      userEmail: formData.email,
      isRequestForm: true
    }

    try {
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

      Swal.fire('Mail Sent', 'Your request has been forwarded to all registered sellers. A confirmation has been sent to your email.', 'success')
        .then(() => {
          navigate('/')
        })
    } catch (error) {
      console.error('Error sending mail:', error)
      Swal.fire('Error', error.message || 'Failed to send email', 'error')
    }
  }

  return (
    <div className="request-mail-form">
      <h1 className="main-title">Request</h1>
      <h2 className="form-title">Didn't find the article you were looking for?</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        Enter your vehicle data and contact all of our registered sellers to find what you need!<br />
        The negotiation is private.
      </p>

      {!showMailPreview && (
        <>
          <h3 className="form-title">Personal Information (required)</h3>
          <div className="form-row">
            <label className="form-label">
              Name:
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </label>
            <label className="form-label">
              Surname:
              <input
                type="text"
                className="form-control"
                value={formData.surname}
                onChange={(e) => handleChange('surname', e.target.value)}
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-label">
              Residence/Domicile:
              <input
                type="text"
                className="form-control"
                value={formData.residence}
                onChange={(e) => handleChange('residence', e.target.value)}
              />
            </label>
            <label className="form-label">
              Email:
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </label>
            <label className="form-label">
              Phone:
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </label>
          </div>

          <h3 className="form-title">Optional Information</h3>
          <div className="form-row">
            <label className="form-label">
              License Plate:
              <input
                type="text"
                className="form-control"
                value={formData.licensePlate}
                onChange={(e) => handleChange('licensePlate', e.target.value)}
              />
            </label>
            <label className="form-label">
              VIN:
              <input
                type="text"
                className="form-control"
                value={formData.vin}
                onChange={(e) => handleChange('vin', e.target.value)}
              />
            </label>
          </div>

          <h3 className="form-title">Vehicle Specifications (required)</h3>
          <VehicleSpecifications specs={vehicleSpecs} onChange={handleVehicleChange} title="Vehicle Specifications" />

          <div className="form-row single" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handleGenerateMail}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                marginRight: '20px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Generate Mail
            </button>
            <button
              onClick={handleQuickFill}
              style={{
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
            >
              Quick Fill
            </button>
          </div>
        </>
      )}

      {showMailPreview && (
        <>
          <h3 className="form-title">Mail Preview</h3>
          <div className="form-row single">
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' }}>
              <strong>Name:</strong> {formData.name}<br />
              <strong>Surname:</strong> {formData.surname}<br />
              <strong>Residence/Domicile:</strong> {formData.residence}<br />
              <strong>Email:</strong> {formData.email}<br />
              <strong>Phone:</strong> {formData.phone}<br />

              {(formData.licensePlate || formData.vin) && <br />}

              {formData.licensePlate && (<><strong>License Plate:</strong> {formData.licensePlate}<br /></>)}
              {formData.vin && (<><strong>VIN:</strong> {formData.vin}<br /></>)}

              <br />
              <strong>Selected Article:</strong> {vehicleSpecs.articleSelection}<br />
              <strong>Brand:</strong> {vehicleSpecs.brand}<br />
              <strong>Model:</strong> {vehicleSpecs.model}<br />
              <strong>Article:</strong> {vehicleSpecs.article}<br />
              <strong>Year:</strong> {vehicleSpecs.year}<br />
              <strong>Engine Type:</strong> {vehicleSpecs.engineType}<br />
              <strong>Displacement:</strong> {vehicleSpecs.displacement}<br />
              <strong>Fuel Type:</strong> {vehicleSpecs.fuelType}<br />
              <strong>Transmission:</strong> {vehicleSpecs.transmission}<br />
              <strong>Body Type:</strong> {vehicleSpecs.bodyType}<br />
              <strong>Doors:</strong> {vehicleSpecs.doors}<br />

              <br />
              <textarea
                className="form-control"
                style={{ height: '150px' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={handleBack}
              style={{
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
            >
              Back
            </button>

            <button
              onClick={handleSendMail}
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
            >
              Send mail to all registered sellers
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default RequestMailForm
