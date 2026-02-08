import { GENERAL_INFO } from '@/lib/data';

const Footer = async () => {
    return (
        <footer className="text-center pb-5" id="contact">
            <div className="container">
                <p className="text-lg">Have an AI/ML project in mind? Or just want to complain about CUDA drivers?</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}`}
                    className="text-3xl sm:text-4xl font-anton inline-block mt-5 mb-10 hover:underline hover:text-primary transition-colors"
                >
                    {GENERAL_INFO.email}
                </a>

                <div className="">
                    <a
                        href={GENERAL_INFO.linkedIn}
                        target="_blank"
                        className="leading-none text-muted-foreground hover:underline hover:text-white"
                    >
                        Designed & Built by Ankit Sneh (and Stack Overflow)
                        <div className="flex items-center justify-center gap-2 pt-1 text-sm">
                            <span>AI/ML Engineer • DevOps</span>
                        </div>
                    </a>
                    <p className="text-xs text-muted-foreground mt-3">
                        Original design inspiration by{' '}
                        <a
                            href="https://github.com/Tajmirul/portfolio-2.0"
                            target="_blank"
                            className="hover:underline hover:text-white"
                        >
                            Tajmirul Islam
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
