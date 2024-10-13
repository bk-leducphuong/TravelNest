<template>
    <header class="header">
        <div class="logo">Booking.com</div>
        <div class="right-section">
            <span class="currency">VND</span>
            <span class="language"><span class="flag"></span></span>
            <span class="help">?</span>
            <span>Đăng chỗ nghỉ của Quý vị</span>
            <button class="button">Đăng ký</button>
            <button class="button">Đăng nhập</button>
        </div>
    </header>
    <div class="hero">
        <div class="hero-content">
            <h1>Tìm chỗ nghỉ tiếp theo</h1>
            <p>Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...</p>
        </div>
        <div class="search-bar">
            <input type="text" class="search-input" id="location-input" placeholder="Bạn muốn đến đâu?" value="">
            <div class="location-popup" id="location-popup">
                <h3>Điểm đến được ưa thích gần đây</h3>
                <ul class="location-list">
                    <li class="location-item">
                        <div class="location-icon"></div>
                        <div class="location-info">
                            <span class="location-name">Phú Quốc</span>
                            <span class="location-country">Việt Nam</span>
                        </div>
                    </li>
                    <li class="location-item">
                        <div class="location-icon"></div>
                        <div class="location-info">
                            <span class="location-name">Hà Nội</span>
                            <span class="location-country">Việt Nam</span>
                        </div>
                    </li>
                    <li class="location-item">
                        <div class="location-icon"></div>
                        <div class="location-info">
                            <span class="location-name">Sa Pa</span>
                            <span class="location-country">Việt Nam</span>
                        </div>
                    </li>
                    <li class="location-item">
                        <div class="location-icon"></div>
                        <div class="location-info">
                            <span class="location-name">Đà Lạt</span>
                            <span class="location-country">Việt Nam</span>
                        </div>
                    </li>
                    <li class="location-item">
                        <div class="location-icon"></div>
                        <div class="location-info">
                            <span class="location-name">Đà Nẵng</span>
                            <span class="location-country">Việt Nam</span>
                        </div>
                    </li>
                </ul>
            </div>
            <input type="text" class="search-input" placeholder="Ngày nhận phòng — Ngày trả phòng" value="T5, 17 tháng 10 — T5, 24 tháng 10">
            <select class="person-select">
                <option>2 người lớn · 1 trẻ em · 1 phòng</option>
            </select>
            <button class="search-button">Tìm</button>
        </div>
    </div>
    <!-- <div class="main-content">
        <h2>Các điểm đến phổ biến</h2>
        <p>Đây là nơi bạn có thể thêm nội dung chính của trang.</p>
    </div> -->

</template>

<script>

</script>

<style scoped>
    body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
        }
        .header {
            background-color: #003580;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
        }
        .right-section {
            display: flex;
            align-items: center;
        }
        .currency, .language, .help {
            margin-right: 15px;
        }
        .flag {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            background-image: url('https://q-xx.bstatic.com/backend_static/common/flags/new/48-squared/vn.png');
            background-size: cover;
        }
        .button {
            background-color: white;
            color: #003580;
            border: none;
            padding: 8px 16px;
            margin-left: 10px;
            cursor: pointer;
            font-weight: bold;
            border-radius: 4px;
        }
        .hero {
            background-color: #003580;
            padding: 50px 20px 100px;
            position: relative;
        }
        .hero-content {
            color: white;
            text-align: center;
            margin-bottom: 60px;
        }
        .hero h1 {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .hero p {
            font-size: 24px;
        }
        .search-bar {
            background-color: #ffb700;
            width: 1100px;
            height: 77.33px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 4px;
            box-sizing: border-box;
            border-radius: 4px;
            position: absolute;
            left: 50%;
            bottom: -38.665px;
            transform: translateX(-50%);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .search-input {
            height: 69.33px;
            padding: 0 10px 0 40px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            background-repeat: no-repeat;
            background-position: 10px center;
            background-size: 24px;
        }
        .search-input:nth-child(1) {
            width: 40%;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>');
        }
        .search-input:nth-child(2) {
            width: 35%;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>');
        }
        .person-select {
            width: 15%;
            height: 69.33px;
            padding: 0 10px 0 40px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            background-color: white;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>');
            background-repeat: no-repeat;
            background-position: 10px center;
            background-size: 24px;
            cursor: pointer;
        }
        .search-button {
            background-color: #0071c2;
            color: white;
            border: none;
            height: 69.33px;
            padding: 0 20px;
            cursor: pointer;
            font-weight: bold;
            border-radius: 4px;
            font-size: 16px;
            width: 10%;
        }
        .location-popup {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 440px;
            background-color: white;
            border-radius: 4px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.15);
            padding: 16px;
            z-index: 1000;
        }
        .location-popup h3 {
            margin-top: 0;
            margin-bottom: 16px;
            font-size: 16px;
            color: #333;
        }
        .location-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .location-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            cursor: pointer;
        }
        .location-item:hover {
            background-color: #f2f2f2;
        }
        .location-icon {
            width: 24px;
            height: 24px;
            margin-right: 16px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>');
        }
        .location-info {
            display: flex;
            flex-direction: column;
        }
        .location-name {
            font-weight: bold;
            color: #333;
        }
        .location-country {
            font-size: 14px;
            color: #666;
        }
      
</style>
