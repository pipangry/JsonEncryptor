export default function removeComments(text) {
    let inBigComment = false; // Флаг для отслеживания блочных комментариев
    let inStr = false; // Флаг для отслеживания строк
    let newText = ""; // Переменная для хранения результата

    for (let line of text.split("\n")) {
        let newLine = ""; // Переменная для новой строки
        let i = 0; // Индекс текущего символа

        while (i < line.length) {
            let sym = line[i];

            // Проверка на вход в строку
            if (sym === '"') {
                inStr = !inStr; // Переключаем состояние
            }

            // Если мы не внутри строки
            if (!inStr) {
                // Обработка однострочного комментария
                if (sym === "/" && line[i + 1] === "/") {
                    break; // Удаляем однострочный комментарий
                }
                // Обработка блочного комментария
                else if (sym === "/" && line[i + 1] === "*") {
                    inBigComment = true; // Устанавливаем флаг блочного комментария
                    i++; // Пропускаем следующий символ
                }
                // Проверка на конец блочного комментария
                else if (inBigComment && sym === "*" && line[i + 1] === "/") {
                    inBigComment = false; // Сбрасываем флаг блочного комментария
                    i++; // Пропускаем следующий символ
                }
                // Если не в комментарии, добавляем символ к новой строке
                else if (!inBigComment) {
                    newLine += sym;
                }
            } else {
                // Если мы внутри строки, просто добавляем символ
                newLine += sym;
            }
            i++; // Переход к следующему символу
        }

        // Добавляем новую строку к результату, если она не пустая
        if (newLine.trim() !== "") {
            newText += newLine + "\n";
        }
    }

    console.log(newText.trim());
    return newText.trim(); // Убираем лишние пробелы в конце
}
