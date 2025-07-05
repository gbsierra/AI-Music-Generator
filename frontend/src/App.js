import React, { useState, useEffect, useRef } from 'react';
import './components/Aurora.css';
import Aurora from './components/Aurora';
import './components/ChromaGrid.css';
import ChromaGrid from './components/ChromaGrid';
import './App.css';


function App() {
  const [prompt, setPrompt] = useState('');                 // user input text
  const [audioUrl, setAudioUrl] = useState(null);           // generated audio URL
  const [isLoading, setIsLoading] = useState(false);        // loading state
  const [error, setError] = useState(null);                 // error message
  const [outputs, setOutputs] = useState([]);               // list of results
  const [selectedTrack, setSelectedTrack] = useState(null); // chosen audio track
  const audioPlayerRef = useRef(null);                      // audio player reference

  // Fetch outputs
  useEffect(() => {
    fetchOutputs();
  }, []);

  // Play respective audio when track selected
  useEffect(() => {
    if (selectedTrack && audioPlayerRef.current) {
      audioPlayerRef.current.load(); // Ensure the new src is loaded
      audioPlayerRef.current.play().catch(() => {}); // Play, ignore promise rejection
    }
  }, [selectedTrack]);

  // fetch list of songs from backend
  const fetchOutputs = async () => {
    try {
      const res = await fetch('http://localhost:8000/outputs'); // Make a GET request
      const data = await res.json();                            // Parse the JSON response
      setOutputs(data);                                         // Update state with fetched data
    } catch {
      setOutputs([]); // catch error, reset outputs to empty array
    }
  };

  // handle input submission and audio generation
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error('Failed to generate audio');
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
      await fetchOutputs(); // Refresh outputs after generating
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Map outputs to ChromaGrid items
  const items = outputs.map((filename) => ({
    //image: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
    title: filename,
    subtitle: "Generated Track",
    handle: "Click to play",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: filename,
    
  }));

  return (
    <div className="App">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={1.5}
        amplitude={1.8}
        speed={0.7}
      />
      <div className="content-container">
        <h1 className="App-title">🎶 AI Music Generator</h1>
        <div className="input-container">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a music prompt (e.g., 'smooth jazz')..."
            className="App-input"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="App-button"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {audioUrl && (
          <div className="audio-player">
            <audio controls src={audioUrl}></audio>
          </div>
        )}
        <h2 style={{ marginTop: '2rem' }}>Generated Tracks</h2>
        <div style={{ height: '600px', position: 'relative' }}>
          <ChromaGrid
            items={items}
            radius={220}
            damping={0.70}
            fadeOut={0.1}
            ease="power3.out"
            onCardClick={setSelectedTrack} // handles track selection
          />
        </div>
        <div style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: -200,
          background: "#18181b",
          padding: "1rem",
          zIndex: 1000,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.2)"
        }}>
          <audio
            ref={audioPlayerRef}
            controls
            style={{ width: "100%", maxWidth: 700, margin: "0 auto", display: "block" }}
            src={selectedTrack ? `http://localhost:8000/outputs/${selectedTrack}` : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default App;