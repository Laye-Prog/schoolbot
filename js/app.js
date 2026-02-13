/* ==========================================
   🤖 CHATBOT ÉTUDIANT - MODULE 3 FINAL
   Base de données simulée + plus drôle
   ========================================== */

let currentMode = 'naturel';
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// ============================================
// BASE DE DONNÉES SIMULÉE
// ============================================
const studentsDB = [
    { nom: "Jean Dupont", age: 21, filiere: "Informatique de Gestion", funFact: "Parle 3 langues couramment !", funniest: false, photo: "👨‍💻" },
    { nom: "Marie Martin", age: 22, filiere: "Marketing", funFact: "Elle adore les chats et en a 4 !", funniest: true, photo: "👩‍🎓" },
    { nom: "Aliou Diop", age: 20, filiere: "Finance", funFact: "Champion de football universitaire 🏆", funniest: false, photo: "⚽" }
];

// ============================================
// INITIALISATION
// ============================================
function initializeApp() {
    console.log('🚀 Initialisation du ChatBot Module 3...');

    // --- Thème clair/sombre ---
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('chatbot-theme') || 'dark';
    if(savedTheme === 'light') document.body.classList.add('light-theme');

    if(themeToggle){
        themeToggle.addEventListener('click', ()=>{
            document.body.classList.toggle('light-theme');
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('chatbot-theme', currentTheme);
        });
    }

    // --- Modes ---
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function(){
            modeButtons.forEach(b=>b.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
            addBotMessage(`Mode ${getModeEmoji(currentMode)} ${currentMode} activé ! Essaie de me poser une question maintenant 😊`);
        });
    });

    // --- Envoi de messages ---
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

    console.log('✅ ChatBot Module 3 initialisé !');
}

// ============================================
// ENVOI DE MESSAGE
// ============================================
function sendMessage(){
    const message = userInput.value.trim();
    if(message===''){
        userInput.classList.add('shake');
        setTimeout(()=>userInput.classList.remove('shake'), 500);
        return;
    }

    addUserMessage(message);
    userInput.value = '';
    showTypingIndicator();

    const delay = Math.random()*2000+1000;
    setTimeout(()=>{
        hideTypingIndicator();
        const response = generateTemporaryResponse(message, currentMode);
        addBotMessage(response);
    }, delay);
}

// ============================================
// TYPING INDICATOR
// ============================================
function showTypingIndicator(){
    if(document.getElementById('typing-indicator')) return;
    const indicator = document.createElement('div');
    indicator.className = 'message bot-message typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </div>
    `;
    chatContainer.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator(){
    const ind = document.getElementById('typing-indicator');
    if(ind) ind.remove();
}

// ============================================
// AJOUT MESSAGES
// ============================================
function addUserMessage(msg){
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content"><p>${escapeHTML(msg)}</p></div>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function addBotMessage(msg){
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">${msg}</div>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();
}

// ============================================
// RÉPONSES SIMULÉES (Module 3)
// ============================================
function generateTemporaryResponse(message, mode){
    const m = message.toLowerCase();

    // --- Qui est le plus drôle ?
    if(m.includes("qui est le plus drôle") || m.includes("plus drôle")){
        const funnyStudent = studentsDB.find(s => s.funniest);
        if(funnyStudent){
            return `<p>${getModeEmoji(mode)} Le plus drôle est <strong>${funnyStudent.nom}</strong> ! 😂</p>
                    <p>Fun fact : ${funnyStudent.funFact}</p>`;
        } else {
            return `<p>${getModeEmoji(mode)} Je ne sais pas encore qui est le plus drôle ! 🤔</p>`;
        }
    }

    // --- Infos par nom ---
    const found = studentsDB.find(s => m.includes(s.nom.toLowerCase()));
    if(found){
        return `<p>${getModeEmoji(mode)} Infos sur <strong>${found.nom}</strong> :</p>
                <ul>
                    <li>Âge : ${found.age}</li>
                    <li>Filière : ${found.filiere}</li>
                    <li>Fun fact : ${found.funFact}</li>
                </ul>`;
    }

    // --- Salutations & Merci ---
    if(m.includes('bonjour') || m.includes('salut') || m.includes('hey')) return getModeEmoji(mode)+' '+getGreeting(mode);
    if(m.includes('merci')) return getModeEmoji(mode)+' '+getThanksResponse(mode);

    // --- Réponse par défaut selon le mode ---
    const defaults = {
        naturel:["Intéressant ! Je n'ai pas encore toutes les infos sur ce camarade.","Bonne question ! Bientôt je pourrai te donner plus d'infos ! 😊"],
        roast:["Tu veux vraiment que je parle de lui ? 😂","Je n'ai pas encore son historique, patience ! 🔥"],
        sympathique:["Je suis ravi de ta curiosité ! 💖","Encore un peu et je pourrai te donner toutes les infos ! 🥰"],
        philosophique:["Connaître un étudiant, c'est un voyage... 🧘","Je réfléchis encore sur cette personne. Patience ! ✨"]
    };
    const arr = defaults[mode] || defaults.naturel;
    return `<p>${getModeEmoji(mode)} ${arr[Math.floor(Math.random()*arr.length)]}</p>`;
}

// ============================================
// UTILITAIRES
// ============================================
function getModeEmoji(mode){ const e={naturel:'😊',roast:'🔥',sympathique:'💖',philosophique:'🧘'}; return e[mode]||'🤖'; }
function getGreeting(mode){ return "Salut ! Comment puis-je t'aider ?"; }
function getThanksResponse(mode){ return "Avec plaisir ! 😊"; }
function escapeHTML(str){ const div=document.createElement('div'); div.textContent=str; return div.innerHTML; }
function scrollToBottom(){ chatContainer.scrollTop=chatContainer.scrollHeight; }

// ============================================
// DÉMARRAGE
// ============================================
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', initializeApp); }
else initializeApp();
