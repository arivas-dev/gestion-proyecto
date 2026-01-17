"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-[var(--color-bg-primary)] group-[.toaster]:text-[var(--color-text-primary)] group-[.toaster]:border-[var(--color-border-primary)] group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-[var(--color-text-secondary)]",
                    actionButton:
                        "group-[.toast]:bg-[var(--color-primary)] group-[.toast]:text-white hover:group-[.toast]:bg-[var(--color-primary-dark)]",
                    cancelButton:
                        "group-[.toast]:bg-[var(--color-bg-secondary)] group-[.toast]:text-[var(--color-text-primary)] hover:group-[.toast]:bg-[var(--color-border-primary)]",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
