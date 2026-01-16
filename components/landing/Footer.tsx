import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="border-t-4 border-dnd-crimson bg-neutral-950 py-16 text-neutral-400">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="mb-6 block h-24 w-24 relative hover:opacity-90 transition-opacity">
                            <Image
                                src="/logo.jpg"
                                alt="CardND Logo"
                                fill
                                sizes="96px"
                                className="object-contain"
                            />
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
                            Craft your legend. Manage your D&D characters with style and precision.
                            Adventure awaits in every card.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-dnd-gold">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/features" className="hover:text-dnd-crimson transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-dnd-crimson transition-colors">Pricing</Link></li>
                            <li><Link href="/changelog" className="hover:text-dnd-crimson transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-dnd-gold">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/privacy" className="hover:text-dnd-crimson transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-dnd-crimson transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-neutral-900 pt-8 text-center text-xs text-neutral-600">
                    <p>&copy; {new Date().getFullYear()} CardND. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
