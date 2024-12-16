import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { uploadLogo, createUser, updateUser } from '../../services/userService'
import { UserContext } from '../../contexts/UserContext'
import './Register.css'

const Register = ({ mode = 'add' }) => {
  const navigate = useNavigate()
  const { user, token, setUser } = useContext(UserContext)

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    vatId: '',
    businessType: '',
    phone: '',
    whatsApp: '',
    website: '',
    promotionalPhrase: '',
    businessDescription: '',
    logoPreview: null,
    logo: null,
  })

  const [logoFile, setLogoFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp']

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        businessName: user.businessName || '',
        email: user.email || '',
        password: '',
        vatId: user.vatId || '',
        businessType: user.businessType || '',
        phone: user.phone || '',
        whatsApp: user.whatsApp || '',
        website: user.website || '',
        promotionalPhrase: user.promotionalPhrase || '',
        businessDescription: user.businessDescription || '',
        logoPreview: user.logo || null,
        logo: user.logo || null,
      })
    }
  }, [mode, user])

  const onDrop = (files) => {
    const file = files[0]
    if (!file) return

    const extension = file.name.split('.').pop().toLowerCase()
    if (allowedExtensions.includes(extension)) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, logoPreview: reader.result }))
      }
      reader.readAsDataURL(file)
    } else {
      Swal.fire('Error', 'Only PNG, JPG, JPEG and WEBP image files are allowed!', 'error')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (mode === 'edit' && (name === 'email' || name === 'password')) {
      return
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleRemoveLogo = () => {
    setLogoFile(null)
    setFormData((prevData) => ({ ...prevData, logoPreview: null, logo: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userData = { ...formData }
      delete userData.logoPreview

      if (mode === 'add') {
        let logoPath = null
        if (logoFile) {
          const uploadResponse = await uploadLogo(logoFile)
          logoPath = uploadResponse.logoPath
          userData.logo = logoPath
        }
        const createResponse = await createUser(userData)
        Swal.fire('Success', 'User registered successfully!', 'success')
        setIsSubmitting(false)
        navigate('/')
      } else {
        // mode === 'edit' richiede token
        if (!token) {
          Swal.fire({
            title: 'Session expired',
            text: 'Your session token is expired or not valid. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/login')
          })
          setIsSubmitting(false)
          return
        }

        if (logoFile) {
          const uploadResponse = await uploadLogo(logoFile)
          const logoPath = uploadResponse.logoPath
          userData.logo = logoPath
        } else {
          userData.logo = user?.logo || null
        }

        delete userData.email
        delete userData.password

        const updateResponse = await updateUser(token, userData)
        setUser(updateResponse.user)

        Swal.fire('Success', 'User updated successfully!', 'success')
        setIsSubmitting(false)
        navigate('/my-profile')
      }
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.join('<br>')
        Swal.fire('Error', errorMessages, 'error')
      } else {
        const errorMessage = error.message || 'Something went wrong'
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
          Swal.fire('Error', errorMessage, 'error')
        }
      }
      setIsSubmitting(false)
    }
  }

  const handleQuickFill = () => {
    setFormData((prev) => ({
      ...prev,
      businessName: "Rick's Auto Parts",
      email: mode === 'add' ? 'ricksauto@example.com' : prev.email,
      vatId: 'IT1234567890',
      businessType: 'trader',
      phone: '0123456789',
      whatsApp: '0123456789',
      website: 'http://www.ricksautopart.com/',
      promotionalPhrase: 'Quality Parts at the Best Price',
      businessDescription: 'We specialize in providing top-notch car parts and accessories.'
    }))
  }

  return (
    <div className="container my-5">
      {isSubmitting && <div className="spinner-overlay"><LoadingSpinner /></div>}
      <h1 className="main-title mb-4">{mode === 'edit' ? 'Edit Profile' : 'Register'}</h1>
      <form className="register-form" onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="businessName" className="form-label">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            className="form-control"
            value={formData.businessName}
            onChange={handleInputChange}
            required
          />
        </div>

        {mode === 'add' && (
          <>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <div className="mb-3">
          <label htmlFor="vatId" className="form-label">
            VAT ID *
          </label>
          <input
            type="text"
            id="vatId"
            name="vatId"
            className="form-control"
            value={formData.vatId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="businessType" className="form-label">
            Business Type *
          </label>
          <select
            id="businessType"
            name="businessType"
            className="form-select"
            value={formData.businessType}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select your business type</option>
            <option value="shop">Shop</option>
            <option value="workshop">Workshop</option>
            <option value="trader">Trader</option>
            <option value="car dismantler">Car Dismantler</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone *
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="whatsApp" className="form-label">
            WhatsApp
          </label>
          <input
            type="text"
            id="whatsApp"
            name="whatsApp"
            className="form-control"
            value={formData.whatsApp}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="website" className="form-label">
            Website
          </label>
          <input
            type="text"
            id="website"
            name="website"
            className="form-control"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="promotionalPhrase" className="form-label">
            Promotional Phrase
          </label>
          <input
            type="text"
            id="promotionalPhrase"
            name="promotionalPhrase"
            className="form-control"
            value={formData.promotionalPhrase}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="businessDescription" className="form-label">
            Business Description
          </label>
          <textarea
            id="businessDescription"
            name="businessDescription"
            className="form-control"
            value={formData.businessDescription}
            onChange={handleInputChange}
            rows={5}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Company Logo (Optional)</label>
          <div className="dropzone">
            <input
              type="file"
              onChange={(e) => onDrop(e.target.files)}
              accept=".png,.jpg,.jpeg,.webp"
            />
            {formData.logoPreview && (
              <div className="logo-preview">
                <img
                  src={formData.logoPreview}
                  alt="Uploaded Logo"
                  className="img-thumbnail"
                />
                <button
                  type="button"
                  className="remove-logo-btn"
                  onClick={handleRemoveLogo}
                  aria-label="Remove Logo"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button
            type="submit"
            className="btn btn-primary px-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? (mode === 'edit' ? 'Updating...' : 'Registering...') : (mode === 'edit' ? 'Update' : 'Register')}
          </button>

          {mode === 'add' && (
            <button
              type="button"
              className="btn btn-secondary px-5"
              onClick={handleQuickFill}
              style={{ backgroundColor: '#6c757d' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
            >
              Quick Fill
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default Register
