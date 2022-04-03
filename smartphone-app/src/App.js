import { useEffect, useState, useCallback, useRef } from "react";

import { closeIcon, arrowSwipeIcon, contactsIcon, phoneIcon } from "./Icons";

import "./App.css";

const APPS = [
  { src: "http://localhost:4000", icon: contactsIcon, id: "contacts" },
  { src: "http://localhost:4001", icon: phoneIcon, id: "phone" },
];

function App() {
  const [backgroundApps, setBackgroundApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [messageForIframe, setMessageForIframe] = useState({});
  const [iframeLoaded, setIframeLoaded] = useState({});

  const iFramesRefs = useRef({});

  const runApp = useCallback(
    (nextApp) => {
      setActiveApp(nextApp);

      if (backgroundApps.find((app) => app.id === nextApp.id)) return;

      setBackgroundApps([...backgroundApps, nextApp]);
    },
    [backgroundApps]
  );

  const closeApp = (nextApp) => {
    setBackgroundApps([
      ...backgroundApps.filter((app) => app.id !== nextApp.id),
    ]);
  };

  useEffect(() => {
    Object.keys(messageForIframe).forEach((key) => {
      const targetIframe = iFramesRefs.current[key];
      const targetData = messageForIframe[key];
      const loaded = iframeLoaded[key];

      if (loaded && targetIframe && targetData) {
        targetIframe.contentWindow.postMessage(targetData, "*");
        setMessageForIframe({ [key]: null });
      }
    });
  }, [messageForIframe, iFramesRefs, iframeLoaded]);

  useEffect(() => {
    const handler = ({ data }) => {
      if (data.type === "phone-call") {
        runApp(APPS.find((app) => app.id === "phone"));
        setMessageForIframe({ phone: data });
      }
    };

    window.addEventListener("message", handler);

    return function cleanup() {
      window.removeEventListener("message", handler);
    };
  }, [runApp]);

  return (
    <div className="App">
      {backgroundApps.map((app, i) => {
        const isAppActive = activeApp?.id === app.id;
        return (
          <div key={app.id}>
            <div
              onClick={() => {
                closeApp(app);
                setIframeLoaded({ ...iframeLoaded, [app.id]: false });
              }}
              style={{
                position: "absolute",
                left: `${310 / 2 + 310 * i}px`,
                top: "10px",
              }}
            >
              {closeIcon}
            </div>

            {!isAppActive && (
              <div
                style={{
                  height: "calc(100% - 155px)",
                  position: "absolute",
                  top: "30px",
                  left: `${i * 310}px`,
                  bottom: 0,
                  zIndex: 1,
                  width: "290px",
                  margin: "20px",
                  paddingRight: "20px",
                }}
                onClick={() => {
                  if (!activeApp) setActiveApp(app);
                }}
              ></div>
            )}

            <iframe
              className={`${
                isAppActive
                  ? "ActiveIframeContainer"
                  : "BackgroundIframeContainer"
              }`}
              style={
                isAppActive
                  ? {}
                  : {
                      height: "calc(100% - 155px)",
                      position: "absolute",
                      top: "30px",
                      left: `${i * 310}px`,
                      bottom: 0,
                      width: "290px",
                    }
              }
              onLoad={() =>
                setIframeLoaded({ ...iframeLoaded, [app.id]: true })
              }
              ref={(el) => (iFramesRefs.current[app.id] = el)}
              title={app.id}
              src={app.src}
              allow="autoplay"
            />
          </div>
        );
      })}

      <div className="Footer">
        <div className="Footer__Container">
          <div className="Footer__ContainerApps">
            {APPS.map((app) => (
              <button
                key={app.id}
                className="Footer__ContainerAppIcon"
                onClick={() => runApp(app)}
              >
                {app.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`Swipe ${activeApp ? "Swipe--active" : ""}`}
        onClick={() => setActiveApp(null)}
      >
        <div>{arrowSwipeIcon}</div>
      </div>
    </div>
  );
}

export default App;
