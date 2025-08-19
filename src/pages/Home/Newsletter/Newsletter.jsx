

const Newsletter = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        // Add your subscription logic, e.g., API call
        console.log('Subscribed with email:', email);
    };

    return (
        <div className="relative md:mt-24 mt-16">
            <div className="grid grid-cols-1">
                <div className="relative bg-white  lg:px-8 py-10 rounded-lg shadow shadow-slate-200 overflow-hidden">
                    <div className="grid md:grid-cols-2 grid-cols-1 items-center gap-6">
                        <div className="md:text-start text-center z-1">
                            <h3 className="mb-2 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
                                Subscribe to Newsletter!
                            </h3>
                            <p className="text-slate-400 max-w-xl mx-auto">
                                Subscribe to get latest updates and information.
                            </p>
                        </div>
                        <div className="z-1">
                            <form className="relative mx-auto max-w-xl" onSubmit={handleSubmit}>
                                <input
                                    id="subemail"
                                    className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] outline-none text-black  rounded-full bg-white/70 /70 border border-slate-100"
                                    placeholder="Enter your email id.."
                                    type="email"
                                    name="email"
                                />
                                <button
                                    type="submit"
                                    className="h-10 px-6 tracking-wide inline-flex items-center justify-center font-medium bg-green-600 text-white rounded-full absolute top-[1px] end-[1px]"
                                >
                                    Subscribe Now
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="absolute -top-5 -start-5">
                        <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="iconoir-mail lg:text-[150px] text-7xl text-black/5 /5 ltr:-rotate-45 rtl:rotate-45"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <div className="absolute -bottom-5 -end-5">
                        <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="iconoir-edit-pencil lg:text-[150px] text-7xl text-black/5 /5 rtl:-rotate-90"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;