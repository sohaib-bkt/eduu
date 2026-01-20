import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { getSupportMessages, createSupportReply, updateMessageStatus } from '../lib/api';

interface Message {
  id: string;
  user_id: string;
  title: string;
  content: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  admin_id?: string;
  profiles?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  support_replies?: Array<{
    id: string;
    reply_text: string;
    created_at: string;
    profiles?: {
      full_name: string;
      avatar_url?: string;
    };
  }>;
}

interface AdminSupportProps {
  adminId: string;
}

export default function AdminSupport({ adminId }: AdminSupportProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<'open' | 'in_progress' | 'resolved' | 'all'>('all');

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getSupportMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSubmitting(true);
    try {
      await createSupportReply(selectedMessage.id, adminId, replyText);
      setReplyText('');
      
      // Refresh messages and update selected message
      await fetchMessages();
      
      // Re-select the message to see the new reply
      const updatedMessage = messages.find(m => m.id === selectedMessage.id);
      if (updatedMessage) {
        setSelectedMessage(updatedMessage);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (messageId: string, newStatus: 'open' | 'in_progress' | 'resolved') => {
    try {
      await updateMessageStatus(messageId, newStatus);
      await fetchMessages();
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => m.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-50';
      case 'in_progress':
        return 'bg-yellow-50';
      case 'resolved':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Messages List */}
      <div className="lg:col-span-1 border border-border/20 rounded-lg overflow-hidden bg-white flex flex-col">
        <div className="px-6 py-4 border-b border-border/20 bg-gradient-to-r from-blue-50 to-transparent">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Support Messages ({filteredMessages.length})
          </h3>
        </div>

        {/* Filter Buttons */}
        <div className="px-4 py-3 border-b border-border/20 flex gap-2 overflow-x-auto">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No messages</p>
            </div>
          ) : (
            filteredMessages.map(message => (
              <motion.button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
                className={`w-full text-left px-4 py-4 border-b border-border/20 hover:bg-gray-50 transition-colors ${
                  selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {getStatusIcon(message.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {message.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {message.profiles?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Message Detail and Reply */}
      <div className="lg:col-span-2 border border-border/20 rounded-lg overflow-hidden bg-white flex flex-col">
        {selectedMessage ? (
          <>
            {/* Message Header */}
            <div className={`px-6 py-4 border-b border-border/20 ${getStatusBgColor(selectedMessage.status)}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedMessage.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {selectedMessage.profiles?.full_name} ({selectedMessage.profiles?.email})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedMessage.status)}
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {selectedMessage.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2 mt-3">
                {(['open', 'in_progress', 'resolved'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedMessage.id, status)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      selectedMessage.status === status
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Content */}
            <div className="px-6 py-4 border-b border-border/20 bg-gray-50">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
              <p className="text-xs text-gray-500 mt-4">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
            </div>

            {/* Replies */}
            {selectedMessage.support_replies && selectedMessage.support_replies.length > 0 && (
              <div className="px-6 py-4 border-b border-border/20 bg-gray-50 max-h-48 overflow-y-auto">
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Admin Replies</h4>
                <div className="space-y-3">
                  {selectedMessage.support_replies.map(reply => (
                    <div key={reply.id} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {reply.profiles?.full_name || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{reply.reply_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="px-6 py-4 border-t border-border/20 mt-auto">
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response..."
                  rows={3}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  disabled={submitting}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="submit"
                  disabled={!replyText.trim() || submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {submitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a message to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
