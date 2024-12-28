import Webcam from "react-webcam";
import { useEffect, useRef, useState, useCallback } from "react";

import {
  FaGithub,
} from "react-icons/fa6";

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
      const scaledWidth = width * canvasScaleX;
      const scaledHeight = height * canvasScaleY;
  
      context.beginPath();
      context.lineWidth = 2;
  
      if (object.class === "person") {
        context.strokeStyle = "green";
        context.fillStyle = "yellow";
        context.font = "bold 18px Arial";
  
        context.rect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.fillText(
          `Monkey detected at x: ${Math.floor(x)}, y: ${Math.floor(y)}`,
          scaledX,
          scaledY - 10
        );
      } else {
        context.strokeStyle = "blue";
        context.fillStyle = "white";
        context.font = "16px Arial";
  
        context.rect(scaledX, scaledY, scaledWidth, scaledHeight);
        context.fillText(
          `${object.class} detected`,
          scaledX,
          scaledY - 10
        );
      }
  
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
    <div className="justify-center w-full max-w-3xl p-4 bg-zinc-950 rounded-lg">
      <nav className="lg:mb-16 mb-12 py-5 px-5 w-full rounded-lg bg-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-white text-xl font-bold mb-4">Simple Object Detection {prediction.length > 0 ? '' : 'now Loading...'}</h1>
          </div>
          <div className="flex flex-row gap-4 mt-6 md:mt-0 md:ml-auto items-center">
            <button
              className="flex align-middle relative text-white bg-zinc-950 px-2 py-2 rounded-full hover:rounded-lg hover:bg-zinc-700 transition"
            >
              <a className="text-white" href="https://github.com/abcdavk/simple-object-detection" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            </button>
            <button 
              onClick={handleClick} 
              className="flex align-middle relative text-white bg-zinc-950 px-2 py-2 rounded-full hover:rounded-lg hover:bg-zinc-700 transition"
             >
              Switch camera | {facingMode === 'user' ? 'front' : 'back'}
            </button>
            
            <button
              onClick={stopInterval}
              className="flex align-middle relative text-white bg-zinc-950 px-2 py-2 rounded-full hover:rounded-lg hover:bg-zinc-700 transition"
            >
              Stop
            </button>
          </div>
        </div>
      </nav>
      <div className="w-full">
        <div className="relative">
          {/* Video camera */}
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{
              facingMode: facingMode,
              width: 720,
              height: 480,
            }}
            className="rounded-md absolute top-0 left-0 w-full"
          />
          {/* Canvas overlay */}
          <canvas
            ref={canvasRef}
            className="rounded-md absolute top-0 left-0 w-full"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
