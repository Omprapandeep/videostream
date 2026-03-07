import React from 'react'
import api from '../services/api'
import { useState } from 'react'

const UploadVideo = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setloading] = useState(false);
    const [progress, setProgress] = useState(0); // NEW

    const handlesubmit = async (e) => {
        e.preventDefault();

        setloading(true);

        const formdata = new FormData();

        formdata.append("title", title);
        formdata.append("description", description);
        formdata.append("video", videoFile);

        try {
            const res = await api.post("/videos/upload", formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },

                // NEW (upload progress)
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percent);
                }
            });

            alert("Video uploaded successfully");
            console.log(res.data);

        }
        catch (err) {
            console.log(err);
            alert("Error uploading video");
        }
        finally {
            setloading(false);
            setProgress(0); // reset progress
        }
    }

    return (
        <div className='max-w-lg mx-auto mt-10'>

            <form onSubmit={handlesubmit}>

                <h1 className="text-2xl font-bold mb-5">Upload Video</h1>

                <input
                    type="text"
                    placeholder='Title'
                    className='border p-2 w-full mb-3 rounded'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    placeholder='Description'
                    className='border p-2 w-full mb-3 rounded'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="file"
                    accept="video/*"
                    className='border p-2 w-full mb-3 rounded'
                    onChange={(e) => setVideoFile(e.target.files[0])}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white w-full 
                    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                    {loading ? `Uploading ${progress}%` : "Upload Video"}
                </button>

                {/* Progress Bar */}
                {loading && (
                    <div className="w-full bg-gray-200 rounded mt-4 h-3">
                        <div
                            className="bg-blue-600 h-3 rounded transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

            </form>

        </div>
    )
}

export default UploadVideo