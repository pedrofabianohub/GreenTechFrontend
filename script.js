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
  const message = userInput.value.trim();
  if (message === '') return;

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

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  try {
    if (sender === 'user') {
      messageElement.textContent = message; // Mensagem do usuário como texto
      messageElement.classList.add('user-message');
    } else if (sender === 'bot') {
      let botResponse = '';

      let messageOBJ = JSON.parse(message)
      // Verifica se a mensagem é um objeto JSON
      if (typeof messageOBJ === 'object') {
        if (messageOBJ.resposta) {
          botResponse += messageOBJ.resposta + ' ';
        }
        if (messageOBJ.instrucoes && Array.isArray(messageOBJ.instrucoes)) {
          messageOBJ.instrucoes.forEach(instrucao => {
            botResponse += instrucao + ' ';
          });
        }
        if (messageOBJ.saudacoes && Array.isArray(messageOBJ.saudacoes)) {
          messageOBJ.saudacoes.forEach(saudacao => {
            botResponse += saudacao + ' ';
          });
        }
        if (messageOBJ.perguntas_frequentes && Array.isArray(messageOBJ.perguntas_frequentes)) {
          messageOBJ.perguntas_frequentes.forEach(pergunta => {
            botResponse += pergunta + ' ';
          });
        }
        if (messageOBJ.dicas) {
          botResponse += messageOBJ.dicas + ' ';
        }
        // Outras chaves específicas que deseja processar

      } else {
        botResponse = messageOBJ;
      }

      // Exibe a resposta formatada em Markdown
      messageElement.innerHTML = marked(botResponse.trim());
    }
  } catch (error) {
    console.error('Erro ao processar resposta do bot:', error);
    messageElement.textContent = 'Erro ao processar resposta do bot.';
  }

  messageElement.classList.add('bot-message');
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

const apiBaseUrl = 'https://green-tech-six.vercel.app/';

async function sendMessageToServer(message) {
  try {
    const response = await fetch(apiBaseUrl, {
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
    return data; // Retorna o objeto recebido da API

  } catch (error) {
    throw new Error(`Erro ao enviar mensagem para o servidor: ${error.message}`);
  }
}
