import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { getAllParts, getUserParts, getPartByIdAll, getPartByIdUser } from '../../services/partService'
import PartCard from '../PartCard/PartCard'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import ReactPaginate from 'react-paginate'
import SearchBar from '../SearchBar/SearchBar'
import Swal from 'sweetalert2'
import './PartsPage.css'
import { useNavigate } from 'react-router-dom'

const PartsPage = ({ mode }) => {
  const { token, user } = useContext(UserContext)
  const navigate = useNavigate()

  const [parts, setParts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const [filters, setFilters] = useState({ brand: '', model: '', article: '', partId: '' })

  const title = mode === 'user' ? 'My Parts' : 'All Parts'

  const fetchParts = async (page, currentFilters) => {
    setIsLoading(true)
    try {
      let data
      if (currentFilters.partId && currentFilters.partId.trim() !== '') {


        if (mode === 'user') {
          if (!token || !user) {
            data = { parts: [], currentPage: 1, totalPages: 1 }
          } else {
            data = await getPartByIdUser(currentFilters.partId.trim(), token, user?.id)
          }
        } else {
          data = await getPartByIdAll(currentFilters.partId.trim())
        }
      } else {


        if (mode === 'user') {
          if (!token || !user) {
            data = { parts: [], currentPage: 1, totalPages: 1 }
          } else {
            data = await getUserParts(token, page, 5, currentFilters.brand, currentFilters.model, currentFilters.article)
          }
          
        } else {
          data = await getAllParts({
            brand: currentFilters.brand,
            model: currentFilters.model,
            article: currentFilters.article,
            page,
            limit: 5
          })
        }
      }

      setParts(data.parts)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
      setIsLoading(false)
      window.scrollTo(0, 0)
    } catch (error) {
      console.error('Error fetching parts:', error)
      setIsLoading(false)
      setParts([])
      setCurrentPage(1)
      setTotalPages(1)

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
        Swal.fire('Error', errorMessage || 'Something went wrong', 'error')
      }
    }
  }

  useEffect(() => {
    fetchParts(currentPage, filters)
  }, [currentPage, filters, mode, token, user])

  const handlePageClick = (data) => {
    const newPage = data.selected + 1
    setCurrentPage(newPage)
  }

  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <div className="home-container">
      <SearchBar onFilter={handleFilter} initialFilters={filters} />

      {isLoading && (
        <div className="spinner-overlay">
          <LoadingSpinner />
        </div>
      )}

      <h1 className="main-title">{title}</h1>
      {parts.map(part => (
        <PartCard key={part._id} part={part} />
      ))}

      {totalPages > 1 && parts.length > 0 && (
        <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            forcePage={currentPage - 1}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        </div>
      )}

      {parts.length === 0 && !isLoading && (
        <p>No parts found.</p>
      )}
    </div>
  )
}

export default PartsPage
