import EventSection from "../../EventPage/EventSection";
import FeaturedBlogs from "../Blogs/FeaturedBlogs";
import FAQSection from "../OurStory/FAQSection";
import HomeBanner from "./HomeBanner";
import { Helmet } from "react-helmet";


const HomePage = () => {
    return (
        <div className="pb-28">
            <Helmet>
                <title>Evento - Tickets Made Easy</title>
            </Helmet>
            <HomeBanner />
            <EventSection />
            <FeaturedBlogs />
            <FAQSection />
        </div>
    );
};

export default HomePage;