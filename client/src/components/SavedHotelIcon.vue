<script>
import axios from 'axios'
export default {
  props: {
    hotelId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isFavorite: false
    }
  },
  methods: {
    async saveFavoriteHotel() {
      try {
        if (this.isFavorite) {
          this.deleteFavoriteHotel()
        } else {
          const response = await axios.post(
            'http://localhost:3000/api/user/favorite-hotels/set-favorite-hotel',
            {
              hotelId: this.hotelId
            },
            {
              withCredentials: true
            }
          )
          if (response.data.success) {
            this.isFavorite = true
          }
        }
      } catch (error) {
        console.error(error)
      }
    },
    async checkFavoriteHotel() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/user/favorite-hotels/check-favorite-hotel',
          {
            hotelId: this.hotelId
          },
          {
            withCredentials: true
          }
        )
        if (response.data.isFavorite) {
          this.isFavorite = true
        } else {
          this.isFavorite = false
        }
      } catch (error) {
        console.error(error)
      }
    },
    async deleteFavoriteHotel() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/user/favorite-hotels/delete-favorite-hotel',
          {
            hotelId: this.hotelId
          },
          {
            withCredentials: true
          }
        )
        if (response.data.success) {
            this.isFavorite = false
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  mounted() {
    this.checkFavoriteHotel()
  },
}
</script>
<template>
  <button class="favorite-button" @click.stop="saveFavoriteHotel()">
    <i class="fa-solid fa-heart" style="color: #e70d0d;" v-if="isFavorite"></i>
    <i class="fa-regular fa-heart" v-else></i>
  </button>
</template>
<style scoped>
.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    transform 0.3s;
    z-index: 99;
}

.favorite-button:hover {
  background: #f8f8f8;
  transform: scale(1.1);
}

.favorite-button.active {
  color: red;
}

</style>
