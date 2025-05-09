"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarouselContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
}));

const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const NavigationTab = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  transition: 'color 0.3s ease, font-weight 0.3s ease',
  '&[data-active="true"]': {
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  }
}));

const StyledSlider = styled(Slider)({
  width: '100%',
  '& .slick-track': {
    display: 'flex',
    '& .slick-slide': {
      height: 'inherit',
      '& > div': {
        height: '100%',
      }
    }
  }
});

const PanelCarousel = ({ transcriptPanel, placeDetailsPanel, menuConsolePanel, calendarPanel }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const handleChangeIndex = (index) => {
    setActiveIndex(index);
  };

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  // Settings for the Slider component
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: handleChangeIndex,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 10,
    arrows: false,
  };

  useEffect(() => {
    // Expose tab switching function globally
    if (typeof window !== 'undefined') {
      window.panelCarouselControls = {
        switchToTab: (index) => {
          console.log('Switching to tab:', index, 'sliderRef exists:', !!sliderRef.current);
          setActiveIndex(index);
          if (sliderRef.current) {
            sliderRef.current.slickGoTo(index);
          }
        }
      };
      
      return () => {
        // Clean up when component unmounts
        if (window.panelCarouselControls) {
          window.panelCarouselControls = undefined;
        }
      };
    }
  }, []);

  return (
    <CarouselContainer>
      <NavigationContainer>
        <NavigationTab 
          data-active={activeIndex === 0} 
          onClick={() => handleTabClick(0)}
          data-testid="transcript-tab"
        >
          <Typography>Transcript</Typography>
        </NavigationTab>
        <NavigationTab 
          data-active={activeIndex === 1} 
          onClick={() => handleTabClick(1)}
          data-testid="place-details-tab"
        >
          <Typography>Restaurant Info</Typography>
        </NavigationTab>
        <NavigationTab 
          data-active={activeIndex === 2} 
          onClick={() => handleTabClick(2)}
          data-testid="menu-console-tab"
        >
          <Typography>Menu</Typography>
        </NavigationTab>
        <NavigationTab 
          data-active={activeIndex === 3} 
          onClick={() => handleTabClick(3)}
          data-testid="calendar-tab"
        >
          <Typography>Calendar</Typography>
        </NavigationTab>
      </NavigationContainer>
      
      <StyledSlider
        ref={slider => (sliderRef.current = slider)}
        {...settings}
      >
        {/* Transcript Panel */}
        <Box data-testid="transcript-panel-container">{transcriptPanel}</Box>
        
        {/* Restaurant Info */}
        <Box data-testid="place-details-panel-container">{placeDetailsPanel}</Box>
        
        {/* Menu Console */}
        <Box data-testid="menu-console-panel-container">{menuConsolePanel}</Box>
        
        {/* Calendar Panel */}
        <Box data-testid="calendar-panel-container">{calendarPanel}</Box>
      </StyledSlider>
    </CarouselContainer>
  );
};

export default PanelCarousel; 