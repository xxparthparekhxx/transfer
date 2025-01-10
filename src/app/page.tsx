"use client";
import { useState, useEffect } from "react";
import { FiUpload, FiDownload, FiFile, FiTrash2 } from "react-icons/fi";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [locked, setLocked] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [isError, setIsError] = useState(false);

  const handleAccess = () => {
    if (accessCode === "V3DS3SA!") {
      setLocked(false);
      setIsError(false);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await fetch("/api/upload");
    const data = await res.json();
    setUploadedFiles(data.files);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    await fetchFiles();
    setLoading(false);
  };

  const handleDownload = async (filename: string) => {
    window.location.href = `/api/download?filename=${filename}`;
  };

  const handleDelete = async (filename: string) => {
    await fetch(`/api/delete?filename=${filename}`, {
      method: "DELETE",
    });
    setFileToDelete(null);
    fetchFiles();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    fetchFiles();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Sesa Goa File Transfer Neewee {"<>"} QED
        </h1>

        <div
          className={`
            mb-8 p-10 border-2 border-dashed rounded-xl 
            ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
            transition-all duration-200 ease-in-out
            flex flex-col items-center justify-center
            cursor-pointer
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FiUpload className="w-12 h-12 text-blue-500 mb-4" />
          <label htmlFor="fileInput" className="cursor-pointer">
            <span className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Choose a file
            </span>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-gray-500 mt-2">or drag and drop here</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiFile className="text-blue-500" />
            Your Files
          </h2>

          <div className="space-y-3">
            {uploadedFiles.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No files uploaded yet
              </p>
            ) : (
              uploadedFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="font-medium text-gray-700">{file}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FiDownload />
                      Download
                    </button>
                    <button
                      onClick={() => setFileToDelete(file)}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {locked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-black">Enter Access Code</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full">
                <input
                  type="password"
                  placeholder="Enter your access code"
                  className={`w-full px-4 py-2 border text-black rounded-lg outline-none transition-all ${
                    isError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
                {isError && (
                  <p className="text-red-500 text-sm mt-2">
                    Invalid access code. Please try again.
                  </p>
                )}
              </div>
              <button
                onClick={handleAccess}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Access Files</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Uploading Files</h3>
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-600">
                Take a deep breath, we are uploading your files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{fileToDelete}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(fileToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
