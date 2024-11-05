export default function debounce(func: any, timeout: any) {
    let timeoutId: any;
    
    const debounced = (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, timeout);
    };

    // Add clear method to the debounced function
    debounced.clear = () => {
        clearTimeout(timeoutId);
    };

    return debounced;
}