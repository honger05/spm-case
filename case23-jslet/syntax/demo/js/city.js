// dsCity
var dsCity = new jslet.data.Dataset('city');
f = jslet.data.createStringField('cityid', 10);
f.label('ID');
dsCity.addField(f);

f = jslet.data.createStringField('code', 10);
f.label('Code');
dsCity.addField(f);

f = jslet.data.createStringField('name', 50);
f.label('Name');
dsCity.addField(f);

f = jslet.data.createStringField('province', 10);
f.label('Province');
lkf = new jslet.data.lookup();
lkf.dataset(dsProvince);
f.lookup(lkf);
dsCity.addField(f);

dsCity.keyField('cityid');
dsCity.codeField('code');
dsCity.nameField('name');

var dataList = [ {
	"cityid" : "0101",
	"name" : "安庆",
	"province" : "01",
	"code" : "01"
}, {
	"cityid" : "0102",
	"name" : "蚌埠",
	"province" : "01",
	"code" : "02"
}, {
	"cityid" : "0103",
	"name" : "巢湖",
	"province" : "01",
	"code" : "03"
}, {
	"cityid" : "0104",
	"name" : "池州",
	"province" : "01",
	"code" : "04"
}, {
	"cityid" : "0105",
	"name" : "滁州",
	"province" : "01",
	"code" : "05"
}, {
	"cityid" : "0106",
	"name" : "阜阳",
	"province" : "01",
	"code" : "06"
}, {
	"cityid" : "0107",
	"name" : "合肥",
	"province" : "01",
	"code" : "07"
}, {
	"cityid" : "0108",
	"name" : "淮北",
	"province" : "01",
	"code" : "08"
}, {
	"cityid" : "0109",
	"name" : "淮南",
	"province" : "01",
	"code" : "09"
}, {
	"cityid" : "0110",
	"name" : "黄山",
	"province" : "01",
	"code" : "10"
}, {
	"cityid" : "0111",
	"name" : "六安",
	"province" : "01",
	"code" : "11"
}, {
	"cityid" : "0112",
	"name" : "马鞍山",
	"province" : "01",
	"code" : "12"
}, {
	"cityid" : "0113",
	"name" : "宿州",
	"province" : "01",
	"code" : "13"
}, {
	"cityid" : "0114",
	"name" : "铜陵",
	"province" : "01",
	"code" : "14"
}, {
	"cityid" : "0115",
	"name" : "芜湖",
	"province" : "01",
	"code" : "15"
}, {
	"cityid" : "0116",
	"name" : "宣城",
	"province" : "01",
	"code" : "16"
}, {
	"cityid" : "0117",
	"name" : "亳州",
	"province" : "01",
	"code" : "17"
}, {
	"cityid" : "0201",
	"name" : "北京",
	"province" : "02",
	"code" : "01"
}, {
	"cityid" : "0301",
	"name" : "福州",
	"province" : "03",
	"code" : "01"
}, {
	"cityid" : "0302",
	"name" : "龙岩",
	"province" : "03",
	"code" : "02"
}, {
	"cityid" : "0303",
	"name" : "南平",
	"province" : "03",
	"code" : "03"
}, {
	"cityid" : "0304",
	"name" : "宁德",
	"province" : "03",
	"code" : "04"
}, {
	"cityid" : "0305",
	"name" : "莆田",
	"province" : "03",
	"code" : "05"
}, {
	"cityid" : "0306",
	"name" : "泉州",
	"province" : "03",
	"code" : "06"
}, {
	"cityid" : "0307",
	"name" : "三明",
	"province" : "03",
	"code" : "07"
}, {
	"cityid" : "0308",
	"name" : "厦门",
	"province" : "03",
	"code" : "08"
}, {
	"cityid" : "0309",
	"name" : "漳州",
	"province" : "03",
	"code" : "09"
}, {
	"cityid" : "0401",
	"name" : "白银",
	"province" : "04",
	"code" : "01"
}, {
	"cityid" : "0402",
	"name" : "定西",
	"province" : "04",
	"code" : "02"
}, {
	"cityid" : "0403",
	"name" : "甘南藏族自治州",
	"province" : "04",
	"code" : "03"
}, {
	"cityid" : "0404",
	"name" : "嘉峪关",
	"province" : "04",
	"code" : "04"
}, {
	"cityid" : "0405",
	"name" : "金昌",
	"province" : "04",
	"code" : "05"
}, {
	"cityid" : "0406",
	"name" : "酒泉",
	"province" : "04",
	"code" : "06"
}, {
	"cityid" : "0407",
	"name" : "兰州",
	"province" : "04",
	"code" : "07"
}, {
	"cityid" : "0408",
	"name" : "临夏回族自治州",
	"province" : "04",
	"code" : "08"
}, {
	"cityid" : "0409",
	"name" : "陇南",
	"province" : "04",
	"code" : "09"
}, {
	"cityid" : "0410",
	"name" : "平凉",
	"province" : "04",
	"code" : "10"
}, {
	"cityid" : "0411",
	"name" : "庆阳",
	"province" : "04",
	"code" : "11"
}, {
	"cityid" : "0412",
	"name" : "天水",
	"province" : "04",
	"code" : "12"
}, {
	"cityid" : "0413",
	"name" : "武威",
	"province" : "04",
	"code" : "13"
}, {
	"cityid" : "0414",
	"name" : "张掖",
	"province" : "04",
	"code" : "14"
}, {
	"cityid" : "0501",
	"name" : "潮州",
	"province" : "05",
	"code" : "01"
}, {
	"cityid" : "0502",
	"name" : "东莞",
	"province" : "05",
	"code" : "02"
}, {
	"cityid" : "0503",
	"name" : "佛山",
	"province" : "05",
	"code" : "03"
}, {
	"cityid" : "0504",
	"name" : "广州",
	"province" : "05",
	"code" : "04"
}, {
	"cityid" : "0505",
	"name" : "河源",
	"province" : "05",
	"code" : "05"
}, {
	"cityid" : "0506",
	"name" : "惠州",
	"province" : "05",
	"code" : "06"
}, {
	"cityid" : "0507",
	"name" : "江门",
	"province" : "05",
	"code" : "07"
}, {
	"cityid" : "0508",
	"name" : "揭阳",
	"province" : "05",
	"code" : "08"
}, {
	"cityid" : "0509",
	"name" : "茂名",
	"province" : "05",
	"code" : "09"
}, {
	"cityid" : "0510",
	"name" : "梅州",
	"province" : "05",
	"code" : "10"
}, {
	"cityid" : "0511",
	"name" : "清远",
	"province" : "05",
	"code" : "11"
}, {
	"cityid" : "0512",
	"name" : "汕头",
	"province" : "05",
	"code" : "12"
}, {
	"cityid" : "0513",
	"name" : "汕尾",
	"province" : "05",
	"code" : "13"
}, {
	"cityid" : "0514",
	"name" : "韶关",
	"province" : "05",
	"code" : "14"
}, {
	"cityid" : "0515",
	"name" : "深圳",
	"province" : "05",
	"code" : "15"
}, {
	"cityid" : "0516",
	"name" : "阳江",
	"province" : "05",
	"code" : "16"
}, {
	"cityid" : "0517",
	"name" : "云浮",
	"province" : "05",
	"code" : "17"
}, {
	"cityid" : "0518",
	"name" : "湛江",
	"province" : "05",
	"code" : "18"
}, {
	"cityid" : "0519",
	"name" : "肇庆",
	"province" : "05",
	"code" : "19"
}, {
	"cityid" : "0520",
	"name" : "中山",
	"province" : "05",
	"code" : "20"
}, {
	"cityid" : "0521",
	"name" : "珠海",
	"province" : "05",
	"code" : "21"
}, {
	"cityid" : "0601",
	"name" : "百色",
	"province" : "06",
	"code" : "01"
}, {
	"cityid" : "0602",
	"name" : "北海",
	"province" : "06",
	"code" : "02"
}, {
	"cityid" : "0603",
	"name" : "崇左",
	"province" : "06",
	"code" : "03"
}, {
	"cityid" : "0604",
	"name" : "防城港",
	"province" : "06",
	"code" : "04"
}, {
	"cityid" : "0605",
	"name" : "桂林",
	"province" : "06",
	"code" : "05"
}, {
	"cityid" : "0606",
	"name" : "贵港",
	"province" : "06",
	"code" : "06"
}, {
	"cityid" : "0607",
	"name" : "河池",
	"province" : "06",
	"code" : "07"
}, {
	"cityid" : "0608",
	"name" : "贺州",
	"province" : "06",
	"code" : "08"
}, {
	"cityid" : "0609",
	"name" : "来宾",
	"province" : "06",
	"code" : "09"
}, {
	"cityid" : "0610",
	"name" : "柳州",
	"province" : "06",
	"code" : "10"
}, {
	"cityid" : "0611",
	"name" : "南宁",
	"province" : "06",
	"code" : "11"
}, {
	"cityid" : "0612",
	"name" : "钦州",
	"province" : "06",
	"code" : "12"
}, {
	"cityid" : "0613",
	"name" : "梧州",
	"province" : "06",
	"code" : "13"
}, {
	"cityid" : "0614",
	"name" : "玉林",
	"province" : "06",
	"code" : "14"
}, {
	"cityid" : "0701",
	"name" : "安顺",
	"province" : "07",
	"code" : "01"
}, {
	"cityid" : "0702",
	"name" : "毕节",
	"province" : "07",
	"code" : "02"
}, {
	"cityid" : "0703",
	"name" : "贵阳",
	"province" : "07",
	"code" : "03"
}, {
	"cityid" : "0704",
	"name" : "六盘水",
	"province" : "07",
	"code" : "04"
}, {
	"cityid" : "0705",
	"name" : "黔东南苗族侗族自治州",
	"province" : "07",
	"code" : "05"
}, {
	"cityid" : "0706",
	"name" : "黔南布依族苗族自治州",
	"province" : "07",
	"code" : "06"
}, {
	"cityid" : "0707",
	"name" : "黔西南布依族苗族自治州",
	"province" : "07",
	"code" : "07"
}, {
	"cityid" : "0708",
	"name" : "铜仁",
	"province" : "07",
	"code" : "08"
}, {
	"cityid" : "0709",
	"name" : "遵义",
	"province" : "07",
	"code" : "09"
}, {
	"cityid" : "0801",
	"name" : "白沙黎族自治县",
	"province" : "08",
	"code" : "01"
}, {
	"cityid" : "0802",
	"name" : "保亭黎族苗族自治县",
	"province" : "08",
	"code" : "02"
}, {
	"cityid" : "0803",
	"name" : "昌江黎族自治县",
	"province" : "08",
	"code" : "03"
}, {
	"cityid" : "0804",
	"name" : "澄迈县",
	"province" : "08",
	"code" : "04"
}, {
	"cityid" : "0805",
	"name" : "定安县",
	"province" : "08",
	"code" : "05"
}, {
	"cityid" : "0806",
	"name" : "东方",
	"province" : "08",
	"code" : "06"
}, {
	"cityid" : "0807",
	"name" : "海口",
	"province" : "08",
	"code" : "07"
}, {
	"cityid" : "0808",
	"name" : "乐东黎族自治县",
	"province" : "08",
	"code" : "08"
}, {
	"cityid" : "0809",
	"name" : "临高县",
	"province" : "08",
	"code" : "09"
}, {
	"cityid" : "0810",
	"name" : "陵水黎族自治县",
	"province" : "08",
	"code" : "10"
}, {
	"cityid" : "0811",
	"name" : "琼海",
	"province" : "08",
	"code" : "11"
}, {
	"cityid" : "0812",
	"name" : "琼中黎族苗族自治县",
	"province" : "08",
	"code" : "12"
}, {
	"cityid" : "0813",
	"name" : "三亚",
	"province" : "08",
	"code" : "13"
}, {
	"cityid" : "0814",
	"name" : "屯昌县",
	"province" : "08",
	"code" : "14"
}, {
	"cityid" : "0815",
	"name" : "万宁",
	"province" : "08",
	"code" : "15"
}, {
	"cityid" : "0816",
	"name" : "文昌",
	"province" : "08",
	"code" : "16"
}, {
	"cityid" : "0817",
	"name" : "五指山",
	"province" : "08",
	"code" : "17"
}, {
	"cityid" : "0818",
	"name" : "儋州",
	"province" : "08",
	"code" : "18"
}, {
	"cityid" : "0901",
	"name" : "保定",
	"province" : "09",
	"code" : "01"
}, {
	"cityid" : "0902",
	"name" : "沧州",
	"province" : "09",
	"code" : "02"
}, {
	"cityid" : "0903",
	"name" : "承德",
	"province" : "09",
	"code" : "03"
}, {
	"cityid" : "0904",
	"name" : "邯郸",
	"province" : "09",
	"code" : "04"
}, {
	"cityid" : "0905",
	"name" : "衡水",
	"province" : "09",
	"code" : "05"
}, {
	"cityid" : "0906",
	"name" : "廊坊",
	"province" : "09",
	"code" : "06"
}, {
	"cityid" : "0907",
	"name" : "秦皇岛",
	"province" : "09",
	"code" : "07"
}, {
	"cityid" : "0908",
	"name" : "石家庄",
	"province" : "09",
	"code" : "08"
}, {
	"cityid" : "0909",
	"name" : "唐山",
	"province" : "09",
	"code" : "09"
}, {
	"cityid" : "0910",
	"name" : "邢台",
	"province" : "09",
	"code" : "10"
}, {
	"cityid" : "0911",
	"name" : "张家口",
	"province" : "09",
	"code" : "11"
}, {
	"cityid" : "1001",
	"name" : "安阳",
	"province" : "10",
	"code" : "01"
}, {
	"cityid" : "1002",
	"name" : "鹤壁",
	"province" : "10",
	"code" : "02"
}, {
	"cityid" : "1003",
	"name" : "济源",
	"province" : "10",
	"code" : "03"
}, {
	"cityid" : "1004",
	"name" : "焦作",
	"province" : "10",
	"code" : "04"
}, {
	"cityid" : "1005",
	"name" : "开封",
	"province" : "10",
	"code" : "05"
}, {
	"cityid" : "1006",
	"name" : "洛阳",
	"province" : "10",
	"code" : "06"
}, {
	"cityid" : "1007",
	"name" : "南阳",
	"province" : "10",
	"code" : "07"
}, {
	"cityid" : "1008",
	"name" : "平顶山",
	"province" : "10",
	"code" : "08"
}, {
	"cityid" : "1009",
	"name" : "三门峡",
	"province" : "10",
	"code" : "09"
}, {
	"cityid" : "1010",
	"name" : "商丘",
	"province" : "10",
	"code" : "10"
}, {
	"cityid" : "1011",
	"name" : "新乡",
	"province" : "10",
	"code" : "11"
}, {
	"cityid" : "1012",
	"name" : "信阳",
	"province" : "10",
	"code" : "12"
}, {
	"cityid" : "1013",
	"name" : "许昌",
	"province" : "10",
	"code" : "13"
}, {
	"cityid" : "1014",
	"name" : "郑州",
	"province" : "10",
	"code" : "14"
}, {
	"cityid" : "1015",
	"name" : "周口",
	"province" : "10",
	"code" : "15"
}, {
	"cityid" : "1016",
	"name" : "驻马店",
	"province" : "10",
	"code" : "16"
}, {
	"cityid" : "1017",
	"name" : "漯河",
	"province" : "10",
	"code" : "17"
}, {
	"cityid" : "1018",
	"name" : "濮阳",
	"province" : "10",
	"code" : "18"
}, {
	"cityid" : "1101",
	"name" : "大庆",
	"province" : "11",
	"code" : "01"
}, {
	"cityid" : "1102",
	"name" : "大兴安岭",
	"province" : "11",
	"code" : "02"
}, {
	"cityid" : "1103",
	"name" : "哈尔滨",
	"province" : "11",
	"code" : "03"
}, {
	"cityid" : "1104",
	"name" : "鹤岗",
	"province" : "11",
	"code" : "04"
}, {
	"cityid" : "1105",
	"name" : "黑河",
	"province" : "11",
	"code" : "05"
}, {
	"cityid" : "1106",
	"name" : "鸡西",
	"province" : "11",
	"code" : "06"
}, {
	"cityid" : "1107",
	"name" : "佳木斯",
	"province" : "11",
	"code" : "07"
}, {
	"cityid" : "1108",
	"name" : "牡丹江",
	"province" : "11",
	"code" : "08"
}, {
	"cityid" : "1109",
	"name" : "七台河",
	"province" : "11",
	"code" : "09"
}, {
	"cityid" : "1110",
	"name" : "齐齐哈尔",
	"province" : "11",
	"code" : "10"
}, {
	"cityid" : "1111",
	"name" : "双鸭山",
	"province" : "11",
	"code" : "11"
}, {
	"cityid" : "1112",
	"name" : "绥化",
	"province" : "11",
	"code" : "12"
}, {
	"cityid" : "1113",
	"name" : "伊春",
	"province" : "11",
	"code" : "13"
}, {
	"cityid" : "1201",
	"name" : "鄂州",
	"province" : "12",
	"code" : "01"
}, {
	"cityid" : "1202",
	"name" : "恩施土家族苗族自治州",
	"province" : "12",
	"code" : "02"
}, {
	"cityid" : "1203",
	"name" : "黄冈",
	"province" : "12",
	"code" : "03"
}, {
	"cityid" : "1204",
	"name" : "黄石",
	"province" : "12",
	"code" : "04"
}, {
	"cityid" : "1205",
	"name" : "荆门",
	"province" : "12",
	"code" : "05"
}, {
	"cityid" : "1206",
	"name" : "荆州",
	"province" : "12",
	"code" : "06"
}, {
	"cityid" : "1207",
	"name" : "潜江",
	"province" : "12",
	"code" : "07"
}, {
	"cityid" : "1208",
	"name" : "神农架林区",
	"province" : "12",
	"code" : "08"
}, {
	"cityid" : "1209",
	"name" : "十堰",
	"province" : "12",
	"code" : "09"
}, {
	"cityid" : "1210",
	"name" : "随州",
	"province" : "12",
	"code" : "10"
}, {
	"cityid" : "1211",
	"name" : "天门",
	"province" : "12",
	"code" : "11"
}, {
	"cityid" : "1212",
	"name" : "武汉",
	"province" : "12",
	"code" : "12"
}, {
	"cityid" : "1213",
	"name" : "仙桃",
	"province" : "12",
	"code" : "13"
}, {
	"cityid" : "1214",
	"name" : "咸宁",
	"province" : "12",
	"code" : "14"
}, {
	"cityid" : "1215",
	"name" : "襄樊",
	"province" : "12",
	"code" : "15"
}, {
	"cityid" : "1216",
	"name" : "孝感",
	"province" : "12",
	"code" : "16"
}, {
	"cityid" : "1217",
	"name" : "宜昌",
	"province" : "12",
	"code" : "17"
}, {
	"cityid" : "1301",
	"name" : "常德",
	"province" : "13",
	"code" : "01"
}, {
	"cityid" : "1302",
	"name" : "长沙",
	"province" : "13",
	"code" : "02"
}, {
	"cityid" : "1303",
	"name" : "郴州",
	"province" : "13",
	"code" : "03"
}, {
	"cityid" : "1304",
	"name" : "衡阳",
	"province" : "13",
	"code" : "04"
}, {
	"cityid" : "1305",
	"name" : "怀化",
	"province" : "13",
	"code" : "05"
}, {
	"cityid" : "1306",
	"name" : "娄底",
	"province" : "13",
	"code" : "06"
}, {
	"cityid" : "1307",
	"name" : "邵阳",
	"province" : "13",
	"code" : "07"
}, {
	"cityid" : "1308",
	"name" : "湘潭",
	"province" : "13",
	"code" : "08"
}, {
	"cityid" : "1309",
	"name" : "湘西土家族苗族自治州",
	"province" : "13",
	"code" : "09"
}, {
	"cityid" : "1310",
	"name" : "益阳",
	"province" : "13",
	"code" : "10"
}, {
	"cityid" : "1311",
	"name" : "永州",
	"province" : "13",
	"code" : "11"
}, {
	"cityid" : "1312",
	"name" : "岳阳",
	"province" : "13",
	"code" : "12"
}, {
	"cityid" : "1313",
	"name" : "张家界",
	"province" : "13",
	"code" : "13"
}, {
	"cityid" : "1314",
	"name" : "株洲",
	"province" : "13",
	"code" : "14"
}, {
	"cityid" : "1401",
	"name" : "白城",
	"province" : "14",
	"code" : "01"
}, {
	"cityid" : "1402",
	"name" : "白山",
	"province" : "14",
	"code" : "02"
}, {
	"cityid" : "1403",
	"name" : "长春",
	"province" : "14",
	"code" : "03"
}, {
	"cityid" : "1404",
	"name" : "吉林",
	"province" : "14",
	"code" : "04"
}, {
	"cityid" : "1405",
	"name" : "辽源",
	"province" : "14",
	"code" : "05"
}, {
	"cityid" : "1406",
	"name" : "四平",
	"province" : "14",
	"code" : "06"
}, {
	"cityid" : "1407",
	"name" : "松原",
	"province" : "14",
	"code" : "07"
}, {
	"cityid" : "1408",
	"name" : "通化",
	"province" : "14",
	"code" : "08"
}, {
	"cityid" : "1409",
	"name" : "延边朝鲜族自治州",
	"province" : "14",
	"code" : "09"
}, {
	"cityid" : "1501",
	"name" : "常州",
	"province" : "15",
	"code" : "01"
}, {
	"cityid" : "1502",
	"name" : "淮安",
	"province" : "15",
	"code" : "02"
}, {
	"cityid" : "1503",
	"name" : "连云港",
	"province" : "15",
	"code" : "03"
}, {
	"cityid" : "1504",
	"name" : "南京",
	"province" : "15",
	"code" : "04"
}, {
	"cityid" : "1505",
	"name" : "南通",
	"province" : "15",
	"code" : "05"
}, {
	"cityid" : "1506",
	"name" : "苏州",
	"province" : "15",
	"code" : "06"
}, {
	"cityid" : "1507",
	"name" : "宿迁",
	"province" : "15",
	"code" : "07"
}, {
	"cityid" : "1508",
	"name" : "泰州",
	"province" : "15",
	"code" : "08"
}, {
	"cityid" : "1509",
	"name" : "无锡",
	"province" : "15",
	"code" : "09"
}, {
	"cityid" : "1510",
	"name" : "徐州",
	"province" : "15",
	"code" : "10"
}, {
	"cityid" : "1511",
	"name" : "盐城",
	"province" : "15",
	"code" : "11"
}, {
	"cityid" : "1512",
	"name" : "扬州",
	"province" : "15",
	"code" : "12"
}, {
	"cityid" : "1513",
	"name" : "镇江",
	"province" : "15",
	"code" : "13"
}, {
	"cityid" : "1601",
	"name" : "抚州",
	"province" : "16",
	"code" : "01"
}, {
	"cityid" : "1602",
	"name" : "赣州",
	"province" : "16",
	"code" : "02"
}, {
	"cityid" : "1603",
	"name" : "吉安",
	"province" : "16",
	"code" : "03"
}, {
	"cityid" : "1604",
	"name" : "景德镇",
	"province" : "16",
	"code" : "04"
}, {
	"cityid" : "1605",
	"name" : "九江",
	"province" : "16",
	"code" : "05"
}, {
	"cityid" : "1606",
	"name" : "南昌",
	"province" : "16",
	"code" : "06"
}, {
	"cityid" : "1607",
	"name" : "萍乡",
	"province" : "16",
	"code" : "07"
}, {
	"cityid" : "1608",
	"name" : "上饶",
	"province" : "16",
	"code" : "08"
}, {
	"cityid" : "1609",
	"name" : "新余",
	"province" : "16",
	"code" : "09"
}, {
	"cityid" : "1610",
	"name" : "宜春",
	"province" : "16",
	"code" : "10"
}, {
	"cityid" : "1611",
	"name" : "鹰潭",
	"province" : "16",
	"code" : "11"
}, {
	"cityid" : "1701",
	"name" : "鞍山",
	"province" : "17",
	"code" : "01"
}, {
	"cityid" : "1702",
	"name" : "本溪",
	"province" : "17",
	"code" : "02"
}, {
	"cityid" : "1703",
	"name" : "朝阳",
	"province" : "17",
	"code" : "03"
}, {
	"cityid" : "1704",
	"name" : "大连",
	"province" : "17",
	"code" : "04"
}, {
	"cityid" : "1705",
	"name" : "丹东",
	"province" : "17",
	"code" : "05"
}, {
	"cityid" : "1706",
	"name" : "抚顺",
	"province" : "17",
	"code" : "06"
}, {
	"cityid" : "1707",
	"name" : "阜新",
	"province" : "17",
	"code" : "07"
}, {
	"cityid" : "1708",
	"name" : "葫芦岛",
	"province" : "17",
	"code" : "08"
}, {
	"cityid" : "1709",
	"name" : "锦州",
	"province" : "17",
	"code" : "09"
}, {
	"cityid" : "1710",
	"name" : "辽阳",
	"province" : "17",
	"code" : "10"
}, {
	"cityid" : "1711",
	"name" : "盘锦",
	"province" : "17",
	"code" : "11"
}, {
	"cityid" : "1712",
	"name" : "沈阳",
	"province" : "17",
	"code" : "12"
}, {
	"cityid" : "1713",
	"name" : "铁岭",
	"province" : "17",
	"code" : "13"
}, {
	"cityid" : "1714",
	"name" : "营口",
	"province" : "17",
	"code" : "14"
}, {
	"cityid" : "1801",
	"name" : "阿拉善盟",
	"province" : "18",
	"code" : "01"
}, {
	"cityid" : "1802",
	"name" : "巴彦淖尔盟",
	"province" : "18",
	"code" : "02"
}, {
	"cityid" : "1803",
	"name" : "包头",
	"province" : "18",
	"code" : "03"
}, {
	"cityid" : "1804",
	"name" : "赤峰",
	"province" : "18",
	"code" : "04"
}, {
	"cityid" : "1805",
	"name" : "鄂尔多斯",
	"province" : "18",
	"code" : "05"
}, {
	"cityid" : "1806",
	"name" : "呼和浩特",
	"province" : "18",
	"code" : "06"
}, {
	"cityid" : "1807",
	"name" : "呼伦贝尔",
	"province" : "18",
	"code" : "07"
}, {
	"cityid" : "1808",
	"name" : "通辽",
	"province" : "18",
	"code" : "08"
}, {
	"cityid" : "1809",
	"name" : "乌海",
	"province" : "18",
	"code" : "09"
}, {
	"cityid" : "1810",
	"name" : "乌兰察布盟",
	"province" : "18",
	"code" : "10"
}, {
	"cityid" : "1811",
	"name" : "锡林郭勒盟",
	"province" : "18",
	"code" : "11"
}, {
	"cityid" : "1812",
	"name" : "兴安盟",
	"province" : "18",
	"code" : "12"
}, {
	"cityid" : "1901",
	"name" : "固原",
	"province" : "19",
	"code" : "01"
}, {
	"cityid" : "1902",
	"name" : "石嘴山",
	"province" : "19",
	"code" : "02"
}, {
	"cityid" : "1903",
	"name" : "吴忠",
	"province" : "19",
	"code" : "03"
}, {
	"cityid" : "1904",
	"name" : "银川",
	"province" : "19",
	"code" : "04"
}, {
	"cityid" : "2001",
	"name" : "果洛藏族自治州",
	"province" : "20",
	"code" : "01"
}, {
	"cityid" : "2002",
	"name" : "海北藏族自治州",
	"province" : "20",
	"code" : "02"
}, {
	"cityid" : "2003",
	"name" : "海东",
	"province" : "20",
	"code" : "03"
}, {
	"cityid" : "2004",
	"name" : "海南藏族自治州",
	"province" : "20",
	"code" : "04"
}, {
	"cityid" : "2005",
	"name" : "海西蒙古族藏族自治州",
	"province" : "20",
	"code" : "05"
}, {
	"cityid" : "2006",
	"name" : "黄南藏族自治州",
	"province" : "20",
	"code" : "06"
}, {
	"cityid" : "2007",
	"name" : "西宁",
	"province" : "20",
	"code" : "07"
}, {
	"cityid" : "2008",
	"name" : "玉树藏族自治州",
	"province" : "20",
	"code" : "08"
}, {
	"cityid" : "2101",
	"name" : "滨州",
	"province" : "21",
	"code" : "01"
}, {
	"cityid" : "2102",
	"name" : "德州",
	"province" : "21",
	"code" : "02"
}, {
	"cityid" : "2103",
	"name" : "东营",
	"province" : "21",
	"code" : "03"
}, {
	"cityid" : "2104",
	"name" : "菏泽",
	"province" : "21",
	"code" : "04"
}, {
	"cityid" : "2105",
	"name" : "济南",
	"province" : "21",
	"code" : "05"
}, {
	"cityid" : "2106",
	"name" : "济宁",
	"province" : "21",
	"code" : "06"
}, {
	"cityid" : "2107",
	"name" : "莱芜",
	"province" : "21",
	"code" : "07"
}, {
	"cityid" : "2108",
	"name" : "聊城",
	"province" : "21",
	"code" : "08"
}, {
	"cityid" : "2109",
	"name" : "临沂",
	"province" : "21",
	"code" : "09"
}, {
	"cityid" : "2110",
	"name" : "青岛",
	"province" : "21",
	"code" : "10"
}, {
	"cityid" : "2111",
	"name" : "日照",
	"province" : "21",
	"code" : "11"
}, {
	"cityid" : "2112",
	"name" : "泰安",
	"province" : "21",
	"code" : "12"
}, {
	"cityid" : "2113",
	"name" : "威海",
	"province" : "21",
	"code" : "13"
}, {
	"cityid" : "2114",
	"name" : "潍坊",
	"province" : "21",
	"code" : "14"
}, {
	"cityid" : "2115",
	"name" : "烟台",
	"province" : "21",
	"code" : "15"
}, {
	"cityid" : "2116",
	"name" : "枣庄",
	"province" : "21",
	"code" : "16"
}, {
	"cityid" : "2117",
	"name" : "淄博",
	"province" : "21",
	"code" : "17"
}, {
	"cityid" : "2201",
	"name" : "长治",
	"province" : "22",
	"code" : "01"
}, {
	"cityid" : "2202",
	"name" : "大同",
	"province" : "22",
	"code" : "02"
}, {
	"cityid" : "2203",
	"name" : "晋城",
	"province" : "22",
	"code" : "03"
}, {
	"cityid" : "2204",
	"name" : "晋中",
	"province" : "22",
	"code" : "04"
}, {
	"cityid" : "2205",
	"name" : "临汾",
	"province" : "22",
	"code" : "05"
}, {
	"cityid" : "2206",
	"name" : "吕梁",
	"province" : "22",
	"code" : "06"
}, {
	"cityid" : "2207",
	"name" : "朔州",
	"province" : "22",
	"code" : "07"
}, {
	"cityid" : "2208",
	"name" : "太原",
	"province" : "22",
	"code" : "08"
}, {
	"cityid" : "2209",
	"name" : "忻州",
	"province" : "22",
	"code" : "09"
}, {
	"cityid" : "2210",
	"name" : "阳泉",
	"province" : "22",
	"code" : "10"
}, {
	"cityid" : "2211",
	"name" : "运城",
	"province" : "22",
	"code" : "11"
}, {
	"cityid" : "2301",
	"name" : "安康",
	"province" : "23",
	"code" : "01"
}, {
	"cityid" : "2302",
	"name" : "宝鸡",
	"province" : "23",
	"code" : "02"
}, {
	"cityid" : "2303",
	"name" : "汉中",
	"province" : "23",
	"code" : "03"
}, {
	"cityid" : "2304",
	"name" : "商洛",
	"province" : "23",
	"code" : "04"
}, {
	"cityid" : "2305",
	"name" : "铜川",
	"province" : "23",
	"code" : "05"
}, {
	"cityid" : "2306",
	"name" : "渭南",
	"province" : "23",
	"code" : "06"
}, {
	"cityid" : "2307",
	"name" : "西安",
	"province" : "23",
	"code" : "07"
}, {
	"cityid" : "2308",
	"name" : "咸阳",
	"province" : "23",
	"code" : "08"
}, {
	"cityid" : "2309",
	"name" : "延安",
	"province" : "23",
	"code" : "09"
}, {
	"cityid" : "2310",
	"name" : "榆林",
	"province" : "23",
	"code" : "10"
}, {
	"cityid" : "2401",
	"name" : "上海",
	"province" : "24",
	"code" : "01"
}, {
	"cityid" : "2501",
	"name" : "阿坝藏族羌族自治州",
	"province" : "25",
	"code" : "01"
}, {
	"cityid" : "2502",
	"name" : "巴中",
	"province" : "25",
	"code" : "02"
}, {
	"cityid" : "2503",
	"name" : "成都",
	"province" : "25",
	"code" : "03"
}, {
	"cityid" : "2504",
	"name" : "达州",
	"province" : "25",
	"code" : "04"
}, {
	"cityid" : "2505",
	"name" : "德阳",
	"province" : "25",
	"code" : "05"
}, {
	"cityid" : "2506",
	"name" : "甘孜藏族自治州",
	"province" : "25",
	"code" : "06"
}, {
	"cityid" : "2507",
	"name" : "广安",
	"province" : "25",
	"code" : "07"
}, {
	"cityid" : "2508",
	"name" : "广元",
	"province" : "25",
	"code" : "08"
}, {
	"cityid" : "2509",
	"name" : "乐山",
	"province" : "25",
	"code" : "09"
}, {
	"cityid" : "2510",
	"name" : "凉山彝族自治州",
	"province" : "25",
	"code" : "10"
}, {
	"cityid" : "2511",
	"name" : "眉山",
	"province" : "25",
	"code" : "11"
}, {
	"cityid" : "2512",
	"name" : "绵阳",
	"province" : "25",
	"code" : "12"
}, {
	"cityid" : "2513",
	"name" : "南充",
	"province" : "25",
	"code" : "13"
}, {
	"cityid" : "2514",
	"name" : "内江",
	"province" : "25",
	"code" : "14"
}, {
	"cityid" : "2515",
	"name" : "攀枝花",
	"province" : "25",
	"code" : "15"
}, {
	"cityid" : "2516",
	"name" : "遂宁",
	"province" : "25",
	"code" : "16"
}, {
	"cityid" : "2517",
	"name" : "雅安",
	"province" : "25",
	"code" : "17"
}, {
	"cityid" : "2518",
	"name" : "宜宾",
	"province" : "25",
	"code" : "18"
}, {
	"cityid" : "2519",
	"name" : "资阳",
	"province" : "25",
	"code" : "19"
}, {
	"cityid" : "2520",
	"name" : "自贡",
	"province" : "25",
	"code" : "20"
}, {
	"cityid" : "2521",
	"name" : "泸州",
	"province" : "25",
	"code" : "21"
}, {
	"cityid" : "2601",
	"name" : "天津",
	"province" : "26",
	"code" : "01"
}, {
	"cityid" : "2701",
	"name" : "阿里",
	"province" : "27",
	"code" : "01"
}, {
	"cityid" : "2702",
	"name" : "昌都",
	"province" : "27",
	"code" : "02"
}, {
	"cityid" : "2703",
	"name" : "拉萨",
	"province" : "27",
	"code" : "03"
}, {
	"cityid" : "2704",
	"name" : "林芝",
	"province" : "27",
	"code" : "04"
}, {
	"cityid" : "2705",
	"name" : "那曲",
	"province" : "27",
	"code" : "05"
}, {
	"cityid" : "2706",
	"name" : "日喀则",
	"province" : "27",
	"code" : "06"
}, {
	"cityid" : "2707",
	"name" : "山南",
	"province" : "27",
	"code" : "07"
}, {
	"cityid" : "2801",
	"name" : "阿克苏",
	"province" : "28",
	"code" : "01"
}, {
	"cityid" : "2802",
	"name" : "阿拉尔",
	"province" : "28",
	"code" : "02"
}, {
	"cityid" : "2803",
	"name" : "巴音郭楞蒙古自治州",
	"province" : "28",
	"code" : "03"
}, {
	"cityid" : "2804",
	"name" : "博尔塔拉蒙古自治州",
	"province" : "28",
	"code" : "04"
}, {
	"cityid" : "2805",
	"name" : "昌吉回族自治州",
	"province" : "28",
	"code" : "05"
}, {
	"cityid" : "2806",
	"name" : "哈密",
	"province" : "28",
	"code" : "06"
}, {
	"cityid" : "2807",
	"name" : "和田",
	"province" : "28",
	"code" : "07"
}, {
	"cityid" : "2808",
	"name" : "喀什",
	"province" : "28",
	"code" : "08"
}, {
	"cityid" : "2809",
	"name" : "克拉玛依",
	"province" : "28",
	"code" : "09"
}, {
	"cityid" : "2810",
	"name" : "克孜勒苏柯尔克孜自治州",
	"province" : "28",
	"code" : "10"
}, {
	"cityid" : "2811",
	"name" : "石河子",
	"province" : "28",
	"code" : "11"
}, {
	"cityid" : "2812",
	"name" : "图木舒克",
	"province" : "28",
	"code" : "12"
}, {
	"cityid" : "2813",
	"name" : "吐鲁番",
	"province" : "28",
	"code" : "13"
}, {
	"cityid" : "2814",
	"name" : "乌鲁木齐",
	"province" : "28",
	"code" : "14"
}, {
	"cityid" : "2815",
	"name" : "五家渠",
	"province" : "28",
	"code" : "15"
}, {
	"cityid" : "2816",
	"name" : "伊犁哈萨克自治州",
	"province" : "28",
	"code" : "16"
}, {
	"cityid" : "2901",
	"name" : "保山",
	"province" : "29",
	"code" : "01"
}, {
	"cityid" : "2902",
	"name" : "楚雄彝族自治州",
	"province" : "29",
	"code" : "02"
}, {
	"cityid" : "2903",
	"name" : "大理白族自治州",
	"province" : "29",
	"code" : "03"
}, {
	"cityid" : "2904",
	"name" : "德宏傣族景颇族自治州",
	"province" : "29",
	"code" : "04"
}, {
	"cityid" : "2905",
	"name" : "迪庆藏族自治州",
	"province" : "29",
	"code" : "05"
}, {
	"cityid" : "2906",
	"name" : "红河哈尼族彝族自治州",
	"province" : "29",
	"code" : "06"
}, {
	"cityid" : "2907",
	"name" : "昆明",
	"province" : "29",
	"code" : "07"
}, {
	"cityid" : "2908",
	"name" : "丽江",
	"province" : "29",
	"code" : "08"
}, {
	"cityid" : "2909",
	"name" : "临沧",
	"province" : "29",
	"code" : "09"
}, {
	"cityid" : "2910",
	"name" : "怒江僳僳族自治州",
	"province" : "29",
	"code" : "10"
}, {
	"cityid" : "2911",
	"name" : "曲靖",
	"province" : "29",
	"code" : "11"
}, {
	"cityid" : "2912",
	"name" : "思茅",
	"province" : "29",
	"code" : "12"
}, {
	"cityid" : "2913",
	"name" : "文山壮族苗族自治州",
	"province" : "29",
	"code" : "13"
}, {
	"cityid" : "2914",
	"name" : "西双版纳傣族自治州",
	"province" : "29",
	"code" : "14"
}, {
	"cityid" : "2915",
	"name" : "玉溪",
	"province" : "29",
	"code" : "15"
}, {
	"cityid" : "2916",
	"name" : "昭通",
	"province" : "29",
	"code" : "16"
}, {
	"cityid" : "3001",
	"name" : "杭州",
	"province" : "30",
	"code" : "01"
}, {
	"cityid" : "3002",
	"name" : "湖州",
	"province" : "30",
	"code" : "02"
}, {
	"cityid" : "3003",
	"name" : "嘉兴",
	"province" : "30",
	"code" : "03"
}, {
	"cityid" : "3004",
	"name" : "金华",
	"province" : "30",
	"code" : "04"
}, {
	"cityid" : "3005",
	"name" : "丽水",
	"province" : "30",
	"code" : "05"
}, {
	"cityid" : "3006",
	"name" : "宁波",
	"province" : "30",
	"code" : "06"
}, {
	"cityid" : "3007",
	"name" : "绍兴",
	"province" : "30",
	"code" : "07"
}, {
	"cityid" : "3008",
	"name" : "台州",
	"province" : "30",
	"code" : "08"
}, {
	"cityid" : "3009",
	"name" : "温州",
	"province" : "30",
	"code" : "09"
}, {
	"cityid" : "3010",
	"name" : "舟山",
	"province" : "30",
	"code" : "10"
}, {
	"cityid" : "3011",
	"name" : "衢州",
	"province" : "30",
	"code" : "11"
}, {
	"cityid" : "3101",
	"name" : "重庆",
	"province" : "31",
	"code" : "01"
} ];

dsCity.dataList(dataList);