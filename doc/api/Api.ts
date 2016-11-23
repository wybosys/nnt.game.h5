module app.api {

export enum Cmd {
	PingId = 5,
	LoginReqId = 11,
	NoAuthMaxId = 100,
	UpdateProfileReqId = 120,
	SetTitleReqId = 121,
	ReliveReqId = 122,
	LevelupReqId = 123,
	EquipReqId = 124,
	UseSkillReqId = 125,
	DigReqId = 126,
	ClearPocketReqId = 127,
	UnlockItemReqId = 150,
	UnlockSkillReqId = 151,
	SkillLevelupReqId = 152,
	UnlockInvestReqId = 153,
	InvestLevelupReqId = 154,
	InvestToMarketReqId = 155,
	LeaderBoardReqId = 170,
	AchivementsReqId = 171,
	GetWeekCardDiamondReqId = 190,
	LoginRspId = 411,
	UpdateProfileRspId = 420,
	SetTitleRspId = 421,
	ReliveRspId = 422,
	LevelupRspId = 423,
	EquipRspId = 424,
	UseSkillRspId = 425,
	DigRspId = 426,
	ClearPocketRspId = 427,
	UnlockItemRspId = 450,
	UnlockSkillRspId = 451,
	SkillLevelupRspId = 452,
	UnlockInvestRspId = 453,
	InvestLevelupRspId = 454,
	InvestToMarketRspId = 455,
	LeaderBoardRspId = 470,
	AchivementsRspId = 471,
	GetWeekCardDiamondRspId = 490,
	OfflineIncomeNtfId = 810,
	InvestNtfId = 811,
	SkillNtfId = 812,
	ItemNtfId = 813,
	MerchantItemNtfId = 814,
	CostNtfId = 815,
}

export class Item
{
	constructor() {
		super();
		this.name = "Item";
	}

	_item_id:number;
	set item_id(v:number) {
		this._item_id = v;
	}
	get item_id():number {
		return this._item_id;
	}

}

export class Skill
{
	constructor() {
		super();
		this.name = "Skill";
	}

	_skill_id:number;
	set skill_id(v:number) {
		this._skill_id = v;
	}
	get skill_id():number {
		return this._skill_id;
	}

	_level:number;
	set level(v:number) {
		this._level = v;
	}
	get level():number {
		return this._level;
	}

	_duration_left:number;
	set duration_left(v:number) {
		this._duration_left = v;
	}
	get duration_left():number {
		return this._duration_left;
	}

	_duration:number;
	set duration(v:number) {
		this._duration = v;
	}
	get duration():number {
		return this._duration;
	}

	_cd_left:number;
	set cd_left(v:number) {
		this._cd_left = v;
	}
	get cd_left():number {
		return this._cd_left;
	}

	_cd:number;
	set cd(v:number) {
		this._cd = v;
	}
	get cd():number {
		return this._cd;
	}

}

export class Invest
{
	constructor() {
		super();
		this.name = "Invest";
	}

	_invest_id:number;
	set invest_id(v:number) {
		this._invest_id = v;
	}
	get invest_id():number {
		return this._invest_id;
	}

	_level:number;
	set level(v:number) {
		this._level = v;
	}
	get level():number {
		return this._level;
	}

	_dps:number;
	set dps(v:number) {
		this._dps = v;
	}
	get dps():number {
		return this._dps;
	}

	_pocket:number;
	set pocket(v:number) {
		this._pocket = v;
	}
	get pocket():number {
		return this._pocket;
	}

	_title_equiped:number;
	set title_equiped(v:number) {
		this._title_equiped = v;
	}
	get title_equiped():number {
		return this._title_equiped;
	}

	_marketed:number;
	set marketed(v:number) {
		this._marketed = v;
	}
	get marketed():number {
		return this._marketed;
	}

	_locked_duration:number;
	set locked_duration(v:number) {
		this._locked_duration = v;
	}
	get locked_duration():number {
		return this._locked_duration;
	}

}

export class MerchantItem
{
	constructor() {
		super();
		this.name = "MerchantItem";
	}

	_merchant_item_id:number;
	set merchant_item_id(v:number) {
		this._merchant_item_id = v;
	}
	get merchant_item_id():number {
		return this._merchant_item_id;
	}

	_name:string;
	set name(v:string) {
		this._name = v;
	}
	get name():string {
		return this._name;
	}

	_desc:string;
	set desc(v:string) {
		this._desc = v;
	}
	get desc():string {
		return this._desc;
	}

	_count:number;
	set count(v:number) {
		this._count = v;
	}
	get count():number {
		return this._count;
	}

	_duration:number;
	set duration(v:number) {
		this._duration = v;
	}
	get duration():number {
		return this._duration;
	}

	_type:number;
	set type(v:number) {
		this._type = v;
	}
	get type():number {
		return this._type;
	}

	_price:number;
	set price(v:number) {
		this._price = v;
	}
	get price():number {
		return this._price;
	}

}

export class MetaInfo
{
	constructor() {
		super();
		this.name = "MetaInfo";
	}

	_relive_id:number;
	set relive_id(v:number) {
		this._relive_id = v;
	}
	get relive_id():number {
		return this._relive_id;
	}

	_cur_atk:number;
	set cur_atk(v:number) {
		this._cur_atk = v;
	}
	get cur_atk():number {
		return this._cur_atk;
	}

	_cur_dps:number;
	set cur_dps(v:number) {
		this._cur_dps = v;
	}
	get cur_dps():number {
		return this._cur_dps;
	}

	_cri:number;
	set cri(v:number) {
		this._cri = v;
	}
	get cri():number {
		return this._cri;
	}

	_cr:number;
	set cr(v:number) {
		this._cr = v;
	}
	get cr():number {
		return this._cr;
	}

	_market_ratio:number;
	set market_ratio(v:number) {
		this._market_ratio = v;
	}
	get market_ratio():number {
		return this._market_ratio;
	}

}

export class Header
{
	constructor() {
		super();
		this.name = "Header";
	}

	_cmd_id:number;
	set cmd_id(v:number) {
		this._cmd_id = v;
	}
	get cmd_id():number {
		return this._cmd_id;
	}

	_trans_id:number;
	set trans_id(v:number) {
		this._trans_id = v;
	}
	get trans_id():number {
		return this._trans_id;
	}

	_code:number;
	set code(v:number) {
		this._code = v;
	}
	get code():number {
		return this._code;
	}

}

export class ErrorInfo
{
	constructor() {
		super();
		this.name = "ErrorInfo";
	}

	_code:number;
	set code(v:number) {
		this._code = v;
	}
	get code():number {
		return this._code;
	}

	_message:string;
	set message(v:string) {
		this._message = v;
	}
	get message():string {
		return this._message;
	}

}

export class NullInfo
{
	constructor() {
		super();
		this.name = "NullInfo";
	}

}

export class Ping
{
	constructor() {
		super();
		this.name = "Ping";
	}

	_timestamp:number;
	set timestamp(v:number) {
		this._timestamp = v;
	}
	get timestamp():number {
		return this._timestamp;
	}

}

export class LoginReq
extends SocketBase
{
	static Command = Cmd.LoginReqId;

	constructor() {
		super();
		this.name = "LoginReq";
	}

	_user_id:number;
	set user_id(v:number) {
		this._user_id = v;
	}
	get user_id():number {
		return this._user_id;
	}

	_token:string;
	set token(v:string) {
		this._token = v;
	}
	get token():string {
		return this._token;
	}

	data = new LoginReqRsp();

}

export class LoginRsp
{
	static Command = Cmd.LoginRspId;

	constructor() {
		super();
		this.name = "LoginRsp";
	}

	_all_money:number;
	set all_money(v:number) {
		this._all_money = v;
	}
	get all_money():number {
		return this._all_money;
	}

	_money:number;
	set money(v:number) {
		this._money = v;
	}
	get money():number {
		return this._money;
	}

	_diamond:number;
	set diamond(v:number) {
		this._diamond = v;
	}
	get diamond():number {
		return this._diamond;
	}

	_level:number;
	set level(v:number) {
		this._level = v;
	}
	get level():number {
		return this._level;
	}

	_titled_invest_id:number;
	set titled_invest_id(v:number) {
		this._titled_invest_id = v;
	}
	get titled_invest_id():number {
		return this._titled_invest_id;
	}

	_equipments:number;
	set equipments(v:number) {
		this._equipments = v;
	}
	get equipments():number {
		return this._equipments;
	}

	_items:Item;
	set items(v:Item) {
		this._items = v;
	}
	get items():Item {
		return this._items;
	}

	_invests:Invest;
	set invests(v:Invest) {
		this._invests = v;
	}
	get invests():Invest {
		return this._invests;
	}

	_skills:Skill;
	set skills(v:Skill) {
		this._skills = v;
	}
	get skills():Skill {
		return this._skills;
	}

	_merchant_items:MerchantItem;
	set merchant_items(v:MerchantItem) {
		this._merchant_items = v;
	}
	get merchant_items():MerchantItem {
		return this._merchant_items;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class GetOfflineIncomeRsp
{
	static Command = Cmd.GetOfflineIncomeRspId;

	constructor() {
		super();
		this.name = "GetOfflineIncomeRsp";
	}

	_add_money:number;
	set add_money(v:number) {
		this._add_money = v;
	}
	get add_money():number {
		return this._add_money;
	}

	_offline_time:string;
	set offline_time(v:string) {
		this._offline_time = v;
	}
	get offline_time():string {
		return this._offline_time;
	}

}

export class UpdateProfileReq
extends SocketBase
{
	static Command = Cmd.UpdateProfileReqId;

	constructor() {
		super();
		this.name = "UpdateProfileReq";
	}

	_nick_name:string;
	set nick_name(v:string) {
		this._nick_name = v;
	}
	get nick_name():string {
		return this._nick_name;
	}

	_newbie_step:string;
	set newbie_step(v:string) {
		this._newbie_step = v;
	}
	get newbie_step():string {
		return this._newbie_step;
	}

	data = new UpdateProfileReqRsp();

}

export class SetTitleReq
extends SocketBase
{
	static Command = Cmd.SetTitleReqId;

	constructor() {
		super();
		this.name = "SetTitleReq";
	}

	_invest_id:number;
	set invest_id(v:number) {
		this._invest_id = v;
	}
	get invest_id():number {
		return this._invest_id;
	}

	data = new SetTitleReqRsp();

}

export class SetTitleRsp
{
	static Command = Cmd.SetTitleRspId;

	constructor() {
		super();
		this.name = "SetTitleRsp";
	}

	_invest:Invest;
	set invest(v:Invest) {
		this._invest = v;
	}
	get invest():Invest {
		return this._invest;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class ReliveRsp
{
	static Command = Cmd.ReliveRspId;

	constructor() {
		super();
		this.name = "ReliveRsp";
	}

	_money:number;
	set money(v:number) {
		this._money = v;
	}
	get money():number {
		return this._money;
	}

	_level:number;
	set level(v:number) {
		this._level = v;
	}
	get level():number {
		return this._level;
	}

	_item:Item;
	set item(v:Item) {
		this._item = v;
	}
	get item():Item {
		return this._item;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class LevelupReq
extends SocketBase
{
	static Command = Cmd.LevelupReqId;

	constructor() {
		super();
		this.name = "LevelupReq";
	}

	_level_delta:number;
	set level_delta(v:number) {
		this._level_delta = v;
	}
	get level_delta():number {
		return this._level_delta;
	}

	data = new LevelupReqRsp();

}

export class LevelupRsp
{
	static Command = Cmd.LevelupRspId;

	constructor() {
		super();
		this.name = "LevelupRsp";
	}

	_cost_money:number;
	set cost_money(v:number) {
		this._cost_money = v;
	}
	get cost_money():number {
		return this._cost_money;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class EquipReq
extends SocketBase
{
	static Command = Cmd.EquipReqId;

	constructor() {
		super();
		this.name = "EquipReq";
	}

	_item_id:number;
	set item_id(v:number) {
		this._item_id = v;
	}
	get item_id():number {
		return this._item_id;
	}

	data = new EquipReqRsp();

}

export class EquipRsp
{
	static Command = Cmd.EquipRspId;

	constructor() {
		super();
		this.name = "EquipRsp";
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class UseSkillReq
extends SocketBase
{
	static Command = Cmd.UseSkillReqId;

	constructor() {
		super();
		this.name = "UseSkillReq";
	}

	_skill_id:number;
	set skill_id(v:number) {
		this._skill_id = v;
	}
	get skill_id():number {
		return this._skill_id;
	}

	data = new UseSkillReqRsp();

}

export class UseSkillRsp
{
	static Command = Cmd.UseSkillRspId;

	constructor() {
		super();
		this.name = "UseSkillRsp";
	}

	_money_added:number;
	set money_added(v:number) {
		this._money_added = v;
	}
	get money_added():number {
		return this._money_added;
	}

	_skill:Skill;
	set skill(v:Skill) {
		this._skill = v;
	}
	get skill():Skill {
		return this._skill;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class FinishSkillNtf
extends SocketBase
{
	static Command = Cmd.FinishSkillNtfId;

	constructor() {
		super();
		this.name = "FinishSkillNtf";
	}

	_skill:Skill;
	set skill(v:Skill) {
		this._skill = v;
	}
	get skill():Skill {
		return this._skill;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class InvestNtf
extends SocketBase
{
	static Command = Cmd.InvestNtfId;

	constructor() {
		super();
		this.name = "InvestNtf";
	}

	_dps:number;
	set dps(v:number) {
		this._dps = v;
	}
	get dps():number {
		return this._dps;
	}

	_invests:Invest;
	set invests(v:Invest) {
		this._invests = v;
	}
	get invests():Invest {
		return this._invests;
	}

}

export class SkillNtf
extends SocketBase
{
	static Command = Cmd.SkillNtfId;

	constructor() {
		super();
		this.name = "SkillNtf";
	}

	_skills:Skill;
	set skills(v:Skill) {
		this._skills = v;
	}
	get skills():Skill {
		return this._skills;
	}

}

export class ItemNtf
extends SocketBase
{
	static Command = Cmd.ItemNtfId;

	constructor() {
		super();
		this.name = "ItemNtf";
	}

	_items:Item;
	set items(v:Item) {
		this._items = v;
	}
	get items():Item {
		return this._items;
	}

}

export class MerchantItemNtf
extends SocketBase
{
	static Command = Cmd.MerchantItemNtfId;

	constructor() {
		super();
		this.name = "MerchantItemNtf";
	}

	_merchant_items:MerchantItem;
	set merchant_items(v:MerchantItem) {
		this._merchant_items = v;
	}
	get merchant_items():MerchantItem {
		return this._merchant_items;
	}

}

export class CostNtf
extends SocketBase
{
	static Command = Cmd.CostNtfId;

	constructor() {
		super();
		this.name = "CostNtf";
	}

	_cost_money:number;
	set cost_money(v:number) {
		this._cost_money = v;
	}
	get cost_money():number {
		return this._cost_money;
	}

	_cost_diamond:number;
	set cost_diamond(v:number) {
		this._cost_diamond = v;
	}
	get cost_diamond():number {
		return this._cost_diamond;
	}

}

export class DigReq
extends SocketBase
{
	static Command = Cmd.DigReqId;

	constructor() {
		super();
		this.name = "DigReq";
	}

	_dig_count:number;
	set dig_count(v:number) {
		this._dig_count = v;
	}
	get dig_count():number {
		return this._dig_count;
	}

	_dig_money:number;
	set dig_money(v:number) {
		this._dig_money = v;
	}
	get dig_money():number {
		return this._dig_money;
	}

	data = new DigReqRsp();

}

export class DigRsp
{
	static Command = Cmd.DigRspId;

	constructor() {
		super();
		this.name = "DigRsp";
	}

	_money_diff:number;
	set money_diff(v:number) {
		this._money_diff = v;
	}
	get money_diff():number {
		return this._money_diff;
	}

}

export class ClearPocketReq
extends SocketBase
{
	static Command = Cmd.ClearPocketReqId;

	constructor() {
		super();
		this.name = "ClearPocketReq";
	}

	_invest_id:number;
	set invest_id(v:number) {
		this._invest_id = v;
	}
	get invest_id():number {
		return this._invest_id;
	}

	_clear_all:number;
	set clear_all(v:number) {
		this._clear_all = v;
	}
	get clear_all():number {
		return this._clear_all;
	}

	data = new ClearPocketReqRsp();

}

export class ClearPocketRsp
{
	static Command = Cmd.ClearPocketRspId;

	constructor() {
		super();
		this.name = "ClearPocketRsp";
	}

	_money_added:number;
	set money_added(v:number) {
		this._money_added = v;
	}
	get money_added():number {
		return this._money_added;
	}

}

export class UnlockItemReq
extends SocketBase
{
	static Command = Cmd.UnlockItemReqId;

	constructor() {
		super();
		this.name = "UnlockItemReq";
	}

	_item_id:number;
	set item_id(v:number) {
		this._item_id = v;
	}
	get item_id():number {
		return this._item_id;
	}

	data = new UnlockItemReqRsp();

}

export class UnlockItemRsp
{
	static Command = Cmd.UnlockItemRspId;

	constructor() {
		super();
		this.name = "UnlockItemRsp";
	}

	_cost_diamond:number;
	set cost_diamond(v:number) {
		this._cost_diamond = v;
	}
	get cost_diamond():number {
		return this._cost_diamond;
	}

	_item:Item;
	set item(v:Item) {
		this._item = v;
	}
	get item():Item {
		return this._item;
	}

}

export class UnlockSkillReq
extends SocketBase
{
	static Command = Cmd.UnlockSkillReqId;

	constructor() {
		super();
		this.name = "UnlockSkillReq";
	}

	_skill_id:number;
	set skill_id(v:number) {
		this._skill_id = v;
	}
	get skill_id():number {
		return this._skill_id;
	}

	data = new UnlockSkillReqRsp();

}

export class UnlockSkillRsp
{
	static Command = Cmd.UnlockSkillRspId;

	constructor() {
		super();
		this.name = "UnlockSkillRsp";
	}

	_cost_money:number;
	set cost_money(v:number) {
		this._cost_money = v;
	}
	get cost_money():number {
		return this._cost_money;
	}

	_skill:Skill;
	set skill(v:Skill) {
		this._skill = v;
	}
	get skill():Skill {
		return this._skill;
	}

}

export class SkillLevelupReq
extends SocketBase
{
	static Command = Cmd.SkillLevelupReqId;

	constructor() {
		super();
		this.name = "SkillLevelupReq";
	}

	_skill_id:number;
	set skill_id(v:number) {
		this._skill_id = v;
	}
	get skill_id():number {
		return this._skill_id;
	}

	_level_delta:number;
	set level_delta(v:number) {
		this._level_delta = v;
	}
	get level_delta():number {
		return this._level_delta;
	}

	data = new SkillLevelupReqRsp();

}

export class SkillLevelupRsp
{
	static Command = Cmd.SkillLevelupRspId;

	constructor() {
		super();
		this.name = "SkillLevelupRsp";
	}

	_cost_money:number;
	set cost_money(v:number) {
		this._cost_money = v;
	}
	get cost_money():number {
		return this._cost_money;
	}

	_skill:Skill;
	set skill(v:Skill) {
		this._skill = v;
	}
	get skill():Skill {
		return this._skill;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class UnlockInvestReq
extends SocketBase
{
	static Command = Cmd.UnlockInvestReqId;

	constructor() {
		super();
		this.name = "UnlockInvestReq";
	}

	_invest_id:number;
	set invest_id(v:number) {
		this._invest_id = v;
	}
	get invest_id():number {
		return this._invest_id;
	}

	data = new UnlockInvestReqRsp();

}

export class UnlockInvestRsp
{
	static Command = Cmd.UnlockInvestRspId;

	constructor() {
		super();
		this.name = "UnlockInvestRsp";
	}

	_cost_money:number;
	set cost_money(v:number) {
		this._cost_money = v;
	}
	get cost_money():number {
		return this._cost_money;
	}

	_invest:Invest;
	set invest(v:Invest) {
		this._invest = v;
	}
	get invest():Invest {
		return this._invest;
	}

}

export class InvestLevelupReq
extends SocketBase
{
	static Command = Cmd.InvestLevelupReqId;

	constructor() {
		super();
		this.name = "InvestLevelupReq";
	}

	_invest_id:number;
	set invest_id(v:number) {
		this._invest_id = v;
	}
	get invest_id():number {
		return this._invest_id;
	}

	_level_delta:number;
	set level_delta(v:number) {
		this._level_delta = v;
	}
	get level_delta():number {
		return this._level_delta;
	}

	data = new InvestLevelupReqRsp();

}

export class InvestLevelupRsp
{
	static Command = Cmd.InvestLevelupRspId;

	constructor() {
		super();
		this.name = "InvestLevelupRsp";
	}

	_cost_money:number;
	set cost_money(v:number) {
		this._cost_money = v;
	}
	get cost_money():number {
		return this._cost_money;
	}

	_invest:Invest;
	set invest(v:Invest) {
		this._invest = v;
	}
	get invest():Invest {
		return this._invest;
	}

	_meta_info:MetaInfo;
	set meta_info(v:MetaInfo) {
		this._meta_info = v;
	}
	get meta_info():MetaInfo {
		return this._meta_info;
	}

}

export class InvestToMarketReq
extends SocketBase
{
	static Command = Cmd.InvestToMarketReqId;

	constructor() {
		super();
		this.name = "InvestToMarketReq";
	}

	_invest_id:number;
	set invest_id(v:number) {
		this._invest_id = v;
	}
	get invest_id():number {
		return this._invest_id;
	}

	data = new InvestToMarketReqRsp();

}

export class InvestToMarketRsp
{
	static Command = Cmd.InvestToMarketRspId;

	constructor() {
		super();
		this.name = "InvestToMarketRsp";
	}

}

}
