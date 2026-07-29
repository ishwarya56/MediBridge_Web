import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader, RotateCcw } from 'lucide-react';

// Maps UI language names to BCP-47 speech recognition locale codes
const LANGUAGE_LOCALES = {
  English:   'en-IN',
  Hindi:     'hi-IN',
  Telugu:    'te-IN',
  Tamil:     'ta-IN',
  Kannada:   'kn-IN',
  Malayalam: 'ml-IN',
};

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "YOUR_GROQ_API_KEY";

function Triage({ user }) {
  const userName = user?.name || 'there';
  const [messages, setMessages] = useState([
    {
      text: `👋 Hello ${userName}! I'm your MediBridge AI Health Assistant.\n\nYou can talk to me about anything — ask health questions, describe symptoms, or just say hi! If you describe symptoms, I'll help analyze them.\n\nHow can I help you today?`,
      isUser: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    // Build conversation history for multi-turn chat
    const newHistory = [...conversationHistory, { role: 'user', content: userMessage }];

    try {
      const systemPrompt = `You are MediBridge's friendly AI Health Assistant for users in India. You help with:
- General health questions and wellness advice
- Symptom analysis and triage
- Medical information and drug queries
- Mental health support and motivation
- General conversation about health topics

RESPONSE RULES:
1. Be warm, friendly, and conversational — respond to greetings naturally.
2. Keep ALL responses SHORT and CONCISE — maximum 150 words. Use bullet points where helpful.
3. If symptoms are mentioned, structure it as:
   🩺 Possible Conditions: (2–3 options)
   🚦 Severity: 🟢 Mild / 🟡 Moderate / 🔴 Severe
   💊 Quick Advice: (2-3 steps)
   👨‍⚕️ See a Doctor if: (1–2 clear indicators)
   🆘 Emergency: Call 108 if critical
4. For non-medical chat: just respond naturally and briefly.
5. CRITICAL: Always reply entirely in ${language}. Use natural ${language} phrasing, not just translated English.
6. Never give a diagnosis — only guidance.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...newHistory
          ],
          temperature: 0.6,
          max_tokens: 320
        })
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]) {
        const assistantReply = data.choices[0].message.content;
        setMessages(prev => [...prev, { text: assistantReply, isUser: false }]);
        // Store context for multi-turn conversation
        setConversationHistory([...newHistory, { role: 'assistant', content: assistantReply }]);
      } else {
        setMessages(prev => [...prev, { text: `❌ Error: ${data.error?.message || 'Unknown error'}. Please try again.`, isUser: false }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: `❌ Network issue: ${error.message}. Check your connection.`, isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = LANGUAGE_LOCALES[language] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => (prev ? prev + ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone permission in your browser settings.');
      } else if (event.error !== 'aborted') {
        alert(`Voice error: ${event.error}. Try again or check your microphone.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const clearChat = () => {
    setMessages([{
      text: `👋 Conversation cleared! How can I help you today, ${userName}?`,
      isUser: false
    }]);
    setConversationHistory([]);
  };

  const langLocale = LANGUAGE_LOCALES[language];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div className="three-d-effect" style={{ padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', margin: 0, fontSize: '20px' }}>🩺 AI Health Assistant</h2>
          <p style={{ color: 'rgba(0,0,0,0.5)', margin: 0, fontSize: '12px' }}>Ask anything — health, symptoms, or just say hi!</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(25, 118, 210, 0.1)', color: 'var(--primary)', fontWeight: 'bold', outline: 'none', fontSize: '13px' }}
          >
            {Object.keys(LANGUAGE_LOCALES).map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <button
            title="Clear chat"
            onClick={clearChat}
            style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: 'rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.5)' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 4px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
            {!msg.isUser && (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1976D2, #03A9F4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', flexShrink: 0, marginRight: '8px', marginTop: '4px' }}>M</div>
            )}
            <div
              className={msg.isUser ? 'gradient-bg' : 'three-d-effect'}
              style={{
                padding: '12px 16px',
                borderRadius: msg.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '78%',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.55',
                fontSize: '15px'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(0,0,0,0.5)', paddingLeft: '40px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #1976D2, #03A9F4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', flexShrink: 0 }}>M</div>
            <Loader className="animate-spin" size={18} />
            <span style={{ fontSize: '13px' }}>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={startVoiceInput}
          title={isListening ? 'Stop listening' : `Voice input in ${language} (${langLocale})`}
          style={{
            width: '48px', height: '48px', borderRadius: '50%', border: 'none', flexShrink: 0,
            background: isListening ? 'linear-gradient(135deg, #E53935, #EF5350)' : 'rgba(25, 118, 210, 0.12)',
            color: isListening ? 'white' : 'var(--primary)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isListening ? '0 0 0 4px rgba(229,57,53,0.25)' : 'none',
            transition: 'all 0.2s',
            animation: isListening ? 'pulse 1.5s infinite' : 'none'
          }}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <div style={{ flex: 1, position: 'relative' }}>
          {isListening && (
            <div style={{ position: 'absolute', top: '-28px', left: 0, right: 0, textAlign: 'center', fontSize: '12px', color: '#E53935', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E53935', display: 'inline-block', animation: 'pulse 1s infinite' }} />
              Listening in {language}...
            </div>
          )}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={isListening ? `🎤 Listening in ${language}...` : `Ask anything about your health (in ${language})`}
            className="input-field"
            style={{ borderRadius: '24px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading || !inputText.trim()}
          className="btn btn-primary"
          style={{ width: '48px', height: '48px', borderRadius: '24px', padding: 0, flexShrink: 0, opacity: (loading || !inputText.trim()) ? 0.6 : 1 }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default Triage;
