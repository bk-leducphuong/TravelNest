<script>
export default {
  data() {
    return {
      formData: {
        streetName: '',
        zipCode: '',
        city: ''
      }
    }
  }
}
</script>
<template>
  <form data-multi-step class="multi-step-form">
    <!--  form-1  -->
    <div class="card" data-step>
      <div class="question">
        <h3 class="title">Chỗ nghỉ Quý vị muốn đăng ký nằm ở đâu?</h3>
      </div>
      <div class="form-group">
        <label for="Street_name">Tên đường và số nhà</label>
        <input type="text" name="Street_name" v-model="formData.streetName" id="Street_name" />
      </div>
      <div class="form-group">
        <label for="zip_code">Mã bưu chính</label>
        <input type="text" name="zip_code" v-model="formData.zipCode" id="zip_code" />
      </div>
      <div class="form-group">
        <label for="city">Thành phố</label>
        <input type="text" name="city" v-model="formData.city" id="city" />
      </div>
      <button type="button" class="next" @click="$emit('next')">Tiếp tục</button>
    </div>
  </form>
</template>
<style scoped></style>
