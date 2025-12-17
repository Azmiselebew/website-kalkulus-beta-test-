/* FILENAME: script.js 
   DESC: Logika Preloader, Menu, Search, Kalkulator & Quiz Engine
*/

// ——— 1. DATA SOAL QUIZ ———
const quizData = {
    // Topik 1: PERTIDAKSAMAAN (5 Soal Contoh)
    pertidaksamaan: [
        {
            question: "1. Tanda pertidaksamaan mana yang berarti 'Kurang dari atau Sama dengan'?",
            options: ["A. >", "B. <", "C. ≤", "D. ≥"],
            answer: "C. ≤"
        },
        {
            question: "2. Jika kedua ruas pertidaksamaan dibagi dengan bilangan negatif, apa yang terjadi pada tanda pertidaksamaan?",
            options: ["A. Tetap sama", "B. Tanda harus dibalik", "C. Berubah menjadi sama dengan", "D. Nilai x menjadi positif"],
            answer: "B. Tanda harus dibalik"
        },
        {
            question: "3. Tentukan himpunan penyelesaian dari 2x + 1 > 5.",
            options: ["A. x > 2", "B. x < 2", "C. x > 3", "D. x < 3"],
            answer: "A. x > 2"
        },
        {
            question: "4. Apakah x = 4 termasuk himpunan penyelesaian dari x² - 9 < 0?",
            options: ["A. Ya", "B. Tidak"],
            answer: "B. Tidak"
        },
        {
            question: "5. Titik nol (pembuat nol) dari (x - 5)(x + 2) adalah...",
            options: ["A. x = 5 dan x = -2", "B. x = -5 dan x = 2", "C. x = 5 dan x = 2", "D. x = -5 dan x = -2"],
            answer: "A. x = 5 dan x = -2"
        }
    ],
    // Tambahkan topik lain di sini jika ada
};

// ——— 2. KONTROL VARIABEL GLOBAL ———
let currentTopic = '';
let currentQuestionIndex = 0;
let userAnswers = {};
let score = 0;
let quizTimer; 
const EXAM_DURATION = 600; 


// ——— 3. LOGIKA UTAMA UI & QUIZ ———

// 3.1. PRELOADER & DOM LISTENERS
window.addEventListener("load", () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loader-hide');
        setTimeout(() => preloader.style.display = 'none', 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // LOGIC MOBILE MENU TOGGLE
    const hamburger = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
        });
    }
    
    // Logic Search (for materi.html)
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.materi-card');
    if (searchInput && cards.length > 0) {
        searchInput.addEventListener('keyup', function(e) {
            const term = e.target.value.toLowerCase();
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                if(title.includes(term) || desc.includes(term)) { card.style.display = 'flex'; } else { card.style.display = 'none'; }
            });
        });
    }
    
    // Logic Navigasi Quiz di Latihan.html
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtnSidebar = document.getElementById('submit-btn-sidebar');
    
    if (nextBtn) nextBtn.addEventListener('click', () => navigate('next'));
    if (prevBtn) prevBtn.addEventListener('click', () => navigate('prev'));
    if (submitBtnSidebar) submitBtnSidebar.addEventListener('click', showResults);
});

// 3.3. QUIZ ENGINE FUNCTIONS
function startQuiz(topic) {
    if (!quizData[topic]) { alert("Soal untuk topik ini belum tersedia!"); return; }
    
    currentTopic = topic; currentQuestionIndex = 0; userAnswers = {}; score = 0;
    
    document.getElementById('main-title').innerHTML = `LATIHAN SOAL: ${topic.toUpperCase().replace('-', ' ')}`;
    document.getElementById('topic-list').style.display = 'none';
    document.getElementById('quiz-app').style.display = 'block'; 
    
    document.getElementById('quiz-title-sidebar').innerHTML = topic.toUpperCase().replace('-', ' ');
    document.getElementById('quiz-results').style.display = 'none';
    
    startTimer(EXAM_DURATION);
    buildQuestionSidebar();
    loadQuestion();
}

function loadQuestion() {
    const topicQuestions = quizData[currentTopic];
    if (currentQuestionIndex >= topicQuestions.length) { showResults(); return; }
    
    const q = topicQuestions[currentQuestionIndex];
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtnSidebar = document.getElementById('submit-btn-sidebar'); 

    // Atur display tombol
    if (currentQuestionIndex === topicQuestions.length - 1) {
        if (nextBtn) nextBtn.style.display = 'none'; 
        if (submitBtnSidebar) submitBtnSidebar.style.display = 'block';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-block';
        if (submitBtnSidebar) submitBtnSidebar.style.display = 'none';
    }

    if (prevBtn) prevBtn.style.display = (currentQuestionIndex > 0) ? 'inline-block' : 'none';
    
    // Update Sidebar Navigasi
    document.querySelectorAll('.question-nav-btn').forEach((btn, index) => {
        btn.classList.remove('active');
        if (index === currentQuestionIndex) { btn.classList.add('active'); }
        if (userAnswers[index]) { btn.classList.add('answered'); } else { btn.classList.remove('answered'); }
    });

    // Bangun HTML Pertanyaan
    let optionsHtml = '';
    q.options.forEach((option, index) => {
        const optionId = `q${currentQuestionIndex}-opt${index}`;
        const checked = (userAnswers[currentQuestionIndex] === option) ? 'checked' : '';
        optionsHtml += `
            <li>
                <input type="radio" id="${optionId}" name="q${currentQuestionIndex}" value="${option}" ${checked} 
                       onclick="saveAnswer('${option}')">
                <label for="${optionId}">${option}</label>
            </li>
        `;
    });

    document.getElementById('quiz-area').innerHTML = `
        <div class="question-box">
            <h4>Soal ${currentQuestionIndex + 1} dari ${topicQuestions.length}:<br>${q.question}</h4>
        </div>
        <ul class="option-group"> ${optionsHtml} </ul>
    `;
}

function saveAnswer(answer) { 
    userAnswers[currentQuestionIndex] = answer;
    const currentBtn = document.getElementById(`q-btn-${currentQuestionIndex}`);
    if (currentBtn) currentBtn.classList.add('answered');
}

function navigate(direction) {
    if (direction === 'next' && currentQuestionIndex < quizData[currentTopic].length - 1) currentQuestionIndex++;
    else if (direction === 'prev' && currentQuestionIndex > 0) currentQuestionIndex--;
    loadQuestion();
}

function showResults() {
    clearInterval(quizTimer); // Hentikan Timer
    const topicQuestions = quizData[currentTopic];
    score = 0;
    
    // 1. Cek Jawaban dan Hitung Skor
    topicQuestions.forEach((q, index) => { 
        if (userAnswers[index] === q.answer) {
             score++; 
        }
    });

    // 2. Tampilkan Hasil
    const total = topicQuestions.length;
    const percentage = (score / total) * 100;
    
    document.getElementById('quiz-results').innerHTML = `
        <h3>HASIL UJIAN</h3>
        <p style="font-size:1.5rem; font-weight:700; color:${percentage >= 80 ? '#4ecdc4' : 'red'};">${score} / ${total} Benar</p>
        <p>Persentase: <b>${percentage.toFixed(0)}%</b></p>
        <p>Silakan klik tombol di bawah untuk kembali ke daftar topik.</p>
        <button id="restart-btn" class="btn-start" style="margin-top:20px;">KEMBALI</button>
        
        <h4 style="margin-top:30px; border-top: 1px solid #ddd; padding-top:20px;">Review Jawaban:</h4>
        <div id="review-area"></div>
    `;
    
    // 3. Tampilkan Review Jawaban (Logic Feedback)
    const reviewArea = document.getElementById('review-area');

    topicQuestions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = (userAnswer === q.answer);
        const statusColor = isCorrect ? 'var(--color-success)' : 'var(--color-red-light)';
        
        reviewArea.innerHTML += `
            <div style="padding: 15px; border-left: 5px solid ${statusColor}; margin-bottom: 10px; background: ${isCorrect ? '#e6fffb' : '#ffe6e6'}; border-radius: 8px; text-align: left;">
                <p><strong>Soal ${index + 1}:</strong> ${q.question}</p>
                <p style="margin: 0; font-size: 0.95rem;">Jawaban Anda: <strong>${userAnswer || 'Tidak Dijawab'}</strong> (<span style="color:${statusColor}">${isCorrect ? 'Benar' : 'Salah'}</span>)</p>
                ${!isCorrect ? `<p style="margin: 0; font-size: 0.95rem;">Jawaban Benar: <strong>${q.answer}</strong></p>` : ''}
            </div>
        `;
    });

    // 4. Sembunyikan UI Ujian
    const examSidebar = document.getElementById('exam-sidebar');
    const quizMainArea = document.getElementById('quiz-main-area');
    if (examSidebar) examSidebar.style.display = 'none';
    if (quizMainArea) quizMainArea.style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        if (examSidebar) examSidebar.style.display = 'flex';
        if (quizMainArea) quizMainArea.style.display = 'block';
        document.getElementById('quiz-app').style.display = 'none';
        document.getElementById('topic-list').style.display = 'grid';
        document.getElementById('main-title').innerHTML = "PILIH TOPIK UJIAN";
    });
}

function buildQuestionSidebar() {
    const topicQuestions = quizData[currentTopic];
    const indicatorDiv = document.getElementById('question-nav-indicator');
    if (!indicatorDiv) return;
    indicatorDiv.innerHTML = '';
    
    topicQuestions.forEach((q, index) => {
        const btn = document.createElement('button');
        btn.className = 'question-nav-btn';
        btn.id = `q-btn-${index}`;
        btn.innerText = index + 1;
        btn.onclick = () => { currentQuestionIndex = index; loadQuestion(); };
        indicatorDiv.appendChild(btn);
    });
    document.getElementById('quiz-title-sidebar').innerHTML = currentTopic.toUpperCase().replace('-', ' ');
}

function startTimer(duration) {
    let timer = duration;
    const display = document.querySelector('#exam-timer span');
    
    clearInterval(quizTimer); 

    const countdown = () => {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = 0;
            clearInterval(quizTimer);
            alert("Waktu Habis! Jawaban otomatis dikumpulkan.");
            showResults();
        }
    };
    
    countdown(); 
    quizTimer = setInterval(countdown, 1000);
}


// ——— 4. LOGIKA KALKULATOR (Placeholder - Perlu Diisi) ———
function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.db-menu-btn').forEach(b => b.classList.remove('active'));
    const target = document.getElementById(tabName);
    if(target) target.classList.add('active');
    const btns = document.querySelectorAll('.db-menu-btn');
    btns.forEach(btn => {
        if(btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
    });
}

function showResult(boxId, textId, msg) {
    const textBox = document.getElementById(textId);
    const container = document.getElementById(boxId);
    if(textBox && container) { textBox.innerHTML = msg; container.style.display = 'block'; }
}

// ASUMSI: Semua 10 fungsi kalkulator hitung sudah ada di file script.js user.