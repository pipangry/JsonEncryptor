import namespaceMapping from "../../../data/namespace_mapping.js";
import log from "./log.js";

export default function addNamespaceMapping(jsonData, filename) {
    const cleanedFileName = filename.replace(/^ui\//, '');
    if (!jsonData.hasOwnProperty('namespace')) {
        if (namespaceMapping.hasOwnProperty(cleanedFileName)) {
            jsonData.namespace = namespaceMapping[cleanedFileName];
            log(`Added namespace '${namespaceMapping[cleanedFileName]}' to '${filename}'.`);
        } else {
            log(`File '${filename}' doesn't have namespaceMapping.`, true);
        }
    }
}