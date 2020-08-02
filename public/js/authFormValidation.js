
module.exports = function (login, password) {
  if (login.value == '') {
    showMessage('error', 'Please enter a login');
  } else if (password.value == '') {
    showMessage('error', 'Please enter a password');
  } else if (password.value.length < 5) {
    showMessage('error', 'Password should have atleast 5 characters');
  }
}
