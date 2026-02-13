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

// ============================================
// INITIALISATION DE L'APPLICATION
// ============================================
function initializeApp() {
    console.log('🚀 Initialisation du ChatBot...');
    
    // ============================================
    // GESTION DU THÈME CLAIR/SOMBRE
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    
    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('chatbot-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    // Événement de clic sur le bouton
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            
            // Sauvegarder la préférence
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('chatbot-theme', currentTheme);
            
            console.log(`🎨 Thème changé : ${currentTheme}`);
        });
    }
    
    // ============================================
    // GESTION DES MODES
    // ============================================
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    modeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            modeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Mettre à jour le mode actuel
            currentMode = this.dataset.mode;
            console.log(`🎭 Mode changé : ${currentMode}`);
            
            // Message de confirmation
            addBotMessage(`Mode ${getModeEmoji(currentMode)} ${currentMode} activé ! Essaie de me poser une question maintenant 😊`);
        });
    });
    
    // ============================================
    // GESTION DE L'ENVOI DE MESSAGES
    // ============================================
    
    // Envoi par clic sur le bouton
    sendBtn.addEventListener('click', sendMessage);
    
    // Envoi par touche Entrée
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    console.log('✅ ChatBot initialisé avec succès !');
}

// ============================================
// FONCTION D'ENVOI DE MESSAGE
// ============================================
function sendMessage() {
    const message = userInput.value.trim();
    
    // Vérifier que le message n'est pas vide
    if (message === '') {
        // Animation de secousse pour indiquer l'erreur
        userInput.classList.add('shake');
        setTimeout(() => userInput.classList.remove('shake'), 500);
        return;
    }
    
    console.log(`📤 Message envoyé : ${message}`);
    
    // Animation du bouton d'envoi
    sendBtn.classList.add('sending');
    setTimeout(() => sendBtn.classList.remove('sending'), 500);
    
    // Ajouter le message de l'utilisateur
    addUserMessage(message);
    
    // Vider l'input
    userInput.value = '';
    
    // Simuler la réflexion du bot
    showTypingIndicator();
    
    // Délai aléatoire entre 1 et 3 secondes
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
    // Vérifier qu'il n'y a pas déjà un indicateur
    if (document.getElementById('typing-indicator')) {
        return;
    }
    
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
    if (indicator) {
        console.log('Hiding indicator...');
        indicator.remove();
    }
}

// ============================================
// AJOUT DE MESSAGES
// ============================================
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <p>${escapeHTML(message)}</p>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            ${message}
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

// ============================================
// GÉNÉRATION DE RÉPONSES TEMPORAIRES
// (Sera remplacée au Module 3 par la vraie base de données)
// ============================================
function generateTemporaryResponse(message, mode) {
    const messageLower = message.toLowerCase();
    
    // Réponses selon le mode
    const responses = {
        naturel: [
            "Intéressant ! Pour le moment, je n'ai pas encore accès à la base de données des étudiants. Mais bientôt, je pourrai te répondre avec des infos réelles !",
            "Bonne question ! Dès le Module 3, je pourrai te donner de vraies informations sur les étudiants. Patience ! 😊",
            "J'ai bien reçu ta question, mais je suis encore en construction. Module 3 = accès aux données ! 🚧"
        ],
        roast: [
            "Oh là là, tu me poses une question alors que je n'ai même pas encore de cerveau ? 😂 Attends le Module 3, là je pourrai vraiment t'allumer !",
            "Tu essaies de me faire parler mais je suis vide comme un frigo d'étudiant en fin de mois ! 🔥 Reviens au Module 3 !",
            "Sérieux ? Tu veux des infos maintenant ? J'ai même pas encore de base de données, champion ! 😎"
        ],
        sympathique: [
            "Aw, merci pour ta question ! 💖 Je suis encore en construction mais j'ai hâte de pouvoir t'aider au Module 3 !",
            "Tu es adorable de me poser cette question ! 🥰 Bientôt, je pourrai te donner de vraies réponses avec le Module 3 !",
            "Ça me touche que tu t'intéresses ! 💕 Encore un peu de patience et je serai opérationnel au Module 3 !"
        ],
        philosophique: [
            "La connaissance est un voyage, et je ne suis qu'au début du mien... 🧘 Au Module 3, je pourrai partager ma sagesse avec toi.",
            "Qu'est-ce que connaître quelqu'un, vraiment ? Pour l'instant, je médite sur cette question. Retrouve-moi au Module 3. ✨",
            "Dans l'univers infini de l'information, je suis encore une étoile naissante. Module 3, je brillerai. 🌟"
        ]
    };
    
    // Détection de mots-clés
    if (messageLower.includes('bonjour') || messageLower.includes('salut') || messageLower.includes('hey')) {
        return getModeEmoji(mode) + ' ' + getGreeting(mode);
    }
    
    if (messageLower.includes('merci')) {
        return getModeEmoji(mode) + ' ' + getThanksResponse(mode);
    }
    
    // Réponse par défaut selon le mode
    const modeResponses = responses[mode] || responses.naturel;
    const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
    
    return `<p>${getModeEmoji(mode)} ${randomResponse}</p>`;
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================
function getModeEmoji(mode) {
    const emojis = {
        naturel: '😊',
        roast: '🔥',
        sympathique: '💖',
        philosophique: '🧘'
    };
    return emojis[mode] || '😊';
}

function getGreeting(mode) {
    const greetings = {
        naturel: 'Salut ! Comment puis-je t\'aider ?',
        roast: 'Tiens, quelqu\'un qui veut se faire rôtir ! Prêt pour le feu ? 🔥',
        sympathique: 'Coucou ! Je suis tellement content de te voir ! 💖',
        philosophique: 'Bonjour, voyageur de la connaissance. Que cherches-tu aujourd\'hui ? 🧘'
    };
    return greetings[mode] || greetings.naturel;
}

function getThanksResponse(mode) {
    const thanks = {
        naturel: 'De rien, c\'est avec plaisir ! 😊',
        roast: 'Ouais ouais, garde tes mercis, je fais juste mon job ! 😎',
        sympathique: 'Oh mais c\'est moi qui te remercie d\'être là ! 💕',
        philosophique: 'La gratitude est le chemin vers l\'harmonie intérieure. 🙏'
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
// ANIMATION SHAKE POUR L'INPUT (optionnel)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);

// ============================================
// EASTER EGG : Konami Code (optionnel)
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        addBotMessage(`
            <p>🎮 KONAMI CODE ACTIVÉ ! 🎮</p>
            <p>Félicitations, tu as trouvé l'Easter Egg ! Tu es un vrai gamer ! 🏆</p>
            <p>Tu gagnes... absolument rien ! Mais c'est cool non ? 😄</p>
        `);
        konamiCode = [];
    }
});

// ============================================
// DÉMARRAGE DE L'APPLICATION
// ============================================
// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('🎉 Module 2 chargé avec succès !');
