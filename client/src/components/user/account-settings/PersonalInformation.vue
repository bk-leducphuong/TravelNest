<template>
  <!-- Main Content Container -->
  <!-- Normal mode-->
  <div class="section1" style="width: 70%">
    <div class="personal-details-container">
      <!-- Personal Details-->
      <div class="details-section" style="margin-top: 0px !important">
        <div style="display: flex; justify-content: space-between">
          <span style="width: 70%">
            <h1>Personal details</h1>
            <p>Update your information and find out how it's used.</p>
          </span>
          <button
            style="
              width: 100%;
              width: 100px;
              height: 100px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 100px;
              cursor: pointer;
              border: 3px solid #4285f4;
            "
          >
            avata
          </button>
        </div>
        <div class="detail-item">
          <label for="name" style="width: 20%">Name</label>
          <div class="value">Đăng Đình Khải</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="display-name" style="width: 20%">Display name</label>
          <div class="value">Choose a display name</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="email" style="width: 20%">Email address</label>
          <div class="value">oinguecoolname@gmail.com <span class="verified">Verified</span></div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="phoneNumber" style="width: 20%">Phone number</label>
          <div class="value">+8477326935</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="dob" style="width: 20%">Date of birth</label>
          <div class="value">Enter your date of birth</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="nationality" style="width: 20%">Nationality</label>
          <div class="value">+Vietnam</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="sex" style="width: 20%">Gender</label>
          <div class="value">Select your gender</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="address" style="width: 20%">Address</label>
          <div class="value">Vietnam</div>
          <button class="edit-button">Edit</button>
        </div>
        <div class="detail-item">
          <label for="ppDetail" style="width: 20%">Passport details</label>
          <div class="value">Not provided</div>
          <button class="edit-button">Add passport</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.content h2 {
  font-size: 20px;
  margin-bottom: 10px;
}
.content p {
  color: #666;
  margin-bottom: 10px;
}
.manage-link {
  color: #4285f4;
  text-decoration: none;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.manage-link:hover {
  text-decoration: underline;
  margin-bottom: 10px;
}
.personal-details-container {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  padding-left: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.user-image-container img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.details-section {
  margin-top: 20px;
  flex-grow: 1;
}
.details-section h1 {
  font-size: 30px;
  margin-bottom: 16px;
}
.details-section p {
  color: #666;
  margin-bottom: 24px;
}
.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e6e6e6;
}
.detail-item label {
  font-weight: bold;
  margin-right: 16px;
}
.detail-item .value {
  flex-grow: 1;
  color: #666;
}
.detail-item .verified {
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 8px;
}
.edit-button {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
