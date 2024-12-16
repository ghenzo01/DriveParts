import React from 'react'
import './VehicleSpecifications.css'
import BrandSelector from '../BrandSelector/BrandSelector'
import ModelSelector from '../ModelSelector/ModelSelector'
import ArticleSelector from '../ArticleSelector/ArticleSelector'

const VehicleSpecifications = ({ specs, onChange, title }) => {
  const handleChange = (field, value) => {
    onChange(field, value)
  }

  const years = []
  for (let y = 1970; y <= 2025; y++) {
    years.push(y.toString())
  }

  const transmissions = ['Manual 4-speed', 'Manual 5-speed', 'Manual 6-speed', 'Automatic', 'Semi-Automatic']
  const fuelTypes = ['Petrol', 'Diesel', 'Petrol-Methane', 'Petrol-LPG', 'Petrol-Electric', 'Electric']
  const bodyTypes = ['Sedan', 'Station Wagon', 'Cabrio-Coupè', 'Minivan', 'Multipurpose']
  const doorOptions = ['2', '3', '4', '5']

  return (
    <div className="vehicle-specifications">
      <h2 className="form-title">{title}</h2>

      <div className="form-row">
        <label className="form-label">
          Brand:
          <BrandSelector
            selectedBrand={specs.brand}
            onBrandChange={(val) => handleChange('brand', val)}
          />
        </label>
        <label className="form-label">
          Model:
          <ModelSelector
            selectedBrand={specs.brand}
            selectedModel={specs.model}
            onModelChange={(val) => handleChange('model', val)}
          />
        </label>
        <label className="form-label">
          Article:
          <ArticleSelector
            selectedArticle={specs.article}
            onArticleChange={(val) => handleChange('article', val)}
          />
        </label>
      </div>

      <div className="form-row single">
        <label className="form-label">
          Year:
          <select
            className="form-select"
            value={specs.year}
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label className="form-label">
          Engine Type:
          <input
            type="text"
            className="form-control"
            value={specs.engineType}
            onChange={(e) => handleChange('engineType', e.target.value)}
          />
        </label>
        <label className="form-label">
          Transmission:
          <select
            className="form-select"
            value={specs.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
          >
            <option value="">Select transmission</option>
            {transmissions.map((trans) => (
              <option key={trans} value={trans}>{trans}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label className="form-label">
          Displacement:
          <input
            type="text"
            className="form-control"
            value={specs.displacement}
            onChange={(e) => handleChange('displacement', e.target.value)}
            placeholder="e.g. 1.2"
          />
        </label>
        <label className="form-label">
          Fuel Type:
          <select
            className="form-select"
            value={specs.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
          >
            <option value="">Select fuel type</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label className="form-label">
          Body Type:
          <select
            className="form-select"
            value={specs.bodyType}
            onChange={(e) => handleChange('bodyType', e.target.value)}
          >
            <option value="">Select body type</option>
            {bodyTypes.map((body) => (
              <option key={body} value={body}>{body}</option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Doors:
          <select
            className="form-select"
            value={specs.doors}
            onChange={(e) => handleChange('doors', e.target.value)}
          >
            <option value="">Select doors</option>
            {doorOptions.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

export default VehicleSpecifications
