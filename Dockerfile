# 使用官方 Node.js 镜像作为基础镜像
FROM mirror.ccs.tencentyun.com/library/node:18-slim

# 创建工作目录
WORKDIR /app

# 设置 npm 镜像源为淘宝镜像
RUN npm config set registry https://registry.npmmirror.com

# 首先复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装生产环境依赖
RUN npm install --omit=dev \ 
    && npm cache clean --force

# 复制应用程序代码
COPY . .

# 设置环境变量
ENV NODE_ENV=production

# 暴露应用端口
EXPOSE 3000

# 启动命令
CMD ["node", "mysql_display_1118.js"]