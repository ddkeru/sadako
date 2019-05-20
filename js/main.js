enchant();

var SCREEN_WIDTH = 480; // ゲーム画面の幅.
var SCREEN_HEIGHT = 640; // ゲーム画面の高さ.
var IMG_BG_WINDOW_STATUS = './img/windowstatus.png';	// ステータスウィンドウ背景画像.
var IMG_GAUGE_STATUS_HIDDEN = './img/windowstatusgauge.png';	// ステータスゲージ隠し画像.

// キャラを作成するクラス
var Chara = enchant.Class.create(enchant.Sprite, {
	    initialize: function (x, y, mode) {
        // 継承元をコール.
        enchant.Sprite.call(this, 96, 64);
        this.image = core.assets['./img/xxx.png'];
        this.x = x; // X座標.
        this.y = y; // Y座標.
        // ゲームのシーンにキャラボタンを追加.
        core.rootScene.addChild(this);
    }
});

// 壁を作成するクラス
var Wall = enchant.Class.create(enchant.Sprite, {
	    initialize: function (x, y, mode) {
        // 継承元をコール.
        enchant.Sprite.call(this, 80, 82);
        this.image = core.assets['./img/wall.png'];
        this.x = x; // X座標.
        this.y = y; // Y座標.
        // ゲームのシーンにキャラボタンを追加.
        core.rootScene.addChild(this);
    }
});

// バーチャルボタンを作成するクラス.
var Button = enchant.Class.create(enchant.Sprite, {
    // コンストラクタ.
    initialize: function (x, y, mode) {
        // 継承元をコール.
        enchant.Sprite.call(this, 50, 50);
        // バーチャルボタン画像を設定.
        this.image = core.assets['./img/button.png'];
        this.x = x; // X座標.
        this.y = y; // Y座標.
        this.buttonMode = mode; // ボタンモード.
        // ゲームのシーンにバーチャルボタンを追加.
        core.rootScene.addChild(this);
    }
});

// ステータスウィンドウを作成するクラス.
var StatusWindow = enchant.Class.create(enchant.Sprite, {
    // コンストラクタ.
    initialize: function (scene, x, y) {
        enchant.Sprite.call(this, 120, 124);	// 継承元をコール、幅と高さを設定.
        this.image = core.assets[IMG_BG_WINDOW_STATUS];	// ステータスウィンドウ画像を設定.
        this.x = x;	// X座標.
        this.y = y;	// Y座標.
        scene.addChild(this);	// シーンにステータスウィンドウを追加.

        var h = new Label("HP");
        h.color = '#f8f8f8';
        h.x = this.x + 12;
        h.y = this.y + 36;
        scene.addChild(h);

        hp = new Label("２３４");
        hp.color = '#f8f8f8';
        hp.x = this.x + 32;
        hp.y = this.y + 36;
        hp.width = 80;
        hp.textAlign = "right";
        scene.addChild(hp);

        hpMax = 9999;	// 最大HPの初期化.

        // HPゲージ隠し.
        hpHiddenGauge = new Sprite(1, 4);
        hpHiddenGauge.image = core.assets[IMG_GAUGE_STATUS_HIDDEN];
        hpHiddenGauge.x = this.x + 108;
        hpHiddenGauge.y = this.y + 58;
        hpHiddenGauge.width = 0;
        scene.addChild(hpHiddenGauge);
    },
    setHP: function (value) {
        hp.text = value.toString();	// 半角英数字文字列を全角文字列に変換する.
        this.setHPGauge();	// HPゲージ更新.
    },
    setHPGauge: function() {
        var hiddenGaugeX = 108 - (96 - ( ( hp * 96 ) / hpMax ) );
        if ( 107 < hiddenGaugeX ) {
        hpHiddenGauge.width = 0;	// 隠しゲージ幅を0にして見えないようにする.
        //hpHiddenGauge.visible = false;
        } else if ( 13 > hiddenGaugeX ) {
        hpHiddenGauge.x = this.x + 12;
        hpHiddenGauge.width = 96;
        } else {
        hpHiddenGauge.x = this.x + hiddenGaugeX;
        hpHiddenGauge.width = 108 - hiddenGaugeX;
        }
    }
});

window.onload = function () {
    // 表示領域を設定（幅と高さ）.
    core = new Core(SCREEN_WIDTH, SCREEN_HEIGHT);

    // frames（フレーム）per（毎）second（秒）、ゲーム進行スピードを設定.
    core.fps = 24;

    // pre（前）-load（読み込み）、ゲームで使用する素材を予め読込.
    core.preload('./img/xxx.png', './img/button.png','./img/wall.png', IMG_BG_WINDOW_STATUS, IMG_GAUGE_STATUS_HIDDEN,'./se/water-drop3.mp3');

    // メイン処理を実行.
    core.onload = function () {

        // ゲームのシーンにボタンを追加
        btnA = new Button(SCREEN_WIDTH - 60, SCREEN_HEIGHT - 100, 'A');
        btnB = new Button(SCREEN_WIDTH - 100, SCREEN_HEIGHT - 60, 'B');
        btnX = new Button(SCREEN_WIDTH - 100, SCREEN_HEIGHT - 140, 'Y');
        btnY = new Button(SCREEN_WIDTH - 140, SCREEN_HEIGHT - 100, 'X');
        btnS = new Button(SCREEN_WIDTH - 240, SCREEN_HEIGHT - 200, 'S');

        // バーチャルボタンをキーに割当て.
        core.keybind('D'.charCodeAt(0), 'A'); // ‘D’キーに割当て.
        core.keybind('S'.charCodeAt(0), 'B'); // ‘S’キーに割当て.
        core.keybind('W'.charCodeAt(0), 'Y'); // ‘W’キーに割当て.
        core.keybind('A'.charCodeAt(0), 'X'); // ‘A’キーに割当て.
        core.keybind('Q'.charCodeAt(0), 'S'); // ‘Q’キーに割当て.

        // キャラを配置、幅と高さを設定.
        var chara = new Chara(200, 0, 'chara');

        // ゲームのシーンに背景色を設定.
        core.rootScene.backgroundColor = '#80f0b8';

        // 壁を配置、幅と高さを設定.
        var wall = new Wall(200, 200, 'wall');
        var wall = new Wall(50, 100, 'wall');
        var wall = new Wall(350, 300, 'wall');
        var wall = new Wall(100, 400, 'wall');

        // ステータス表示時の効果音を設定.
		var sound = core.assets['./se/water-drop3.mp3'].clone();;

        // キャラの表示指定.
        chara.frame = 7;

        // キャラをキー入力で動かす.
        chara.onenterframe = function () {
            // 右キー押下中.
            if (core.input.right) {
                // X方向に1px移動.
                this.x += 5;
            }
            // 左キー押下中.
            if (core.input.left) {
                // X方向に1px移動.
                this.x -= 5;
            }
            // 上キー押下中.
            if (core.input.up) {
                // X方向に1px移動.
                this.y -= 5;
            }
            // 下キー押下中.
            if (core.input.down) {
                // X方向に1px移動.
                this.y += 5;
            }
            // Aボタン 右移動
            if (core.input.A) {
                this.x += 10;
            }
            // Bボタン 下移動
            if (core.input.B) {
                this.y += 10;
            }
            // Xボタン 左移動
            if (core.input.X) {
                this.x -= 10;
            }
            // Yボタン 上移動
            if (core.input.Y) {
                this.y -= 10;
            }
            // Qキー ステータス表示
            if (core.input.S) {
                core.pushScene(createScene());
        		sound.play();
            }
            
            // 衝突判定 キャラが壁にぶつかったら壁を消す
            Chara.intersect(Wall).forEach(function(pair)
            {
                //pair[0]: Charaのインスタンス
                //pair[1]: Wallのインスタンス
                core.rootScene.removeChild(pair[1]);
            });
        }
    }

    // ゲームをスタート.
    core.start();
}

/**
*   新しいシーンを作成する関数.
*/
function createScene() {
    var scene = new Scene();	// シーンを作成.
    var bg = new Sprite(0, 366);	// ステータス画像を配置、幅と高さを設定.
    bg.image = core.assets[IMG_BG_WINDOW_STATUS];	// 予め読込したステータス画像を設定.
    scene.addChild(bg);	// シーンにステータス画像を追加.

    var sw = new StatusWindow(scene, 0, 0);	// ステータスウィンドウを作成.
    sw.setHP('1000');



    // フレーム毎の処理.
    scene.addEventListener(Event.ENTER_FRAME, function (e) {
        // Sボタン押下中.
        if (!core.input.S) {
            // 現在表示しているシーンを外して直前のシーンを表示する.
            core.popScene();
        }
    });

    // 作成したシーンを返却.
    return scene;


}