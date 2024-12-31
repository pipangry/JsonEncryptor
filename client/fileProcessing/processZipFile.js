import throwError from '../components/error.js';
import removeComments from './utils/clearContents.js';
import addNamespaceMapping from './utils/namespaceMapping.js';
import encryptJsonKeys from '../crypto/processJson.js';
import { finishLoadingState } from '../components/dropArea.js';
import { baseCryptoMD5 } from '../crypto/md5.js';
import clogJsonContent from './utils/postProcessing.js';
import log from './utils/log.js';

function deployContents(updatedZip) {
    const settingHashNames = document.getElementById('settingHashNames');
    const targetFolder = document.getElementById('settingTargetFolder');

    const filesToRename = [];
    const directoriesToCheck = new Set();
    const uiDefsArray = [];
    
    Object.keys(updatedZip.files).forEach(filename => {
        const fileData = updatedZip.files[filename];

        if (!fileData.dir && filename.startsWith('ui/')) {
            const pathParts = filename.split('/');
            
            const fileFormat = document.getElementById('settingFileFormat').value;
            const baseName = pathParts.pop();
            const isExcludedFile = baseName == '_global_variables.json' || baseName == '_ui_defs.json';
            const newBaseName = (isExcludedFile || !settingHashNames.checked) ? baseName : baseCryptoMD5(baseName) + `.${fileFormat}`;
            const newFilename = [
                'ui',
                ...(!(isExcludedFile || targetFolder.value == '') ? [targetFolder.value] : []),
                newBaseName
            ].join('/');

            filesToRename.push({ oldName: filename, newName: newFilename });
            isExcludedFile ? null : uiDefsArray.push(newFilename);

            pathParts.reduce((acc, part) => {
                const dirPath = acc ? `${acc}/${part}` : part;
                directoriesToCheck.add(dirPath);
                return dirPath;
            }, '');
        }
    });

    filesToRename.forEach(({ oldName, newName }) => {
        updatedZip.file(newName, updatedZip.file(oldName).async('blob'));
        if (oldName !== newName) {
            updatedZip.remove(oldName);
        }
    });

    const uiDefsJson = JSON.stringify({ ui_defs: uiDefsArray }, null, 2);
    updatedZip.file('ui/_ui_defs.json', uiDefsJson);

    directoriesToCheck.forEach(dir => {
        const isEmpty = Object.keys(updatedZip.files).every(filename => {
            return !filename.startsWith(dir + '/') || updatedZip.files[filename].dir;
        });

        if (isEmpty) {
            updatedZip.remove(dir);
        }
    });
}

export default function processZipFile(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const zip = new JSZip();
            zip.loadAsync(event.target.result).then(function(contents) {
                const updatedZip = new JSZip();

                const filePromises = Object.keys(contents.files).map((filename, index) => {
                    const fileData = contents.files[filename];

                    if (fileData.dir) {
                        updatedZip.folder(filename);
                        return Promise.resolve();
                    } else if (filename.startsWith('ui/') && (filename.endsWith('.json') || filename.endsWith('.jsonc'))) {
                        return zip.file(filename).async('text').then(content => {
                            const cleanedContent = removeComments(content);
                            const jsonObject = JSON.parse(cleanedContent);
                            addNamespaceMapping(jsonObject, filename);
                            const encryptedObject = encryptJsonKeys(jsonObject);

                            const settingSeparateKeys = document.getElementById('settingSeparateKeys');
                            if (encryptedObject.namespace && settingSeparateKeys.checked) {
                                const namespaceValue = encryptedObject.namespace;
                                Object.keys(encryptedObject).forEach(key => {
                                    if (key !== 'namespace') {
                                        const newFileName = `${filename.replace(/\.jsonc?$/, '')}_${baseCryptoMD5(key)}.json`;
                                        const updatedContent = JSON.stringify({ 
                                            namespace: namespaceValue,
                                            [key]: encryptedObject[key] 
                                        }, null, 2);
                                        const postProcessedContent = clogJsonContent(updatedContent);
                                        updatedZip.file(newFileName, postProcessedContent);
                                    }
                                });
                            } else {
                                const updatedContent = JSON.stringify(encryptedObject, null, 2);
                                const postProcessedContent = clogJsonContent(updatedContent);
                                updatedZip.file(filename.endsWith('.jsonc') ? filename.replace('.jsonc', '.json') : filename, postProcessedContent);
                            }
                            const fileStateElement = document.getElementById('fileState');
                            let currentState = `${index + 1} / ${Object.keys(contents.files).length}`;
                            fileStateElement.innerHTML = `${currentState}`;
                            log(`Processing ${filename} (${currentState}) now.`)
                        }).catch(error => {
                            console.error('JSON parsing error:', filename, error);
                            throwError(`JSON parsing error at: ${filename}`);
                            const errorContent = JSON.stringify({ "JSON parsing error": `${error}` }, null, 2);
                            updatedZip.file(filename.endsWith('.jsonc') ? filename.replace('.jsonc', '.json') : filename, errorContent);
                            return Promise.resolve();
                        });
                    } else {
                        updatedZip.file(filename, fileData.async('blob'));
                        return Promise.resolve();
                    }
                });

                Promise.all(filePromises).then(() => {
                    deployContents(updatedZip);

                    updatedZip.generateAsync({ type: 'blob' }).then(content => {
                        const url = URL.createObjectURL(content);
                        const a = document.createElement('a');
                        const fileName = 'obfuscated_' + file.name;
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.addEventListener('click', function() {
                            finishLoadingState();
                        }, { once: true });
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(url);
                        log('Done');
                    });
                });
            }).catch(error => {
                console.error('Zip processing error:', error);
                finishLoadingState(true);
                throwError('Zip processing error.');
            });
        } catch (error) {
            console.error('File processing error:', error);
            finishLoadingState(true);
            throwError(`File processing error: ${error}`);
        }
    };
    reader.readAsArrayBuffer(file);
}
