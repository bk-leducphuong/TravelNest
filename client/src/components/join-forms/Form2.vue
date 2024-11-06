<script>
export default {
  data() {
    return {
      formData: {
        
      }
    }
  }
}
</script>
<template>
  <form class="multi-step-form">
    <!--  form-2  -->
    <div class="card">
      <div class="map-section">
        <h1 class="title">Ghim vị trí chỗ nghỉ quý vị</h1>
        <p class="sub-title">
          Đây là vị trí mà khách sẽ thấy trên trang web của chúng tôi. Di chuyển bản đồ để tìm vị
          trí chính xác của chỗ nghỉ, sau đó nhấn để thả ghim.
        </p>
        <div class="map-container">
          <img
            src=""
            alt="Map placeholder"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </div>
      </div>
      <div class="form-button-container">
        <button type="button" class="previous" @click="$emit('previous')">Quay lại</button>
        <button type="button" class="next" @click="$emit('next')">Tiếp tục</button>
      </div>
    </div>
  </form>
  <!--  form-2  -->
</template>
<style scoped></style>
