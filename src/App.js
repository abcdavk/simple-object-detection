import Camera from "./Camera";
import { ObjectDetection } from "./components/ObjectDetection";

function App() {
  const { webcamRef, intervalRef, prediction } = ObjectDetection();
  return (
    <div className="bg-zinc-900">
      <section className="flex min-h-screen justify-center">
        <Camera webcamRef={webcamRef} intervalRef={intervalRef} prediction={prediction}/>
        {/* <ResultSide prediction={prediction} /> */}
        
      </section>
    </div>
  );
}

export default App;
