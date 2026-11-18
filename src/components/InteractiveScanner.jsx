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
  Crosshair,
  Target,
  Cpu,
} from 'lucide-react';
import { api } from '../services/api';
import { DETAILED_OBJECTS } from '../data/scannerKnowledge';
import { compressImageForVision } from '../utils/imageCompress';

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
  const [analysisStep, setAnalysisStep] = useState('');

  // Pinpoint reticle state (percentage coordinates across viewfinder)
  const [pinpointTarget, setPinpointTarget] = useState({ x: 50, y: 50 });

  // Captured / Uploaded Media
  const [capturedMediaUrl, setCapturedMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState('demo'); // 'demo' | 'camera_snapshot' | 'image_upload' | 'video_upload'
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Object identification state
  const [currentObject, setCurrentObject] = useState(null);
  const [detectedLabel, setDetectedLabel] = useState('Pressure Cooker');
  const [detectionSource, setDetectionSource] = useState('curated_library');
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
      hint: 'Gay-Lussac’s law and boiling point shift to 121°C',
    },
    {
      id: 'bicycle',
      label: '🚲 Village Bicycle',
      badge: 'Kinematics & Gears',
      hint: 'Gear ratio torque multiplier & angular momentum',
    },
    {
      id: 'pen',
      label: '🖊️ Ballpoint Pen',
      badge: 'Capillary Action & Fluid Mechanics',
      hint: 'Tungsten carbide sphere & shear-thinning ink',
    },
    {
      id: 'phone',
      label: '📱 Smartphone',
      badge: 'Optoelectronics & Semiconductors',
      hint: 'Capacitive touch grid & lithium-ion redox',
    },
    {
      id: 'scissors',
      label: '✂️ Scissors',
      badge: 'Class 1 Levers & Shear Stress',
      hint: 'Mechanical advantage and localized shear failure',
    },
    {
      id: 'spectacles',
      label: '👓 Spectacles / Lenses',
      badge: 'Optics & Refraction',
      hint: 'Snell’s law and retinal focal plane adjustment',
    },
    {
      id: 'fan',
      label: '🌀 Ceiling Fan',
      badge: 'Electromagnetism',
      hint: 'Lorentz force and 12° blade pitch aerodynamic thrust',
    },
    {
      id: 'plant',
      label: '🌱 Neem Leaf',
      badge: 'Photosynthesis',
      hint: 'Chloroplast photon harvesting & stomata gas valves',
    },
    {
      id: 'waterbottle',
      label: '🧴 Water Bottle',
      badge: 'Acoustics & Pressure',
      hint: 'Helmholtz acoustic resonance and hydrostatic pressure',
    },
  ];

  // Load initial default verified example on mount
  useEffect(() => {
    loadObjectFromBackend('cooker');
  }, []);

  // Fetch verified accurate STEM mechanism or run Real-Time Gemini Vision
  const loadObjectFromBackend = async (objectId, customName = null, extra = {}) => {
    setIsAnalyzing(true);
    setAnalysisStep('📸 Locking onto target pixels...');
    if (extra.imageFrame) {
      setDetectedLabel('Scanning Object Pixels...');
      setAnalysisStep('🤖 AI Vision scanning image contours & components...');
    }

    try {
      const response = await api.scanObject(objectId, customName, currentLang, extra);
      if (response && response.result) {
        setCurrentObject(response.result);
        setDetectedLabel(response.result.name ? response.result.name.split('(')[0].trim() : 'Recognized Object');
        setDetectionSource(response.source || 'gemini_vision');
      }
    } catch (err) {
      console.error('Failed to scan from backend:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Start Device Live Camera
  const startCamera = async () => {
    setCameraError(null);
    setCapturedMediaUrl(null);
    setMediaType('camera_live');
    setDetectedLabel('Aiming at Object...');

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
      setCameraError('Camera access was not granted or is unavailable on this device. You can upload a photo or select an interactive example!');
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

  // Handle user tap/click on camera or photo to reposition the pinpoint reticle
  const handleViewportClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (!clientX || !clientY) return;

    const x = Math.max(12, Math.min(88, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(12, Math.min(88, Math.round(((clientY - rect.top) / rect.height) * 100)));
    setPinpointTarget({ x, y });
  };

  // 1. Capture frame from Live Camera and send for real-time AI recognition
  const captureAndAnalyzeFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawFrame = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();
    setMediaType('camera_snapshot');

    // Compress to optimal dimensions for instantaneous Gemini Vision inference
    const optimizedFrame = await compressImageForVision(rawFrame, 1024, 0.85);
    setCapturedMediaUrl(optimizedFrame || rawFrame);

    // Critical: Send null for customName so Gemini Vision identifies the real object from pixels!
    loadObjectFromBackend(null, null, {
      imageFrame: optimizedFrame || rawFrame,
      mediaType: 'camera_snapshot',
      pinpoint: pinpointTarget,
    });
  };

  // 2. Handle File Upload (Image or Video)
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    stopCamera();
    setUploadedFileName(file.name);

    const isVideo = file.type.startsWith('video');
    setMediaType(isVideo ? 'video_upload' : 'image_upload');

    if (isVideo) {
      const fileUrl = URL.createObjectURL(file);
      setCapturedMediaUrl(fileUrl);
      loadObjectFromBackend(null, file.name.split('.')[0], {
        mediaType: 'video_upload',
        filename: file.name,
        pinpoint: pinpointTarget,
      });
    } else {
      setAnalysisStep('⚡ Optimizing image & analyzing pixels with Gemini Vision...');
      // Compress any large photo or WhatsApp image to 1024px @ 0.85 JPEG for instant analysis
      const optimizedBase64 = await compressImageForVision(file, 1024, 0.85);
      setCapturedMediaUrl(optimizedBase64);

      loadObjectFromBackend(null, null, {
        imageFrame: optimizedBase64,
        mediaType: 'image_upload',
        filename: file.name,
        pinpoint: pinpointTarget,
      });
    }
  };

  // 3. Re-scan current captured or uploaded image at the pinpoint reticle position
  const rescanAtPinpoint = async () => {
    if (!capturedMediaUrl) return;
    loadObjectFromBackend(null, null, {
      imageFrame: capturedMediaUrl,
      mediaType: mediaType || 'camera_snapshot',
      filename: uploadedFileName,
      pinpoint: pinpointTarget,
    });
  };

  // 4. Capture a specific frame from an uploaded video
  const captureFrameFromUploadedVideo = async () => {
    if (!userUploadedVideoRef.current || !canvasRef.current) return;
    const video = userUploadedVideoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameData = canvas.toDataURL('image/jpeg', 0.9);
    const optimizedFrame = await compressImageForVision(frameData, 1024, 0.85);

    setCapturedMediaUrl(optimizedFrame || frameData);
    setMediaType('camera_snapshot');

    // Re-analyze for that specific video frame
    loadObjectFromBackend(null, null, {
      imageFrame: optimizedFrame || frameData,
      mediaType: 'video_frame',
      pinpoint: pinpointTarget,
    });
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
      pinpoint: pinpointTarget,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: 26, margin: 0 }}>What is this?</h3>
              <span style={{
                backgroundColor: '#2bd980',
                color: '#17140d',
                fontSize: 11,
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: 6,
                border: '1.5px solid #17140d',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#047857', animation: 'pulse 1.5s infinite' }} />
                VISION AI READY
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#555', fontWeight: 600, margin: '4px 0 0' }}>
              Pinpoint any physical object with your camera or photo to decode its genuine scientific mechanism in real time.
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
              Open Camera & Pinpoint 📷
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="btn-candy secondary"
              style={{ fontSize: 14, padding: '10px 18px', gap: 8 }}
            >
              <CameraOff size={18} color="#ff5b57" />
              Close Camera
            </button>
          )}

          {/* 2. Upload Photo / Video from Device */}
          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="btn-candy secondary"
            style={{ fontSize: 14, padding: '10px 18px', gap: 8 }}
            title="Upload any photo of a real-world object from your phone or PC"
          >
            <Upload size={18} color="#12b3a4" />
            Upload Photo 📁
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={20} color="#ff5b57" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: '#17140d' }}>
              🎯 REAL-TIME DETECTION: Point reticle at any object and capture, or click verified examples!
            </span>
          </div>
          <span style={{ fontSize: 11, backgroundColor: '#ffc531', padding: '2px 8px', borderRadius: 6, border: '1.5px solid #17140d', fontWeight: 800 }}>
            VERIFIED STEM EXAMPLES
          </span>
        </div>

        <p style={{ fontSize: 13, color: '#444', marginBottom: 12, lineHeight: 1.5 }}>
          Point your camera at real things around you (pen, fan, phone, scissors, glasses, plants, water tap), or test instant pre-calibrated models:
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
        className="scanner-viewport-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(16px, 2.5vw, 28px)',
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
                  ? 'LIVE CAMERA — TAP OBJECT TO PINPOINT'
                  : mediaType === 'camera_snapshot'
                  ? 'CAPTURED REAL PHOTO (Tap to Pinpoint)'
                  : mediaType === 'image_upload'
                  ? (/whatsapp|screenshot|img_|image|pxl_|photo/i.test(uploadedFileName) ? 'SHARED PHOTO SCAN (Tap to Pinpoint)' : `UPLOADED PHOTO: ${uploadedFileName}`)
                  : mediaType === 'video_upload'
                  ? `VIDEO FRAME: ${uploadedFileName || 'Video'}`
                  : 'SAMPLE INTERACTIVE SCHEMATIC'}
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

          {/* Central Camera Display Container with Click-To-Pinpoint */}
          <div
            onClick={handleViewportClick}
            style={{
              height: 420,
              position: 'relative',
              backgroundColor: '#17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: isCameraActive || capturedMediaUrl ? 'crosshair' : 'default',
            }}
            title={isCameraActive || capturedMediaUrl ? 'Tap anywhere to pinpoint and focus on that specific object!' : ''}
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
                    animation: 'float 4s ease-in-out infinite alternate',
                    userSelect: 'none',
                  }}
                >
                  {currentObject.icon || '🍲'}
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

            {/* Laser Scanning Animation Bar (only when camera is live) */}
            {isCameraActive && !isAnalyzing && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#2bd980',
                  boxShadow: '0 0 14px #2bd980',
                  animation: 'pulse 1.8s ease-in-out infinite alternate',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Interactive Pinpoint Aiming Reticle Overlay */}
            {(isCameraActive || mediaType === 'camera_snapshot' || mediaType === 'image_upload') && (
              <div
                style={{
                  position: 'absolute',
                  top: `${pinpointTarget.y}%`,
                  left: `${pinpointTarget.x}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 25,
                  transition: 'top 0.15s ease-out, left 0.15s ease-out',
                }}
              >
                {/* Rotating Reticle Ring */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    border: '2.5px dashed #ffc531',
                    boxShadow: isAnalyzing ? '0 0 24px #ff5b57, inset 0 0 12px #ff5b57' : '0 0 16px rgba(255, 197, 49, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isAnalyzing ? 'spin 1.5s linear infinite' : 'pulse 2s infinite alternate',
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: isAnalyzing ? '#ff5b57' : '#2bd980',
                      boxShadow: '0 0 8px #ffffff',
                    }}
                  />
                </div>

                {/* Reticle coordinate HUD tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: 76,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#17140d',
                    color: '#ffc531',
                    fontSize: 10,
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: '1.5px solid #ffc531',
                    boxShadow: '2px 2px 0 #000',
                  }}
                >
                  🎯 TARGET [{pinpointTarget.x}%, {pinpointTarget.y}%]
                </div>
              </div>
            )}

            {/* Live AI Vision Scanning Progress HUD Overlay */}
            {isAnalyzing && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(23, 20, 13, 0.85)',
                  backdropFilter: 'blur(3px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 35,
                  gap: 14,
                  padding: 24,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 44, animation: 'float 1.2s infinite alternate' }}>
                  🔬
                </div>
                <div style={{ color: '#ffc531', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18 }}>
                  REAL-TIME AI VISION RECOGNITION
                </div>
                <div style={{ color: '#ffffff', fontSize: 13.5, fontWeight: 700, maxWidth: 320 }}>
                  {analysisStep || 'Scanning targeted object pixels & deducing real-world mechanisms...'}
                </div>
                <div style={{ width: 200, height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', backgroundColor: '#2bd980', borderRadius: 3, animation: 'pulse 1s infinite alternate' }} />
                </div>
                <span style={{ fontSize: 11, color: '#2bd980', fontWeight: 800 }}>
                  ⚡ Multimodal Gemini Neural Engine Active
                </span>
              </div>
            )}

            {/* AR Hotspots Overlaid on Object */}
            {showAR &&
              !isAnalyzing &&
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
                    zIndex: 20,
                    animation: 'pulse 2.5s ease-in-out infinite alternate',
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
                disabled={isAnalyzing}
                className="btn-candy primary"
                style={{ fontSize: 14, padding: '12px 24px', width: '100%', gap: 8, opacity: isAnalyzing ? 0.6 : 1 }}
              >
                <Zap size={18} />
                {isAnalyzing ? 'Scanning Object Pixels...' : 'Capture & Identify Pinpointed Object ⚡'}
              </button>
            ) : mediaType === 'video_upload' ? (
              <button
                onClick={captureFrameFromUploadedVideo}
                disabled={isAnalyzing}
                className="btn-candy primary"
                style={{ fontSize: 13.5, padding: '10px 20px', width: '100%', gap: 8 }}
              >
                <Video size={18} />
                Capture Video Frame For Analysis 📸
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={startCamera}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffc531',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Camera size={16} /> New Camera Shot
                  </button>

                  {capturedMediaUrl && (
                    <button
                      onClick={rescanAtPinpoint}
                      disabled={isAnalyzing}
                      className="btn-candy primary"
                      style={{ fontSize: 12.5, padding: '7px 14px', gap: 6 }}
                      title="Tap anywhere on the photo above to position the reticle, then click here to focus on that specific object"
                    >
                      <Crosshair size={14} />
                      {isAnalyzing ? 'Scanning Target...' : `Scan Pinpoint [${pinpointTarget.x}%, ${pinpointTarget.y}%] 🎯`}
                    </button>
                  )}
                </div>

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
                padding: '22px 24px',
                borderRadius: 18,
                backgroundColor: '#ffffff',
                border: '3px solid #17140d',
                boxShadow: '5px 5px 0 #17140d',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        color: '#ff5b57',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {currentObject.category}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 900,
                        backgroundColor: detectionSource === 'gemini_vision' ? '#2bd980' : '#ffc531',
                        color: '#17140d',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1px solid #17140d',
                      }}
                    >
                      {detectionSource === 'gemini_vision' ? '⚡ LIVE AI VISION DETECTED' : '📚 VERIFIED STEM DATA'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: 26, margin: '2px 0 0' }}>
                    {currentObject.icon ? `${currentObject.icon} ` : ''}{currentObject.name}
                  </h4>
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
                    title="Click to manually edit or test another object"
                  >
                    <span>🎯 {detectedLabel}</span>
                    <Edit2 size={12} />
                  </div>
                ) : (
                  <form onSubmit={handleUpdateCustomLabel} style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      value={customInputLabel}
                      onChange={(e) => setCustomInputLabel(e.target.value)}
                      placeholder="e.g. Pen, Phone, Scissors, Glasses"
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

              <p style={{ fontSize: 14, color: '#333', lineHeight: 1.6, fontWeight: 500, margin: '0 0 16px' }}>
                {currentObject.summary}
              </p>

              {/* Empirical Stats Grid (Real Data for This Specific Object) */}
              {currentObject.stats && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: 10,
                    padding: '12px 14px',
                    backgroundColor: '#f5efe2',
                    borderRadius: 12,
                    border: '2px solid #17140d',
                    marginBottom: 14,
                  }}
                >
                  {Object.entries(currentObject.stats).map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#777', textTransform: 'uppercase' }}>
                        {label.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: 900, color: '#17140d' }}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* View Switcher Tabs: Mechanism vs STEM vs Experiment */}
              <div style={{ display: 'flex', gap: 8, borderTop: '2px dashed #17140d', paddingTop: 14, flexWrap: 'wrap' }}>
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
                  How this exact mechanism functions:
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
                      <p style={{ fontSize: 13.5, color: '#17140d', lineHeight: 1.55, fontWeight: 600, margin: 0 }}>
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
                {currentObject.stem.physics && (
                  <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#fff2f1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#ff5b57', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        PHYSICS & FORCE VECTORS
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5, margin: 0 }}>
                      {currentObject.stem.physics}
                    </p>
                  </div>
                )}

                {/* Mathematics */}
                {currentObject.stem.math && (
                  <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#eaf8f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#12b3a4', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        MATHEMATICS & EQUATIONS
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5, margin: 0 }}>
                      {currentObject.stem.math}
                    </p>
                  </div>
                )}

                {/* Chemistry */}
                {currentObject.stem.chemistry && (
                  <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#f4effb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#6b5be6', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        CHEMISTRY & MATERIAL SCIENCE
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5, margin: 0 }}>
                      {currentObject.stem.chemistry}
                    </p>
                  </div>
                )}

                {/* Biology */}
                {currentObject.stem.biology && (
                  <div style={{ padding: '12px 14px', borderRadius: 12, border: '2px solid #17140d', backgroundColor: '#e8fbf2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#2bd980', color: '#17140d', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        BIOLOGY & HUMAN ERGONOMICS
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: '#17140d', lineHeight: 1.5, margin: 0 }}>
                      {currentObject.stem.biology}
                    </p>
                  </div>
                )}
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
                  <h4 style={{ fontSize: 18, margin: 0 }}>AI Experiment Generator: {currentObject.experiment.title}</h4>
                </div>

                {currentObject.experiment.items && (
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
                )}

                {currentObject.experiment.steps && (
                  <div style={{ borderTop: '2px dashed #17140d', paddingTop: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                      Step-by-Step Instructions:
                    </div>
                    <ol style={{ paddingLeft: 18, fontSize: 13.5, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                      {currentObject.experiment.steps.map((st, i) => (
                        <li key={i} style={{ marginBottom: 4 }}>
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
