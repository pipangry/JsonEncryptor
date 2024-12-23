export default function convertToUnicodeEscape(code) {
    const strings = code.match(/"[^"]*"|'[^']*'/g);
    
    if (!strings) return code;

    strings.forEach(str => {
        const content = str.slice(1, -1);

        const unicodeEscape = Array.from(content).map(char => {
            return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
        }).join('');

        code = code.replace(str, str[0] + unicodeEscape + str[str.length - 1]);
    });

    return code;
}