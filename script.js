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
      displayMessage(botResponse, 'bot');
    })
    .catch(error => {
      console.error('Erro ao enviar mensagem para o servidor:', error);
      displayMessage('Erro ao conectar ao chatbot. Por favor, tente novamente.', 'bot');
    });
}

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para a última mensagem
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