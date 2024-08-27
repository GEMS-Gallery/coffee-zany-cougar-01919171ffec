import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatProps {
  callFrame: any;
}

interface ChatMessage {
  sender: string;
  message: string;
}

const Chat: React.FC<ChatProps> = ({ callFrame }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (callFrame) {
      callFrame.on('app-message', (event: any) => {
        const newMessage: ChatMessage = {
          sender: event.data.sender,
          message: event.data.message,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }
  }, [callFrame]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: ChatMessage = {
        sender: 'You',
        message: inputMessage,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      callFrame.sendAppMessage({ sender: 'You', message: inputMessage }, '*');
      setInputMessage('');
    }
  };

  return (
    <Box sx={{ width: 300, ml: 2 }}>
      <Paper elevation={3} sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {msg.sender}
              </Typography>
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSendMessage}
            sx={{ mt: 1 }}
            fullWidth
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;
