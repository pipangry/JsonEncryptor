import { annotations, hardcoredNamespaces, mergeExceptions } from "../fileProcessing/utils/dataBuilder.js";
import commonExceptions from "../../data/common_exceptions.js";
import cryptoMD5 from "./md5.js";
import processValue from './processValue.js'
import syntax from "../../data/syntax.js";

export default function encryptJsonKeys(obj) {
    const encryptedObj = Array.isArray(obj) ? [] : {};
    const namespace = obj.namespace || null;
    const exceptions = namespace && commonExceptions[namespace] ? commonExceptions[namespace] : [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const parts = key.split("|");
            const keyWithoutDefault = parts.filter(part => part !== "default").join("|");
            const shouldEncrypt = !mergeExceptions(syntax, 1).includes(keyWithoutDefault);

            let encryptedKey = "";
            let isFirstPart = true;

            if (key === 'control_ids' || key === 'property_bag') {
                encryptedObj[key] = {};
                for (const controlKey in obj[key]) {
                    if (obj[key].hasOwnProperty(controlKey)) {
                        encryptedObj[key][controlKey] = processValue(obj[key][controlKey]);
                    }
                }
                continue;
            }

            let skipDot = false;

            if(key === 'text') {
                skipDot = true;
            }

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                let partBeforeAt = part;
                let partAfterAt = "";

                const atIndex = part.indexOf('@');
                if (atIndex !== -1) {
                    partBeforeAt = part.slice(0, atIndex);
                    partAfterAt = part.slice(atIndex);
                }

                const isTopLevelKey = Object.keys(obj).indexOf(key) === 0;

                if (shouldEncrypt) {
                    encryptedKey += (mergeExceptions(exceptions, 2).includes(partBeforeAt) ? partBeforeAt : cryptoMD5(partBeforeAt)) + processAnnotation(partAfterAt) + (i < parts.length - 1 ? "|" : "");
                } else {
                    encryptedKey += part + (i < parts.length - 1 ? "|" : "");
                }

                if (isTopLevelKey && isFirstPart) {
                    isFirstPart = false;
                }
            }

            function processAnnotation(string) {
                const isAnnotation = mergeExceptions(annotations, 3).includes(string.slice(1));
                if (string.includes('.') && !isAnnotation) {
                    const index = string.indexOf('.');
                    const beforeDot = string.slice(0, index);
                    const afterDot = string.slice(index);
                    const isHardcoredNamescape = mergeExceptions(hardcoredNamespaces, 4).includes(beforeDot.slice(1));
                    return isHardcoredNamescape ? beforeDot + cryptoMD5(afterDot) : cryptoMD5(string);
                } else {
                    return isAnnotation ? string : cryptoMD5(string);
                }
            }

            if (key === 'namespace') {
                if (!mergeExceptions(hardcoredNamespaces, 4).includes(obj[key])) {
                    encryptedObj[encryptedKey] = cryptoMD5(obj[key]);
                } else {
                    encryptedObj[encryptedKey] = obj[key];
                }
            } else {
                encryptedObj[encryptedKey] = processValue(obj[key], skipDot);
            }
        }
    }

    return encryptedObj;
}
