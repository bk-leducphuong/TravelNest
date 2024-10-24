<script>
import axios from 'axios'

export default {
  props: ['location', 'startDate', 'endDate', 'adults', 'children', 'rooms'],
  data() {
    return {
      hotels: [] // Kết quả tìm kiếm sẽ được lưu ở đây
    }
  },
  created() {
    this.searchHotels()
  },
  methods: {
    async searchHotels() {
      try {
        const response = await axios.post('http://localhost:3000/api/hotels/search', {
          location: this.selectedLocation,
          dateRange: this.dateRange,
          adults: this.adults,
          children: this.children,
          rooms: this.rooms
        })
        
        this.hotels = response.data
      } catch (error) {
        console.error('Lỗi khi tìm kiếm khách sạn:', error)
      }
    }
  }
}
</script>
<template>
  <h1>No available</h1>
</template>
<style></style>
