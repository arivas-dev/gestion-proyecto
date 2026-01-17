import { usePage } from '@inertiajs/react';

interface Translations {
    common: Record<string, string>;
}

interface PageProps {
    locale?: string;
    translations?: Translations;
    [key: string]: unknown;
}

export function useTranslation() {
    const { locale = 'en', translations = { common: {} } } = usePage<PageProps>().props;

    const t = (key: string, params?: Record<string, string | number>): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                return key;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        if (params) {
            return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
                return params[paramKey]?.toString() || match;
            });
        }

        return value;
    };

    return { t, locale };
}
