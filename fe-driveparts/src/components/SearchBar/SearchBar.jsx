import React, { useState, useEffect } from 'react'
import './SearchBar.css'
import BrandSelector from '../BrandSelector/BrandSelector'
import ModelSelector from '../ModelSelector/ModelSelector'
import ArticleSelector from '../ArticleSelector/ArticleSelector'

const SearchBar = ({ onFilter, initialFilters = { brand: '', model: '', article: '', partId: '' } }) => {
  const [filters, setFilters] = useState(initialFilters)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const handleBrandChange = (brand) => {
    setFilters(prev => ({ ...prev, brand, model: '' }))
  }

  const handleModelChange = (model) => {
    setFilters(prev => ({ ...prev, model }))
  }

  const handleArticleChange = (article) => {
    setFilters(prev => ({ ...prev, article }))
  }

  const handlePartIdChange = (e) => {
    setFilters(prev => ({ ...prev, partId: e.target.value }))
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    setFilters({ brand: '', model: '', article: '', partId: '' })
  }

  const isPartIdSearch = filters.partId.trim() !== ''

  return (
    <div className="search-bar">
      <form className="search-bar-form" onSubmit={handleFilterSubmit}>
        <input
          type="text"
          className="part-id-input"
          value={filters.partId}
          onChange={handlePartIdChange}
          placeholder="Insert ID"
        />
        <BrandSelector
          selectedBrand={filters.brand}
          onBrandChange={handleBrandChange}
          disabled={isPartIdSearch}
        />
        <ModelSelector
          selectedBrand={filters.brand}
          selectedModel={filters.model}
          onModelChange={handleModelChange}
          disabled={isPartIdSearch}
        />
        <ArticleSelector
          selectedArticle={filters.article}
          onArticleChange={handleArticleChange}
          disabled={isPartIdSearch}
        />
        <button type="submit" className="btn-filter">Filter</button>
        <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
      </form>
    </div>
  )
}

export default SearchBar
