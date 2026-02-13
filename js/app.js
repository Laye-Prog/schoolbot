/* ==========================================
   🤖 CHATBOT ÉTUDIANT - SCRIPT PRINCIPAL
   Module 2 : Interface Avancée et Animations
   ========================================== */

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentMode = 'naturel';
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');

// ============================================
// INITIALISATION DE L'APPLICATION
// ============================================
function initializeApp() {
    console.log('🚀 Initialisation du ChatBot...');

    // --- CHARGER LE THÈME SAUVEGARDÉ ---
    const savedTheme = localStorage.getItem('chatbot-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // --- TOGGLE THÈME ---
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('chatbot-theme', currentTheme);
        });
    }

    // --- GESTION DES MODES ---
    const modeButtons = document.querySelectorAll('.mode-btn');
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentMode = this.dataset.mode;
            addBotMessage(`Mode ${getModeEmoji(currentMode)} ${currentMode} activé ! Essaie de me poser une question maintenant 😊`);
        });
    });

    // --- ENVOI DE MESSAGE ---
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (userInput) userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    console.log('✅ ChatBot initialisé avec succès !');
}

// ============================================
// ENVOI DE MESSAGE
// ============================================
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) {
        userInput.classList.add('shake');
        setTimeout(() => userInput.classList.remove('shake'), 500);
        return;
    }

    sendBtn.classList.add('sending');
    setTimeout(() => sendBtn.classList.remove('sending'), 500);

    addUserMessage(message);
    userInput.value = '';

    showTypingIndicator();

    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateTemporaryResponse(message, currentMode);
        addBotMessage(response);
    }, delay);
}

// ============================================
// TYPING INDICATOR
// ============================================
function showTypingIndicator() {
    if (document.getElementById('typing-indicator')) return;

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

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// ============================================
// AJOUT DE MESSAGES
// ============================================
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content"><p>${escapeHTML(message)}</p></div>
    `;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">${message}</div>
    `;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

// ============================================
// RÉPONSES TEMPORAIRES
// ============================================
function generateTemporaryResponse(message, mode) {
    const messageLower = message.toLowerCase();

    const responses = {
        naturel: [
            "Intéressant ! Je n'ai pas encore accès aux données, mais bientôt !",
            "Bonne question ! Patience pour le Module 3 😊",
            "Module 3 = accès aux données 🚧"
        ],
        roast: [
            "Oh là là, tu me poses une question alors que je n'ai même pas encore de cerveau ? 😂",
            "Vide comme un frigo d'étudiant ! 🔥",
            "Sérieux ? Champion 😎"
        ],
        sympathique: [
            "Merci pour ta question 💖 Je suis en construction !",
            "Tu es adorable 🥰 Patience !",
            "Ça me touche 💕 Encore un peu de patience !"
        ],
        philosophique: [
            "La connaissance est un voyage... 🧘 Module 3 bientôt.",
            "Qu'est-ce que connaître quelqu'un ? ✨",
            "Je suis une étoile naissante 🌟 Module 3 je brillerai."
        ]
    };

    if (messageLower.includes('bonjour') || messageLower.includes('salut') || messageLower.includes('hey')) {
        return getModeEmoji(mode) + ' ' + getGreeting(mode);
    }

    if (messageLower.includes('merci')) {
        return getModeEmoji(mode) + ' ' + getThanksResponse(mode);
    }

    const modeResponses = responses[mode] || responses.naturel;
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];

    return `<p>${getModeEmoji(mode)} ${randomResponse}</p>`;
}

// ============================================
// UTILITAIRES
// ============================================
function getModeEmoji(mode) {
    const emojis = { naturel: '😊', roast: '🔥', sympathique: '💖', philosophique: '🧘' };
    return emojis[mode] || '😊';
}

function getGreeting(mode) {
    const greetings = {
        naturel: 'Salut ! Comment puis-je t\'aider ?',
        roast: 'Tiens, quelqu\'un qui veut se faire rôtir ! 🔥',
        sympathique: 'Coucou ! Je suis tellement content de te voir ! 💖',
        philosophique: 'Bonjour, voyageur de la connaissance. 🧘'
    };
    return greetings[mode] || greetings.naturel;
}

function getThanksResponse(mode) {
    const thanks = {
        naturel: 'De rien, c\'est avec plaisir ! 😊',
        roast: 'Garde tes mercis 😎',
        sympathique: 'Oh mais c\'est moi qui te remercie 💕',
        philosophique: 'La gratitude est le chemin 🙏'
    };
    return thanks[mode] || thanks.naturel;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ============================================
// ANIMATION SHAKE
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {0%,100%{transform:translateX(0);}10%,30%,50%,70%,90%{transform:translateX(-5px);}20%,40%,60%,80%{transform:translateX(5px);}}
    .shake { animation: shake 0.5s; }
`;
document.head.appendChild(style);

// ============================================
// KONAMI CODE
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        addBotMessage(`
            <p>🎮 KONAMI CODE ACTIVÉ ! 🎮</p>
            <p>Tu gagnes... absolument rien 😄</p>
        `);
        konamiCode = [];
    }
});

// ============================================
// INITIALISATION
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('🎉 Module 2 chargé avec succès !');
