export default function convertToUnicodeEscape(code) {
    const strings = code.match(/"[^"]*"|'[^']*'/g);
    
    if (!strings) return code;

    strings.forEach(str => {
        const content = str.slice(1, -1);

        let unicodeEscape = '';
        let i = 0;

        while (i < content.length) {
            if (content[i] === '\\' && i + 1 < content.length) {
                unicodeEscape += content[i] + content[i + 1];
                i += 2;
            } else {
                unicodeEscape += '\\u' + ('0000' + content.charCodeAt(i).toString(16)).slice(-4);
                i++;
            }
        }

        code = code.replace(str, str[0] + unicodeEscape + str[str.length - 1]);
    });

    return code;
}