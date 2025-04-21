"use client";

import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled container to match the ConversationTranscript styling
const CalendarContainer = styled(Box)(({ theme }) => ({
  height: '443.29px',
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' 
    ? '#1C1C1C' // Softer dark background
    : theme.palette.grey[50], // Light gray in light mode
  borderRadius: theme.spacing(1),
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0,0,0,0.25)' 
    : theme.shadows[2],
  overflow: 'hidden',
}));

// Styled iframe to be responsive
const ResponsiveCalendarFrame = styled('iframe')(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: theme.spacing(1),
}));

// Create a global refresh function only on the client side
const CalendarConsole = forwardRef((props, ref) => {
  const theme = useTheme();
  const iframeRef = useRef(null);
  const [key, setKey] = useState(0);
  
  // Method to refresh the calendar
  const refreshCalendar = () => {
    console.log("Refreshing calendar...");
    setKey(prev => prev + 1);
  };

  // Expose the refresh method via ref
  useImperativeHandle(ref, () => ({
    refreshCalendar
  }));

  // Store the refresh function globally for direct access, but only in browser
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Create the calendarRefresh object if it doesn't exist
      if (!window.calendarRefresh) {
        window.calendarRefresh = {};
      }
      
      window.calendarRefresh.refreshCalendar = refreshCalendar;
      
      return () => {
        // Cleanup when component unmounts
        if (window.calendarRefresh) {
          window.calendarRefresh.refreshCalendar = () => console.log("Calendar component unmounted");
        }
      };
    }
  }, []);

  return (
    <CalendarContainer>
      <ResponsiveCalendarFrame
        key={key}
        ref={iframeRef}
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FNew_York&showPrint=0&showNav=0&showTabs=0&title=Theo%20Demo%20Calendar&showTz=0&showCalendars=0&src=le.reveur69%40gmail.com"
        data-testid="calendar-iframe"
      />
    </CalendarContainer>
  );
});

CalendarConsole.displayName = 'CalendarConsole';

export default CalendarConsole; 