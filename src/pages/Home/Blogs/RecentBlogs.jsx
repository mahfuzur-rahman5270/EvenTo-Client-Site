import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import { Link, useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Container,
    Box,
    Button,
    Tooltip,
    Grid,
} from "@mui/material";
import { CalendarToday, Schedule, RemoveRedEye } from "@mui/icons-material";
import DataLoader from "../../../components/CommonLoader/DataLoader";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Icon from "@mdi/react";
import { mdiArrowRight } from "@mdi/js";

// Primary color constant
const PRIMARY_COLOR = '#16A34A';

const RecentBlogs = () => {
    const [axiosSecure] = useAxios();
    const navigate = useNavigate();

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/blogs');
            return res.data;
        },
    });

    // Handle card click (navigate to blog details)
    const handleCardClick = (blogId, e) => {
        if (e.target.closest('button')) return;
        navigate(`/blogs-details/${blogId}`);
        window.scrollTo(0, 0);
    };

    // Calculate read time
    const calculateReadTime = (content) => {
        const textContent = content.replace(/<[^>]*>/g, '');
        const wordsPerMinute = 200;
        const wordCount = textContent.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    // Get 4 random blogs
    const getRandomBlogs = () => {
        if (blogs.length <= 4) return blogs;
        const shuffled = [...blogs].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    };

    const randomBlogs = getRandomBlogs();

    if (isLoading) {
        return <DataLoader />;
    }

    return (
        <Box sx={{ py: 8, px: { xs: 2, md: 14 }, bgcolor: '#F8F9FA' }}>
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                    <div className="grid grid-cols-1 lg:pb-6 text-center">
                        <h4 className="mb-6 md:text-3xl text-3xl md:leading-normal leading-normal font-semibold">
                            Recent Blogs
                        </h4>
                    </div>
                </Box>
                
                {/* Grid of Blog Cards */}
                <Grid container spacing={3} justifyContent="center">
                    {randomBlogs.map((blog) => (
                        <Grid item xs={12} sm={6} md={3} key={blog._id}>
                            <Tooltip>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                        background: 'white',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                    onClick={(e) => handleCardClick(blog.title_id, e)}
                                >
                                    {/* Blog Image */}
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={blog.imageUrl || '/images/blog-placeholder.jpg'}
                                        alt={blog.title}
                                        sx={{
                                            objectFit: 'cover',
                                            height: { xs: '220px', md: '180px' },
                                            width: '100%',
                                        }}
                                    />

                                    {/* Blog Content */}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                By {blog.author || 'Admin'}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="h2"
                                            sx={{
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    color: PRIMARY_COLOR,
                                                },
                                            }}
                                        >
                                            {blog.title || 'Untitled Blog'}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 0,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {(blog.content?.replace(/<[^>]+>/g, '')?.substring(0, 200) || 'No content available') + '...'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(blog.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Schedule fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {calculateReadTime(blog.content)} min read
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <RemoveRedEye fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {blog.views || 0}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>

                                    {/* Action Buttons */}
                                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <a
                                            className="text-slate-400 hover:text-violet-600 duration-500 ease-in-out"
                                            href={blog.title_id}
                                            data-discover="true"
                                            style={{ color: PRIMARY_COLOR }}
                                        >
                                            Read More{' '}
                                            <Icon
                                                path={mdiArrowRight}
                                                size={0.8}
                                                className="align-middle inline-block"
                                                color={PRIMARY_COLOR}
                                            />
                                        </a>
                                    </Box>
                                </Card>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <div className="md:col-span-12 text-center mt-10">
                <Button
                    component={Link}
                    to="/blogs"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        px: 3,
                        borderRadius: '5px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            background: 'oklch(52.7% 0.154 150.069)'
                        },
                        background: '#16A34A',
                        color: 'white',
                    }}
                >
                    See More Blogs
                </Button>
            </div>
        </Box>
    );
};

export default RecentBlogs;