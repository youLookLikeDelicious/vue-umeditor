# webpack的初始化配置
```
    npm init 

    ...
    package.json 下的相关配置
    "scripts": {
        "dev": "webpack-dev-server --config ./config/webpack.dev.js",
        "build": "webpack --config ./config/webpack.prod.js"
      }
    ...

    # 开发模式
    npm run dev

    # 打包js
    npm run build

    # 发布npm
    npm log
    ...
    可以在package.json中的files属性中添加只想发布的文件
    ...
    npm publish
```
