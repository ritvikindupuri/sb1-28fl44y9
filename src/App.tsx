import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Waves, 
  Wind,
  Music,
  MessageCircle,
  Activity,
  Volume2,
  VolumeX,
  ChevronRight,
  Timer,
  Moon
} from 'lucide-react';

function App() {
  const [currentMood, setCurrentMood] = useState<string>('');
  const [showBreathingGuide, setShowBreathingGuide] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [anxietyHistory, setAnxietyHistory] = useState<{level: number; timestamp: string}[]>([]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{text: string; isUser: boolean}[]>([
    {text: "Hi there! I'm here to help you have a peaceful journey. What's on your mind?", isUser: false}
  ]);

  // Breathing Exercise Timer
  useEffect(() => {
    let timer: number;
    if (isBreathingActive) {
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setBreathingPhase((currentPhase) => {
              switch (currentPhase) {
                case 'inhale': return 'hold';
                case 'hold': return 'exhale';
                case 'exhale': return 'inhale';
              }
            });
            return breathingPhase === 'inhale' ? 7 : breathingPhase === 'hold' ? 8 : 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase]);

  // Sound Effects
  const sounds = {
    'White Noise': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8a19583.mp3',
    'Ocean Waves': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    'Rain Sounds': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_bf3a5ccf6d.mp3',
    'Soft Piano': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8123c01ba.mp3'
  };

  const toggleSound = (soundName: string) => {
    if (selectedSound === soundName && isPlaying) {
      setIsPlaying(false);
      setSelectedSound(null);
    } else {
      setSelectedSound(soundName);
      setIsPlaying(true);
    }
  };

  const getBreathingAnimation = () => {
    switch (breathingPhase) {
      case 'inhale': return 'scale-110 transition-transform duration-4000';
      case 'hold': return 'scale-110 transition-transform duration-7000';
      case 'exhale': return 'scale-100 transition-transform duration-8000';
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, 
      { text: message, isUser: true },
      { text: "I understand how you're feeling. Take deep breaths and remember that you're safe. Would you like to try a breathing exercise?", isUser: false }
    ]);
    setMessage('');
  };

  const trackAnxiety = () => {
    setAnxietyHistory(prev => [...prev, { level: anxietyLevel, timestamp: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 transition-colors duration-500">
      {/* Hero Section */}
      <header className="px-6 py-12 text-center bg-white/30 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-6">
          <Brain className="w-12 h-12 text-indigo-600" />
          <h1 className="text-4xl font-bold text-indigo-900 ml-3">AirportMind</h1>
        </div>
        <p className="text-xl text-indigo-800/70 max-w-2xl mx-auto">
          Your personal companion for a peaceful journey
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
        {/* Mood Check-in */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-900">How are you feeling?</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['anxious', 'calm', 'excited', 'tired'].map((mood) => (
              <button
                key={mood}
                onClick={() => setCurrentMood(mood)}
                className={`${
                  currentMood === mood 
                    ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                    : 'bg-white hover:bg-indigo-50'
                } p-6 rounded-xl transition-all hover:scale-105 shadow-sm`}
              >
                <p className="capitalize text-lg font-medium text-indigo-900">{mood}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Breathing Exercise */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <Waves className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold ml-3 text-indigo-900">Guided Breathing</h3>
            </div>
            <button 
              onClick={() => setShowBreathingGuide(!showBreathingGuide)}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-lg transition-colors"
            >
              Start Breathing Exercise
            </button>
          </div>

          {/* Calming Sounds */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <Music className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold ml-3 text-indigo-900">Calming Sounds</h3>
            </div>
            <div className="space-y-2">
              {Object.keys(sounds).map((soundName) => (
                <button
                  key={soundName}
                  onClick={() => toggleSound(soundName)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                    selectedSound === soundName && isPlaying
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  <span>{soundName}</span>
                  {selectedSound === soundName && isPlaying ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Chat */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold ml-3 text-indigo-900">AI Companion</h3>
            </div>
            <div className="h-48 overflow-y-auto mb-4 space-y-3">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.isUser
                      ? 'bg-indigo-50 text-indigo-900 ml-8'
                      : 'bg-green-50 text-green-900 mr-8'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleMessageSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg"
              >
                <ChevronRight />
              </button>
            </form>
          </div>

          {/* Anxiety Tracker */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-semibold ml-3 text-indigo-900">Anxiety Tracker</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={anxietyLevel}
                  onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-lg font-semibold text-indigo-900">{anxietyLevel}</span>
              </div>
              <button
                onClick={trackAnxiety}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg transition-colors"
              >
                Log Current Level
              </button>
              <div className="h-32 overflow-y-auto">
                {anxietyHistory.map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{entry.timestamp}</span>
                    <span className="font-semibold text-indigo-900">Level: {entry.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breathing Guide Modal */}
        {showBreathingGuide && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-indigo-900">4-7-8 Breathing</h3>
                <button 
                  onClick={() => {
                    setShowBreathingGuide(false);
                    setIsBreathingActive(false);
                    setBreathingPhase('inhale');
                    setCountdown(4);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="relative h-64 flex flex-col items-center justify-center">
                <div 
                  className={`w-40 h-40 rounded-full border-4 border-indigo-500 flex items-center justify-center ${getBreathingAnimation()}`}
                >
                  <Wind className={`w-16 h-16 text-indigo-500 transition-opacity ${breathingPhase === 'exhale' ? 'opacity-100' : 'opacity-50'}`} />
                </div>
                <div className="mt-8 text-center">
                  <p className="text-3xl font-bold text-indigo-600 mb-2">{countdown}</p>
                  <p className="text-xl text-indigo-900">{breathingPhase}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isBreathingActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {isBreathingActive ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;