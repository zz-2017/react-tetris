//坐标检测，检查左移、右移、下移、旋转、翻转后的坐标是否正确
export function detectionOfActive(tetrisMatrix, residueBlocks) {
    if (tetrisMatrix.find(item => item.x >= 15 || item.x < 0 || item.y < 0 || item.y >= 30)) {
        return false;
    }
    for (let i = 0; i < tetrisMatrix.length; i++) {
        if (residueBlocks.find(item => (item.x === tetrisMatrix[i].x) && (item.y === tetrisMatrix[i].y))) {
            return false;
        }
    }
    return true;
}

//碰撞检测
export function detectionOfCollision(tetrisMatrix, residueBlocks) {
    for (let i = 0; i < tetrisMatrix.length; i++) {
        if (tetrisMatrix[i].y === 29) {
            return true;
        }
        if (residueBlocks.find(item => item.x === tetrisMatrix[i].x && item.y === (tetrisMatrix[i].y + 1))) {
            return true;
        }
    }
    return false;
}

//完结检测
export function detectionOfEnd(account,residueBlocks) {
    return !!(account === 100 || residueBlocks.find(item => item.y === 0));
}