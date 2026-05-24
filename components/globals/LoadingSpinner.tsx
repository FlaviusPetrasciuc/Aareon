// LoadingOverlay.jsx
import React from 'react';

const LoadingSpinner = ({
    isVisible = true,
    title = "Redirecting you to the next page...",
    subtitle = "Please wait, this will only take a moment",
    spinnerSize = "w-12 h-12",
    onClose = null
}) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-xl">
                <div className={`${spinnerSize} border-4 border-aareon-stone border-t-aareon-bright rounded-full animate-spin`} />
                <p className="text-aareon-headline font-body text-lg">
                    {title}
                </p>

                <p className="text-aareon-body/60 text-sm">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};

export default LoadingSpinner;