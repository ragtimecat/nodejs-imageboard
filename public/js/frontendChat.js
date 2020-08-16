const messageDiv = document.querySelector('.message');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const onlineUsers = document.querySelector('.users-online');
const rooms = document.querySelectorAll('.room input[type=radio]');
const chatTitle = document.querySelector('.chat-header h1');

const socket = io.connect('', { forceNew: true });

socket.on('message', message => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('userIsOnline', username => {
  userOnline(username);
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.msg.value;
  socket.emit('chatMessage', message);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

rooms.forEach(room => room.addEventListener('click', e => {
  chatTitle.innerHTML = e.target.id;
}));

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

function userOnline(username) {
  const li = document.createElement('li');
  li.innerHTML = `<div class="online"></div>${username}`;
  onlineUsers.appendChild(li);
}