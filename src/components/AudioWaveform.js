"use client"; // Ensures the component runs on the client side in Next.js

import { useState, useRef } from "react";
import { IconButton } from "@mui/material";
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';

const AudioWaveform = () => {
  // State to track whether the microphone is ON or OFF
  const [isMicOn, setIsMicOn] = useState(false);

  // References for managing different audio-related elements
  const barsRef = useRef([]); // Stores references to the waveform bars
  const audioContextRef = useRef(null); // Stores the AudioContext instance
  const analyserRef = useRef(null); // Stores the AnalyserNode for audio visualization
  const microphoneStreamRef = useRef(null); // Stores the microphone input stream
  const animationIdRef = useRef(null); // Stores the animation frame ID for cleanup

  /**
   * Starts the microphone and initializes audio processing.
   * - Captures audio from the user's microphone.
   * - Sets up an AudioContext and connects it to an AnalyserNode.
   * - Uses animation frames to dynamically update waveform bars.
   */
  const startMicrophone = async () => {
    try {
      // Request permission to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create an AudioContext to process audio data
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      // Connect the microphone stream to the analyser
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      microphoneStreamRef.current = stream;

      // Configure the analyser node for frequency analysis
      analyserRef.current.fftSize = 512; // Determines how much frequency data is analyzed
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      /**
       * Recursively animates the waveform bars based on real-time audio input.
       */
      const animateBars = () => {
        // Get frequency data from the analyser
        analyserRef.current.getByteFrequencyData(dataArray);

        // Adjust each bar's height based on frequency values
        barsRef.current.forEach((bar, index) => {
          const value = dataArray[index % bufferLength]; // Get corresponding frequency value
          const height = (value / 255) * 100 + 50; // Scale height dynamically
          bar.style.height = `${height}px`;
        });

        // Request the next animation frame for continuous updates
        animationIdRef.current = requestAnimationFrame(animateBars);
      };

      animateBars(); // Start the waveform animation loop
      setIsMicOn(true); // Update state to indicate microphone is active
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  /**
   * Stops the microphone and resets the waveform visualization.
   * - Stops the microphone stream.
   * - Closes the AudioContext.
   * - Cancels the animation loop.
   */
  const stopMicrophone = () => {
    if (microphoneStreamRef.current) {
      // Stop all tracks in the microphone stream
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop());

      // Close the audio context if it exists
      if (audioContextRef.current) audioContextRef.current.close();

      // Stop the animation loop
      cancelAnimationFrame(animationIdRef.current);
    }

    // Reset all waveform bars to their default height
    barsRef.current.forEach((bar) => (bar.style.height = "50px"));

    setIsMicOn(false); // Update state to indicate microphone is off
  };

  /**
   * Toggles the microphone on and off.
   * - If the microphone is off, start it.
   * - If the microphone is on, stop it.
   */
  const toggleMicrophone = () => {
    isMicOn ? stopMicrophone() : startMicrophone();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      {/* Wrapper for waveform and microphone button */}
      <div className="relative flex flex-col items-center">
        
        {/* Waveform Visualization */}
        <div className="flex gap-2 items-end mb-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              ref={(el) => (barsRef.current[i] = el)} // Assign each bar a reference
              className={`w-10 h-[50px] rounded-lg transition-all ease-out ${
                // Assign different colors to each bar for a visual effect
                ["bg-blue-300", "bg-blue-500", "bg-blue-700", "bg-yellow-400", "bg-orange-500"][i]
              }`}
            ></div>
          ))}
        </div>

        {/* Microphone Toggle Button (positioned below the waveform) */}
        <IconButton
          onClick={toggleMicrophone}
          className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full transition-all mt-auto"
        >
          {/* Change button icon based on microphone state */}
          {isMicOn ? <MicIcon className="text-white text-4xl" /> : <MicOffIcon className="text-white text-4xl" />}
        </IconButton>
      </div>
    </div>
  );
};

export default AudioWaveform;

// TODO Stop the microphone button from moving with the waveform ANDD make the gaps between each bar a little smaller AND add message when button is hover over.