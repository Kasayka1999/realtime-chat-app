const socket = io();
const nicknameInput = document.getElementById('nickname');
const setNicknameButton = document.getElementById('setNickname');
const displayNickname = document.getElementById('displayNickname');
let nickname = '';

function setNickname() {
  nickname = nicknameInput.value.trim();
  if (nickname) {
    nicknameInput.style.display = 'none';
    setNicknameButton.style.display = 'none';
    displayNickname.style.display = 'inline';
    displayNickname.textContent = `Your Nickname: ${nickname}`;
    document.getElementById('input').focus();
  }
}

nicknameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    setNickname();
  }
});

setNicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  setNickname();
});

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!nickname) {
    alert('Please enter a nickname.');
    return;
  }

  const input = document.getElementById('input');
  const message = `${nickname}: ${input.value}`;
  socket.emit('chat message', message);
  input.value = '';
});

socket.on('chat history', (msgHistory) => {
    for (const message of msgHistory) {
      const li = document.createElement('li');
      li.innerText = message;
      document.getElementById('messages').appendChild(li);
    }
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
  });  
  

socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.innerText = msg;
    document.getElementById('messages').appendChild(li);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});
  