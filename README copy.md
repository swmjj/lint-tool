# dmlint


dmlint 是基于《阿里巴巴前端规约》的配套 Lint 工具[F2ELint](https://www.npmjs.com/package/f2elint) 二次开发，可以为项目一键接入规约、一键扫描和修复规约问题，保障项目的编码规范和代码质量。


与F2ELint相比，有如下修改

* 支持交互式git commit功能，添加commitizen配置
* vue框架，以strongly-recommended作为规约
* 定制代码格式化标准
* 添加css属性排序
* 添加自动生成changelog功能
* 获取配置模板由本地获取为从gitlab拉取
* 去除markdownlint
* 去除prettier格式化，使用eslint作为代码格式化工具
* 添加vue、react，vscode调试模板launch.json

## TODO：

- [ ] 支持增量更新配置，原有配置基础

## 背景

我们引入了多个业界流行的 Linter 作为《阿里巴巴前端规约》的配套，并根据规约内容定制了规则包，它们包括：

| 规约                                                                                                                  | Lint工具                                       | 规则包                                                                       |
|---------------------------------------------------------------------------------------------------------------------|------------------------------------------------|------------------------------------------------------------------------------|
| 《JavaScript 编码规约》 <br/>《TypeScript 编码规约》 <br/> 《React 编码规约》 <br/> 《Rax 编码规约》 <br/> 《Node.js 开发规约》 | [ESLint](https://eslint.org/)                  | [eslint-config-ali](https://www.npmjs.com/package/eslint-config-ali)         |
| 《CSS 编码规约》                                                                                                        | [stylelint](https://stylelint.io/)             | [stylelint-config-ali](https://www.npmjs.com/package/stylelint-config-ali)   |
| 《Git 规约》                                                                                                            | [commitlint](https://commitlint.js.org/#/)     | [commitlint-config-ali](https://www.npmjs.com/package/commitlint-config-ali) |
| Vue 编码规范                                                                                                          | [eslint-plugin-vue](https://eslint.vuejs.org/) | [vue/strongly-recommended](https://eslint.vuejs.org/user-guide/#usage)       |



可以看到这些 Linter 和规则包众多且零散，全部安装它们会给项目增加十几个依赖，接入和升级成本都比较高。

dmlint 收敛屏蔽了这些依赖和配置细节，提供简单的 CLI 和 Node.js API，让项目能够一键接入、一键扫描、一键修复、一键升级，并为项目配置 git commit 卡口，降低项目接入规约的成本。

## CLI 使用

### 安装

在终端执行：

```bash
npm install npx -g
npm install commitizen -g
npm install dmlint -g
```

安装完成后，可执行 `dmlint -h` 以验证安装成功。


### 编辑器默认 vsocde
vscode 安装ESlint  Stylelint插件

ps：默认安装_vscode配置，以ESLint作为格式化工具

### 使用


#### `dmlint init`：一键接入

在项目根目录执行 `dmlint init`，即可一键接入规约，为项目安装规约 Lint 所需的依赖和配置。

![dmlint init](/public/5761668072818_.pic.jpg)

具体会做以下事情：

- 安装各种依赖：包括 Linter 依赖，如 [ESLint](https://eslint.org/)、[stylelint](https://stylelint.io/)、[commitlint](https://commitlint.js.org/#/) 等；配置依赖，如 [eslint-config-ali](https://www.npmjs.com/package/eslint-config-ali)、[stylelint-config-ali](https://www.npmjs.com/package/stylelint-config-ali)、[commitlint-config-ali](https://www.npmjs.com/package/commitlint-config-ali) 等
- 写入各种配置文件，包括：
  - `.eslintrc.js`、`.eslintignore`：ESLint 配置（继承 eslint-config-ali）及黑名单文件
  - `.stylelintrc.js`、`.stylelintignore`：stylelint 配置（继承 stylelint-config-ali）及黑名单文件
  - `.commitlintrc.js`：commitlint 配置（继承 commitlint-config-ali）
  - `.editorconfig`：符合规约的 [editorconfig](https://editorconfig.org/)
  - `.vscode/extensions.json`：写入规约相关的 [VSCode 插件推荐](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions)，包括 ESLint、stylelint、markdownlint、prettier 等
  - `.vscode/settings.json`：写入规约相关的 [VSCode 设置](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations)，设置 ESLint 和 stylelint 插件的 validate 及**保存时自动运行 fix**，如果选择使用 Prettier，会同时将 prettier-vscode 插件设置为各前端语言的 defaultFormatter，并配置**保存时自动格式化**
  - `dmlint.config.js`：dmlint 包的一些配置，如启用的功能等
- 配置 git commit 卡口：使用 [husky](https://www.npmjs.com/package/husky) 设置代码提交卡口，在 git commit 时会运行 `dmlint commit-file-scan` 和 `dmlint commit-msg-scan` 分别对提交文件和提交信息进行规约检查。`dmlint commit-file-scan` 默认仅对 error 问题卡口，如果你想对 warn 问题也卡口，可以增加 `--strict` 参数以开启严格模式

> 注 1：如果项目已经配置过 ESLint、stylelint 等 Linter，执行 `dmlint init` 将会提示存在冲突的依赖和配置，并在得到确认后进行覆盖：
> ![conflict resolve](/public/5751668072818_.pic.jpg)
>
> 注 2：如果项目的 .vscode/ 目录被 .gitignore 忽略，可以在拉取项目后单独执行 `dmlint init --vscode` 命令写入 `.vscode/extensions.json` 和 `.vscode/settings.json` 配置文件

#### `dmlint scan`：一键扫描

在项目的根目录执行命令，即可扫描项目的规约问题：

![dmlint scan](/public/5771668072956_.pic.jpg)

支持下列参数：

- `-q` `--quiet` 仅报告 error 级别的问题
- `-o` `--output-report` 输出扫描出的规约问题日志
- `-i` `--include <dirpath>` 指定要进行规约扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则

> 注 1：事实上，你可以在任意目录执行 `dmlint scan`，dmlint 会根据文件类型、JSON 等特征嗅探项目类型。但我们还是推荐在执行过 `dmlint init` 的项目根目录执行 `dmlint scan`，以得到最准确的扫描结果。
>
> 注 2：dmlint 会根据项目内有无 eslint 和 stylelint 配置文件判断使用项目的配置文件还是 dmlint 默认配置进行扫描。若使用项目的，在未安装依赖时会帮其安装（执行 npm i）。若使用项目配置扫描失败，则使用默认配置扫描

#### `dmlint fix`：一键修复

在项目的根目录执行命令，即可修复部分规约问题：

![dmlint fix](/public/5781668072995_.pic.jpg)

支持下列参数：

- `-i` `--include <dirpath>` 指定要进行修复扫描的目录
- `--no-ignore` 忽略 eslint 的 ignore 配置文件和 ignore 规则

注意请 review 下修复前后的代码，以免工具误修的情况。

#### `dmlint commit-file-scan` 提交文件扫描

在 git commit 时对提交文件进行规约问题扫描，需配合 git 的 pre-commit 钩子使用。

支持下列参数：

- `-s` `--strict` 严格模式，对 warn 和 error 问题都卡口，默认仅对 error 问题卡口

#### `dmlint commit-msg-scan` 提交信息扫描

git commit 时对 commit message 的格式进行扫描（使用 commitlint），需配合 [husky](https://www.npmjs.com/package/husky) 的 commit-msg 钩子使用。


#### `git cz`：commit 信息生成
```
git cz
```

当完成开发工作，需要commit时，执行git cz，打开commit工具，约束团队的commit记录


#### `changelog`: 根据commit信息，生成修改日志
```
npm run changelog
```

会更加项目commit 日志，生成changelog文件，记录项目的修改日志


## 常见问题

### TypeScript 项目扫描性能问题

如果你的 TS 项目 commit 卡口和 `dmlint scan` 运行时间很长，可以通过如下在 .eslintrc.js 中增加以下配置提升性能：

```js
module.exports = {
  parserOptions: {
    project: [], // for lint performance
    createDefaultProgram: false, // for lint performance
  },
  rules: {
    '@typescript-eslint/dot-notation': 0, // for lint performance
    '@typescript-eslint/restrict-plus-operands': 0, // for lint performance
  },
};
```
