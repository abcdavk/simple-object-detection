#### Folder Structure

```
 .
└── src/
    ├── App.js
    ├── Camera.js
    ├── Footer.js (unused)
    ├── index.css
    ├── index.js
    └── ResultSide.js (unused)
```

#### Camera.js

The main code in this project is in Camera.js, so I'll just explain this code. Looks confusing because I haven't optimized the code.

```
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
          `Human detected at x: ${Math.floor(x)}, y: ${Math.floor(y)}`,
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

```

#### Overview
This React component integrates a webcam to capture video input and overlays detected objects onto the live feed using TensorFlow's object detection model. It displays the detected objects' bounding boxes and labels on a canvas overlaying the video stream.

#### Key Features
- **Real-time Object Detection**: Uses TensorFlow to predict and identify objects in the video feed.
- **Webcam Switching**: Allows the user to toggle between the front and back cameras.
- **Canvas Overlay**: Displays the bounding boxes and labels for detected objects.
- **GitHub Integration**: Provides a link to the GitHub repository for the project.

---

#### Dependencies
- `react-webcam`: A React component for integrating webcam video.
- `react-icons/fa6`: Provides Font Awesome icons (used here for the GitHub link).
- `tensorflow.js` (assumed): A TensorFlow model to perform object detection on the video feed.

---

#### Component Breakdown

1. **Webcam Integration**
   - The `Webcam` component from the `react-webcam` library is used to capture the video feed from the webcam.
   - The `videoConstraints` prop is dynamically adjusted to switch between the front (`user`) and back (`environment`) cameras based on the state `facingMode`.

2. **Canvas for Drawing Bounding Boxes**
   - A `<canvas>` element is overlaid on top of the video. This canvas is used to draw the bounding boxes for detected objects.
   - The canvas dimensions are set to match the video feed, ensuring the bounding boxes are correctly scaled.

3. **Object Detection and Drawing**
   - The `setCanvas` function is responsible for drawing the bounding boxes and labels on the canvas.
     - It checks if the `prediction` array (the list of detected objects) is populated.
     - Each detected object is drawn using its bounding box (`x, y, width, height`), scaled to fit the canvas.
     - The bounding box is drawn with different colors and labels depending on the object's class (e.g., "person" or other detected objects).
     - The label is drawn above the bounding box with details about the detected object.

4. **Switching Camera**
   - A button is provided to toggle between the front (`user`) and back (`environment`) cameras. This is done by updating the `facingMode` state.
   - The camera mode switch is achieved through the `handleClick` function.

5. **Interval Control**
   - The `setInterval` function is used to periodically update the canvas every 200 milliseconds, drawing the latest predictions from the object detection model.
   - The interval is cleared when the component is unmounted or when the "Stop" button is clicked, stopping the object detection loop.

---

#### Code Details

- **`webcamRef`**: A reference to the webcam component, allowing access to the video element.
- **`intervalRef`**: A reference to manage the interval for canvas updates.
- **`prediction`**: An array containing the object detection results, including information like bounding box coordinates and object classes.
- **`facingMode`**: State to manage the active camera (front or back).
- **`handleClick`**: A callback function used to toggle between front and back cameras.
- **`setCanvas`**: Function to draw bounding boxes and object labels on the canvas.

---

#### UI Components

- **Navigation Bar**: Contains a heading and buttons:
  - A GitHub link button to the project's repository.
  - A camera toggle button to switch between front and back cameras.
  - A stop button to stop the object detection interval.
  
- **Webcam Video Stream**: Captures the video feed from the webcam.
  
- **Canvas Overlay**: Used to draw object bounding boxes on top of the webcam feed.

---

#### Example of Object Detection Output

When an object is detected, a bounding box is drawn around it with the following information:
- **Bounding Box**: A rectangle outlining the detected object.
- **Label**: A text label describing the detected object, placed above the bounding box. For example:
  - `"Human detected at x: 123, y: 456"`
  - `"person detected"`

Objects of different classes are drawn with different colors:
- **Green** for persons.
- **Blue** for other objects.

---

#### Conclusion

This simple object detection React component demonstrates how to integrate a webcam with TensorFlow's object detection capabilities and render predictions directly onto a canvas overlay. The app allows the user to toggle between the front and back cameras, and the predictions are updated in real-time, making it a powerful tool for object recognition applications.

---

#### Future Improvements
- **Model Optimizations**: Improve detection accuracy and performance.
- **Custom Object Detection**: Integrate the ability to train and detect custom objects.
- **Error Handling**: Add error handling for issues like webcam access denials or model loading failures.