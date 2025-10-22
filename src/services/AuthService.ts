import axios from '@/services/AxiosClient'

export interface LoginPayload {
  username: string
  password: string
}

export interface RegistrationPayload {
  username: string
  password: string
  name: string
  surname: string
  email: string
}

export async function login(payload: LoginPayload) {
  return axios.post('/auth/login', payload)
}
export async function registration(payload: RegistrationPayload) {
  return axios.post('/auth/register', payload)
}
