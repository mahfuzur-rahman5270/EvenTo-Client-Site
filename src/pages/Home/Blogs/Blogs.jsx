import { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    TextField,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Chip,
    Stack,
    Divider,
    InputAdornment,
    Skeleton,
    Checkbox,
    FormControlLabel,
    Pagination,
    IconButton,
    useMediaQuery,
    Drawer,
    Badge,
    Avatar,
    ThemeProvider,
    createTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import SectionTitle from '../../../components/SectionTitleWithBreadcrumb/SectionTitleWithBreadcrumb';

// Custom theme with green primary color
const theme = createTheme({
    palette: {
        primary: {
            main: '#16A34A',
            contrastText: '#fff',
        },
        secondary: {
            main: '#F8F9FA',
            contrastText: '#1F2A44',
        },
        background: {
            paper: '#FFFFFF',
            default: '#F8F9FA',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '5px',
                    textTransform: 'none',
                    fontWeight: 400,
                    padding: '8px 20px',
                    boxShadow: 'none',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 500,
                },
            },
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 700,
        },
        subtitle1: {
            fontWeight: 600,
        },
        body2: {
            fontWeight: 400,
        },
    },
});

// Styled components
const PrimaryButton = styled(Button)(() => ({
    background: '#16A34A',
    color: 'white',
    borderRadius: '5px',
    padding: '8px 20px',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)',
    '&:hover': {
        background: '#13893D',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
    },
}));

const BlogCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '5px',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.background.paper,
}));

const FeaturedChip = styled(Chip)(({ theme }) => ({
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    color: theme.palette.primary.main,
    fontWeight: 600,
    border: `1px solid ${theme.palette.primary.main}`,
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
}));

const FilterDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: '320px',
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[4],
        [theme.breakpoints.down('sm')]: {
            width: '90%',
            maxWidth: '350px',
        },
    },
}));

const StickyFilterContainer = styled(Box)(({ theme }) => ({
    position: 'sticky',
    top: theme.spacing(12),
    overflowY: 'auto',
    paddingRight: theme.spacing(2),
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: theme.palette.grey[100],
        borderRadius: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.primary.main,
        borderRadius: '5px',
    },
    [theme.breakpoints.down('md')]: {
        position: 'static',
        height: 'auto',
        overflowY: 'visible',
    },
}));

const BlogsPage = () => {
    const [axiosSecure] = useAxios();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        categories: [],
        featured: false,
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 9;
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { data: blogs = [], isLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => {
            const res = await axiosSecure.get('/api/blogs');
            return res.data;
        },
    });

    // Get unique categories for filter
    const allCategories = [...new Set(blogs.map((blog) => blog.category))];

    // Filter blogs
    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch =
            blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            filters.categories.length === 0 ||
            filters.categories.includes(blog.category);

        const matchesFeatured = !filters.featured || blog.isFeatured;

        return matchesSearch && matchesCategory && matchesFeatured;
    });

    // Pagination
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const handleCategoryChange = (category) => {
        setFilters((prev) => {
            const newCategories = prev.categories.includes(category)
                ? prev.categories.filter((c) => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories: newCategories };
        });
        setCurrentPage(1);
    };

    const handleFeaturedChange = (e) => {
        setFilters((prev) => ({ ...prev, featured: e.target.checked }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            categories: [],
            featured: false,
        });
        setSearchTerm('');
        setCurrentPage(1);
    };

    const countBlogsByCategory = (category) => {
        return blogs.filter((blog) => blog.category === category).length;
    };

    const countActiveFilters = () => {
        let count = 0;
        if (filters.categories.length > 0) count += filters.categories.length;
        if (filters.featured) count += 1;
        if (searchTerm) count += 1;
        return count;
    };

    const renderFilters = () => (
        <>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                        Filters
                        {countActiveFilters() > 0 && (
                            <Chip
                                label={countActiveFilters()}
                                size="small"
                                color="primary"
                                sx={{ ml: 1, fontWeight: 600, backgroundColor: '#16A34A', color: '#fff' }}
                            />
                        )}
                    </Typography>
                    <Button
                        onClick={resetFilters}
                        variant="text"
                        size="small"
                        disabled={countActiveFilters() === 0}
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                    >
                        Reset
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search blogs..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: '8px',
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                            backgroundColor: '#fff',
                        },
                    }}
                    sx={{ mb: 4 }}
                />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }} color="text.primary">
                        Categories
                    </Typography>
                    <Box sx={{ overflowY: 'auto' }}>
                        {allCategories.map((category) => (
                            <Box
                                key={category}
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={filters.categories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            size="small"
                                            color="primary"
                                        />
                                    }
                                    label={<Typography variant="body2" sx={{ textTransform: 'capitalize' }} fontWeight={500}>{category}</Typography>}
                                />
                                <Chip
                                    label={countBlogsByCategory(category)}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ borderColor: '#16A34A', color: '#16A34A' }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }} color="text.primary">
                        Featured
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.featured}
                                onChange={handleFeaturedChange}
                                size="small"
                                color="primary"
                            />
                        }
                        label={<Typography variant="body2" fontWeight={500}>Featured Blogs Only</Typography>}
                        sx={{ m: 0 }}
                    />
                </Box>
            </Box>
        </>
    );

    return (
        <ThemeProvider theme={theme}>
            <SectionTitle
                title="Blogs"
                bgColor="#F8F9FA"
                paddingY={0}
                titleVariant="h3"
                titleFontWeight="700"
                breadcrumbs={[
                    { label: 'Evento', href: '/' },
                    { label: 'Blogs', href: '/blogs' }
                ]}
            />
            <Box sx={{ mb: 10, px: { xs: 0, md: 15 } }}>
                <Helmet>
                    <title>Blogs - Evento</title>
                    <meta name="description" content="Explore our curated collection of insightful blogs on various topics to enhance your learning journey." />
                </Helmet>

                <Container maxWidth="xl" sx={{ py: 5 }}>
                    <Grid container spacing={4}>
                        {/* Blogs Content */}
                        <Grid item xs={12} md={9} order={{ xs: 2, md: 1 }}>
                            {/* Mobile Filters Button */}
                            {isMobile && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                                    <Badge badgeContent={countActiveFilters()} color="primary">
                                        <PrimaryButton
                                            startIcon={<FilterListIcon />}
                                            onClick={() => setMobileFiltersOpen(true)}
                                        >
                                            Filters
                                        </PrimaryButton>
                                    </Badge>
                                </Box>
                            )}

                            {/* Results count and sort */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 4,
                                p: 3,
                                borderRadius: '12px',
                                backgroundColor: 'background.paper',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }} color="text.primary">
                                    {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} found
                                    {countActiveFilters() > 0 && (
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ ml: 1 }}
                                        >
                                            (filtered)
                                        </Typography>
                                    )}
                                </Typography>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" display="inline" sx={{ mr: 1.5 }}>
                                        Sort by:
                                    </Typography>
                                    <Button
                                        variant="text"
                                        size="small"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                            },
                                        }}
                                    >
                                        Most Recent
                                    </Button>
                                </Box>
                            </Box>

                            {/* Blogs Grid */}
                            {isLoading ? (
                                <Grid container spacing={3}>
                                    {[...Array(6)].map((_, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '12px' }} />
                                            <Box sx={{ pt: 2 }}>
                                                <Skeleton width="80%" height={32} />
                                                <Skeleton width="60%" height={24} sx={{ mt: 1 }} />
                                                <Skeleton width="40%" height={24} sx={{ mt: 1 }} />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : filteredBlogs.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 12,
                                        textAlign: 'center',
                                        backgroundColor: 'background.paper',
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    <Box sx={{ mb: 4 }}>
                                        <Avatar
                                            src="/images/no-results.svg"
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                bgcolor: 'background.default',
                                                '& img': {
                                                    objectFit: 'contain',
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h5" gutterBottom color="text.primary" fontWeight={700}>
                                        No blogs found
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 3, maxWidth: '400px' }}>
                                        We couldn&apos;t find any blogs matching your search. Try adjusting your filters or search term.
                                    </Typography>
                                    <PrimaryButton onClick={resetFilters} sx={{ mt: 2 }}>
                                        Reset All Filters
                                    </PrimaryButton>
                                </Box>
                            ) : (
                                <>
                                    <Grid container spacing={3}>
                                        {currentBlogs.map((blog) => (
                                            <Grid item xs={12} sm={6} md={4} key={blog._id}>
                                                <BlogCard onClick={() => navigate(`/blogs-details/${blog.title_id || blog._id}`)}>
                                                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                                        <CardMedia
                                                            component="img"
                                                            height="180"
                                                            image={blog.imageUrl || '/images/blog-placeholder.jpg'}
                                                            alt={blog.title}
                                                            sx={{
                                                                objectFit: 'cover',
                                                                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                                                height: { xs: '220px', md: '180px' },
                                                                width: '100%',
                                                                transition: 'transform 0.5s ease',
                                                                '&:hover': {
                                                                    transform: 'scale(1.05)',
                                                                },
                                                            }}
                                                        />
                                                        <Box sx={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            height: '50%',
                                                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                                        }} />
                                                        {blog.isFeatured && (
                                                            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                                                                <FeaturedChip
                                                                    icon={<StarIcon sx={{ color: 'primary.main' }} />}
                                                                    label="Featured"
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                                            <CategoryChip
                                                                label={blog.category || 'General'}
                                                                size="small"
                                                                icon={<CategoryIcon sx={{ fontSize: '1rem', color: 'white' }} />}
                                                            />
                                                        </Stack>
                                                        <Typography
                                                            gutterBottom
                                                            variant="h6"
                                                            component="h2"
                                                            sx={{
                                                                fontWeight: 700,
                                                                cursor: 'pointer',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                minHeight: '64px',
                                                                '&:hover': {
                                                                    color: 'primary.main',
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
                                                    </CardContent>
                                                    <Divider />
                                                    <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                                                            <Typography variant="caption" color="primary.main">
                                                                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                }) : 'Unknown Date'}
                                                            </Typography>
                                                        </Box>
                                                        <PrimaryButton size="small">
                                                            Read More
                                                        </PrimaryButton>
                                                    </CardActions>
                                                </BlogCard>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                            <Pagination
                                                count={totalPages}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                                shape="rounded"
                                                showFirstButton
                                                showLastButton
                                                sx={{
                                                    '& .MuiPaginationItem-root': {
                                                        borderRadius: '8px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                                        },
                                                    },
                                                }}
                                            />
                                        </Box>
                                    )}
                                </>
                            )}
                        </Grid>

                        {/* Filters Sidebar */}
                        {!isMobile ? (
                            <Grid item xs={12} md={3} order={{ xs: 1, md: 2 }}>
                                <StickyFilterContainer>
                                    <Box sx={{
                                        p: 4,
                                        borderRadius: '12px',
                                        backgroundColor: 'background.paper',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                        width: '100%',
                                    }}>
                                        {renderFilters()}
                                    </Box>
                                </StickyFilterContainer>
                            </Grid>
                        ) : (
                            <FilterDrawer
                                anchor="left"
                                open={mobileFiltersOpen}
                                onClose={() => setMobileFiltersOpen(false)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, p: 1 }}>
                                    <IconButton onClick={() => setMobileFiltersOpen(false)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                {renderFilters()}
                            </FilterDrawer>
                        )}
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default BlogsPage;