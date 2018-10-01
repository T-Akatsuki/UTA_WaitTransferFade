//=============================================================================
// UTA_WaitTransferFade.js
//=============================================================================
/*:
 * @plugindesc This plugin make to wait until the fade effect of "player transfer" process is over.
 * @author T.Akatsuki
 * 
 * @help # Overview
 * Restrict movement of characters when "Transfer Player" process fade.
 * Wait until fade process is over.
 * 
 * This plugin solve the trouble that unexpected event will be done during 
 * fade processing.
 * 
 * # Plugin Commands
 * This plugin does not provide plugin commands.
 * 
 * # Plugin Info
 * Version     : 1.0.0
 * Last Update : August 20th, 2018
 * Author      : T.Akatsuki
 * Web Page    : https://www.utakata-no-yume.net
 * License     : MIT License
 * (https://www.utakata-no-yume.net/gallery/rpgmv/plugin/license.html)
 * 
 * # Change Log
 * ver 1.0.0 (August 20th, 2018)
 *   First release.
 */
/*:ja
 * @plugindesc 場所移動フェードが完了するまでウェイトさせます。
 * @author 赤月 智平
 * 
 * @help ■プラグインの概要
 * 場所移動のフェード中にキャラクターの移動を制限し、
 * フェードが終わるまでウェイトさせるようにします。
 * これによってフェード中にイベントが暴発するなどのトラブルを避ける事ができます。
 * 
 * プラグイン管理から[ON]に設定するだけで利用できます。
 * 
 * ■プラグインコマンド
 * プラグインコマンドはありません。
 * 
 * ■プラグインの情報
 * バージョン : 1.0.0
 * 最終更新日 : 2018.08.20
 * 制作者     : 赤月 智平
 * Webサイト  : https://www.utakata-no-yume.net
 * ライセンス : MIT License
 * (https://www.utakata-no-yume.net/gallery/rpgmv/plugin/license.html)
 * 
 * ■更新履歴
 * ver 1.0.0 (2018.08.20)
 *   初版。
 */
//=============================================================================

var utakata = utakata || {};
(function(utakata){
    "use strict";
    utakata.WaitTransferFade = (function(){
        var __PLUGIN_NAME__ = "UTA_WaitTransferFade";
        var __VERSION__     = "1.0.0";

        function WaitTransferFade(){
            throw "utakata.WaitTransferFade is static class.";
        }

        WaitTransferFade.initialize = function(){
            /**
             * Game_Map
             * 画面フェード時を判別する為のフラグ_isTransferFadeを追加
             */
            var _Game_Map_initialize = Game_Map.prototype.initialize;
            Game_Map.prototype.initialize = function(){
                _Game_Map_initialize.call(this);
                this._isTransferFade = true;
            };

            Game_Map.prototype.isTransferFade = function(){
                return this._isTransferFade;
            };

            Game_Map.prototype.setTransferFade = function(isFade){
                this._isTransferFade = isFade;
            };

            /**
             * Scene_Map
             * 画面移動フェードが完了するまで$gameMap._isTransferFadeフラグをtrueにする
             * 画面移動フェード完了後、falseに戻す
             */
            var _Scene_Map_fadeOutForTransfer = Scene_Map.prototype.fadeOutForTransfer;
            Scene_Map.prototype.fadeOutForTransfer = function(){
                var fadeType = $gamePlayer.fadeType();
                switch(fadeType){
                    case 0:
                    case 1:
                        $gameMap.setTransferFade(true);
                        break;
                }
                _Scene_Map_fadeOutForTransfer.call(this);
            };

            var _Scene_Map_fadeInForTransfer = Scene_Map.prototype.fadeInForTransfer;
            Scene_Map.prototype.fadeInForTransfer = function(){
                var fadeType = $gamePlayer.fadeType();
                switch(fadeType){
                    case 0:
                    case 1:
                        $gameMap.setTransferFade(true);
                        break;
                }
                _Scene_Map_fadeInForTransfer.call(this);
            };

            Scene_Map.prototype._updateFadeTransfer = function(){
                if(!$gameMap.isTransferFade()){
                    return;
                }
                if(this._fadeDuration <= 0){
                    $gameMap.setTransferFade(false);
                }
            };

            var _Scene_Map_update = Scene_Map.prototype.update;
            Scene_Map.prototype.update = function(){
                _Scene_Map_update.call(this);
                this._updateFadeTransfer();
            };

            /**
             * Game_Player
             * 画面切り替えフェード中は行動を許可しない
             */
            var _Game_Player_canMove = Game_Player.prototype.canMove;
            Game_Player.prototype.canMove = function(){
                var ret = _Game_Player_canMove.call(this);
                ret = ret && !$gameMap.isTransferFade();
                return ret;
            };

            /**
             * Game_Event
             * 画面切り替えフェード中は行動を許可しない
             */
            Game_Event.prototype.canMove = function(){
                if($gameMap.isTransferFade()){
                    return false;
                }
                return true;
            };

            var _Game_Event_moveRandom = Game_Event.prototype.moveRandom;
            Game_Event.prototype.moveRandom = function(){
                if($gameMap.isTransferFade()){
                    return;
                }
                _Game_Event_moveRandom.call(this);
            };

            var _Game_Event_moveTypeRandom = Game_Event.prototype.moveTypeRandom;
            Game_Event.prototype.moveTypeRandom = function(){
                if($gameMap.isTransferFade()){
                    return;
                }
                _Game_Event_moveTypeRandom.call(this);
            };

            var _Game_Event_moveForward = Game_Event.prototype.moveForward;
            Game_Event.prototype.moveForward = function(){
                if($gameMap.isTransferFade()){
                    return;
                }
                _Game_Event_moveForward.call(this);
            };

            var _Game_Event_moveTowardPlayer = Game_Event.prototype.moveTowardPlayer;
            Game_Event.prototype.moveTowardPlayer = function(){
                if($gameMap.isTransferFade()){
                    return;
                }
                _Game_Event_moveTowardPlayer.call(this);
            };
            
            var _Game_Event_moveTypeCustom = Game_Event.prototype.moveTypeCustom;
            Game_Event.prototype.moveTypeCustom = function(){
                if($gameMap.isTransferFade()){
                    return;
                }
                _Game_Event_moveTypeCustom.call(this);
            };
        };

        WaitTransferFade.getPluginName = function(){ return __PLUGIN_NAME__; };
        WaitTransferFade.getPluginVersion = function(){ return __VERSION__; };

        return WaitTransferFade;
    })();
    utakata.WaitTransferFade.initialize();
})(utakata);
