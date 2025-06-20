/**
 * 将人类可读日期时间字符串转换为区块链时间戳（Unix时间戳，秒级）所有时间都转换为Unix时间戳（秒级）

符合区块链智能合约的时间处理标准

避免时区问题，使用UTC时间
 * @param {string} dateString - 人类可读日期时间字符串 (格式: YYYY-MM-DD 或 YYYY-MM-DDTHH:mm:ss)
 * @param {number} [daysToAdd=0] - 要添加的天数（可选）
 * @returns {number} Unix时间戳（秒级）
 */
const convertToUnixTimestamp = (dateString, daysToAdd = 0) => {
    // 检查输入是否有效
    if (!dateString) {
        throw new Error('日期字符串不能为空');
    }

    // 处理日期格式（支持带时间或不带时间）
    let date;
    if (dateString.includes('T')) {
        // 包含时间的格式 (YYYY-MM-DDTHH:mm:ss)
        date = new Date(dateString);
    } else {
        // 仅包含日期的格式 (YYYY-MM-DD) - 设置为当天的最后时刻（23:59:59）
        date = new Date(`${dateString}T23:59:59`);
    }

    // 添加天数（如果需要）
    if (daysToAdd) {
        date.setDate(date.getDate() + parseInt(daysToAdd));
    }

    // 转换为Unix时间戳（秒级）
    return Math.floor(date.getTime() / 1000);
};

/**
 * 将Unix时间戳转换为人类可读格式
 * @param {number} timestamp - Unix时间戳（秒级）
 * @returns {string} 格式化日期字符串 (YYYY-MM-DD HH:mm)
 */
const formatUnixTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};