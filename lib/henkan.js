'use strict'

const colors = require('colors');
const marked = require('marked');
const http = require('http');

const RECOM_TITLE_COUNT = 37; //推奨タイトル文字数
// let text = fs.readFileSync('./blog.md', 'utf8');
let renderer = new marked.Renderer();

// const URL = process.argv[2]+'.md';

//LIGブログ用に記号などの置換
function ligReplace(text){
  text = text.replace(/!!/g , "！！　" ) ;
  text = text.replace(/\?\?/g , "？？　" ) ;
  text = text.replace(/!\?/g , "！？　" ) ;
  text = text.replace(/\?/g , "？　" ) ;
  text = text.replace(/!/g , "！　" ) ;
  return text;
}

//<p>タグ
renderer.paragraph = (text) => {
  text = ligReplace(text);
  return `<p>${text}</p>`;
};

renderer.codespan = (text) => {
  return `<code class="command">${text}</code>`;
};

renderer.heading = (text, level) => {
  return `\n\n<h${level}>${text}</h${level}>\n`;
};

renderer.code = (code, lang) => {
  if(lang === 'lig-member') {
    //登場人物へ
    return member(code);
  }

  let type = "code";
  if (lang) {
    let langtype = lang.split(".")[1];
    if (langtype === "js") {
      type = "javascript";
    } else if (langtype === "php") {
      type = "php";
    } else if (langtype === "html") {
      type = "html";
    } else if (langtype === "css") {
      type = "css";
    } else if (langtype === "xml") {
      type = "xml";
    } else if (langtype === "swift") {
      type = "javascript";
    }
  }
  //通常の言語シンタックスハイライト
  return "\n[" + type + "]\n" + code + "\n[/" + type + "]\n\n";
};

function member(text){
  let tmp = text.split('\n');
  let name = tmp[0];
  let content = tmp[1];
  let image = tmp[2];
  if(!image) image = tmp[3];

  content = marked(content, {renderer: renderer});
  let template = `
  <table class="intro"><tbody><tr>
    <th>
      <img class="alignnone size-full wp-image-223322" src="${image}" alt="ico" width="120" height="120" />
    </th>
    <td>
    <strong>${name}</strong>
    ${content}
    </td>
  </tr></tbody></table>`;

  return template;
}

//画像
renderer.image = (href, title, text) => {
  return `<img src="${href}" alt="${text}" width="655px" />`;
};

//リンク
renderer.link = (href, title, text) => {
  let target = '';
  let htmlClass = '';

  //URLのみのテキストの場合
  if(text.indexOf('http') != -1){
    htmlClass = 'class="link"';
  }

  //URLが外部リンクの場合
  if(href.indexOf('liginc.co.jp') != 1){
    target = ' target="_blank"';
  }

  return `<a href="${href}" ${target} ${htmlClass}> ${text} </a>`;
};

function getTitle(text){
  return text.split('\n')[0];
}

//全ての処理の前
function beforeAction(text){
  let titleCount = getTitle(text).length;
  if(titleCount >= RECOM_TITLE_COUNT){
    console.log(`[注意]:タイトルが${titleCount}文字です。長すぎるかも`.yellow);
  }
  return text;
}

//全ての処理の後
function afterAction(text){
  // console.log(text.green);

  let title = text.split('</p>')[0];
  title = title.split('<p>')[1];
  text = text.replace(`<p>${title}</p>`,'');
  text = '```\n'+text+'\n```';
  let body = text;

  return {title:title,body:body};
}

module.exports = (url, cb) => {
  url = url+'.md';

  http.get(url, (res) => {
    let body = '';
    res.setEncoding('utf8');

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', (res) => {
      // console.log(body);
      let text = body;
      text = beforeAction(text);
      text = marked(text, {renderer: renderer});
      cb(afterAction(text));
    });
  }).on('error', (e) => {
    console.log(e.message); //エラー時
  });
}
