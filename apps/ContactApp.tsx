import React from 'react';
import { portfolioData } from '../data';
import { Mail, Phone, Linkedin, Github, MessageSquare } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const ContactItem: React.FC<{ icon: React.ReactNode; label: string; value: string; href?: string }> = ({ icon, label, value, href }) => {
    const { toast } = useAppContext();
    const isLink = !!href;

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigator.clipboard.writeText(value);
        toast(`Copied ${label} to clipboard`, 'success');
    }

    const content = (
        <>
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-stone-200/70 dark:bg-stone-800/70 rounded-lg text-amber-600 dark:text-amber-400">
                {icon}
            </div>
            <div>
                <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
                <p className="font-semibold text-stone-800 dark:text-stone-200 break-all">{value}</p>
            </div>
        </>
    );

    const commonClasses = "flex items-center text-left w-full space-x-4 p-3 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors";

    if (isLink) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses}>
                {content}
            </a>
        );
    }

    return (
         <button onClick={handleCopy} className={commonClasses}>
            {content}
        </button>
    );
};

const ContactApp: React.FC = () => {
    const { contact } = portfolioData;

    return (
        <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-4">Get in Touch</h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
                Feel free to reach out! You can click to copy my email or phone, or connect with me on social media.
            </p>
            <div className="space-y-2">
                <ContactItem icon={<Mail size={20} />} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
                <ContactItem icon={<Phone size={20} />} label="Phone" value={contact.phone} />
                <ContactItem icon={<Linkedin size={20} />} label="LinkedIn" value="tanmay-kalbande" href={contact.linkedin} />
                <ContactItem icon={<Github size={20} />} label="GitHub" value="tanmay-kalbande" href={contact.github} />
                <ContactItem icon={<MessageSquare size={20} />} label="WhatsApp" value="Chat with me" href={contact.whatsapp} />
            </div>
        </div>
    );
};

export default ContactApp;