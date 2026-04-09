import React from 'react'
import api from '../services/api'
import { useState } from 'react'

const UploadVideo = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [loading, setloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragactive, setdragactive] = useState(false);


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
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percent);
                }
            });

            alert("Video uploaded successfully");

        } catch (err) {
            console.log(err);
            alert("Error uploading video");
        } finally {
            setloading(false);
            setProgress(0);
        }
    }


    const handledragover = (e) => {
        e.preventDefault();
        setdragactive(true);
    }

    const handledragleave = (e) => {
        e.preventDefault();
        setdragactive(false);
    }

    const handledrop = (e) => {
        e.preventDefault();
        setdragactive(false);

        const file = e.dataTransfer.files[0];

        if (file && file.type.startsWith("video/")) {
            setVideoFile(file);
        } else {
            alert("Please drop a valid video file");
        }

    }

    return (
        <div className="min-h-[calc(100vh-67px)] flex items-center justify-center px-4 py-8 bg-gray-50">

            <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6 md:p-8">

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
                    Upload Video
                </h1>

                <form onSubmit={handlesubmit} className="space-y-5">

                    {/* Title Input */}
                    <div>
                        <label className="text-sm text-gray-600">Title</label>
                        <input
                            type="text"
                            placeholder='Enter video title'
                            className='mt-1 border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                            rows={2}
                            placeholder='Write something about your video...'
                            className='mt-1 border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="text-sm text-gray-600">Video File</label>

                        <div
                            onDragOver={handledragover}
                            onDragLeave={handledragleave}
                            onDrop={handledrop}
                            onClick={() => document.getElementById("fileinput").click()}
                            className={`mt-2 border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition
                         ${dragactive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                         `}
                        >   {videoFile ? (
                            <div className="w-full">
                                <video
                                    src={URL.createObjectURL(videoFile)}
                                    controls
                                    onClick={(e)=>{e.stopPropagation()}}
                                    className="w-full max-h-64 sm:max-h-72 md:max-h-50 object-contain rounded-lg shadow-sm"
                                />
                                <p className="mt-2 text-sm text-gray-600 truncate">
                                    {videoFile.name}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Icon */}
                                <div className="text-4xl">📁</div>
                                <p className="text-gray-500">
                                    Drag & drop video here or click to upload
                                </p>
                            </>

                        )}

                        </div>

                        {/* Hidden Input */}

                        <input
                            id='fileinput'
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                        />
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-white font-medium transition
                        ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                            }`}
                    >
                        {loading ? `Uploading ${progress}%` : "Upload Video"}
                    </button>

                    {/* Progress Bar */}
                    {loading && (
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}

                </form>
            </div>

        </div>
    )
}

export default UploadVideo