var assert = require("assert");
let Binder = require("../../src/binder").Binder;
import { execute } from "../../src/executor";

let p = require("../../src/util").p;
let experiments = require("../../src/experiments").experiments;
const fs = require("fs");
// fs.writeFileSync("./tmp/1.json", JSON.stringify(items, null, 2));

fs.mkdirSync("./tmp/dev");
describe("dev", function () {
  it("build", function () {
    let exp = experiments["空气中声速的测量"];
    let binder = new Binder(exp);

    let labItems = binder.getLabItems(true);
    fs.writeFileSync("./tmp/dev/0-labItems.json", JSON.stringify(labItems, null, 2));

    let stdInput = binder.getStdInput(labItems);
    fs.writeFileSync("./tmp/dev/stdInput.json", JSON.stringify(stdInput, null, 2));

    let stdOutput = binder.getStdOutput(labItems);
    fs.writeFileSync("./tmp/dev/stdOutput.json", JSON.stringify(stdOutput, null, 2));

    binder.calculateLabItems(labItems);
    fs.writeFileSync("./tmp/dev/1-labItems.json", JSON.stringify(labItems, null, 2));
  });
});
