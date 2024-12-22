import commonExceptions from "../../../data/common_exceptions.js";
import { getExceptions } from "../../components/exceptionsList.js";
import namespaceMapping from "../../../data/namespace_mapping.js";

const annotations = [];

const hardcoredNamespaces = Object.values(namespaceMapping);

for (const key in commonExceptions) {
    if (commonExceptions.hasOwnProperty(key)) {
        commonExceptions[key].forEach(value => {
            annotations.push(`${key}.${value}`);
        });
    }
}

function mergeExceptions(array, value, isVariable) {
    const exceptions = getExceptions();
    exceptions.forEach(exception => {
        const name = exception.name;
        if (exception.type === value) {
            array.push(name.startsWith("$") && isVariable ? name.slice(1) : name);
        }
    });
    return array;
}

export { annotations, hardcoredNamespaces, mergeExceptions };
