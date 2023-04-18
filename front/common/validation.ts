import * as React from "react";
import * as Config from "./config";
import axios from "axios";

interface Types {
  [key: string]: any;
}

const checkLoginID = async (LoginID: string) => {
  return axios.get(`${Config.API_ROOT}api/member/duplicate?LoginID=${LoginID}`)
  // return axios.get(`${Config.API_ROOT}api/Member/duplicate.php?LoginID=${LoginID}`)
}

// DBと連携
const apis: Types = {
  loginid: checkLoginID
}

// メッセージ一覧「日本語」
const messages: Types = {
	required: "{text}は必須です",
  min: "{from}文字以上で入力してください",
  max: "{to}文字以下で入力してください",
  range: "{from}文字以上{to}文字以下で入力してください",
  numonly: "数字のみで入力してください",
  hankaku: "半角英数字のみで入力してください",
  hanei: "半角英数記号のみで入力してください",
  hiragana: "ひらがなで入力してください",
  katakana: "カタカナで入力してください",
  url: "有効なURLを入力してください",
  email: "有効なEメールアドレスを入力してください",
  date: "有効な日付を入力してください",
  postal: "有効な郵便番号を入力してください",
  telno: "有効な電話番号を入力してください",
  phoneno: "有効な携帯電話番号を入力してください",
  loginid: "4文字以上20文字以内、半角英数記号のみで入力してください",
  loginid_x: "4文字以上20文字以内、半角英数記号のみで入力してください",
  password: "半角英数字記号をそれぞれ1種類以上含む6文字以上となるよう入力してください",
}

// 正規表現
const regexps: Types = {
  numonly: "^(|-)[0-9]+$",
  hankaku: "^[0-9a-zA-Z]+$",
  hanei: "^[a-zA-Z0-9!-/:-@¥[-`{-~]*$",
  hiragana: "^[\u3040-\u309F]+$",
  katakana: "^[\u30A0-\u30FF]+$",
  url: "^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$",
  email: "^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
  date: "^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$",
  postal: "^[0-9]+$", //^[0-9]{3}-[0-9]{4}$ <-　ハイフンあり
  telno: "^[0-9]+$", //\d{2,4}-\d{2,4}-\d{4} <-　ハイフンあり
  phoneno: "^0[5789]0[0-9]{8}$", //^0[5789]0-[0-9]{4}-[0-9]{4}$ <-　ハイフンあり
  loginid: "^[a-zA-Z0-9!-/:-@¥[-`{-~]{4,20}$",
  password: "^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!&$%&? \"]).*$",
}

const getValidation = (target: string | undefined, range?: any) => {

  return {
    regexp: (target) ? format(messages[target], regexps[target], range).regexp : "",
    message: (target) ? format(messages[target], regexps[target], range).message : ""
  }
}

const checkValidation = async (value: string, label: string | null | undefined, regexp: string | undefined, isRequired: boolean | null | undefined, range?: any) => {

  let ret = {
    result: true,
    message: "",
    label: label
  }

  const gvs = getValidation(regexp, range);

  // 必須チェック
  if (isRequired === true) {
    // 入力がなければ以下のメッセージを返す
    if (!value) {
      ret.result = false;
      ret.message = messages.required.replace(/\{text\}/, (label) ? label : "この項目");
      return ret;
    }
  }

  // 指定がない場合は無視
  if (regexp === undefined) {
    return ret;
  }

  const regex = new RegExp(escape(gvs.regexp));
  // チェック
  if (value && !regex.test(value)) {

    ret.result = false;
    ret.message = format(gvs.message, gvs.regexp, range).message;

    return ret;
  }

  // 入力チェックのあとDBと連携する場合
  if (value && typeof apis[regexp] === "function") {
    const res = await apis[regexp](value)
    ret.result = !res.data.result;
    ret.message = format(res.data.message, gvs.regexp, range).message;
    return ret;
  }

  return ret;
}

const format = function(message: string, regexp: string, range?: any) {

  let isChange = false;

  // 何文字以上
  if (range && range.from && message.match(/\{from\}/)) {

    message = message.replace(/\{from\}/, range.from);
    isChange = true;
  }

  // 何文字以下
  if (range && range.to && message.match(/\{to\}/)) {

    message = message.replace(/\{to\}/, range.to);
    isChange = true;
  }

  if (isChange) {
    regexp = `^[!-~]{${range.from},${range.to}}$`;
  }

  return {
    message: message,
    regexp: regexp
  };
}

const escape = function (value: string) {
  return value
          .replace(/\'/g, "\\'")
          .replace(/\"/g, '\\"')
          .replace(/\//g, '\\/')
}

export {
  getValidation,
  checkValidation
}