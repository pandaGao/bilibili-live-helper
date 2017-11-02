# bilibili-live-helper
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/made-with-vue.svg)](http://forthebadge.com)

 Bilibili直播弹幕库 for Mac / Windows / Linux

## Download
最新版本 v1.0.1 [点此前往下载](http://bilibili.danmaku.live)

## Features
* 支持 MacOS Windows Linux
* 老爷、用户等级、勋章等级标识同步B站原生颜色体系
* 支持显示粉丝勋章和活动头衔
* 支持舰队相关弹幕
  * 舰队船员进入提示
  * 舰队船员弹幕标识
  * 购买舰队提示
* 实时更新房间关注
  * 实时显示房间关注数
  * 新用户关注时弹幕提示
* 支持登录后功能
  * 禁言用户 / 解禁用户
  * 任命房管 / 撤销房管
  * 发送弹幕
* 用户设置自动保存
* 支持礼物打包显示 自动合并礼物弹幕 告别刷屏
* 支持弹幕点歌
  * 可选择点歌模式和唱见模式
  * 可根据用户等级、粉丝勋章进行点歌限制
  * 可添加屏蔽列表
  * 自动提示点歌是否成功
* 支持语音播报
* 支持系统提示
* 支持弹幕统计
* 自动检查更新

## Messages
 * 这个项目还有很大的提升空间 欢迎提issue和PR
 * Linux用户在启动时需要加上`--enable-transparent-visuals` 和 `--disable-gpu` 参数以支持透明窗口

## Change Logs
* 2017-08-31 - v1.0.1
  * 修复关注相关功能
  * 支持开启弹幕姬后显示直播间信息
  * 优化弹幕发送方式
  * 优化部分底层事件
  * 支持 #點歌 指令
* 2017-07-28 - v1.0.0
  * 全新改版
  * 支持点歌、语音播报、系统通知、弹幕统计等功能
  * 拆分弹幕姬视图 增加主窗口
  * 优化弹幕视图展示方式
  * 工具栏添加弹幕发送功能
  * 优化弹幕姬连接方式
* 2017-05-22 - v0.3.2
  * 添加弹幕视图背景透明度设置
  * 优化弹幕连接方式，减少漏弹幕的情况
  * 修复关注显示不正常问题
  * 支持输入框内复制粘贴全选等操作
* 2017-05-15 - v0.3.1
  * 增加弹幕视图游戏模式，防止任务栏误触，减淡背景色
  * 增加弹幕字号设置
  * 修复历史视图展示问题
* 2017-05-12 - v0.3.0
  * 新增登录功能
  * 设置界面登录后显示用户信息
  * 设置界面新增弹幕停留时间设定
  * 历史界面添加登录后相关功能
    * 一键禁言用户
    * 弹幕发送
  * 自动保存用户设置以及登录信息
  * 自动检查更新，有新版本时提醒
  * 添加关于界面
  * 界面UI优化
  * 弹幕池优化
* 2017-04-21 - v0.2.0
  * 工具栏增加拖动按钮 可以移动弹幕姬窗口位置
  * 支持显示礼物图片
  * 微调工具栏样式 增加icon
  * 发布支持透明窗口的Linux版本

## License
MIT

---

This project was generated from [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about this project can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
