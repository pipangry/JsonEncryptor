import { baseCryptoMD5 } from "../../crypto/md5.js";
import convertToUnicodeEscape from "./convertUnicode.js";

export default function clogJsonContent(jsonContent) {
    const settingClogJson = document.getElementById('settingClogJson');
    const settingAuthorshipMessage = document.getElementById('settingAuthorshipMessage');
    const settingConvertToUnicode = document.getElementById('settingConvertToUnicode');

    const cleanedContent = settingClogJson.checked
        ? jsonContent.replace(/"([^"]*)"/g, (match) => {
            return match;
        }).replace(/(\s+)(?=(?:(?:[^"]*"){2})*[^"]*$)/g, '')
        : jsonContent;

    const processedContent = settingClogJson.checked
        ? cleanedContent
            .replace(/"([^"]+)":/g, (match) => {
                return match + '/*' + baseCryptoMD5((Math.random() * 10)) + '*/';
            })
            .replace(/:\s*(?!['"])([^,}]+)/g, (match) => {
                return match + '/*' + baseCryptoMD5((Math.random() * 10)) + '*/';
            })
        : cleanedContent;

    const finalContent = settingConvertToUnicode.checked ? convertToUnicodeEscape(processedContent) : processedContent;

    const authorshipMessage = settingAuthorshipMessage.value == '' ? '' : settingAuthorshipMessage.value.replace(/\\n/g, '\n') + '\n';
    const endMessage = '\n/*Obfuscated on https://pipangry.github.io/JsonEncryptor/\nDo not delete this message.*/';
    return authorshipMessage + finalContent + endMessage;
}