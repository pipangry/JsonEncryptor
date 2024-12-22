export default function throwError(message) {
    const errorContainer = document.getElementById('error-container');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerText = message;

    const deleteButton = document.createElement('div');
    deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path fill="white" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg>'; // Символ для кнопки удаления
    deleteButton.onclick = () => {
        errorMessage.remove();
    };

    errorMessage.appendChild(deleteButton);

    errorContainer.appendChild(errorMessage);

    setTimeout(() => {
        if (errorMessage.parentNode) {
            errorMessage.remove();
        }
    }, 4000); 
}