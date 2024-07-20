// import React, { useState, useRef, useEffect } from "react";
// import "./VideoRecorder.css";

// export default function VideoRecorder() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [isPhotoTaken, setIsPhotoTaken] = useState(false);
//   const [photo, setPhoto] = useState(null);

//   useEffect(() => {
//     startCamera();
//   }, []);

//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       });
//       videoRef.current.srcObject = mediaStream;
//       setStream(mediaStream);
//     } catch (error) {
//       console.error("Error accessing the camera:", error);
//     }
//   };

//   const capturePhoto = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const photoURL = canvas.toDataURL("image/png");
//     setPhoto(photoURL);
//     setIsPhotoTaken(true);
//     stopCamera();
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }
//   };

//   const downloadPhoto = () => {
//     const link = document.createElement("a");
//     link.href = photo;
//     link.download = "captured_photo.png";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div>
//       <video
//         className="video"
//         ref={videoRef}
//         autoPlay
//         style={{ display: isPhotoTaken ? "none" : "block" }}
//       ></video>
//       <canvas
//         ref={canvasRef}
//         style={{ display: isPhotoTaken ? "block" : "none", width: "100%" }}
//       ></canvas>
//       <div className="button-container">
//         {!isPhotoTaken && (
//           <button className="start-button" onClick={capturePhoto}>
//             Capture
//           </button>
//         )}
//         {isPhotoTaken && (
//           <button className="download-button" onClick={downloadPhoto}>
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
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [countdown, setCountdown] = useState(10);

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

  const startRecording = () => {
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoBlob(blob);
      setIsRecording(false);
      stopCamera();
    };

    mediaRecorder.start();

    setIsRecording(true);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(countdownInterval);
          mediaRecorder.stop();
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoBlob);
    link.download = "my_snap.webm";
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
        style={{ display: videoBlob ? "none" : "block" }}
      ></video>
      {videoBlob && (
        <video
          className="video"
          autoPlay
          muted
          src={URL.createObjectURL(videoBlob)}
          style={{ display: "block", width: "100%" }}
        ></video>
      )}
      <div className="button-container">
        {!isRecording && !videoBlob && (
          <button className="start-button" onClick={startRecording}>
            Record
          </button>
        )}
        {isRecording && <div className="countdown-timer">{countdown}</div>}
        {videoBlob && (
          <button className="download-button" onClick={downloadVideo}>
            Download
          </button>
        )}
      </div>
    </div>
  );
}
