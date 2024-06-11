import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import image1 from '../public/image1.jpeg';
import image2 from '../public/image2.jpeg';
import image3 from '../public/image3.jpeg';

const MovableInputBox = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [inputText, setInputText] = useState('');
  const [printedTexts, setPrintedTexts] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('https://static.vecteezy.com/system/resources/thumbnails/026/365/937/small_2x/beautiful-blurred-green-nature-background-ai-generated-photo.jpg');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const backgroundImages = [image1, image2, image3];

  useEffect(() => {
    // Preload background images to ensure they're loaded before capturing
    backgroundImages.forEach((imgSrc) => {
      const img = new Image();
      img.src = imgSrc;
    });
  }, []);

  const onMouseDown = () => {
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

  const onTouchStart = () => {
    setDragging(true);
    inputRef.current.style.cursor = 'grabbing';
  };

  const onTouchEnd = () => {
    setDragging(false);
    inputRef.current.style.cursor = 'grab';
  };

  const onTouchMove = (e) => {
    if (dragging) {
      const touch = e.touches[0];
      const newX = touch.clientX - inputRef.current.clientWidth / 2;
      const newY = touch.clientY - inputRef.current.clientHeight / 2;
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

    // Temporarily set background color to transparent
    const containerDiv = containerRef.current;
    const originalBackgroundColor = containerDiv.style.backgroundColor;
    containerDiv.style.backgroundColor = 'transparent';

    html2canvas(containerRef.current, { useCORS: true, backgroundColor: null }).then((canvas) => {
      // Restore the display of the input div and background color after screenshot
      inputDiv.style.display = originalDisplay;
      containerDiv.style.backgroundColor = originalBackgroundColor;

      // Create a link element to download the image
      const link = document.createElement('a');
      link.download = 'gift.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleBackgroundChange = (image) => {
    setBackgroundImage(image);
  };

  return (
    <div
      className="flex h-screen"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Left part for input box and printed texts */}
      <div
        ref={containerRef}
        className="w-1/2 relative border-r border-gray-300 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
        }}
      >
        <div
          ref={inputRef}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          className="flex gap-2 absolute p-2 bg-white opacity-70 border border-gray-300 rounded shadow-lg cursor-grab"
          style={{ top: position.y, left: position.x }}
        >
          <input
            type="text"
            className="w-full px-2 py-1 mb-2 border border-gray-300 rounded bg-transparent placeholder-gray-500"
            style={{
              color: 'black',
              fontSize: '14px', // Change this to your desired font size
              fontWeight: 'bold', // Change this to make the font bold
              fontStyle: 'italic', // Change this to make the font italic
              letterSpacing: '1px', // Change this to adjust the letter spacing
              textTransform: 'uppercase', // Change this to transform text to uppercase
            }}
            placeholder="Type something..."
            value={inputText}
            onChange={handleInputChange}
          />
          {/* Signature symbol */}
          <div className="flex justify-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
              onClick={handleButtonClick}
            >
              <path d="M3 3l18 18m-18 0L21 3"></path>
            </svg>
          </div>
        </div>

        {printedTexts.map((printedText, index) => (
          <div
            key={index}
            className="absolute p-2"
            style={{
              top: `calc(${printedText.position.y}px + 12px)`,
              left: `calc(${printedText.position.x}px + 12px)`,
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              fontStyle: 'italic',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {printedText.text}
          </div>
        ))}
      </div>

      {/* Right part for buttons */}
      <div className="w-1/2 flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <label className="font-medium">Select Background:</label>
          <div className="grid grid-cols-3 gap-4">
            {backgroundImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Background ${index + 1}`}
                onClick={() => handleBackgroundChange(image)}
                className={`w-24 h-24 object-cover cursor-pointer border-2 ${
                  backgroundImage === image ? 'border-blue-500' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

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
