import { useState, useRef, useEffect } from "react";
import { startConnection } from "../service/realtimeAPI/startConnection";
import { stopConnection } from "../service/realtimeAPI/stopConnection";

export const useMicrophone = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const connectionRef = useRef(null);
  const barsRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const animationIdRef = useRef(null);

  const startMicrophone = async () => {
    try {
      connectionRef.current = await startConnection();
      console.log("AI Connection started", connectionRef.current);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      microphoneStreamRef.current = stream;

      analyserRef.current.fftSize = 512;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const animateBars = () => {
        analyserRef.current.getByteFrequencyData(dataArray);
        barsRef.current.forEach((bar, index) => {
          if (bar) {
            bar.style.height = `${(dataArray[index % bufferLength] / 255) * 100}px`;
          }
        });
        animationIdRef.current = requestAnimationFrame(animateBars);
      };

      animateBars();
      setIsMicOn(true);
    } catch (err) {
      console.error("Error starting microphone and AI:", err);
      stopMicrophone();
    }
  };

  const stopMicrophone = () => {
    if (connectionRef.current) {
      stopConnection(connectionRef.current);
      connectionRef.current = null;
    }

    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      microphoneStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    barsRef.current.forEach((bar) => {
      if (bar) {
        bar.style.height = "4px";
      }
    });

    setIsMicOn(false);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isMicOn) {
        stopMicrophone();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMicOn]);

  return { isMicOn, startMicrophone, stopMicrophone, barsRef };
};