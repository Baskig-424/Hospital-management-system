// Shared modal
function openModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
}

function validateMobile() {
  const input = document.getElementById('mobileInput');
  if (!input) return;
  const num = input.value;
  if (num.length === 10 && !isNaN(num)) {
    alert('Thankyou OTP sent to this ' + num + ' number.');
    closeModal();
  } else {
    alert('Please enter 10 digits mobile number.');
  }
}

function toggleDept(element) {
  element.classList.toggle('active');
  const content = element.nextElementSibling;
  if (!content) return;
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

function toggleAcc(el) {
  el.classList.toggle('open');
}

// Chat
function addMessage(text, type) {
  const chatWindow = document.getElementById('chat-window');
  if (!chatWindow) return;
  const div = document.createElement('div');
  div.className = `message ${type}-msg`;
  div.innerText = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function handleChat() {
  const userInput = document.getElementById('user-input');
  if (!userInput) return;
  const query = userInput.value.toLowerCase();
  if (!query) return;
  addMessage(userInput.value, 'user');
  userInput.value = '';

  setTimeout(() => {
    if (query.includes('doctor')) {
      addMessage('Humare main specialists Doctors section mein diye gaye hain.', 'bot');
    } else if (query.includes('location')) {
      addMessage('Humare main hospitals Lucknow, Gurugram, Ranchi aur Patna mein hain.', 'bot');
    } else {
      addMessage('Dhanyawad! Kya main kisi aur cheez mein apki madad kar sakta hoon?', 'bot');
    }
  }, 600);
}

// Video
function handlePlay() {
  const video = document.getElementById('mainVideo');
  const playBtn = document.getElementById('playBtn');
  if (!video || !playBtn) return;
  if (video.paused) {
    video.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    video.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleMute() {
  const video = document.getElementById('mainVideo');
  const muteBtn = document.getElementById('muteBtn');
  if (!video || !muteBtn) return;
  video.muted = !video.muted;
  muteBtn.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
}

function wireEvents() {
  document.querySelectorAll('[data-action="open-modal"]').forEach((el) => {
    el.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-action="close-modal"]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  document.querySelectorAll('[data-action="validate-mobile"]').forEach((el) => {
    el.addEventListener('click', validateMobile);
  });
  document.querySelectorAll('.js-dept-toggle').forEach((el) => {
    el.addEventListener('click', () => toggleDept(el));
  });
  document.querySelectorAll('.js-accordion').forEach((el) => {
    el.addEventListener('click', () => toggleAcc(el));
  });

  const sendBtn = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  if (sendBtn && userInput) {
    sendBtn.addEventListener('click', handleChat);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChat();
    });
  }

  const video = document.getElementById('mainVideo');
  if (video) {
    video.addEventListener('click', handlePlay);
  }

  const playBtn = document.getElementById('playBtn');
  if (playBtn) playBtn.addEventListener('click', handlePlay);
  const muteBtn = document.getElementById('muteBtn');
  if (muteBtn) muteBtn.addEventListener('click', handleMute);

  window.addEventListener('click', (event) => {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
      closeModal();
    }
  });

  const callbackForm = document.getElementById('callbackForm');
  if (callbackForm) {
    callbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = document.getElementById('saved-msg');
      if (msg) msg.style.display = 'block';
      this.reset();
      setTimeout(() => {
        if (msg) msg.style.display = 'none';
      }, 3000);
    });
  }
}

document.addEventListener('DOMContentLoaded', wireEvents);
