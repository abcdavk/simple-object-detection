import Webcam from "react-webcam";
import { useEffect, useRef, useState, useCallback } from "react";

import {
  FaCameraRotate,
  FaGithub,
} from "react-icons/fa6";
import { useIsMobile } from "./components/IsMobile";

export default function Camera({ webcamRef, intervalRef, prediction }) {
  const canvasRef = useRef(null);
  const intervalCanvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const handleClick = useCallback(() => {
    setFacingMode(prevState => 
      prevState === 'user' 
        ? 'environment' 
        : 'user'
    );
  }, []);

  const isMobile = useIsMobile()

  function setCanvas() {
    const canvas = canvasRef.current;
    const webcam = webcamRef.current;
    if (!canvas || !webcam || !webcam.video || prediction.length === 0) return;
  
    const context = canvas.getContext("2d");
  
    const videoWidth = webcam.video.videoWidth;
    const videoHeight = webcam.video.videoHeight;
  
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    const canvasScaleX = canvas.width / videoWidth;
    const canvasScaleY = canvas.height / videoHeight;
  
    prediction.forEach((object) => {
      const [x, y, width, height] = object.bbox;
  
      const scaledX = x * canvasScaleX;
      const scaledY = y * canvasScaleY;
      const scaledWidth = width;
      const scaledHeight = height;
  
      context.beginPath();
      context.lineWidth = 2;
        
      context.strokeStyle = "#3178C6";
      context.fillStyle = "white";
      context.font = "16px Arial";

      context.rect(scaledX, scaledY, scaledWidth, scaledHeight);
      context.fillText(
        `${object.class} detected`,
        scaledX,
        scaledY - 10
      );
      context.stroke();
      context.closePath();
    });
  }
  

  useEffect(() => {
    intervalCanvasRef.current = setInterval(setCanvas, 200);

    return () => {
      clearInterval(intervalCanvasRef.current);
    };
  }, [prediction]);

  const stopInterval = () => {
    clearInterval(intervalCanvasRef.current);
    console.log("Interval stopped.");
  };

  return (
    <div className="justify-center w-full max-w-4xl p-6 bg-zinc-800">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-white text-2xl font-semibold tracking-tight">
              Stupd Object Detection
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {prediction.length > 0 ? `${prediction.length} object(s) detected` : 'Initializing...'}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {
              isMobile && (
                <button
                  onClick={handleClick}
                  className="px-4 py-2 text-sm font-medium text-white transition-all flex items-center"
                  style={{ 
                    backgroundColor: '#3178C6',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563a8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3178C6'}
                >
                  <span className="pr-2">Flip</span> <FaCameraRotate />
                </button>
              )
            }
            
            <a 
              href="https://github.com/abcdavk/simple-object-detection" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-zinc-600 border border-zinc-500 transition-all hover:bg-zinc-500"
            >
              <span className="pr-2">Source Code</span> <FaGithub size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="w-full">
        <div className="relative overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
          {/* Video camera */}
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{
              facingMode: facingMode,
              width: 720,
              height: 480,
              frameRate: {
                min: 30,
                max: 60,
                ideal: 30,
                exact: 30
              }
            }}
            className="w-full block"
          />
          {/* Canvas overlay */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>
      {/* Detected Objects List */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6" style={{ backgroundColor: '#3178C6' }}></div>
          <h2 className="text-white text-lg font-semibold tracking-tight">
            Detected Objects {prediction.length > 0 && `(${prediction.length})`}
          </h2>
        </div>
        
        {prediction.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {prediction.map((object, index) => (
              <div 
                key={index}
                className="p-4 bg-zinc-700 border border-zinc-600 hover:border-cyan-500 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold capitalize">
                      {object.class}
                    </p>
                    {object.confidence && (
                      <p className="text-slate-400 text-sm mt-1">
                        Confidence: <span className="text-white">{(object.confidence * 100).toFixed(1)}%</span>
                      </p>
                    )}
                    {object.bbox && (
                      <div className="text-slate-400 text-xs mt-2 space-y-1">
                        <p>Position: ({Math.floor(object.bbox[0])}, {Math.floor(object.bbox[1])})</p>
                        <p>Size: {Math.floor(object.bbox[2])} × {Math.floor(object.bbox[3])}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-zinc-700 border border-zinc-600 rounded-lg text-center">
            <p className="text-slate-400">
              No objects detected yet. Please allow camera access and wait for detection to start.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}