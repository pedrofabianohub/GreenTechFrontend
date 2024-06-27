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
  messageElement.classList.add('message');

  if (sender === 'user') {
    messageElement.textContent = message; // Mensagem do usuário como texto
    messageElement.classList.add('user-message');
  } else if (sender === 'bot') {
    try {
      let botResponse = '';

      // Verifica se a mensagem é um objeto JSON
      if (typeof message === 'object') {
        // Remover chaves específicas e extrair texto
        if (message.resposta) {
          botResponse += message.resposta + ' ';
        }
        if (message.instrucoes && Array.isArray(message.instrucoes)) {
          message.instrucoes.forEach(instrucao => {
            botResponse += instrucao + ' ';
          });
        }
        if (message.saudacoes && Array.isArray(message.saudacoes)) {
          message.saudacoes.forEach(saudacao => {
            botResponse += saudacao + ' ';
          });
        }
        if (message.perguntas_frequentes && Array.isArray(message.perguntas_frequentes)) {
          message.perguntas_frequentes.forEach(pergunta => {
            botResponse += pergunta + ' ';
          });
        }
        if (message.dicas) {
          botResponse += message.dicas + ' ';
        }
        // Outras chaves específicas que deseja remover

      } else {
        botResponse = message; // Se não for objeto, assume que é texto simples
      }

      messageElement.innerHTML = marked.parse(botResponse.trim()); // Exibir a resposta formatada em Markdown
    } catch (error) {
      console.error('Erro ao processar resposta do bot:', error);
      messageElement.textContent = 'Erro ao processar resposta do bot.';
    }
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
    return data.resposta;
  } catch (error) {
    throw new Error(`Erro ao enviar mensagem para o servidor: ${error.message}`);
  }
}
