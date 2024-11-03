import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";

import { Button } from "@swc-react/button";
import { Theme } from "@swc-react/theme";
import { FieldLabel } from "@swc-react/field-label";
import { Textfield } from "@swc-react/textfield";

import React, { useState } from "react";
import "./App.css";

const App = ({ addOnUISdk, sandboxProxy }) => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    "https://z3s2s5l67norlebmaspj3c3ro40dqkba.lambda-url.us-west-2.on.aws/";

  async function handleGeneratePoster() {
    setLoading(true);

    sandboxProxy.createBorder();

    const prompt = `Create a picture-only poster showcasing the skyline of ${city} in a steampunk style.`;
    const width = 800;
    const height = 1200;
    const seed = Math.floor(Math.random() * 1000);
    const model = "flux";

    await handleImageAdd(
      `https://image.pollinations.ai/prompt/${encodeURIComponent(
        prompt
      )}?width=${width}&height=${height}&seed=${seed}&model=${model}`
    );

    await handleAddLabels();

    setLoading(false);
  }

  async function handleImageAdd(link) {
    const blob = await getImageBlob(link);
    const croppedBlob = await cropImage(blob, {
      x: 0, // Crop starting X coordinate
      y: 0, // Crop starting Y coordinate
      width: 800, // Width of the crop area
      height: 1100, // Height of the crop area
    });
    const scaledBlob = await scaleImage(croppedBlob, 1400, 1800); // Scale to 1400x1800
    await addOnUISdk.app.document.addImage(scaledBlob, { position: "back" });
  }

  async function cropImage(blob, { x, y, width, height }) {
    const img = await createImageFromBlob(blob);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to crop area dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 1);
    });
  }

  async function scaleImage(blob, newWidth, newHeight) {
    const img = await createImageFromBlob(blob);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the canvas size to the new dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw the image scaled to fit the canvas
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);

    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 1);
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

  async function getImageBlob(url) {
    return await fetch(url).then((response) => response.blob());
  }

  async function handleAddLabels() {
    if (!city) return;

    const apiUrl = `${API_URL}?city=${city}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const temperature = data.current.temp_f + " °F";
      const desc = data.current.condition.text;

      sandboxProxy.createWeatherTextElements(city, temperature, desc);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  return (
    <Theme theme="express" scale="medium" color="light">
      <h1>Poster Generator for Adobe Express</h1>
      <div>
        <FieldLabel htmlFor="city">City:</FieldLabel>
        <Textfield
          type="text"
          id="city"
          placeholder="Enter city"
          value={city}
          onInput={(e) => setCity(e.target.value)}
        />

        <Button
          className="generate-button"
          onClick={handleGeneratePoster}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Poster"}
        </Button>
      </div>
    </Theme>
  );
};

export default App;
