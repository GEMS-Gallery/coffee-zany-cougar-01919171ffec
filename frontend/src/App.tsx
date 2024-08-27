import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress, Snackbar, Container, TextField, Switch, FormControlLabel, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import VideocamIcon from '@mui/icons-material/Videocam';
import LinkIcon from '@mui/icons-material/Link';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
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

const MenuBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const IconButtonWithLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: theme.spacing(0, 1),
}));

const App: React.FC = () => {
  const [callFrame, setCallFrame] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string>('');
  const [roomConfig, setRoomConfig] = useState({
    enable_people_ui: false,
    enable_prejoin_ui: false,
    enable_network_ui: true,
    enable_emoji_reactions: false,
    enable_hand_raising: false,
    enable_screenshare: false,
    enable_recording: false,
    start_with_video_off: false,
    enable_knocking: false,
    enable_chat: false,
    owner_only_broadcast: false,
    close_tab_on_exit: false,
    redirect_on_meeting_exit: null as string | null,
  });

  const createRoom = useCallback(async () => {
    if (!roomName) {
      setError('Please enter a room name');
      return;
    }
    setIsLoading(true);
    try {
      await backend.createRoom(roomName, roomConfig);
      const url = await backend.getRoomUrl(roomName);
      joinCall(url);
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [roomName, roomConfig]);

  const joinCall = useCallback(async (url: string) => {
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
      await frame.join({ url });
      setCallFrame(frame);
    } catch (err) {
      console.error('Error joining call:', err);
      setError('Failed to join the call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveCall = useCallback(() => {
    if (callFrame) {
      callFrame.destroy();
      setCallFrame(null);
    }
  }, [callFrame]);

  const handleCloseError = () => {
    setError('');
  };

  const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setRoomConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'redirect_on_meeting_exit' ? (value || null) : value)
    }));
  };

  return (
    <>
      <AppBar position="static" color="secondary" elevation={0}>
        <Toolbar>
          <Logo variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <LinkIcon sx={{ mr: 1 }} />
            Link
          </Logo>
        </Toolbar>
      </AppBar>
      <StyledContainer maxWidth="md">
        {!callFrame ? (
          <Box>
            <TextField
              fullWidth
              label="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              margin="normal"
            />
            <Typography variant="h6" gutterBottom>Room Configuration</Typography>
            {Object.entries(roomConfig).map(([key, value]) => (
              key === 'redirect_on_meeting_exit' ? (
                <TextField
                  key={key}
                  fullWidth
                  label="Redirect URL on exit"
                  value={value as string || ''}
                  onChange={handleConfigChange}
                  name={key}
                  margin="normal"
                />
              ) : (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      checked={value as boolean}
                      onChange={handleConfigChange}
                      name={key}
                    />
                  }
                  label={key.replace(/_/g, ' ')}
                />
              )
            ))}
            <StyledButton
              variant="contained"
              color="primary"
              startIcon={<VideocamIcon />}
              onClick={createRoom}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create and Join Room'}
            </StyledButton>
          </Box>
        ) : (
          <>
            <VideoContainer id="video-container" />
            <MenuBar>
              <IconButtonWithLabel>
                <IconButton>
                  <NetworkCheckIcon />
                </IconButton>
                <Typography variant="caption">Network</Typography>
              </IconButtonWithLabel>
            </MenuBar>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={leaveCall}
              fullWidth
            >
              Leave Call
            </StyledButton>
          </>
        )}
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
            © 2024 Link. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default App;
