<script>
import AdminHeader from '@/components/admin/AdminHeader.vue'
import DashboardMenu from '@/components/admin/DashboardMenu.vue'
import WithdrawConfirmation from '@/components/admin/payment/withdrawConfirmation.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { useToast } from 'vue-toastification'

export default {
 
  components: {
    AdminHeader,
    DashboardMenu,
    WithdrawConfirmation
  },
   setup() {
    const toast = useToast()
    return { toast }
  },
  data() {
    return {
      invoices: [],
      isWithdrawConfirmationPopupOpen: false,
      withdrawAmount: 0,
      withdrawTransactionId: 0
    }
  },
  computed: {
    ...mapGetters('manageHotels', ['getCurrentManagingHotelId'])
  },
  methods: {
    async getInvoices() {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/admin/payout',
          {
            hotelId: this.getCurrentManagingHotelId
          },
          {
            withCredentials: true
          }
        )
        this.invoices = response.data.invoices
      } catch (error) {
        this.toast.error(error.message)
        console.log(error)
      }
    },
    seeInvoiceDetails(invoiceId) {
      this.$router.push({ path: `/admin/${this.getCurrentManagingHotelId}/payment/invoice-details`, query: { invoiceId: invoiceId } })
    },
    openWithdrawConfirmationPopup(amount, transaction_id) {
      this.withdrawAmount = amount
      this.withdrawTransactionId = transaction_id
      this.isWithdrawConfirmationPopupOpen = true
    },
    closeWithdrawConfirmationPopup() {
      this.isWithdrawConfirmationPopupOpen = false
    }
  },
  async mounted() {
    await this.getInvoices()
  }
}
</script>
<template>
  <WithdrawConfirmation :withdrawAmount="withdrawAmount" :withdrawTransactionId="withdrawTransactionId" v-if="isWithdrawConfirmationPopupOpen" @close="closeWithdrawConfirmationPopup" />
  <div class="invoice-list-container">
    <DashboardMenu />
    <div class="main-wrapper">
      <AdminHeader />

      <!--Title-->
      <div class="title">
        <div class="container">
          <div class="title-total">
            <div class="title-method">
              <h2>Invoices</h2>
              <p>You have total {{ invoices.length }} invoices.</p>
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
              <p>All Invoice</p>
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
                    <td>PAYMENT ID</td>
                    <td>DATE</td>
                    <td>AMOUNT</td>
                    <td>STATUS</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in invoices" :key="invoice.invoice_id">
                    <td class="payment-id">#{{ invoice.invoice_id }}</td>
                    <td class="time">
                      <p>{{ invoice.updated_at }}</p>
                    </td>
                    <td class="usd">{{ invoice.amount }} VND</td>
                    <td class="status">
                      <ul>
                        <li
                          :style="{
                            color:
                              invoice.status == 'available' || invoice.status == 'done'
                                ? 'green'
                                : 'red'
                          }"
                        >
                          {{ invoice.status }}
                        </li>
                      </ul>
                    </td>
                    <td class="icon">
                      <button class="view" @click="seeInvoiceDetails(invoice.invoice_id)">View</button>
                    </td>
                    <td class="icon">
                      <button
                        class="withdraw-btn"
                        :disabled="invoice.status == 'unavailable' || invoice.status == 'done'"
                        @click="openWithdrawConfirmationPopup(invoice.amount, invoice.transaction_id)"
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end Table-->
  </div>
</template>
<style scoped>
.invoice-list-container {
  display: flex;
}
.main-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
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
tbody tr td {
  text-align: center;
}
.table-content {
  width: 100%;
}

.table-total {
  background-color: white;
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
  text-align: center;
  font-weight: 600;
  color: #777;
}

.payment-id {
  color: #003b95;
  font-weight: 600;
}

.usd {
  font-weight: 600;
  font-size: 18px;
}

.icon i {
  color: #003b95;
  margin-right: 10px;
}

.icon .view {
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
}
.icon .view:hover {
  background-color: #1d5fc2;
  color: white;
}

.withdraw-btn {
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  background-color: #1d5fc2;
  color: white;
}

.withdraw-btn:hover {
  background-color: #003b95;
}

/*end Table*/
</style>
