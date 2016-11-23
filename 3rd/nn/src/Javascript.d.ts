declare module Js {
    
    /** 当前的地址 */
    export let siteUrl:string;
    
    /** 唯一id */
    export function guid():string;

    /** 指定长度的随机唯一串
       @param len 长度
       @param base 进制：2、10、16
    */
    export function uuid(len:number, base:number);

    /** 格式化字符串 */
    export function printf(fmt:string, ...p:any[]);

    /** 获取浏览器的大小 */
    export function getBrowserSize():any;

    /** 获取屏幕的大小 */
    export function getScreenSize():any;

    /** 获取浏览器的方向 */
    export function getBrowserOrientation():number;

    /** 实现重载 js 的 get/set 方法 */
    export function OverrideGetSet(cls:any, name:string, set:any, unset:any);

    /** 重载 js 的函数 
        @orifn 被重载的实现，需要在of中手动调用
     */
    export function OverrideFunction(cls:any, funm:string, of:(orifn:any, ...p:any[])=>void);
    
    export var ECMA6_NATIVE:boolean;

    /** 进入全屏 */
    export function enterFullscreen(element:any);

    /** 推出全屏 */
    export function exitFullscreen();

    /** 全屏状态 */
    export function isFullscreen():boolean;

    /** 加载JS */
    export function loadScripts(lst:string[], cb:()=>void, ctx?:any);
    export function loadScript(src:string, cb:()=>void, ctx?:any);

    /** 加载CSS */
    export function loadStyles(lst:string[], cb:()=>void, ctx?:any);
    export function loadStyle(src:string, cb:()=>void, ctx?:any);

    const enum SOURCETYPE {
        JS = 0,
        CSS = 1,
    }

    /** 混合加载资源 */
    export function loadSources(lst:[[string, SOURCETYPE]], cb:()=>void, ctx?:any);
    export function loadSource(src:[string, SOURCETYPE], cb:()=>void, ctx?:any);

    /** 框架下获取用来做hash的key的方法 */
    export function hashKey(e:any):any;

    /** 获得stacktrace */
    export function stacktrace():string;
}
