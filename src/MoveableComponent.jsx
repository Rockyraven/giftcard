import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import image1 from '../public/pic.png';
import image2 from '../public/pic1.jpeg';
import { MdOutlineDoneOutline } from "react-icons/md";

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
      // setInputText('');
      const inputDiv = await inputRef.current;
      const originalDisplay = await inputDiv.style.display;
      inputDiv.style.display = await 'none';

      const containerDiv = await containerRef.current;
      const originalBackgroundColor = await containerDiv.style.backgroundColor;
      containerDiv.style.backgroundColor = await 'transparent';

      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        backgroundColor: null,
      });

      inputDiv.style.display = await originalDisplay;
      containerDiv.style.backgroundColor = await originalBackgroundColor;

      const link = await document.createElement('a');
      link.download = await 'gift.png';
      link.href = await canvas.toDataURL('image/png');
      link.click();
      // event.preventDefault();
      
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
          <div className=' flex justify-center'>
            <input
              className="w-4/5 px-1.5 py-1.5 border-[1px] border-gray-300 rounded bg-transparent placeholder-gray-500 text-center"
              style={{
                color: 'yellow',
                fontSize: '14px',
                fontWeight: 'bold',
                fontStyle: 'italic',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
              placeholder="Type something..."
              value={inputText}
              onChange={handleInputChange}
              rows="1"
            />
            
          </div>
        </div>
        <div
          className={`${!imageType ? '-mt-[3rem]' : 'sm:mt-[12rem] mt-[8rem] mr-[2rem]'}`}
          style={{
            color: 'yellow',
            fontSize: '16px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          {printedTexts}
        </div>
      </div>

      <div className=" sm:w-1/2 w-full flex flex-col justify-center items-center space-y-4 mb-4">
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
