const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

export const uploadLogo = async (file) => {
  const formData = new FormData()
  formData.append('logo', file)

  const response = await fetch(`${BASE_URL}/users/uploadLogo`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to upload logo')
  }

  return await response.json()
}

export const createUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/users/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Server response error:', errorData)
    throw errorData
  }

  return await response.json()
}

export const updateUserLogo = async (userId, logoPath) => {
  const response = await fetch(`${BASE_URL}/users/updateLogo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, logoPath }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Server response error (updateLogo):', errorData)
    throw errorData
  }

  return await response.json()
}

export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to login')
  }

  return await response.json()
}

export const fetchLogo = async (authToken) => {
  const response = await fetch(`${BASE_URL}/users/logo`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user logo')
  }

  const data = await response.json()
  return data.logoUrl
}

export const getUserDetails = async (token) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      'authorization': token,
    },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw errorData
  }
  return await response.json()
}


export const updateUser = async (token, userData) => {
  const response = await fetch(`${BASE_URL}/users/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token,
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw errorData
  }

  return await response.json()
}
