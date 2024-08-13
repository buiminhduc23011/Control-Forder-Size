const fs = require('fs').promises;
const path = require('path');

const directoryPath = 'C:/Users/PC/.pm2/logs'; // Thay đổi đường dẫn thư mục

async function getSizeInGB(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.size / (1024 * 1024 * 1024); // Kích thước tính bằng GB
    } catch (error) {
        console.error(`Error accessing file ${filePath}:`, error.message);
        return 0;
    }
}

async function getTotalSize(directoryPath) {
    let totalSize = 0;
    try {
        const files = await fs.readdir(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            try {
                const stats = await fs.stat(filePath);

                if (stats.isFile()) {
                    totalSize += await getSizeInGB(filePath);
                }
            } catch (error) {
                console.error(`Error accessing file ${filePath}:`, error.message);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${directoryPath}:`, error.message);
    }

    return totalSize;
}

async function deleteAllFiles(directoryPath) {
    try {
        const files = await fs.readdir(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            try {
                const stats = await fs.stat(filePath);

                if (stats.isFile()) {
                    await fs.unlink(filePath);
                    console.log(`Deleted file: ${filePath}`);
                }
            } catch (error) {
                console.error(`Error deleting file ${filePath}:`, error.message);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${directoryPath}:`, error.message);
    }
}

async function monitorDirectory() {
    const totalSize = await getTotalSize(directoryPath);

    console.log(`Total size of directory: ${totalSize.toFixed(2)} GB`);

    if (totalSize > 100) { // Thay đổi kích thước từ 100 GB thành 1 GB
        console.log('Size exceeds 1 GB, deleting all files...');
        await deleteAllFiles(directoryPath);
    } else {
        console.log('Size is within limits.');
    }
}

// Theo dõi thư mục mỗi 60 phút (1 giờ)
setInterval(monitorDirectory, 60 * 60 * 1000);
