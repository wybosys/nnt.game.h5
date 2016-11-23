message MessageReq{
required string text=1;
}
message MessageRsp{
required string text=1;
}
message TestReq{
required string a=1;
optional string b=2;
}
message TestRsp{

}
message Text{
required string text=1;
}
message TestNtf{
required string text=1;
optional Text msg=2;
}