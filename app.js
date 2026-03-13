// app.js — corrigé : IDs alignés sur le HTML (chat-input, send, messages)
// Ne redéfinit PAS sendMessage() pour éviter le conflit avec le script inline.
// Branche le fetch réel sur le bouton et délègue l'affichage aux fonctions inline.

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send"); // bouton .send-btn
  const inputEl = document.getElementById("chat-input"); // textarea #chat-input

  if (!sendBtn || !inputEl) return; // sécurité : éléments absents

  // Remplace le onclick inline par un vrai event listener
  sendBtn.addEventListener("click", handleSend);

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  async function handleSend() {
    const text = inputEl.value.trim();
    if (!text || window.isThinking) return;

    // Affiche le message utilisateur (fonction définie dans le script inline)
    addMessage("user", text);
    inputEl.value = "";
    inputEl.style.height = "auto";

    // Affiche le loader (fonction définie dans le script inline)
    showThinking();

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("Réponse serveur invalide");

      const data = await response.json();

      // Retire le loader et affiche la réponse réelle
      const thinkingMsg = document.getElementById("thinking-msg");
      if (thinkingMsg) thinkingMsg.remove();
      addMessage("ai", data.reply);
      window.isThinking = false;
    } catch (err) {
      console.warn("Fetch /chat échoué :", err.message);
      const thinkingMsg = document.getElementById("thinking-msg");
      if (thinkingMsg) thinkingMsg.remove();
      addMessage("ai", "Erreur : impossible de contacter le serveur.");
      window.isThinking = false;
    }
  }
}); // fin DOMContentLoaded
