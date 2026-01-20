import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronDown, Loader } from 'lucide-react';
import { getUserSupportMessages } from '../lib/api';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  title: string;
  content: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  support_replies?: Array<{
    id: string;
    reply_text: string;
    created_at: string;
    admin_id?: string;
  }>;
}

export default function MySupportMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const messagesData = await getUserSupportMessages(sessionData.session.user.id);
          setMessages(messagesData || []);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-primary" />
            My Support Messages
          </h1>
          <p className="text-gray-600">View your support requests and admin responses</p>
        </motion.div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 text-center border border-border/20"
          >
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't submitted any support requests yet. Click "Get Help" from your dashboard to contact us!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-border/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{message.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {getStatusLabel(message.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(message.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedId === message.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Content - Expandable */}
                {expandedId === message.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border/20"
                  >
                    {/* Your Message */}
                    <div className="px-6 py-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-2">Your Message</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* Admin Replies */}
                    {message.support_replies && message.support_replies.length > 0 ? (
                      <div className="px-6 py-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span className="text-primary">💬</span>
                          Admin Replies ({message.support_replies.length})
                        </h4>
                        <div className="space-y-3">
                          {message.support_replies.map(reply => (
                            <div key={reply.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-start gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                  A
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    Admin
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(reply.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">{reply.reply_text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="px-6 py-4 bg-amber-50 border-t border-border/20">
                        <p className="text-sm text-amber-800">
                          ⏱️ Waiting for admin response. We'll notify you when there's a reply.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
