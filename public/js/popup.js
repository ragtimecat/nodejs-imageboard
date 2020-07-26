// Message div
// Make the DIV element draggable:
dragElement(document.getElementById("message-div"));

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

//fetch
const button = document.querySelector('form.message>input[type=submit]');
const textarea = document.querySelector('form.message>textarea');
const error = document.getElementById('error-message');

button.addEventListener('click', async (e) => {
  e.preventDefault();
  //thrid element of array, obtained through separating the row by '/'
  const thread = window.location.pathname.split('/')[2];
  const text = textarea.value;
  if (text == '') {
    error.innerHTML = 'There is no data to send';
    error.style.display = 'block';
  } else {
    error.style.display = 'none';
    const data = {
      thread,
      text
    };
    fetch('/message/create/', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(res => console.log(res))
      .catch(err => console.log(err));

  }

})