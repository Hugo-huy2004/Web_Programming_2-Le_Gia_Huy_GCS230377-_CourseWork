const fs = require('fs');
const path = require('path');
function searchFilesInDirectory(dir, filter, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory ${dir} does not exist`);
        return;
    }
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
            searchFilesInDirectory(filePath, filter, ext);
        } else if (filePath.endsWith(ext) || filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(filter)) {
                console.log(filePath);
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes(filter)) {
                        console.log(`Line ${index + 1}: ${line}`);
                    }
                });
            }
        }
    }
}
searchFilesInDirectory('/Users/wishpaxhugo/Downloads/Hugo/GREENWICH /COMP1842/CourseWork/frontend/src', 'Acquisition', '.tsx');
