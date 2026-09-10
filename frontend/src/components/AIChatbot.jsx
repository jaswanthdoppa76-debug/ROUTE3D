import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Navigation, MapPin, Phone, Mail, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function AIChatbot({ onOpenLiveTracker }) {
  const { t, language } = useLanguage();
  const { playSound } = useTheme();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Initialize greeting on language change
  useEffect(() => {
    let initialMsg = '';
    if (language === 'te') {
      initialMsg = 'నమస్కారం! నేను మీ Route3D AI అసిస్టెంట్ సారథిని. ఆంధ్రప్రదేశ్ మరియు తెలంగాణ బస్సు సమాచారం, "నా బస్సు ఎక్కడ ఉంది?" లైవ్ లొకేషన్ లేదా టికెట్ బుకింగ్ గురించి ఏదైనా అడగండి.';
    } else if (language === 'hi') {
      initialMsg = 'नमस्ते! मैं आपका Route3D एआई सहायक सारथी हूँ। "मेरी बस कहाँ है?", आंध्र एवं तेलंगाना रूट, या टिकट बुकिंग के संबंध में आप मुझसे कुछ भी पूछ सकते हैं।';
    } else {
      initialMsg = 'Namaste! I am Sarathi, your Route3D AI Assistant. Ask me "Where is my bus?", explore AP & TG routes, or get instant booking & policy help.';
    }

    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: initialMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    playSound('click');
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      generateBotReply(text);
      setIsTyping(false);
      playSound('success');
    }, 700);
  };

  const generateBotReply = (query) => {
    const q = query.toLowerCase();
    let reply = {};

    // 1. Where is my bus / Tracking
    if (
      q.includes('where is my bus') ||
      q.includes('track') ||
      q.includes('location') ||
      q.includes('bus kahan hai') ||
      q.includes('bas kahan') ||
      q.includes('bus ekkada') ||
      q.includes('బస్సు ఎక్కడ') ||
      q.includes('कहाँ')
    ) {
      reply = {
        sender: 'bot',
        type: 'live_bus_card',
        text:
          language === 'te'
            ? 'మీ సర్వీస్ TS09Z7788 (TGSRTC రాజధాని ఎక్స్‌ప్రెస్) లైవ్ లొకేషన్ ట్రాక్ చేయబడింది. బస్సు ప్రస్తుతం సూర్యాపేట బైపాస్ వద్ద 78 కి.మీ/గం వేగంతో ప్రయాణిస్తోంది.'
            : language === 'hi'
            ? 'आपकी सेवा TS09Z7788 (TGSRTC राजधानी एसी एक्सप्रेस) को ट्रैक किया गया है। यह बस फिलहाल सूर्यपेट बाईपास पर 78 किमी/घंटा की गति से चल रही है।'
            : 'Tracked verified service TS09Z7788 (TGSRTC Rajdhani AC Express). The bus is actively traveling near Suryapet NH65 Expressway at 78 km/h and running on time!',
        busNumber: 'TS09Z7788',
        speed: '78 km/h',
        location: 'NH65, Suryapet Bypass Toll Plaza',
        etaNext: 'Kodad (18 mins)',
        destinationEta: 'Vijayawada PNBS at 11:15 AM',
      };
    }
    // 2. Admin Contact / Inquiries
    else if (
      q.includes('admin') ||
      q.includes('contact') ||
      q.includes('jaswanth') ||
      q.includes('helpdesk') ||
      q.includes('support') ||
      q.includes('email') ||
      q.includes('సంప్రదించండి') ||
      q.includes('संपर्क')
    ) {
      reply = {
        sender: 'bot',
        type: 'admin_card',
        text:
          language === 'te'
            ? 'రూట్3D అధికారిక సిస్టమ్ అడ్మినిస్ట్రేటర్ జశ్వంత్ దొప్ప (jaswanthdoppa76@gmail.com). అడ్మిన్ లేదా సహాయం కొరకు క్రింది బటన్ ద్వారా నేరుగా ఈమెయిల్ చేయవచ్చు.'
            : language === 'hi'
            ? 'Route3D के एकमात्र अधिकृत सिस्टम एडमिनिस्ट्रेटर जशवंत दोप्पा हैं। प्रशासनिक सहायता के लिए सीधे jaswanthdoppa76@gmail.com पर संपर्क करें।'
            : 'Route3D Official System Administrator is Jaswanth Doppa. For operational approvals or administrative queries, contact jaswanthdoppa76@gmail.com.',
        email: 'jaswanthdoppa76@gmail.com',
      };
    }
    // 3. Hyderabad to Vijayawada / Route search
    else if (
      (q.includes('hyderabad') && q.includes('vijayawada')) ||
      q.includes('హైదరాబాద్') ||
      q.includes('विजयवाड़ा')
    ) {
      reply = {
        sender: 'bot',
        type: 'route_suggestion',
        text:
          language === 'te'
            ? 'హైదరాబాద్ ⇄ విజయవాడ కారిడార్‌లో 4 రెగ్యులర్ సూపర్ లగ్జరీ మరియు రాజధాని సర్వీసులు ఉన్నాయి (ప్రయాణ సమయం ~5 గంటలు, 275 కి.మీ).'
            : language === 'hi'
            ? 'हैदराबाद ⇄ विजयवाड़ा रूट पर प्रतिदिन सुपर लग्जरी और राजधानी एसी बसें उपलब्ध हैं (दूरी 275 किमी, समय ~5 घंटे)।'
            : 'Hyderabad ⇄ Vijayawada is our premier corridor with multiple Super Luxury & Rajdhani services daily (275 km, ~5 hours).',
        from: 'Hyderabad',
        to: 'Vijayawada',
      };
    }
    // 4. Cancellation & Refunds
    else if (
      q.includes('cancel') ||
      q.includes('refund') ||
      q.includes('రద్దు') ||
      q.includes('रद्द') ||
      q.includes('पैसे')
    ) {
      reply = {
        sender: 'bot',
        text:
          language === 'te'
            ? 'టికెట్ రద్దు నిబంధనలు: బయలుదేరడానికి 24 గంటల ముందు రద్దు చేస్తే 90% రీఫండ్, 12-24 గంటల మధ్య 75%, 2-12 గంటల మధ్య 50% రీఫండ్ లభిస్తుంది. "My Bookings" పేజీలో మీరే నేరుగా రద్దు చేసుకోవచ్చు.'
            : language === 'hi'
            ? 'कैंसलेशन नियम: प्रस्थान से 24 घंटे पहले 90% रिफंड, 12-24 घंटे पहले 75%, तथा 2-12 घंटे पहले 50% रिफंड मिलता है। आप सीधे "My Bookings" से टिकट रद्द कर सकते हैं।'
            : 'Ticket Cancellation Policy: Full refund (minus small fee) >24 hrs prior, 75% refund 12-24 hrs, and 50% refund 2-12 hrs before departure. You can cancel instantly from "My Bookings" page!',
      };
    }
    // 5. General Fallback
    else {
      reply = {
        sender: 'bot',
        text:
          language === 'te'
            ? `మీ ప్రశ్నకు ధన్యవాదాలు! మీరు బస్సు టైమింగ్స్, లైవ్ ట్రాకింగ్, లేదా ఏపీ & తెలంగాణ ఊర్ల సర్వీసుల గురించి అడగవచ్చు. అధికారిక సమాచారం కోసం అడ్మిన్ jaswanthdoppa76@gmail.com ని సంప్రదించండి.`
            : language === 'hi'
            ? `धन्यवाद! आप मुझसे लाइव बस ट्रैकिंग ("मेरी बस कहाँ है?"), रूट समय, या सीट चयन के बारे में पूछ सकते हैं। एडमिन संपर्क: jaswanthdoppa76@gmail.com`
            : `I'm here to assist with Andhra Pradesh & Telangana bus journeys! Try asking "Where is my bus?", "Hyderabad to Vijayawada schedules", or contact our administrator at jaswanthdoppa76@gmail.com.`,
      };
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating AI Launcher Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          playSound('click');
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))',
          boxShadow: '0 8px 25px rgba(6, 182, 212, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="hover:scale-110 active:scale-95"
        title="Route3D AI Sarathi"
      >
        <div style={{ position: 'relative' }}>
          <Bot size={28} color="#ffffff" />
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#34d399',
              border: '2px solid #0f172a',
            }}
          />
        </div>
      </button>

      {/* Expandable Chat Drawer Window */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid var(--border-accent)',
            boxShadow: 'var(--shadow-glow), 0 20px 40px rgba(0,0,0,0.8)',
            overflow: 'hidden',
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(6, 182, 212, 0.2))',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{t('aiTitle')}</span>
                  <span className="badge badge-apsrtc" style={{ fontSize: '9px', padding: '2px 6px' }}>
                    ONLINE
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t('aiSubtitle')}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              style={{ padding: '6px', borderRadius: '50%', width: '32px', height: '32px' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div
            style={{
              padding: '10px 14px',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              borderBottom: '1px solid var(--border-glass)',
              background: 'rgba(7, 10, 18, 0.6)',
            }}
          >
            <button
              onClick={() => handleSendMessage(t('chipWhereIsMyBus'))}
              style={{
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid var(--accent-cyan)',
                color: '#38bdf8',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('chipWhereIsMyBus')}
            </button>
            <button
              onClick={() => handleSendMessage(t('chipHyderabadVijayawada'))}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: '#cbd5e1',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('chipHyderabadVijayawada')}
            </button>
            <button
              onClick={() => handleSendMessage(t('chipContactAdmin'))}
              style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                color: '#fbbf24',
                borderRadius: '999px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {t('chipContactAdmin')}
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                }}
              >
                <div
                  style={{
                    background:
                      msg.sender === 'user'
                        ? 'linear-gradient(135deg, var(--primary-600), var(--accent-cyan))'
                        : 'rgba(30, 41, 59, 0.85)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border-glass)',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  }}
                >
                  {msg.text}

                  {/* Interactive Live Bus Card */}
                  {msg.type === 'live_bus_card' && (
                    <div
                      style={{
                        marginTop: '12px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid var(--accent-cyan)',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>{msg.busNumber}</span>
                        <span className="badge badge-apsrtc" style={{ fontSize: '9px' }}>
                          LIVE 78 KM/H
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                        📍 {msg.location}
                      </div>
                      <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px' }}>
                        ⏱️ Next: {msg.etaNext}
                      </div>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          if (onOpenLiveTracker) onOpenLiveTracker();
                        }}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          marginTop: '10px',
                          padding: '8px',
                          fontSize: '12px',
                          gap: '6px',
                        }}
                      >
                        <Navigation size={14} /> Open 3D Corridor Radar
                      </button>
                    </div>
                  )}

                  {/* Administrator Contact Card */}
                  {msg.type === 'admin_card' && (
                    <div
                      style={{
                        marginTop: '12px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: '12px',
                        padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700, fontSize: '12px' }}>
                        <ShieldCheck size={16} /> Official System Administrator
                      </div>
                      <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>Jaswanth Doppa</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{msg.email}</div>
                      <a
                        href={`mailto:${msg.email}?subject=Route3D Inquiry`}
                        className="btn-secondary"
                        style={{
                          display: 'inline-flex',
                          width: '100%',
                          marginTop: '8px',
                          padding: '6px',
                          fontSize: '12px',
                          justifyContent: 'center',
                          color: '#fbbf24',
                        }}
                      >
                        <Mail size={14} /> Email Jaswanth Doppa
                      </a>
                    </div>
                  )}

                  {/* Route Suggestion Card */}
                  {msg.type === 'route_suggestion' && (
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate(`/search?from=${encodeURIComponent(msg.from)}&to=${encodeURIComponent(msg.to)}`);
                        }}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }}
                      >
                        View Hyderabad ➔ Vijayawada Schedules <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    marginTop: '4px',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px' }}>
                <span className="animate-bounce" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                <span className="animate-bounce" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animationDelay: '0.2s' }} />
                <span className="animate-bounce" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-cyan)', animationDelay: '0.4s' }} />
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--border-glass)',
              background: 'rgba(7, 10, 18, 0.8)',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('askQuestionPlaceholder')}
              className="glass-input"
              style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 16px', borderRadius: 'var(--radius-sm)' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
