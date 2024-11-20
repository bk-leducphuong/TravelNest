<script>
import DashboardMenu from '@/components/admin/DashboardMenu.vue'
import AdminHeader from '@/components/admin/AdminHeader.vue'

import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  components: {
    DashboardMenu,
    AdminHeader
  },
  data() {
    return {
      accountCreatePending: false,
      accountLinkCreatePending: false,
      error: false,
      connectedAccountId: null
    }
  },
  computed: {
    ...mapGetters[('auth', 'getEmail')]
  },
  methods: {
    async checkAccountExist() {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/admin/payout/check-account-exist',
          {
            withCredentials: true
          }
        )

        if (response.data.exist) {
          this.connectedAccountId = response.data.connect_account_id
          return true
        } else {
          this.connectedAccountId = null
          return false
        }
      } catch (error) {
        console.log(error)
      }
    },
    async createAccount() {
      try {
        if (!await this.checkAccountExist()) {
          this.accountCreatePending = true
          this.error = false

          const response = await axios.post(
            'http://localhost:3000/api/admin/payout/create-connect-account',
            { email: this.getEmail },
            {
              withCredentials: true
            }
          )

          this.accountCreatePending = false
          this.connectedAccountId = response.data.connectedAccountId
        }

        console.log(this.connectedAccountId)

        // redirect to account onboarding page
        await this.createAccountLink()
      } catch (error) {
        console.log(error)
      }
    },
    async createAccountLink() {
      try {
        this.accountLinkCreatePending = true
        this.error = false
        const response = await axios.post(
          'http://localhost:3000/api/admin/payout/create-account-link',
          {
            connectedAccountId: this.connectedAccountId
          },
          {
            withCredentials: true
          }
        )

        this.accountLinkCreatePending = false
        const url = response.data.url
        if (url) {
          window.location.href = url
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
<template>
  <div class="payment-container">
    <DashboardMenu />
    <div class="main-wrapper">
      <AdminHeader />

      <!--Title-->
      <div class="title">
        <div class="container">
          <div class="title-total">
            <div class="title-method">
              <h2>Paymen Methods</h2>
              <p>Here is the procedure of paymeny</p>
            </div>
            <div class="title-add">
              <button @click="createAccount"><i class="fa-solid fa-plus"></i></button>
              <div class="title-add-method">
                <p class="cmd-add">Add Payment Method</p>
                <p>Import Payment Method</p>
              </div>
              <div class="over-lay"></div>
              <div class="title-form">
                <form action="">
                  <p>Add Payment Method</p>
                  <div class="row">
                    <div class="col-lg-6 col-12">
                      <label for="name"><strong>Payment Name</strong></label>
                      <input
                        id="name"
                        class="form-control"
                        type="text"
                        placeholder="Payment Name"
                      />
                    </div>
                    <div class="col-lg-6 col-12">
                      <label for="email"><strong>Email</strong></label>
                      <input
                        id="email"
                        placeholder="example@email.com"
                        class="form-control"
                        type="email"
                      />
                    </div>
                    <div class="col-lg-6 col-12">
                      <label for="id"><strong>Merchant Id</strong></label>
                      <input id="id" placeholder="Merchant Id" class="form-control" type="text" />
                    </div>
                    <div class="col-lg-6 col-12">
                      <label for="usd"><strong>Currency</strong></label>
                      <input id="usd" placeholder="USD" class="form-control" type="text" />
                    </div>
                    <div class="col-lg-6 col-12">
                      <label for="status"><strong>Status</strong></label>
                      <select name="status" class="form-control">
                        <option value="active">Active</option>
                        <option value="Intive">Intive</option>
                      </select>
                    </div>
                  </div>
                  <button class="add-method">Add Payment Method</button>
                  <button class="cancel">Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--End Title-->

      <!--Table-->
      <div class="table">
        <div class="container">
          <div class="table-total">
            <div class="table-title">
              <p>Payment Method's</p>
              <div class="table-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
                <i class="fa-solid fa-bars"></i>
                <i class="fa-solid fa-gear"></i>
              </div>
            </div>
            <div class="table-content">
              <table>
                <thead>
                  <tr>
                    <td>SL</td>
                    <td>PAYMENT NAME</td>
                    <td>EMAIL</td>
                    <td>MARCHANT ID</td>
                    <td>CURRENCY SETTING</td>
                    <td>STATUS</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="number">1</td>
                    <td>
                      <p>Paypal</p>
                    </td>
                    <td>info@softnio.com</td>
                    <td>MNB68</td>
                    <td class="money">USD</td>
                    <td class="status">Active</td>
                    <td class="setting">
                      <i class="fa-solid fa-ellipsis"></i>
                      <div class="update-method">
                        <p class="cmd-update">Update</p>
                        <p class="cmd-remove">Remove</p>
                      </div>
                      <div class="over-lay"></div>
                      <div class="title-form">
                        <form action="">
                          <p>Add Payment Method</p>
                          <div class="row">
                            <div class="col-lg-6 col-12">
                              <label for="name"><strong>Payment Name</strong></label>
                              <input
                                id="name"
                                class="form-control"
                                type="text"
                                placeholder="Payment Name"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="email"><strong>Email</strong></label>
                              <input
                                id="email"
                                placeholder="example@email.com"
                                class="form-control"
                                type="email"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="id"><strong>Merchant Id</strong></label>
                              <input
                                id="id"
                                placeholder="Merchant Id"
                                class="form-control"
                                type="text"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="usd"><strong>Currency</strong></label>
                              <input id="usd" placeholder="USD" class="form-control" type="text" />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="status"><strong>Status</strong></label>
                              <select name="status" class="form-control">
                                <option value="active">Active</option>
                                <option value="Intive">Intive</option>
                              </select>
                            </div>
                          </div>
                          <button class="add-method">Add Payment Method</button>
                          <button class="cancel">Cancel</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="number">2</td>
                    <td>
                      <p>Paypal Hostel</p>
                    </td>
                    <td>info@softnio.com</td>
                    <td>MNB68</td>
                    <td class="money">USD</td>
                    <td class="status">Active</td>
                    <td class="setting">
                      <i class="fa-solid fa-ellipsis"></i>
                      <div class="update-method">
                        <p class="cmd-update">Update</p>
                        <p class="cmd-remove">Remove</p>
                      </div>
                      <div class="over-lay"></div>
                      <div class="title-form">
                        <form action="">
                          <p>Add Payment Method</p>
                          <div class="row">
                            <div class="col-lg-6 col-12">
                              <label for="name"><strong>Payment Name</strong></label>
                              <input
                                id="name"
                                class="form-control"
                                type="text"
                                placeholder="Payment Name"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="email"><strong>Email</strong></label>
                              <input
                                id="email"
                                placeholder="example@email.com"
                                class="form-control"
                                type="email"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="id"><strong>Merchant Id</strong></label>
                              <input
                                id="id"
                                placeholder="Merchant Id"
                                class="form-control"
                                type="text"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="usd"><strong>Currency</strong></label>
                              <input id="usd" placeholder="USD" class="form-control" type="text" />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="status"><strong>Status</strong></label>
                              <select name="status" class="form-control">
                                <option value="active">Active</option>
                                <option value="Intive">Intive</option>
                              </select>
                            </div>
                          </div>
                          <button class="add-method">Add Payment Method</button>
                          <button class="cancel">Cancel</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="number">3</td>
                    <td>
                      <p>Cash</p>
                    </td>
                    <td>info@softnio.com</td>
                    <td>MNB68</td>
                    <td class="money">USD</td>
                    <td class="status">Active</td>
                    <td class="setting">
                      <i class="fa-solid fa-ellipsis"></i>
                      <div class="update-method">
                        <p class="cmd-update">Update</p>
                        <p class="cmd-remove">Remove</p>
                      </div>
                      <div class="over-lay"></div>
                      <div class="title-form">
                        <form action="">
                          <p>Add Payment Method</p>
                          <div class="row">
                            <div class="col-lg-6 col-12">
                              <label for="name"><strong>Payment Name</strong></label>
                              <input
                                id="name"
                                class="form-control"
                                type="text"
                                placeholder="Payment Name"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="email"><strong>Email</strong></label>
                              <input
                                id="email"
                                placeholder="example@email.com"
                                class="form-control"
                                type="email"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="id"><strong>Merchant Id</strong></label>
                              <input
                                id="id"
                                placeholder="Merchant Id"
                                class="form-control"
                                type="text"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="usd"><strong>Currency</strong></label>
                              <input id="usd" placeholder="USD" class="form-control" type="text" />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="status"><strong>Status</strong></label>
                              <select name="status" class="form-control">
                                <option value="active">Active</option>
                                <option value="Intive">Intive</option>
                              </select>
                            </div>
                          </div>
                          <button class="add-method">Add Payment Method</button>
                          <button class="cancel">Cancel</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="number">4</td>
                    <td>
                      <p>Visa</p>
                    </td>
                    <td>info@softnio.com</td>
                    <td>MNB68</td>
                    <td class="money">USD</td>
                    <td class="status">Active</td>
                    <td class="setting">
                      <i class="fa-solid fa-ellipsis"></i>
                      <div class="update-method">
                        <p class="cmd-update">Update</p>
                        <p class="cmd-remove">Remove</p>
                      </div>
                      <div class="over-lay"></div>
                      <div class="title-form">
                        <form action="">
                          <p>Add Payment Method</p>
                          <div class="row">
                            <div class="col-lg-6 col-12">
                              <label for="name"><strong>Payment Name</strong></label>
                              <input
                                id="name"
                                class="form-control"
                                type="text"
                                placeholder="Payment Name"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="email"><strong>Email</strong></label>
                              <input
                                id="email"
                                placeholder="example@email.com"
                                class="form-control"
                                type="email"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="id"><strong>Merchant Id</strong></label>
                              <input
                                id="id"
                                placeholder="Merchant Id"
                                class="form-control"
                                type="text"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="usd"><strong>Currency</strong></label>
                              <input id="usd" placeholder="USD" class="form-control" type="text" />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="status"><strong>Status</strong></label>
                              <select name="status" class="form-control">
                                <option value="active">Active</option>
                                <option value="Intive">Intive</option>
                              </select>
                            </div>
                          </div>
                          <button class="add-method">Add Payment Method</button>
                          <button class="cancel">Cancel</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="number">5</td>
                    <td>
                      <p>E-check</p>
                    </td>
                    <td>info@softnio.com</td>
                    <td>MNB68</td>
                    <td class="money">USD</td>
                    <td class="status">Active</td>
                    <td class="setting">
                      <i class="fa-solid fa-ellipsis"></i>
                      <div class="update-method">
                        <p class="cmd-update">Update</p>
                        <p class="cmd-remove">Remove</p>
                      </div>
                      <div class="over-lay"></div>
                      <div class="title-form">
                        <form action="">
                          <p>Add Payment Method</p>
                          <div class="row">
                            <div class="col-lg-6 col-12">
                              <label for="name"><strong>Payment Name</strong></label>
                              <input
                                id="name"
                                class="form-control"
                                type="text"
                                placeholder="Payment Name"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="email"><strong>Email</strong></label>
                              <input
                                id="email"
                                placeholder="example@email.com"
                                class="form-control"
                                type="email"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="id"><strong>Merchant Id</strong></label>
                              <input
                                id="id"
                                placeholder="Merchant Id"
                                class="form-control"
                                type="text"
                              />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="usd"><strong>Currency</strong></label>
                              <input id="usd" placeholder="USD" class="form-control" type="text" />
                            </div>
                            <div class="col-lg-6 col-12">
                              <label for="status"><strong>Status</strong></label>
                              <select name="status" class="form-control">
                                <option value="active">Active</option>
                                <option value="Intive">Intive</option>
                              </select>
                            </div>
                          </div>
                          <button class="add-method">Add Payment Method</button>
                          <button class="cancel">Cancel</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.payment-container {
  display: flex;
}
/* Main Content Styles */
.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.notification-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f8fafc;
  border-radius: 6px;
  color: #64748b;
  font-size: 14px;
}

.icon-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background-color: #f1f5f9;
}

/* Main content styles updated */
/* Title*/
.title-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
}
.title-method p {
  color: #777;
  font-weight: 600;
}

.title-add button {
  color: #fff;
  background-color: #1d5fc2;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 5px;
  font-size: 20px;
  border: none;
  transition: all 0.25s;
  border: 1px solid #1d5fc2;
}

.title-add {
  position: relative;
}

.title-add button:hover {
  background-color: #003b95;
}

.title-add-method {
  display: none;
  position: absolute;
  width: 200px;
  right: 0;
  top: 110%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 2px 3px 1px #ddd;
}

.title-add-method p {
  margin: 0;
  padding: 10px;
  cursor: pointer;
}

.title-add-method p:hover {
  background-color: #1d5fc218;
}

.title-form {
  display: none;
  position: fixed;
  width: 50vw;
  left: 25%;
  background-color: #fff;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 1px 2px 3px 1px #ddd;
  z-index: 10 !important;
  top: 20%;
}

.over-lay {
  display: none;
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.4;
  z-index: 3;
}

.title-form p {
  font-size: 24px;
}

.title-form input {
  margin-bottom: 20px;
}

.title-form select {
  margin-bottom: 20px;
}

.title-form .cancel {
  background-color: #fff;
  color: #1d5fc2;
  border: none;
}

.title-form .cancel:hover {
  color: #003b95;
  background-color: #fff;
}
/* end Title*/

/*Table*/
.table-content {
  width: 100%;
}

.table-total {
  padding: 20px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 1px 2px 3px 1px #ddd;
}

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.table-title p {
  font-size: 24px;
  margin: 0;
  margin-left: 10px;
}

.table-icon i {
  padding: 0 10px;
}

.table-icon i:first-child {
  border-right: 1px solid #ddd;
}

table {
  width: 100%;
}
table .setting {
  position: relative;
}

.update-method {
  display: none;
  position: absolute;
  width: 100px;
  right: 8px;
  top: 60%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 2px 3px 1px #ddd;
}

i {
  cursor: pointer;
}

.setting i {
  cursor: pointer;
}

.update-method p {
  margin: 0;
  padding: 10px;
  cursor: pointer;
}

.update-method p:hover {
  background-color: #1d5fc218;
}

table thead td {
  font-weight: 600;
  color: #777;
}

.number {
  color: #465fff;
  font-weight: 600;
  font-size: 18px;
}

.money {
  font-weight: 600;
}

.status {
  color: green;
  font-weight: 600;
}

/*end Table*/
</style>
