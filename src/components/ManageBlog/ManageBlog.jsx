import { useState, useCallback, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Grid,
  Box,
  Typography,
  styled,
  LinearProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  Delete,
  CloudUpload,
  Close,
  Category,
  LocalOffer,
  Title,
  Description,
  Settings,
  FeaturedPlayList,
  Search,
  CheckCircleOutline,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const CATEGORIES = ["technology", "business", "education", "marketing"];

// Styled Components
const HiddenInput = styled("input")({
  display: "none",
});

const PreviewWrapper = styled("div")({
  position: "relative",
  display: "inline-block",
  marginTop: "8px",
  maxWidth: "100%",
});

// Quill Editor Configuration
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

export default function ManageBlog() {
  const [axiosSecure] = useAxios();
  const { data: blogs = [], isLoading, refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/api/blogs");
      return res.data;
    },
  });

  const [editBlog, setEditBlog] = useState(null);
  const [originalBlog, setOriginalBlog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [contentError, setContentError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Handle alert close
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Filter blogs by search term
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // Handlers
  const handleEditClick = (blog) => {
    setEditBlog({
      ...blog,
      tags: blog.tags ? blog.tags.join(", ") : "",
    });
    setOriginalBlog(blog);
    setImageFile(null);
    setImagePreview(blog.imageUrl);
    setContentError(false);
    setCategoryError(false);
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setAlert({
        open: true,
        severity: "error",
        message: "File size exceeds 5MB limit",
      });
      return;
    }

    if (!file.type.match("image.*")) {
      setAlert({
        open: true,
        severity: "error",
        message: "Only image files are allowed",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const removeImagePreview = () => {
    URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadToS3 = async () => {
    if (!imageFile) return null;

    setIsProcessing(true);
    setProgress(0);

    try {
      const fileName = `blog-images/${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 15)}.${imageFile.name.split(".").pop()}`;

      const presignedUrlResponse = await axiosSecure.get(
        "/api/s3/generate-presigned-url",
        {
          params: {
            fileName,
            fileType: imageFile.type,
            uploadType: "image",
          },
        }
      );

      const { url, key } = presignedUrlResponse.data;

      await axios.put(url, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
        onUploadProgress: (event) => {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setProgress(percentage);
        },
      });

      return key;
    } catch (error) {
      console.error("Upload error:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Image upload failed. Please try again.",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const getChangedFields = (original, updated) => {
    const changes = {};

    if (original.title !== updated.title) changes.title = updated.title;
    if (original.content !== updated.content) changes.content = updated.content;
    if (original.category !== updated.category) changes.category = updated.category;
    if (original.isFeatured !== updated.isFeatured) changes.isFeatured = updated.isFeatured;

    const originalTags = original.tags ? original.tags : [];
    const updatedTags = updated.tags
      ? updated.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
      : [];

    if (JSON.stringify(originalTags) !== JSON.stringify(updatedTags)) {
      changes.tags = updatedTags;
    }

    return changes;
  };

  const handleUpdate = async () => {
    if (!editBlog || !originalBlog) return;

    if (!editBlog.title) {
      setAlert({
        open: true,
        severity: "error",
        message: "Title is required.",
      });
      return;
    }

    if (!editBlog.content || editBlog.content === "<p><br></p>") {
      setContentError(true);
      setAlert({
        open: true,
        severity: "error",
        message: "Content is required.",
      });
      return;
    } else {
      setContentError(false);
    }

    if (!editBlog.category) {
      setCategoryError(true);
      setAlert({
        open: true,
        severity: "error",
        message: "Category is required.",
      });
      return;
    } else {
      setCategoryError(false);
    }

    setIsProcessing(true);
    try {
      const changedFields = getChangedFields(originalBlog, editBlog);
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToS3();
        if (!imageUrl) return;
        changedFields.imageUrl = imageUrl;
      }

      if (Object.keys(changedFields).length > 0 || imageFile) {
        await axiosSecure.patch(`/api/blogs/${editBlog._id}`, changedFields);
        refetch();
        setAlert({
          open: true,
          severity: "success",
          message: "Blog updated successfully!",
        });
      } else {
        setAlert({
          open: true,
          severity: "info",
          message: "No changes detected.",
        });
      }

      setEditBlog(null);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Update failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (blogId) => {
    setIsProcessing(true);
    try {
      await axiosSecure.delete(`/api/blogs/${blogId}`);
      refetch();
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 6000);
    } catch (error) {
      console.error("Delete error:", error);
      setAlert({
        open: true,
        severity: "error",
        message: "Delete failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Responsive table content
  const renderTableContent = () => (
    <Table aria-label="blog table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
            Title
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Category
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
            Tags
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
            Created
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
            Views
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Featured
          </TableCell>
          <TableCell sx={{ fontWeight: 600, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredBlogs
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((blog) => (
            <TableRow
              key={blog._id}
              sx={{
                "&:hover": { backgroundColor: "#f5f5f5" },
                cursor: "pointer",
              }}
            >
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
                {blog.title}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                <Chip
                  label={blog.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<Category fontSize="small" />}
                />
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {blog.tags?.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      icon={<LocalOffer fontSize="small" />}
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
                {new Date(blog.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" }, display: { xs: "none", sm: "table-cell" } }}>
                {blog.views || 0}
              </TableCell>
              <TableCell sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                {blog.isFeatured ? (
                  <Chip
                    label="Featured"
                    size="small"
                    color="secondary"
                    icon={<FeaturedPlayList fontSize="small" />}
                  />
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(blog)}
                    aria-label="edit"
                    size="small"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(blog._id)}
                    aria-label="delete"
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );

  // Card-based content for mobile
  const renderCardContent = () => (
    <Box sx={{ display: { xs: "block", sm: "none" }, mt: 2 }}>
      {filteredBlogs
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((blog) => (
          <Card
            key={blog._id}
            sx={{
              mb: 2,
              boxShadow: 2,
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: "1rem", mb: 1 }}>
                {blog.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Chip
                  label={blog.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  icon={<Category fontSize="small" />}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Created: {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Views: {blog.views || 0}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {blog.isFeatured ? (
                  <Chip
                    label="Featured"
                    size="small"
                    color="secondary"
                    icon={<FeaturedPlayList fontSize="small" />}
                  />
                ) : (
                  "-"
                )}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEditClick(blog)}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(blog._id)}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
        <LinearProgress color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, minHeight: "100vh" }}>
      <Helmet>
        <title>Manage Blogs - Evento</title>
      </Helmet>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={alert.severity}
          onClose={handleAlertClose}
          sx={{ width: "100%", fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
          variant="filled"
          size="small"
        >
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Delete Success Alert */}
      {showDeleteSuccess && (
        <Alert
          icon={<CheckCircleOutline fontSize="inherit" />}
          sx={{ mb: 2, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
        >
          Here is a gentle confirmation that your action was successful.
        </Alert>
      )}
      <Paper sx={{ borderRadius: 2, boxShadow: 1, p: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: 2,
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: "semibold", color: "#1a237e", mb: 0.5 }}>
              Manage Blogs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {blogs.length} blog posts published
            </Typography>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: { xs: "100%", sm: 400 },
              "& .MuiInputBase-input": { fontSize: { xs: "0.7rem", sm: "0.875rem" } },
            }}
          />
        </Box>
        {filteredBlogs.length === 0 && !isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Alert
              severity="info"
              sx={{ width: "100%", maxWidth: 500, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
              size="small"
            >
              No blog posts found. Create your first blog post to get started!
            </Alert>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ display: { xs: "none", sm: "block" } }}>
              {renderTableContent()}
            </TableContainer>
            {renderCardContent()}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredBlogs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                },
              }}
            />
          </>
        )}
      </Paper>

      {/* Edit Blog Dialog */}
      {editBlog && (
        <Dialog
          open={Boolean(editBlog)}
          onClose={() => !isProcessing && setEditBlog(null)}
          maxWidth="lg"
          fullWidth
          sx={{
            "& .MuiDialog-paper": {
              maxHeight: { xs: "95vh", sm: "90vh" },
              borderRadius: 2,
              width: { xs: "100%", sm: "90%", md: "80%" },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
              py: { xs: 1, sm: 1.5 },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Edit sx={{ mr: 1, fontSize: { xs: "1rem", sm: "1.2rem" } }} />
              <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}>
                Edit Blog Post
              </Typography>
            </Box>
            <IconButton
              onClick={() => !isProcessing && setEditBlog(null)}
              disabled={isProcessing}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 2, pb: 3, overflowY: "auto" }}>
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {/* Left Column - Main Content */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Blog Title *"
                  size="small"
                  value={editBlog.title}
                  onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                  margin="normal"
                  error={!editBlog.title}
                  helperText={!editBlog.title ? "Title is required" : ""}
                  InputProps={{
                    startAdornment: (
                      <Title sx={{ mr: 1, color: "action.active", fontSize: { xs: "0.9rem", sm: "1rem" } }} />
                    ),
                  }}
                  sx={{ "& .MuiInputBase-input": { fontSize: { xs: "0.7rem", sm: "0.875rem" } } }}
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 500,
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    }}
                  >
                    <Description sx={{ mr: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }} />
                    Content *
                  </Typography>
                  <ReactQuill
                    value={editBlog.content}
                    onChange={(value) => setEditBlog({ ...editBlog, content: value })}
                    modules={modules}
                    formats={formats}
                    style={{
                      height: { xs: 200, sm: 280 },
                      backgroundColor: "#fff",
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    }}
                  />
                  {contentError && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: { xs: 5, sm: 4.5 }, fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                    >
                      Content is required
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Right Column - Settings */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 500,
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    }}
                  >
                    <Settings sx={{ mr: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }} />
                    Blog Settings
                  </Typography>

                  <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}>
                      Category *
                    </InputLabel>
                    <Select
                      value={editBlog.category}
                      onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })}
                      label="Category *"
                      error={categoryError}
                      sx={{ "& .MuiSelect-select": { fontSize: { xs: "0.7rem", sm: "0.875rem" } } }}
                    >
                      {CATEGORIES.map((category) => (
                        <MenuItem
                          key={category}
                          value={category}
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                    {categoryError && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                      >
                        Category is required
                      </Typography>
                    )}
                  </FormControl>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tags (comma separated)"
                    value={editBlog.tags}
                    onChange={(e) => setEditBlog({ ...editBlog, tags: e.target.value })}
                    sx={{ mb: 2, "& .MuiInputBase-input": { fontSize: { xs: "0.7rem", sm: "0.875rem" } } }}
                    InputProps={{
                      startAdornment: (
                        <LocalOffer sx={{ mr: 1, color: "action.active", fontSize: { xs: "0.9rem", sm: "1rem" } }} />
                      ),
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={editBlog.isFeatured || false}
                        onChange={(e) =>
                          setEditBlog({
                            ...editBlog,
                            isFeatured: e.target.checked,
                          })
                        }
                        color="primary"
                      />
                    }
                    label="Feature this post"
                    sx={{ mb: 2, "& .MuiTypography-root": { fontSize: { xs: "0.7rem", sm: "0.875rem" } } }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 500,
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    }}
                  >
                    <CloudUpload sx={{ mr: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }} />
                    Featured Image
                  </Typography>

                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUpload fontSize="small" />}
                    sx={{
                      mb: 2,
                      textTransform: "none",
                      fontSize: { xs: "0.7rem", sm: "0.875rem" },
                      py: { xs: 0.5, sm: 0.75 },
                    }}
                    disabled={isProcessing}
                    size="small"
                  >
                    Upload New Image
                    <HiddenInput type="file" accept="image/*" onChange={handleImageChange} />
                  </Button>

                  {imagePreview ? (
                    <PreviewWrapper>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: { xs: 120, sm: 180 },
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        onClick={removeImagePreview}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                        }}
                        disabled={isProcessing}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </PreviewWrapper>
                  ) : (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                    >
                      No image selected
                    </Typography>
                  )}

                  {isProcessing && (
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress variant="determinate" value={progress} />
                      <Typography
                        variant="caption"
                        display="block"
                        textAlign="center"
                        sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                      >
                        {progress}% uploaded
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              borderTop: "1px solid rgba(0,0,0,0.12)",
              p: { xs: 1, sm: 1.5 },
            }}
          >
            <Button
              onClick={() => setEditBlog(null)}
              variant="outlined"
              color="inherit"
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 1.5, sm: 2 },
              }}
              disabled={isProcessing}
              size="small"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                isProcessing ||
                !editBlog?.title ||
                !editBlog?.content ||
                editBlog?.content === "<p><br></p>" ||
                !editBlog?.category
              }
              variant="contained"
              sx={{
                bgcolor: "#000000",
                textTransform: "none",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 2, sm: 3 },
                "&:hover": { bgcolor: "#333333" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(0, 0, 0, 0.12)",
                  color: "rgba(0, 0, 0, 0.26)",
                },
              }}
              size="small"
            >
              {isProcessing ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Update Blog"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}