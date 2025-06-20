// src/composables/ipfs.js
class IPFSService {
    constructor() {
        this.gateway = "http://127.0.0.1:8080/ipfs";
        this.apiUrl = "http://127.0.0.1:5001/api/v0";
        this.isDaemonRunning = false;
        this.checkDaemonPromise = null;
    }

    // 检查IPFS守护进程状态（带缓存和重试）
    async checkDaemon(retry = 2) {
        if (this.isDaemonRunning) return true;
        if (this.checkDaemonPromise) return this.checkDaemonPromise;

        this.checkDaemonPromise = new Promise(async (resolve) => {
            for (let attempt = 0; attempt <= retry; attempt++) {
                try {
                    const response = await fetch(`${this.apiUrl}/id`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.ok) {
                        this.isDaemonRunning = true;
                        resolve(true);
                        return;
                    }
                } catch (error) {
                    console.warn(`IPFS守护进程检查失败 (尝试 ${attempt + 1}/${retry + 1}):`, error);
                }

                // 重试前等待
                if (attempt < retry) {
                    // 原本如果这里是 setTimeout('res()', 1000)，应改为如下：
                    await new Promise(res => setTimeout(res, 1000));
                }
            }

            this.isDaemonRunning = false;
            resolve(false);
        });

        return this.checkDaemonPromise;
    }

    // 上传数据到IPFS
    async uploadData(data) {
        const isRunning = await this.checkDaemon();
        if (!isRunning) {
            throw new Error('IPFS守护进程未运行，请启动IPFS桌面或运行ipfs daemon');
        }

        try {
            const file = new File(
                [JSON.stringify(data)],
                `task-${Date.now()}.json`,
                { type: 'application/json' }
            );

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.apiUrl}/add`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`IPFS上传失败: ${response.statusText}`);
            }

            const result = await response.json();
            return result.Hash;
        } catch (error) {
            console.error('IPFS上传失败:', error);
            throw new Error(`上传失败: ${error.message}`);
        }
    }

    // 添加文件上传方法
    async uploadFile(file) {
        // 验证文件类型
        const allowedTypes = [
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
            'application/x-tar',
            'application/gzip'
        ];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('只支持压缩文件格式: ZIP, RAR, 7Z, TAR, GZ');
        }
        // 验证文件大小 (20GB)
        if (file.size > 20 * 1024 * 1024 * 1024) {
            throw new Error('文件大小不能超过20GB');
        }

        const isRunning = await this.checkDaemon();
        if (!isRunning) {
            throw new Error('IPFS守护进程未运行，请启动IPFS桌面或运行ipfs daemon');
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${this.apiUrl}/add`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`IPFS文件上传失败: ${response.statusText}`);
            }

            const result = await response.json();
            return result.Hash;
        } catch (error) {
            console.error('IPFS文件上传失败:', error);
            throw new Error(`文件上传失败: ${error.message}`);
        }
    }

    // 从IPFS获取数据
    async getData(cid) {
        console.log(cid)
        try {
            // 移除 headers: { 'Cache-Control': 'no-cache' }，避免CORS预检
            const response = await fetch(`${this.gateway}/${cid}`);

            if (!response.ok) {
                throw new Error(`获取IPFS数据失败: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('IPFS下载失败:', error);
            throw new Error(`下载失败: ${error.message}`);
        }
    }
}

// 本文件未使用eval/new Function/setTimeout([string])/setInterval([string])

export default new IPFSService();