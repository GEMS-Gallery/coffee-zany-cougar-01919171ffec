import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress, Snackbar, Container, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/system';
import VideocamIcon from '@mui/icons-material/Videocam';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { backend } from 'declarations/backend';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const VideoContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '60vh',
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const SidebarItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IC Video Chat
          </Typography>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Toolbar>
      </AppBar>
      <StyledContainer maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Welcome to IC Video Chat
            </Typography>
            <VideoContainer id="video-container">
              {!callFrame && (
                <Typography variant="h6" color="textSecondary">
                  Join a call to start video chatting
                </Typography>
              )}
            </VideoContainer>
            <StyledButton
              variant="contained"
              color={callFrame ? "secondary" : "primary"}
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Chat Controls
              </Typography>
              <List>
                <SidebarItem button>
                  <ListItemIcon>
                    <InfoIcon />
                  </ListItemIcon>
                  <ListItemText primary="Call Information" />
                </SidebarItem>
                <SidebarItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </SidebarItem>
                <SidebarItem button>
                  <ListItemIcon>
                    <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help" />
                </SidebarItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </StyledContainer>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={error}
      />
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2023 IC Video Chat. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default App;
