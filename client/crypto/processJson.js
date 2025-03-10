import { annotations, hardcoredNamespaces, mergeExceptions } from "../fileProcessing/utils/dataBuilder.js";
import commonExceptions from "../../data/common_exceptions.js";
import cryptoMD5 from "./md5.js";
import processValue from './processValue.js'
import syntax from "../../data/syntax.js";
import factories from "../../data/factories.js"

export default function encryptJsonKeys(obj, isValue = false, isFactoryBase = false) {
    const encryptedObj = Array.isArray(obj) ? [] : {};
    const namespace = obj.namespace || null;
    const exceptions = namespace && commonExceptions[namespace] ? commonExceptions[namespace] : [];

    const topLevelKeys = Object.keys(obj).filter(key => typeof obj[key] === 'object' && obj[key] !== null);

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const isTopLevelKey = topLevelKeys.includes(key) && !isValue;
            const parts = key.split("|");
            const hasDefault = parts.includes("default");
            const filteredParts = parts.filter(part => part !== "default");
            const keyWithoutDefault = filteredParts.join("|");

            const shouldEncrypt = syntax.includes(key) && !isTopLevelKey || factories.includes(key) || mergeExceptions([], 1).includes(keyWithoutDefault) ? false : true;

            let encryptedKey = "";
            let isFirstPart = true;

            let skipDot = false;
            let enableFactoryBase = false;

            if (key === 'control_ids' || key === 'property_bag' || key === 'factory') {
                enableFactoryBase = true;
            }

            if (key === 'text') {
                skipDot = true;
            }

            for (let i = 0; i < filteredParts.length; i++) {
                const part = filteredParts[i];
                let partBeforeAt = part;
                let partAfterAt = "";

                const atIndex = part.indexOf('@');
                if (atIndex !== -1) {
                    partBeforeAt = part.slice(0, atIndex);
                    partAfterAt = part.slice(atIndex);
                }

                if (shouldEncrypt && !isFactoryBase) {
                    encryptedKey += (mergeExceptions(exceptions, 2).includes(partBeforeAt) && isTopLevelKey ? partBeforeAt : cryptoMD5(partBeforeAt)) + processAnnotation(partAfterAt) + (i < filteredParts.length - 1 ? "|" : "");
                } else {
                    encryptedKey += part + (i < filteredParts.length - 1 ? "|" : "");
                }

                if (isTopLevelKey && isFirstPart) {
                    isFirstPart = false;
                }
            }

            if (hasDefault) {
                encryptedKey += encryptedKey ? "|default" : "default";
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
                encryptedObj[encryptedKey] = processValue(obj[key], skipDot, enableFactoryBase);
            }
        }
    }

    return encryptedObj;
}