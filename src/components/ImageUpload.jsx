import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload PPE Image</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {result && (
        <div className="mt-4">
          <h3>Detections for {result.filename}</h3>
          <ul>
            {result.detections.map((d, i) => (
              <li key={i}>
                {d.item} - confidence: {d.confidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
