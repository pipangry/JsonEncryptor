import { baseCryptoMD5 } from "../../crypto/md5.js";

export default function clogJsonContent(jsonContent) {
    const settingClogJson = document.getElementById('settingClogJson');

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

    const endMessage = '\n/*==============================\n//\n//   Obfuscated by pipa_ngry.\n//   Do not delete this message.\n//   Thanks.\n//\n==============================*/';
    return processedContent + endMessage;
}