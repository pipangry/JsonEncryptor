import throwError from '../components/error.js';
import removeComments from './utils/clearContents.js';
import addNamespaceMapping from './utils/namespaceMapping.js'
import encryptJsonKeys from '../crypto/processJson.js'
import { finishLoadingState } from '../components/dropArea.js';
import clogJsonContent from './utils/postProcessing.js';
import log from './utils/log.js';

export default function processJsonFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const jsonContent = event.target.result;
            const cleanedContent = removeComments(jsonContent);
            const jsonObject = JSON.parse(cleanedContent);
            addNamespaceMapping(jsonObject, file.name);

            const encryptedObject = encryptJsonKeys(jsonObject);
            const updatedContent = JSON.stringify(encryptedObject, null, 2);
            const postProcessedContent = clogJsonContent(updatedContent);

            const blob = new Blob([postProcessedContent], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const fileName = 'obfuscated_' + file.name
            a.href = url;
            a.download = fileName.endsWith('.jsonc') ? fileName.replace('.jsonc', '.json') : fileName;
            document.body.appendChild(a);
            a.addEventListener('click', function() {
                finishLoadingState();
            }, { once: true });
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            log('Done');
        } catch (error) {
            console.error('File processing error:', error);
            finishLoadingState(true);
            throwError(`File processing error: ${error}`);
        }
    };
    reader.readAsText(file);
}