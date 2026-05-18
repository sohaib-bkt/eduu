import { useCallback, useState } from "react";
import { chatWithBot, type ChatMessage } from "../lib/gemini";

const WELCOME_MESSAGE: ChatMessage = {
  role: "model",
  content:
    "Bonjour ! Je suis l'assistant EduBloom. Posez-moi vos questions sur vos cours, vos leçons ou votre apprentissage.",
};

function getHistoryForApi(messages: ChatMessage[]): ChatMessage[] {
  if (
    messages.length === 1 &&
    messages[0].role === "model" &&
    messages[0].content === WELCOME_MESSAGE.content
  ) {
    return [];
  }
  if (
    messages[0]?.role === "model" &&
    messages[0].content === WELCOME_MESSAGE.content
  ) {
    return messages.slice(1);
  }
  return messages;
}

export function useChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: trimmed };
      const history = getHistoryForApi(messages);

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const reply = await chatWithBot(history, trimmed);
        setMessages((prev) => [...prev, { role: "model", content: reply }]);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue. Veuillez réessayer.";
        setError(message);
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content:
              "Désolé, je n'ai pas pu répondre. Vérifiez votre connexion ou réessayez plus tard.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  return {
    messages,
    isOpen,
    isLoading,
    error,
    toggleOpen,
    sendMessage,
    clearChat,
    setIsOpen,
  };
}
