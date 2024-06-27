const chatMessages = document.querySelector('.chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Event listener para enviar mensagem ao clicar no botão
sendBtn.addEventListener('click', sendMessage);

// Event listener para enviar mensagem ao pressionar Enter
userInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) { 
    event.preventDefault();
    sendMessage();
  }
});

// Função para enviar mensagem ao servidor e exibir resposta
async function sendMessage() {
  const message = userInput.value;
  if (message.trim() === '') return;

  displayMessage(message, 'user');
  userInput.value = '';

  try {
    const botResponse = await sendMessageToServer(message);
    displayMessage(botResponse, 'bot');
  } catch (error) {
    console.error('Erro ao enviar mensagem para o servidor:', error);
    displayMessage('Erro ao conectar ao chatbot. Por favor, tente novamente.', 'bot');
  }
}

// Função para exibir mensagens no chat
function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (sender === 'user') {
    messageElement.textContent = message;
    messageElement.classList.add('user-message');
  } else if (sender === 'bot') {
    const formattedMessage = formatBotResponse(message);
    messageElement.innerHTML = formattedMessage;
    messageElement.classList.add('bot-message');
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatBotResponse(message) {
  return `<p>${message}</p>`;
}

// URL base da API
const apiBaseUrl = 'https://green-tech-six.vercel.app/';

// Função para enviar mensagem para o servidor
async function sendMessageToServer(message) {
  try {
    const response = await fetch(`${apiBaseUrl}mensagem`, {
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
  } catch (error) {
    throw new Error(`Erro ao enviar mensagem para o servidor: ${error.message}`);
  }
}
