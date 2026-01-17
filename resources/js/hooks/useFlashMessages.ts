import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

interface FlashMessages {
    status?: string;
    success?: string;
    error?: string;
}

interface PageProps {
    flash?: FlashMessages;
    [key: string]: unknown;
}

export function useFlashMessages() {
    const { flash } = usePage<PageProps>().props;
    const previousFlash = useRef<FlashMessages | undefined>(undefined);

    useEffect(() => {
        // Only show toast if flash message has changed
        if (flash?.success && flash.success !== previousFlash.current?.success) {
            toast.success(flash.success);
            previousFlash.current = { ...previousFlash.current, success: flash.success };
        }
        if (flash?.status && flash.status !== previousFlash.current?.status) {
            toast.success(flash.status);
            previousFlash.current = { ...previousFlash.current, status: flash.status };
        }
        if (flash?.error && flash.error !== previousFlash.current?.error) {
            toast.error(flash.error);
            previousFlash.current = { ...previousFlash.current, error: flash.error };
        }
    }, [flash]);
}
