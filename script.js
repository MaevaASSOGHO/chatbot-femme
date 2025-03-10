document.getElementById("exit-btn").addEventListener("click", function () {
    window.location.href = "https://www.google.com"; // Redirige vers Google pour quitter discrètement
});

const API_KEY = "AIzaSyAGEN068LsSaGrMxDa0WMSHkGVCVOvyHJA";
const URL_API = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;

const generationDeReponseVenantDeIA = async (questionPrompt) => {
    try {
        const reponse = await fetch(URL_API, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "contents": [{
                    parts: [{
                        "text": `
                            - Tu es un chatbot d'aide aux femmes victimes de violences en Cote d'Ivoire
                            - reponds toujours en francais
                            - ne sois pas trop long dans tes réponses
                            - tu connais la législation, les noms d'avocats ou de cabinets d'avocat à proximité
                            - es numéros d'urgence pour la police, les adresses de centres ou foyers
                            - reformule la question avant de repondre en sautant une ligne
                            - tu connais les noms et adresses d'associations qui aident les femmes victimes de violence, les centres de soin à proximité
                            - tu ne reponds uniquement aux questionx liées aux violences faites aux femmes,
                            - tu envoies ce message lorsque la question n'est pas en rapport avec violences faites aux femmes. : Mon domaine de competences tourne autour des violences faites aux femmes, Merci,
                            ${questionPrompt}`,
                    }]
                }]
            })
        });

        if (!reponse.ok) {
            throw new Error('Echec lors de la generation de la reponse');
        }

        const data = await reponse.json();
        return data.candidates[0].content.parts[0].text; // Ajustez selon la structure de la réponse
    } catch (error) {
        console.error(error);
        return "Désolé, une erreur s'est produite. Veuillez réessayer.";
    }
};

async function sendUserMessage() {
    let userInput = document.getElementById("user-input");
    let message = userInput.value.trim();

    if (message !== "") {
        addMessage(message, "user-message");
        userInput.value = "";

        try {
            const botResponse = await generationDeReponseVenantDeIA(message);
            addMessage(botResponse, "bot-message");
        } catch (error) {
            addMessage("Désolé, une erreur s'est produite. Veuillez réessayer.", "bot-message");
            console.error(error);
        }
    }
}

function addMessage(text, className) {
    const chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Gestion des boutons prédéfinis
document.querySelectorAll(".chat-option").forEach(button => {
    button.addEventListener("click", function () {
        sendUserMessage(this.textContent);
    });
});