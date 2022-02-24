"use strit"
{
  //DOMの取得
  const typed = document.getElementById("typed");
  const untype = document.getElementById("untype");
  const score = document.getElementById("score");
  const bad = document.getElementById("bad");
  const miss = document.getElementById("miss");
  const accuracy = document.getElementById("accuracy"); 
  const ar = document.getElementById("ar");

  //サウンドエフェクト
  const typeSound = new Audio("sound/カタッ(Enterキーを押した音).mp3");
  typeSound.volume = 0.5;
  const resetSound = new Audio("sound/受話器置く03.mp3");
  const badSound = new Audio("sound/クイズ不正解1.mp3");
  badSound.volume = .7;

  //ミスタイプのキーリスト
  const missType = [];

  let mt;

  //問題集
  const questions = [
    "helloworld",
    "googlechrome",
    "google",
    "facebook",
    "amazon",
    "apple",
    "microsoft",
    "javascript",
    "cascadingstylesheets",
    "hypertextmarkuplanguage",
    "usestrict",
    "document",
    "listener",
    "getelementbyid",
    "textcontent",
    "addeventlistener",
    "current",
    "function",
    "font-family",
    "font-size",
    "justify-content",
    "padding",
    "margin",
    "display",
    "stylesheet",
    "text-align",
    "index.html",
    "main.js",
    "style.css",
    "referenceerror",
    "console",
    "window",
    "github",
    "viewport",
    "charset",
    "header",
    "body",
    "footer",
    "aside",
    "typography",
    "return",
    "true",
    "false",
    "documentobjectmodel",
    "classlist",
    "foreach",
    "new",
    "constructor",
    "this",
    "transition",
    "transform",
    "div",
    "title",
    "math",
    "random",
    "length",

  ];

  //正誤カウント
  let scoreCount =0;
  let badCount = 0;
  let accuracyRate;

  //問題のセット
  function q(){
    untype.textContent = questions[Math.floor(Math.random() * questions.length)];
    typed.textContent = "";
  };
  
  //キーボードを叩いたら
  window.addEventListener("keydown",(e)=>{
    //untypeの1文字目と一致していたら
    if(e.key === untype.textContent.charAt(0)){
      //untypeから削ってtypedに足す
      // typed.textContent += untype.textContent.charAt(0);
      typed.textContent += "_";
      untype.textContent = untype.textContent.slice(1);

      //スコアを加点
      scoreCount++;
      score.textContent = scoreCount;
      rate();

      //タイプ音を鳴らす
      typeSound.currentTime = 0;
      typeSound.play();

      //もしuntypeが無くなったら次の問題へ
      if(untype.textContent.length === 0){
        q();
        resetSound.currentTime = 0;
        resetSound.play();
      };

    } else { //ミスタイプした場合
      //ミスタイプに加点
      badCount++;
      bad.textContent = badCount;
      rate();

      //ブザーを鳴らす
      badSound.currentTime = 0;
      badSound.play();

      //ミスタイプのキーをカウント
      if(miss.textContent.match(e.key)){ //すでにあるなら加点
        mt = missType.find((v) => v.key === e.key).num;
        miss.textContent = miss.textContent.replace(`${e.key}:${mt}`,`${e.key}:${mt + 1}`);
        missType.find((v) => v.key === e.key).num++;
      } else { //初めてのカウント
        missType.push({
          key:e.key,
          num:1,
        });
        miss.textContent += `${missType[missType.length - 1].key}:${missType[missType.length - 1].num}  `;
      };
    };
  });

    //パーセンテージの表示
    function rate(){
      let accuracyRate = (scoreCount / (scoreCount + badCount) * 100).toFixed(2);
      accuracy.textContent = accuracyRate;
      ar.classList.remove("safe","caution","dead");
      if(accuracyRate >= 95){
        ar.classList.add("safe");
      } else if(accuracyRate >= 80){
        ar.classList.add("caution");
      } else {
        ar.classList.add("dead");
      };
    };

  //始めの問題をセット
  q();
}