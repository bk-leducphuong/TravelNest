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
    <div class="card" data-step>
      <div class="question">
        <h3 class="title">Khách có thể sử dụng gì tại khách sạn của Quý vị?</h3>
      </div>
      <div class="facilities-group">
        <label class="facility-item">
          <input type="checkbox" name="facilities" value="restaurant" />
          <span class="checkbox-custom"></span>
          <span>Nhà hàng</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="room-service" />
          <span class="checkbox-custom"></span>
          <span>Dịch vụ phòng</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="bar" />
          <span class="checkbox-custom"></span>
          <span>Quầy bar</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="24h-service" />
          <span class="checkbox-custom"></span>
          <span>Lễ tân 24 giờ</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="sauna" />
          <span class="checkbox-custom"></span>
          <span>Phòng xông hơi</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="fitness" />
          <span class="checkbox-custom"></span>
          <span>Trung tâm thể dục</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="garden" />
          <span class="checkbox-custom"></span>
          <span>Sân vườn</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="terrace" />
          <span class="checkbox-custom"></span>
          <span>Sân thượng / hiên</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="non-smoking" />
          <span class="checkbox-custom"></span>
          <span>Phòng không hút thuốc</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="airport-shuttle" />
          <span class="checkbox-custom"></span>
          <span>Xe đưa đón sân bay</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="family-room" />
          <span class="checkbox-custom"></span>
          <span>Phòng gia đình</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="spa" />
          <span class="checkbox-custom"></span>
          <span>Trung tâm Spa & chăm sóc sức khỏe</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="jacuzzi" />
          <span class="checkbox-custom"></span>
          <span>Bồn tắm nóng/bể sục (Jacuzzi)</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="free-wifi" />
          <span class="checkbox-custom"></span>
          <span>WiFi miễn phí</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="air-conditioning" />
          <span class="checkbox-custom"></span>
          <span>Điều hòa nhiệt độ</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="water-park" />
          <span class="checkbox-custom"></span>
          <span>Công viên nước</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="ev-station" />
          <span class="checkbox-custom"></span>
          <span>Trạm sạc xe điện</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="pool" />
          <span class="checkbox-custom"></span>
          <span>Hồ bơi</span>
        </label>

        <label class="facility-item">
          <input type="checkbox" name="facilities" value="beach" />
          <span class="checkbox-custom"></span>
          <span>Bãi biển</span>
        </label>
      </div>
      <div class="form-button-container">
        <button type="button" class="previous" @click="$emit('previous')">Quay lại</button>
        <button type="button" class="next" @click="$emit('next')">Tiếp tục</button>
      </div>
    </div>
  </form>
</template>
<style scoped></style>
