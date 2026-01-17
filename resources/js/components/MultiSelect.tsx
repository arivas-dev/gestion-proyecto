import { useState } from 'react';
import Label from './Label';
import Checkbox from './Checkbox';

interface Option {
    value: string | number;
    label: string;
}

interface MultiSelectProps {
    id?: string;
    name?: string;
    label?: string;
    error?: string;
    helperText?: string;
    options: Option[];
    value: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    className?: string;
}

export default function MultiSelect({
    id,
    name,
    label,
    error,
    helperText,
    options,
    value,
    onChange,
    placeholder,
    className = '',
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (optionValue: string) => {
        const stringValue = optionValue.toString();
        if (value.includes(stringValue)) {
            onChange(value.filter(v => v !== stringValue));
        } else {
            onChange([...value, stringValue]);
        }
    };

    const selectedLabels = options
        .filter(opt => value.includes(opt.value.toString()))
        .map(opt => opt.label)
        .join(', ');

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <Label htmlFor={id || name} required={false}>
                    {label}
                </Label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`block w-full rounded-lg border-[var(--color-border-primary)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-colors duration-200 px-4 py-2.5 bg-[var(--color-bg-primary)] text-left ${
                        error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]' : ''
                    }`}
                >
                    {selectedLabels || placeholder || 'Select options...'}
                </button>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute z-20 mt-1 w-full bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg max-h-60 overflow-auto">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    className="px-4 py-2 hover:bg-[var(--color-primary-light)] cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(option.value.toString());
                                    }}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`${id || name}-${option.value}`}
                                            checked={value.includes(option.value.toString())}
                                            onChange={() => handleToggle(option.value.toString())}
                                            className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border-primary)] rounded transition-colors duration-200"
                                        />
                                        <label
                                            htmlFor={`${id || name}-${option.value}`}
                                            className="ml-3 text-sm font-medium text-[var(--color-text-primary)] cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">{helperText}</p>
            )}
        </div>
    );
}
