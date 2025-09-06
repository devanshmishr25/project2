import { useRef, useState } from "react";
import style from "./Recorder.module.css";

const Recorder = ({ screenStream, micStream }) => {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    if (!(screenStream && micStream)) {
      alert("Allow cam+mic & Start screen share first!");
      return;
    }

    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    if (screenStream.getAudioTracks().length > 0) {
      audioContext.createMediaStreamSource(screenStream).connect(destination);
    }

    if (micStream && micStream.getAudioTracks().length > 0) {
      audioContext.createMediaStreamSource(micStream).connect(destination);
    }

    const combined = new MediaStream([
      ...screenStream.getVideoTracks(), 
      ...destination.stream.getAudioTracks(),
    ]);

    recorderRef.current = new MediaRecorder(combined, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    recorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      chunksRef.current = [];
    };

    recorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      {!recording ? (
        <button className={style.button} onClick={startRecording}>Start Recording</button>
      ) : (
        <button className={style.button} onClick={stopRecording}>Stop & Save</button>
      )}
    </div>
  );
};

export default Recorder;
