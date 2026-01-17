import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Checkbox({ label, error, className = '', ...props }: CheckboxProps) {
    return (
        <div className="flex items-start">
            <div className="flex items-center h-5">
                <input
                    type="checkbox"
                    className={`h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border-primary)] rounded transition-colors duration-200 ${className}`}
                    {...props}
                />
            </div>
            {label && (
                <div className="ml-3 text-sm">
                    <label htmlFor={props.id || props.name} className="font-medium text-[var(--color-text-primary)] cursor-pointer">
                        {label}
                    </label>
                    {error && (
                        <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
