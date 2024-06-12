import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import image1 from '../public/pic.jpg';
import image2 from '../public/pic1.jpg';

const MovableInputBox = () => {
  const [inputText, setInputText] = useState('');
  const [printedTexts, setPrintedTexts] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(image1);
  const [imageHeight, setImageHeight] = useState('100%');
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [imageType, setImageType] = useState(false);

  const backgroundImages = [image1, image2];

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      const containerWidth = containerRef.current.clientWidth;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const height = containerWidth / aspectRatio;
      setImageHeight(`${height}px`);
    };
  }, [backgroundImage]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleButtonClick = () => {
    setPrintedTexts(inputText);
    setInputText('');
  };

  const handleDownloadClick = async (event) => {
    try {
      setPrintedTexts(inputText);
      const inputDiv = await inputRef.current;
      const originalDisplay = await inputDiv.style.display;
      inputDiv.style.display = await 'none';

      const containerDiv = await containerRef.current;
      const originalBackgroundColor = await containerDiv.style.backgroundColor;
      containerDiv.style.backgroundColor = await 'transparent';

      let scale = 5; // Start with a higher scale
      let imageSize = 0;
      let blob;

      while (imageSize < 10 * 1024 * 1024) { 
        const canvas = await html2canvas(containerDiv, {
          useCORS: true,
          backgroundColor: null,
          scale: scale, // Scaling factor
        });

        inputDiv.style.display = await originalDisplay;
        containerDiv.style.backgroundColor = await originalBackgroundColor;

        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0)); // 1.0 for highest quality
        imageSize = blob.size;

        if (imageSize < 10 * 1024 * 1024) {
          scale += 1;
        }
      }

      const link = await document.createElement('a');
      link.download = 'gift.jpg';
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);  
    } catch (error) {
      console.error('Failed to capture and download the image:', error);
    }
    setPrintedTexts('');
    setInputText('');
  };

  const handleBackgroundChange = (image) => {
    if (image.includes("pic1")) {
      setImageType(true);
    } else {
      setImageType(false);
    }
    setBackgroundImage(image);
  };

  return (
    <div className="flex sm:flex-row flex-col ">
      <div
        ref={containerRef}
        className={`sm:w-1/2 w-full relative border-r border-gray-300 bg-cover bg-center flex ${!imageType ? 'justify-center items-center' : 'justify-end items-center'}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: imageHeight,
        }}
      >
        <div
          ref={inputRef}
          className={`flex absolute p-1 opacity-70 rounded shadow-lg cursor-grab ${printedTexts ? 'hidden' : 'visible'} ${!imageType ? 'sm:-mt-[2rem] -mt-[1rem]' : 'sm:mt-[11rem] mt-[8rem]'}`}
        >
          <div className='flex justify-center'>
            <input
              style={{
                color: '#e2a93f',
                fontSize: '16px',
                fontWeight: 'bold',
                fontStyle: 'italic',
                letterSpacing: '1px',
              }}
              className="w-4/5 px-1.5 py-1.5 border-[1px] border-gray-300 rounded bg-transparent placeholder-gray-500 text-center"
              placeholder="Type something..."
              value={inputText}
              onChange={handleInputChange}
              rows="1"
            />
          </div>
        </div>
        <div
          className={`${!imageType ? '-mt-[3rem]' : 'sm:mt-[12rem] mt-[8rem] mr-[5rem]'}`}
          style={{
            color: '#e2a93f',
            fontSize: '16px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            letterSpacing: '1px',
          }}
        >
          {printedTexts.split(' ').map((word, index) => (
            <div key={index}>{word}</div>
          ))}
        </div>
      </div>

      <div className="sm:w-1/2 w-full flex flex-col justify-center items-center space-y-4 mb-4">
        <div className="flex flex-col items-center space-y-2">
          <label className="font-medium">Select Templates</label>
          <div className="flex justify-center gap-5">
            {backgroundImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Background ${index + 1}`}
                onClick={() => handleBackgroundChange(image)}
                className={`w-24 h-24 object-cover cursor-pointer border-[0.5rem] ${backgroundImage === image ? 'border-blue-500 ' : 'border-gray-300'}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
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
