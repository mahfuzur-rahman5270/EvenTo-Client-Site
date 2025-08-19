import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
    TextField,
    Button,
    Alert,
    LinearProgress,
    Typography,
    IconButton,
    Paper,
    Box,
    styled
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const API_KEY = "775567566397378";
const UPLOAD_PRESET = "ml_default"; // Make sure this is configured for unsigned uploads

const VideoDropzone = styled("div")(({ isDragAccept, isDragReject }) => ({
    border: "2px dashed",
    borderColor: isDragReject ? "#ff1744" : isDragAccept ? "#00e676" : "#000000",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: isDragReject ? "#ffebee" : isDragAccept ? "#e8f5e9" : "#f9fafb",
    color: "#000000",
    transition: "all 0.3s ease",
}));

const VideoPreviewWrapper = styled("div")({
    position: "relative",
    width: "100%",
    marginTop: "16px",
    backgroundColor: "#000000",
    borderRadius: "8px",
    overflow: "hidden",
});

export default function VideoUpload() {
    const { handleSubmit, register, reset } = useForm();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [content, setContent] = useState("");

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            setError("Please upload only video files (MP4, WebM, MOV)");
            return;
        }

        const file = acceptedFiles[0];
        if (!file.type.startsWith('video/')) {
            setError("Selected file is not a valid video format");
            return;
        }

        setError(null);
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/webm': ['.webm'],
            'video/quicktime': ['.mov']
        },
        maxFiles: 1,
        maxSize: 100 * 1024 * 1024 // 100MB
    });

    const removeVideo = useCallback(() => {
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoFile(null);
        setVideoPreview(null);
        setError(null);
    }, [videoPreview]);

    const uploadVideo = async (data) => {
        if (!videoFile) {
            setError("Please select a video file first");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", videoFile);
            formData.append("upload_preset", UPLOAD_PRESET);
            formData.append("cloud_name", CLOUD_NAME);
            formData.append("api_key", API_KEY);
            formData.append("resource_type", "video");

            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(progress);
                    },
                }
            );

            // Here you would typically save to your database
            const videoData = {
                title: data.title,
                description: content, // Using the ReactQuill content
                videoUrl: response.data.secure_url,
                publicId: response.data.public_id
            };

            console.log("Upload successful:", videoData);
            // await axios.post('/api/videos', videoData);

            reset();
            setContent("");
            removeVideo();
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.error?.message || "Video upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ mx: "auto", p:  1.6 }}>
            <Helmet>
                <title>Upload Video</title>
            </Helmet>

            <Paper sx={{
                padding: 2,
                width: '100%',
                borderTop: '4px solid transparent', // Required for border-image
                borderRadius: '4px 4px 0 0',
                borderImage: '#16A34A 1', // Apply gradient
                backgroundClip: 'padding-box', // Ensures background doesn't leak into border
            }}
            >
                <Typography variant="h6">
                    Upload a New Video
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit(uploadVideo)}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Title"
                        variant="outlined"
                        margin="normal"
                        {...register("title", { required: "Title is required" })}
                        sx={{ mb: 3 }}
                        error={!!error}
                    />

                    <Box sx={{ mb: 3 }}>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            theme="snow"
                            placeholder="Write your video description here..."
                            style={{ minHeight: 200 }}
                        />
                    </Box>

                    <VideoDropzone
                        {...getRootProps()}
                        isDragAccept={isDragAccept}
                        isDragReject={isDragReject}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <Typography>
                                {isDragReject ? "Unsupported file type" : "Drop the video here"}
                            </Typography>
                        ) : (
                            <Typography>
                                Drag & drop a video here, or click to select
                            </Typography>
                        )}
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                            Supported formats: MP4, WebM, MOV (Max 100MB)
                        </Typography>
                    </VideoDropzone>

                    {videoPreview && (
                        <VideoPreviewWrapper>
                            <video
                                src={videoPreview}
                                controls
                                style={{ width: "100%", display: "block" }}
                            />
                            <IconButton
                                onClick={removeVideo}
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.8)",
                                    },
                                }}
                            >
                                <Delete />
                            </IconButton>
                        </VideoPreviewWrapper>
                    )}

                    {isUploading && (
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={uploadProgress}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                                Uploading: {uploadProgress}%
                            </Typography>
                        </Box>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isUploading || !videoFile}
                        sx={{
                            mt: 3,
                            bgcolor: "#000000",
                            "&:hover": { bgcolor: "#333333" },
                            "&:disabled": { bgcolor: "action.disabled" },
                        }}
                    >
                        {isUploading ? "Uploading..." : "Upload Video"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}