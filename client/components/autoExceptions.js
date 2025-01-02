import throwError from './error.js';
import { addException, createDropdown } from './exceptionsList.js'

const availableTypes = [
    { name: 'Global', value: 1 },
    { name: 'Index', value: 2 }
];

const autoExceptionsTypeDropdown = document.getElementById('autoExceptionsTypeDropdown');

export default function initializeAutoExceptionsArea() {
    createDropdown(autoExceptionsTypeDropdown, availableTypes[0].value, availableTypes);

    const button = document.getElementById('dropAutoExceptions');
    const panel = document.getElementById('textarea-panel');
    const icon = button.querySelector('.icon');
    const autoExceptionsButton = document.getElementById('autoExceptionsButton');

    autoExceptionsButton.addEventListener('click', () => {
        const textarea = panel.querySelector('textarea');
        let jsonString = textarea.value.trim();

        if (jsonString.endsWith(',')) {
            jsonString = jsonString.slice(0, -1);
        }
        
        if (!jsonString.startsWith('{') && !jsonString.startsWith('[')) {
            jsonString = `{ ${jsonString} }`;
        }

        try {
            const jsonObject = JSON.parse(jsonString);
            const exceptions = autoExceptionsTypeDropdown.value === '2' ? getIndexes(jsonObject) : getVariables(jsonObject);
            textarea.value = exceptions.length === 0 ? 'No exceptions have been added.' : `Added\n${exceptions.join(',\n')} to exceptions.`;

            let firstClick = true;
            textarea.addEventListener('click', function() {
                if (firstClick) {
                    textarea.value = '';
                    firstClick = false;
                }
            });
            for (const exception of exceptions) {
                addException(exception);
            }
        } catch (error) {
            console.log(error)
            throwError('Json parsing error.')
        }
    })
    button.addEventListener('click', function() {
        if (panel.classList.contains('show')) {
            panel.classList.remove('show');
            panel.classList.add('hide');
            icon.style.transform = 'rotate(0deg)';
    
            setTimeout(() => {
                panel.style.display = 'none';
            }, 300);
        } else {
            panel.style.display = 'block';
            setTimeout(() => {
                panel.classList.remove('hide');
                panel.classList.add('show');
            }, 10);
            icon.style.transform = 'rotate(90deg)';
        }
    });
}

function getVariables(obj, result = []) {
    for (const key in obj) {
        if (key.startsWith('$')) {
            result.push(key);
        }

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            getVariables(obj[key], result);
        }
    }
    return result;
}

function getIndexes(jsonObject) {
    let keys = [];

    function recursiveSearch(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(item => recursiveSearch(item));
        } else if (typeof obj === 'object' && obj !== null) {
            if (obj.hasOwnProperty('controls') && Array.isArray(obj.controls)) {
                obj.controls.forEach(control => {
                    if (typeof control === 'object' && control !== null) {
                        const key = Object.keys(control);
                        
                        const keyString = key.join(',');
                        const atIndex = keyString.indexOf('@');
                        
                        let keyBeforeAt = keyString;
                        if (atIndex !== -1) {
                            keyBeforeAt = keyString.slice(0, atIndex);
                        }
                        
                        keys = keys.concat(keyBeforeAt);
                    }
                });
            }
            Object.keys(obj).forEach(key => {
                if (key !== 'controls') {
                    recursiveSearch(obj[key]);
                }
            });
        }
    }

    recursiveSearch(jsonObject);
    return keys;
}
