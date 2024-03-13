import { useRef, useEffect } from "react";
import Webcam from "react-webcam";

const PUBLISHABLE_ROBOFLOW_API_KEY = "rf_dUauQXUEiAWUQPcfKQp6lmG8zOa2";
const PROJECT_URL = "receiptextractor";
const MODEL_VERSION = "3";

function Roboflow(props) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var inferRunning;
  var model;

  var receipt = {
    callback: () => { }
  }

  const startInfer = () => {
    inferRunning = true;
    window.roboflow
      .auth({
        publishable_key: PUBLISHABLE_ROBOFLOW_API_KEY,
      })
      .load({
        model: PROJECT_URL,
        version: MODEL_VERSION,
        onMetadata: function (m) {
          console.log("model loaded");
        },
      })
      .then((model) => {
        model.configure({
          threshold: 0.75,
          max_objects: 1
        });
        setInterval(() => {
          if (inferRunning) detect(model);
        }, 10);
      });
  };

  useEffect(startInfer, []);

  const stopInfer = () => {
    inferRunning = false;
    if (model) model.teardown();
  };

  const detect = async (model) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      adjustCanvas(videoWidth, videoHeight);

      const detections = await model.detect(webcamRef.current.video);

      const ctx = canvasRef.current.getContext("2d");
      drawBoxes(detections, ctx);
    }
  };

  const adjustCanvas = (w, h) => {
    canvasRef.current.width = w * window.devicePixelRatio;
    canvasRef.current.height = h * window.devicePixelRatio;

    canvasRef.current
      .getContext("2d")
      .scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  const drawBoxes = (detections, ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    detections.forEach((row) => {
      if (true) {
        //video
        var temp = row.bbox;
        temp.class = row.class;
        temp.color = row.color;
        temp.confidence = row.confidence;
        row = temp;
      }

      if (row.confidence < 0) return;

      //dimensions
      var x = row.x - row.width / 2;
      var y = row.y - row.height / 2;
      var w = row.width;
      var h = row.height;

      //box
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "orange";
      ctx.roundRect(x, y, w, h, 15);
      ctx.stroke();

      //shade
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.2;
      ctx.roundRect(x, y, w, h, 15);
      ctx.globalAlpha = 1.0;

      // Draw button for each detection
      drawButton(row, ctx, x, y, w, h);
    });
  };

  const drawButton = (detection, ctx, x, y, w, h) => {
    var buttonWidth = 80;
    var buttonHeight = 30;
    var buttonX = x + w / 2 - buttonWidth / 2;
    var buttonY = y + h - buttonHeight;

    // Clip button to window borders
    buttonX = Math.max(buttonX, 0);
    buttonY = Math.min(buttonY, canvasRef.current.height - buttonHeight);

    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 10);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Receipt", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);

    canvasRef.current.removeEventListener("click", receipt.callback);

    receipt.callback = (event) => {
      var rect = canvasRef.current.getBoundingClientRect();

      // Adjust for scale factor and offset
      var clickX = (event.clientX - rect.left) * (webcamRef.current.video.videoWidth / rect.width);
      var clickY = (event.clientY - rect.top) * (webcamRef.current.video.videoHeight / rect.height);

      console.log("---")
      console.log(clickX)
      console.log(clickY)
      console.log(buttonX)
      console.log(buttonY)
      console.log(buttonWidth)
      console.log(buttonHeight)
      console.log("@@@")

      if (
        //clickX >= buttonX &&
        //clickX <= buttonX + buttonWidth &&
        clickY >= buttonY &&
        clickY <= buttonY + buttonHeight
      ) {
        console.log("Detection Object:", detection);
        scanImage(detection)
      }
    };

    // Add click event listener to the button
    canvasRef.current.addEventListener("click", receipt.callback);
  };

  const scanImage = async (detection) => {
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set the canvas dimensions to match the detection area
    canvas.width = detection.width;
    canvas.height = detection.height;

    // Draw the detection area onto the new canvas
    ctx.drawImage(
      webcamRef.current.video,
      detection.x - detection.width / 2,
      detection.y - detection.height / 2,
      detection.width,
      detection.height,
      0,
      0,
      detection.width,
      detection.height
    );

    // Convert the canvas to a blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg');
    });

    props.parseReceiptImageOnServerAction(blob)

  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        muted={true}
      />
      <canvas
        ref={canvasRef}
      />
    </>
  );
};

export default Roboflow;
