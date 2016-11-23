module app.api {

export enum Cmd {
	TestReqId = 1,
	MessageReqId = 2,
	TestRspId = 11,
	MessageRspId = 12,
	TestNtfId = 3,
}

export class MessageReq
extends SocketBase
{
	static Command = Cmd.MessageReqId;

	constructor() {
		super();
		this.name = "MessageReq";
		this.dname = "MessageRsp";
	}

	set text(v:string) {
		this.params["text"] = v;
	}
	get text():string {
		return this.params["text"];
	}

	data = new MessageRsp();

}

export class MessageRsp
{
	static Command = Cmd.MessageRspId;

	_text:string;
	set text(v:string) {
		this._text = v;
	}
	get text():string {
		return this._text;
	}

	protected unserialize(rsp:any):boolean {
		if (rsp == null)
			return true;
		this.text = rsp.text;
	}

}

export class TestReq
extends SocketBase
{
	static Command = Cmd.TestReqId;

	constructor() {
		super();
		this.name = "TestReq";
		this.dname = "TestRsp";
	}

	set a(v:string) {
		this.params["a"] = v;
	}
	get a():string {
		return this.params["a"];
	}

	set b(v:string) {
		this.params["b"] = v;
	}
	get b():string {
		return this.params["b"];
	}

	data = new TestRsp();

}

export class TestRsp
{
	static Command = Cmd.TestRspId;

}

export class Text
{
	_text:string;
	set text(v:string) {
		this._text = v;
	}
	get text():string {
		return this._text;
	}

	protected unserialize(rsp:any):boolean {
		if (rsp == null)
			return true;
		this.text = rsp.text;
	}

}

export class TestNtf
extends SocketBase
{
	static Command = Cmd.TestNtfId;

	constructor() {
		super();
		this.name = "TestNtf";
	}

	_text:any;
	set text(v:string) {
		this._text = v;
	}
	get text():string {
		return this._text;
	}

	_msg:any = new Text();
	set msg(v:Text) {
		this._msg = v;
	}
	get msg():Text {
		return this._msg;
	}

	protected unserialize(rsp:any):boolean {
		if (rsp == null)
			return true;
		this.text = rsp.text;
		this._msg.unserialize(rsp.msg);
	}

}

}
