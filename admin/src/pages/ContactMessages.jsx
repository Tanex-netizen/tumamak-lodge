import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { MessageCircle, Send, Trash2, RefreshCw, User } from 'lucide-react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';

export default function ContactMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const messagesEndRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);

      const response = await axios.get(`/contact-messages?${params.toString()}`);
      setConversations(response.data.data || []);

      // Update selected conversation if it exists
      if (selectedConversation) {
        const updated = response.data.data.find(c => c._id === selectedConversation._id);
        if (updated) {
          setSelectedConversation(updated);
        }
      }
    } catch (error) {
      toast.error('Failed to load conversations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, selectedConversation]);

  useEffect(() => {
    fetchConversations();

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      fetchConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (selectedConversation?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [selectedConversation?.messages]);

  // Also scroll when conversation is selected
  useEffect(() => {
    if (selectedConversation?.messages?.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [selectedConversation?._id, selectedConversation?.messages?.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    // Mark as read
    if (!conversation.isRead) {
      try {
        await axios.patch(`/contact-messages/${conversation._id}/read`);
        fetchConversations();
      } catch {
        // Silently fail - marking as read is not critical
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await axios.post(`/contact-messages/${selectedConversation._id}/respond`, {
        response: message.trim(),
      });

      setMessage('');
      
      // Update selected conversation with the response data
      if (response.data.data) {
        setSelectedConversation(response.data.data);
      }
      
      fetchConversations();

      // Ensure scroll to bottom after sending
      setTimeout(() => scrollToBottom(), 100);

      toast.success('Message sent!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (conversationId, newStatus) => {
    try {
      await axios.patch(`/contact-messages/${conversationId}/status`, {
        status: newStatus,
      });
      toast.success('Status updated');
      fetchConversations();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await axios.delete(`/contact-messages/${conversationId}`);
      toast.success('Conversation deleted');
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null);
      }
      fetchConversations();
    } catch {
      toast.error('Failed to delete conversation');
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

  const formatMessageDate = (timestamp) => {
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

  const getLastMessage = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages';
    }
    const lastMsg = conversation.messages[conversation.messages.length - 1];
    return lastMsg.text;
  };

  const unreadCount = conversations.filter((c) => !c.isRead).length;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brown-900">Contact Messages</h1>
          <div className="text-brown-600 mt-1">
            Chat with customers
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{unreadCount} unread</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-brown-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Conversations</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <Button onClick={fetchConversations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
        {/* Left: Conversations List */}
        <div className="lg:col-span-1 flex flex-col overflow-hidden border border-brown-200 rounded-lg bg-white">
          <div className="p-4 border-b border-brown-200">
            <h2 className="text-lg font-semibold text-brown-900">
              Conversations ({conversations.length})
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-brown-600">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-brown-600">
                No conversations found
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`p-4 border-b border-brown-100 cursor-pointer transition-colors ${
                    selectedConversation?._id === conversation._id
                      ? 'bg-brown-100'
                      : 'hover:bg-brown-50'
                  } ${!conversation.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-brown-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-brown-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`font-semibold text-sm truncate ${!conversation.isRead ? 'text-brown-900' : 'text-brown-700'}`}>
                          {conversation.name}
                        </span>
                        <span className="text-xs text-brown-500 flex-shrink-0">
                          {formatDate(conversation.lastMessageAt || conversation.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-brown-600 truncate mb-1">{conversation.email}</p>
                      <p className={`text-sm truncate ${!conversation.isRead ? 'font-medium text-brown-900' : 'text-brown-600'}`}>
                        {getLastMessage(conversation)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={conversation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {conversation.status}
                        </Badge>
                        {conversation.userId && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Registered</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Chat Thread */}
        <div className="lg:col-span-2 flex flex-col overflow-hidden border border-brown-200 rounded-lg bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-brown-200 bg-brown-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-brown-900">{selectedConversation.name}</h3>
                    <p className="text-sm text-brown-600">{selectedConversation.email}</p>
                    {selectedConversation.phone && (
                      <p className="text-xs text-brown-500">{selectedConversation.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleStatusChange(
                        selectedConversation._id,
                        selectedConversation.status === 'active' ? 'closed' : 'active'
                      )}
                      variant="outline"
                      size="sm"
                    >
                      {selectedConversation.status === 'active' ? 'Close' : 'Reopen'}
                    </Button>
                    <Button
                      onClick={() => handleDeleteConversation(selectedConversation._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brown-50">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  <>
                    {selectedConversation.messages.map((msg, index) => {
                      const showDate = index === 0 || 
                        formatMessageDate(selectedConversation.messages[index - 1].timestamp) !== formatMessageDate(msg.timestamp);

                      return (
                        <div key={index}>
                          {showDate && (
                            <div className="text-center my-2">
                              <span className="text-xs text-brown-500 bg-white px-3 py-1 rounded-full">
                                {formatMessageDate(msg.timestamp)}
                              </span>
                            </div>
                          )}
                          
                          <div className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                            <div
                              className={`max-w-[75%] rounded-lg px-4 py-2 border ${
                                msg.sender === 'customer'
                                  ? 'bg-white text-brown-900 border-brown-200'
                                  : 'bg-white text-brown-900 border-brown-600 shadow-sm'
                              }`}
                            >
                              {msg.sender === 'admin' && (
                                <p className="text-xs text-brown-600 font-semibold mb-1">{msg.senderName}</p>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words text-brown-900">
                                {msg.text}
                              </p>
                              <p className="text-xs mt-1 text-brown-500">
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="text-center py-8 text-brown-600">
                    No messages in this conversation
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-brown-200 bg-white">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={2}
                    className="flex-1 resize-none"
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-brown-600">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-brown-400" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
