const fs = require('fs');
const path = require('path');

const directoryPath = 'C:/Users/Ducne/Downloads'; // Thay đổi đường dẫn thư mục

function getSizeInGB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024 * 1024); // Kích thước tính bằng GB
}

function getTotalSize(directoryPath) {
    let totalSize = 0;
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            totalSize += getSizeInGB(filePath);
        }
    }

    return totalSize;
}

function deleteAllFiles(directoryPath) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile()) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    }
}

function monitorDirectory() {
    const totalSize = getTotalSize(directoryPath);

    console.log(`Total size of directory: ${totalSize.toFixed(2)} GB`);

    if (totalSize > 1) {
        console.log('Size exceeds 1 GB, deleting all files...');
        deleteAllFiles(directoryPath);
    } else {
        console.log('Size is within limits.');
    }
}

// Theo dõi thư mục mỗi 5 phút
setInterval(monitorDirectory, 5 * 60 * 1000);
