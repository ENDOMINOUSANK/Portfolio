import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ML Resume - Ankit Sneh',
    description: 'Machine Learning Engineer Resume',
    robots: 'noindex, nofollow',
};

const MLResumePage = () => {
    // Replace with actual Google Drive file ID from your folder
    // Go to your Drive file > Get link > Extract ID from: https://drive.google.com/file/d/{FILE_ID}/view
    const FILE_ID = process.env.NEXT_PUBLIC_ML_RESUME_ID || 'YOUR_ML_RESUME_FILE_ID';
    const embedUrl = `https://drive.google.com/file/d/${FILE_ID}/preview`;

    return (
        <div className="w-full h-screen flex flex-col bg-black text-white">
            {/* Header with back link */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-neutral-800 bg-neutral-950">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-sm hover:text-neutral-300 transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">Back to Website</span>
                    <span className="sm:hidden">Back</span>
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    ML Resume
                </h1>
                <div className="w-[58px]" /> {/* Spacer for centering */}
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 w-full overflow-hidden">
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    title="ML Resume"
                    allow="autoplay"
                />
            </div>
        </div>
    );
};

export default MLResumePage;
