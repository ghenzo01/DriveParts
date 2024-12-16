import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { UserContext } from '../../contexts/UserContext'
import { loginUser, fetchLogo } from '../../services/userService'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)
  const { login } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    const getLogo = async () => {
      try {
        const logo = await fetchLogo()
        setLogoUrl(logo)
      } catch (error) {
        console.error('Failed to fetch logo:', error)
      }
    }

    getLogo()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { token, user } = await loginUser(formData)
      login(token, user)
      Swal.fire('Success', 'Login successful!', 'success')
      setIsSubmitting(false)
      navigate('/')
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to login', 'error')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container my-5">
      {isSubmitting && <div className="spinner-overlay"><LoadingSpinner /></div>}
      {logoUrl && (
        <div className="text-center mb-4">
          <img src={logoUrl} alt="Company Logo" className="company-logo" />
        </div>
      )}
      <h1 className="main-title mb-4">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary px-5"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
