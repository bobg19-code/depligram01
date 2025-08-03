let mediaRecorder;
let recordedChunks = [];
const preview = document.getElementById('preview');
const recordBtn = document.getElementById('record');
const sendBtn = document.getElementById('send');
const chatBox = document.getElementById('chat');

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    preview.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      sendBtn.disabled = false;
    };

    recordBtn.onclick = () => {
      if (mediaRecorder.state === "inactive") {
        recordedChunks = [];
        mediaRecorder.start();
        recordBtn.textContent = "⏹️ Стоп";
        sendBtn.disabled = true;
      } else {
        mediaRecorder.stop();
        recordBtn.textContent = "🎙️ Запись";
      }
    };

    sendBtn.onclick = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const msg = document.createElement('div');
      msg.className = 'msg';
      msg.innerHTML = `<video controls src="${url}" class="msg-video"></video>`;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
      sendBtn.disabled = true;
    };
  })
  .catch(err => {
    alert("Нет доступа к камере: " + err);
  });
