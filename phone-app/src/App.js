import { useEffect, useState } from "react";
import EventBus from "event-bus";

import "./App.css";

const eventBus = new EventBus();

const audio = new Audio("/phone-call.mp3");
audio.loop = "true";

function App() {
  const [call, setCall] = useState(null);

  useEffect(() => {
    eventBus.subscribe("phone-call", (data) => {
      setCall(data);
      audio.play();
    });
  }, []);

  const cancelCall = () => {
    setCall(null);
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="App">
      <div className="Header">Phone</div>
      {call ? (
        <div className="CallPanel">
          <div>
            <p>Calling {call?.title}</p>
            <p>{call?.number}</p>
            <User />
          </div>

          <div onClick={cancelCall}>
            <CancelCall />
          </div>
        </div>
      ) : (
        <h3>No active call...</h3>
      )}
    </div>
  );
}

const User = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    fill="white"
    viewBox="0 0 16 16"
  >
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
  </svg>
);

const CancelCall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    fill="red"
    viewBox="0 0 16 16"
  >
    <path d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
  </svg>
);

export default App;
