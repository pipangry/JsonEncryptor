export default function removeComments(text) {
    let inBigComment = false;
    let inStr = false;

    return text.split("\n").map((line) => {
        if (inBigComment) {
            if (line.includes("*/")) {
                inBigComment = false;
                line = line.split("*/")[1];
            } else {
                return "";
            }
        }

        let newLine = "";
        for (let i = 0; i < line.length; i++) {
            let sym = line[i];

            if (sym === '"') {
                inStr = !inStr;
            }

            if (!inStr && sym === "/" && line[i + 1] === "/") {
                break;
            } else if (!inStr && sym === "/" && line[i + 1] === "*") {
                inBigComment = true;
                break;
            } else {
                newLine += sym;
            }
        }
        return newLine;
    }).join("\n").trim();
}