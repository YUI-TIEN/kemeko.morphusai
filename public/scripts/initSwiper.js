// Initialize Swiper
document.addEventListener('DOMContentLoaded', function() {
    // 檢查 Swiper 是否已載入
    if (typeof Swiper === 'undefined') {
        console.error('Swiper library not loaded');
        return;
    }

    const swiper = new Swiper('.swiper-container', {
        // 基本設定
        direction: 'horizontal',
        loop: true,
        centeredSlides: true,
        
        // 每次顯示的slide數量
        slidesPerView: 'auto',
        spaceBetween: 30,
        
        // 自動播放
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        
        // 分頁點
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // 導航箭頭
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // 響應式設定
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        },
        
        // 效果
        effect: 'slide',
        speed: 600,
        
        // 觸控設定
        simulateTouch: true,
        allowTouchMove: true,
    });

    // 錯誤處理
    swiper.on('error', function(error) {
        console.error('Swiper error:', error);
    });
});