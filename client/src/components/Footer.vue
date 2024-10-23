<script setup>

</script>

<template>
    <div class="footer">
        <div class="footer-content">
            <div class="footer-column">
                <h3>Support</h3>
                <ul>
                    <li><a href="#">Coronavirus (COVID-19) FAQs</a></li>
                    <li><a href="#">Manage your trips</a></li>
                    <li><a href="#">Contact Customer Service</a></li>
                    <li><a href="#">Safety resource centre</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Discover</h3>
                <ul>
                    <li><a href="#">Genius loyalty programme</a></li>
                    <li><a href="#">Seasonal and holiday deals</a></li>
                    <li><a href="#">Travel articles</a></li>
                    <li><a href="#">Booking.com for Business</a></li>
                    <li><a href="#">Traveller Review Awards</a></li>
                    <li><a href="#">Car hire</a></li>
                    <li><a href="#">Flight finder</a></li>
                    <li><a href="#">Restaurant reservations</a></li>
                    <li><a href="#">Booking.com for Travel Agents</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Terms and settings</h3>
                <ul>
                    <li><a href="#">Privacy & cookies</a></li>
                    <li><a href="#">Terms and conditions</a></li>
                    <li><a href="#">Partner dispute</a></li>
                    <li><a href="#">Modern Slavery Statement</a></li>
                    <li><a href="#">Human Rights Statement</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Partners</h3>
                <ul>
                    <li><a href="#">Extranet login</a></li>
                    <li><a href="#">Partner help</a></li>
                    <li><a href="#">List your property</a></li>
                    <li><a href="#">Become an affiliate</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>About</h3>
                <ul>
                    <li><a href="#">About Booking.com</a></li>
                    <li><a href="#">How we work</a></li>
                    <li><a href="#">Sustainability</a></li>
                    <li><a href="#">Press centre</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Investor relations</a></li>
                    <li><a href="#">Corporate contact</a></li>
                </ul>
            </div>
        </div>
        <div class="language-selector">
            <span>
                <button>VND</button>
            </span>
        </div>
        <div class="footer-bottom">
            <p>Booking.com is part of Booking Holdings Inc., the world leader in online travel and related services.</p>
            <p>Copyright © 1996–2024 Booking.com™. All rights reserved.</p>
        </div>
        <div class="brand-logos">
            <img src="" alt="Booking.com">
            <img src="" alt="Priceline">
            <img src="" alt="Kayak">
            <img src="" alt="Agoda">
            <img src="" alt="OpenTable">
        </div>
    </div>
</template>

<style scoped>
.footer {
    background-color: #e3e3e3;
;
    padding: 20px;
    font-size: 14px;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-column {
    flex: 1;
    margin-right: 20px;
}

.footer-column h3 {
    font-size: 16px;
    margin-bottom: 10px;
}

.footer-column ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.footer-column li {
    margin-bottom: 5px;
}

.footer-column a {
    color: #0071c2;
    text-decoration: none;
}

.footer-column a:hover {
    text-decoration: underline;
}

.footer-bottom {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
}

.language-selector {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.language-selector img {
    width: 20px;
    margin-right: 5px;
}

.brand-logos {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.brand-logos img {
    height: 20px;
    margin: 0 10px;
}
</style>
