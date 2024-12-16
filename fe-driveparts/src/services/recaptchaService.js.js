export const validateRecaptcha = async (recaptchaToken) => {
  const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/recaptcha/validate`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recaptchaToken })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? errorData.errors.join(', ') : errorData.message)
  }

  return await response.json()
}
