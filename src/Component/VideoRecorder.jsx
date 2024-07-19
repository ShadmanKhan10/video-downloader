// import React from "react";

// export default function VideoRecorder() {
//   return (
//     <div>
//       <h1>Video Coming soon...</h1>
//     </div>
//   );
// }

// Component/VideoRecorder.js
import React, { useState, useRef } from "react";
import "./VideoRecorder.css";

export default function VideoRecorder() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    console.log("video started recording");

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing the camera:", error);
    }
    setIsRecording(true);
  };

  const playVideo = () => {
    console.log("video started playing");
  };

  const downloadVideo = () => {
    console.log("Video Downloading");
  };

  return (
    <div>
      {/* <div className="video"> */}
      <video className="video" ref={videoRef} autoPlay></video>
      {/* </div> */}
      <div className="button-container">
        <button
          className="start-button"
          onClick={startRecording}
          disabled={isRecording}
        >
          {!isRecording ? "Start Recording" : "Recording"}
        </button>
        <button
          className="preview-button"
          onClick={playVideo}
          //   disabled={!videoBlob}
        >
          Preview
        </button>
        <button
          className="download-button"
          onClick={downloadVideo}
          //   disabled={!videoBlob}
        >
          Download
        </button>
      </div>
    </div>
  );
}
