import { useState, useEffect, useRef, useCallback } from 'react';
import { X, MessageCircle, Send, User } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import axios from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export default function FloatingChat() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasUnreadAdminMessages, setHasUnreadAdminMessages] = useState(false);
  const [lastSeenMessageCount, setLastSeenMessageCount] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const messagesEndRef = useRef(null);

  // Define fetchConversation before using it in useEffect
  const fetchConversation = useCallback(async () => {
    if (user?.email) {
      // Logged-in user
      try {
        setLoading(true);
        const response = await axios.get('/contact-messages/my-conversation');
        setConversation(response.data.data);
      } catch (error) {
        // Silently handle auth errors and aborted requests
        if (error.response?.status !== 401 && error.code !== 'ECONNABORTED') {
          console.error('Failed to fetch conversation:', error);
        }
        setConversation(null);
      } finally {
        setLoading(false);
      }
    } else if (isGuest) {
      // Guest user
      const conversationId = localStorage.getItem('guestConversationId');
      if (conversationId) {
        try {
          setLoading(true);
          const response = await axios.get(`/contact-messages/public/${conversationId}`);
          setConversation(response.data.data);
        } catch (error) {
          console.error('Failed to fetch guest conversation:', error);
          setConversation(null);
          localStorage.removeItem('guestConversationId');
        } finally {
          setLoading(false);
        }
      } else {
        setConversation(null);
        setLoading(false);
      }
    }
  }, [user?.email, isGuest]);

  // Poll for conversation even when closed (to detect new admin messages)
  useEffect(() => {
    if (!user && !isGuest) return;

    // Initial fetch
    fetchConversation();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchConversation();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, isGuest, fetchConversation]);

  // Check for new admin messages when conversation updates
  useEffect(() => {
    if (!conversation?.messages) return;

    const totalMessages = conversation.messages.length;

    // If chat is closed and there are more messages than last seen
    if (!isOpen && totalMessages > lastSeenMessageCount && lastSeenMessageCount > 0) {
      // Check if the new message(s) are from admin
      const newMessages = conversation.messages.slice(lastSeenMessageCount);
      const hasNewAdminMsg = newMessages.some(msg => msg.sender === 'admin');
      setHasUnreadAdminMessages(hasNewAdminMsg);
    }
  }, [conversation?.messages, isOpen, lastSeenMessageCount]);

  // Initialize guest state on component mount
  useEffect(() => {
    const conversationId = localStorage.getItem('guestConversationId');
    if (conversationId && !user) {
      setIsGuest(true);
    }
  }, [user]);

  // When chat opens, mark as read
  useEffect(() => {
    if (isOpen && conversation?.messages) {
      setHasUnreadAdminMessages(false);
      setLastSeenMessageCount(conversation.messages.length);
    }
  }, [isOpen, conversation?.messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [conversation?.messages]);

  // Also scroll when chat opens
  useEffect(() => {
    if (isOpen && conversation?.messages?.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [isOpen, conversation?.messages?.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!user && !isGuest) return;

    setSending(true);
    try {
      const response = await axios.post('/contact-messages', {
        name: user ? `${user.firstName} ${user.lastName}` : guestDetails.name,
        email: user ? user.email : guestDetails.email,
        phone: user ? (user.phone || '') : guestDetails.phone,
        message: message.trim(),
      });

      // Store conversation ID for guests
      if (!user && response.data.data) {
        localStorage.setItem('guestConversationId', response.data.data._id);
        setIsGuest(true);
      }

      setMessage('');
      await fetchConversation();

      // Ensure scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-brown-600 hover:bg-brown-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
            {hasUnreadAdminMessages && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl border border-brown-200 flex flex-col h-[600px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-brown-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Chat with us</h3>
                {user && <p className="text-xs text-brown-100">Hi, {user.firstName}!</p>}
                {isGuest && <p className="text-xs text-brown-100">Hi, {guestDetails.name}!</p>}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-brown-700 rounded p-1 transition"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Guest Form or Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brown-50">
            {!user && !isGuest && !showGuestForm ? (
              <div className="text-center py-8">
                <p className="text-brown-600 text-sm mb-4">
                  Please provide your details to start chatting with us.
                </p>
                <Button onClick={() => setShowGuestForm(true)} className="bg-brown-600 hover:bg-brown-700">
                  Start Chat
                </Button>
              </div>
            ) : showGuestForm ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-brown-900 mb-2">Start a Conversation</h4>
                  <p className="text-sm text-brown-600">Fill in your details to begin chatting</p>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!guestDetails.name.trim() || !guestDetails.email.trim()) {
                    alert('Name and email are required');
                    return;
                  }
                  setShowGuestForm(false);
                  // Check if guest already has a conversation
                  const conversationId = localStorage.getItem('guestConversationId');
                  if (conversationId) {
                    setIsGuest(true);
                    fetchConversation();
                  }
                }} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={guestDetails.name}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={guestDetails.phone}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Button type="submit" className="w-full bg-brown-600 hover:bg-brown-700">
                    Start Chatting
                  </Button>
                </form>
              </div>
            ) : loading && !conversation ? (
              <div className="text-center py-8">
                <p className="text-brown-600 text-sm">Loading...</p>
              </div>
            ) : !conversation || conversation.messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-brown-600 text-sm">
                  No messages yet. Send a message to start the conversation!
                </p>
              </div>
            ) : (
              <>
                {conversation.messages.map((msg, index) => {
                  const showDate = index === 0 || 
                    formatDate(conversation.messages[index - 1].timestamp) !== formatDate(msg.timestamp);

                  return (
                    <div key={index}>
                      {showDate && (
                        <div className="text-center my-2">
                          <span className="text-xs text-brown-500 bg-white px-3 py-1 rounded-full">
                            {formatDate(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            msg.sender === 'customer'
                              ? 'bg-brown-600 text-white'
                              : 'bg-white text-brown-900 border border-brown-200'
                          }`}
                        >
                          {msg.sender === 'admin' && (
                            <p className="text-xs opacity-75 mb-1">{msg.senderName}</p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'customer' ? 'text-brown-200' : 'text-brown-500'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {(user || isGuest) && (
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-brown-200">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 resize-none min-h-[40px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-brown-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
