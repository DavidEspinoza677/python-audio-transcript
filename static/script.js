const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");
const status = document.getElementById("status");
const attendBtn = document.getElementById("attendBtn");
const attendingDisplay = document.getElementById("attending");
const queueList = document.getElementById("queueList");

let recognition;
let isRecognizing = false;
let finalTranscript = '';
let transcriptStack = [];

if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
  alert("Tu navegador no soporta reconocimiento de voz. Usa Google Chrome en computadora.");
} else {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    status.textContent = "🎙️ Escuchando...";
    startBtn.textContent = "Detener Grabación";
    isRecognizing = true;
  };

  recognition.onerror = (event) => {
    status.textContent = "Error: " + event.error;
  };

  recognition.onend = () => {
    if (finalTranscript.trim() !== '') {
      transcriptStack.unshift(finalTranscript.trim());
      updateQueueDisplay();
    }
    finalTranscript = '';
    status.textContent = "Listo para grabar nuevamente";
    startBtn.textContent = "🎙️ Iniciar Grabación";
    isRecognizing = false;
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    output.value = finalTranscript + interimTranscript;
  };

  startBtn.addEventListener("click", () => {
    if (isRecognizing) {
      recognition.stop();
    } else {
      finalTranscript = '';
      output.value = '';
      recognition.start();
    }
  });

  attendBtn.addEventListener("click", () => {
    if (transcriptStack.length === 0) {
      attendingDisplay.textContent = "No hay transcripciones para atender.";
      return;
    }

    const current = transcriptStack.shift();
    attendingDisplay.textContent = "Ahora atendiendo a: " + current;

    const utterance = new SpeechSynthesisUtterance("Ahora atendiendo a: " + current);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);

    updateQueueDisplay();
  });

  function updateQueueDisplay() {
    queueList.innerHTML = transcriptStack
      .map((t, i) => `<li class="mb-2"><strong>${i + 1}.</strong> ${t}</li>`)
      .join('');
  }
}
