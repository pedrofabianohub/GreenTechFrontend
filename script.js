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

async function sendMessage() {
  const message = userInput.value.trim(); // Remova espaços em branco extras

  if (message === '') return;

  displayMessage(message, 'user');
  userInput.value = '';

  try {
    const botResponse = await sendMessageToServer(message);
    displayBotResponse(botResponse);
  } catch (error) {
    console.error('Erro ao enviar mensagem para o servidor:', error);
    displayMessage('Erro ao conectar ao chatbot. Por favor, tente novamente.', 'bot');
  }
}

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (sender === 'user') {
    messageElement.textContent = message; // Mensagem do usuário como texto
    messageElement.classList.add('user-message');
  } else if (sender === 'bot') {
    messageElement.innerHTML = marked.parse(message); // Mensagem do bot com Markdown
    messageElement.classList.add('bot-message');
  }

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayBotResponse(botResponse) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add('bot-message');

  let responseText = ''; // Inicializa a variável para armazenar o texto da resposta

  // Concatena todas as saudações com um espaço entre elas
  if (botResponse.saudacoes && botResponse.saudacoes.length > 0) {
    responseText += botResponse.saudacoes.join(' ') + ' ';
  }

  // Adiciona a mensagem principal
  if (botResponse.mensagem) {
    responseText += botResponse.mensagem + ' ';
  }

  // Adiciona o emoji, se disponível
  if (botResponse.emoji) {
    responseText += botResponse.emoji;
  }

  // Exibe a mensagem formatada na interface
  messageElement.innerHTML = marked.parse(responseText.trim());
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

    const data = await response.json();
    return data; // Retorna o JSON completo do servidor
  } catch (error) {
    throw new Error(`Erro ao enviar mensagem para o servidor: ${error.message}`);
  }
}
