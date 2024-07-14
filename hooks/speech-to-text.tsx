import { useState, useEffect } from "react";

interface UseSpeechToText {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
}

const useSpeechToText = (): UseSpeechToText => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [recognition, setRecognition] = useState<null | SpeechRecognition>(
    null
  );

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Your browser does not support Speech Recognition. Please try using Chrome."
      );
      return;
    }

    const recognitionInstance = new (
      window as any
    ).webkitSpeechRecognition() as SpeechRecognition;
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      setTranscript((prevTranscript) => prevTranscript + finalTranscript);
    };

    setRecognition(recognitionInstance);
  }, []);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
