<script>
import axios from 'axios';

export default {
    data() {
        return {
            hotel_id: null,
        }
    },
    methods: {
        async getHotelDetails() {

            const response = await axios.get(`http://localhost:3000/api/hotels/${this.hotel_id}`);
            console.log(response.data)
        }
    },
    mounted() {
        this.hotel_id = this.$route.params.hotel_id
        // Fetch hotel details using hotelId
        this.getHotelDetails()
    }
}
</script>
<template>
    <h1>No available</h1>
</template>

<style scoped></style>
