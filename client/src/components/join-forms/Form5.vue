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
    <!--  form-5  -->
    <div class="card" >
      <h2 class="title">Quy định chung</h2>

      <div class="form-section">
        <h3 class="step-title">Giờ nhận/trả phòng của Quý vị là khi nào?</h3>
        <div class="time-group">
          <div class="check-time">
            <label>Nhận phòng</label>
            <div class="time-inputs">
              <div class="time-input">
                <select class="time-select" id="checkInFrom"></select>
                <label class="sub-label" for="checkInFrom">Từ</label>
              </div>
              <div class="time-input">
                <select class="time-select" id="checkInTo"></select>
                <label class="sub-label" for="checkInTo">Đến</label>
              </div>
            </div>
          </div>
          <div class="check-time">
            <label>Trả phòng</label>
            <div class="time-inputs">
              <div class="time-input">
                <select class="time-select" id="checkOutFrom"></select>
                <label class="sub-label" for="checkOutFrom">Từ</label>
              </div>
              <div class="time-input">
                <select class="time-select" id="checkOutTo"></select>
                <label class="sub-label" for="checkOutTo">Đến</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <hr style="border: 1px solid #ddd; margin: 20px 0;"> -->
      <hr style="border-top: 1px solid #e7e7e7; margin: 16px 0" />

      <div class="form-section">
        <h3 class="sub-title">Quý vị có tiếp đón trẻ em không?</h3>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="children" value="yes" checked />
            <span class="radio-custom"></span>
            <span>Có</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="children" value="no" />
            <span class="radio-custom"></span>
            <span>Không</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h3 class="sub-title">Quý vị có cho phép vật nuôi không?</h3>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="pets" value="yes" />
            <span class="radio-custom"></span>
            <span>Có</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="pets" value="request" />
            <span class="radio-custom"></span>
            <span>Theo yêu cầu</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="pets" value="no" checked />
            <span class="radio-custom"></span>
            <span>Không</span>
          </label>
        </div>
      </div>
      <div class="form-button-container">
        <button type="button" class="previous" @click="$emit('previous')">Quay lại</button>
        <button type="button" class="next" @click="$emit('next')">Tiếp tục</button>
      </div>
    </div>
    <!--  form-5  -->
  </form>
</template>
<style scoped></style>
