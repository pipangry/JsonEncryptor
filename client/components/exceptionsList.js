import throwError from "./error.js";
import log from "../fileProcessing/utils/log.js";

const STORAGE_KEY = 'ExceptionsList';

const exceptionNameInput = document.getElementById('exceptionName');
const typeDropdown = document.getElementById('typeDropdown');
const addExceptionButton = document.getElementById('addExceptionButton');
const exceptionsList = document.getElementById('exceptionsList');

const availableTypes = [
    { name: 'Global', value: 1 },
    { name: 'Index', value: 2 },
    { name: 'Annotation', value: 3 },
    { name: 'Namespace', value: 4 }
];

function createDropdown(dropdownElement, selectedValue) {
    dropdownElement.innerHTML = '';
    availableTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.name;
        option.selected = type.value === selectedValue;
        dropdownElement.appendChild(option);
    });
}

export function getExceptions() {
    const exceptions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    log(exceptions);
    return exceptions;
}

function saveExceptions(exceptions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exceptions));
}

function addException() {
    const exceptionName = exceptionNameInput.value.trim();
    const exceptionType = parseInt(typeDropdown.value);
    if (exceptionName) {
        const exceptions = getExceptions();
        
        const exists = exceptions.some(exception => 
            exception.name === exceptionName && exception.type === exceptionType
        );
        if (exists) {
            throwError('This exception already exists.');
            return;
        }

        exceptions.push({ name: exceptionName, type: exceptionType });
        saveExceptions(exceptions);
        renderExceptions();
        exceptionNameInput.value = '';
        typeDropdown.value = availableTypes[0].value;
    } else {
        throwError('Enter the name of the new exception.');
    }
}

export default function initializeExceptionsList() {
    createDropdown(typeDropdown, availableTypes[0].value);
    renderExceptions();
    addExceptionButton.addEventListener('click', () => {
        addException();
    });
    const button = document.getElementById('dropExceptionsList');
    const panel = document.getElementById('panel');
    const icon = button.querySelector('.icon');
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

function renderExceptions() {
    exceptionsList.innerHTML = '';
    const exceptions = getExceptions();
    document.getElementById('exceptions-count').innerHTML = `Exceptions List (${exceptions.length})`;

    if (exceptions.length === 0) {
        exceptionsList.innerHTML = '<div class="no-exceptions">No exceptions have been added.</div>';
    } else {
        exceptions.forEach((exception, index) => {
            const div = document.createElement('div');
            div.className = 'exception-item';
            div.textContent = `${exception.name}`;

            const typeDropdown = document.createElement('select');
            createDropdown(typeDropdown, exception.type);

            typeDropdown.addEventListener('change', () => {
                changeExceptionType(index, parseInt(typeDropdown.value));
            });

            const deleteButton = document.createElement('div');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg>';
            deleteButton.addEventListener('click', () => {
                deleteException(index);
            });

            const toolDiv = document.createElement('div');
            toolDiv.style.display = 'flex';
            toolDiv.style.alignItems = 'center';
            toolDiv.style.gap = '10px';
            toolDiv.appendChild(typeDropdown);
            toolDiv.appendChild(deleteButton);
            div.appendChild(toolDiv);
            exceptionsList.appendChild(div);
        });
    }
}

function changeExceptionType(index, newType) {
    const exceptions = getExceptions();
    exceptions[index].type = newType;
    saveExceptions(exceptions);
    renderExceptions();
}

function deleteException(index) {
    const exceptions = getExceptions();
    exceptions.splice(index, 1);
    saveExceptions(exceptions);
    renderExceptions();
}