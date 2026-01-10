import http from './http'

export const NotificationService = {
  getNotifications(params = {}) {
    return http.get('/api/notifications', { params })
  },

  getUnreadCount() {
    return http.get('/api/notifications/unread-count')
  },

  markAllAsRead() {
    return http.patch('/api/notifications/read-all')
  },

  markAsRead(notificationId) {
    return http.patch(`/api/notifications/${notificationId}/read`)
  }
}
