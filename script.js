const chatMessages = document.querySelector('.chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) { // Enter key
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value;
  if (message.trim() === '') return;

  displayMessage(message, 'user');
  userInput.value = '';

  sendMessageToServer(message)
    .then(botResponse => {
      // Formata a resposta do bot antes de exibir
      const formattedResponse = formatText(botResponse); 
      displayMessage(formattedResponse, 'bot');
    })
    .catch(error => {
      console.error('Erro ao enviar mensagem para o servidor:', error);
      displayMessage('Erro ao conectar ao chatbot. Por favor, tente novamente.', 'bot');
    });
}

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  // Adiciona a mensagem formatada ao elemento
  messageElement.innerHTML = message; // Usa innerHTML para interpretar o HTML
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessageToServer(message) {
  const response = await fetch('https://green-tech-six.vercel.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mensagem: message })
  });

  if (!response.ok) {
    throw new Error(`Erro na solicitação: ${response.status}`);
  }

  const data = await response.json();
  return data.resposta;
}

// Função para formatar o texto da resposta do bot
function formatText(text) {
  // 1. Quebras de linha em <br>
  let formattedText = text.replace(/\n/g, '<br>'); 

  // 2. Formatação adicional (se necessário) - Exemplo: emojis
  formattedText = formattedText.replace(/:\)/g, '😊');
  formattedText = formattedText.replace(/;\)/g, '😉');
  // Adicione mais formatações conforme necessário

  return formattedText;
}