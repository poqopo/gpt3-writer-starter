// react
import React, { useRef, useEffect, useState } from "react";

export default function App({ backgroundUrl, setFn }) {
  // useRef
  const canvasRef = useRef(null);
  // getCtx
  const [getCtx, setGetCtx] = useState(null);
  // painting state
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    // canvas useRef
    const canvas = canvasRef.current;
    canvas.width = 250;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000000";
    const backgroundimage = new Image();
    backgroundimage.crossOrigin = "Anonymous";
    backgroundimage.src = backgroundUrl;

    // Make sure the image is loaded first otherwise nothing will draw.
    backgroundimage.onload = function () {
      ctx.drawImage(backgroundimage, 0, 0);
    };
    setGetCtx(ctx);
  }, []);

  const drawFn = (e) => {
    const mouseX = e.nativeEvent.offsetX;
    const mouseY = e.nativeEvent.offsetY;
    if (!painting) {
      getCtx.beginPath();
      getCtx.moveTo(mouseX, mouseY);
    } else {
      getCtx.clearRect(mouseX, mouseY, 30, 30);
    }
  };

  return (
    <div>
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseDown={() => setPainting(true)}
        onMouseUp={() => setPainting(false)}
        onMouseMove={(e) => drawFn(e)}
        onMouseLeave={() => setPainting(false)}
        crossOrigin="anonymous"
      ></canvas>
      <button
        onClick={() => {
          var dataUrl = getCtx.canvas.toDataURL("image/png");
          setFn(dataUrl);
        }}
      >
        Hello!
      </button>
    </div>
  );
}
