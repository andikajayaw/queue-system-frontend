export const useLogin = async (username: string, password: string) => {
  const { data, error } = await useFetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { username, password },
  })

  if (error.value) {
    throw new Error(error.value.data?.message || 'Login gagal')
  }

  const token = data.value
  if (!token) {
    throw new Error('Token tidak ditemukan')
  }

  // Simpan token di cookie
  const cookie = useCookie('token')
  cookie.value = token

  return token
}