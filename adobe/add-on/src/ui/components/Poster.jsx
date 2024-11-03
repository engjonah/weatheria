import React, { useContext, useEffect, useState } from "react";

const Poster = (addOnUISdk) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchSingleImage();
  }, [loading]);

  /**
   * Fetch a single image from the API.
   */
  async function fetchSingleImage() {
    setLoading(true);
    try {
      setImage({ link: 'https://image.pollinations.ai/prompt/london-united-kingdom-skyline-steampunk-vintage-filter', name: 'hi', id: '1' });
    } catch (error) {
      console.error("Error fetching the image:", error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle image click to add it to the document.
   */
  async function handleImageAdd() {
    if (image) {
      const blob = await getImageBlob(image.link);
      const croppedBlob = await cropImage(blob, { x: 50, y: 50, width: 400, height: 600 }); // Adjust cropping dimensions as needed
      addOnUISdk.addOnUISdk.app.document.addImage(croppedBlob);
    }
  }

  async function cropImage(blob, { x, y, width, height }) {
    const img = await createImageFromBlob(blob);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the canvas dimensions to the cropped area
    canvas.width = width;
    canvas.height = height;

    // Draw the image on the canvas, cropping it
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    // Convert the canvas to a blob
    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jfif", 1); // You can change the format as needed
    });
  }

  function createImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  /**
   * Fetch the image blob from a URL.
   */
  async function getImageBlob(url) {
    return await fetch(url).then(response => response.blob());
  }

  return (
    <>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        image && (
          <div className="single-image">
            <img src={image.link} alt={image.name} onClick={handleImageAdd} />
          </div>
        )
      )}
    </>
  );
};

export default Poster;
