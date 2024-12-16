import React from 'react'
import { modelsByBrand } from '../../data/selectorsData'

const ModelSelector = ({ selectedBrand, selectedModel, onModelChange, disabled }) => {
  const models = selectedBrand ? modelsByBrand[selectedBrand] || [] : []

  const finalDisabled = disabled || !selectedBrand

  return (
    <select
      value={selectedModel}
      onChange={(e) => onModelChange(e.target.value)}
      className="model-selector"
      disabled={finalDisabled}
    >
      <option value="">Select model</option>
      {models.map((model) => (
        <option key={model} value={model}>
          {model}
        </option>
      ))}
    </select>
  )
}

export default ModelSelector
