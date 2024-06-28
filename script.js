const chatMessages = document.querySelector('.chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) { 
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
    .then(responseText => { 
      // 1. Converte a resposta do servidor (string) para um objeto JSON
      const responseObject = JSON.parse(responseText);

      // 2. Acessa a propriedade 'resposta' do objeto JSON
      const botResponse = responseObject.resposta;

      // Processa a resposta do bot para texto simples
      const plainTextResponse = botResponse.replace(/<[^>]+>/g, ' ').replace(/(\r\n|\n|\r)/gm, " ");
      displayMessage(plainTextResponse, 'bot'); 
    })
    .catch(error => {
      console.error('Erro ao enviar mensagem para o servidor:', error);
      displayMessage('Erro ao conectar ao chatbot. Por favor, tente novamente.', 'bot');
    });
}

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (sender === 'user') { 
    messageElement.textContent = message; 
    messageElement.classList.add('user-message'); 
  } else if (sender === 'bot') {
    messageElement.textContent = message; // Adiciona a resposta como texto
    messageElement.classList.add('bot-message');
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const apiBaseUrl = 'https://green-tech-six.vercel.app/'; 

async function sendMessageToServer(message) {
  try {
    const response = await fetch(`${apiBaseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mensagem: message })
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status}`);
    }

    // Retorna o corpo da resposta como texto
    return await response.text(); 
  } catch (error) {
    throw new Error(`Erro ao enviar mensagem para o servidor: ${error.message}`);
  }
}