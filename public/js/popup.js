// Message div
// Make the DIV element draggable:
const messageDiv = document.getElementById("message-div");
const closeMessage = document.querySelector(".close-message");
dragElement(messageDiv);

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(element.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

closeMessage.addEventListener('click', (e) => {
  messageDiv.style.display = 'none';
})

//fetch
const button = document.querySelector('form.message>input[type=submit]');
const textarea = document.querySelector('form.message>textarea');
const error = document.getElementById('error-message');
const reply = document.getElementById('reply');
const deleteMessage = document.querySelectorAll(".delete-message");

reply.addEventListener('click', (e) => {
  e.preventDefault();
  messageDiv.style.display = 'block';
});

const createMessageElement = (id, date, text) => {
  // <div class="message-box">
  //       <div class="message-data" id="<%= message._id %>">Date: <%= message.createdAt %><button class="delete-message">
  //           &times
  //         </button>
  //       </div>
  //       <p><%= message.text %></p>
  //     </div>
  let newDiv = document.createElement('div');
  newDiv.classList.add('message-box');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('message-data');
  innerDiv.setAttribute('id', id);
  const button = document.createElement('button');
  button.classList.add('delete-message');
  button.textContent = '×';
  innerDiv.textContent = `Date: ${date}`;
  innerDiv.appendChild(button);
  newDiv.appendChild(innerDiv);
  const p = document.createElement('p');
  p.textContent = `${text}`;
  newDiv.appendChild(p);
  return newDiv;
}

const deleteEvent = (e) => {
  const id = e.target.parentElement.id;
  console.log(e.target);
  const data = {
    "id": id
  }
  fetch('/message/:id', {
    method: "DELETE",
    headers: {
      'Accept': 'appliaction/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(async (result) => {
      e.target.parentElement.parentElement.remove();
      const resp = await result.json();
      console.log(resp);
    })
    .catch(err => console.log(err));
}

deleteMessage.forEach((delMessage) => {
  delMessage.addEventListener('click', e => deleteEvent(e));
})




button.addEventListener('click', (e) => {
  e.preventDefault();
  //thrid element of array, obtained through separating the row by '/'
  const thread = window.location.pathname.split('/')[2];
  const text = textarea.value;
  if (text == '') {
    error.innerHTML = 'There is no data to send';
    error.style.display = 'block';
  } else {
    button.setAttribute('disabled', true);
    error.style.display = 'none';
    const data = {
      thread,
      text
    };
    fetch('/message/create/', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(async (res) => {
        button.removeAttribute('disabled');
        textarea.value = '';
        let resp = await res.json();
        const newMessage = createMessageElement(resp._id, resp.createdAt, resp.text);
        document.getElementById('messages').appendChild(newMessage);
        const deleteButton = document.getElementById(resp._id).querySelector('.delete-message');
        deleteButton.addEventListener('click', e => deleteEvent(e));
      })
      .catch(err => console.log(err));

  }

});