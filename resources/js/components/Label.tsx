import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    children: ReactNode;
    required?: boolean;
}

export default function Label({ children, required = false, className = '', ...props }: LabelProps) {
    return (
        <label
            className={`block text-sm font-semibold text-[var(--color-text-primary)] mb-2 ${className}`}
            {...props}
        >
            {children}
            {required && <span className="text-[var(--color-error)] ml-1">*</span>}
        </label>
    );
}
