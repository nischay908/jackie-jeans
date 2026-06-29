import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing.jsx'
import ManualFlow from './components/manual/ManualFlow.jsx'
import VoiceFlow from './components/voice/VoiceFlow.jsx'

export default function App() {
  return (
    <div className="relative z-10 min-h-dvh">
      <Routes>
        <Route path="/"       element={<Landing />} />
        <Route path="/manual" element={<ManualFlow />} />
        <Route path="/voice"  element={<VoiceFlow />} />
      </Routes>
    </div>
  )
}
