declare let hGame;

// 唯一的小伙伴对象
let hGameHdl:any;

module nn {
    
    // 小伙伴游戏中心
    // 老家: http://open.hgame.com
    // 文档: http://open.hgame.com/doc/index
    
    export class ServiceXHB
    extends svc.Service
    {
        constructor() {
            super();
        }

        /** 小伙伴支付需要 gamekey 作为参数 */
        static GameKey:string;
        
        static ID:string = "::wybosys::xiaohuoban";
        static DESCRIPTION = {NAME:'小伙伴平台', CONTACT:'客服QQ:800098876'};

        // 当前的渠道
        static PLATFORM:string = "wybosys";
        static PLATFORMID:svc.Platform;

        // 价格信息
        static PAYUNIT:string = '元';
        static PAYRATE:number = 1;

        static Prepare(cb:()=>void, ctx:any) {
            // 如果在其他地方已经初始化，则直接返回
            if (hGameHdl) {
                cb.call(ctx);
                return;
            }
            
            // 使用n2build直接添加sdk的引用到index.html中
            try
            {
                let xhb = new hGame({'game_key':this.GameKey,
                                     'debug':ISDEBUG});
                let queue = new OperationQueue();
                // 初始化
                queue.add(new OperationClosure((oper:Operation)=>{
                    xhb.ready(function() {
                        hGameHdl = xhb;
                        oper.done();
                    });
                }));
                // 获得当前的平台信息
                queue.add(new OperationClosure((oper:Operation)=>{
                    hGameHdl.getPlatform((result)=>{
                        let d = result.data;
                        
                        this.PLATFORM = d.platform.toUpperCase();
                        switch (this.PLATFORM) {                            
                        case 'wybosys': case 'HGAME':
                            this.PLATFORMID = svc.Platform.XHB; break;
                        case 'WANBA':
                            this.PLATFORMID = svc.Platform.WANBA; break;
                        case 'QQGAME':
                            this.PLATFORMID = svc.Platform.QQGAME; break;
                        case 'QQBROWSER':
                            this.PLATFORMID = svc.Platform.QQBROWSER; break;
                        case 'X360':
                            this.PLATFORMID = svc.Platform.X360; break;
                        case 'X360ZS':
                            this.PLATFORMID = svc.Platform.X360ZS; break;
                        }            
                        
                        if ('payUnit' in d)
                            this.PAYUNIT = d.payUnit;
                        if ('payRate' in d)
                            this.PAYRATE = d.payRate;
                        oper.done();
                    })
                }));
                // 回调
                queue.add(new OperationClosure((oper:Operation)=>{
                    cb.call(ctx);
                }));
            }
            catch (err)
            {
                exception(err);
                hGameHdl = null;
                cb.call(ctx);
            }
        }

        protected _doResult(result:any, c:svc.Content,
                            suc:(data:any)=>void,
                            failed?:(err:Failed)=>void)
        {
            if (result.code == 0) {
                suc(result.data);
                c.signals.emit(SignalSucceed);
            } else {
                let err = new Failed(result.code, result.message, result.showMessage);
                if (failed)
                    failed(err);
                c.signals.emit(SignalFailed, err);
            }
            c.dispose();
        }

        // 平台的状态数据
        private _dataStatus:any;
        
        support(feature:svc.Feature):boolean {
            let sup:boolean;
            switch (feature) {
            case svc.Feature.PAY:
            case svc.Feature.PROFILE:
            case svc.Feature.AUTH:
            case svc.Feature.LOGIN:
            case svc.Feature.LOGOUT:
            case svc.Feature.CUSTOMER:
            case svc.Feature.REPORT: {
                sup = true;
            } break;
            case svc.Feature.LANZUAN:
            {
                sup = true;
            }
                break;
            case svc.Feature.SHARE: {
                sup = 'share' in this._dataStatus;
                if (sup) {
                    // 如果是0，代表分享次数使用完，则不能分享
                    let count = ObjectT.GetValueByKeyPath(this._dataStatus, 'share.status', 1);
                    sup = count > 0;
                }
            } break;
            case svc.Feature.GETAPP: {
                sup = 'client' in this._dataStatus;
            } break;                
            case svc.Feature.DESKTOP: {
                sup = 'toDesktop' in this._dataStatus;
            } break;
            case svc.Feature.BBS: {
                sup = 'bbs' in this._dataStatus;
            } break;
            case svc.Feature.SUBSCRIBE: {
                sup = 'subscribe' in this._dataStatus;
            } break;
            case svc.Feature.BIND: {
                sup = 'bindPhone' in this._dataStatus;
            } break;
            case svc.Feature.SWITCHUSER: {
                hGameHdl.changeAccount({open_id:this._pid, action:'query'}, (result:any)=>{
                    sup = result.code == 0;
                });
            } break;
            default: {
                sup = false;
            } break;
            }
            return sup;
        }

        pay(c:svc.PayContent) {
            hGameHdl.pay(toJsonObject(c.data), null, (result:any)=>{
                this._doResult(result, c, (data:any)=>{                    
                }, (err:Failed)=>{
                    Hud.Text(err.locationMessage);
                });
            });
        }

        payable(price:number):boolean {
            // QQ浏览器iOS渠道限制金额要小于388
            if (Device.shared.isIOS &&
                ServiceXHB.PLATFORMID == svc.Platform.QQBROWSER)
                return price < 388;
            return true;
        }

        share(c:svc.ShareContent) {
            let data:any;
            if (c.data) {
                data = toJsonObject(c.data);
            } else {
                data = {
                    open_id:this._pid,
                    title:c.title,
                    message:c.detail,
                    imgUrl:c.image,
                    url:c.url,
                    extend:{}
                };
            }
            hGameHdl.doExtraAction('share', data, (result:any)=>{
                this._doResult(result, c, (data:any)=>{
                    this._setStatus('share.status', 0);
                });
            });
        }
        
        profile(c:svc.ProfileContent) {
            hGameHdl.getUserInfo((result:any)=>{
                this._doResult(result, c, (data:any)=>{
                    c.avatar = data.avatar;
                    c.islogin = data.is_guest != 1;
                    c.nickname = data.nickname;
                });
            });
        }

        status(c:svc.StatusContent) {
            c.appmode = ObjectT.GetValueByKeyPath(this._dataStatus, 'client.status') == 1;
            c.phone = ObjectT.GetValueByKeyPath(this._dataStatus, 'bindPhone.status') == 1;
            c.subscribe = ObjectT.GetValueByKeyPath(this._dataStatus, 'subscribe.status') == 1;
            c.monetaryName = ServiceXHB.PAYUNIT;
            c.monetaryRate = ServiceXHB.PAYRATE;
            if (ServiceXHB.PLATFORMID == svc.Platform.WANBA)
                c.monetaryDiscount = 1;
            else
                c.monetaryDiscount = null;
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        private _gift:numstr;
        
        auth(c:svc.AuthContent) {
            let fs = CApplication.shared.url.fields;
            let sdkopen = false;
            if (ServiceXHB.IsCurrent())
            {
                c.pid = '';
                c.timestamp = fs["timestamp"];
                c.nonce = fs["nonce"];
                c.signature = fs["signature"];
                if ("ticket" in fs) {
                    c.type = toInt(fs["login_type"]);
                    c.ticket = fs["ticket"];
                } else {
                    sdkopen = true;
                }
            }
            else
            {
                let oid = fs['openid'];
                if (oid == null)
                    oid = CApplication.shared.uniqueId;
                c.pid = oid;
            }

            // 设置一下通用对话框
            if (c.alert) {
                hGameHdl.setGameFunc('alert', function(title, msg, callback) {
                    c.alert({msg:msg,
                             title:title,
                             done:()=>{
                                 callback();
                             }});
                });
            }
            if (c.confirm) {
                hGameHdl.setGameFunc('confirm', function(title, msg, fnYes, fnNo) {
                    c.confirm({msg:msg,
                               title:title,
                               done:()=>{
                                   fnYes();
                               },
                               cancel:()=>{
                                   fnNo();
                               }});
                });
            }
            if (c.prompt) {
                hGameHdl.setGameFunc('prompt', function(title, defaultTxt, fnYes, fnNo) {
                    c.prompt({msg:defaultTxt,
                              title:title,
                              done:(val:string)=>{
                                  fnYes(val);
                              },
                              cancel:()=>{
                                  fnNo();
                              }});
                });
            }
            
            c.app = ServiceXHB.GameKey;
            c.platform = ServiceXHB.PLATFORMID;
            c.channel = 0;
            if (sdkopen) {
                hGameHdl.callPsdk("login", (d:any) => {
                    c.type = toInt(d.login_type);
                    c.ticket = d.ticket;
                    c.pid = '';
                    c.timestamp = d.timestamp;
                    c.nonce = d.nonce;
                    c.signature = d.signature;
                    this._gift = toInt(d.GIFT || d.gift);
                    c.signals.emit(SignalSucceed);
                    c.dispose();
                });
            }
            else {
                c.signals.emit(SignalSucceed);
                c.dispose();
            }
        }

        private _pid:string;
        
        login(c:svc.LoginContent) {
            // 保存，用来避免调用其他借口时还需要传参数
            this._pid = asString(c.pid);
            if (c.maxCustomerMessages)
                this._maxmessages = c.maxCustomerMessages;
            c.gift = this._gift;
            
            // 获得到当前平台的状态
            hGameHdl.queryExtraStatus({openId:this._pid}, (result:any)=>{
                // 保存下来状态
                this._dataStatus = result;
                c.signals.emit(SignalSucceed);
                c.dispose();
            });
        }
        
        switchuser(c:svc.SwitchUserContent) {
            hGameHdl.changeAccount({open_id:this._pid, action:'do'}, (result:any)=>{
                this._doResult(result, c, (data:any)=>{
                });
            });
        }
        
        logout(c:svc.LogoutContent) {
            hGameHdl.logout();
        }

        loading(c:svc.LoadingContent) {
            hGameHdl.loadingProgress(nn.toInt(c.current/c.total*100));
            c.signals.emit(SignalSucceed);
            c.dispose();
        }

        private _setStatus(key:string, v:any) {
            let old = ObjectT.GetValueByKeyPath(this._dataStatus, key);
            if (old == v)
                return;
            ObjectT.SetValueByKeyPath(this._dataStatus, key, v);
            this.signals.cast(svc.SignalStatusChanged);            
        }

        bind(c:svc.BindContent) {
            let data:any;
            if (c.data) {
                data = toJsonObject(c.data);
            } else {
                data = {open_id:this._pid, autoRedirect:true};
            }
            hGameHdl.doExtraAction("bindPhone", data, (result:any)=>{
                this._doResult(result, c, (data:any)=>{
                    c.phone = true;
                    this._setStatus('bindPhone.status', 1);
                });
            });
        }
        
        subscribe(c:svc.SubscribeContent) {
            let data:any;
            if (c.data) {
                data = toJsonObject(c.data);
            } else {
                data = {open_id:this._pid, autoRedirect:true};
            }
            hGameHdl.doExtraAction("subscribe", data, (result:any)=>{
                this._doResult(result, c, (data:any)=>{
                    c.subscribe = true;
                    this._setStatus('subscribe.status', 1);
                });
            });
        }

        bbs(c:svc.BBSContent) {
            let data:any;
            if (c.data) {
                data = toJsonObject(c.data);                
            } else {
                data = {open_id:this._pid};
            }
            hGameHdl.doExtraAction("bbs", data, (result:any)=>{
                this._doResult(result, c, (data:any)=>{
                });
            });
        }

        report(c:svc.ReportContent) {
            let baseData:any = {
                'game_key': ServiceXHB.GameKey,
                'open_id': this._pid,
                'role': asString(c.roleId),
                'nickname': c.nickname,
                'area': asString(c.region),
                'group': asString(c.server)
            };
            let extendData:any = {
                'level': c.level,
                'vipLevel': asString(c.viplevel),
                'score': toInt(c.score),
                'isNew': c.newuser ? 1 : 0,
                'progress': asString(c.progress)
            };
            let type:string;
            switch (c.type) {
            case svc.ReportType.LOGIN: type = 'enterGame'; break;
            case svc.ReportType.ROLE: type = 'createRole'; break;
            case svc.ReportType.UPGRADE: type = 'levelUpgrade'; break;
            case svc.ReportType.PROGRESS: type = 'processReport'; break;
            case svc.ReportType.SCORE: type = 'scoreReport'; break;
            }
            hGameHdl.gameReport(type, baseData, extendData, function(data) {
                log('汇报数据 ' + type);
                if (data && data.code == 0) {
                    c.signals.emit(SignalSucceed);
                } else {
                    dump(baseData);
                    dump(extendData);
                    dump(data);
                    c.signals.emit(SignalFailed);
                }
                c.dispose();
            });
        }

        getapp(c:svc.GetAppContent) {
            let data:any;
            if (c.data) {
                data = toJsonObject(c.data);
            } else {
                data = {open_id:this._pid};
            }
            hGameHdl.doExtraAction("client", data, (result:any)=>{
                this._doResult(result, c, (data:any)=>{
                });                
            });
        }

        sendtodesktop(c:svc.SendToDesktopContent) {
            let data:any;
            if (c.data) {
                data = toJsonObject(c.data);
            } else {
                data = {open_id:this._pid};
            }
            hGameHdl.doExtraAction("toDesktop", data, (result:any)=>{
                c.signals.emit(SignalSucceed);
                c.dispose();
            });
        }

        lanzuan(c:svc.LanZuanContent) {
            hGameHdl.callPsdk("NewOpenGameVIPService", [3, null, (result:any)=>{
                c.signals.emit(SignalSucceed);
                c.dispose();
            }]);
        }

        lanzuanxufei(c:svc.LanZuanXuFeiContent) {
            hGameHdl.callPsdk("NewGameVIPAction", [ServiceXHB.QQAPPID, (result:any)=>{
                c.signals.emit(SignalSucceed);
                c.dispose();
            }, null, null, null, null, ServiceXHB.GameKey, c.notifyUrl]);
        }

        private _maxmessages = 100;
        private _oldmessages = new Array<svc.Message>();
        private _customer_running:boolean;
        customer(c:svc.CustomerContent) {
            if (this._customer_running) {
                if (c instanceof svc.SendCustomerContent) {
                    let cnt = <svc.SendCustomerContent>c;
                    let data:any;
                    if (cnt.data) {
                        data = toJsonObject(cnt.data);
                    } else {
                        data = {
                            content:cnt.message,
                            level:cnt.level,
                            vipLevel:cnt.viplevel
                        };
                    }
                    hGameHdl.customerServicePost(data);
                    c.signals.emit(SignalSucceed);
                } else {
                    if (c.all)
                        this.signals.emit(svc.SignalMessagesGot, this._oldmessages);
                    c.signals.emit(SignalSucceed);
                }
                c.dispose();
                return;
            }
            this._customer_running = true;
            hGameHdl.customerServiceStart(toJsonObject(c.data), (chats:any[])=>{
                chats.forEach((e:any)=>{
                    let msg = new svc.Message();
                    msg.id = e.id;
                    msg.message = e.content;
                    msg.senderName = e.nickname;
                    this._oldmessages.push(msg);
                });
                if (this._oldmessages.length > this._maxmessages)
                    this._oldmessages = ArrayT.RangeOf(this._oldmessages, -this._maxmessages);
                this.signals.emit(svc.SignalMessagesGot, this._oldmessages);
            }, (suc:boolean)=>{
                if (suc)
                    c.signals.emit(SignalSucceed);
                else
                    c.signals.emit(SignalFailed);
                c.dispose();
            });
        }
        
        static IsCurrent():boolean {
            let fs = new URL(Js.siteUrl).fields;
            return 'game_key' in fs &&
                'timestamp' in fs &&
                'nonce' in fs &&
                'game_url' in fs &&
                'signature' in fs;
        }
    }

    ServicesManager.register(ServiceXHB);

    export class XHBServices
    extends ServicesManager
    {
        detectService():any {
            if (ServiceXHB.IsCurrent())
                return ServiceXHB;
            if (ISDEBUG)
                return ServiceMock;
            return ServiceXHB;
        }
    }

    // 小伙伴平台有时会去修改location.href但是会提供一个fullGameUrl解决之后获取location错误的问题
    Js.siteUrl = hGame.fullGameUrl;
}
