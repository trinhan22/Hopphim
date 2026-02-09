// --- DANH SÁCH CÁC URL QUẢNG CÁO CỦA BẠN ---
const adUrls = [
    "https://hopvan.netlify.app/"
];
        
// --- HÀM CHỌN URL NGẪU NHIÊN ---
function getRandomAdUrl() {
    const randomIndex = Math.floor(Math.random() * adUrls.length);
    return adUrls[randomIndex];
}


// Khai báo các biến và tham chiếu DOM
const adOverlay = document.getElementById('ad-overlay');
const skipButton = document.getElementById('skip-button');
const goToWebsiteButton = document.getElementById('go-to-website-button'); 
const adIframe = document.getElementById('ad-iframe'); // Tham chiếu đến iframe

// Lấy URL ngẫu nhiên và áp dụng
const selectedAdUrl = getRandomAdUrl();

if (adOverlay && skipButton && goToWebsiteButton && adIframe) { 
    // ÁP DỤNG URL NGẪU NHIÊN VÀO IFRAME
    adIframe.src = selectedAdUrl;
    
    const countdownSpan = skipButton.querySelector('span');
    let timeLeft = 5; 
    
    if (countdownSpan) {
        countdownSpan.textContent = timeLeft; 
    }

    // --- LOGIC CHO NÚT BỎ QUA (GIỮ NGUYÊN) ---
    const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        
        if (timeLeft > 0) {
            if (countdownSpan) {
                countdownSpan.textContent = timeLeft;
            } else {
                skipButton.textContent = `Skip ad (${timeLeft})`;
            }
        } else {
            clearInterval(countdownInterval); 
            skipButton.textContent = 'Skip ad'; 
            skipButton.classList.add('enabled');
            skipButton.removeAttribute('disabled'); 
        }
    }, 1000); 

    // Sự kiện khi bấm nút Bỏ qua
    skipButton.addEventListener('click', () => {
        if (skipButton.classList.contains('enabled')) {
            adOverlay.style.opacity = '0'; 
            setTimeout(() => {
                adOverlay.style.display = 'none'; 
            }, 500); 
        }
    });

    // --- LOGIC CHO NÚT TRUY CẬP TRANG WEB (Dùng URL ngẫu nhiên) ---
    goToWebsiteButton.addEventListener('click', () => {
        // 1. Mở link ngẫu nhiên đã chọn trong TAB MỚI
        window.open(selectedAdUrl, '_blank'); 
        
        // 2. Sau đó đóng quảng cáo
        adOverlay.style.opacity = '0'; 
        setTimeout(() => {
            adOverlay.style.display = 'none'; 
        }, 500);
    });
}

