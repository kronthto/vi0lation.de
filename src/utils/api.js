export async function handleErrors(response) {
  if (!response.ok) {
    let err = new Error(response.statusText)
    err.response = response
    throw err
  }
  return response
}
