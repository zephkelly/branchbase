import { ref } from 'vue';
import type { SanitiserConfig, ArraySanitiserConfig, SanitiseResult } from './types';
import { sanitiseString, sanitiseNumber } from './primitives';

export const useSanitization = () => {
    const lastModifications = ref<string[]>([]);

    const sanitizeValue = <T>(
        value: T,
        config: SanitiserConfig & ArraySanitiserConfig = {}
    ): SanitiseResult<T> => {
        if (typeof value === 'string') {
            const result = sanitiseString(value, config);
            lastModifications.value = result.modifications;
            return result as SanitiseResult<T>;
        }

        if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
            const result = sanitiseNumber(value as number | string, config);
            lastModifications.value = result.modifications;
            return result as SanitiseResult<T>;
        }

        if (Array.isArray(value)) {
            const modifications: string[] = [];
            let modified = false;
            let result = [...value];

            if (config.unique) {
                const uniqueArray = Array.from(new Set(result));
                if (uniqueArray.length !== result.length) {
                result = uniqueArray;
                modifications.push('removed duplicates');
                modified = true;
                }
            }

            if (config.sort) {
                const sortedArray = [...result].sort();
                if (JSON.stringify(sortedArray) !== JSON.stringify(result)) {
                result = sortedArray;
                modifications.push('sorted array');
                modified = true;
                }
            }

            if (config.maxItems && result.length > config.maxItems) {
                result = result.slice(0, config.maxItems);
                modifications.push(`limited to ${config.maxItems} items`);
                modified = true;
            }

            lastModifications.value = modifications;
            return { value: result as T, modified, modifications };
        }

        lastModifications.value = [];
        return { value, modified: false, modifications: [] };
    };

    return {
        sanitizeValue,
        lastModifications,
    };
};