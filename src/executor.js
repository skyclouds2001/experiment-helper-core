const mathjs = require("mathjs");
const math = mathjs.create(mathjs.all, { number: "BigNumber", matrix: "Array" });
import { Interpreter } from "eval5";

function getParser(functions) {
  function smartlab_ua(arr) {
    let n = arr.length;

    let t_factor = [0, 0, 1.84, 1.32, 1.2, 1.14, 1.11, 1.09, 1.08];
    let t;
    if (n < t_factor.length) {
      t = t_factor[n];
    } else {
      t = 1;
    }

    let avernum = mathjs.mean(arr);

    let s = 0; //残差平方之和
    for (const v of arr) {
      s += mathjs.pow(v - avernum, 2);
    }

    let sx = mathjs.sqrt(s / ((n - 1) * n)) * t;
    return sx;
  }

  function smartlab_u(arr, uncertainty_yq) {
    let uncertainty_a = smartlab_ua(arr);
    return Math.sqrt(Math.pow(uncertainty_a, 2) + Math.pow(uncertainty_yq, 2) / 3);
  }

  const parser = math.parser();

  const internal = {
    smartlab_g: math.bignumber(9.8),
    smartlab_ua: smartlab_ua,
    smartlab_u: smartlab_u
  };

  for (let fName in internal) {
    parser.set(fName, internal[fName]);
  }

  const interpreter = new Interpreter();
  for (let fName in functions) {
    parser.set(fName, interpreter.evaluate(functions[fName]));
  }

  return parser;
}

export function execute(logic, std_input) {
  const parser = getParser(logic["functions"]);

  let stdOutput = {};

  for (let x of logic["variables"]) {
    let value;
    switch (x["source"]["type"]) {
      case "input":
        if (x["name"] in std_input) {
          value = std_input[x["name"]];
        } else {
          value = x["source"]["default"];
        }
        parser.set(x["name"], math.bignumber(value));
        break;
      case "mathjs":
        value = parser.evaluate(x["source"]["expression"]);

        if (typeof value != "string") {
          parser.set(x["name"], math.bignumber(value));
          stdOutput[x["name"]] = math.number(value);
        } else {
          parser.set(x["name"], value);
          stdOutput[x["name"]] = value;
        }

        break;
      case "mathjs-suffix":
        let x_name = x["name"];
        let pos = x_name.lastIndexOf("_");

        let name = x_name.slice(0, pos);
        let fun = x_name.slice(pos + 1, x_name.length);

        let expression = "";
        switch (fun) {
          case "a":
            expression = `mean(${name})`;
            break;
          case "ua":
            expression = `smartlab_ua(${name})`;
            break;
          default:
            console.error("mathjs-suffix: unsupport fun", x);
        }
        value = parser.evaluate(expression);

        if (typeof value != "string") {
          parser.set(x["name"], math.bignumber(value));
          stdOutput[x["name"]] = math.number(value);
        } else {
          parser.set(x["name"], value);
          stdOutput[x["name"]] = value;
        }

        break;
      default:
        console.error("unsupport source type", x);
    }
  }

  // console.log(parser.getAll());

  return stdOutput;
}
