import React from 'react'
import './PartSpecifications.css'

const PartSpecifications = ({ specs, onChange, onDrop, onRemoveImage }) => {
  const conditions = ['New', 'Used', 'Reconditioned / Overhauled']

  const handleChange = (field, value) => {
    onChange(field, value)
  }

  return (
    <div className="part-specifications">
      <h2 className="form-title">Part Specifications</h2>

      <div className="form-row">
        <label className="form-label">
          Condition:
          <select
            className="form-select"
            value={specs.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
          >
            <option value="">Select condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Manufacturer Code:
          <input
            type="text"
            className="form-control"
            value={specs.manufacturerCode}
            onChange={(e) => handleChange('manufacturerCode', e.target.value)}
            placeholder="Alphanumeric code"
          />
        </label>
      </div>

      <div className="form-row single">
        <label className="form-label">
          Price (€):
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={specs.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Enter price"
          />
        </label>
      </div>

      <div className="form-row single">
        <label className="form-label">
          Description:
          <textarea
            className="form-control"
            value={specs.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter description"
          />
        </label>
      </div>

      <div className="form-row single">
        <label className="form-label">Part Image (Optional)</label>
        <div className="dropzone">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onDrop(e.target.files)}
          />
          {specs.image && (
            <div className="logo-preview">
              <img
                src={specs.image}
                alt="Uploaded Part"
                className="img-thumbnail"
              />
              <button
                type="button"
                className="remove-logo-btn"
                onClick={onRemoveImage}
                aria-label="Remove Image"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PartSpecifications
