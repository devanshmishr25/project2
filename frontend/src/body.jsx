import { useState, useRef } from "react";
import Recorder from "./Recorder";
import styles from "./body.module.css";

const Body = () => {
  const camRef = useRef(null);
  const screenRef = useRef(null);

  const [micStream, setMicStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const AllowCamMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (camRef.current) camRef.current.srcObject = stream;
    setMicStream(stream);
  };

  const ShareScreen = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    if (screenRef.current) screenRef.current.srcObject = stream;
    setScreenStream(stream);
  };

  return (
    <div className={styles.body}>
      <button className={styles.button} onClick={AllowCamMic}>Allow Camera & mic</button>
      <button className={styles.button} onClick={ShareScreen}>Share Screen</button>
      <Recorder screenStream={screenStream} micStream={micStream} />

      <div className={styles.videoContainer}>
        <video ref={camRef} autoPlay playsInline className={styles.video}></video>
        <video ref={screenRef} autoPlay playsInline className={styles.video}></video>
      </div>
    </div>
  );
};

export default Body;
