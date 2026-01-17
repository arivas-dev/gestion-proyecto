import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import Label from './Label';

interface BaseInputProps {
    label?: string;
    error?: string;
    helperText?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {
    as?: 'input';
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
    as: 'textarea';
}

type InputComponentProps = InputProps | TextareaProps;

export default function Input(props: InputComponentProps) {
    const { label, error, helperText, className = '', ...inputProps } = props;
    const isTextarea = props.as === 'textarea';
    
    const baseStyles = 'block w-full rounded-lg border-[var(--color-border-primary)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-colors duration-200 bg-[var(--color-bg-primary)]';
    const errorStyles = error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]' : '';
    const inputStyles = `${baseStyles} ${errorStyles} ${className}`;
    
    const inputClasses = isTextarea
        ? `${inputStyles} min-h-[100px] resize-y px-4 py-3`
        : `${inputStyles} px-4 py-2.5`;
    
    return (
        <div className="w-full">
            {label && (
                <Label htmlFor={props.id || props.name} required={props.required}>
                    {label}
                </Label>
            )}
            {isTextarea ? (
                <textarea
                    {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={inputClasses}
                />
            ) : (
                <input
                    {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
                    className={inputClasses}
                />
            )}
            {error && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
            )}
        </div>
    );
}
