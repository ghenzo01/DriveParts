const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

export const uploadPartImage = async (file, token, partId) => {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${BASE_URL}/parts/uploadImage/${partId}`, {
    method: 'POST',
    body: formData,
    headers: {
      'authorization': token,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to upload part image')
  }

  return await response.json()
}

export const createPart = async (partData, token) => {
  const response = await fetch(`${BASE_URL}/parts/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token,
    },
    body: JSON.stringify(partData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Server response error (Part):', errorData)
    throw errorData
  }

  return await response.json()
}

export const getUserParts = async (token, page = 1, limit = 5, brand = '', model = '', article = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  if (brand) params.append('brand', brand)
  if (model) params.append('model', model)
  if (article) params.append('article', article)

  const response = await fetch(`${BASE_URL}/parts/user?${params.toString()}`, {
    headers: {
      'authorization': token,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch user parts')
  }

  return await response.json()
}

export const getAllParts = async ({ brand = '', model = '', article = '', page = 1, limit = 5 }) => {
  const params = new URLSearchParams({
    brand,
    model,
    article,
    page: page.toString(),
    limit: limit.toString()
  })

  const response = await fetch(`${BASE_URL}/parts/all?${params.toString()}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch all parts')
  }
  return await response.json()
}

export const getPartDetails = async (partId, token) => {
  const headers = token ? { 'authorization': token } : {}
  const response = await fetch(`${BASE_URL}/parts/details/${partId}`, {
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to fetch part details')
  }

  return await response.json()
}

export const updatePart = async (partId, partData, token) => {
  const response = await fetch(`${BASE_URL}/parts/update/${partId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token,
    },
    body: JSON.stringify(partData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Server response error (Update Part):', errorData)
    throw errorData
  }

  return await response.json()
}

export const deletePart = async (partId, token) => {
  const response = await fetch(`${BASE_URL}/parts/delete/${partId}`, {
    method: 'DELETE',
    headers: {
      'authorization': token,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to delete part')
  }

  return await response.json()
}

export const getPartByIdAll = async (partId) => {
  const data = await getPartDetails(partId)
  return data.part ? { parts: [data.part], currentPage: 1, totalPages: 1 } : { parts: [], currentPage: 1, totalPages: 1 }
}

export const getPartByIdUser = async (partId, token, currentUserId) => {
  const data = await getPartDetails(partId, token)
  if (data.part && data.part.user && data.part.user._id === currentUserId) {
    return { parts: [data.part], currentPage: 1, totalPages: 1 }
  } else {

    return { parts: [], currentPage: 1, totalPages: 1 }
  }
}