import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Upload,
  Video,
  Volume2,
  Sparkles,
  Layers,
  CheckCircle2,
  Flame,
  RefreshCw,
  Eye,
  Info,
  HelpCircle,
  Zap,
  Edit2,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '../services/api';

export default function InteractiveScanner({ currentLang }) {
  // Camera & Media Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const userUploadedVideoRef = useRef(null);

  // Mode states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Captured / Uploaded Media
  const [capturedMediaUrl, setCapturedMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState('demo'); // 'demo' | 'camera_snapshot' | 'image_upload' | 'video_upload'
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Object identification state
  const [currentObject, setCurrentObject] = useState(null);
  const [detectedLabel, setDetectedLabel] = useState('Pressure Cooker');
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [customInputLabel, setCustomInputLabel] = useState('');

  // Display toggles
  const [showAR, setShowAR] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState('mechanism'); // 'mechanism' | 'stem' | 'experiment'

  // Pre-cached verified examples for immediate exploration
  const interactiveExamples = [
    {
      id: 'cooker',
      label: '🍲 Pressure Cooker',
      badge: 'Thermodynamics & Steam',
      hint: 'Learn how trapping steam raises boiling point to 121°C',
    },
    {
      id: 'bicycle',
      label: '🚲 Village Bicycle',
      badge: 'Kinematics & Gears',
      hint: 'Learn gear torque multiplier and gyroscopic balance',
    },
    {
      id: 'fan',
      label: '🌀 Ceiling Fan',
      badge: 'Electromagnetism',
      hint: 'Learn Lorentz force and 12° blade pitch airflow',
    },
    {
      id: 'waterbottle',
      label: '🧴 Water Bottle',
      badge: 'Acoustics & Pressure',
      hint: 'Learn Helmholtz resonance and hydrostatic pressure',
    },
    {
      id: 'tractor',
      label: '🚜 Farm Tractor',
      badge: 'Hydraulics & Torque',
      hint: 'Learn Pascal’s law and diesel compression ignition',
    },
    {
      id: 'plant',
      label: '🌱 Neem Leaf',
      badge: 'Photosynthesis',
      hint: 'Learn chloroplast photon harvesting & stomata gas valves',
    },
  ];

  // Load initial default verified example on mount
  useEffect(() => {
    loadObjectFromBackend('cooker');
  }, []);

  // Fetch verified accurate STEM mechanism from backend
  const loadObjectFromBackend = async (objectId, customName = null, extra = {}) => {
    setIsAnalyzing(true);
    try {
      const response = await api.scanObject(objectId, customName, currentLang, extra);
      if (response && response.result) {
        setCurrentObject(response.result);
        setDetectedLabel(response.result.name.split('(')[0].trim());
      }
    } catch (err) {
      console.error('Failed to scan from backend:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Start Device Live Camera
  const startCamera = async () => {
    setCameraError(null);
    setCapturedMediaUrl(null);
    setMediaType('camera_live');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access was not granted or is unavailable on this device. You can upload a photo/video or select an interactive example!');
      setIsCameraActive(false);
      setMediaType('demo');
    }
  };

  // Stop Device Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 1. Capture frame from Live Camera
  const captureAndAnalyzeFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameData = canvas.toDataURL('image/jpeg', 0.85);

    // Save captured snapshot to display in the viewfinder!
    setCapturedMediaUrl(frameData);
    setMediaType('camera_snapshot');
    stopCamera();

    // Send captured snapshot to backend with detected or selected label
    loadObjectFromBackend(null, detectedLabel || 'Captured Object', {
      imageFrame: frameData,
      mediaType: 'camera_snapshot',
    });
  };

  // 2. Handle File Upload (Image or Video)
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    stopCamera();
    const fileUrl = URL.createObjectURL(file);
    setCapturedMediaUrl(fileUrl);
    setUploadedFileName(file.name);

    const isVideo = file.type.startsWith('video');
    setMediaType(isVideo ? 'video_upload' : 'image_upload');

    // Smart object deduction from filename (e.g. "cycle.jpg", "cooker.png", "plant.mp4")
    const cleanFileName = file.name.toLowerCase().replace(/[-_.]/g, ' ');
    let detectedTarget = null;
    if (cleanFileName.includes('cooker') || cleanFileName.includes('pot')) detectedTarget = 'cooker';
    else if (cleanFileName.includes('cycle') || cleanFileName.includes('bike')) detectedTarget = 'bicycle';
    else if (cleanFileName.includes('fan')) detectedTarget = 'fan';
    else if (cleanFileName.includes('bottle') || cleanFileName.includes('water')) detectedTarget = 'waterbottle';
    else if (cleanFileName.includes('tractor')) detectedTarget = 'tractor';
    else if (cleanFileName.includes('plant') || cleanFileName.includes('leaf')) detectedTarget = 'plant';
    else if (cleanFileName.includes('charger') || cleanFileName.includes('adapter')) detectedTarget = 'charger';
    else if (cleanFileName.includes('pump') || cleanFileName.includes('well')) detectedTarget = 'wellpump';

    const inferredName = detectedTarget || file.name.split('.')[0];

    // Load actual mechanism from backend
    loadObjectFromBackend(detectedTarget, inferredName, {
      mediaType: isVideo ? 'video_upload' : 'image_upload',
      filename: file.name,
    });
  };

  // 3. Capture a specific frame from an uploaded video
  const captureFrameFromUploadedVideo = () => {
    if (!userUploadedVideoRef.current || !canvasRef.current) return;
    const video = userUploadedVideoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameData = canvas.toDataURL('image/jpeg', 0.85);

    setCapturedMediaUrl(frameData);
    setMediaType('camera_snapshot');

    // Re-analyze for that specific video frame
    loadObjectFromBackend(null, detectedLabel, { imageFrame: frameData, mediaType: 'video_frame' });
  };

  // 4. Update / Re-analyze for a custom typed object name
  const handleUpdateCustomLabel = (e) => {
    e.preventDefault();
    if (!customInputLabel.trim()) return;

    setDetectedLabel(customInputLabel.trim());
    setIsEditingLabel(false);
    loadObjectFromBackend(null, customInputLabel.trim(), {
      imageFrame: capturedMediaUrl,
      mediaType,
      filename: uploadedFileName,
    });
  };

  // Speech Synthesis Audio Readout in Mother Tongue
  const handleSpeak = () => {
    if (!currentObject) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text =
        (currentObject.audioText && (currentObject.audioText[currentLang] || currentObject.audioText['en'])) ||
        currentObject.summary;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff' }}>
      
      {/* Hidden inputs */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Tab Header & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#ff5b57',
              border: '3px solid #17140d',
              boxShadow: '4px 4px 0 #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Camera size={28} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <h3 style={{ fontSize: 26 }}>AI Real-Time Object Scanner</h3>
            <p style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>
              Point device camera or upload any photo/video to decode its scientific mechanism in real time.
            </p>
          </div>
        </div>

        {/* Dual Actions: Camera Toggle & File Upload */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* 1. Live Camera Button */}
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="btn-candy primary"
              style={{ fontSize: 14, padding: '10px 18px', gap: 8 }}
            >
              <Camera size={18} />
              Enable Camera 📷
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="btn-candy secondary"
              style={{ fontSize: 14, padding: '10px 18px', gap: 8 }}
            >
              <CameraOff size={18} color="#ff5b57" />
              Turn Off Camera
            </button>
          )}

          {/* 2. Upload Photo / Video from Device */}
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="btn-candy secondary"
            style={{ fontSize: 14, padding: '10px 18px', gap: 8 }}
            title="Upload an image or video of any object from your phone or PC"
          >
            <Upload size={18} color="#12b3a4" />
            Upload Photo/Video 📁
          </button>
        </div>
      </div>

      {/* ================= PROMINENT EXAMPLE BAR (HOW TO USE) ================= */}
      <div
        style={{
          backgroundColor: '#fffae5',
          borderRadius: 16,
          border: '3px solid #17140d',
          boxShadow: '4px 4px 0 #17140d',
          padding: '16px 20px',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <HelpCircle size={20} color="#ff5b57" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: '#17140d' }}>
            💡 HOW TO USE: Point your camera, upload a photo/video, or try these verified examples!
          </span>
          <span style={{ fontSize: 11, backgroundColor: '#ffc531', padding: '2px 8px', borderRadius: 6, border: '1.5px solid #17140d', fontWeight: 800 }}>
            SAMPLE EXAMPLES
          </span>
        </div>

        <p style={{ fontSize: 13.5, color: '#444', marginBottom: 12, lineHeight: 1.5 }}>
          Click any example below to see how our system analyzes actual components, formulas, and working mechanisms:
        </p>

        {/* Interactive Example Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {interactiveExamples.map((ex) => {
            const isSelected = currentObject && currentObject.id === ex.id && mediaType === 'demo';
            return (
              <button
                key={ex.id}
                onClick={() => {
                  stopCamera();
                  setCapturedMediaUrl(null);
                  setMediaType('demo');
                  loadObjectFromBackend(ex.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  borderRadius: 9999,
                  border: '2px solid #17140d',
                  backgroundColor: isSelected ? '#ffc531' : '#ffffff',
                  boxShadow: isSelected ? '3px 3px 0 #17140d' : '1.5px 1.5px 0 #17140d',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 13,
                  transition: 'all 0.15s',
                }}
              >
                <span>{ex.label}</span>
                <span
                  style={{
                    fontSize: 10,
                    backgroundColor: isSelected ? '#17140d' : '#f5efe2',
                    color: isSelected ? '#ffc531' : '#17140d',
                    padding: '1px 6px',
                    borderRadius: 4,
                  }}
                >
                  {ex.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Camera Access Notice if Error */}
      {cameraError && (
        <div
          style={{
            backgroundColor: '#fff2f1',
            border: '2px solid #ff5b57',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: '#c72c21',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Info size={18} />
          <span>{cameraError}</span>
        </div>
      )}

      {/* ================= 2-COLUMN SCANNER VIEWPORT ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 28,
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Camera Feed / Captured Image / Uploaded Video Viewport */}
        <div
          style={{
            backgroundColor: '#17140d',
            borderRadius: 20,
            border: '3px solid #17140d',
            boxShadow: '6px 6px 0 #17140d',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Viewfinder Top Bar */}
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#262218',
              borderBottom: '2px solid #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: isCameraActive ? '#2bd980' : capturedMediaUrl ? '#12b3a4' : '#ffc531',
                  boxShadow: isCameraActive ? '0 0 8px #2bd980' : 'none',
                }}
              />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>
                {isCameraActive
                  ? 'LIVE DEVICE CAMERA (1080p)'
                  : mediaType === 'camera_snapshot'
                  ? 'CAPTURED DEVICE SNAPSHOT'
                  : mediaType === 'image_upload'
                  ? `UPLOADED PHOTO: ${uploadedFileName || 'device image'}`
                  : mediaType === 'video_upload'
                  ? `UPLOADED VIDEO: ${uploadedFileName || 'device video'}`
                  : 'SAMPLE DEMO VIEW'}
              </span>
            </div>

            {/* AR Vector Toggle */}
            <button
              onClick={() => setShowAR(!showAR)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 9999,
                border: '1.5px solid #ffffff',
                backgroundColor: showAR ? '#12b3a4' : 'transparent',
                color: '#ffffff',
                fontSize: 11,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Eye size={12} />
              {showAR ? 'AR Vectors: ON' : 'AR Vectors: OFF'}
            </button>
          </div>

          {/* Central Camera Display Container */}
          <div
            style={{
              height: 400,
              position: 'relative',
              backgroundColor: '#17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* 1. Live Video Stream */}
            <video
              ref={videoRef}
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: isCameraActive ? 'block' : 'none',
              }}
            />

            {/* 2. Uploaded Video Playback */}
            {mediaType === 'video_upload' && capturedMediaUrl && (
              <video
                ref={userUploadedVideoRef}
                src={capturedMediaUrl}
                controls
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            )}

            {/* 3. Captured Snapshot or Uploaded Photo (ACTUAL STUDENT MEDIA) */}
            {(mediaType === 'camera_snapshot' || mediaType === 'image_upload') && capturedMediaUrl && (
              <img
                src={capturedMediaUrl}
                alt="Captured Real Object"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            )}

            {/* 4. Demo Schematic (only when no real media captured/uploaded) */}
            {mediaType === 'demo' && currentObject && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 30,
                  background: 'radial-gradient(circle at center, #352e22 0%, #17140d 75%)',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: 110,
                    filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.7))',
                    animation: 'confetti-bob 4s ease-in-out infinite',
                    userSelect: 'none',
                  }}
                >
                  {currentObject.icon}
                </div>

                <div
                  style={{
                    marginTop: 16,
                    backgroundColor: '#ffc531',
                    color: '#17140d',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 16,
                    padding: '6px 16px',
                    borderRadius: 9999,
                    border: '2px solid #17140d',
                    boxShadow: '3px 3px 0 #000',
                  }}
                >
                  {currentObject.name}
                </div>
              </div>
            )}

            {/* Camera Viewfinder Reticle Corners */}
            <div style={{ position: 'absolute', top: 16, left: 16, width: 28, height: 28, borderTop: '3px solid #ffc531', borderLeft: '3px solid #ffc531', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderTop: '3px solid #ffc531', borderRight: '3px solid #ffc531', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, width: 28, height: 28, borderBottom: '3px solid #ffc531', borderLeft: '3px solid #ffc531', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: 16, right: 16, width: 28, height: 28, borderBottom: '3px solid #ffc531', borderRight: '3px solid #ffc531', pointerEvents: 'none' }} />

            {/* Laser Scanning Animation Bar (only when scanning) */}
            {isCameraActive && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#ff5b57',
                  boxShadow: '0 0 14px #ff5b57',
                  animation: 'confetti-bob 2.5s ease-in-out infinite',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* AR Hotspots Overlaid on Object */}
            {showAR &&
              currentObject &&
              currentObject.arPoints &&
              currentObject.arPoints.map((pt, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    top: pt.top,
                    left: pt.left,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#12b3a4',
                    color: '#ffffff',
                    border: '2px solid #17140d',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    boxShadow: '3px 3px 0 #000',
                    zIndex: 10,
                    animation: 'confetti-pulse 2s ease-in-out infinite',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ★ {pt.label}
                </div>
              ))}
          </div>

          {/* Viewfinder Bottom Controls */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: '#262218',
              borderTop: '2px solid #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            {isCameraActive ? (
              <button
                onClick={captureAndAnalyzeFrame}
                className="btn-candy primary"
                style={{ fontSize: 13.5, padding: '10px 20px', width: '100%', gap: 8 }}
              >
                <Zap size={18} />
                {isAnalyzing ? 'Analyzing Real Mechanics...' : 'Capture Photo & Identify Object ⚡'}
              </button>
            ) : mediaType === 'video_upload' ? (
              <button
                onClick={captureFrameFromUploadedVideo}
                className="btn-candy primary"
                style={{ fontSize: 13.5, padding: '10px 20px', width: '100%', gap: 8 }}
              >
                <Video size={18} />
                Capture This Video Frame For Analysis 📸
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <button
                  onClick={startCamera}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffc531',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Camera size={16} /> Take New Camera Shot
                </button>

                <button
                  onClick={handleSpeak}
                  className="btn-candy teal"
                  style={{ padding: '6px 14px', fontSize: 12 }}
                >
                  <Volume2 size={14} />
                  {isPlayingAudio ? 'Speaking...' : 'Listen in Audio'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real Mechanism & Multi-Disciplinary STEM Breakdown */}
        {currentObject && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Header Card: Object Title, Category & Edit Object Tag */}
            <div
              style={{
                padding: '20px 22px',
                borderRadius: 16,
                backgroundColor: '#ffffff',
                border: '3px solid #17140d',
                boxShadow: '4px 4px 0 #17140d',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#ff5b57',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {currentObject.category}
                  </span>
                  <h4 style={{ fontSize: 24, marginTop: 2 }}>{currentObject.name}</h4>
                </div>

                {/* Detected Object Tag Pill with Edit option */}
                {!isEditingLabel ? (
                  <div
                    onClick={() => {
                      setCustomInputLabel(detectedLabel);
                      setIsEditingLabel(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: '#ffc531',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      border: '2px solid #17140d',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                    title="Click if you want to test another object"
                  >
                    <span>🎯 Identified: {detectedLabel}</span>
                    <Edit2 size={12} />
                  </div>
                ) : (
                  <form onSubmit={handleUpdateCustomLabel} style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      value={customInputLabel}
                      onChange={(e) => setCustomInputLabel(e.target.value)}
                      placeholder="e.g. Bicycle, Cooker, Fan, Bottle"
                      autoFocus
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '2px solid #17140d',
                        fontSize: 12,
                        fontFamily: 'var(--font-body)',
                        fontWeight: 700,
                        outline: 'none',
                        width: 140,
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#12b3a4',
                        color: '#fff',
                        borderRadius: 6,
                        border: '2px solid #17140d',
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Update
                    </button>
                  </form>
                )}
              </div>

              <p style={{ fontSize: 14, color: '#333', lineHeight: 1.6, fontWeight: 500 }}>
                {currentObject.summary}
              </p>

              {/* View Switcher Tabs: Mechanism vs STEM vs Experiment */}
              <div style={{ display: 'flex', gap: 8, marginTop: 14, borderTop: '2px dashed #17140d', paddingTop: 12, flexWrap: 'wrap' }}>
                {[
                  { id: 'mechanism', label: '⚙️ Actual Mechanism Step-by-Step', color: '#ff5b57' },
                  { id: 'stem', label: '🔬 Physics, Chem & Math Formulas', color: '#12b3a4' },
                  { id: 'experiment', label: '🔥 DIY Home Experiment', color: '#ffc531' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStepTab(tab.id)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: '2px solid #17140d',
                      backgroundColor: activeStepTab === tab.id ? tab.color : '#f5efe2',
                      color: activeStepTab === tab.id && (tab.color === '#ff5b57' || tab.color === '#12b3a4') ? '#fff' : '#17140d',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 12.5,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT 1: ACTUAL MECHANISM (STEP-BY-STEP FOR JUNIOR STUDENTS) */}
            {activeStepTab === 'mechanism' && currentObject.mechanism && (
              <div
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  backgroundColor: '#f5efe2',
                  border: '3px solid #17140d',
                  boxShadow: '4px 4px 0 #17140d',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: '#ff5b57', marginBottom: 12 }}>
                  How the Mechanism Works in Real Life:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(currentObject.mechanism).map(([key, description], index) => (
                    <div
                      key={key}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        border: '2px solid #17140d',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: '#ffc531',
                          border: '1.5px solid #17140d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {index + 1}
                      </div>
                      <p style={{ fontSize: 13.5, color: '#17140d', lineHeight: 1.55, fontWeight: 600 }}>
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: MULTI-DISCIPLINARY STEM DECOMPOSITION */}
            {activeStepTab === 'stem' && currentObject.stem && (
              <div
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  backgroundColor: '#ffffff',
                  border: '3px solid #17140d',
                  boxShadow: '4px 4px 0 #17140d',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Physics */}
                <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#fff2f1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#ff5b57', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                      PHYSICS & FORCE VECTORS
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5 }}>
                    {currentObject.stem.physics}
                  </p>
                </div>

                {/* Mathematics */}
                <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#eaf8f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#12b3a4', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                      MATHEMATICS & EQUATIONS
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5 }}>
                    {currentObject.stem.math}
                  </p>
                </div>

                {/* Chemistry */}
                <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#f4effb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#6b5be6', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                      CHEMISTRY & MATERIAL SCIENCE
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5 }}>
                    {currentObject.stem.chemistry}
                  </p>
                </div>

                {/* Biology */}
                <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#e8fbf2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#2bd980', color: '#17140d', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                      BIOLOGY & HUMAN ERGONOMICS
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5 }}>
                    {currentObject.stem.biology}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: AI HOUSEHOLD EXPERIMENT GENERATOR */}
            {activeStepTab === 'experiment' && currentObject.experiment && (
              <div
                style={{
                  padding: '20px',
                  borderRadius: 16,
                  backgroundColor: '#ffc531',
                  border: '3px solid #17140d',
                  boxShadow: '4px 4px 0 #17140d',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Flame size={22} color="#17140d" />
                  <h4 style={{ fontSize: 18 }}>AI Experiment Generator: {currentObject.experiment.title}</h4>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                    Zero-Cost Items at Home:
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {currentObject.experiment.items.map((it, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '3px 8px',
                          borderRadius: 9999,
                          border: '1.5px solid #17140d',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        ✓ {it}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '2px dashed #17140d', paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                    Step-by-Step Instructions:
                  </div>
                  <ol style={{ paddingLeft: 18, fontSize: 13.5, fontWeight: 600, lineHeight: 1.6 }}>
                    {currentObject.experiment.steps.map((st, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        {st}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
