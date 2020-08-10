const messageDiv = document.querySelector('.message');
const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('message', message => {
  messageDiv.innerHTML = message;
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.msg.value;

  socket.emit('chatMessage', message);
})