"use client";
import { useState, useRef } from "react";
import { IconButton } from "@mui/material";
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';

const AudioWaveform = () => {
  const [isMicOn, setIsMicOn] = useState(false);
  const barsRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const animationIdRef = useRef(null);

  const startMicrophone = async () => {
    try {
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
          const value = dataArray[index % bufferLength];
          const height = (value / 255) * 100 + 50;
          bar.style.height = `${height}px`;
        });

        animationIdRef.current = requestAnimationFrame(animateBars);
      };

      animateBars();
      setIsMicOn(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopMicrophone = () => {
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      cancelAnimationFrame(animationIdRef.current);
    }

    barsRef.current.forEach((bar) => (bar.style.height = "50px"));

    setIsMicOn(false);
  };

  const toggleMicrophone = () => {
    isMicOn ? stopMicrophone() : startMicrophone();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      {/* Waveform */}
      <div className="flex gap-2 items-end mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (barsRef.current[i] = el)}
            className={`w-10 h-[50px] rounded-lg transition-all ease-out ${
              ["bg-blue-300", "bg-blue-500", "bg-blue-700", "bg-yellow-400", "bg-orange-500"][i]
            }`}
          ></div>
        ))}
      </div>

      {/* Microphone Button */}
      <IconButton
        onClick={toggleMicrophone}
        className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
      >
        {isMicOn ? <MicIcon className="text-white text-4xl" /> : <MicOffIcon className="text-white text-4xl" />}
      </IconButton>
    </div>
  );
};

export default AudioWaveform;
