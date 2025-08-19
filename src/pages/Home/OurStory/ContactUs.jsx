import { Link } from 'react-router-dom';

const ContactUs = () => {
    return (
        <div className='bg-[#F8F9FA]'>
            <div className="container relative lg:my-24 my-16">
                <div className="grid grid-cols-1 text-center">
                    <h3 className="mb-6 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">
                        Have Question ? Get in touch!
                    </h3>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Discover a world of knowledge and opportunities with our online education platform pursue a
                        new career.
                    </p>
                    <div className="mt-6">
                        <Link
                            className="h-10 px-5 tracking-wide inline-flex items-center justify-center font-medium rounded-md bg-violet-600 text-white"
                            to="/contact-us"
                            data-discover="true"
                        >
                            <svg
                                stroke="currentColor"
                                fill="none"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="align-middle me-2"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Contact us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;