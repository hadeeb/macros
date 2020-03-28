import classnames from "../../macro";

const z = "cls2";
const y = false;
const x = {};
let w = "cls3";
let v = true;

let a = classnames("cls1");

let b = classnames("cls1", "cls2");

let c = classnames("cls1", null, "cls2");

let d = classnames("cls1", z);

let e = classnames(y ? "cls1" : "", "cls2");

let f = classnames(v ? "cls1" : "cls2");

let g = classnames("cls1", v && w, v && z);

let h = classnames(w, x.a);

w = "cls4";
v = false;
