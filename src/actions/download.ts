import path from 'path';
import axios from 'axios';
import fs from 'fs-extra';
import log from '../utils/log';

// 配置模板仓库
// https://gitlab.dm-ai.cn/smart-city/intellisense/reference/dmlint-config-template

// 个人token
const token = 'mUNYWTNTEwxqJeKz2PAs';
// gitlab项目id
const projectId = '6722';
// 获取仓库文件目录
const getRepositoryTreeApi = `https://gitlab.dm-ai.cn/api/v4/projects/${projectId}/repository/tree`;
// 获取文件内容
const getFileContentApi = (filePath: string) => {
  return `https://gitlab.dm-ai.cn/api/v4/projects/6722/repository/files/${encodeURIComponent(filePath)}/raw`;
};

function downloadAction(file) {
  return new Promise((resolve, reject) => {
    axios.request({
      url: getFileContentApi(file.path),
      headers: {
        'PRIVATE-TOKEN': token,
      },
      params: {
        ref: 'master',
      },
    }).then((res) => {
      const savePath = path.join(__dirname, `../${file.path}`);
      const text = res.data.toString();
      fs.outputFile(savePath, text, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

// 远程下载配置模板
export default async () => {
  const filesInfo = await axios.request({
    url: getRepositoryTreeApi,
    headers: {
      'PRIVATE-TOKEN': token,
    },
    params: {
      recursive: true,
      path: 'config',
    },
  });
  const files = filesInfo.data;
  const requestFiles = [];
  files.forEach((item) => {
    if (item.path !== 'config/_vscode') {
      requestFiles.push(
        downloadAction(item),
      );
    }
  });
  try {
    const result = await Promise.all(requestFiles);
    log.success('模板地址: https://gitlab.dm-ai.cn/smart-city/intellisense/reference/dmlint-config-template :D');
    log.success('配置远程模板拉取成功 :D');
    return result;
  } catch (e) {
    log.error('配置模板拉取失败 :D');
  }
};
