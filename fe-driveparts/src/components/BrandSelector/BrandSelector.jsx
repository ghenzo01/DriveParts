import React from 'react'
import { brands } from '../../data/selectorsData'

const BrandSelector = ({ selectedBrand, onBrandChange, disabled }) => {
  return (
    <select
      value={selectedBrand}
      onChange={(e) => onBrandChange(e.target.value)}
      className="brand-selector"
      disabled={disabled}
    >
      <option value="">Select brand</option>
      {brands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>
  )
}

export default BrandSelector
