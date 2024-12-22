export default function log(message, isWarn) {
    const settingDebugMode = document.getElementById('settingDebugMode');
    if(settingDebugMode.checked) {
        isWarn ? console.warn(message) : console.log(message);
    }
}