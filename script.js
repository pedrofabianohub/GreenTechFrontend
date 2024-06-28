const chatMessages = document.querySelector('.chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Importar a biblioteca marked se ainda não estiver importada
// import marked from 'marked'; 

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
    .then(botResponse => {
      // Formata a resposta do bot com Markdown antes de exibir
      const formattedResponse = marked.parse(botResponse); 
      displayMessage(formattedResponse, 'bot'); 
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
    // A mensagem do bot já está formatada com Markdown, então basta inserir
    messageElement.innerHTML = message;  
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

    const data = await response.json();

    // Formata as opções como uma lista numerada
    if (data.options && Array.isArray(data.options)) {
      const optionsText = data.options.map((option, index) => `${index + 1}. ${option}`).join('\n');
      return `${data.greetings}\n\n${optionsText}`;
    } else {
      // Se não houver opções, retorna a saudação padrão
      return data.greetings || "Hmm, não entendi. Pode reformular a pergunta?";
    }

  } catch (error) {
    throw new Error(`Erro ao enviar mensagem para o servidor: ${error.message}`);
  }
}