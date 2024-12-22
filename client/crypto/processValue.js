import { annotations, mergeExceptions, hardcoredNamespaces } from "../fileProcessing/utils/dataBuilder.js";
import cryptoMD5 from "./md5.js";
import encryptJsonKeys from './processJson.js'
import hardcodedValues from "../../data/hardcored_values.js";
import globalVariables from "../../data/global_variables.js";

export default function processValue(value, skipDot) {
    if (Array.isArray(value)) {
        return value.map(item => processValue(item));
    } else if (typeof value === 'object' && value !== null) {
        return encryptJsonKeys(value);
    } else if (typeof value === 'string') {
        if (value.includes('$')) {
            value = value.replace(/\$([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, p1) => {
                if (mergeExceptions(globalVariables, 1, true).includes(p1)) {
                    return match;
                }
                return '$' + cryptoMD5(p1); 
            });
        }

        const isHardcoded = hardcodedValues.includes(value);
        const isAnnotated = mergeExceptions(annotations, 3).includes(value.replace(/^@/, ''));

        if (value.includes('.')) {
            const index = value.indexOf('.');
            const beforeDot = value.slice(0, index);
            const afterDot = value.slice(index);
            const surroundingChars = value.slice(index - 1, index + 2);

            const hasInvalidSurroundingChars = /[%'\d]/.test(surroundingChars);
            
            const isExcluded = mergeExceptions(hardcoredNamespaces, 4).includes(beforeDot.replace(/^@/, ''));
            if (!isHardcoded && !isAnnotated && !hasInvalidSurroundingChars && !skipDot) {
                return isExcluded ? beforeDot + cryptoMD5(afterDot) : cryptoMD5(value);
            } else {
                return value;
            }
        }
    }
    return value;
}