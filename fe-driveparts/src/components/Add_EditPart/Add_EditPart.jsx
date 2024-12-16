import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import { UserContext } from '../../contexts/UserContext'
import { getPartDetails, createPart, updatePart } from '../../services/partService'
import VehicleSpecifications from '../VehicleSpecifications/VehicleSpecifications'
import PartSpecifications from '../PartSpecifications/PartSpecifications'
import './Add_EditPart.css'

const Add_EditPart = ({ mode }) => {
  const { token } = useContext(UserContext)
  const navigate = useNavigate()
  const { id } = useParams()

  const [vehicleSpecs, setVehicleSpecs] = useState({
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

  const [partSpecs, setPartSpecs] = useState({
    condition: '',
    price: '',
    manufacturerCode: '',
    description: '',
    image: null,
  })

  const [partImageFile, setPartImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadPart = async () => {
      if (mode === 'edit' && id) {
        try {
          const data = await getPartDetails(id, token)
          const p = data.part
          setVehicleSpecs({
            brand: p.brand,
            model: p.model,
            article: p.article,
            year: p.year,
            engineType: p.engineType,
            displacement: p.displacement,
            fuelType: p.fuelType,
            transmission: p.transmission,
            bodyType: p.bodyType,
            doors: p.doors,
          })

          setPartSpecs({
            condition: p.condition,
            price: p.price.toString(),
            manufacturerCode: p.manufacturerCode,
            description: p.description,
            image: p.image || null,
          })
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
        }
      }
    }
    loadPart()
  }, [mode, id, token, navigate])

  const handleVehicleChange = (field, value) => {
    setVehicleSpecs((prev) => ({ ...prev, [field]: value }))
  }

  const handlePartChange = (field, value) => {
    setPartSpecs((prev) => ({ ...prev, [field]: value }))
  }

  const onDropPartImage = async (files) => {
    const file = files[0]
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/webp')) {
      setPartImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        handlePartChange('image', reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      Swal.fire('Error', 'Only PNG, JPG, JPEG and WEBP image files are allowed!', 'error')
    }
  }

  const handleRemoveImage = () => {
    setPartImageFile(null)
    handlePartChange('image', null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      Object.values(vehicleSpecs).some(v => !v) ||
      Object.values(partSpecs).some(v => v === '' || v === null)
    ) {
      Swal.fire('Error', 'All fields are required.', 'error')
      return
    }

    const confirmMessage = mode === 'add'
      ? 'Are you sure you want to add this part?'
      : 'Are you sure you want to save the changes?'

    const confirmButtonText = mode === 'add' ? 'Yes' : 'Confirm changes'

    const result = await Swal.fire({
      title: 'Confirmation',
      text: confirmMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
    })

    if (!result.isConfirmed) return

    setIsSubmitting(true)

    try {
      const partData = {
        ...vehicleSpecs,
        ...partSpecs,
        image: null,
        price: parseFloat(partSpecs.price)
      }

      let response
      if (mode === 'add') {
        response = await createPart(partData, token)
      } else {
        response = await updatePart(id, partData, token)
      }

      const partId = mode === 'add' ? response.part._id : id

      if (partImageFile) {
        const formData = new FormData()
        formData.append('image', partImageFile)

        const uploadResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/parts/uploadImage/${partId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'authorization': token,
          },
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.message || 'Failed to upload part image')
        }

        await uploadResponse.json()
      }

      setIsSubmitting(false)

      if (mode === 'add') {
        Swal.fire({
          title: 'Part created successfully!',
          text: 'What would you like to do next?',
          icon: 'success',
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: 'Add another part for this vehicle',
          denyButtonText: 'View part',
          cancelButtonText: 'View My Parts'
        }).then((actionResult) => {
          if (actionResult.isConfirmed) {
            setPartSpecs({
              condition: '',
              price: '',
              manufacturerCode: '',
              description: '',
              image: null,
            })
            setPartImageFile(null)
          } else if (actionResult.isDenied) {
            navigate(`/part-details/${partId}`)
          } else {
            navigate('/my-parts')
          }
        })
      } else {
        Swal.fire('Success', 'Part updated successfully!', 'success')
          .then(() => {
            navigate(`/part-details/${partId}`)
          })
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
    setVehicleSpecs({
      brand: 'Ford',
      model: 'Focus',
      article: 'engine',
      year: '2015',
      engineType: 'Petrol',
      displacement: '1.6',
      fuelType: 'Petrol',
      transmission: 'Manual 5-speed',
      bodyType: 'Sedan',
      doors: '4',
    })

    setPartSpecs({
      condition: 'Used',
      price: '250',
      manufacturerCode: 'ENG123',
      description: 'Working engine in good condition, tested and verified.',
      image: null,
    })
  }

  return (
    <div className="add-edit-part-container">
      {isSubmitting && (
        <div className="spinner-overlay">
          <LoadingSpinner />
        </div>
      )}
      <h1 className="main-title">{mode === 'add' ? 'Add Part' : 'Save Changes'}</h1>
      <form onSubmit={handleSubmit} className="add-edit-part-form">
        <VehicleSpecifications specs={vehicleSpecs} onChange={handleVehicleChange} title="Vehicle Compatibility / Origin" />
        <PartSpecifications specs={partSpecs} onChange={handlePartChange} onDrop={onDropPartImage} onRemoveImage={handleRemoveImage} />
        
        <div className="buttons-row">
          <button type="submit" className="submit-button">
            {mode === 'add' ? 'Add Part' : 'Save Changes'}
          </button>
          {mode === 'add' && (
            <button
              type="button"
              className="btn-quick-fill"
              onClick={handleQuickFill}
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

export default Add_EditPart
