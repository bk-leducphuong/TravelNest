<template>
  <!-- Main Content Container -->
  <!-- Normal mode-->
  <div class="section1" style="width: 70%">
    <div class="personal-details-container">
      <!-- Personal Details-->
      <div class="details-section" style="margin-top: 0px !important">
        <div style="display: flex; justify-content: space-between"></div>
        <!--Security settings-->
        <div class="details-section">
          <h1>Security settings</h1>
          <p>Change your security settings, set up secure authentication or delete your account.</p>
        </div>

        <div class="detail-item">
          <label for="Password" style="width: 20%">Password</label>
          <div class="value">Reset your password regularly to keep your account secure</div>
          <button class="edit-button">Reset</button>
        </div>

        <div class="detail-item">
          <label for="Two-factor authentication" style="width: 23%"
            >Two-factor authentication</label
          >
          <div class="value">
            Increase the security of your account by setting up two-factor authentication.
          </div>
          <button class="edit-button">Set up</button>
        </div>

        <div class="detail-item">
          <label for="Active sessions" style="width: 32%">Active sessions</label>
          <div class="value">
            Selecting ‘Sign out’ will sign you out from all devices except this one. The process can
            take up to 10 minutes.
          </div>
          <button class="edit-button">Sign out</button>
        </div>

        <div class="detail-item">
          <label for="Delete account" style="width: 20%">Delete account</label>
          <div class="value">Permanently delete your Booking.com account</div>
          <button class="edit-button">Delete account</button>
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
