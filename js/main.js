(function(){
  "use strit"
  
  //Web Font Loader
  window.WebFontConfig = {
    google: { families: ['Ibarra+Real+Nova','Monofett','Xanh+Mono'] },
    active: function() {
      sessionStorage.fonts = true;
    }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

  //DOMの取得
  const typed = document.getElementById("typed");
  const untype = document.getElementById("untype");
  const score = document.getElementById("score");
  const bad = document.getElementById("bad");
  const mean = document.getElementById("mean");
  const accuracy = document.getElementById("accuracy"); 
  const rate = document.getElementById("rate");
  const balloonRoom = document.getElementById("balloonroom");
  const hambarger = document.getElementById("hambarger");
  const overlay = document.getElementById("overlay");
  const close = document.getElementById("close");

  //サウンドエフェクト
  const typeSound = new Audio("sound/カタッ(Enterキーを押した音).mp3");
  typeSound.volume = 0.4;
  const resetSound = new Audio("sound/受話器置く03.mp3");
  resetSound.volume = 0.8;
  const bubbleSound = new Audio("sound/パッ.mp3");
  bubbleSound.volume = .9;

  //ミスタイプのキーリスト
  const missType = [];

  //正誤カウント
  let scoreCount = 0;
  let badCount = 0;
  let accuracyRate = 0;
  let continuousCorrect = 0;

    //iosの判定
    let ua = navigator.userAgent.toLowerCase();
    let isIOS = ua.indexOf("iphone") !== -1;

  //問題のセット
  function setQuestion(){
    const q = questions[Math.floor(Math.random() * questions.length)];
    untype.textContent = q.word;
    typed.textContent = "";
    mean.textContent = q.mean;
  };

  //音を鳴らす(ios以外)
  function playSound(sound){
    if(isIOS){
      return;
    };
    sound.currentTime = 0;
    sound.play();
  };

  //ボーナスアニメーション
  function getBonus(point){
    let bonus = document.createElement("div");
    bonus.className = "bonus";
    bonus.style.top = `${Math.random() * 40 + 40}%`;
    //左右どっちに作るか
    let LorR = Math.floor(Math.random() * 2);
    if(LorR === 0){
      bonus.style.left = `${Math.random() * 30}%`;
    } else {
      bonus.style.right = `${Math.random() * 30}%`;
    };
    bonus.textContent = `${point * 10}type`;
    bonus.style.width = `${point * 6 + 60}px`;
    bonus.style.height = `${point * 6 + 60}px`;
    bonus.style.lineHeight = `${point * 6 + 75}px`;
    bonus.style.fontSize = `${point * 1.5 + 16}px`;
    bonus.style.backgroundColor = `hsla(${Math.random() * 360}, 65%, 55%, .6)`;
    //アニメーションが全て終わったら消す
    let animeCount = 0;
    bonus.addEventListener("animationend",()=>{
      if(animeCount == 1){
        bonus.classList.add("disabled");
        return;
      };
      animeCount++;
      playSound(bubbleSound);
    });
    balloonRoom.appendChild(bonus);
    playSound(bubbleSound);
  };

  //パーセンテージの表示
  function renderRate(){
    accuracyRate = (scoreCount / (scoreCount + badCount) * 100).toFixed(2);
    accuracy.textContent = accuracyRate;
    rate.classList.remove("safe","caution","dead");
    if(accuracyRate >= 95){
      rate.classList.add("safe");
    } else if(accuracyRate >= 80){
      rate.classList.add("caution");
    } else {
      rate.classList.add("dead");
    };
  };
  
  //ミスしたキーのバルーンを作成
  function createBalloon(key){
    let balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.id = `${key}`;
    balloon.textContent = `${key}`;
    //問題文に被らないようにランダム配置
    let blocks = Math.floor(Math.random() * 7);
    if(blocks == 0){//上端ブロック
      balloon.style.top = `${Math.random() * 10 + 1}%`;
      balloon.style.left = `${Math.random() * 98 + 1}%`;
    } else if(blocks <= 2){//下端ブロック
      balloon.style.bottom = `${Math.random() * 20 + 1}%`;
      balloon.style.left = `${Math.random() * 98 + 1}%`;
    } else if(blocks <= 4){//左端ブロック
      balloon.style.top = `${Math.random() * 69 + 11}%`;
      balloon.style.left = `${Math.random() * 28 + 1}%`;
    } else {//右端ブロック
      balloon.style.top = `${Math.random() * 69 + 11}%`;
      balloon.style.right = `${Math.random() * 28 + 1}%`;
    };
    //カーソルをのせたら数値を表示
    balloon.addEventListener("mouseenter",()=>{
      balloon.style.fontSize = "10px";
      balloon.textContent += `:${missType.find((v) => v.key === balloon.textContent).num}`;
    });
    balloon.addEventListener("mouseleave",()=>{
      balloon.style.fontSize = "14px";
      balloon.textContent = `${key}`;
    });
    //クリックしたら破裂
    balloon.addEventListener("click",()=>{
      balloon.classList.add("explosion");
      playSound(bubbleSound);
      //アニメーションが終了したら要素を消す
      balloon.addEventListener("animationend",()=>{
        balloon.classList.add("disabled");
      });
    });
    balloonRoom.appendChild(balloon);
  };

  //ハンバーガーメニュー
  hambarger.addEventListener("click",()=>{
    overlay.classList.add("show");
    hambarger.classList.add("hidden");
  });
  close.addEventListener("click",()=>{
    overlay.classList.remove("show");
    hambarger.classList.remove("hidden");
  });

  //キーボードを叩いたら
  window.addEventListener("keydown",(e)=>{
    //ハンバーガーメニューを開いていたらリターン
    if(overlay.className === "show"){
      return;
    };

    //untypeの1文字目と一致していたら
    if(e.key === untype.textContent.charAt(0)){
      //untypeから削ってtypedに足す
      typed.textContent += "_";
      untype.textContent = untype.textContent.slice(1);

      //スコアを加点
      scoreCount++;
      continuousCorrect++;
      score.textContent = scoreCount;
      renderRate();

      //連続正解したらボーナス(10の倍数ごと)
      if((continuousCorrect % 10) == 0){
        getBonus(continuousCorrect / 10);
      };
      //文字を跳ねさせる
      score.classList.add("pyon");
      score.addEventListener("animationend",()=>{
        score.classList.remove("pyon");
      });

      //タイプ音を鳴らす
      playSound(typeSound);

      //もしuntypeが無くなったら次の問題へ
      if(untype.textContent.length === 0){
        setQuestion();
        playSound(resetSound);
      };

    } else { //ミスタイプした場合
      //ミスタイプに加点
      badCount++;
      continuousCorrect = 0;
      bad.textContent = badCount;
      renderRate();
      //文字を跳ねさせる
      bad.classList.add("pyon");
      bad.addEventListener("animationend",()=>{
        bad.classList.remove("pyon");
      });

      //ブザーを鳴らす
      playSound(bubbleSound);

      //ミスタイプのキーをカウント
      if(missType.find((v) => v.key === e.key)){ //すでにあるなら加点
        missType.find((v) => v.key === e.key).num++;
        const missKey = document.getElementById(`${e.key}`);
        //大きくする倍率指定
        missKey.style.transform = `scale(${(missType.find((v) => v.key === e.key).num) * 0.9})`;
        //破裂させたバルーンを復活
        missKey.classList.remove("explosion","disabled");
      } else { //初めてのミスキーカウント
        createBalloon(e.key);
        missType.push({
          key:e.key,
          num:1,
        });
      };//ミスタイプのキーをカウント
    };//ミスした場合
  });//キーボードを叩いたら

  //始めの問題をセット
  setQuestion();

})();