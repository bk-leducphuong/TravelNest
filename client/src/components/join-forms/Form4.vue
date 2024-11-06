<script>
export default {
  data() {
    return {
      formData: {}
    }
  }
}
</script>
<template>
  <form class="multi-step-form">
    <div class="card" >
      <h3 class="title">Cho chúng tôi biết thêm về khách sạn của quý vị</h3>
      <div class="form-group">
        <h4 class="step-title">Khách sạn của Quý vị tên gì?</h4>
        <label for="alt-name">Tên chỗ nghỉ</label>
        <input type="text" name="alt-name" id="alt-name" />
        <p class="sub-title">Tên này sẽ được hiển thị tới khách khi họ tìm kiếm chỗ nghỉ.</p>
      </div>
      <hr class="divider" />
      <div class="rating-form">
        <h3>Khách sạn của Quý vị được xếp hạng mấy sao?</h3>
        <div class="rating-options">
          <label class="rating-option">
            <input type="radio" name="rating" value="none" checked />
            <span class="radio-custom"></span>
            <span class="label-text">Không áp dụng</span>
          </label>

          <label class="rating-option">
            <input type="radio" name="rating" value="1" />
            <span class="radio-custom"></span>
            <span class="label-text">1 sao</span>
            <span class="stars">⭐</span>
          </label>

          <label class="rating-option">
            <input type="radio" name="rating" value="2" />
            <span class="radio-custom"></span>
            <span class="label-text">2 sao</span>
            <span class="stars">⭐⭐</span>
          </label>

          <label class="rating-option">
            <input type="radio" name="rating" value="3" />
            <span class="radio-custom"></span>
            <span class="label-text">3 sao</span>
            <span class="stars">⭐⭐⭐</span>
          </label>

          <label class="rating-option">
            <input type="radio" name="rating" value="4" />
            <span class="radio-custom"></span>
            <span class="label-text">4 sao</span>
            <span class="stars">⭐⭐⭐⭐</span>
          </label>

          <label class="rating-option">
            <input type="radio" name="rating" value="5" />
            <span class="radio-custom"></span>
            <span class="label-text">5 sao</span>
            <span class="stars">⭐⭐⭐⭐⭐</span>
          </label>
        </div>
      </div>
      <div class="form-button-container">
        <button type="button" class="previous" @click="$emit('previous')">Quay lại</button>
        <button type="button" class="next" @click="$emit('next')">Tiếp tục</button>
      </div>
    </div>
  </form>
</template>
<style scoped></style>
