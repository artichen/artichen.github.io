# Yuhan Chen · 个人学术与求职网站

React + TypeScript + Vite + CSS Modules 的完整静态项目。面向教授、研究生面试老师与雇主，页面为英文，代码关键注释和本文为中文。无网络图片、外部字体、后端、登录或真实数据 API。

## 1. 已实现

- Home：个人简介、预留照片、研究兴趣、示例项目、外部账号入口。
- CV：教育、技术基础、兴趣，以及真正可下载的本地示例 PDF。包含加载、超时、失败重试。
- Blog：本地示例笔记、关键词搜索、空结果、展开正文。
- Miscellany：与理工科和金融背景相符的学习兴趣。
- 全局：选中导航、汉堡菜单、Escape 关闭、返回顶部、移动端单列、加载失败重试、未知路由、图片损坏回退、键盘可访问性。

**当前资料是 mock 草稿。项目和笔记明确标为示例，不代表实际完成的项目或已发表研究。没有真实 GitHub / LinkedIn 地址时，入口显示 “not added”，不会捏造一个账号。**

## 2. 安装与启动

安装 Node.js 22.12 或更高的 Node 22 版本，以及 Git。然后解压并进入项目目录：

```bash
cd yuhan-academic
npm ci
npm run dev
```

在浏览器打开终端中 Vite 显示的 Local 地址，通常是 http://localhost:5173 。保存源码后页面自动更新。不要双击 index.html 直接运行 React 源码。

已附 package-lock.json，推荐用 npm ci 保持依赖版本一致。只有主动修改 package.json 的依赖时才改用 npm install 并提交新的锁文件。

```bash
npm test         # 运行交互及边界行为测试
npm run build    # TypeScript 检查 + 生成 dist 静态文件
npm run preview  # 预览构建结果，通常为 http://localhost:4173
```

## 3. 主要文件

| 文件 | 用途 |
| --- | --- |
| src/data/site.ts | 类型与全部本地 mock 内容；优先修改这里 |
| src/App.tsx | 全局框架、加载状态、菜单、路由、页脚 |
| src/App.module.css | 局部样式与响应式布局 |
| src/styles.css | 全局 Helvetica、13pt 正文基准、链接与焦点 |
| src/pages/Home.tsx | 两列简介和照片，以及研究兴趣与项目 |
| src/pages/CV.tsx | CV 展示、PDF 验证下载和异常处理 |
| src/pages/Blog.tsx | 搜索、无结果、展开笔记 |
| src/pages/Miscellany.tsx | 学习兴趣 |
| src/components/Shared.tsx | 社交链接、照片、标题、空状态和错误边界 |
| src/hooks/useHashRoute.ts | 简单 Hash 路由及浏览器前进后退 |
| src/utils.ts | 相对资源路径、安全账号链接、搜索逻辑 |
| src/App.test.tsx | 可重复运行的核心行为测试 |
| public/files/yuhan-chen-cv-sample.pdf | 示例 PDF，日后替换为真实简历 |
| vite.config.ts | React 插件及相对资源路径 |
| .github/workflows/deploy.yml | 提交 main 后自动构建并发布 GitHub Pages |
| index.html | 页面语言、初始标题、description 和字体图标 |

## 4. 添加个人资料

### 姓名、简介、链接

编辑 src/data/site.ts 中的 profile。下面是字段示意，账号地址必须换成自己的：

```ts
profile: {
  name: 'Yuhan Chen',
  initials: 'YC',
  role: 'Commerce student · Economics',
  institution: 'James Cook University, Singapore',
  location: 'Singapore',
  bio: ['第一段英文简介', '第二段英文简介'],
  photo: 'images/portrait.jpg',
  photoAlt: 'Portrait of Yuhan Chen',
  github: 'https://github.com/YOUR_USERNAME',
  linkedin: 'https://www.linkedin.com/in/YOUR_HANDLE/',
  email: '',
},
```

这两个 URL 是说明文档中的格式示例，不是已经配置的真实账号。配置后，首页和页脚会同步显示链接，打开新标签页。只接受 HTTPS 账号链接；不填则显示待补充状态。

### 照片

1. 在 public 下新建 images 文件夹，放入 portrait.jpg。
2. 设置 profile.photo 为 images/portrait.jpg，路径不含 public，也不加开头的斜杠。
3. 填写描述真实照片的 photoAlt。

图片不裁剪、不拉伸，只按容器比例缩放。不设置照片时显示姓名首字母占位；文件缺失时显示回退提示。所有图片路径只允许本地资源，不加载网络照片。

### 正式简历

将真实 PDF 放入 public/files/yuhan-chen-cv.pdf，再改：

```ts
cv: {
  path: 'files/yuhan-chen-cv.pdf',
  filename: 'Yuhan-Chen-CV.pdf',
  isSample: false,
},
```

网页 CV 的教育、技能等信息仍在同一数据文件中编辑。**上传 PDF 不会自动解析或同步网页正文**，两者需一并维护。无需使用 Python 就能更换自己的 PDF。

### 项目、博客和其他内容

projects 的字段：id（唯一标识）、title（标题）、kind（如 Course project）、summary（简介）、tags（标签数组）、details（详细说明）、url（可选 HTTPS 仓库链接）。

posts 的字段：id、title、category、summary、paragraphs（段落数组）。搜索会匹配标题、类别、摘要和正文，忽略大小写；多个关键词需要全部匹配。正文使用普通文本，由 React 自动转义，不注入 HTML。

删除示例时，将相应数组设为 [] 即可展示空状态。可选字段用空字符串或省略；保留 profile、cv 以及顶层数组的结构，TypeScript 会帮助发现类型错误。

所有内容核实完成后，再把 isDraft 改为 false。该字段隐藏整站草稿提示和笔记的示例标记；项目 kind 和 CV 的 isSample 必须分别更新。姓名变更时也检查 index.html 中的初始标题和 description。

## 5. 发布到 GitHub Pages

1. 在自己的 GitHub 账号中新建仓库，例如 personal-website。首次操作可以创建空仓库，不自动添加 README。
2. 把解压后的整个项目作为仓库根目录提交，保留 src、public、package-lock.json 和 .github/workflows。不要上传 node_modules 或 dist。
3. 在仓库 Settings → Pages → Build and deployment → Source 选择 **GitHub Actions**。
4. 提交到 main，或在 Actions 页面手动运行 Deploy to GitHub Pages。工作流将安装依赖、测试、构建并发布 dist。
5. 部署成功后，在 Settings → Pages 查看实际网址；普通项目仓库通常为 https://你的用户名.github.io/personal-website/ 。

在项目目录内执行以下命令，URL 换成自己新建的仓库：

```bash
git init
git add .
git commit -m "Create academic portfolio website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/personal-website.git
git push -u origin main
```

若目录已经是 Git 仓库且已有 origin，先 git remote -v 检查，确认目标后使用 git remote set-url origin 真实仓库URL，不要重复 add。GitHub 认证使用自己的 Git / GitHub 凭证，不把 token 写进代码。

后续修改：

```bash
git add .
git commit -m "Update profile and CV"
git push
```

**为什么刷新 CV 页面不会 404？** 页面路径使用 #/cv、#/blog 等 Hash 路由，服务器始终读取同一个 index.html；Vite 的 base: './' 让 JS、CSS、照片和 PDF 都按当前仓库目录解析。因此无需服务器重写，也不用为每个页面建一个 HTML。

GitHub Pages 是静态托管；本项目不支持后台上传或在线编辑。修改本地文件并提交后才会更新。直接在 GitHub 网页上传时，也要保留 .github/workflows/deploy.yml。项目中的 .openai/hosting.json 用于当前预览平台，GitHub Pages 不依赖它；源码下载包不包含该文件。

官方参考：[Vite 静态部署](https://vite.dev/guide/static-deploy)；[Vite 相对 base 路径](https://vite.dev/guide/build#relative-base)。

## 6. 状态与验收

| 情况 | 页面行为 |
| --- | --- |
| 初次读取 mock 数据 | 显示 Loading profile，成功后呈现页面 |
| mock 加载函数拒绝 | 显示错误及 Retry；本地 mock 默认不会主动失败 |
| CV 下载中 | 显示 Downloading，按钮禁用，避免重复请求 |
| PDF 404、断网、非 PDF、15 秒超时 | 显示错误与重试；拒绝把 HTML 当 PDF 下载 |
| 缺少 CV 路径 | 下载按钮禁用，显示 CV not added yet |
| 项目、笔记、兴趣等为空 | 显示相应空状态 |
| 博客搜索无结果 | 显示无结果与清空操作 |
| 账号缺失 | 显示 not added，不生成虚假链接 |
| 图片不存在 | 回退为姓名首字母，不显示破图 |
| 路由不存在 | Page not found，并提供首页入口 |
| 移动端 ≤700px | 顶部单列，使用汉堡菜单，照片等比缩放 |

正文基准 13pt = 17.333px，以 rem 表达；元信息略小。Helvetica 不存在时使用 Arial 和系统 sans-serif。黑色正文、默认蓝色 #0000ee 超链接，无网络字体与装饰图片。

已提供 jsdom 组件行为测试，它不能证明真实浏览器的排版、控制台和原生下载行为完全正常。本地交付验收时，请运行 npm run dev，在浏览器检查以下项目：

- Home / CV / Blog / Miscellany 导航及前进后退，刷新 #/cv。
- CV 下载能得到可打开的 PDF；开发者工具切换 Offline 后有重试提示。
- 搜索 retrieval、无匹配内容、清空；展开正文。
- 320px、375px、768px、1440px 宽度以及 200% 缩放，没有横向溢出。
- Tab 导航、菜单 Escape 关闭、返回顶部；控制台无运行错误。

## 7. 学习顺序

建议先读 site.ts 的数据类型，再读 Home.tsx 的数据渲染，接着看 Blog.tsx 的 useState 与搜索，最后看 useHashRoute.ts、CV.tsx 的异步处理，以及 App.tsx 的全局逻辑。布局、颜色与组件逻辑分开维护，但暂不引入复杂状态管理和后台系统。
