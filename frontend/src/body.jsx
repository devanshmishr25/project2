import { useState, useRef } from "react";
import styles from "./body.module.css";

const body = () => {
  const camRef = useRef(null);
  const screenRef = useRef(null);

  const [camActive, setCamActive] = useState(false);
  const [screenActive, setScreenActive] = useState(false);

  const AllowCamMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (camRef.current) {
        camRef.current.srcObject = stream;
      }

      setCamActive(true);
    } catch (err) {
      console.error("Camera/Mic error:", err);
      alert("Camera/Mic permission denied!");
    }
  };
   const ShareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (screenRef.current) {
        screenRef.current.srcObject = screenStream;
      }

      setScreenActive(true);
    } catch (err) {
      console.error("Screen share error:", err);
      alert("Screen share permission denied!");
    }
  };

  return (
    <>
      <div className={styles.body}>
        <button className={styles.button} onClick={AllowCamMic}>Allow Camera & Microphone</button>
        <button className={styles.button}  onClick={ShareScreen}>Share Screen</button>
        <div className={styles.videoContainer}>
          <video
            ref={camRef}
            autoPlay
            playsInline
            className={styles.video}
          ></video>
          <video
            ref={screenRef}
            autoPlay
            playsInline
            className={styles.video}
          ></video>
        </div>
      </div>
    </>
  );
};

export default body;
