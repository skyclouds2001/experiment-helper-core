/*
 * @Author: HaoTian Qi
 * @Date: 2021-10-09 21:49:31
 * @Description:
 * @LastEditTime: 2021-10-31 15:47:48
 * @LastEditors: HaoTian Qi
 */

const fs = require("fs");

let dirTmp = "./tmp";

if (fs.existsSync(dirTmp)) {
  fs.rmSync(dirTmp, { recursive: true });
}
fs.mkdirSync(dirTmp);

// require("./debug/test");

// require("./dev/test");

require("./exp/test");
