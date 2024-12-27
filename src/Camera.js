import { useState, useEffect, useRef } from "react";

function Camera() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <section className="p-4 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Count: {count}</h1>
        <button
          onClick={() => clearInterval(intervalRef.current)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
        >
          Stop Interval
        </button>
      </div>
    </section>
  );
}

export default Camera;
