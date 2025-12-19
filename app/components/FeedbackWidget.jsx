"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function FeedbackWidget() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-1000 rounded-lg bg-black px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-gray-800"
            >
                Report a bug 🐞
            </button>

            {/* Modal Overlay */}
            {open && (

                <div
                    className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50"
                    onClick={() => setOpen(false)}
                >
                    {/* Modal Box */}
                    <div
                        className="h-[80vh] w-[90%] max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute right-3 top-3 rounded-full px-1 py-1 text-sm text-gray-100 hover:text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            <X size={35} />
                        </button>
                        <iframe
                            src="https://docs.google.com/forms/d/e/1FAIpQLSfiLI_lIwwxtbucIJVN-h1JREWW6vlIPCRgCb03Ea1-9YcdBQ/viewform?embedded=true"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                        >
                            Loading…
                        </iframe>
                    </div>
                </div>
            )}
        </>
    );
}