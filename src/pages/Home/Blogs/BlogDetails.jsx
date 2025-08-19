import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardMedia,
    Chip,
    Button,
    Avatar,
    Skeleton,
    Divider,
} from '@mui/material';
import {
    ArrowBack,
    CalendarToday,
    Category,
    Visibility,
} from '@mui/icons-material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAxios from '../../../hooks/useAxios';
import { Helmet } from 'react-helmet';
import { styled } from '@mui/material/styles';
import RecentBlogs from './RecentBlogs';

// Styled components for consistent hero gradient
const GradientButton = styled(Button)(() => ({
    background: '#16A34A',
    color: 'white',
    borderRadius: '5px',
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
        background: 'oklch(52.7% 0.154 150.069)',
    },
}));



const OutlineButton = styled(Button)(() => ({
    border: '1px solid',
    color: '#16A34A',
    borderRadius: '5px',
    padding: '8px 16px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
        backgroundColor: 'rgba(64, 90, 255, 0.05)',
    },
}));

const BlogDetails = () => {
    const { title_id } = useParams();
    const navigate = useNavigate();
    const [axiosSecure] = useAxios();

    // Fetch blog details and increment views
    const { data: blog, isLoading, error } = useQuery({
        queryKey: ['blog', title_id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/api/blogs/${title_id}`);
            await axiosSecure.patch(`/api/blogs/${res.data._id}/views`);
            return res.data;
        },
        retry: 2,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });

    // Fetch all blogs for related posts
    const {
        data: allBlogs = [],
        isLoading: isLoadingAllBlogs,
        error: allBlogsError,
    } = useQuery({
        queryKey: ['all-blogs'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/blogs?limit=100');
            return res.data;
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    // Get 10 random related blogs, excluding current blog
    const getRelatedBlogs = () => {
        if (!blog || !allBlogs.length) return [];
        const filteredBlogs = allBlogs.filter((b) => b._id !== blog._id);
        return [...filteredBlogs]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);
    };

    const relatedBlogs = getRelatedBlogs();

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                    Failed to load blog post
                </Typography>
                <GradientButton
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                >
                    Return to Blogs
                </GradientButton>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', pt: 1 }}>
            <Box sx={{ px: { xs: 0, md: 14 } }}>
                <Container maxWidth="xl" sx={{ py: { xs: 1.5, md: 2 } }}>
                    <Helmet>
                        <title>
                            {blog?.title
                                ? `${blog.title} | Evento`
                                : 'Blog Post | Evento'}
                        </title>
                        <meta
                            name="description"
                            content={
                                blog?.excerpt ||
                                blog?.content?.replace(/<[^>]+>/g, '').substring(0, 160) ||
                                'Read this insightful blog post on Evento'
                            }
                        />
                        <meta property="og:title" content={blog?.title || 'Evento Blog'} />
                        <meta
                            property="og:description"
                            content={
                                blog?.excerpt ||
                                blog?.content?.replace(/<[^>]+>/g, '').substring(0, 160) ||
                                ''
                            }
                        />
                        {blog?.imageUrl && (
                            <meta property="og:image" content={blog.imageUrl} />
                        )}
                    </Helmet>
                    {/* Back Button */}
                    <OutlineButton
                        startIcon={<ArrowBack />}
                        onClick={() => navigate(-1)}
                        size='small'
                        color='success'
                        sx={{
                            mb: 4,
                            textTransform: 'none',
                            fontWeight: 600,
                            color: 'green'
                        }}
                    >
                        All Blogs
                    </OutlineButton>

                    {isLoading ? (
                        <>
                            <Skeleton
                                variant="rectangular"
                                height={400}
                                sx={{ mb: 4, borderRadius: 2 }}
                            />
                            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                                <Skeleton
                                    variant="text"
                                    height={72}
                                    width="80%"
                                    sx={{ mb: 2 }}
                                />
                                <Skeleton
                                    variant="text"
                                    height={42}
                                    width="60%"
                                    sx={{ mb: 4 }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    height={400}
                                    sx={{ borderRadius: 2 }}
                                />
                            </Box>
                        </>
                    ) : blog ? (
                        <>
                            {/* Blog Header */}
                            <Box sx={{ mb: 6 }}>
                                <Typography
                                    sx={{ fontWeight: 700, color: '#1F2937', mb: 1, fontSize: '1.8rem' }}
                                >
                                    {blog.title}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        mb: 2,
                                        color: 'text.secondary',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                By {blog.author?.name || 'Admin'}
                                            </Typography>
                                            {blog.author?.role && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {blog.author.role}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Divider orientation="vertical" flexItem />

                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday
                                            sx={{
                                                mr: 1,
                                                fontSize: '1rem',
                                                color: 'text.secondary',
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Visibility
                                            sx={{
                                                fontSize: '1rem',
                                                color: 'text.secondary',
                                            }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            {blog.views?.toLocaleString() || '0'} views
                                        </Typography>
                                    </Box>

                                    {blog.category && (
                                        <>
                                            <Divider orientation="vertical" flexItem />
                                            <Chip
                                                label={blog.category}
                                                icon={<Category sx={{ fontSize: '1rem' }} />}
                                                size="small"
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    bgcolor: 'background.paper',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover': {
                                                        background:
                                                            '#16A34A',
                                                        color: 'white',
                                                    },
                                                }}
                                            />
                                        </>
                                    )}

                                    {blog.isFeatured && (
                                        <Chip
                                            label="Featured"
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                background:
                                                    '#16A34A',
                                                color: 'white',
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            {/* Featured Image */}
                            <Card
                                sx={{
                                    mb: 3,
                                    borderRadius: 1.5,
                                    overflow: 'hidden',

                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={blog.imageUrl}
                                    alt={blog.title}
                                    sx={{
                                        width: '100%',
                                        height: { xs: 300, md: 550 },
                                        objectFit: 'cover',

                                    }}
                                />
                            </Card>

                            {/* Blog Content */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} lg={8}>
                                    <Box
                                        sx={{
                                            '& .ql-editor': {
                                                fontSize: '1rem',
                                                lineHeight: 1.5,
                                                color: 'text.primary',
                                                fontFamily:
                                                    '"Roboto", "Helvetica", "Arial", sans-serif',
                                                '& h2': {
                                                    fontSize: '2rem',
                                                    fontWeight: 700,
                                                    mt: 6,
                                                    mb: 3,
                                                    letterSpacing: '-0.01em',
                                                },
                                                '& h3': {
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700,
                                                    mt: 5,
                                                    mb: 2,
                                                    color: 'text.primary',
                                                },
                                                '& p': {
                                                    mb: 3,
                                                    color: 'text.secondary',
                                                },
                                                '& img': {
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    borderRadius: 2,
                                                    my: 4,
                                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.05)',
                                                    },
                                                },
                                                '& iframe': {
                                                    width: '100%',
                                                    minHeight: '400px',
                                                    my: 4,
                                                    border: 'none',
                                                    borderRadius: 2,
                                                },
                                                '& blockquote': {
                                                    borderLeft: '4px solid',
                                                    borderColor: '#405aff',
                                                    pl: 3,
                                                    py: 1,
                                                    my: 3,
                                                    backgroundColor: 'background.paper',
                                                    fontStyle: 'italic',
                                                    color: 'text.secondary',
                                                },
                                            },
                                        }}
                                    >
                                        <ReactQuill
                                            value={blog.content}
                                            readOnly={true}
                                            theme="bubble"
                                        />
                                    </Box>

                                    {/* Tags */}
                                    {blog.tags?.length > 0 && (
                                        <Box sx={{ mt: 6 }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    mb: 2,
                                                    fontWeight: 700,
                                                    background:
                                                        '#16A34A',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                Tags:
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {blog.tags.map((tag, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={tag}
                                                        size="small"
                                                        variant="outlined"
                                                        component="a"
                                                        href={`/blogs?tag=${tag}`}
                                                        clickable
                                                        sx={{
                                                            borderColor: 'divider',
                                                            '&:hover': {
                                                                background:
                                                                    '#16A34A',
                                                                color: 'white',
                                                                borderColor: 'transparent',
                                                            },
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}
                                </Grid>

                                {/* Sidebar */}
                                <Grid item xs={12} lg={4}>
                                    <Box
                                        sx={{
                                            position: { lg: 'sticky' },
                                            top: 70,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2.5,
                                        }}
                                    >
                                        {/* About Author */}
                                        <Card
                                            sx={{
                                                p: 3,
                                                borderRadius: 1.5,
                                                boxShadow: 1,
                                                bgcolor: 'background.paper',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mb: 3,
                                                    fontWeight: 700,
                                                    background:
                                                        '#16A34A',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                About the Author
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    mb: 3,
                                                    gap: 2,
                                                }}
                                            >
                                                <Avatar
                                                    src={blog.author?.avatar}
                                                    sx={{
                                                        width: 80,
                                                        height: 80,
                                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                    }}
                                                    alt={blog.author?.name || 'Author'}
                                                />
                                                <Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={700}
                                                        sx={{ color: 'text.primary' }}
                                                    >
                                                        {blog.author?.name || 'Admin'}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {blog.author?.role || 'Content Writer'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{ lineHeight: 1.7, color: 'text.secondary' }}
                                            >
                                                {blog.author?.bio ||
                                                    'An experienced writer with a passion for sharing knowledge and insights.'}
                                            </Typography>
                                        </Card>

                                        {/* Related Blogs */}
                                        <Card
                                            sx={{
                                                p: 3,
                                                borderRadius: 1.5,
                                                boxShadow: 1,
                                                bgcolor: 'background.paper',
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    mb: 3,
                                                    fontWeight: 700,
                                                    background:
                                                        '#16A34A',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}
                                            >
                                                Recommended Posts
                                            </Typography>

                                            {isLoadingAllBlogs ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 3,
                                                    }}
                                                >
                                                    {Array.from({ length: 3 }).map((_, i) => (
                                                        <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                                            <Skeleton
                                                                variant="rectangular"
                                                                width={80}
                                                                height={60}
                                                                sx={{ borderRadius: 1.5 }}
                                                            />
                                                            <Box sx={{ flex: 1 }}>
                                                                <Skeleton
                                                                    variant="text"
                                                                    width="90%"
                                                                    height={20}
                                                                />
                                                                <Skeleton
                                                                    variant="text"
                                                                    width="70%"
                                                                    height={16}
                                                                    sx={{ mt: 1 }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : allBlogsError ? (
                                                <Typography
                                                    variant="body2"
                                                    color="error"
                                                    sx={{ textAlign: 'center', py: 2 }}
                                                >
                                                    Failed to load related posts
                                                </Typography>
                                            ) : relatedBlogs.length > 0 ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 3,
                                                    }}
                                                >
                                                    {relatedBlogs.map((related) => (
                                                        <Box
                                                            key={related._id}
                                                            component={Link}
                                                            to={`/blogs-details/${related.title_id || related._id
                                                                }`}
                                                            sx={{
                                                                display: 'flex',
                                                                gap: 2,
                                                                textDecoration: 'none',
                                                                color: 'inherit',
                                                                bgcolor: 'background.paper',
                                                                p: 2,
                                                                borderRadius: 2,
                                                                transition:
                                                                    'transform 0.2s ease, box-shadow 0.2s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow:
                                                                        '0 4px 15px rgba(0,0,0,0.1)',
                                                                    '& .MuiTypography-root': {
                                                                        background:
                                                                            '#16A34A',
                                                                        WebkitBackgroundClip: 'text',
                                                                        WebkitTextFillColor:
                                                                            'transparent',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            <CardMedia
                                                                component="img"
                                                                image={
                                                                    related.imageUrl ||
                                                                    '/placeholder-blog.jpg'
                                                                }
                                                                alt={related.title}
                                                                sx={{
                                                                    width: 80,
                                                                    height: 60,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 1.5,
                                                                    transition:
                                                                        'transform 0.3s ease-in-out',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.1)',
                                                                    },
                                                                }}
                                                            />
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    fontWeight={700}
                                                                    sx={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        mb: 0.5,
                                                                        color: 'text.primary',
                                                                    }}
                                                                >
                                                                    {related.title}
                                                                </Typography>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        flexWrap: 'wrap',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            whiteSpace: 'nowrap',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        <CalendarToday
                                                                            sx={{
                                                                                fontSize: '0.75rem',
                                                                                mr: 0.5,
                                                                            }}
                                                                        />
                                                                        {new Date(
                                                                            related.createdAt
                                                                        ).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                        })}
                                                                    </Typography>
                                                                    {related.views > 0 && (
                                                                        <>
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="text.secondary"
                                                                                sx={{ lineHeight: 1 }}
                                                                            >
                                                                                •
                                                                            </Typography>
                                                                            <Box
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: 0.5,
                                                                                }}
                                                                            >
                                                                                <Visibility
                                                                                    sx={{
                                                                                        fontSize: '0.75rem',
                                                                                        color: 'text.secondary',
                                                                                    }}
                                                                                />
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    color="text.secondary"
                                                                                >
                                                                                    {related.views.toLocaleString()}
                                                                                </Typography>
                                                                            </Box>
                                                                        </>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ textAlign: 'center', py: 2 }}
                                                >
                                                    No related posts available
                                                </Typography>
                                            )}
                                        </Card>
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    ) : (
                        <Box
                            sx={{
                                py: 8,
                                textAlign: 'center',
                                maxWidth: '600px',
                                mx: 'auto',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    mb: 2,
                                    fontWeight: 700,
                                    background:
                                        '#16A34A',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Blog post not found
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 4 }}
                            >
                                The blog post you&apos;re looking for doesn&apos;t exist or may have been removed.
                            </Typography>
                            <GradientButton
                                onClick={() => navigate('/blogs')}
                                startIcon={<ArrowBack />}
                                sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                            >
                                Browse All Blogs
                            </GradientButton>
                        </Box>
                    )}
                </Container>
            </Box>
            <RecentBlogs />
        </Box>
    );
};

export default BlogDetails;