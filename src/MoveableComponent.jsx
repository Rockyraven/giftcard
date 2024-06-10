import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const MovableInputBox = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [inputText, setInputText] = useState('');
  const [printedTexts, setPrintedTexts] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Preload background image to ensure it's loaded before capturing
    const img = new Image();
    img.src = 'https://static.vecteezy.com/system/resources/thumbnails/026/365/937/small_2x/beautiful-blurred-green-nature-background-ai-generated-photo.jpg';
  }, []);

  const onMouseDown = (e) => {
    setDragging(true);
    inputRef.current.style.cursor = 'grabbing';
  };

  const onMouseUp = () => {
    setDragging(false);
    inputRef.current.style.cursor = 'grab';
  };

  const onMouseMove = (e) => {
    if (dragging) {
      const newX = position.x + e.movementX;
      const newY = position.y + e.movementY;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleButtonClick = () => {
    setPrintedTexts([...printedTexts, { text: inputText, position }]);
    setInputText(''); // Clear the input box after printing
  };

  const handleDownloadClick = () => {
    // Temporarily hide the input div for screenshot
    const inputDiv = inputRef.current;
    const originalDisplay = inputDiv.style.display;
    inputDiv.style.display = 'none';

    html2canvas(containerRef.current, { useCORS: true }).then((canvas) => {
      // Restore the display of the input div after screenshot
      inputDiv.style.display = originalDisplay;

      // Create a link element to download the image
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="flex h-screen">
      {/* Left part for input box and printed texts */}
      <div
        ref={containerRef}
        className="w-1/2 relative border-r border-gray-300 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/026/365/937/small_2x/beautiful-blurred-green-nature-background-ai-generated-photo.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%'
        }}
      >
        <div
          ref={inputRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="absolute p-4 bg-white border border-gray-300 rounded shadow-lg cursor-grab"
          style={{ top: position.y, left: position.x }}
        >
          <input
            type="text"
            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded"
            placeholder="Type something..."
            value={inputText}
            onChange={handleInputChange}
          />
        </div>
        {printedTexts.map((printedText, index) => (
          <div
            key={index}
            className="absolute p-2 bg-yellow-200 border border-gray-300 rounded"
            style={{ top: printedText.position.y, left: printedText.position.x }}
          >
            {printedText.text}
          </div>
        ))}
      </div>

      {/* Right part for buttons */}
      <div className="w-1/2 flex flex-col justify-center items-center space-y-4">
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Print
        </button>
        <button
          onClick={handleDownloadClick}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default MovableInputBox;