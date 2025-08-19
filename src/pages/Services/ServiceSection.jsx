import { Link } from 'react-router-dom';
import {
    mdiCardsHeart,
    mdiShieldSun,
    mdiStar,
    mdiMapMarker,
    mdiChartArc,
    mdiPhone,
    mdiCurrencyBdt
} from "@mdi/js";
import Icon from "@mdi/react";
import Newsletter from '../Home/Newsletter/Newsletter';

const ServiceSection = () => {

    // Feature data
    const features = [
        { icon: mdiCardsHeart, title: "Comfortable", description: "If the distribution of letters and words is random, the reader will not be distracted from making." },
        { icon: mdiShieldSun, title: "Extra Security", description: "If the distribution of letters and words is random, the reader will not be distracted from making." },
        { icon: mdiStar, title: "Luxury", description: "If the distribution of letters and words is random, the reader will not be distracted from making." },
        { icon: mdiCurrencyBdt, title: "Best Price", description: "If the distribution of letters and words is random, the reader will not be distracted from making." },
        { icon: mdiMapMarker, title: "Strategic Location", description: "If the distribution of letters and words is random, the reader will not be distracted from making." },
        { icon: mdiChartArc, title: "Efficient", description: "If the distribution of letters and words is random, the reader will not be distracted from making." },
    ];


    return (
        <section className="relative py-8 lg:py-24">
            {/* Features Section */}
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-5 transition-all duration-500 ease-in-out rounded-xl bg-white  overflow-hidden"
                        >
                            <div className="relative overflow-hidden text-transparent">
                                <svg
                                    className="w-32 h-32 fill-green-600/5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                                <div className="absolute top-1/2 -translate-y-1/2 left-[45px] text-green-600 rounded-xl transition-all duration-500 ease-in-out text-4xl flex items-center justify-center">
                                    <Icon path={feature.icon} size={1.5} />
                                </div>
                            </div>
                            <div>
                                <Link
                                    to="/services"
                                    className="text-xl font-medium hover:text-green-600 transition-colors"
                                >
                                    {feature.title}
                                </Link>
                                <p className="text-slate-400 mt-3">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Contact Section */}
            <div className="container mx-auto lg:mt-24 mt-16">
                <div className="grid grid-cols-1 text-center">
                    <h3 className="mb-6 text-2xl md:text-3xl font-medium text-black ">
                        Have Questions? Get in Touch!
                    </h3>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        A great platform to buy, sell, and rent your properties without any agent or commissions.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                        >
                            <Icon path={mdiPhone} size={0.8} className="mr-2" />
                            Contact us
                        </Link>
                    </div>
                </div>
            </div>
            <Newsletter />
        </section>
    );
};

export default ServiceSection;