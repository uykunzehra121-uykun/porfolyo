/**
 * Zehra Uykun - Dijital Tasarım Portfolyosu JS Kontrolleri
 * 
 * Bu dosya sitedeki kaydırma animasyonları, logo ve poster slayt geçişleri (3 saniyede bir otomatik geçiş)
 * ve görsel inceleme (lightbox) modalı gibi dinamik özellikleri kontrol eder.
 */

// Slayt durumları ve sayaçları
let currentSlides = {
    logos: 0,
    posters: 0
};

// Otomatik geçiş zamanlayıcıları (Intervals)
let slideIntervals = {
    logos: null,
    posters: null
};

/**
 * Sayfayı en yukarı pürüzsüzce kaydırır
 */
function scrollToTop() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Belirli bir tasarım bölümüne (kategoriye) pürüzsüzce kaydırır
 * @param {string} categoryId - Kategori ID'si ('logos' veya 'posters')
 */
function showDesign(categoryId) {
    const element = document.getElementById('view-' + categoryId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Belirli bir kategorideki aktif slaydı gösterir ve diğerlerini gizler
 * @param {string} type - Slayt türü ('logos' veya 'posters')
 * @param {number} index - Slayt dizini (0-indexed)
 */
function showSlide(type, index) {
    const section = document.getElementById('view-' + type);
    if (!section) return;

    const slides = section.querySelectorAll('.slide');
    const dots = section.querySelectorAll('.dot');
    
    if (slides.length === 0) return;

    // Sınır aşımı kontrolü (dairesel döngü)
    if (index >= slides.length) {
        index = 0;
    } else if (index < 0) {
        index = slides.length - 1;
    }

    currentSlides[type] = index;

    // Slaytların sınıflarını güncelle
    slides.forEach((slide, idx) => {
        if (idx === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Noktaların (Göstergelerin) sınıflarını güncelle
    dots.forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Kullanıcı bir noktaya tıkladığında slaydı değiştirir ve otomatik geçişi sıfırlar
 * @param {string} type - Slayt türü ('logos' veya 'posters')
 * @param {number} index - Slayt dizini (0-indexed)
 */
function currentSlide(type, index) {
    showSlide(type, index);
    resetAutoPlay(type);
}

/**
 * Slaydı bir sonraki konuma taşır
 * @param {string} type - Slayt türü ('logos' veya 'posters')
 */
function nextSlide(type) {
    showSlide(type, currentSlides[type] + 1);
}

/**
 * Otomatik slayt geçişini (3 saniyede bir) başlatır
 * @param {string} type - Slayt türü ('logos' veya 'posters')
 */
function startAutoPlay(type) {
    slideIntervals[type] = setInterval(() => {
        nextSlide(type);
    }, 3000); // 3000 ms = 3 saniye
}

/**
 * Kullanıcı manuel etkileşime girdiğinde otomatik geçiş süresini sıfırlar
 * @param {string} type - Slayt türü ('logos' veya 'posters')
 */
function resetAutoPlay(type) {
    if (slideIntervals[type]) {
        clearInterval(slideIntervals[type]);
    }
    startAutoPlay(type);
}

// Sayfa yüklendiğinde çalışacak olan kodlar
document.addEventListener('DOMContentLoaded', () => {
    // 1. Sürükleyici slaytların otomatik geçişini başlat
    startAutoPlay('logos');
    startAutoPlay('posters');

    // 2. Lightbox (Görsel İnceleme Modalı) Yönetimi
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Tıklanabilir görsel taşıyıcıları
    const imageContainers = document.querySelectorAll('.design-image, .poster-image');

    imageContainers.forEach(container => {
        container.addEventListener('click', () => {
            const img = container.querySelector('img');
            // Resmin yüklenemediği veya görünmediği durumları filtrele
            if (img && img.style.display !== 'none') {
                lightboxImage.src = img.src;
                lightboxCaption.textContent = img.alt || "Görsel Önizleme";
                lightboxModal.classList.add('active');
            }
        });
    });

    // Kapatma butonuna tıklayınca lightbox'ı kapat
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    // Modal dışındaki boşluğa tıklayınca kapat
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }

    // ESC tuşu ile kapatma seçeneği ekle
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            lightboxModal.classList.remove('active');
        }
    });
});
