import Camera from "./Camera";
import ResultSide from "./ResultSide";
import { ObjectDetection } from "./components/ObjectDetection";

function App() {
  const { webcamRef, intervalRef, prediction } = ObjectDetection();
  return (
    <section className="p-4 flex min-h-screen bg-zinc-900 justify-center">
      <Camera webcamRef={webcamRef} intervalRef={intervalRef} prediction={prediction}/>
      {/* <ResultSide prediction={prediction} /> */}
    </section>
  );
}

export default App;
