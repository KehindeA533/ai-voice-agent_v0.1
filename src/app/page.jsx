"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import AudioWaveform from "@/components/AudioWaveform";
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '@/theme/AppTheme';
import AppAppBar from '@/components/AppAppBar';
import Hero from '@/components/Hero';
import Comment from '@/components/Comment';
import Footer from '@/components/Footer';
import ConversationTranscript from "@/components/ConversationTranscript";
import PlaceDetailsPanel from "@/components/PlaceDetailsPanel";
import PanelCarousel from "@/components/PanelCarousel";
import MenuConsole from "@/components/MenuConsole";
import CalendarConsole from "@/components/CalendarConsole";
import { Grid } from '@mui/material';
import { useConversation } from "@/hooks/useConversation";

export default function Page(props) {
  const { 
    messages, 
    currentMessage, 
    updateCurrentMessage, 
    submitCurrentMessage, 
    addAIResponse,
    handleUserTranscript,
    handleAITranscript,
    processingUserInput,
    aiResponsePending,
    clearConversation
  } = useConversation([]);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  // Default place ID for Eleven Madison Park from environment variables
  const placeId = process.env.NEXT_PUBLIC_ELEVEN_MADISON_PARK_PLACE_ID || "ChIJEWbXz6ZZwokRLKmKrtPfVFY";

  useEffect(() => {
    setIsAISpeaking(aiResponsePending);
  }, [aiResponsePending]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Hero />
      <Divider />
      <div className="flex flex-col items-center justify-center min-h-screen pb-24">
        <Grid container spacing={3} sx={{ maxWidth: '1200px', width: '100%' }}>
          <Grid item xs={12} md={6} sx={{ 
            '@media (max-width: 900px)': {
              display: 'flex',
              justifyContent: 'center',
              order: 1,
              marginBottom: '2rem'
            }
          }}>
            <AudioWaveform 
              updateCurrentMessage={updateCurrentMessage}
              submitCurrentMessage={submitCurrentMessage}
              addAIResponse={addAIResponse}
              currentMessage={currentMessage}
              setIsListening={setIsListening}
              setIsAISpeaking={setIsAISpeaking}
              handleUserTranscript={handleUserTranscript}
              handleAITranscript={handleAITranscript}
              processingUserInput={processingUserInput}
              clearConversation={clearConversation}
              messages={messages}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ 
            '@media (max-width: 900px)': {
              order: 2
            }
          }}>
            <PanelCarousel
              transcriptPanel={
                <ConversationTranscript 
                  messages={messages}
                  isListening={isListening}
                  isAISpeaking={isAISpeaking}
                  currentMessage={currentMessage}
                />
              }
              placeDetailsPanel={
                <PlaceDetailsPanel 
                  placeId={placeId}
                />
              }
              menuConsolePanel={
                <MenuConsole />
              }
              calendarPanel={
                <CalendarConsole />
              }
            />
          </Grid>
        </Grid>
      </div>
      <Comment />
      <Footer />
    </AppTheme>
  );
}
