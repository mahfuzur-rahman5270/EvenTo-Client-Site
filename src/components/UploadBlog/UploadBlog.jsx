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
    styled,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Chip,
    Divider,
    Snackbar,
} from "@mui/material";
import {
    Delete,
    CloudUpload,
    Category,
    Tag,
    FeaturedPlayList,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxios from "../../hooks/useAxios";
import { Helmet } from "react-helmet";

// Cloudinary Configuration
const CLOUD_NAME = "ddh86gfrm";
const UPLOAD_PRESET = "ml_default"; // Ensure this is configured for unsigned uploads in Cloudinary
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const DropzoneWrapper = styled("div")(({ theme }) => ({
    border: `2px dashed black`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(["background-color", "border-color"]),
    "&:hover": {
        borderColor: "black",
        backgroundColor: theme.palette.action.hover,
    },
    "&.active": {
        borderColor: "black",
        backgroundColor: theme.palette.grey[200],
    },
}));

const PreviewWrapper = styled("div")(({ theme }) => ({
    position: "relative",
    display: "inline-block",
    marginTop: theme.spacing(1),
    maxWidth: "100%",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    boxShadow: theme.shadows[1],
}));

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["blockquote", "code-block"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "blockquote",
    "code-block",
    "color",
    "background",
    "align",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadBlog() {
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
        },
    });

    const [axiosSecure] = useAxios();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [alerts, setAlerts] = useState([]); // Store multiple alerts with open state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [categoryError, setCategoryError] = useState(false);
    const [contentError, setContentError] = useState(false);

    const addAlert = (severity, message) => {
        const id = Date.now(); // Unique ID for each alert
        setAlerts(prev => [...prev, { id, severity, message, open: true }]);
    };

    const handleCloseAlert = (id) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.id === id ? { ...alert, open: false } : alert
            )
        );
        // Remove alert after animation
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 300); // Match Snackbar animation duration
    };

    const handleFileChange = useCallback((file) => {
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            addAlert("error", "File size exceeds 5MB limit");
            return;
        }

        if (!file.type.match("image.*")) {
            addAlert("error", "Only image files are allowed");
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }, []);

    const handleRemoveImage = () => {
        URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
        onDrop: (acceptedFiles) => {
            handleFileChange(acceptedFiles[0]);
        },
        onDropRejected: (rejectedFiles) => {
            const file = rejectedFiles[0];
            let message = "File rejected";

            if (file.errors.some(e => e.code === "file-too-large")) {
                message = "File is too large (max 5MB)";
            } else if (file.errors.some(e => e.code === "file-invalid-type")) {
                message = "Invalid file type";
            }

            addAlert("error", message);
        },
    });

    const uploadToCloudinary = async () => {
        if (!imageFile) return null;

        setIsUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setUploadProgress(progress);
                },
            });

            return response.data.secure_url; // Cloudinary returns the secure URL
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            addAlert("error", "Image upload to Cloudinary failed. Please try again.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-");
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const onSubmit = async (data) => {
        // Clear previous alerts
        setAlerts([]);

        // Validate content
        if (!content || content === "<p><br></p>") {
            setContentError(true);
            addAlert("error", "Blog content is required.");
            return;
        } else {
            setContentError(false);
        }

        // Validate category
        if (!category) {
            setCategoryError(true);
            addAlert("error", "Please select a category.");
            return;
        } else {
            setCategoryError(false);
        }

        // Validate image
        if (!imageFile) {
            addAlert("error", "Please select a featured image.");
            return;
        }

        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadToCloudinary();
            if (!imageUrl) return;

            const titleSlug = generateSlug(data.title);

            const newBlog = {
                title: data.title,
                slug: titleSlug,
                content,
                imageUrl,
                category,
                isFeatured,
                tags,
                status: "published",
            };

            // Save blog data to the server
            const response = await axiosSecure.post("/api/blogs", newBlog);
            console.log("Blog created:", response);

            // Reset form
            reset();
            setContent("");
            setCategory("");
            setIsFeatured(false);
            setTags([]);
            handleRemoveImage();
            setUploadProgress(0);

            addAlert("success", "Blog published successfully!");
        } catch (error) {
            console.error("Submission error:", error);
            addAlert("error", "Failed to publish blog. Please try again.");
        }
    };

    return (
        <Box sx={{ padding: { xs: 1, lg: 2 } }}>
            <Helmet>
                <title>New Blog - Evento</title>
                <meta name="description" content="Create a new blog post" />
            </Helmet>

            <Paper elevation={2} sx={{ padding: { xs: 0.5, lg: 3 } }}>
                {/* Snackbar Alerts */}
                {alerts.map((alert) => (
                    <Snackbar
                        key={alert.id}
                        open={alert.open}
                        autoHideDuration={6000}
                        onClose={() => handleCloseAlert(alert.id)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={() => handleCloseAlert(alert.id)}
                            severity={alert.severity}
                            sx={{
                                width: '100%',
                                backgroundColor:
                                    alert.severity === 'error' ? '' :
                                        alert.severity === 'success' ? '' :
                                            alert.severity === 'warning' ? '' : '',
                                color: alert.severity === 'success' ? '' : undefined,
                            }}
                        >
                            {alert.message}
                        </Alert>
                    </Snackbar>
                ))}

                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                        fontWeight: 'semibold',
                        color: 'black',
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    Create New Blog Post
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Blog Title"
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    {...register("title", {
                                        required: "Title is required",
                                        minLength: {
                                            value: 5,
                                            message: "Title must be at least 5 characters",
                                        },
                                        maxLength: {
                                            value: 120,
                                            message: "Title must not exceed 120 characters",
                                        },
                                    })}
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'black' },
                                            '&:hover fieldset': { borderColor: 'black' },
                                            '&.Mui-focused fieldset': { borderColor: 'black' },
                                        },
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        color: 'black',
                                    }}
                                >
                                    Content {contentError && (
                                        <Typography variant="caption" color="black">
                                            (required)
                                        </Typography>
                                    )}
                                </Typography>
                                <ReactQuill
                                    value={content}
                                    onChange={(value) => {
                                        setContent(value);
                                        if (value && value !== "<p><br></p>") {
                                            setContentError(false);
                                        }
                                    }}
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Write your blog content here..."
                                    style={{
                                        minHeight: 300,
                                        backgroundColor: "#fff",
                                        borderRadius: "4px",
                                        fontSize: '0.875rem',
                                        border: '1px solid black',
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        color: 'black',
                                    }}
                                >
                                    <CloudUpload fontSize="small" sx={{ color: 'black' }} /> Featured Image
                                </Typography>
                                <DropzoneWrapper
                                    {...getRootProps()}
                                    className={isDragActive ? "active" : ""}
                                >
                                    <input {...getInputProps()} />
                                    <Typography variant="body2" sx={{ mb: 1, color: 'black' }}>
                                        {isDragActive
                                            ? "Drop the image here"
                                            : "Drag & drop an image here, or click to select"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'black' }}>
                                        Recommended size: 1200x630px • Max file size: 5MB
                                    </Typography>
                                </DropzoneWrapper>

                                {imagePreview && (
                                    <Box sx={{ mt: 2 }}>
                                        <PreviewWrapper>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{
                                                    width: "100%",
                                                    maxHeight: 250,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <IconButton
                                                onClick={handleRemoveImage}
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 4,
                                                    right: 4,
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    "&:hover": {
                                                        backgroundColor: "black",
                                                    },
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </PreviewWrapper>
                                    </Box>
                                )}

                                {isUploading && (
                                    <Box sx={{ mt: 2 }}>
                                        <LinearProgress color="success" />
                                        <Typography
                                            variant="caption"
                                            align="center"
                                            sx={{ mt: 0.5, color: 'black' }}
                                        >
                                            Uploading: {uploadProgress}%
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        color: 'black',
                                    }}
                                >
                                    <Category fontSize="small" sx={{ color: 'black' }} /> Blog Settings
                                </Typography>

                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                    <InputLabel sx={{ color: 'black' }}>
                                        Category {categoryError && "(required)"}
                                    </InputLabel>
                                    <Select
                                        value={category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            if (e.target.value) {
                                                setCategoryError(false);
                                            }
                                        }}
                                        label={`Category ${categoryError ? "(required)" : ""}`}
                                        error={categoryError}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                        }}
                                    >
                                        <MenuItem value="classical">Classical Music</MenuItem>
                                        <MenuItem value="jazz">Jazz</MenuItem>
                                        <MenuItem value="rock">Rock</MenuItem>
                                        <MenuItem value="pop">Pop</MenuItem>
                                        <MenuItem value="hiphop">Hip-Hop</MenuItem>
                                        <MenuItem value="electronic">Electronic Music</MenuItem>
                                        <MenuItem value="folk">Folk Music</MenuItem>
                                        <MenuItem value="musicproduction">Music Production</MenuItem>
                                    </Select>
                                </FormControl>

                                <Divider sx={{ my: 2, backgroundColor: 'black' }} />

                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        color: 'black',
                                    }}
                                >
                                    <Tag fontSize="small" sx={{ color: 'black' }} /> Tags
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                                    <TextField
                                        label="Add tag"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: 'black' },
                                                '&:hover fieldset': { borderColor: 'black' },
                                                '&.Mui-focused fieldset': { borderColor: 'black' },
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleAddTag}
                                        disabled={!tagInput.trim()}
                                        size="small"
                                        sx={{
                                            borderColor: 'black',
                                            color: 'black',
                                            '&:hover': {
                                                borderColor: 'black',
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                            },
                                        }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                                    {tags.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            onDelete={() => handleRemoveTag(tag)}
                                            size="small"
                                            sx={{ borderColor: 'black', color: 'black' }}
                                        />
                                    ))}
                                </Box>

                                <Divider sx={{ my: 2, backgroundColor: 'black' }} />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.checked)}
                                            sx={{
                                                color: 'black',
                                                '&.Mui-checked': {
                                                    color: 'black',
                                                },
                                            }}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <FeaturedPlayList fontSize="small" sx={{ color: 'black' }} />
                                            <Typography variant="body2" sx={{ color: 'black' }}>
                                                Feature this post
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mb: 0.5 }}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2,
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => {
                                reset();
                                setContent("");
                                setCategory("");
                                setIsFeatured(false);
                                setTags([]);
                                handleRemoveImage();
                                setContentError(false);
                                setCategoryError(false);
                                setAlerts([]);
                            }}
                            disabled={isUploading}
                            sx={{
                                borderColor: 'black',
                                color: 'black',
                                '&:hover': {
                                    borderColor: 'black',
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                },
                            }}
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            size="medium"
                            disabled={
                                isUploading ||
                                !isValid ||
                                !content ||
                                content === "<p><br></p>" ||
                                !category ||
                                !imageFile
                            }
                            sx={{
                                minWidth: 120,
                                backgroundColor: 'black',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: 'black',
                                },
                            }}
                        >
                            {isUploading ? "Publishing..." : "Publish"}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}