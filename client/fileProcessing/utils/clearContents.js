export default function removeComments(text) {
    let inBigComment = false;
    let inStr = false;
    let newText = "";

    for (let line of text.split("\n")) {
        let newLine = "";
        let i = 0;

        while (i < line.length) {
            let sym = line[i];

            if (sym === '"') {
                inStr = !inStr;
            }

            if (!inStr) {
                if (sym === "/" && line[i + 1] === "/") {
                    break;
                }
                else if (sym === "/" && line[i + 1] === "*") {
                    inBigComment = true;
                    i++;
                }
                else if (inBigComment && sym === "*" && line[i + 1] === "/") {
                    inBigComment = false;
                    i++;
                }
                else if (!inBigComment) {
                    newLine += sym;
                }
            } else {
                newLine += sym;
            }
            i++;
        }

        if (newLine.trim() !== "") {
            newText += newLine + "\n";
        }
    }

    return newText.trim();
}