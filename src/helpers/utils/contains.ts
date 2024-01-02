export const contains = (obj: Record<string, any>, value: any) => {

    const arraysEqual = (arr: any[], value: any) => {
        if (arr.length !== value.length) return false;

        for (let i = 0; i < arr.length; i++) {
            if (!isEqual(arr[i], value[i])) return false;
        }

        return true;
    }

    const isEqual = (obj: Record<string, any>, value: any) => {
        if (typeof obj !== typeof value) return false;
        if (typeof obj !== 'object') return obj === value;

        if (Array.isArray(obj) && Array.isArray(value)) {
            return arraysEqual(obj, value);
        }

        const keys1 = Object.keys(obj);
        const keys2 = Object.keys(value);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!keys2.includes(key) || !isEqual(obj[key], value[key])) return false;
        }

        return true;
    }

    if (isEqual(obj, value)) return true;

    if (typeof obj !== 'object' || obj === null) return false;

    for (const key in obj) {
        if (contains(obj[key], value)) return true;
    }

    return false;
}
