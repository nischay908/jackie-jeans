import React, { useState } from 'react';
import Landing from './components/Landing';
import ManualFlow from './components/manual/ManualFlow';
import VoiceFlow from './components/voice/VoiceFlow'; // Extends your existing audio flow
import CompletionScreen from './components/shared/CompletionScreen';
import Login from './components/Login';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'manual' | 'voice' | 'complete'
  const [showLogin, setShowLogin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  // Triggered when a user finishes either the manual or voice quiz
  const handleQuizCompletion = (results) => {
    setQuizResults(results);
    setCurrentView('complete');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
      {/* Dynamic View Swapper */}
      {currentView === 'landing' && (
        <Landing 
          onStartManual={() => setCurrentView('manual')}
          onStartVoice={() => setCurrentView('voice')}
          onOpenLogin={() => setShowLogin(true)}
          userProfile={userProfile}
        />
      )}

      {currentView === 'manual' && (
        <ManualFlow 
          onComplete={handleQuizCompletion}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'voice' && (
        <VoiceFlow 
          onComplete={handleQuizCompletion}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'complete' && (
        <CompletionScreen profileResult={quizResults} />
      )}

      {/* Profile Management Overlay Modal */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)}
          currentProfile={userProfile}
          onLoginSuccess={(updatedProfile) => {
            setUserProfile(updatedProfile);
          }}
        />
      )}
    </div>
  );
}