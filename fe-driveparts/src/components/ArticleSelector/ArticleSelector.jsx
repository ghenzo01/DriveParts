import React from 'react'
import { articles } from '../../data/selectorsData'

const ArticleSelector = ({ selectedArticle, onArticleChange, disabled }) => {
  return (
    <select
      value={selectedArticle}
      onChange={(e) => onArticleChange(e.target.value)}
      className="article-selector"
      disabled={disabled}
    >
      <option value="">Select article</option>
      {articles.map((article) => (
        <option key={article} value={article}>
          {article}
        </option>
      ))}
    </select>
  )
}

export default ArticleSelector
