const startBtn = document.getElementById("startBtn");
const output = document.getElementById("output");
const status = document.getElementById("status");

let recognition;
let isRecognizing = false;
let finalTranscript = '';
let transcriptStack = []; // Aquí está la pila

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
      transcriptStack.unshift(finalTranscript.trim()); // Agrega al inicio de la pila
    }

    // Actualiza el contenido del textarea con todas las transcripciones
    output.value = transcriptStack.map((t, i) => `${i + 1}. ${t}`).join("\n\n");

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

    // Muestra lo que se está grabando actualmente
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
