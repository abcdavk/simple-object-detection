import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";

import { useState, useEffect, useRef } from "react";

export function ObjectDetection() {
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

  useEffect(() => {

    if (model) {
      intervalRef.current = setInterval(detectObjects, 200);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [model]);

  const detectObjects = async () => {
    if (model && webcamRef.current) {
      const video = webcamRef.current.video;

      if (video.readyState === 4) {
        const imgTensor = tf.browser.fromPixels(video);

        const getPrediction = await model.detect(imgTensor);
        if (getPrediction.length > 0) {
          setPrediction(getPrediction);
        }

        imgTensor.dispose();
      } else {
        console.error("Video isn't ready yet.");
      }
    }
  };

  return { webcamRef, prediction, intervalRef }
}