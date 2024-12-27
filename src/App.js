import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";

import { useState, useEffect, useRef } from "react";

function App() {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState([]);
  const intervalRef = useRef(null)

  const getModel = async () => {
    try {
      const dataset = await cocoModel.load();
      setModel(dataset);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    tf.ready().then(() => {
      getModel();
    });
  }, []);

  const detectObjects = async () => {
    if (model && webcamRef.current) {
      const video = webcamRef.current.video;

      if (video.readyState === 4) {
        const imgTensor = tf.browser.fromPixels(video);

        const getPrediction = await model.detect(imgTensor);
        if (getPrediction.length > 0) {
          setPrediction(getPrediction);
          console.log(getPrediction);
        }

        imgTensor.dispose();
      } else {
        console.error("Video isn't ready yet.");
      }
    }
  };

  useEffect(() => {

    if (model) {
      intervalRef.current = setInterval(detectObjects, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [model]);

  const stopInterval = () => {
    clearInterval(intervalRef.current);
    console.log("Interval stopped.");
  };

  return (
    <section className="p-4 flex min-h-screen bg-zinc-900">
      <div className="justify-center w-full max-w-3xl p-4 bg-zinc-950 rounded-lg">
        <h1 className="text-white text-xl font-bold mb-4">
          Stupid af Simple Object Detection
        </h1>
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{
            facingMode: "environment"
          }}
          className="rounded-md w-full h-3/4"
        />
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => stopInterval()}
            className="text-white bg-zinc-900 px-4 py-2 rounded-md hover:rounded-full hover:bg-zinc-700 transition"
          >
            Stop Interval
          </button>
        </div>
      </div>
      <div className="ml-4 mt-4 p-2 bg-zinc-900 rounded-lg w-full">
          <p className="text-white font-bold">Result:</p>
          {
            prediction.map((object, index) => {
              return (
                <div key={index} className="text-zinc-400">
                  <p>Class: {object.class}</p>
                  <p>Probability: {object.score.toFixed(4) * 100} %</p>
                </div>
              );
            })
          }
        </div>
    </section>
  );
}

export default App;
