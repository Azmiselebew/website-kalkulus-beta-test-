/* FILENAME: script.js 
   DESC: Logika Preloader, Navigasi Mobile & Pencarian
*/

// 1. LOGIKA PRELOADER (Loading Screen)
window.addEventListener("load", () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Tambahkan class CSS untuk fade-out
        preloader.classList.add('loader-hide');
        // Hapus dari tampilan setelah animasi selesai (0.5 detik)
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// 2. LOGIKA CONTENT (Menu & Search)
document.addEventListener('DOMContentLoaded', () => {
    
    // ——— HAMBURGER MENU ———
    const hamburger = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }

    // ——— SEARCH MATERI ———
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.materi-card');

    if (searchInput && cards.length > 0) {
        searchInput.addEventListener('keyup', function(e) {
            const term = e.target.value.toLowerCase();
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                
                if(title.includes(term) || desc.includes(term)) { 
                    card.style.display = 'flex'; 
                } else { 
                    card.style.display = 'none'; 
                }
            });
        });
    }
});