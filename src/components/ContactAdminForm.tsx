import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';
import { createSupportMessage } from '../lib/api';

interface ContactAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function ContactAdminForm({ isOpen, onClose, userId }: ContactAdminFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await createSupportMessage(userId, title, content);
      setSubmitted(true);
      setTitle('');
      setContent('');
      
      // Close the form after 2 seconds
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit your message');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Contact Admin Support</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle size={48} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Message Sent!</h3>
            <p className="text-gray-600">
              Our admin team will review your message and respond shortly. You'll receive a notification when they reply.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is your question or issue about?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-2">
                Message
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Please describe your question or issue in detail..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
