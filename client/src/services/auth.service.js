import http from './http'

export const AuthService = {
  checkSession() {
    return http.get('/api/auth/session')
  },
  login(credentials) {
    return http.post('/api/auth/sessions', credentials)
  },
  logout() {
    return http.delete('/api/auth/sessions')
  },
  checkEmail(data) {
    return http.post('/api/auth/email/check', data)
  },
  register(userData) {
    return http.post('/api/auth/users', userData)
  },
  forgotPassword(data) {
    return http.post('/api/auth/password/forgot', data)
  },
  resetPassword(data) {
    return http.post('/api/auth/password/reset', data)
  },
  loginWithGoogle() {
    window.location.href = `${import.meta.env.VITE_SERVER_HOST}/api/auth/google`
  },
  loginWithFacebook() {
    window.location.href = `${import.meta.env.VITE_SERVER_HOST}/api/auth/facebook`
  },
  loginWithTwitter() {
    window.location.href = `${import.meta.env.VITE_SERVER_HOST}/api/auth/twitter`
  },
  loginWithSocialProvider(provider) {
    return http.get(`/api/auth/login-${provider}`)
  },
  loginAdmin(credentials) {
    return http.post('/api/auth/admin/sessions', credentials)
  },
  registerAdmin(userData) {
    return http.post('/api/auth/admin/users', userData)
  },
  sendSmsOtp(data) {
    return http.post('/api/auth/otp/sms', data)
  },
  verifySmsOtp(data) {
    return http.post('/api/auth/otp/verify', data)
  }
}