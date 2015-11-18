(function () {
	// dsFinance
	var dsFinance = new jslet.data.Dataset("finance");
	f = jslet.data.createStringField("itemcd", 10);
	f.label("ID");
	dsFinance.addField(f);
	
	f = jslet.data.createStringField("itemna", 50);
	f.label("Name");
	dsFinance.addField(f);
	
	f = jslet.data.createStringField("itemup", 10);
	f.label("Parent ID");
	dsFinance.addField(f);
	
	f = jslet.data.createNumberField("level", 3);
	f.label("Level");
	dsFinance.addField(f);
	
	dsFinance.keyField("itemcd");
	dsFinance.nameField("itemna");
	dsFinance.parentField("itemup");
	dsFinance.levelField("level");
	
	var _datalist =
	[
	  {
	      "itemcd": "11",
	      "itemna": "股本结构",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "1101",
	      "itemna": "一、总股本",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1102",
	      "itemna": "二、未流通股份",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1103",
	      "itemna": "1、发起人股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1104",
	      "itemna": "国家股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1105",
	      "itemna": "境内法人股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1106",
	      "itemna": "外资法人股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1107",
	      "itemna": "其它发起人股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1108",
	      "itemna": "2、募集法人股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1109",
	      "itemna": "3、自然人法人股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1110",
	      "itemna": "4、职工股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1111",
	      "itemna": "5、转配股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1112",
	      "itemna": "6、优先股及其他",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1113",
	      "itemna": "三、流通股份",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1114",
	      "itemna": "1、流通A股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1115",
	      "itemna": "已上市流通A股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1116",
	      "itemna": "其中：高管股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1117",
	      "itemna": "战略投资者配售持股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1118",
	      "itemna": "一般法人配售持股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1119",
	      "itemna": "基金配售持股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1120",
	      "itemna": "增发未上市",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1121",
	      "itemna": "配股未上市",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1122",
	      "itemna": "其他流通股份",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1123",
	      "itemna": "2、B股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1124",
	      "itemna": "3、H股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "1125",
	      "itemna": "4、S股/N股",
	      "itemup": "11",
	      "level": 1
	  },
	  {
	      "itemcd": "12",
	      "itemna": "增发指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "12_iprice",
	      "itemna": "发行价格(人民币)",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_Ipricer",
	      "itemna": "发行价格(人民币复权)",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_issfee",
	      "itemna": "实际发行费用总额",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_issunm",
	      "itemna": "增发数量",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_issupe",
	      "itemna": "发行市盈率",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_oprice",
	      "itemna": "发行价格(外币)",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_parvl",
	      "itemna": "每股面值",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_progrs",
	      "itemna": "增发进度",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_PSQK",
	      "itemna": "配售情况",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_PSQK_commnm",
	      "itemna": "普通投资者获售数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_genehs",
	      "itemna": "一般法人获配家数",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_genenm",
	      "itemna": "一般法人投资者获配数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_leganm",
	      "itemna": "法人投资者获配数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_ofmult",
	      "itemna": "网下超额认购倍数",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_oldhnm",
	      "itemna": "向老股东实际配售数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_onmult",
	      "itemna": "网上超额认购倍数",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_orginm",
	      "itemna": "机构投资者获配数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_othenm",
	      "itemna": "其他投资者获售数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_secuhs",
	      "itemna": "证券基金获配家数",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_secunm",
	      "itemna": "证券投资基金获配数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_strahs",
	      "itemna": "战略投资获配家数",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_PSQK_stranm",
	      "itemna": "战略投资者获配数量",
	      "itemup": "12_PSQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_raisam",
	      "itemna": "实际募集资金总额",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_raisnet",
	      "itemna": "实际募集资金净额",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_SGQK",
	      "itemna": "申购情况",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_SGQK_ofaphs",
	      "itemna": "网下有效申购户数",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_SGQK_ofapnm",
	      "itemna": "网下有效申购股数",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_SGQK_onaphs",
	      "itemna": "网上有效申购户数",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_SGQK_onapnm",
	      "itemna": "网上有效申购股数",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_SGQK_subsfd",
	      "itemna": "总有效认购资金",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_SGQK_totlhs",
	      "itemna": "总有效申购户数",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_SGQK_totlnm",
	      "itemna": "总有效申购股数",
	      "itemup": "12_SGQK",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ",
	      "itemna": "增发相关日期",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_ZFXGRQ_commdt",
	      "itemna": "普通投资者股票可上市交易日期",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_exrdt",
	      "itemna": "除权日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_genedt",
	      "itemna": "一般法人投资者可上市交易日期",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_Issudt0",
	      "itemna": "发行结果公告日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_Issudt1",
	      "itemna": "增发公告日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_Issudt2",
	      "itemna": "股东大会日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_Issudt3",
	      "itemna": "预案公告日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_oflndt",
	      "itemna": "网下发行申购日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_onlndt",
	      "itemna": "网上发行申购日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_regdt",
	      "itemna": "股权登记日",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_secudt",
	      "itemna": "证券基金股票可上市交易日期",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_ZFXGRQ_stradt",
	      "itemna": "战略投资者股票可上市交易日期",
	      "itemup": "12_ZFXGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "12_currcd",
	      "itemna": "币种",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_FXFSYCXS",
	      "itemna": "发行方式与承销商",
	      "itemup": "12",
	      "level": 1
	  },
	  {
	      "itemcd": "12_FXFSYCXS_agencynm",
	      "itemna": "主承销商名称",
	      "itemup": "12_FXFSYCXS",
	      "level": 2
	  },
	  {
	      "itemcd": "12_FXFSYCXS_Ispub",
	      "itemna": "增发方式",
	      "itemup": "12_FXFSYCXS",
	      "level": 2
	  },
	  {
	      "itemcd": "13",
	      "itemna": "预测评级",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "13_YCZHZ",
	      "itemna": "预测综合值",
	      "itemup": "13",
	      "level": 1
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC",
	      "itemna": "报表相关预测",
	      "itemup": "13_YCZHZ",
	      "level": 2
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_1",
	      "itemna": "总资产 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_2",
	      "itemna": "负债总额 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_3",
	      "itemna": "股东权益合计 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_51",
	      "itemna": "营业收入 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_52",
	      "itemna": "营业成本 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_5301",
	      "itemna": "营业利润 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_5302",
	      "itemna": "利润总额 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_5303",
	      "itemna": "净利润 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_61",
	      "itemna": "经营性活动现金净流量 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_62",
	      "itemna": "投资活动产生的现金流量净额 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_810105",
	      "itemna": "息税前利润 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_810108",
	      "itemna": "自由现金流量 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_BBXGYC_810109",
	      "itemna": "股息 ",
	      "itemup": "13_YCZHZ_BBXGYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_GZYC",
	      "itemna": "估值预测",
	      "itemup": "13_YCZHZ",
	      "level": 2
	  },
	  {
	      "itemcd": "13_YCZHZ_GZYC_pbftm",
	      "itemna": "市净率 P/B",
	      "itemup": "13_YCZHZ_GZYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_GZYC_pcfftm",
	      "itemna": "价格/现金流 P/CF",
	      "itemup": "13_YCZHZ_GZYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_GZYC_peftm",
	      "itemna": "市盈率 P/E",
	      "itemup": "13_YCZHZ_GZYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_GZYC_psftm",
	      "itemna": "市销率 P/S",
	      "itemup": "13_YCZHZ_GZYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_YLYC",
	      "itemna": "盈利预测",
	      "itemup": "13_YCZHZ",
	      "level": 2
	  },
	  {
	      "itemcd": "13_YCZHZ_YLYC_820111",
	      "itemna": "每股分红 ",
	      "itemup": "13_YCZHZ_YLYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_YLYC_830107",
	      "itemna": "总资产收益率 ",
	      "itemup": "13_YCZHZ_YLYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_YLYC_830108",
	      "itemna": "净资产收益率 ",
	      "itemup": "13_YCZHZ_YLYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_CCYC",
	      "itemna": "成长预测",
	      "itemup": "13_YCZHZ",
	      "level": 2
	  },
	  {
	      "itemcd": "13_YCZHZ_CCYC_840101",
	      "itemna": "业务收入年增长率",
	      "itemup": "13_YCZHZ_CCYC",
	      "level": 3
	  },
	  {
	      "itemcd": "13_YCZHZ_CCYC_840103",
	      "itemna": "净利润年增长率",
	      "itemup": "13_YCZHZ_CCYC",
	      "level": 3
	  },
	  {
	      "itemcd": "rat_consensus",
	      "itemna": "投资评级",
	      "itemup": "13",
	      "level": 1
	  },
	  {
	      "itemcd": "rat_avgrvl",
	      "itemna": "综合评级系数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_buynm",
	      "itemna": "评级买入家数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_neunm",
	      "itemna": "评级观望家数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_orgnm",
	      "itemna": "评级机构家数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_rednm",
	      "itemna": "评级减持家数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_sbuynm",
	      "itemna": "评级强力买入家数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_selnm",
	      "itemna": "评级卖出家数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_senvl",
	      "itemna": "分析师情绪指数",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_tavgvl",
	      "itemna": "目标价平均值",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_tmaxvl",
	      "itemna": "目标价最高值",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "rat_tminvl",
	      "itemna": "目标价最低值",
	      "itemup": "rat_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "14",
	      "itemna": "行情数据",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "14_fact",
	      "itemna": "基本行情",
	      "itemup": "14",
	      "level": 1
	  },
	  {
	      "itemcd": "14f_amp",
	      "itemna": "波动幅度",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_chg",
	      "itemna": "涨跌",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_cprice",
	      "itemna": "收盘价",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_hprice",
	      "itemna": "最高价",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_lprice",
	      "itemna": "最低价",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_oprice",
	      "itemna": "开盘价",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_pprice",
	      "itemna": "昨收盘",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_pro",
	      "itemna": "涨跌幅",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_tor",
	      "itemna": "换手率",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_turnover",
	      "itemna": "成交额",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14f_volume",
	      "itemna": "成交量",
	      "itemup": "14_fact",
	      "level": 2
	  },
	  {
	      "itemcd": "14_reright",
	      "itemna": "复权行情",
	      "itemup": "14",
	      "level": 1
	  },
	  {
	      "itemcd": "14r_amp",
	      "itemna": "波动幅度(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_chg",
	      "itemna": "涨跌(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_cprice",
	      "itemna": "收盘价(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_hprice",
	      "itemna": "最高价(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_lprice",
	      "itemna": "最低价(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_oprice",
	      "itemna": "开盘价(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_pprice",
	      "itemna": "昨收盘(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_pro",
	      "itemna": "涨跌幅(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_tor",
	      "itemna": "换手率(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_turnover",
	      "itemna": "成交额(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14r_volume",
	      "itemna": "成交量(复权)",
	      "itemup": "14_reright",
	      "level": 2
	  },
	  {
	      "itemcd": "14_statistics",
	      "itemna": "区间行情",
	      "itemup": "14",
	      "level": 1
	  },
	  {
	      "itemcd": "14sq0101",
	      "itemna": "涨跌幅(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0102",
	      "itemna": "相对涨跌幅(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0103",
	      "itemna": "涨跌(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0104",
	      "itemna": "波动幅度(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0105",
	      "itemna": "最高价(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0106",
	      "itemna": "最低价(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0107",
	      "itemna": "平均价(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0201",
	      "itemna": "成交量(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0202",
	      "itemna": "平均成交量",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0301",
	      "itemna": "成交额(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0401",
	      "itemna": "换手率(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0501",
	      "itemna": "资金流入(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "14sq0502",
	      "itemna": "资金流占比(区间)",
	      "itemup": "14_statistics",
	      "level": 2
	  },
	  {
	      "itemcd": "15",
	      "itemna": "估值指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "pbnew",
	      "itemna": "市净率",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "pcfftm",
	      "itemna": "价格/现金流(未来12个月)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "pcfttm",
	      "itemna": "价格/现金流(过去12个月)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "peftm",
	      "itemna": "市盈率(未来12个月)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "peg3y",
	      "itemna": "PEG(3年)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "pettm",
	      "itemna": "市盈率(过去12个月)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "psftm",
	      "itemna": "市销率(未来12个月)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "psttm",
	      "itemna": "市销率(过去12个月)",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "fcap",
	      "itemna": "流通市值",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "cap",
	      "itemna": "总市值",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "ev",
	      "itemna": "企业价值",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "eve",
	      "itemna": "企业价值倍数",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "evs",
	      "itemna": "企业价值/销售收入",
	      "itemup": "15",
	      "level": 1
	  },
	  {
	      "itemcd": "16",
	      "itemna": "预测评级",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "est_consensus",
	      "itemna": "盈利预测综合值",
	      "itemup": "16",
	      "level": 1
	  },
	  {
	      "itemcd": "est1",
	      "itemna": "总资产(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est1111",
	      "itemna": "应收账款(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est2",
	      "itemna": "负债总额(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est2114",
	      "itemna": "应付账款(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est3",
	      "itemna": "股东权益合计(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est51",
	      "itemna": "营业总收入(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est52",
	      "itemna": "营业总成本(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est5210",
	      "itemna": "营业税金及附加(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est5217",
	      "itemna": "财务费用(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est5223",
	      "itemna": "所得税(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est5301",
	      "itemna": "营业利润(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est5302",
	      "itemna": "利润总额(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est5303",
	      "itemna": "净利润(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est61",
	      "itemna": "经营性活动现金净流量(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est62",
	      "itemna": "投资活动产生的现金流量净额(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est810101",
	      "itemna": "经常性业务净利润(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est810105",
	      "itemna": "息税前利润(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est810107",
	      "itemna": "EBITDA(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est810108",
	      "itemna": "自由现金流量(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est810109",
	      "itemna": "股息(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est810111",
	      "itemna": "折旧摊销(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est820101",
	      "itemna": "每股净资产(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est820102",
	      "itemna": "每股收益(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est820103",
	      "itemna": "每股业务收入(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est820106",
	      "itemna": "每股经营性活动现金净流量(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est820111",
	      "itemna": "每股分红(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est830101",
	      "itemna": "毛利率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est830107",
	      "itemna": "总资产收益率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est830108",
	      "itemna": "净资产收益率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est830203",
	      "itemna": "负债权益比率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est830214",
	      "itemna": "资产权益比率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est840101",
	      "itemna": "业务收入增长率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est840102",
	      "itemna": "业务利润增长率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "est840103",
	      "itemna": "净利润增长率(预测)",
	      "itemup": "est_consensus",
	      "level": 2
	  },
	  {
	      "itemcd": "17",
	      "itemna": "基本信息",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "corp_info",
	      "itemna": "公司基本信息",
	      "itemup": "17",
	      "level": 1
	  },
	  {
	      "itemcd": "ci_contad",
	      "itemna": "公司联系地址",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_corpen",
	      "itemna": "公司英文名称",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_corpna",
	      "itemna": "公司名称",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_corpse",
	      "itemna": "公司英文简称",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_corpsn",
	      "itemna": "公司简称",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_currcd",
	      "itemna": "货币代码",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_email",
	      "itemna": "公司邮箱",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_emplnm",
	      "itemna": "职工总数",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_enddt",
	      "itemna": "结束日期",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_fax",
	      "itemna": "公司传真",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_indu",
	      "itemna": "所属行业",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_intro",
	      "itemna": "公司简介",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_introbs",
	      "itemna": "业务简介",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_lawps",
	      "itemna": "法人代表",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_listdt",
	      "itemna": "首次上市日期",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_mainbs",
	      "itemna": "主要产品及业务",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_offiad",
	      "itemna": "办公地址",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_orgno",
	      "itemna": "组织代码",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_phone",
	      "itemna": "公司电话",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_primbs",
	      "itemna": "经营范围主营",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_regiad",
	      "itemna": "注册地址",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_regica",
	      "itemna": "注册资本(万元)",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_regino",
	      "itemna": "工商登记号",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_relepaper",
	      "itemna": "信息批露报纸",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_releweb",
	      "itemna": "信息批露网址",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_secobs",
	      "itemna": "经营范围兼营",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_secrps",
	      "itemna": "董事会秘书",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_setdt",
	      "itemna": "成立日期",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_taxno",
	      "itemna": "税务登记号码",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_web",
	      "itemna": "投资者关系网址",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_zip",
	      "itemna": "办公地址邮编",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "ci_zone",
	      "itemna": "区号",
	      "itemup": "corp_info",
	      "level": 2
	  },
	  {
	      "itemcd": "stk_info",
	      "itemna": "股票基本信息",
	      "itemup": "17",
	      "level": 1
	  },
	  {
	      "itemcd": "si_concept",
	      "itemna": "相关概念",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "si_issudt",
	      "itemna": "发行日期",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "si_listdt",
	      "itemna": "上市日期",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "si_salena",
	      "itemna": "主承销商名称",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "si_stkcd",
	      "itemna": "股票代码",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "si_stkse",
	      "itemna": "股票英文简称",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "si_stksn",
	      "itemna": "股票简称",
	      "itemup": "stk_info",
	      "level": 2
	  },
	  {
	      "itemcd": "18",
	      "itemna": "财务分析",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "18_CCNL",
	      "itemna": "成长能力",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_CCNL_840101",
	      "itemna": "业务收入平均增长率",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CCNL_840102",
	      "itemna": "业务利润平均增长率",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CCNL_840103",
	      "itemna": "净利润平均增长率",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CCNL_840104",
	      "itemna": "毛利率平均增长率",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CCNL_840105",
	      "itemna": "资产报酬率平均增长率",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CCNL_840106",
	      "itemna": "权益报酬率平均增长率 ",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CCNL_840108",
	      "itemna": "每股收益平均增长率",
	      "itemup": "18_CCNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL",
	      "itemna": "偿债能力",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_CZNL_830201",
	      "itemna": "流动比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830202",
	      "itemna": "速动比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830203",
	      "itemna": "产权比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830204",
	      "itemna": "长期负债权益比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830205",
	      "itemna": "资产负债率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830207",
	      "itemna": "长期负债比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830208",
	      "itemna": "现金流量比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_830211",
	      "itemna": "利息保障倍数",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_870104",
	      "itemna": "现金比率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_870105",
	      "itemna": "权益乘数",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_CZNL_870106",
	      "itemna": "长期资本负债率",
	      "itemup": "18_CZNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB",
	      "itemna": "估值指标",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_GZZB_cap",
	      "itemna": "总市值",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_div",
	      "itemna": "股息率",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_ev",
	      "itemna": "EV",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_eve",
	      "itemna": "EV/EBITDA",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_evs",
	      "itemna": "EV/SALES",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_pbnew",
	      "itemna": "市净率 P/B",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_pcfttm",
	      "itemna": "价格/现金流 P/CF",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_peg",
	      "itemna": "PEG",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_pettm",
	      "itemna": "市盈率 P/E",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GZZB_psttm",
	      "itemna": "市销率 P/S",
	      "itemup": "18_GZZB",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GDHLNL",
	      "itemna": "股东获利能力",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_GDHLNL_820102",
	      "itemna": "每股盈利",
	      "itemup": "18_GDHLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GDHLNL_820103",
	      "itemna": "每股业务收入",
	      "itemup": "18_GDHLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GDHLNL_820104",
	      "itemna": "每股EBITDA",
	      "itemup": "18_GDHLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GDHLNL_820106",
	      "itemna": "每股经营性活动现金流",
	      "itemup": "18_GDHLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_GDHLNL_820110",
	      "itemna": "每股净现金流量",
	      "itemup": "18_GDHLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_XJLLNL",
	      "itemna": "现金流量能力",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_XJLLNL_810103",
	      "itemna": "主营收入现金含量",
	      "itemup": "18_XJLLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_XJLLNL_810104",
	      "itemna": "净利润现金含量",
	      "itemup": "18_XJLLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_XJLLNL_810108",
	      "itemna": "自由现金流量",
	      "itemup": "18_XJLLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_XJLLNL_830111",
	      "itemna": "盈利现金比率",
	      "itemup": "18_XJLLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_XJLLNL_830301",
	      "itemna": "全部资产现金回收率",
	      "itemup": "18_XJLLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL",
	      "itemna": "营运能力",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_YYNL_830116",
	      "itemna": "管理费用占收入比例",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL_830117",
	      "itemna": "财务费用占收入比例",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL_830118",
	      "itemna": "财务杠杆",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL_830401",
	      "itemna": "总资产周转率",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL_830402",
	      "itemna": "流动资产周转率",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL_830403",
	      "itemna": "应收帐款周转率",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YYNL_870107",
	      "itemna": "非流动资产周转率",
	      "itemup": "18_YYNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL",
	      "itemna": "盈利能力",
	      "itemup": "18",
	      "level": 1
	  },
	  {
	      "itemcd": "18_YLNL_51",
	      "itemna": "业务收入",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_5301",
	      "itemna": "业务利润",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_5303",
	      "itemna": "净利润",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_810105",
	      "itemna": "EBIT",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_810106",
	      "itemna": "EBITD",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_810107",
	      "itemna": "EBITDA",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_810109",
	      "itemna": "分红(每10股)",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_830101",
	      "itemna": "毛利率",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_830107",
	      "itemna": "资产报酬率",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_830108",
	      "itemna": "权益报酬率",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_830119",
	      "itemna": "股息支付率",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850101",
	      "itemna": "平均业务收入（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850102",
	      "itemna": "平均业务利润（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850103",
	      "itemna": "平均毛利率（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850105",
	      "itemna": "平均净利润率（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850106",
	      "itemna": "平均净资产报酬率（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850108",
	      "itemna": "平均每股收益（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "18_YLNL_850109",
	      "itemna": "平均分红（3y）",
	      "itemup": "18_YLNL",
	      "level": 2
	  },
	  {
	      "itemcd": "19",
	      "itemna": "分红指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "19_acctdt",
	      "itemna": "股息到帐日期",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_assics",
	      "itemna": "派现（含税）",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_assocs",
	      "itemna": "派现（外币）",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_convrt",
	      "itemna": "转增股比例（10转增x）",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_exrdt",
	      "itemna": "除权除息日",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_listdt",
	      "itemna": "送转股上市日",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_plantp",
	      "itemna": "方案类别",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_regdt",
	      "itemna": "股权登记日",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_sendrt",
	      "itemna": "送股比例（10送x）",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_taxcs",
	      "itemna": "实派（税后）",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "19_tradt",
	      "itemna": "最后交易日",
	      "itemup": "19",
	      "level": 1
	  },
	  {
	      "itemcd": "20",
	      "itemna": "股本指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "20_1",
	      "itemna": "一、总股本",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_11",
	      "itemna": "二、受限流通股份",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_111",
	      "itemna": "1、发起人股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_11101",
	      "itemna": "国家股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_11102",
	      "itemna": "境内法人股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_11103",
	      "itemna": "外资法人股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_11104",
	      "itemna": "其它发起人股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_112",
	      "itemna": "2、募集法人股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_113",
	      "itemna": "3、自然人法人股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_114",
	      "itemna": "4、职工股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_115",
	      "itemna": "5、转配股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_116",
	      "itemna": "6、优先股及其他",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_12",
	      "itemna": "三、流通股份",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_121",
	      "itemna": "1、流通A股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1211",
	      "itemna": "已上市流通A股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_12111",
	      "itemna": "其中：高管股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1212",
	      "itemna": "战略投资者配售持股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1213",
	      "itemna": "一般法人配售持股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1214",
	      "itemna": "基金配售持股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1215",
	      "itemna": "增发未上市",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1216",
	      "itemna": "配股未上市",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_1217",
	      "itemna": "其他流通股份",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_122",
	      "itemna": "2、B股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_123",
	      "itemna": "3、H股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_124",
	      "itemna": "4、S股/N股",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_chgid",
	      "itemna": "股本变动原因",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "20_chgrs",
	      "itemna": "股本变动原因说明",
	      "itemup": "20",
	      "level": 1
	  },
	  {
	      "itemcd": "21",
	      "itemna": "财务报表",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "21_asset",
	      "itemna": "资产负债表",
	      "itemup": "21",
	      "level": 1
	  },
	  {
	      "itemcd": "211",
	      "itemna": "资产总计",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "2111",
	      "itemna": "流动资产合计(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211101",
	      "itemna": "货币资金",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211102",
	      "itemna": "现金及存放中央银行款项(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211103",
	      "itemna": "结算备付金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211104",
	      "itemna": "贵金属(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211105",
	      "itemna": "存放同业款项(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211106",
	      "itemna": "拆出资金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211107",
	      "itemna": "交易性金融资产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211108",
	      "itemna": "衍生金融资产(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211109",
	      "itemna": "买入返售金融资产(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211110",
	      "itemna": "应收票据(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211111",
	      "itemna": "应收账款",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211112",
	      "itemna": "预付款项",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211113",
	      "itemna": "其他应收款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211114",
	      "itemna": "应收关联公司款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211115",
	      "itemna": "应收利息",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211116",
	      "itemna": "应收股利",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211117",
	      "itemna": "存货(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211118",
	      "itemna": "待摊费用(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211119",
	      "itemna": "一年内到期的非流动资产(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211120",
	      "itemna": "其他流动资产(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211121",
	      "itemna": "待摊利息(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211122",
	      "itemna": "应收保费(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211123",
	      "itemna": "应收分保账款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21112301",
	      "itemna": "应收分保合同准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21112302",
	      "itemna": "应收分保未到期责任准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21112303",
	      "itemna": "应收分保未决赔款准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21112304",
	      "itemna": "应收分保寿险责任准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21112305",
	      "itemna": "应收分保长期健康险责任准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211124",
	      "itemna": "保户质押贷款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211125",
	      "itemna": "债权计划投资(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211126",
	      "itemna": "发放贷款及垫款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211127",
	      "itemna": "存出保证金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211128",
	      "itemna": "其他应收款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211129",
	      "itemna": "定期存款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "2112",
	      "itemna": "非流动资产合计(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211201",
	      "itemna": "可供出售金融资产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211202",
	      "itemna": "持有至到期投资",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211203",
	      "itemna": "长期应收款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211204",
	      "itemna": "长期股权投资",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211205",
	      "itemna": "存出资本保证金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211206",
	      "itemna": "投资性房地产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211207",
	      "itemna": "固定资产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211208",
	      "itemna": "在建工程",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211209",
	      "itemna": "工程物资(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211210",
	      "itemna": "固定资产清理",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211211",
	      "itemna": "生产性生物资产(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211212",
	      "itemna": "油气资产(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211213",
	      "itemna": "无形资产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211214",
	      "itemna": "开发支出",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211215",
	      "itemna": "商誉",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211216",
	      "itemna": "长期待摊费用",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211217",
	      "itemna": "独立账户资产(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211218",
	      "itemna": "代理业务资产(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211219",
	      "itemna": "待处理抵债资产(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211220",
	      "itemna": "递延所得税资产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211221",
	      "itemna": "其他非流动资产",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "211222",
	      "itemna": "公益性生物资产(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212",
	      "itemna": "负债合计",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "2121",
	      "itemna": "流动负债合计(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212101",
	      "itemna": "向中央银行借款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212102",
	      "itemna": "存入保证金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212103",
	      "itemna": "拆入资金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212104",
	      "itemna": "同业及其他金融机构存放款项(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212105",
	      "itemna": "短期借款",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212106",
	      "itemna": "交易性金融负债",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212107",
	      "itemna": "衍生金融负债(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212108",
	      "itemna": "卖出回购金融资产款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212109",
	      "itemna": "吸收存款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212110",
	      "itemna": "汇出汇款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212111",
	      "itemna": "代理买卖证券款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212112",
	      "itemna": "代理承销证券款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212113",
	      "itemna": "应付票据",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212114",
	      "itemna": "应付账款",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212115",
	      "itemna": "预收款项",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212116",
	      "itemna": "预收保费(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212117",
	      "itemna": "应付手续费及佣金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212118",
	      "itemna": "应付分保账款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212119",
	      "itemna": "应付职工薪酬",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212120",
	      "itemna": "应交税费",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212121",
	      "itemna": "应付利息",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212122",
	      "itemna": "应付股利",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212123",
	      "itemna": "其他应付款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21212301",
	      "itemna": "应付关联公司款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212124",
	      "itemna": "一年内到期的非流动负债(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212125",
	      "itemna": "其他流动负债(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "2122",
	      "itemna": "非流动负债合计(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212201",
	      "itemna": "代理业务负债(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212202",
	      "itemna": "应付赔付款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212203",
	      "itemna": "应付保单红利(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212204",
	      "itemna": "保户储金及投资款(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212205",
	      "itemna": "未到期责任准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212206",
	      "itemna": "未决赔款准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212207",
	      "itemna": "寿险责任准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212208",
	      "itemna": "长期健康险责任准备金(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212209",
	      "itemna": "长期借款",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212210",
	      "itemna": "应付债券",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212211",
	      "itemna": "长期应付款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212212",
	      "itemna": "专项应付款(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212213",
	      "itemna": "应付次级债(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212214",
	      "itemna": "预计负债",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212215",
	      "itemna": "独立账户负债(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212216",
	      "itemna": "递延所得税负债",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212217",
	      "itemna": "其他非流动负债",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "212218",
	      "itemna": "递延收益(非金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213",
	      "itemna": "所有者权益合计",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "2131",
	      "itemna": "母公司股东权益",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213101",
	      "itemna": "实收资本",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213102",
	      "itemna": "资本公积",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213103",
	      "itemna": "盈余公积",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213104",
	      "itemna": "减:库存股",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213105",
	      "itemna": "未分配利润",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213106",
	      "itemna": "外币报表折算差额",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213107",
	      "itemna": "一般风险准备",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213108",
	      "itemna": "交易风险准备(金融)",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "213109",
	      "itemna": "专项储备",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "2132",
	      "itemna": "少数股东权益",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "214",
	      "itemna": "负债和所有者权益",
	      "itemup": "21_asset",
	      "level": 2
	  },
	  {
	      "itemcd": "21_cash",
	      "itemna": "现金流量表",
	      "itemup": "21",
	      "level": 1
	  },
	  {
	      "itemcd": "2161",
	      "itemna": "经营活动产生的现金流量净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "216101",
	      "itemna": "经营活动现金流入小计",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610101",
	      "itemna": "客户存款和同业存放款项净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610102",
	      "itemna": "向中央银行借款净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610103",
	      "itemna": "存放央行和同业款项净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610104",
	      "itemna": "保户储金及投资款净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610105",
	      "itemna": "拆借资金净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2161010501",
	      "itemna": "拆入资金净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2161010502",
	      "itemna": "拆出资金净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610106",
	      "itemna": "买入返售款项净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610107",
	      "itemna": "卖出回购款项净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610108",
	      "itemna": "收取利息、手续费及佣金的现金(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610109",
	      "itemna": "收到原保险合同保费取得的现金(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610110",
	      "itemna": "收到再保业务现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610111",
	      "itemna": "保户投资款及代理业务负债净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610112",
	      "itemna": "收到交易性金融资产现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610113",
	      "itemna": "销售商品、提供劳务收到的现金(非金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610114",
	      "itemna": "收到的租金(非金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610115",
	      "itemna": "收到的补助",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610116",
	      "itemna": "收到的税费返还",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610117",
	      "itemna": "收到其他与经营活动有关的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "216102",
	      "itemna": "经营活动现金流出小计",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610201",
	      "itemna": "客户贷款及垫款净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610202",
	      "itemna": "向中央银行借款净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610203",
	      "itemna": "拆借资金净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2161020301",
	      "itemna": "拆入资金净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2161020302",
	      "itemna": "拆出资金净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610204",
	      "itemna": "买入返售款项净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610205",
	      "itemna": "卖出回购款项净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610206",
	      "itemna": "存放央行和同业款项净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610207",
	      "itemna": "支付原保险合同赔付款项的现金(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610208",
	      "itemna": "支付再保业务现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610209",
	      "itemna": "保户储金及投资款净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610210",
	      "itemna": "支付利息、手续费及佣金的现金(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610211",
	      "itemna": "支付保单红利的现金(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610212",
	      "itemna": "购买商品、接受劳务支付的现金(非金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610213",
	      "itemna": "支付给职工以及为职工支付的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610214",
	      "itemna": "支付的各项税费",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21610215",
	      "itemna": "支付其他与经营活动有关的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2162",
	      "itemna": "投资活动产生的现金流量净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "216201",
	      "itemna": "投资活动产生的现金流入小计",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620101",
	      "itemna": "收回投资所收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620102",
	      "itemna": "取得投资收益收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620103",
	      "itemna": "处置联营企业及其他长期股权投资收到的现金净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620104",
	      "itemna": "处置固定资产和其他长期资产收回的现金净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620105",
	      "itemna": "收到买入返售金融资产现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620106",
	      "itemna": "少数股东对子公司增资所收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620107",
	      "itemna": "收到的其他与投资活动有关的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "216202",
	      "itemna": "投资活动产生的现金流出小计",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620201",
	      "itemna": "投资支付的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620202",
	      "itemna": "保户质押贷款净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620203",
	      "itemna": "对子公司、联营和合营企业增资及取得子公司所支付的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2162020301",
	      "itemna": "购买新增子公司支付的现金净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2162020302",
	      "itemna": "购买子公司部分少数股权支付的现金净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620204",
	      "itemna": "购建固定资产、无形资产和其他长期\n资产所支付的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620205",
	      "itemna": "支付买入返售金融资产现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21620206",
	      "itemna": "支付的其他与投资活动有关的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2163",
	      "itemna": "筹资活动产生的现金流量净额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "216301",
	      "itemna": "筹资活动现金流入小计",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630101",
	      "itemna": "吸收投资收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2163010101",
	      "itemna": "子公司吸收少数股东权益性投资收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630102",
	      "itemna": "借款所收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630103",
	      "itemna": "认股权证行权收到的现金(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630104",
	      "itemna": "发行债券收到的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630105",
	      "itemna": "收到卖出回购金融资产款现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630106",
	      "itemna": "保险业务卖出回购业务资金净增加额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630107",
	      "itemna": "收到其他与筹资活动有关的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "216302",
	      "itemna": "筹资活动现金流出小计",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630201",
	      "itemna": "偿还债务支付的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630202",
	      "itemna": "支付卖出回购金融资产款现金净额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630203",
	      "itemna": "分配股利、利润或偿付利息支付的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2163020301",
	      "itemna": "其中：子公司支付给少数股东的股利",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630204",
	      "itemna": "保险业务拆入资金净减少额(金融)",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21630205",
	      "itemna": "支付其他与筹资活动有关的现金",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2164",
	      "itemna": "汇率变动对现金及现金等价物的影响",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2165",
	      "itemna": "现金及现金等价物净加:",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2166",
	      "itemna": "期初现金及现金等价物余额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "2167",
	      "itemna": "期末现金及现金等价物余额",
	      "itemup": "21_cash",
	      "level": 2
	  },
	  {
	      "itemcd": "21_profit",
	      "itemna": "利润表",
	      "itemup": "21",
	      "level": 1
	  },
	  {
	      "itemcd": "2151",
	      "itemna": "营业总收入",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215101",
	      "itemna": "营业收入",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215102",
	      "itemna": "利息净收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510201",
	      "itemna": "利息收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510202",
	      "itemna": "减：利息支出(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215103",
	      "itemna": "手续费及佣金净收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510301",
	      "itemna": "手续费及佣金收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510302",
	      "itemna": "减：手续费及佣金支出(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215104",
	      "itemna": "已赚保费(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510401",
	      "itemna": "保险业务收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "2151040101",
	      "itemna": "其中：分保费收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510402",
	      "itemna": "分出保费(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510403",
	      "itemna": "提取未到期责任准备金(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215105",
	      "itemna": "其他业务收入(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215106",
	      "itemna": "营业外收入",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215107",
	      "itemna": "投资收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21510701",
	      "itemna": "其中：对联营企业和合营\n企业的投资收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215108",
	      "itemna": "公允价值变动净收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215109",
	      "itemna": "汇兑净收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "2152",
	      "itemna": "营业总成本",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215201",
	      "itemna": "营业成本",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215202",
	      "itemna": "退保金(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215203",
	      "itemna": "赔付支出(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215204",
	      "itemna": "减：摊回赔付支出(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215205",
	      "itemna": "提取保险责任准备金(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215206",
	      "itemna": "减：摊回保险责任准备金(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215207",
	      "itemna": "保单红利支出(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215208",
	      "itemna": "分保费用(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215209",
	      "itemna": "保险业务手续费及佣金支出(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215210",
	      "itemna": "营业税金及附加",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215211",
	      "itemna": "业务及管理费(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215212",
	      "itemna": "减：摊回分保费用(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215213",
	      "itemna": "其他业务成本(金融)",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215214",
	      "itemna": "销售费用",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215215",
	      "itemna": "管理费用",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215216",
	      "itemna": "堪探费用",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215217",
	      "itemna": "财务费用",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215218",
	      "itemna": "资产减值损失",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215222",
	      "itemna": "减:营业外支出",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21522201",
	      "itemna": "其中:非流动资产处置净损失",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215223",
	      "itemna": "减:所得税",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215301",
	      "itemna": "营业利润",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215302",
	      "itemna": "利润总额",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215303",
	      "itemna": "净利润",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21530301",
	      "itemna": "其中：被合并方在合并前实现的净利润",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21530302",
	      "itemna": "少数股东损益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21530303",
	      "itemna": "归属于母公司股东的净利润",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215401",
	      "itemna": "基本每股收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215402",
	      "itemna": "稀释每股收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215501",
	      "itemna": "其他综合收益",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "215502",
	      "itemna": "综合收益总额",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21550201",
	      "itemna": "归属于母公司所有者的综合收益总额",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "21550202",
	      "itemna": "归属于少数股东的综合收益总额",
	      "itemup": "21_profit",
	      "level": 2
	  },
	  {
	      "itemcd": "22",
	      "itemna": "股东指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "22_GDHS",
	      "itemna": "股东户数",
	      "itemup": "22",
	      "level": 1
	  },
	  {
	      "itemcd": "22_GDHS_hldnm",
	      "itemna": "股东总数",
	      "itemup": "22_GDHS",
	      "level": 2
	  },
	  {
	      "itemcd": "22_hldna",
	      "itemna": "股东名称",
	      "itemup": "22",
	      "level": 1
	  },
	  {
	      "itemcd": "22_hldnm",
	      "itemna": "持股数量",
	      "itemup": "22",
	      "level": 1
	  },
	  {
	      "itemcd": "22_hldpr",
	      "itemna": "股份性质",
	      "itemup": "22",
	      "level": 1
	  },
	  {
	      "itemcd": "22_hldrt",
	      "itemna": "流通股东持股比例",
	      "itemup": "22",
	      "level": 1
	  },
	  {
	      "itemcd": "23",
	      "itemna": "股票基本信息",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "23_issudt",
	      "itemna": "发行/设立日期",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_listdt",
	      "itemna": "上市日期",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_mktcl",
	      "itemna": "交易市场",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_stken",
	      "itemna": "股票英文全称",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_stkna",
	      "itemna": "股票中文全称",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_stkse",
	      "itemna": "股票英文简称",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_stksn",
	      "itemna": "股票中文简称",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "23_stkst",
	      "itemna": "股票状态",
	      "itemup": "23",
	      "level": 1
	  },
	  {
	      "itemcd": "24",
	      "itemna": "公司基本资料",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "24_contad",
	      "itemna": "公司联系地址",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_corpen",
	      "itemna": "英文名称",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_corpna",
	      "itemna": "公司名称",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_corpse",
	      "itemna": "英文名称缩写",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_corpsn",
	      "itemna": "公司中文简称",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_currcd",
	      "itemna": "货币名称",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_email",
	      "itemna": "公司mail",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_emplnm",
	      "itemna": "职工总数",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_enddt",
	      "itemna": "结束日期",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_fax",
	      "itemna": "公司传真",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_hy_jrtz",
	      "itemna": "所属今日投资行业",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_hy_sw",
	      "itemna": "所属申万行业",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_hy_zjh",
	      "itemna": "所属证监会行业",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_intro",
	      "itemna": "公司简介",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_lawps",
	      "itemna": "法人代表",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_listdt",
	      "itemna": "首次上市日期",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_mainbs",
	      "itemna": "主要产品及业务",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_offiad",
	      "itemna": "办公地址",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_phone",
	      "itemna": "公司电话",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_primbs",
	      "itemna": "经营范围主营",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_regiad",
	      "itemna": "注册地址",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_regica",
	      "itemna": "注册资本",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_regino",
	      "itemna": "工商登记号",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_secobs",
	      "itemna": "经营范围兼营",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_secrps",
	      "itemna": "董事会秘书",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_setdt",
	      "itemna": "成立日期",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_taxno",
	      "itemna": "税务登记号码",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_web",
	      "itemna": "投资者关系网址",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_zip",
	      "itemna": "办公地址邮编",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "24_zone",
	      "itemna": "区号",
	      "itemup": "24",
	      "level": 1
	  },
	  {
	      "itemcd": "25",
	      "itemna": "交易指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "25_RZRQ",
	      "itemna": "融资融券",
	      "itemup": "25",
	      "level": 1
	  },
	  {
	      "itemcd": "25_RZRQ_rqmc",
	      "itemna": "融券卖出量",
	      "itemup": "25_RZRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RZRQ_rqye",
	      "itemna": "融券余额",
	      "itemup": "25_RZRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RZRQ_rqyl",
	      "itemna": "融券余量",
	      "itemup": "25_RZRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RZRQ_rzmr",
	      "itemna": "融资买入额",
	      "itemup": "25_RZRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RZRQ_rzrqye",
	      "itemna": "融资融券余额",
	      "itemup": "25_RZRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RZRQ_rzye",
	      "itemna": "融资余额",
	      "itemup": "25_RZRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ",
	      "itemna": "日行情",
	      "itemup": "25",
	      "level": 1
	  },
	  {
	      "itemcd": "25_RXQ_cprice",
	      "itemna": "收盘价",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ_hprice",
	      "itemna": "最高价",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ_lprice",
	      "itemna": "最低价",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ_oprice",
	      "itemna": "开盘价",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ_pprice",
	      "itemna": "昨收盘价",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ_turnover",
	      "itemna": "成交金额",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "25_RXQ_volume",
	      "itemna": "成交量",
	      "itemup": "25_RXQ",
	      "level": 2
	  },
	  {
	      "itemcd": "26",
	      "itemna": "净利润预告",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "26_content",
	      "itemna": "预测内容",
	      "itemup": "26",
	      "level": 1
	  },
	  {
	      "itemcd": "26_cpmax",
	      "itemna": "变动比率区间（大值）",
	      "itemup": "26",
	      "level": 1
	  },
	  {
	      "itemcd": "26_cpmin",
	      "itemna": "变动比率区间（小值）",
	      "itemup": "26",
	      "level": 1
	  },
	  {
	      "itemcd": "26_pimax",
	      "itemna": "预测值区间(大值)",
	      "itemup": "26",
	      "level": 1
	  },
	  {
	      "itemcd": "26_pimin",
	      "itemna": "预测值区间(小值)",
	      "itemup": "26",
	      "level": 1
	  },
	  {
	      "itemcd": "26_rsttp",
	      "itemna": "业绩预告类型",
	      "itemup": "26",
	      "level": 1
	  },
	  {
	      "itemcd": "27",
	      "itemna": "配股",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "27_currcd",
	      "itemna": "货币代码",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_CXS",
	      "itemna": "承销商",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_CXS_Agencynm",
	      "itemna": "主承销商名称",
	      "itemup": "27_CXS",
	      "level": 2
	  },
	  {
	      "itemcd": "27_Plantp",
	      "itemna": "方案进度",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_ratibs",
	      "itemna": "配股基数",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_ratifee",
	      "itemna": "配股发行费用",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_ratirt",
	      "itemna": "每10股配股数",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_rmbprc",
	      "itemna": "配股价格(人民币)",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_varcl",
	      "itemna": "证券品种代码",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_fundam",
	      "itemna": "募集资金总额",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_fundnet",
	      "itemna": "募集资金净额",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_othprc",
	      "itemna": "配股价格(外币)",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_PGJG",
	      "itemna": "配股结果",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_PGJG_convnm",
	      "itemna": "转配股实配数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_emplnm",
	      "itemna": "职工股实配数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_hldrnm",
	      "itemna": "大股东认购数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_leganm",
	      "itemna": "法人股实配数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_mangnm",
	      "itemna": "向董事、监事及高级管理人员配售",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_natinm",
	      "itemna": "国家股(发起股)实配数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_othrnm",
	      "itemna": "其他股份实配数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_publnm",
	      "itemna": "公众股实配数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_ratinm",
	      "itemna": "实际配售总数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_salebl",
	      "itemna": "承销余额",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGJG_salenm",
	      "itemna": "承销团包销数量",
	      "itemup": "27_PGJG",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ",
	      "itemna": "配股相应日期",
	      "itemup": "27",
	      "level": 1
	  },
	  {
	      "itemcd": "27_PGXYRQ_convdt",
	      "itemna": "转配股上市日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_exrdt",
	      "itemna": "除权基准日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_Issudt0",
	      "itemna": "配股结果公告日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_Issudt1",
	      "itemna": "预案公告日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_Issudt2",
	      "itemna": "股东大会决议案公告日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_Issudt3",
	      "itemna": "配股公告日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_ratidt",
	      "itemna": "获配股上市日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "27_PGXYRQ_regdt",
	      "itemna": "股权登记日",
	      "itemup": "27_PGXYRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28",
	      "itemna": "首发指标",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "28_currcd",
	      "itemna": "币种",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_FXFSYCXS",
	      "itemna": "发行方式与承销商",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_FXFSYCXS_agencynm",
	      "itemna": "主承销商名称",
	      "itemup": "28_FXFSYCXS",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXFSYCXS_issufg",
	      "itemna": "发行方式",
	      "itemup": "28_FXFSYCXS",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXFSYCXS_udwrfg",
	      "itemna": "承销方式",
	      "itemup": "28_FXFSYCXS",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXXGCWSJ",
	      "itemna": "发行相关财务数据",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_FXXGCWSJ_dilupe",
	      "itemna": "每股摊薄市盈率",
	      "itemup": "28_FXXGCWSJ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXXGCWSJ_forprofit",
	      "itemna": "发行当年净利润预测",
	      "itemup": "28_FXXGCWSJ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXXGCWSJ_netprofit",
	      "itemna": "发行当年净利润",
	      "itemup": "28_FXXGCWSJ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXXGCWSJ_weigpe",
	      "itemna": "每股加权市盈率",
	      "itemup": "28_FXXGCWSJ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_iprice",
	      "itemna": "发行价格",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_issufe",
	      "itemna": "发行费用",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_issuvl",
	      "itemna": "发行股数",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_parval",
	      "itemna": "面值",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_raisfd",
	      "itemna": "募集资金",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_raisnt",
	      "itemna": "实际募集资金净额",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_SGPSMX",
	      "itemna": "申购配售明细",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_SGPSMX_fusanm",
	      "itemna": "基金配售数量",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_onaphs",
	      "itemna": "上网发行有效申购户数",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_onapnm",
	      "itemna": "上网发行有效申购数量",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_onsanm",
	      "itemna": "上网配售发行数量",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_othrnm",
	      "itemna": "其他发行数量",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_twaphs",
	      "itemna": "二级市场有效申购户数",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_twapnm",
	      "itemna": "二级市场有效申购股数",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SGPSMX_twsanm",
	      "itemna": "二级市场配售发行量",
	      "itemup": "28_SGPSMX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ",
	      "itemna": "相关日期",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_XGRQ_edbudt",
	      "itemna": "发行结果公告日",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_emltdt",
	      "itemna": "职工股上市日",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_inltdt",
	      "itemna": "战略投资者获配股份上市日期",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_isbudt",
	      "itemna": "发行公告日",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_listdt",
	      "itemna": "上市日期",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_onapdt",
	      "itemna": "上网发行日期",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_rabudt",
	      "itemna": "招股公告日",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_raltdt",
	      "itemna": "获配股上市日",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_XGRQ_twapdt",
	      "itemna": "二级市场申购起始日",
	      "itemup": "28_XGRQ",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SSSRBX",
	      "itemna": "上市首日表现",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_SSSRBX_cprice",
	      "itemna": "上市首日收市价",
	      "itemup": "28_SSSRBX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SSSRBX_oprice",
	      "itemna": "上市首日开盘价",
	      "itemup": "28_SSSRBX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_SSSRBX_tor",
	      "itemna": "上市首日换手率",
	      "itemup": "28_SSSRBX",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXQT",
	      "itemna": "发行其他",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_FXQT_ipricemax",
	      "itemna": "拟发行价格上限",
	      "itemup": "28_FXQT",
	      "level": 2
	  },
	  {
	      "itemcd": "28_FXQT_ipricemin",
	      "itemna": "拟发行价格下限",
	      "itemup": "28_FXQT",
	      "level": 2
	  },
	  {
	      "itemcd": "28_ZQL",
	      "itemna": "中签率",
	      "itemup": "28",
	      "level": 1
	  },
	  {
	      "itemcd": "28_ZQL_onlnrt",
	      "itemna": "上网发行中签率",
	      "itemup": "28_ZQL",
	      "level": 2
	  },
	  {
	      "itemcd": "28_ZQL_twsart",
	      "itemna": "二级配售中签率",
	      "itemup": "28_ZQL",
	      "level": 2
	  },
	  {
	      "itemcd": "29",
	      "itemna": "财务衍生",
	      "itemup": "basicnorm",
	      "level": 0
	  },
	  {
	      "itemcd": "f81",
	      "itemna": "基本类",
	      "itemup": "29",
	      "level": 1
	  },
	  {
	      "itemcd": "21d810101",
	      "itemna": "经常性业务产生的净利润",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810102",
	      "itemna": "非经常性业务产生的净利润",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810103",
	      "itemna": "主营收入现金含量",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810104",
	      "itemna": "净利润现金含量",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810105",
	      "itemna": "EBIT",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810106",
	      "itemna": "EBITD",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810107",
	      "itemna": "EBITDA",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810108",
	      "itemna": "自由现金流量",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810109",
	      "itemna": "分红",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810110",
	      "itemna": "现金及现金等价物净增加额",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810111",
	      "itemna": "折旧摊销",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "21d810112",
	      "itemna": "毛利润",
	      "itemup": "f81",
	      "level": 2
	  },
	  {
	      "itemcd": "f82",
	      "itemna": "每股类",
	      "itemup": "29",
	      "level": 1
	  },
	  {
	      "itemcd": "21d820101",
	      "itemna": "每股权益(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820102",
	      "itemna": "每股盈利(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820103",
	      "itemna": "每股业务收入(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820104",
	      "itemna": "每股EBITDA(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820105",
	      "itemna": "经常性业务每股净利润(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820106",
	      "itemna": "每股经营性活动现金净流量(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820107",
	      "itemna": "每股未分配利润(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820108",
	      "itemna": "每股负债(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820109",
	      "itemna": "每股公积金(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820110",
	      "itemna": "每股净现金流量(最新股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820111",
	      "itemna": "每股分红",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820201",
	      "itemna": "每股权益(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820202",
	      "itemna": "每股盈利(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820203",
	      "itemna": "每股业务收入(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820204",
	      "itemna": "每股EBITDA(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820205",
	      "itemna": "经常性业务每股净利润(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820206",
	      "itemna": "每股经营性活动现金净流量(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820207",
	      "itemna": "每股未分配利润(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820208",
	      "itemna": "每股负债(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820209",
	      "itemna": "每股公积金(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "21d820210",
	      "itemna": "每股净现金流量(期末股本摊薄)",
	      "itemup": "f82",
	      "level": 2
	  },
	  {
	      "itemcd": "f83",
	      "itemna": "比率类",
	      "itemup": "29",
	      "level": 1
	  },
	  {
	      "itemcd": "21d830101",
	      "itemna": "毛利率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830102",
	      "itemna": "税前利润率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830103",
	      "itemna": "销售净利润率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830104",
	      "itemna": "主营业务利润率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830105",
	      "itemna": "息税折旧前利润率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830106",
	      "itemna": "息税折旧摊销前利润率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830107",
	      "itemna": "资产报酬率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830108",
	      "itemna": "净资产报酬率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830109",
	      "itemna": "投资回报率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830110",
	      "itemna": "扣除非经营性损益后净资产收益率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830111",
	      "itemna": "经营现金净流量与净利润的比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830112",
	      "itemna": "销售现金比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830113",
	      "itemna": "实际所得税率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830114",
	      "itemna": "非经常性损益率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830115",
	      "itemna": "营业费用比例",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830116",
	      "itemna": "管理费用比例",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830117",
	      "itemna": "财务费用比例",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830118",
	      "itemna": "财务杠杆度",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830119",
	      "itemna": "股息支付率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830201",
	      "itemna": "流动比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830202",
	      "itemna": "速动比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830203",
	      "itemna": "产权比率（负债权益比）",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830204",
	      "itemna": "长期负债权益比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830205",
	      "itemna": "资产负债率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830206",
	      "itemna": "有形资产负债率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830207",
	      "itemna": "长期负债比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830208",
	      "itemna": "现金流动负债比",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830209",
	      "itemna": "经营现金净流量对负债的比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830210",
	      "itemna": "经营性现金与流动负债比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830211",
	      "itemna": "利息保障倍数",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830212",
	      "itemna": "长期债务与营运资金比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830213",
	      "itemna": "短期负债现金保障率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830214",
	      "itemna": "资产权益比",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830215",
	      "itemna": "利息支出/盈利",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830301",
	      "itemna": "全部资产现金回收率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830302",
	      "itemna": "留存收益对账面价值的比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830303",
	      "itemna": "现金与流动资产比率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830401",
	      "itemna": "总资产周转率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830402",
	      "itemna": "流动资产周转率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830403",
	      "itemna": "应收账款周转率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "21d830404",
	      "itemna": "存货周转率",
	      "itemup": "f83",
	      "level": 2
	  },
	  {
	      "itemcd": "f84",
	      "itemna": "增长类",
	      "itemup": "29",
	      "level": 1
	  },
	  {
	      "itemcd": "21d840101",
	      "itemna": "营业总收入平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840102",
	      "itemna": "业务利润平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840103",
	      "itemna": "净利润平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840104",
	      "itemna": "毛利率平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840105",
	      "itemna": "资产报酬率平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840106",
	      "itemna": "权益报酬率平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840107",
	      "itemna": "资产负债率平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840108",
	      "itemna": "每股收益平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840109",
	      "itemna": "分红平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840110",
	      "itemna": "净资产平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840111",
	      "itemna": "总资产平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "21d840112",
	      "itemna": "自由现金流平均增长",
	      "itemup": "f84",
	      "level": 2
	  },
	  {
	      "itemcd": "f85",
	      "itemna": "平均类",
	      "itemup": "29",
	      "level": 1
	  },
	  {
	      "itemcd": "21d850101",
	      "itemna": "营业总收入平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850102",
	      "itemna": "业务利润平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850103",
	      "itemna": "毛利率平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850104",
	      "itemna": "税前利润率平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850105",
	      "itemna": "净利润率平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850106",
	      "itemna": "净资产报酬率平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850107",
	      "itemna": "资产报酬率平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850108",
	      "itemna": "每股收益平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850109",
	      "itemna": "分红平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850110",
	      "itemna": "息税折旧摊销前利润率平均",
	      "itemup": "f85",
	      "level": 2
	  },
	  {
	      "itemcd": "21d850111",
	      "itemna": "投资回报率平均",
	      "itemup": "f85",
	      "level": 2
	  }
	];
	
	
	dsFinance.dataList(_datalist);
})();