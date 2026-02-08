document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");

  // Gestion du bouton clair/sombre
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      toggleButton.textContent = "☀️ Mode clair";
    } else {
      toggleButton.textContent = "🌙 Mode sombre";
    }
  });

  // Gestion des modes (Naturel, Roast, Sympathique, Philosophique)
  const modeButtons = document.querySelectorAll(".mode-btn");
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Retirer l'état actif des autres boutons
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Supprimer les classes de mode existantes
      document.body.classList.remove(
        "mode-naturel",
        "mode-roast",
        "mode-sympathique",
        "mode-philosophique"
      );

      // Ajouter la classe correspondant au mode choisi
      const mode = btn.dataset.mode;
      document.body.classList.add(`mode-${mode}`);

      console.log("Mode sélectionné :", mode);

      // Exemple de logique pour adapter les réponses du chatbot
      const chatContainer = document.getElementById("chat-container");
      const botMessage = document.createElement("div");
      botMessage.classList.add("message", "bot-message");

      let messageText = "";

      switch (mode) {
        case "naturel":
          messageText = "Mode Naturel activé 😊 : je répondrai de façon simple et directe.";
          break;
        case "roast":
          messageText = "Mode Roast activé 🔥 : prépare-toi à des réponses piquantes et sarcastiques.";
          break;
        case "sympathique":
          messageText = "Mode Sympathique activé 💖 : je vais être super gentil et encourageant.";
          break;
        case "philosophique":
          messageText = "Mode Philosophique activé 🧘 : je vais répondre avec profondeur et réflexion.";
          break;
      }

      botMessage.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content"><p>${messageText}</p></div>
      `;

      chatContainer.appendChild(botMessage);
    });
  });

  // Gestion de l'envoi des messages utilisateur
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");

  function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // Afficher le message utilisateur
    const chatContainer = document.getElementById("chat-container");
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content"><p>${text}</p></div>
    `;
    chatContainer.appendChild(userMessage);

    // Réponse du bot selon le mode actif
    const activeMode = document.querySelector(".mode-btn.active").dataset.mode;
    let botReply = "";

    switch (activeMode) {
      case "naturel":
        botReply = `Réponse naturelle : "${text}" est une bonne question !`;
        break;
      case "roast":
        botReply = `Réponse roast 🔥 : Franchement, "${text}"... tu pouvais mieux faire 😏`;
        break;
      case "sympathique":
        botReply = `Réponse sympathique 💖 : Oh super question "${text}" ! Tu es génial 👏`;
        break;
      case "philosophique":
        botReply = `Réponse philosophique 🧘 : "${text}"... et si la vraie réponse était en toi ? 🤔`;
        break;
    }

    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message");
    botMessage.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content"><p>${botReply}</p></div>
    `;
    chatContainer.appendChild(botMessage);

    userInput.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});