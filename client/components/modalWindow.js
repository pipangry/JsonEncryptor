const modal = document.getElementById("settingsModal");

export default function initializeSettingsModal() {
    const openModalButton = document.getElementById("openSettings");
    const closeModalButton = document.getElementById("closeModal");

    loadSettings();

    openModalButton.onclick = function() {
        modal.style.display = "flex";
    }

    closeModalButton.onclick = function() {
        closeSettingsModal();
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            closeSettingsModal();
        }
    }

    document.getElementById("settingsForm").onsubmit = function(event) {
        event.preventDefault();
        
        const inputs = document.querySelectorAll("#settingsForm input");
        
        inputs.forEach(input => {
            if (input.type === "checkbox" || input.type === "radio") {
                localStorage.setItem(input.id, input.checked);
            } else {
                localStorage.setItem(input.id, input.value);
            }
        });
        
        closeSettingsModal();
    }
}

function closeSettingsModal() {
    modal.style.animation = 'fadeOut 0.2s forwards';
            
    modal.addEventListener('animationend', function() {
        modal.style.display = "none";
        modal.style.animation = 'fadeIn 0.2s forwards';
    }, { once: true });
}

function loadSettings() {
    const inputs = document.querySelectorAll("#settingsForm input");

    inputs.forEach(input => {
        const storedValue = localStorage.getItem(input.id);
        if (storedValue !== null) {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = (storedValue === 'true');
            } else {
                input.value = storedValue;
            }
        } else {
            if (input.type === "checkbox" || input.type === "radio") {
                localStorage.setItem(input.id, input.checked);
            } else {
                localStorage.setItem(input.id, input.value);
            }
        }
    });
}
