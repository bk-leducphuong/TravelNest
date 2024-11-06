<script>
import TheHeader from '@/components/Header.vue'
import TheFooter from '@/components/Footer.vue'
import MapComponent from '@/components/map/MapComponent.vue'
import ImageSlider from '@/components/image-slider/ImageSlider.vue'
import axios from 'axios'

export default {
  components: {
    TheHeader,
    TheFooter,
    MapComponent,
    ImageSlider
  },
  data() {
    return {
      hotel_id: null,

      hotel: {},
      rooms: [],
      reviews: [],
      nearby_hotels: [],
      reviews_breakdown: [],

      openCommentPopup: false,
      openMapPopup: false,
      isSliderOpen: false
    }
  },
  methods: {
    async getHotelDetails() {
      const response = await axios.get(`http://localhost:3000/api/hotels/${this.hotel_id}`)
      this.hotel = response.data.hotel
      this.rooms = response.data.rooms
      this.reviews = response.data.reviews
      this.reviews_breakdown = response.data.reviews_breakdown
      this.nearby_hotels = response.data.nearby_hotels
    },
    // comment popup
    showCommentPopup() {
      this.openCommentPopup = true
    },
    hideCommentPopup() {
      this.openCommentPopup = false
    },
    // map popup
    closeMapPopup() {
      this.openMapPopup = false
    },
    // image slider
    openImageSlider() {
      this.isSliderOpen = true
    },
    closeImageSlider() {
      this.isSliderOpen = false
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
  <TheHeader />
  <MapComponent v-if="openMapPopup" :hotels="[hotel]" @close-map-popup="closeMapPopup" />
  <ImageSlider :images="hotel.image_urls" :isOpen="isSliderOpen" @close="closeImageSlider" />
  <!-- menu  -->
  <div class="menu">
    <div class="container">
      <div class="menu__list">
        <ul>
          <li><a href="">Tổng quan</a></li>
          <li><a href="#price">Thông tin & giá</a></li>
          <li>Tiện nghi</li>
          <li><a href="#policy">Chính sách</a></li>
          <li>Ghi chú</li>
          <li><a href="#review">Đánh giá của khách</a></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- end menu  -->

  <!-- overview  -->
  <div class="overview">
    <div class="container">
      <div class="overview__total">
        <div class="overview__search">
          <div class="booking-form">
            <h2>Đặt Phòng</h2>
            <label for="destination">Tên chỗ nghỉ / điểm đến:</label>
            <input type="text" id="destination" placeholder="Hà Nội" />

            <label for="checkin-date">Ngày nhận phòng:</label>
            <input type="text" id="checkin-date" placeholder="Chọn ngày nhận phòng" />

            <label for="checkout-date">Ngày trả phòng:</label>
            <input type="text" id="checkout-date" placeholder="Chọn ngày trả phòng" />

            <label for="guest-info">Khách & Phòng:</label>
            <input
              type="text"
              id="guest-info"
              readonly
              placeholder="2 người lớn · 0 trẻ em · 1 phòng"
            />

            <!-- Dropdown khách & phòng -->
            <div class="guest-room-dropdown" style="display: none">
              <div class="counter">
                <span>Người lớn</span>
                <div class="select">
                  <button id="adults-minus">-</button>
                  <span class="number" id="adults-count">2</span>
                  <button id="adults-plus">+</button>
                </div>
              </div>
              <div class="counter">
                <span>Trẻ em</span>
                <div class="select">
                  <button id="children-minus">-</button>
                  <span class="number" id="children-count">0</span>
                  <button id="children-plus">+</button>
                </div>
              </div>
              <div class="counter">
                <span>Phòng</span>
                <div class="select">
                  <button id="rooms-minus">-</button>
                  <span class="number" id="rooms-count">1</span>
                  <button id="rooms-plus">+</button>
                </div>
              </div>
              <button class="closeButton">Đóng</button>
            </div>

            <button type="button">Tìm Kiếm</button>
          </div>
          <div class="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d59582.31596536299!2d105.834667!3d21.036897!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba15ec15d17%3A0x620e85c2cfe14d4c!2zTMSDbmcgQ2jhu6cgdOG7i2NoIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2sus!4v1729735752435!5m2!1svi!2sus"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <button class="map-button" @click="openMapPopup = !openMapPopup">
              <svg class="map-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
              Hiển thị trên bản đồ
            </button>
          </div>
        </div>
        <div class="overview__image">
          <div class="overview__image--title">
            <h2>{{ hotel.name }}</h2>
            <button>Đặt ngay</button>
          </div>
          <div class="overview__image--location">
            <p><i class="fa-solid fa-location-dot"></i>{{ hotel.address }}</p>
          </div>
          <div class="overview__image--list">
            <div class="overview__image--header">
              <div class="overview__image--1">
                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/max500/607452727.jpg?k=dedb57c9de2d7768212d044018809f7a692a38e2d5bb8a69302d0f8eed26375a&o=&hp=1"
                  alt=""
                />
                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/max500/607020364.jpg?k=615e5b2944a5cd48c80144ca9387bb5b7184d12af19e8022f2a6ea38bad5f7f3&o=&hp=1"
                  alt=""
                />
              </div>
              <div class="overview__image--2" @click="openImageSlider()">
                <img
                  src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/139485406.jpg?k=e12e1e4c7b7a8293ff392e0249a80cac3891e281d1373354934a11441f89d867&o=&hp=1"
                  alt=""
                />
              </div>
            </div>
            <div class="overview__image--footer">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max300/143633832.jpg?k=eee3ba907b66cc9f46235304d0fff0952528a2d3ed979549f18d2a944c9eb66e&o=&hp=1"
                alt=""
              />
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max300/607020320.jpg?k=47a969a383fc5d96234fc91e85eec210973e6b1509f382f5bdd2722748ce849b&o=&hp=1"
                alt=""
              />
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max300/607150715.jpg?k=32c4c039ddeadf5a8a935fa087f84dacb07cd3dbf0899fd1835f8fbba36393d3&o=&hp=1"
                alt=""
              />
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max300/143636536.jpg?k=cbb548d7184c3c3e6e54dc7548824dd2726ee738c42aaa108cbcf52bcef8a08c&o=&hp=1"
                alt=""
              />
              <img class="last" src="" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- end overview  -->

  <!-- information  -->
  <div class="information">
    <div class="container">
      <div class="information__total">
        <div class="information__text">
          <p>{{ this.hotel.description }}</p>
          <h3>Các tiện nghi được ưa chuộng nhất</h3>
          <ul>
            <li>
              <i class="fa-solid fa-bus"></i>
              <p>Xe đưa đón sân bay</p>
            </li>
            <li>
              <i class="fa-solid fa-ban-smoking"></i>
              <p>Phòng không hút thuốc</p>
            </li>
            <li>
              <i class="fa-solid fa-wifi"></i>
              <p>WiFi miễn phí</p>
            </li>
            <li>
              <i class="fa-solid fa-people-roof"></i>
              <p>Phòng gia đình</p>
            </li>
            <li>
              <i class="fa-solid fa-bell-concierge"></i>
              <p>tân 24 giờ</p>
            </li>
            <li>
              <i class="fa-solid fa-elevator"></i>
              <p>Thang máy</p>
            </li>
            <li>
              <i class="fa-regular fa-snowflake"></i>
              <p>Điều hòa nhiệt độ</p>
            </li>
          </ul>
        </div>
        <div class="information__login">
          <div class="information_genius">
            <h3>Lợi ích Genius có ở một số lựa chọn:</h3>
            <ul>
              <li>
                <i class="fa-solid fa-circle-check"></i> Giảm giá 10% <br />
                Áp dụng trên giá trước thuế và phí
              </li>
            </ul>
            <hr />
            <p>Chương trình khách hàng thân thiết của Booking.com</p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </div>
  <!-- end information  -->

  <!-- price -->
  <div class="price" id="price">
    <div class="container">
      <div class="price__total">
        <div class="row">
          <div class="col-3">
            <div class="thead">
              <strong>Loại chỗ ở</strong>
            </div>
            <div class="room--1">
              <strong>Nhà 1 Phòng ngủ</strong>
              <ul>
                <li><i class="fa-solid fa-house"></i>Nhà nghỉ dưỡng nguyên căn</li>
                <li><i class="fa-solid fa-wheelchair-move"></i>Ban công</li>
                <li><i class="fa-solid fa-wind"></i> Nhìn ra vườn</li>
                <li><i class="fa-regular fa-snowflake"></i>Điều hòa không khí</li>
                <li><i class="fa-solid fa-sink"></i>Phòng tắm riêng trong phòng</li>
                <li><i class="fa-solid fa-tv"></i>TV màn hình phẳng</li>
              </ul>
              <hr />
              <ul class="price--check">
                <li><i class="fa-solid fa-check"></i> Đồ vệ sinh cá nhân miễn phí</li>
                <li><i class="fa-solid fa-check"></i>Áo choàng tắm</li>
                <li><i class="fa-solid fa-check"></i>Nhà vệ sinh</li>
                <li><i class="fa-solid fa-check"></i>Bồn tắm hoặc Vòi sen</li>
                <li><i class="fa-solid fa-check"></i>Khăn tắm</li>
                <li><i class="fa-solid fa-check"></i>Ổ điện gần giường</li>
              </ul>
            </div>
            <div class="room--1">
              <strong>Nhà 1 Phòng ngủ</strong>
              <ul>
                <li><i class="fa-solid fa-house"></i>Nhà nghỉ dưỡng nguyên căn</li>
                <li><i class="fa-solid fa-wheelchair-move"></i>Ban công</li>
                <li><i class="fa-solid fa-wind"></i> Nhìn ra vườn</li>
                <li><i class="fa-regular fa-snowflake"></i>Điều hòa không khí</li>
                <li><i class="fa-solid fa-sink"></i>Phòng tắm riêng trong phòng</li>
                <li><i class="fa-solid fa-tv"></i>TV màn hình phẳng</li>
              </ul>
              <hr />
              <ul class="price--check">
                <li><i class="fa-solid fa-check"></i> Đồ vệ sinh cá nhân miễn phí</li>
                <li><i class="fa-solid fa-check"></i>Áo choàng tắm</li>
                <li><i class="fa-solid fa-check"></i>Nhà vệ sinh</li>
                <li><i class="fa-solid fa-check"></i>Bồn tắm hoặc Vòi sen</li>
                <li><i class="fa-solid fa-check"></i>Khăn tắm</li>
                <li><i class="fa-solid fa-check"></i>Ổ điện gần giường</li>
              </ul>
            </div>
          </div>
          <div class="col-1">
            <div class="thead">
              <strong>Số lượng khách</strong>
            </div>
            <div class="price__customer price__customer--1">
              <i class="fa-solid fa-user"></i>
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="price__customer price__customer--2">
              <i class="fa-solid fa-user"></i>
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="price__customer price__customer--3">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="price__customer price__customer--4">
              <i class="fa-solid fa-user"></i>
            </div>
          </div>
          <div class="col-2">
            <div class="thead" style="background-color: #00388e">
              <strong>Giá hôm nay</strong>
            </div>
            <div class="price__customer price__customer--1">
              <span>VND 350.100</span>
              <br />
              <strong>VND 350.090</strong> <i class="fa-solid fa-circle-exclamation"></i>
              <br />
              <span>Đã bao gồm thuế và phí</span>
              <br />
              <span class="save">Tiết kiệm 10%</span>
            </div>
            <div class="price__customer price__customer--2">
              <span>VND 350.100</span>
              <br />
              <strong>VND 350.090</strong> <i class="fa-solid fa-circle-exclamation"></i>
              <br />
              <span>Đã bao gồm thuế và phí</span>
              <br />
              <span class="save">Tiết kiệm 10%</span>
            </div>
            <div class="price__customer price__customer--3">
              <span>VND 350.100</span>
              <br />
              <strong>VND 350.090</strong> <i class="fa-solid fa-circle-exclamation"></i>
              <br />
              <span>Đã bao gồm thuế và phí</span>
              <br />
              <span class="save">Tiết kiệm 10%</span>
            </div>
            <div class="price__customer price__customer--4">
              <span>VND 350.100</span>
              <br />
              <strong>VND 350.090</strong> <i class="fa-solid fa-circle-exclamation"></i>
              <br />
              <span>Đã bao gồm thuế và phí</span>
              <br />
              <span class="save">Tiết kiệm 10%</span>
            </div>
          </div>
          <div class="col-3">
            <div class="thead">
              <strong>Các lựa chọn</strong>
            </div>
            <div class="price__customer price__customer--1">
              <ul>
                <li>Không hoàn tiền</li>
              </ul>
              <ul class="check">
                <li>
                  <i class="fa-solid fa-check"></i>Giảm giá Genius 10% trên giá nước thuế và phí
                </li>
              </ul>
            </div>
            <div class="price__customer price__customer--2">
              <ul>
                <li>Phí hủy: 50% tiền phòng</li>
              </ul>
              <ul class="check">
                <li>
                  <i class="fa-solid fa-check"></i><b>Không cần thanh toán trước</b> - thanh toán
                  tại chỗ nghỉ
                </li>
                <li>
                  <i class="fa-solid fa-check"></i>Giảm giá Genius 10% trên giá nước thuế và phí
                </li>
              </ul>
            </div>
            <div class="price__customer price__customer--3">
              <ul>
                <li>Không hoàn tiền</li>
              </ul>
              <ul class="check">
                <li>
                  <i class="fa-solid fa-check"></i>Giảm giá Genius 10% trên giá nước thuế và phí
                </li>
              </ul>
            </div>
            <div class="price__customer price__customer--4">
              <ul>
                <li>Không hoàn tiền</li>
              </ul>
              <ul class="check">
                <li>
                  <i class="fa-solid fa-check"></i>Giảm giá Genius 10% trên giá nước thuế và phí
                </li>
              </ul>
            </div>
          </div>
          <div class="col-1">
            <div class="thead">
              <strong>Chọn nhà nghỉ mát</strong>
            </div>
            <div class="price__customer price__customer--1">
              <select name="" id="">
                <option value="0">0</option>
                <option value="0">1 (VND 315.090)</option>
                <option value="0">2 (VND 630.180)</option>
                <option value="0">3 (VND 945.270)</option>
                <option value="0">4 (VND 1.260.360)</option>
                <option value="0">5 (VND 1.575.450)</option>
              </select>
            </div>
            <div class="price__customer price__customer--2">
              <select name="" id="">
                <option value="0">0</option>
                <option value="0">1 (VND 315.090)</option>
                <option value="0">2 (VND 630.180)</option>
                <option value="0">3 (VND 945.270)</option>
                <option value="0">4 (VND 1.260.360)</option>
                <option value="0">5 (VND 1.575.450)</option>
              </select>
            </div>
            <div class="price__customer price__customer--3">
              <select name="" id="">
                <option value="0">0</option>
                <option value="0">1 (VND 315.090)</option>
                <option value="0">2 (VND 630.180)</option>
                <option value="0">3 (VND 945.270)</option>
                <option value="0">4 (VND 1.260.360)</option>
                <option value="0">5 (VND 1.575.450)</option>
              </select>
            </div>
            <div class="price__customer price__customer--4">
              <select name="" id="">
                <option value="0">0</option>
                <option value="0">1 (VND 315.090)</option>
                <option value="0">2 (VND 630.180)</option>
                <option value="0">3 (VND 945.270)</option>
                <option value="0">4 (VND 1.260.360)</option>
                <option value="0">5 (VND 1.575.450)</option>
              </select>
            </div>
          </div>
          <div class="col-2">
            <div class="thead"></div>
            <div class="price__content">
              <button>Tôi sẽ đặt</button>
              <ul>
                <li>Chỉ mất có 2 phút</li>
                <li>Xác nhận tức thời</li>
              </ul>
              <b><i class="fa-solid fa-address-card"></i> Không cần thẻ tín dụng </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end price -->

  <!-- review -->

  <div class="review__open" v-if="openCommentPopup">
    <div class="review__open--left"></div>
    <div class="review__open--right">
      <strong>Đánh giá của khách</strong>
      <button class="close" @click="hideCommentPopup()">x</button>
      <div class="review__open--point">
        <span class="point">9.2</span>
        <div>
          <span style="font-weight: 500">Tuyệt hảo</span>
          <br />
          <span>23 đánh giá</span>
        </div>
        <p>Chúng tôi cố gắng mang đến 100% đánh giá thật <i class="fa-solid fa-circle-info"></i></p>
        <button>Viết đánh giá</button>
      </div>
      <hr />
      <div class="review__process">
        <strong>Hạng mục</strong>
        <div class="review__process--bar">
          <div class="row">
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Nhân viên phục vụ</div>
                <div>9.2</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 92%"></div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Tiện nghi</div>
                <div>8.8</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 88%"></div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Sạch sẽ</div>
                <div>9.1</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 91%"></div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Thoái mái</div>
                <div>9.3</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 93%"></div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Đáng giá tiền</div>
                <div>9.2</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 92%"></div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Địa điểm</div>
                <div>8.4</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 84%"></div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6 col-12">
              <div class="category">
                <div>Wifi miễn phí</div>
                <div>7.5</div>
              </div>
              <div class="process--bar">
                <div class="bar" style="width: 75%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="review__number">
        <strong>Bộ lọc</strong>
        <ul>
          <li>
            <p>Khách đánh giá</p>
            <select name="" id="">
              <option value="">Tất cả(23)</option>
              <option value="">Gia đình(11)</option>
              <option value="">Cặp đôi(2)</option>
              <option value="">Khách lẻ(9)</option>
              <option value="">Du khách doanh nhân(1)</option>
            </select>
          </li>
          <li>
            <p>Điểm đánh giá</p>
            <select name="" id="">
              <option value="">Tất cả(23)</option>
              <option value="">Tuyệt hảo: 9+ (19)</option>
              <option value="">Tốt: 7-9 (2)</option>
              <option value="">Tàm tạm: 5-7 (1)</option>
              <option value="">Rất tệ: 1-3 (1)</option>
            </select>
          </li>
          <li>
            <p>Ngôn ngữ</p>
            <select name="" id="">
              <option value="">Tất cả (23)</option>
              <option value="">Tiếng Việt (6)</option>
              <option value="">Tiếng Anh (6)</option>
              <option value="">Tiếng Hàn Quốc (1)</option>
              <option value="">Tiếng Pháp (5)</option>
            </select>
          </li>
          <li>
            <p>Thời gian trong năm</p>
            <select name="" id="">
              <option value="">Tất cả(23)</option>
              <option value="">Tháng 3-5</option>
              <option value="">Tháng 6-8</option>
              <option value="">Tháng 9-11</option>
              <option value="">Tháng 12-2</option>
            </select>
          </li>
        </ul>
        <p>Chọn chủ để để lọc đánh giá</p>
        <button class="visible"><i class="fa-solid fa-plus"></i> Yên tĩnh</button>
        <button class="visible"><i class="fa-solid fa-plus"></i> Phòng</button>
        <button class="visible"><i class="fa-solid fa-plus"></i> Vị trí</button>
        <button class="visible"><i class="fa-solid fa-plus"></i> Bãi biển</button>

        <button><i class="fa-solid fa-plus"></i> Suite</button>
        <button><i class="fa-solid fa-plus"></i> Gia đình</button>
        <button><i class="fa-solid fa-plus"></i> Xe đạp</button>
        <button><i class="fa-solid fa-plus"></i> Tiếng Anh</button>
        <button><i class="fa-solid fa-plus"></i> Ban công</button>
        <button><i class="fa-solid fa-plus"></i> Nhà hàng</button>
        <button><i class="fa-solid fa-plus"></i> Sạch sẽ</button>
        <button><i class="fa-solid fa-plus"></i> Taxi</button>
        <button><i class="fa-solid fa-plus"></i> Ô tô</button>

        <button class="search visible"><i class="fa-solid fa-magnifying-glass"></i></button>
        <button class="smooth">Thu gọn</button>
        <button class="smooth2 visible">Hiển thị thêm</button>
      </div>
      <hr />
      <strong>Đánh giá của khách</strong>
      <div class="review__open--text">
        <div class="review__open--infor">
          <div class="name">
            <img src="" alt="" />
            <div class="infor">
              <span style="font-weight: 600">Anatolii</span>
              <br />
              <span>Nga</span>
            </div>
          </div>
          <div>
            <div class="service"><i class="fa-solid fa-bed"></i> <span>Nhà 1 phòng ngủ</span></div>
            <div class="service">
              <i class="fa-regular fa-calendar"></i> <span>7 đêm · tháng 3/2023</span>
            </div>
            <div class="service"><i class="fa-solid fa-person"></i> <span>Khách lẻ</span></div>
          </div>
        </div>
        <div class="review__open--desc">
          <div class="point">
            <div>
              <p>Ngày đánh giá: ngày 11 tháng 4 năm 2023</p>
              <strong>Xuất sắc</strong>
            </div>
            <span>10</span>
          </div>
          <div class="text">
            <i class="fa-regular fa-face-smile-beam"></i>
            <span
              >Very good inexpensive place, the guy in charge there speaks perfect English (which is
              VERY uncommon in Vietnam!), cozy bungalows, cleaning every 3-4 day which is sufficient
              for me, UNBELIEVABLE lonely beach (maybe 10 people per 1 kilometer of the beach) very
              close (500-600 meters, maybe), but a bit difficult to find (access mostly blocked by a
              construction site). Great value for little money! Yes, it's in the middle of nowhere
              (small local village with cows walking through the streets), but you have some
              restaurants and shops in the main road. But you either get a motorcycle or you suffer
              and pay taxi, if you need to go to the city. I had motorcycle, so no problem at al!
              Hope to visit this place again!</span
            >
          </div>
          <div class="button">
            <button><i class="fa-regular fa-thumbs-up"></i> Hữu ích</button>
            <button><i class="fa-regular fa-thumbs-down"></i> Không hữu ích</button>
          </div>
        </div>
      </div>
      <hr />
      <div class="review__open--text">
        <div class="review__open--infor">
          <div class="name">
            <img src="" alt="" />
            <div class="infor">
              <span style="font-weight: 600">Anatolii</span>
              <br />
              <span>Nga</span>
            </div>
          </div>
          <div>
            <div class="service"><i class="fa-solid fa-bed"></i> <span>Nhà 1 phòng ngủ</span></div>
            <div class="service">
              <i class="fa-regular fa-calendar"></i> <span>7 đêm · tháng 3/2023</span>
            </div>
            <div class="service"><i class="fa-solid fa-person"></i> <span>Khách lẻ</span></div>
          </div>
        </div>
        <div class="review__open--desc">
          <div class="point">
            <div>
              <p>Ngày đánh giá: ngày 11 tháng 4 năm 2023</p>
              <strong>Xuất sắc</strong>
            </div>
            <span>10</span>
          </div>
          <div class="text">
            <i class="fa-regular fa-face-smile-beam"></i>
            <span
              >Very good inexpensive place, the guy in charge there speaks perfect English (which is
              VERY uncommon in Vietnam!), cozy bungalows, cleaning every 3-4 day which is sufficient
              for me, UNBELIEVABLE lonely beach (maybe 10 people per 1 kilometer of the beach) very
              close (500-600 meters, maybe), but a bit difficult to find (access mostly blocked by a
              construction site). Great value for little money! Yes, it's in the middle of nowhere
              (small local village with cows walking through the streets), but you have some
              restaurants and shops in the main road. But you either get a motorcycle or you suffer
              and pay taxi, if you need to go to the city. I had motorcycle, so no problem at al!
              Hope to visit this place again!</span
            >
          </div>
          <div class="button">
            <button><i class="fa-regular fa-thumbs-up"></i> Hữu ích</button>
            <button><i class="fa-regular fa-thumbs-down"></i> Không hữu ích</button>
          </div>
        </div>
        <hr />
      </div>
      <hr />
      <div class="review__open--text">
        <div class="review__open--infor">
          <div class="name">
            <img src="" alt="" />
            <div class="infor">
              <span style="font-weight: 600">Anatolii</span>
              <br />
              <span>Nga</span>
            </div>
          </div>
          <div>
            <div class="service"><i class="fa-solid fa-bed"></i> <span>Nhà 1 phòng ngủ</span></div>
            <div class="service">
              <i class="fa-regular fa-calendar"></i> <span>7 đêm · tháng 3/2023</span>
            </div>
            <div class="service"><i class="fa-solid fa-person"></i> <span>Khách lẻ</span></div>
          </div>
        </div>
        <div class="review__open--desc">
          <div class="point">
            <div>
              <p>Ngày đánh giá: ngày 11 tháng 4 năm 2023</p>
              <strong>Xuất sắc</strong>
            </div>
            <span>10</span>
          </div>
          <div class="text">
            <i class="fa-regular fa-face-smile-beam"></i>
            <span
              >Very good inexpensive place, the guy in charge there speaks perfect English (which is
              VERY uncommon in Vietnam!), cozy bungalows, cleaning every 3-4 day which is sufficient
              for me, UNBELIEVABLE lonely beach (maybe 10 people per 1 kilometer of the beach) very
              close (500-600 meters, maybe), but a bit difficult to find (access mostly blocked by a
              construction site). Great value for little money! Yes, it's in the middle of nowhere
              (small local village with cows walking through the streets), but you have some
              restaurants and shops in the main road. But you either get a motorcycle or you suffer
              and pay taxi, if you need to go to the city. I had motorcycle, so no problem at al!
              Hope to visit this place again!</span
            >
          </div>
          <div class="button">
            <button><i class="fa-regular fa-thumbs-up"></i> Hữu ích</button>
            <button><i class="fa-regular fa-thumbs-down"></i> Không hữu ích</button>
          </div>
        </div>
        <hr />
      </div>
      <hr />
      <div class="pagination">
        <button><i class="fa-solid fa-arrow-left"></i></button>
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button><i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  </div>

  <div class="review" id="review">
    <div class="container">
      <div class="review__total">
        <div class="review__point">
          <div class="review__point--left">
            <h3>Đánh giá của khách</h3>
            <span class="point">9.2</span>
            <span style="font-weight: 500; margin-left: 5px">Tuyệt hảo - 23 đánh giá </span>
          </div>
          <div class="review__point--right">
            <button>Xem phòng trống</button>
          </div>
        </div>
        <div class="review__process">
          <strong>Hạng mục</strong>
          <div class="review__process--bar">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Nhân viên phục vụ</div>
                  <div>9.2</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 92%"></div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Tiện nghi</div>
                  <div>8.8</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 88%"></div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Sạch sẽ</div>
                  <div>9.1</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 91%"></div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Thoái mái</div>
                  <div>9.3</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 93%"></div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Đáng giá tiền</div>
                  <div>9.2</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 92%"></div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Địa điểm</div>
                  <div>8.4</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 84%"></div>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="category">
                  <div>Wifi miễn phí</div>
                  <div>7.5</div>
                </div>
                <div class="process--bar">
                  <div class="bar" style="width: 75%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="review__text">
          <strong>Khách lưu trú ở đây thích điều gì</strong>

          <div class="row">
            <div class="col-xl-4 col-md-6 col-12">
              <div class="reviewer">
                <div class="name">
                  <img src="" alt="" />
                  <div class="infor">
                    <span style="font-weight: 600">Anatolii</span>
                    <br />
                    <span>Nga</span>
                  </div>
                </div>
                <div class="text">
                  <p>
                    “Very good inexpensive place, the guy in charge there speaks perfect English
                    (which is VERY uncommon in Vietnam!), cozy bungalows, cleaning every 3-4 day
                    which is sufficient for me, UNBELIEVABLE lonely beach (maybe 10 people per 1
                    kilometer of the...”
                  </p>
                  <a href="">Tìm hiểu thêm</a>
                  <br />
                  <a href="">Xem bản dịch</a>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6 col-12">
              <div class="reviewer">
                <div class="name">
                  <img src="" alt="" />
                  <div class="infor">
                    <span style="font-weight: 600">Anatolii</span>
                    <br />
                    <span>Nga</span>
                  </div>
                </div>
                <div class="text">
                  <p>
                    “Very good inexpensive place, the guy in charge there speaks perfect English
                    (which is VERY uncommon in Vietnam!), cozy bungalows, cleaning every 3-4 day
                    which is sufficient for me, UNBELIEVABLE lonely beach (maybe 10 people per 1
                    kilometer of the...”
                  </p>
                  <a href="">Tìm hiểu thêm</a>
                  <br />
                  <a href="">Xem bản dịch</a>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6 col-12">
              <div class="reviewer">
                <div class="name">
                  <img src="" alt="" />
                  <div class="infor">
                    <span style="font-weight: 600">Anatolii</span>
                    <br />
                    <span>Nga</span>
                  </div>
                </div>
                <div class="text">
                  <p>
                    “Very good inexpensive place, the guy in charge there speaks perfect English
                    (which is VERY uncommon in Vietnam!), cozy bungalows, cleaning every 3-4 day
                    which is sufficient for me, UNBELIEVABLE lonely beach (maybe 10 people per 1
                    kilometer of the...”
                  </p>
                  <a href="">Tìm hiểu thêm</a>
                  <br />
                  <a href="">Xem bản dịch</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="btnAll" @click="showCommentPopup()">Đọc tất cả đánh giá</button>
      </div>
    </div>
  </div>
  <!-- end review -->

  <!-- surrounding -->
  <div class="surrounding">
    <div class="container">
      <div class="surrounding__total">
        <div class="sur__title">
          <div class="surrounding__name">
            <h3>Xung quanh khách sạn</h3>
            <a href="">Vị trí tuyệt vời - Hiển thị bản đồ</a>
          </div>
          <div class="sur__button">
            <button>Xem phòng trống</button>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-4 col-md-6 col-12">
            <i class="fa-solid fa-person-walking"></i> <strong>Xung quanh có gì</strong>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Đảo Phú Quốc</div>
                <div class="sur__have--meters">0 m</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Vườn Quốc gia Phú Quốc</div>
                <div class="sur__have--meters">6 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Công Viên Bạch Đằng</div>
                <div class="sur__have--meters">8 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Suối Tiên - Fairy Stream</div>
                <div class="sur__have--meters">12 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Coi Nguon Museum</div>
                <div class="sur__have--meters">12 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Kidd Club</div>
                <div class="sur__have--meters">13 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Ream National Park</div>
                <div class="sur__have--meters">18 km</div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-md-6 col-12">
            <i class="fa-solid fa-utensils"></i> <strong>Nhà hàng & quán cà phê</strong>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Nhà hàng Mai Jo Refined Ông Lang</div>
                <div class="sur__have--meters">400 m</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Cafe/quán bar Island Life</div>
                <div class="sur__have--meters">600 m</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Cafe/quán bar Rock Bar</div>
                <div class="sur__have--meters">650 m</div>
              </div>
            </div>
          </div>
          <div class="col-xl-4 col-md-6 col-12">
            <i class="fa-solid fa-umbrella-beach"></i> <strong>Các bãi biển trong khu vực</strong>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Bãi biển Ông Lang</div>
                <div class="sur__have--meters">1.4 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Bãi biển Dương Đông</div>
                <div class="sur__have--meters">5 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Bãi Gành Gió</div>
                <div class="sur__have--meters">5 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Bãi biển Cửa Cạn</div>
                <div class="sur__have--meters">6 km</div>
              </div>
            </div>
            <div class="sur__have">
              <div class="sur__have--item">
                <div class="sur__have--name">Bãi Trường</div>
                <div class="sur__have--meters">9 km</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- end surrounding -->

  <!-- policy -->
  <div class="policy" id="policy">
    <div class="container">
      <div class="policy__total">
        <div class="policy__title">
          <div class="policy__name">
            <h3>Chính sách</h3>
            <span>Duke Bungalow nhận yêu cầu đặc biệt - gửi yêu cầu trong bước kế tiếp!</span>
          </div>
          <div class="policy__button">
            <button>Xem phòng trống</button>
          </div>
        </div>
        <div class="policy__condition">
          <div class="policy__condition--total">
            <div class="policy__condition--title">
              <i class="fa-solid fa-circle-info"></i> <strong>Hủy đặt phòng/ Trả trước</strong>
            </div>
            <div class="policy__condition--text">
              <p>Các chính sách hủy và thanh toán trước sẽ khác nhau tùy vào từng loại chỗ nghỉ.</p>
              <p>
                Vui lòng kiểm tra <a href="">các điều kiện</a> có thể được áp dụng cho mỗi lựa chọn
                của bạn.
              </p>
            </div>
          </div>
          <div class="policy__condition--total">
            <div class="policy__condition--title">
              <i class="fa-solid fa-hands-holding-child"></i> <strong>Trẻ em và giường</strong>
            </div>
            <div class="policy__condition--text">
              <p><strong>Chính sách trẻ em</strong></p>
              <p>Phù hợp cho tất cả trẻ em.</p>
              <p>
                Để xem thông tin giá và tình trạng phòng trống chính xác, vui lòng thêm số lượng và
                độ tuổi của trẻ em trong nhóm của bạn khi tìm kiếm.
              </p>
              <p><strong>Chính sách trẻ em</strong></p>
              <p>Chỗ nghỉ này không có nôi/cũi và giường phụ.</p>
            </div>
          </div>
          <div class="policy__condition--total">
            <div class="policy__condition--title">
              <i class="fa-solid fa-person"></i> <strong>Không giới hạn độ tuổi</strong>
            </div>
            <div class="policy__condition--text">
              <p>Không có yêu cầu về độ tuổi khi nhận phòng</p>
            </div>
          </div>
          <div class="policy__condition--total">
            <div class="policy__condition--title">
              <i class="fa-solid fa-credit-card"></i> <strong>Chỉ thanh toán bằng tiền mặt</strong>
            </div>
            <div class="policy__condition--text">
              <p>Chỗ nghỉ này chỉ chấp nhận thanh toán bằng tiền mặt.</p>
            </div>
          </div>
          <div class="policy__condition--total">
            <div class="policy__condition--title">
              <i class="fa-solid fa-ban-smoking"></i> <strong> Hút thuốc</strong>
            </div>
            <div class="policy__condition--text">
              <p>Không cho phép hút thuốc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- end policy -->
  <TheFooter />
</template>

<style scoped>
/* menu  */

.menu__list {
  margin: 20px 0;
  border-bottom: 1px solid #777;
}

.menu__list ul {
  display: flex;
  list-style-type: none;
  font-size: 18px;
  font-weight: 400;
  color: #000;
  margin-bottom: 0;
  padding: 0;
}

.menu__list ul li {
  cursor: pointer;
  width: 16.67%;
  text-align: center;
  padding: 15px 0;
}

.menu__list ul li:hover {
  background-color: #f0f6fd;
}

.menu__list ul li:first-child {
  border-bottom: 2px solid #23ace3;
}

/* end menu  */

/* overview  */
.booking-form {
  background-color: #febb02;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.booking-form h2 {
  color: #333;
  margin-bottom: 15px;
}

.booking-form label {
  font-size: 14px;
  color: #333;
  display: block;
  margin-top: 10px;
}

.booking-form input[type='text'] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-top: 5px;
}

.guest-room-dropdown {
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  position: absolute;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-top: 5px;
}

.overview .counter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.overview .counter .number {
  margin: 0 10px;
}

.overview .counter span {
  font-size: 14px;
}

.overview .counter button {
  border: 1px solid #007bff;
  border-radius: 8px;
  width: 25px;
  height: 25px;
  font-size: 16px;
  cursor: pointer;
  background-color: #fff;
  display: inline-flex;
  align-items: center;
}

.overview .closeButton {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
}

.overview button[type='button'] {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
}

.overview button[type='button']:hover {
  background-color: #0056b3;
}

.overview .map {
  margin: 10px 0;
  /* width: 300px; */
  height: 150px;
  border-radius: 5px;
  overflow: hidden;
}

.map-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #0066cc;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  top: -60px;
  margin: auto;
  position: relative;
}

.map-button:hover {
  background-color: #0052a3;
}

.map-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.overview {
  margin-bottom: 10px;
}
.overview__total {
  display: flex;
  align-items: center;
}

.overview__image {
  flex: 1;
  margin-left: 30px;
  height: 100%;
}

.overview__image--title {
  display: flex;
  justify-content: space-between;
  padding: 0 0 10px 0;
}

.overview__image--title button {
  color: #fff;
  background-color: #0056b3;
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  padding: 0 15px;
}

.overview__image--title h2 {
  margin: 0px;
}

.overview__image i {
  color: #0056b3;
}

.overview__image--list img {
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  cursor: pointer;
}

.overview__image--header {
  display: flex;
  align-items: center;
}

.overview__image--1 {
  flex: 3.2;
  overflow: hidden;
  height: 100%;
  object-fit: cover;
  margin-right: 10px;
  justify-content: space-between;
  align-items: center;
}

.overview__image--1 img {
  display: block;
  width: 100%;
  height: 100%;
  flex: 1;
  object-fit: cover;
  margin-bottom: 10px;
  aspect-ratio: 4/3;
}
.overview__image--2 {
  display: block;
  flex: 6.8;
  overflow: hidden;
  aspect-ratio: 4/3;
  object-fit: cover;
  margin-bottom: 10px;
}

.overview__image--2 img {
  width: 100%;
}

.overview__image--footer {
  display: flex;
  justify-content: space-between;
}

.overview__image--footer img {
  width: 19%;
}

.overview__image--footer .last {
  background-image: url('https://cf.bstatic.com/xdata/images/hotel/max300/143636581.jpg?k=26a95beeee4ae833b355fc2ec7a150328b20a7b299d08008520a29606e00cb85&o=&hp=1');
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: cover;
  text-align: center;
  cursor: pointer;
}

/* end overview  */

/* information  */
.information {
  margin-bottom: 20px;
}

.information__total {
  display: flex;
}

.information__text {
  flex: 7;
  padding-right: 20px;
}

.information__text ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.information__text li {
  display: flex;
  margin-right: 20px;
  width: 20%;
  margin-bottom: 5px;
  flex-wrap: nowrap;
  align-items: center;
}

.information__text li i {
  color: green;
  margin-right: 10px;
}

.information__text li p {
  margin: 0;
  /* white-space: nowrap; */
  font-size: 13px;
}

.information__login {
  flex: 3;
  padding: 15px 30px;
  border: 1px solid #ddd;
  display: inline-block;
  height: 100%;
  border-radius: 10px;
}
.information__login ul {
  list-style-type: none;
  padding: 5px;
}

.information__login ul i {
  color: orange;
}

.information__login h3 {
  font-size: 16px;
  font-weight: bold;
}

/* end information  */

/* price  */
.price .col-3,
.col-1,
.col-2 {
  padding: 5px;
  border: 1px solid #1d85ae5e;
  padding: 0;
}

.price .thead {
  height: 100px;
  width: auto;
  color: white;
  background-color: #4a73ae;
  padding: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0px;
  font-size: 14px;
  z-index: 999;
}

.price .room--1 {
  padding: 0px 5px;
  border-bottom: 3px solid #5bbaff;
}

.price .room--1 strong {
  color: #0056b3;
  text-decoration: underline;
  cursor: pointer;
}

.price .room--1 ul {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  font-size: 12px;
}

.price .room--1 ul li {
  margin-right: 8px;
  margin-bottom: 5px;
}

.price .room--1 ul i {
  font-size: 10px;
  margin-right: 5px;
}

.price--check i {
  color: green;
}

.price__customer {
  height: 150px;
  padding: 0 5px;
  border-bottom: 1px solid #1d85ae5e;
  margin-top: 5px;
}

.price__customer span:first-child {
  font-size: 14px;
  color: red;
  text-decoration: line-through;
}

.price__customer span {
  font-size: 12px;
}

.price__customer .save {
  padding: 5px 5px;
  color: white;
  background-color: green;
  border-radius: 5px;
}
.price__customer ul {
  margin: 0;
  font-size: 13px;
}
.price__customer .check {
  list-style-type: none;
  padding: 0 20px;
}
.price__customer .check i {
  margin-right: 5px;
  color: green;
}

.price__customer select {
  width: 100%;
}

.price__content {
  padding: 0 5px;
  font-size: 13px;
  margin-top: 5px;
  position: sticky;
  top: 105px;
}

.price__content ul {
  padding-left: 25px;
  margin-bottom: 5px;
}

.price__content button {
  width: 100%;
  color: white;
  font-weight: 600;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 5px 0;
  margin-bottom: 5px;
}

.price__content b {
  color: green;
  margin-left: 5px;
}

/* end price  */

/* review  */
.review__open {
  overflow-y: scroll;
  display: flex;
  justify-content: space-between;
  height: 100vh;
  width: 100vw;
  position: fixed;
  z-index: 1000;
  background-color: #00000056;
  top: 0px;
  /* display: none; */
}

.review__open--right {
  flex: 1;
  background-color: #fff;
  border-radius: 8px 0 0 8px;
  padding: 20px;
  height: fit-content;
}
.review__open--point {
  display: flex;
  align-items: center;
  position: relative;
}

.review__open--point div {
  margin-right: 30px;
  margin-left: 5px;
}

.review__open--point p {
  margin: 0;
  color: green;
}

.review__open .review__number ul {
  display: flex;
  margin: 0;
  list-style-type: none;
  padding: 0;
  justify-content: space-between;
}

.review__open .review__number ul p {
  margin-bottom: 5px;
}

.review__open .review__number select {
  width: 100%;
  border-radius: 5px;
  padding: 3px 5px;
}

/*  */
.review__open .review__number select:focus {
  border: 1px solid #ddd;
  outline: none;
}

.review__open .review__number li {
  width: 23%;
}
.review__open .review__number p {
  margin-top: 20px;
}
.review__open .review__number button {
  border-radius: 20px;
  padding: 5px 10px;
  margin-bottom: 5px;
  margin-right: 5px;
  border: 1px solid #000;
  background: #fff;
  display: inline-flex;
  align-items: center;
  display: none;
}

.review__open .review__number .visible {
  display: inline-block;
}

.review__open .review__number .smooth {
  border: none;
  border-radius: none;
}

.review__open .review__number .smooth:hover {
  background-color: #dddddd68;
}
.review__open .review__number .smooth2 {
  border: none;
  border-radius: none;
}

.review__open .review__number .smooth2:hover {
  background-color: #dddddd68;
}

.review__open .review__number button i {
  color: #777;
  margin-right: 3px;
}

.review__open .review__number .search {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: inline-block;
}

.review__open--point button {
  position: absolute;
  right: 0px;
  border: 1px solid #007bff;
  padding: 5px 10px;
  font-size: 14px;
  color: #007bff;
  font-weight: 600;
  background-color: #fff;
  border-radius: 5px;
}

.review__open--point button:hover {
  background-color: #003c9510;
}

.review__open--left {
  width: 40%;
  height: 100%;
}

.review__open--right strong {
  font-size: 20px;
  display: inline-block;
  margin-bottom: 15px;
}

.review__open--point .point {
  padding: 10px;
  background-color: #0056b3;
  color: #fff;
  border-radius: 5px 5px 5px 0;
  font-size: 18px;
  font-weight: 600;
  margin-right: 6px;
}

.review__open--infor {
  width: 30%;
}

.review__open--infor .name {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.review__open--text {
  display: flex;
  margin-bottom: 20px;
}
.review__open--infor .name img {
  width: auto;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.pagination {
  padding: 10px 20px;
  border: 1px solid #007bff;
  border-radius: 10px;
}

.pagination button {
  margin-right: 10px;
  border: none;
  background-color: transparent;
  color: #007bff;
  padding: 5px 13px;
  border-radius: 5px;
}

.pagination button:hover {
  background-color: #007bff57;
  color: #fff;
}

.review__open--infor .service i {
  width: 24px;
  text-align: center;
  margin-right: 5px;
}

.review__open--infor .service {
  font-size: 13px;
}

.review__open--desc {
  flex: 1;
}
.review__open--desc .point {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.review__open--desc .text i {
  color: green;
}

.review__open--desc .text {
  margin-bottom: 20px;
}
.review__open--desc .point div p {
  margin-bottom: 5px;
}

.review__open--desc .point div strong {
  margin-bottom: 0;
}

.review__open--desc .point span {
  padding: 8px 10px;
  font-weight: 600;
  color: #fff;
  background-color: #0056b3;
  display: inline-block;
  border-radius: 5px 5px 5px 0;
}

.review__open--desc .button {
  float: right;
}

.review__open--desc .button button i {
  margin-right: 5px;
}

.review__open--desc .button button {
  border: none;
  border-radius: 5px;
  padding: 5px 13px;
  background: #fff;
  color: #007bff;
}

.review__open--desc .button button:hover {
  background-color: #007bff16;
}

.review {
  /* color: #007bff; */
  /* cursor: pointer; */
}

.review {
  margin-top: 20px;
}

.review__point {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review__point h3 {
  font-size: 24px;
  font-weight: bold;
}

.review__point .point {
  padding: 10px;
  font-weight: 600;
  color: #fff;
  background-color: #0056b3;
  display: inline-block;
  border-radius: 5px 5px 5px 0;
}

.review__point--right button {
  border: none;
  padding: 5px 10px;
  color: #fff;
  font-weight: 600;
  background-color: #007bff;
  border-radius: 5px;
}

.review__process--bar .category {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.review__process--bar .process--bar {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background-color: #ddd;
  margin: 8px 0px;
  overflow: hidden;
}

.review__process--bar .process--bar .bar {
  background-color: #0056b3;
  height: 100%;
}

.review__process {
  margin-bottom: 10px;
}

.review__text {
  margin-top: 10px;
}

.reviewer {
  margin-top: 10px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.reviewer .name {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 5px;
}

.reviewer .name img {
  width: auto;
  height: 64px;
  border-radius: 50%;
  margin-right: 10px;
}

.review .btnAll {
  margin-top: 20px;
  border: 1px solid #0056b3;
  background-color: transparent;
  color: #0056b3;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 5px;
}

.review .btnAll:hover {
  color: #fff;
  background-color: #0056b3;
}

/* end review */

/* surrounding */
.surrounding__total {
  margin-top: 40px;
}

.sur__title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.surrounding__name h3 {
  font-size: 24px;
  font-weight: bold;
}

.sur__button button {
  border: none;
  padding: 5px 10px;
  color: #fff;
  font-weight: 600;
  background-color: #007bff;
  border-radius: 5px;
}

.sur__have--item {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.sur__have--item div {
  font-weight: 400;
  font-size: 13px;
}
/* end surrounding*/

/* policy */

.policy {
  margin: 40px 0px;
}
.policy__title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.policy__name h3 {
  font-size: 24px;
  font-weight: bold;
}

.policy__name {
  margin-bottom: 20px;
}

.policy__button button {
  border: none;
  padding: 5px 10px;
  color: #fff;
  font-weight: 600;
  background-color: #007bff;
  border-radius: 5px;
}

.policy__condition {
  border: 1px solid #ddd;
}

.policy__condition--total {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dddd;
  padding: 20px 20px 20px 20px;
}

.policy__condition--title {
  padding-right: 40px;
  padding-left: 40px;
  width: 30%;
  display: flex;
  align-items: center;
}

.policy__condition--title i {
  margin-right: 10px;
}

.policy__condition--text {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

/* end policy */
</style>
