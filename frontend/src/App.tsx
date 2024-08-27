import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Snackbar } from '@mui/material';
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
  const [roomUrl, setRoomUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRoomUrl = async () => {
      try {
        const url = await backend.getRoomUrl();
        setRoomUrl(url);
      } catch (err) {
        console.error('Error fetching room URL:', err);
        setError('Failed to fetch room URL. Please try again.');
      }
    };
    fetchRoomUrl();
  }, []);

  const joinCall = useCallback(async () => {
    if (!roomUrl || typeof roomUrl !== 'string' || roomUrl.trim() === '') {
      setError('Invalid room URL. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
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
    } catch (err) {
      console.error('Error joining call:', err);
      setError('Failed to join the call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [roomUrl]);

  const leaveCall = useCallback(() => {
    if (callFrame) {
      callFrame.destroy();
      setCallFrame(null);
    }
  }, [callFrame]);

  const handleCloseError = () => {
    setError('');
  };

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
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
    </StyledContainer>
  );
};

export default App;
