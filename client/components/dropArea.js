import processJsonFile from '../fileProcessing/processJsonFile.js';
import processZipFile from '../fileProcessing/processZipFile.js';
import throwError from '../components/error.js'

export default function initializeDropArea() {
    const rightSection = document.getElementById('rightSection');
    const fileInput = document.getElementById('fileInput');
    
    rightSection.addEventListener('dragover', (event) => {
        event.preventDefault();
        rightSection.classList.add('dragover');
    });
    
    rightSection.addEventListener('dragleave', () => {
        rightSection.classList.remove('dragover');
    });
    
    rightSection.addEventListener('drop', (event) => {
        event.preventDefault();
        rightSection.classList.remove('dragover');
        handleFiles(event.dataTransfer.files);
    });
    
    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });
}

function handleFiles(files) {
    const fileArray = Array.from(files);

    const file = fileArray[0];

    if (file.type === 'application/json' || file.name.endsWith('.json') || file.name.endsWith('.jsonc')) {
        processJsonFile(file);
        showLoadingState(file.name);
    } else if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        processZipFile(file);
        showLoadingState(file.name);
    } else {
        throwError(`Unsupported format of ${file.name}`);
    }
}

const fileNameElement = document.getElementById('fileName');

function showLoadingState(fileName) {
    const loadingSection = document.getElementById('loadingSection');
    const noFileText = document.getElementById('noFileText');

    loadingSection.style.display = 'block';
    noFileText.style.display = 'none';
    fileNameElement.textContent = `Imported file: ${fileName}`;

    const loader = document.getElementById('loaderBar');
    loader.style.display = 'block';

}

export function finishLoadingState(isError) {
    const loader = document.getElementById('loaderBar');
    loader.classList.add('animateOut');

    loader.addEventListener('animationend', function() {
        loader.style.display = 'none';

        loader.classList.remove('animateOut');

        const fileNameElement = document.getElementById('fileName');
        const finalMessage = isError ? 'Error' : 'Done';
        const downloadTip = isError ? 'Large files can lead to errors, in which case I advise you to reduce their size.' : 'If the download hasn\'t started, try to reload the page';
        
        const fileStateElement = document.getElementById('fileState');
        fileStateElement.innerHTML = '';
        fileNameElement.innerHTML = `<div style="animation: fadeIn 1s forwards;"><p style="font-size: 24px; margin-bottom: 0;">${finalMessage}</p><span style="color: #777; font-size: 14px;">${downloadTip}</span></div>`
    }, { once: true });
}