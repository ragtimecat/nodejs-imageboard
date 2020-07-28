// const wrapRepliesWithLinks = (text) => {
//   text = text.replace(/>>[0-9a-z]*/gm, (match) => {
//     resultLink = match.replace(/>>/, '');
//     const newLink = document.createElement('a');
//     newLink.setAttribute('href', `#${resultLink}`);
//     // console.log(newLink);
//     newLink.innerText = match;
//     console.log(newLink);
//     return newLink;
//   });
//   return text;
// }

// const allMessages = document.querySelectorAll('.message-text');
// console.log(allMessages);
// allMessages.forEach(message => {
//   wrapRepliesWithLinks(message.innerText);
//   // message.innerHTML = wrapRepliesWithLinks(message.innerText);
//   // console.log(message.innerText);
// })


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
  let newDiv = document.createElement('div');
  newDiv.classList.add('message-box');
  const innerDiv = document.createElement('div');
  innerDiv.classList.add('message-data');
  innerDiv.setAttribute('id', id);
  const postId = document.createElement('div');
  postId.classList.add('post-id');
  postId.textContent = `№${id}`;
  const button = document.createElement('button');
  button.classList.add('delete-message');
  button.textContent = '×';
  innerDiv.textContent = `Date: ${date} `;
  innerDiv.appendChild(postId);
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

// replies
const replies = document.querySelectorAll('.post-id');

//add reply func
const addReplyEvent = (e) => {
  console.log(reply);
  const id = e.target.parentElement.id;
  messageDiv.style.display = 'block';
  const quote = `>>${id}\r\n`;
  if (textarea.value == '') {
    textarea.value += quote;
  } else {
    textarea.value += `\r\n${quote}`;
  }
  textarea.focus();
}

replies.forEach(reply => {
  reply.addEventListener('click', e => addReplyEvent(e));
})

button.addEventListener('click', (e) => {
  e.preventDefault();
  //thrid element of array, obtained through separating the row by '/'
  const thread = window.location.pathname.split('/')[2];
  let text = textarea.value;
  //wrap reply links with <a> tag with href
  // text = wrapRepliesWithLinks(text);
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
    console.log(data);
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
        newMessage.querySelector('.post-id').addEventListener('click', e => addReplyEvent(e));
        const deleteButton = document.getElementById(resp._id).querySelector('.delete-message');
        deleteButton.addEventListener('click', e => deleteEvent(e));
      })
      .catch(err => console.log(err));

  }
});



