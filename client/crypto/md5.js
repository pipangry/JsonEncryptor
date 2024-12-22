import throwError from '../components/error.js';

const shiftInput = document.getElementById('shiftInput');

export default function cryptoMD5(text) {
    let salt = shiftInput.value;
    let settingLightEncryption = document.getElementById('settingLightEncryption');

    if (typeof salt !== 'string') {
        throwError('Key must be a string.');
    }

    let encryptedStr = '';

    if(settingLightEncryption.checked) {
        function getSaltValue(salt) {
            return salt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        }
    
        const shift = getSaltValue(salt);
    
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
    
            if (/[a-zA-Z]/.test(char)) {
                const code = char.charCodeAt(0);
                let base = char === char.toLowerCase() ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
    
                const newChar = String.fromCharCode(((code - base + shift) % 26) + base);
                encryptedStr += newChar;
            } else {
                encryptedStr += char;
            }
        }
    } else {
        for (let char of text) {
            if (/[a-zA-Z]/.test(char)) {
                const hash = CryptoJS.MD5(char + salt).toString();
                encryptedStr += hash;
            } else {
                encryptedStr += char;
            }
        }
    }

    return encryptedStr;
}

export function baseCryptoMD5(text) {
    let salt = shiftInput.value;

    if (typeof salt !== 'string') {
        throwError('Key must be a string.');
    }
    
    const hashedBase = CryptoJS.MD5(text + salt).toString();
    return hashedBase;
}