const messageDiv = document.querySelector('.message');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const onlineUsers = document.querySelector('.users-online');
const rooms = document.querySelectorAll('.room input[type=radio]');
const chatTitle = document.querySelector('.chat-header .room-name');
const username = document.querySelector('.chat-header .username');
const defaultRoom = document.querySelector('.chat-header .room-name').innerHTML;

const socket = io.connect('', { forceNew: true });

joinRoom(defaultRoom);

socket.on('message', message => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

socket.on('roomusers', users => {
  console.log(users);
  usersOnline(users);
})

socket.on('lastMessages', messages => {
  console.log(messages);
  messages.forEach(message => {
    outputMessage({ username: message.username, message: message.message, time: message.createdAt });
  })
})

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = e.target.elements.msg.value;
  socket.emit('chatMessage', message);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

rooms.forEach(room => room.addEventListener('click', e => {
  if (chatTitle.innerHTML !== e.target.id) {
    chatTitle.innerHTML = e.target.id;
    leaveRoom();
    joinRoom(e.target.id);
  }
}));

function leaveRoom() {
  chatMessages.innerHTML = '';
  socket.emit('leaveRoom');
}

function joinRoom(room) {
  socket.emit('joinRoom', room)
}

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

function usersOnline(users) {
  const ul = document.createElement('ul');
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="online"></div>${user.name}`;
    ul.appendChild(li);
  })
  onlineUsers.innerHTML = ul.innerHTML;
}