import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import VideocamIcon from '@mui/icons-material/Videocam';
import { backend } from 'declarations/backend';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '60vh',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const App: React.FC = () => {
  const [callFrame, setCallFrame] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomUrl = async () => {
      const url = await backend.getRoomUrl();
      if (url) {
        setRoomUrl(url);
      }
    };
    fetchRoomUrl();
  }, []);

  const joinCall = useCallback(async () => {
    if (!roomUrl) return;

    setIsLoading(true);
    const frame = window.DailyIframe.createFrame(
      document.getElementById('video-container'),
      {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '8px',
        },
      }
    );
    await frame.join({ url: roomUrl });
    setCallFrame(frame);
    setIsLoading(false);
  }, [roomUrl]);

  const leaveCall = useCallback(() => {
    if (callFrame) {
      callFrame.destroy();
      setCallFrame(null);
    }
  }, [callFrame]);

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        IC Video Chat
      </Typography>
      {!callFrame ? (
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={<VideocamIcon />}
          onClick={joinCall}
          disabled={isLoading || !roomUrl}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Join Call'}
        </StyledButton>
      ) : (
        <StyledButton variant="contained" color="secondary" onClick={leaveCall}>
          Leave Call
        </StyledButton>
      )}
      <VideoContainer id="video-container" />
    </StyledContainer>
  );
};

export default App;
