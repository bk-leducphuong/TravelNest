import http from './http'

export const JoinService = {
  submitJoinForm(joinFormData) {
    return http.post('/api/join', { joinFormData })
  },

  uploadPhotos(formData) {
    return http.post('/api/join/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
