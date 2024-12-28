export default function ResultSide({ prediction }) {
  return (
    <div className="ml-4 mt-4 p-2 bg-zinc-900 rounded-lg w-full">
      <p className="text-white font-bold">Result:</p>
      {
        prediction.map((object, index) => {
          return (
            <div key={index} className="text-zinc-400">
              {/* <p>Class: {object.class}</p>
              <p>Probability: {object.score.toFixed(4) * 100} %</p>
              <p>x: {object.bbox[0]}, y: {object.bbox[1]}</p>
              <p>width: {object.bbox[2]}, height: {object.bbox[3]}</p> */}
            </div>
          );
        })
      }
    </div>
  )
}