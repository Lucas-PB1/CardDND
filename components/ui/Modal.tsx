import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useModal } from "@/hooks/useModal";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const { overlayRef } = useModal({ isOpen, onClose });

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="absolute inset-0"
                onClick={onClose}
                ref={overlayRef}
            />
            <div className="relative w-full max-w-lg bg-dnd-card border-2 border-dnd-gold rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-dnd-border bg-dnd-parchment/50">
                    <h2 className="text-xl font-bold text-dnd-crimson font-dnd">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-dnd-fg/60 hover:text-dnd-crimson transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
