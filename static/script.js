const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");
const status = document.getElementById("status");

let recognition;
let isRecognizing = false;
let finalTranscript = '';

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
    status.textContent = "Listo para grabar nuevamente";
    startBtn.textContent = "🎙️ Iniciar Grabación";
    isRecognizing = false;
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + "\n";
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
}
