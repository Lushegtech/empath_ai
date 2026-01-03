import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            // Here we will eventually call the API
            // await fetch('/api/capture', ...); 
            // For now, simulate delay
            await new Promise(resolve => setTimeout(resolve, 800));
            onSubmit(email);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[#F1ECE2]/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="relative w-full max-w-md"
                    >
                        {/* Vellum Border Decor */}
                        <div className="absolute inset-0 rounded-xl border border-[#10302A]/10 pointer-events-none"></div>
                        <div className="absolute inset-[3px] rounded-[10px] border border-[#10302A]/10 pointer-events-none"></div>

                        <div className="relative bg-[#F9F7F5] shadow-2xl p-8 rounded-xl border border-[#10302A]/5 overflow-hidden">
                            {/* Decorative Gradient */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9C5B42] to-transparent opacity-50"></div>

                            <div className="text-center mb-8">
                                <div className="w-12 h-12 rounded-full bg-[#10302A]/5 flex items-center justify-center mx-auto mb-4 text-[#9C5B42]">
                                    <span className="material-symbols-outlined">lock_open</span>
                                </div>
                                <h2 className="text-2xl font-serif text-[#10302A] mb-2" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                                    Unlock Your Full Report
                                </h2>
                                <p className="text-xs font-mono text-[#10302A]/60 leading-relaxed max-w-xs mx-auto">
                                    Enter your email to save your results and download your personalized PDF analysis.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 px-4 bg-[#10302A]/5 border border-[#10302A]/10 rounded focus:outline-none focus:border-[#9C5B42] focus:bg-white font-mono text-sm text-[#10302A] transition-all"
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <p className="text-[#9C5B42] text-[10px] font-mono uppercase tracking-wide text-center">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-[#10302A] text-[#F1ECE2] rounded flex items-center justify-center gap-2 hover:bg-[#10302A]/90 transition-colors disabled:opacity-70 disabled:cursor-wait group relative overflow-hidden"
                                >
                                    {isLoading ? (
                                        <span className="font-mono text-xs uppercase tracking-widest animate-pulse">Unlocking...</span>
                                    ) : (
                                        <>
                                            <span className="font-mono text-xs font-bold uppercase tracking-widest relative z-10">Reveal Analysis</span>
                                            <div className="absolute inset-0 bg-[#9C5B42] transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 ease-out" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <button
                                onClick={onClose}
                                className="w-full text-center mt-6 text-[10px] font-mono uppercase tracking-widest text-[#10302A]/30 hover:text-[#10302A]/60 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmailCaptureModal;
