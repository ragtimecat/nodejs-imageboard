const messageDiv = document.querySelector('.message');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io.connect('', { forceNew: true });

socket.on('message', message => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.msg.value;
  const name = e.target.elements.name.value;
  socket.emit('chatMessage', message, name);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
      <p class="text">
        ${message.message}
    </p>`
  chatMessages.appendChild(div);
}