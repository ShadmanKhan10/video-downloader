// import React, { useState, useRef } from "react";
// import "./VideoRecorder.css";

// export default function VideoRecorder() {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [countdown, setCountdown] = useState(10);
//   const [showDownloadButton, setShowDownloadButton] = useState(false);

//   const startRecording = async () => {
//     console.log("video started recording");

//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });
//       videoRef.current.srcObject = mediaStream;
//       setStream(mediaStream);

//       setIsRecording(true);
//       setShowDownloadButton(false);

//       let countdownInterval = setInterval(() => {
//         setCountdown((prevCountdown) => {
//           if (prevCountdown === 1) {
//             clearInterval(countdownInterval);
//             setIsRecording(false);
//             setShowDownloadButton(true);
//           }
//           return prevCountdown - 1;
//         });
//       }, 1000);
//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//     }
//   };

//   const downloadVideo = () => {
//     console.log("Video Downloading");
//     // Implement the download functionality here
//   };

//   return (
//     <div>
//       <video className="video" ref={videoRef} autoPlay></video>
//       <div className="button-container">
//         {!isRecording && !showDownloadButton && (
//           <button className="start-button" onClick={startRecording}>
//             Capture
//           </button>
//         )}
//         {isRecording && <div className="countdown-timer">{countdown}</div>}
//         {showDownloadButton && (
//           <button className="download-button" onClick={downloadVideo}>
//             Download
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import "./VideoRecorder.css";

export default function VideoRecorder() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
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
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoURL = canvas.toDataURL("image/png");
    setPhoto(photoURL);
    setIsPhotoTaken(true);
    stopCamera();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const downloadPhoto = () => {
    const link = document.createElement("a");
    link.href = photo;
    link.download = "captured_photo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <video
        className="video"
        ref={videoRef}
        autoPlay
        style={{ display: isPhotoTaken ? "none" : "block" }}
      ></video>
      <canvas
        ref={canvasRef}
        style={{ display: isPhotoTaken ? "block" : "none", width: "100%" }}
      ></canvas>
      <div className="button-container">
        {!isPhotoTaken && (
          <button className="start-button" onClick={capturePhoto}>
            Capture
          </button>
        )}
        {isPhotoTaken && (
          <button className="download-button" onClick={downloadPhoto}>
            Download
          </button>
        )}
      </div>
    </div>
  );
}
