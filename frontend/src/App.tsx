import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress, Snackbar, Container } from '@mui/material';
import { styled } from '@mui/system';
import VideocamIcon from '@mui/icons-material/Videocam';
import LinkIcon from '@mui/icons-material/Link';
import { backend } from 'declarations/backend';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const VideoContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '60vh',
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
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
    <>
      <AppBar position="static" color="secondary" elevation={0}>
        <Toolbar>
          <Logo variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <LinkIcon sx={{ mr: 1 }} />
            MeetLink
          </Logo>
        </Toolbar>
      </AppBar>
      <StyledContainer maxWidth="md">
        <VideoContainer id="video-container">
          {!callFrame && (
            <Typography variant="h6" color="textSecondary">
              Join a call to start video chatting
            </Typography>
          )}
        </VideoContainer>
        <StyledButton
          variant="contained"
          color="primary"
          startIcon={callFrame ? undefined : <VideocamIcon />}
          onClick={callFrame ? leaveCall : joinCall}
          disabled={isLoading || (!callFrame && !roomUrl)}
          fullWidth
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : callFrame ? (
            'Leave Call'
          ) : (
            'Join Call'
          )}
        </StyledButton>
      </StyledContainer>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 MeetLink. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default App;
