export default function convertToUnicodeEscape(code) {
    const strings = code.match(/"[^"]*"|'[^']*'/g);
    
    if (!strings) return code;
    strings.forEach(str => {
        const unicodeEscape = Array.from(str).map(char => {
            return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
        }).join('');

        code = code.replace(str, unicodeEscape);
    });

    return code;
}