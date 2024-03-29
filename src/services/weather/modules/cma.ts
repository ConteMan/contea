import { defHttp } from '@utils/http/axios'
import { MODULES } from '@enums/index'
import RequestCache from '@services/base/requestCache'
import { ConfigModel } from '@models/index'

const stationDataExample = {
  location: {
    id: '59493',
    name: '深圳',
    path: '中国, 广东, 深圳',
    longitude: 114.0,
    latitude: 22.53,
    timezone: 8,
  },
  daily: [
    {
      date: '2099/10/19',
      high: 26.0,
      dayText: '多云',
      dayCode: 1,
      dayWindDirection: '无持续风向',
      dayWindScale: '微风',
      low: 20.0,
      nightText: '多云',
      nightCode: 1,
      nightWindDirection: '无持续风向',
      nightWindScale: '微风',
    },
  ],
  now: {
    precipitation: 0.0,
    temperature: 23.6,
    pressure: 1008.0,
    humidity: 46.0,
    windDirection: '东北风',
    windDirectionDegree: 43.0,
    windSpeed: 3.0,
    windScale: '微风',
  },
  alarm: [],
  lastUpdate: '2099/10/19 17:05',
}

export type StationType = typeof stationDataExample

export interface StationCacheType {
  data: StationType
  ca_expired_at?: number
  cache_sign?: 'set' | 'get'
}

/**
 * 城市气象站信息
 */
const stations = [
  {
    code: 57614,
    name: '习水',
  },
  {
    code: 56856,
    name: '景东',
  },
  {
    code: 54523,
    name: '武清',
  },
  {
    code: 53908,
    name: '通渭',
  },
  {
    code: 59097,
    name: '新丰',
  },
  {
    code: 57183,
    name: '临颍县',
  },
  {
    code: 59116,
    name: '大埔',
  },
  {
    code: 53788,
    name: '和顺',
  },
  {
    code: 54424,
    name: '平谷',
  },
  {
    code: 56272,
    name: '郫县',
  },
  {
    code: 55599,
    name: '桑日',
  },
  {
    code: 57978,
    name: '临武',
  },
  {
    code: 59266,
    name: '苍梧',
  },
  {
    code: 56992,
    name: '西畴',
  },
  {
    code: 51232,
    name: '阿拉山口',
  },
  {
    code: 58616,
    name: '余江',
  },
  {
    code: 57779,
    name: '攸县',
  },
  {
    code: 58477,
    name: '定海',
  },
  {
    code: 59485,
    name: '中山',
  },
  {
    code: 57089,
    name: '许昌',
  },
  {
    code: 53925,
    name: '镇原',
  },
  {
    code: 54916,
    name: '兖州',
  },
  {
    code: 54024,
    name: '浩尔吐',
  },
  {
    code: 50956,
    name: '呼兰',
  },
  {
    code: 53988,
    name: '获嘉县',
  },
  {
    code: 53562,
    name: '清水河',
  },
  {
    code: 54871,
    name: '石岛',
  },
  {
    code: 54425,
    name: '兴隆',
  },
  {
    code: 58606,
    name: '南昌',
  },
  {
    code: 54214,
    name: '岗子',
  },
  {
    code: 54708,
    name: '枣强',
  },
  {
    code: 57061,
    name: '平陆',
  },
  {
    code: 50832,
    name: '胡尔勒',
  },
  {
    code: 51730,
    name: '阿拉尔',
  },
  {
    code: 58323,
    name: '肥东',
  },
  {
    code: 59237,
    name: '武鸣',
  },
  {
    code: 59287,
    name: '广州',
  },
  {
    code: 59284,
    name: '花都',
  },
  {
    code: 58141,
    name: '淮安',
  },
  {
    code: 53276,
    name: '朱日和',
  },
  {
    code: 56386,
    name: '乐山',
  },
  {
    code: 56389,
    name: '犍为',
  },
  {
    code: 59554,
    name: '高雄',
  },
  {
    code: 53764,
    name: '吕梁',
  },
  {
    code: 59658,
    name: '湛江',
  },
  {
    code: 52884,
    name: '皋兰',
  },
  {
    code: 56854,
    name: '云县',
  },
  {
    code: 58981,
    name: '钓鱼岛',
  },
  {
    code: 57507,
    name: '隆昌',
  },
  {
    code: 54831,
    name: '青州',
  },
  {
    code: 57720,
    name: '绥阳',
  },
  {
    code: 59046,
    name: '柳州',
  },
  {
    code: 56192,
    name: '文县',
  },
  {
    code: 53873,
    name: '长子',
  },
  {
    code: 58502,
    name: '九江',
  },
  {
    code: 53794,
    name: '隆尧',
  },
  {
    code: 52957,
    name: '同德',
  },
  {
    code: 56964,
    name: '思茅',
  },
  {
    code: 51717,
    name: '岳普湖',
  },
  {
    code: 53617,
    name: '青铜峡',
  },
  {
    code: 58356,
    name: '昆山',
  },
  {
    code: 56567,
    name: '宁蒗',
  },
  {
    code: 53868,
    name: '临汾',
  },
  {
    code: 57646,
    name: '古丈',
  },
  {
    code: 56869,
    name: '新平',
  },
  {
    code: 54920,
    name: '泗水',
  },
  {
    code: 56649,
    name: '洱源',
  },
  {
    code: 57413,
    name: '渠县',
  },
  {
    code: 57099,
    name: '太康县',
  },
  {
    code: 58333,
    name: '江宁',
  },
  {
    code: 57273,
    name: '唐河',
  },
  {
    code: 51828,
    name: '和田',
  },
  {
    code: 54069,
    name: '九台',
  },
  {
    code: 50755,
    name: '拜泉',
  },
  {
    code: 54122,
    name: '阿鲁科尔沁旗',
  },
  {
    code: 56898,
    name: '峨山',
  },
  {
    code: 53963,
    name: '侯马',
  },
  {
    code: 59989,
    name: '黄岩岛',
  },
  {
    code: 58359,
    name: '吴江',
  },
  {
    code: 54204,
    name: '正镶白旗',
  },
  {
    code: 54912,
    name: '汶上',
  },
  {
    code: 54249,
    name: '铁岭',
  },
  {
    code: 54115,
    name: '林西',
  },
  {
    code: 50787,
    name: '绥滨',
  },
  {
    code: 59562,
    name: '台东',
  },
  {
    code: 54608,
    name: '深州',
  },
  {
    code: 53968,
    name: '垣曲',
  },
  {
    code: 56317,
    name: '米林',
  },
  {
    code: 58529,
    name: '婺源',
  },
  {
    code: 52607,
    name: '乌斯太',
  },
  {
    code: 53753,
    name: '柳林',
  },
  {
    code: 50858,
    name: '肇东',
  },
  {
    code: 57512,
    name: '合川',
  },
  {
    code: 53789,
    name: '栾城',
  },
  {
    code: 57027,
    name: '眉县',
  },
  {
    code: 56880,
    name: '宜良',
  },
  {
    code: 58828,
    name: '三明',
  },
  {
    code: 59462,
    name: '罗定',
  },
  {
    code: 58932,
    name: '永泰',
  },
  {
    code: 54855,
    name: '即墨',
  },
  {
    code: 54284,
    name: '东岗',
  },
  {
    code: 51568,
    name: '和硕',
  },
  {
    code: 58128,
    name: '固镇',
  },
  {
    code: 54716,
    name: '宁津',
  },
  {
    code: 56641,
    name: '福贡',
  },
  {
    code: 51367,
    name: '呼图壁',
  },
  {
    code: 54800,
    name: '威县',
  },
  {
    code: 53899,
    name: '广平',
  },
  {
    code: 58249,
    name: '泰兴',
  },
  {
    code: 56492,
    name: '宜宾',
  },
  {
    code: 54117,
    name: '克什克腾旗',
  },
  {
    code: 56836,
    name: '盈江',
  },
  {
    code: 58314,
    name: '霍山',
  },
  {
    code: 57995,
    name: '信丰',
  },
  {
    code: 56116,
    name: '丁青',
  },
  {
    code: 53974,
    name: '淇县',
  },
  {
    code: 53352,
    name: '达尔罕茂明安联合旗',
  },
  {
    code: 59478,
    name: '台山',
  },
  {
    code: 56598,
    name: '赫章',
  },
  {
    code: 58534,
    name: '休宁',
  },
  {
    code: 59025,
    name: '东兰',
  },
  {
    code: 58431,
    name: '南陵',
  },
  {
    code: 57502,
    name: '大足',
  },
  {
    code: 57543,
    name: '鹤峰',
  },
  {
    code: 58558,
    name: '东阳',
  },
  {
    code: 57595,
    name: '通山',
  },
  {
    code: 54776,
    name: '成山头',
  },
  {
    code: 53944,
    name: '黄陵',
  },
  {
    code: 57598,
    name: '修水',
  },
  {
    code: 54605,
    name: '安新',
  },
  {
    code: 51747,
    name: '塔中',
  },
  {
    code: 56381,
    name: '丹棱',
  },
  {
    code: 54724,
    name: '商河',
  },
  {
    code: 59289,
    name: '东莞',
  },
  {
    code: 58664,
    name: '温岭',
  },
  {
    code: 53498,
    name: '宣化',
  },
  {
    code: 57903,
    name: '关岭',
  },
  {
    code: 57242,
    name: '旬阳',
  },
  {
    code: 58417,
    name: '宿松',
  },
  {
    code: 58734,
    name: '建阳',
  },
  {
    code: 58615,
    name: '万年',
  },
  {
    code: 50603,
    name: '新巴尔虎右旗',
  },
  {
    code: 57126,
    name: '洋县',
  },
  {
    code: 56948,
    name: '西盟',
  },
  {
    code: 50833,
    name: '扎赉特旗',
  },
  {
    code: 54833,
    name: '桓台',
  },
  {
    code: 54345,
    name: '辽阳县',
  },
  {
    code: 58148,
    name: '宝应',
  },
  {
    code: 59470,
    name: '新兴',
  },
  {
    code: 59031,
    name: '环江',
  },
  {
    code: 58619,
    name: '抚州',
  },
  {
    code: 57032,
    name: '周至',
  },
  {
    code: 56473,
    name: '甘洛',
  },
  {
    code: 57407,
    name: '乐至',
  },
  {
    code: 54539,
    name: '乐亭',
  },
  {
    code: 57389,
    name: '云梦',
  },
  {
    code: 53669,
    name: '娄烦',
  },
  {
    code: 57575,
    name: '华容',
  },
  {
    code: 57041,
    name: '三原',
  },
  {
    code: 55568,
    name: '昂仁',
  },
  {
    code: 54611,
    name: '满城',
  },
  {
    code: 53798,
    name: '邢台',
  },
  {
    code: 57248,
    name: '平利',
  },
  {
    code: 55587,
    name: '仁布',
  },
  {
    code: 53522,
    name: '伊克乌素',
  },
  {
    code: 53926,
    name: '泾川',
  },
  {
    code: 58113,
    name: '濉溪',
  },
  {
    code: 53149,
    name: '满都拉',
  },
  {
    code: 57910,
    name: '紫云',
  },
  {
    code: 57127,
    name: '汉中',
  },
  {
    code: 55572,
    name: '南木林',
  },
  {
    code: 58623,
    name: '上饶县',
  },
  {
    code: 53860,
    name: '交口',
  },
  {
    code: 51433,
    name: '尼勒克',
  },
  {
    code: 54339,
    name: '鞍山',
  },
  {
    code: 59452,
    name: '容县',
  },
  {
    code: 54660,
    name: '旅顺',
  },
  {
    code: 53658,
    name: '佳县',
  },
  {
    code: 53618,
    name: '永宁',
  },
  {
    code: 54514,
    name: '丰台',
  },
  {
    code: 50741,
    name: '甘南',
  },
  {
    code: 58730,
    name: '武夷山',
  },
  {
    code: 57237,
    name: '万源',
  },
  {
    code: 59238,
    name: '宾阳',
  },
  {
    code: 57763,
    name: '娄底',
  },
  {
    code: 57290,
    name: '驻马店市',
  },
  {
    code: 56756,
    name: '祥云',
  },
  {
    code: 54305,
    name: '太仆寺旗',
  },
  {
    code: 50756,
    name: '海伦',
  },
  {
    code: 54861,
    name: '乳山',
  },
  {
    code: 58017,
    name: '夏邑',
  },
  {
    code: 56949,
    name: '孟连',
  },
  {
    code: 53735,
    name: '靖边',
  },
  {
    code: 51567,
    name: '焉耆',
  },
  {
    code: 57338,
    name: '开县',
  },
  {
    code: 57026,
    name: '扶风',
  },
  {
    code: 59058,
    name: '蒙山',
  },
  {
    code: 56198,
    name: '德阳',
  },
  {
    code: 50632,
    name: '博克图',
  },
  {
    code: 56081,
    name: '临潭',
  },
  {
    code: 54596,
    name: '房山',
  },
  {
    code: 54528,
    name: '北辰',
  },
  {
    code: 53957,
    name: '河津',
  },
  {
    code: 57044,
    name: '临潼',
  },
  {
    code: 58003,
    name: '成武',
  },
  {
    code: 54541,
    name: '抚宁',
  },
  {
    code: 51330,
    name: '温泉',
  },
  {
    code: 54907,
    name: '鱼台',
  },
  {
    code: 59655,
    name: '化州',
  },
  {
    code: 56185,
    name: '黑水',
  },
  {
    code: 56287,
    name: '雅安',
  },
  {
    code: 54218,
    name: '赤峰',
  },
  {
    code: 57438,
    name: '石柱',
  },
  {
    code: 59650,
    name: '遂溪',
  },
  {
    code: 54823,
    name: '济南',
  },
  {
    code: 51145,
    name: '额敏',
  },
  {
    code: 58102,
    name: '亳州',
  },
  {
    code: 53446,
    name: '包头',
  },
  {
    code: 53931,
    name: '富县',
  },
  {
    code: 53894,
    name: '峰峰',
  },
  {
    code: 53695,
    name: '新乐',
  },
  {
    code: 57493,
    name: '江夏',
  },
  {
    code: 58903,
    name: '瑞金',
  },
  {
    code: 59061,
    name: '富川',
  },
  {
    code: 58038,
    name: '沭阳',
  },
  {
    code: 54181,
    name: '蛟河',
  },
  {
    code: 53738,
    name: '吴旗',
  },
  {
    code: 53929,
    name: '长武',
  },
  {
    code: 56291,
    name: '广汉',
  },
  {
    code: 55472,
    name: '申扎',
  },
  {
    code: 51656,
    name: '库尔勒',
  },
  {
    code: 51186,
    name: '青河',
  },
  {
    code: 57328,
    name: '达州',
  },
  {
    code: 54292,
    name: '延吉',
  },
  {
    code: 52681,
    name: '民勤',
  },
  {
    code: 57522,
    name: '涪陵',
  },
  {
    code: 56876,
    name: '江川',
  },
  {
    code: 53989,
    name: '原阳县',
  },
  {
    code: 54291,
    name: '珲春',
  },
  {
    code: 59312,
    name: '潮州',
  },
  {
    code: 56491,
    name: '宜宾县',
  },
  {
    code: 54041,
    name: '通榆',
  },
  {
    code: 57193,
    name: '西华县',
  },
  {
    code: 58514,
    name: '星子',
  },
  {
    code: 58140,
    name: '涟水',
  },
  {
    code: 57129,
    name: '西乡',
  },
  {
    code: 59015,
    name: '凌云',
  },
  {
    code: 57985,
    name: '汝城',
  },
  {
    code: 52436,
    name: '玉门',
  },
  {
    code: 54076,
    name: '舒兰',
  },
  {
    code: 57891,
    name: '永新',
  },
  {
    code: 55680,
    name: '江孜',
  },
  {
    code: 54900,
    name: '濮阳',
  },
  {
    code: 59130,
    name: '同安',
  },
  {
    code: 50645,
    name: '莫力达瓦旗',
  },
  {
    code: 58129,
    name: '五河',
  },
  {
    code: 54471,
    name: '营口',
  },
  {
    code: 53750,
    name: '米脂',
  },
  {
    code: 45011,
    name: '澳门',
  },
  {
    code: 57941,
    name: '三江',
  },
  {
    code: 59319,
    name: '澄海',
  },
  {
    code: 54759,
    name: '栖霞',
  },
  {
    code: 57735,
    name: '岑巩',
  },
  {
    code: 56786,
    name: '曲靖',
  },
  {
    code: 59113,
    name: '永定',
  },
  {
    code: 58006,
    name: '虞城',
  },
  {
    code: 54494,
    name: '凤城',
  },
  {
    code: 58560,
    name: '磐安',
  },
  {
    code: 57540,
    name: '咸丰',
  },
  {
    code: 54914,
    name: '巨野',
  },
  {
    code: 53787,
    name: '榆社',
  },
  {
    code: 53996,
    name: '成安',
  },
  {
    code: 56193,
    name: '平武',
  },
  {
    code: 57179,
    name: '方城',
  },
  {
    code: 52862,
    name: '大通',
  },
  {
    code: 53399,
    name: '张北',
  },
  {
    code: 54814,
    name: '茌平',
  },
  {
    code: 56080,
    name: '合作',
  },
  {
    code: 54810,
    name: '高唐',
  },
  {
    code: 57800,
    name: '纳雍',
  },
  {
    code: 54348,
    name: '灯塔',
  },
  {
    code: 54722,
    name: '无棣',
  },
  {
    code: 58221,
    name: '蚌埠',
  },
  {
    code: 58567,
    name: '宁海',
  },
  {
    code: 53518,
    name: '大武口',
  },
  {
    code: 57612,
    name: '綦江',
  },
  {
    code: 55664,
    name: '定日',
  },
  {
    code: 54853,
    name: '崂山',
  },
  {
    code: 54301,
    name: '沽源',
  },
  {
    code: 50940,
    name: '镇赉',
  },
  {
    code: 58928,
    name: '华安',
  },
  {
    code: 51644,
    name: '库车',
  },
  {
    code: 59246,
    name: '武宣',
  },
  {
    code: 51346,
    name: '乌苏',
  },
  {
    code: 58826,
    name: '沙县',
  },
  {
    code: 58208,
    name: '固始',
  },
  {
    code: 56961,
    name: '宁洱',
  },
  {
    code: 50862,
    name: '铁力',
  },
  {
    code: 59419,
    name: '凭祥',
  },
  {
    code: 58542,
    name: '桐庐',
  },
  {
    code: 57955,
    name: '兴安',
  },
  {
    code: 59090,
    name: '始兴',
  },
  {
    code: 57001,
    name: '甘谷',
  },
  {
    code: 57298,
    name: '罗山',
  },
  {
    code: 54308,
    name: '丰宁',
  },
  {
    code: 58444,
    name: '余杭',
  },
  {
    code: 55325,
    name: '札达',
  },
  {
    code: 53975,
    name: '阳城',
  },
  {
    code: 57445,
    name: '建始',
  },
  {
    code: 58214,
    name: '霍邱',
  },
  {
    code: 52656,
    name: '民乐',
  },
  {
    code: 56673,
    name: '巧家',
  },
  {
    code: 59979,
    name: '中沙',
  },
  {
    code: 52985,
    name: '和政',
  },
  {
    code: 54113,
    name: '巴林右旗',
  },
  {
    code: 54261,
    name: '东丰',
  },
  {
    code: 58269,
    name: '启东',
  },
  {
    code: 58906,
    name: '会昌',
  },
  {
    code: 52889,
    name: '兰州',
  },
  {
    code: 57671,
    name: '沅江',
  },
  {
    code: 51241,
    name: '托里',
  },
  {
    code: 54909,
    name: '定陶',
  },
  {
    code: 57047,
    name: '蓝田',
  },
  {
    code: 57023,
    name: '彬县',
  },
  {
    code: 57075,
    name: '汝州',
  },
  {
    code: 58424,
    name: '安庆',
  },
  {
    code: 56691,
    name: '威宁',
  },
  {
    code: 54333,
    name: '新民',
  },
  {
    code: 57054,
    name: '潼关',
  },
  {
    code: 56233,
    name: '贡觉',
  },
  {
    code: 54704,
    name: '冀州',
  },
  {
    code: 57976,
    name: '宜章',
  },
  {
    code: 58965,
    name: '桃园',
  },
  {
    code: 57021,
    name: '千阳',
  },
  {
    code: 54420,
    name: '滦平',
  },
  {
    code: 53795,
    name: '赞皇',
  },
  {
    code: 59012,
    name: '乐业',
  },
  {
    code: 56584,
    name: '金阳',
  },
  {
    code: 54039,
    name: '舍伯吐',
  },
  {
    code: 59449,
    name: '博白',
  },
  {
    code: 58505,
    name: '九江县',
  },
  {
    code: 52981,
    name: '东乡',
  },
  {
    code: 54662,
    name: '大连',
  },
  {
    code: 57204,
    name: '青川',
  },
  {
    code: 53419,
    name: '磴口',
  },
  {
    code: 54764,
    name: '福山',
  },
  {
    code: 50656,
    name: '北安',
  },
  {
    code: 51365,
    name: '蔡家湖',
  },
  {
    code: 53614,
    name: '银川',
  },
  {
    code: 54187,
    name: '安图',
  },
  {
    code: 57736,
    name: '江口',
  },
  {
    code: 50514,
    name: '满洲里',
  },
  {
    code: 53420,
    name: '杭锦后旗',
  },
  {
    code: 54499,
    name: '昌平',
  },
  {
    code: 57900,
    name: '晴隆',
  },
  {
    code: 53582,
    name: '浑源',
  },
  {
    code: 50892,
    name: '饶河',
  },
  {
    code: 53611,
    name: '平罗',
  },
  {
    code: 54047,
    name: '科尔沁左翼中旗',
  },
  {
    code: 58601,
    name: '奉新',
  },
  {
    code: 53879,
    name: '屯留',
  },
  {
    code: 58737,
    name: '建瓯',
  },
  {
    code: 59205,
    name: '富宁',
  },
  {
    code: 50854,
    name: '安达',
  },
  {
    code: 51437,
    name: '昭苏',
  },
  {
    code: 54705,
    name: '南宫',
  },
  {
    code: 59213,
    name: '田阳',
  },
  {
    code: 56097,
    name: '九寨沟',
  },
  {
    code: 54728,
    name: '庆云',
  },
  {
    code: 53938,
    name: '旬邑',
  },
  {
    code: 52765,
    name: '门源',
  },
  {
    code: 53759,
    name: '石楼',
  },
  {
    code: 55554,
    name: '萨嘎',
  },
  {
    code: 54568,
    name: '金州',
  },
  {
    code: 58452,
    name: '嘉兴',
  },
  {
    code: 54624,
    name: '黄骅',
  },
  {
    code: 59476,
    name: '新会',
  },
  {
    code: 57582,
    name: '赤壁',
  },
  {
    code: 51133,
    name: '塔城',
  },
  {
    code: 59007,
    name: '广南',
  },
  {
    code: 57673,
    name: '湘阴',
  },
  {
    code: 56319,
    name: '墨脱',
  },
  {
    code: 53862,
    name: '灵石',
  },
  {
    code: 57296,
    name: '息县',
  },
  {
    code: 51720,
    name: '柯坪',
  },
  {
    code: 54606,
    name: '饶阳',
  },
  {
    code: 54832,
    name: '寿光',
  },
  {
    code: 56755,
    name: '弥渡',
  },
  {
    code: 59117,
    name: '梅县',
  },
  {
    code: 53732,
    name: '河南',
  },
  {
    code: 58912,
    name: '连城',
  },
  {
    code: 56995,
    name: '马关',
  },
  {
    code: 57110,
    name: '徽县',
  },
  {
    code: 59082,
    name: '韶关',
  },
  {
    code: 59362,
    name: '花莲',
  },
  {
    code: 53588,
    name: '五台山',
  },
  {
    code: 53486,
    name: '阳高',
  },
  {
    code: 59842,
    name: '临高',
  },
  {
    code: 54828,
    name: '莱芜',
  },
  {
    code: 57859,
    name: '资源',
  },
  {
    code: 59940,
    name: '乐东',
  },
  {
    code: 54065,
    name: '德惠',
  },
  {
    code: 51357,
    name: '沙湾',
  },
  {
    code: 58561,
    name: '镇海',
  },
  {
    code: 57093,
    name: '兰考',
  },
  {
    code: 59635,
    name: '防城港',
  },
  {
    code: 57832,
    name: '三穗',
  },
  {
    code: 57907,
    name: '兴义',
  },
  {
    code: 58150,
    name: '射阳',
  },
  {
    code: 54601,
    name: '徐水',
  },
  {
    code: 57176,
    name: '南召',
  },
  {
    code: 56788,
    name: '陆良',
  },
  {
    code: 59632,
    name: '钦州',
  },
  {
    code: 52863,
    name: '互助',
  },
  {
    code: 57805,
    name: '织金',
  },
  {
    code: 54803,
    name: '夏津',
  },
  {
    code: 58923,
    name: '大田',
  },
  {
    code: 51477,
    name: '达坂城',
  },
  {
    code: 59315,
    name: '揭阳',
  },
  {
    code: 58027,
    name: '徐州',
  },
  {
    code: 58644,
    name: '遂昌',
  },
  {
    code: 52896,
    name: '白银',
  },
  {
    code: 56184,
    name: '理县',
  },
  {
    code: 58432,
    name: '泾县',
  },
  {
    code: 58946,
    name: '莆田',
  },
  {
    code: 57358,
    name: '秭归',
  },
  {
    code: 57420,
    name: '大竹',
  },
  {
    code: 54835,
    name: '临朐',
  },
  {
    code: 56781,
    name: '寻甸',
  },
  {
    code: 56018,
    name: '杂多',
  },
  {
    code: 56645,
    name: '兰坪',
  },
  {
    code: 59318,
    name: '潮阳',
  },
  {
    code: 50878,
    name: '桦川',
  },
  {
    code: 54433,
    name: '朝阳',
  },
  {
    code: 58718,
    name: '南丰',
  },
  {
    code: 57749,
    name: '怀化',
  },
  {
    code: 57461,
    name: '宜昌',
  },
  {
    code: 51059,
    name: '吉木乃',
  },
  {
    code: 54338,
    name: '盘山',
  },
  {
    code: 57182,
    name: '襄城',
  },
  {
    code: 56757,
    name: '巍山',
  },
  {
    code: 57860,
    name: '邵阳县',
  },
  {
    code: 57072,
    name: '孟州市',
  },
  {
    code: 50788,
    name: '富锦',
  },
  {
    code: 58755,
    name: '苍南',
  },
  {
    code: 57477,
    name: '公安',
  },
  {
    code: 57728,
    name: '瓮安',
  },
  {
    code: 57571,
    name: '石首',
  },
  {
    code: 54594,
    name: '大兴',
  },
  {
    code: 56766,
    name: '牟定',
  },
  {
    code: 52978,
    name: '夏河',
  },
  {
    code: 54365,
    name: '桓仁',
  },
  {
    code: 56290,
    name: '新都',
  },
  {
    code: 50851,
    name: '青冈',
  },
  {
    code: 54802,
    name: '临清',
  },
  {
    code: 56533,
    name: '贡山',
  },
  {
    code: 53895,
    name: '永年',
  },
  {
    code: 54377,
    name: '集安',
  },
  {
    code: 51137,
    name: '裕民',
  },
  {
    code: 57253,
    name: '郧县',
  },
  {
    code: 53915,
    name: '崆峒',
  },
  {
    code: 58366,
    name: '崇明',
  },
  {
    code: 58022,
    name: '峄城',
  },
  {
    code: 57381,
    name: '随州',
  },
  {
    code: 52955,
    name: '贵南',
  },
  {
    code: 53994,
    name: '卫辉市',
  },
  {
    code: 54416,
    name: '密云',
  },
  {
    code: 55578,
    name: '日喀则',
  },
  {
    code: 59425,
    name: '崇左',
  },
  {
    code: 51060,
    name: '布尔津',
  },
  {
    code: 54452,
    name: '建昌',
  },
  {
    code: 54622,
    name: '津南',
  },
  {
    code: 56954,
    name: '澜沧',
  },
  {
    code: 52874,
    name: '乐都',
  },
  {
    code: 57113,
    name: '凤县',
  },
  {
    code: 57299,
    name: '光山',
  },
  {
    code: 50526,
    name: '牙克石',
  },
  {
    code: 54327,
    name: '凌源',
  },
  {
    code: 58013,
    name: '沛县',
  },
  {
    code: 54751,
    name: '长岛',
  },
  {
    code: 50658,
    name: '克山',
  },
  {
    code: 55228,
    name: '狮泉河',
  },
  {
    code: 58135,
    name: '泗洪',
  },
  {
    code: 51839,
    name: '民丰',
  },
  {
    code: 57035,
    name: '乾县',
  },
  {
    code: 50928,
    name: '巴雅尔吐胡硕',
  },
  {
    code: 59427,
    name: '宁明',
  },
  {
    code: 58354,
    name: '无锡',
  },
  {
    code: 56114,
    name: '巴青',
  },
  {
    code: 54852,
    name: '莱阳',
  },
  {
    code: 56867,
    name: '镇沅',
  },
  {
    code: 56146,
    name: '甘孜',
  },
  {
    code: 58736,
    name: '政和',
  },
  {
    code: 51559,
    name: '和静',
  },
  {
    code: 53958,
    name: '临猗',
  },
  {
    code: 58747,
    name: '周宁',
  },
  {
    code: 56393,
    name: '资中',
  },
  {
    code: 58506,
    name: '庐山',
  },
  {
    code: 57077,
    name: '栾川县',
  },
  {
    code: 50659,
    name: '克东',
  },
  {
    code: 56844,
    name: '潞西',
  },
  {
    code: 51470,
    name: '天池',
  },
  {
    code: 53392,
    name: '康保',
  },
  {
    code: 57304,
    name: '梓潼',
  },
  {
    code: 57003,
    name: '陇县',
  },
  {
    code: 58224,
    name: '淮南',
  },
  {
    code: 53499,
    name: '万全',
  },
  {
    code: 50434,
    name: '图里河',
  },
  {
    code: 57713,
    name: '遵义',
  },
  {
    code: 56862,
    name: '双柏',
  },
  {
    code: 50888,
    name: '宝清',
  },
  {
    code: 58407,
    name: '黄石',
  },
  {
    code: 57829,
    name: '丹寨',
  },
  {
    code: 53682,
    name: '曲阳',
  },
  {
    code: 56882,
    name: '呈贡',
  },
  {
    code: 58225,
    name: '定远',
  },
  {
    code: 57745,
    name: '芷江',
  },
  {
    code: 56851,
    name: '南涧',
  },
  {
    code: 57778,
    name: '衡东',
  },
  {
    code: 57087,
    name: '长葛',
  },
  {
    code: 56384,
    name: '峨眉',
  },
  {
    code: 55595,
    name: '达孜',
  },
  {
    code: 51722,
    name: '阿瓦提',
  },
  {
    code: 58600,
    name: '靖安',
  },
  {
    code: 57960,
    name: '全州',
  },
  {
    code: 53829,
    name: '庆城',
  },
  {
    code: 57098,
    name: '扶沟县',
  },
  {
    code: 57007,
    name: '礼县',
  },
  {
    code: 57742,
    name: '万山',
  },
  {
    code: 57649,
    name: '吉首',
  },
  {
    code: 53784,
    name: '赵县',
  },
  {
    code: 54157,
    name: '四平',
  },
  {
    code: 59501,
    name: '汕尾',
  },
  {
    code: 56675,
    name: '会东',
  },
  {
    code: 50954,
    name: '肇源',
  },
  {
    code: 56301,
    name: '工布江达',
  },
  {
    code: 50867,
    name: '巴彦',
  },
  {
    code: 51814,
    name: '叶城',
  },
  {
    code: 56045,
    name: '甘德',
  },
  {
    code: 57781,
    name: '醴陵',
  },
  {
    code: 56761,
    name: '大姚',
  },
  {
    code: 58713,
    name: '资溪',
  },
  {
    code: 58259,
    name: '南通',
  },
  {
    code: 54449,
    name: '秦皇岛',
  },
  {
    code: 53579,
    name: '代县',
  },
  {
    code: 58633,
    name: '衢州',
  },
  {
    code: 56276,
    name: '新津',
  },
  {
    code: 58707,
    name: '吉水',
  },
  {
    code: 56071,
    name: '碌曲',
  },
  {
    code: 56881,
    name: '石林',
  },
  {
    code: 59626,
    name: '东兴',
  },
  {
    code: 54709,
    name: '武城',
  },
  {
    code: 53821,
    name: '环县',
  },
  {
    code: 54913,
    name: '宁阳',
  },
  {
    code: 57794,
    name: '芦溪',
  },
  {
    code: 54734,
    name: '滨州',
  },
  {
    code: 57771,
    name: '韶山',
  },
  {
    code: 57851,
    name: '新宁',
  },
  {
    code: 59092,
    name: '龙南',
  },
  {
    code: 58138,
    name: '盱眙',
  },
  {
    code: 50525,
    name: '鄂温克旗',
  },
  {
    code: 58426,
    name: '黄山区',
  },
  {
    code: 58255,
    name: '如皋',
  },
  {
    code: 56197,
    name: '什邡',
  },
  {
    code: 50850,
    name: '大庆',
  },
  {
    code: 58927,
    name: '龙岩',
  },
  {
    code: 54842,
    name: '平度',
  },
  {
    code: 57024,
    name: '岐山',
  },
  {
    code: 51368,
    name: '昌吉',
  },
  {
    code: 57637,
    name: '德江',
  },
  {
    code: 54808,
    name: '莘县',
  },
  {
    code: 53888,
    name: '平顺',
  },
  {
    code: 57906,
    name: '望谟',
  },
  {
    code: 56835,
    name: '陇川',
  },
  {
    code: 53930,
    name: '华池',
  },
  {
    code: 59426,
    name: '扶绥',
  },
  {
    code: 54729,
    name: '高青',
  },
  {
    code: 59215,
    name: '德保',
  },
  {
    code: 57905,
    name: '贞丰',
  },
  {
    code: 54809,
    name: '馆陶',
  },
  {
    code: 57769,
    name: '邵东',
  },
  {
    code: 58464,
    name: '平湖',
  },
  {
    code: 57028,
    name: '太白',
  },
  {
    code: 58508,
    name: '德安',
  },
  {
    code: 50767,
    name: '绥棱',
  },
  {
    code: 53730,
    name: '鄂托克前旗',
  },
  {
    code: 58512,
    name: '彭泽',
  },
  {
    code: 58844,
    name: '闽侯',
  },
  {
    code: 57510,
    name: '铜梁',
  },
  {
    code: 56109,
    name: '比如',
  },
  {
    code: 58562,
    name: '宁波',
  },
  {
    code: 56669,
    name: '永仁',
  },
  {
    code: 57271,
    name: '新野',
  },
  {
    code: 59022,
    name: '南丹',
  },
  {
    code: 57604,
    name: '纳溪',
  },
  {
    code: 59285,
    name: '从化',
  },
  {
    code: 50564,
    name: '孙吴',
  },
  {
    code: 54714,
    name: '德州',
  },
  {
    code: 59081,
    name: '乳源',
  },
  {
    code: 57916,
    name: '罗甸',
  },
  {
    code: 53857,
    name: '宜川',
  },
  {
    code: 53871,
    name: '武乡',
  },
  {
    code: 53599,
    name: '涞源',
  },
  {
    code: 51068,
    name: '福海',
  },
  {
    code: 57875,
    name: '衡南',
  },
  {
    code: 53519,
    name: '惠农',
  },
  {
    code: 58804,
    name: '兴国',
  },
  {
    code: 55589,
    name: '贡噶',
  },
  {
    code: 58461,
    name: '青浦',
  },
  {
    code: 56371,
    name: '泸定',
  },
  {
    code: 54304,
    name: '崇礼',
  },
  {
    code: 57469,
    name: '松滋',
  },
  {
    code: 57541,
    name: '宣恩',
  },
  {
    code: 53751,
    name: '子洲',
  },
  {
    code: 57313,
    name: '巴中',
  },
  {
    code: 57458,
    name: '五峰',
  },
  {
    code: 54351,
    name: '抚顺',
  },
  {
    code: 55677,
    name: '岗巴',
  },
  {
    code: 51655,
    name: '尉犁',
  },
  {
    code: 54320,
    name: '宁城',
  },
  {
    code: 54713,
    name: '东光',
  },
  {
    code: 59063,
    name: '江华',
  },
  {
    code: 58212,
    name: '凤台',
  },
  {
    code: 57095,
    name: '鄢陵',
  },
  {
    code: 56189,
    name: '彭县',
  },
  {
    code: 54563,
    name: '瓦房店',
  },
  {
    code: 58968,
    name: '台北',
  },
  {
    code: 58319,
    name: '桐城',
  },
  {
    code: 57482,
    name: '孝感',
  },
  {
    code: 58936,
    name: '仙游',
  },
  {
    code: 53665,
    name: '岚县',
  },
  {
    code: 58438,
    name: '绩溪',
  },
  {
    code: 54607,
    name: '望都',
  },
  {
    code: 54437,
    name: '滦南',
  },
  {
    code: 54535,
    name: '唐海',
  },
  {
    code: 50852,
    name: '望奎',
  },
  {
    code: 59072,
    name: '连州',
  },
  {
    code: 59255,
    name: '平南',
  },
  {
    code: 591170,
    name: '梅州',
  },
  {
    code: 50979,
    name: '林口',
  },
  {
    code: 58351,
    name: '江阴',
  },
  {
    code: 57754,
    name: '洪江',
  },
  {
    code: 58257,
    name: '靖江',
  },
  {
    code: 55299,
    name: '那曲',
  },
  {
    code: 56173,
    name: '红原',
  },
  {
    code: 57437,
    name: '忠县',
  },
  {
    code: 59045,
    name: '鹿寨',
  },
  {
    code: 56094,
    name: '舟曲',
  },
  {
    code: 50924,
    name: '霍林郭勒',
  },
  {
    code: 57030,
    name: '永寿',
  },
  {
    code: 53778,
    name: '平遥',
  },
  {
    code: 50873,
    name: '佳木斯',
  },
  {
    code: 53874,
    name: '古县',
  },
  {
    code: 56396,
    name: '自贡',
  },
  {
    code: 54486,
    name: '岫岩',
  },
  {
    code: 59754,
    name: '徐闻',
  },
  {
    code: 57074,
    name: '伊川县',
  },
  {
    code: 57294,
    name: '确山县',
  },
  {
    code: 50884,
    name: '双鸭山',
  },
  {
    code: 57813,
    name: '清镇',
  },
  {
    code: 53866,
    name: '洪洞',
  },
  {
    code: 51482,
    name: '木垒',
  },
  {
    code: 59114,
    name: '蕉岭',
  },
  {
    code: 57687,
    name: '湘江新区',
  },
  {
    code: 54602,
    name: '保定',
  },
  {
    code: 50468,
    name: '黑河',
  },
  {
    code: 53362,
    name: '四子王旗',
  },
  {
    code: 58433,
    name: '宣城',
  },
  {
    code: 57896,
    name: '遂川',
  },
  {
    code: 52576,
    name: '阿拉善右旗',
  },
  {
    code: 54234,
    name: '库伦旗',
  },
  {
    code: 53757,
    name: '清涧',
  },
  {
    code: 57401,
    name: '射洪',
  },
  {
    code: 56034,
    name: '称多',
  },
  {
    code: 58311,
    name: '六安',
  },
  {
    code: 59951,
    name: '万宁',
  },
  {
    code: 53662,
    name: '岢岚',
  },
  {
    code: 51465,
    name: '小渠子',
  },
  {
    code: 57809,
    name: '镇宁',
  },
  {
    code: 56651,
    name: '丽江',
  },
  {
    code: 59158,
    name: '台中',
  },
  {
    code: 53981,
    name: '陵川',
  },
  {
    code: 52877,
    name: '化隆',
  },
  {
    code: 53945,
    name: '宜君',
  },
  {
    code: 58345,
    name: '溧阳',
  },
  {
    code: 52983,
    name: '榆中',
  },
  {
    code: 58836,
    name: '古田',
  },
  {
    code: 54774,
    name: '威海',
  },
  {
    code: 53878,
    name: '黎城',
  },
  {
    code: 56308,
    name: '朗县',
  },
  {
    code: 54604,
    name: '安国',
  },
  {
    code: 54765,
    name: '烟台',
  },
  {
    code: 53502,
    name: '吉兰太',
  },
  {
    code: 58419,
    name: '东至',
  },
  {
    code: 59640,
    name: '合浦',
  },
  {
    code: 53799,
    name: '巨鹿',
  },
  {
    code: 53567,
    name: '府谷',
  },
  {
    code: 54603,
    name: '高阳',
  },
  {
    code: 53760,
    name: '方山',
  },
  {
    code: 57894,
    name: '井冈山',
  },
  {
    code: 56459,
    name: '木里',
  },
  {
    code: 57739,
    name: '玉屏',
  },
  {
    code: 54902,
    name: '清丰县',
  },
  {
    code: 58612,
    name: '余干',
  },
  {
    code: 57964,
    name: '灌阳',
  },
  {
    code: 53529,
    name: '鄂托克旗',
  },
  {
    code: 54904,
    name: '鄄城',
  },
  {
    code: 58236,
    name: '滁州',
  },
  {
    code: 58944,
    name: '平潭',
  },
  {
    code: 54820,
    name: '邱县',
  },
  {
    code: 52869,
    name: '湟中',
  },
  {
    code: 53467,
    name: '托克托',
  },
  {
    code: 53880,
    name: '潞城',
  },
  {
    code: 57825,
    name: '凯里',
  },
  {
    code: 58620,
    name: '乐平',
  },
  {
    code: 50859,
    name: '兰西',
  },
  {
    code: 58460,
    name: '金山',
  },
  {
    code: 55586,
    name: '曲水',
  },
  {
    code: 58823,
    name: '顺昌',
  },
  {
    code: 58548,
    name: '兰溪',
  },
  {
    code: 50779,
    name: '抚远',
  },
  {
    code: 57052,
    name: '永济',
  },
  {
    code: 56092,
    name: '陇西',
  },
  {
    code: 58326,
    name: '巢湖',
  },
  {
    code: 54274,
    name: '辉南',
  },
  {
    code: 54254,
    name: '开原',
  },
  {
    code: 51818,
    name: '皮山',
  },
  {
    code: 51573,
    name: '吐鲁番',
  },
  {
    code: 52988,
    name: '康乐',
  },
  {
    code: 57370,
    name: '宜城',
  },
  {
    code: 57043,
    name: '大荔',
  },
  {
    code: 54703,
    name: '武邑',
  },
  {
    code: 56211,
    name: '边坝',
  },
  {
    code: 54623,
    name: '滨海新区',
  },
  {
    code: 57184,
    name: '叶县',
  },
  {
    code: 57566,
    name: '临澧',
  },
  {
    code: 57102,
    name: '成县',
  },
  {
    code: 57249,
    name: '竹溪',
  },
  {
    code: 58667,
    name: '玉环',
  },
  {
    code: 58241,
    name: '高邮',
  },
  {
    code: 58752,
    name: '瑞安',
  },
  {
    code: 50964,
    name: '方正',
  },
  {
    code: 59457,
    name: '陆川',
  },
  {
    code: 58316,
    name: '舒城',
  },
  {
    code: 54906,
    name: '菏泽',
  },
  {
    code: 58503,
    name: '瑞昌',
  },
  {
    code: 56575,
    name: '普格',
  },
  {
    code: 57177,
    name: '舞钢',
  },
  {
    code: 57643,
    name: '永顺',
  },
  {
    code: 52833,
    name: '乌兰',
  },
  {
    code: 58437,
    name: '黄山风景区',
  },
  {
    code: 57773,
    name: '湘潭',
  },
  {
    code: 59279,
    name: '三水',
  },
  {
    code: 56665,
    name: '盐边',
  },
  {
    code: 58570,
    name: '普陀',
  },
  {
    code: 52118,
    name: '伊吾',
  },
  {
    code: 58048,
    name: '灌南',
  },
  {
    code: 57981,
    name: '资兴',
  },
  {
    code: 54905,
    name: '郓城',
  },
  {
    code: 54736,
    name: '东营',
  },
  {
    code: 55585,
    name: '尼木',
  },
  {
    code: 50861,
    name: '庆安',
  },
  {
    code: 50945,
    name: '大安',
  },
  {
    code: 55693,
    name: '曲松',
  },
  {
    code: 54863,
    name: '海阳',
  },
  {
    code: 55357,
    name: '措勤',
  },
  {
    code: 52963,
    name: '尖扎',
  },
  {
    code: 58245,
    name: '扬州',
  },
  {
    code: 52982,
    name: '广河',
  },
  {
    code: 56966,
    name: '元江',
  },
  {
    code: 54579,
    name: '长海',
  },
  {
    code: 57096,
    name: '杞县',
  },
  {
    code: 57932,
    name: '榕江',
  },
  {
    code: 57037,
    name: '耀县',
  },
  {
    code: 57395,
    name: '大悟',
  },
  {
    code: 58367,
    name: '上海',
  },
  {
    code: 53740,
    name: '横山',
  },
  {
    code: 57678,
    name: '宁乡',
  },
  {
    code: 57844,
    name: '锦屏',
  },
  {
    code: 53694,
    name: '平山',
  },
  {
    code: 57853,
    name: '武冈',
  },
  {
    code: 56187,
    name: '温江',
  },
  {
    code: 57155,
    name: '山阳',
  },
  {
    code: 50778,
    name: '同江',
  },
  {
    code: 51704,
    name: '阿图什',
  },
  {
    code: 52101,
    name: '巴里坤',
  },
  {
    code: 57694,
    name: '铜鼓',
  },
  {
    code: 58618,
    name: '东乡',
  },
  {
    code: 53859,
    name: '吉县',
  },
  {
    code: 58527,
    name: '景德镇',
  },
  {
    code: 59271,
    name: '广宁',
  },
  {
    code: 53942,
    name: '洛川',
  },
  {
    code: 58234,
    name: '来安',
  },
  {
    code: 51352,
    name: '炮台',
  },
  {
    code: 58408,
    name: '蕲春',
  },
  {
    code: 57315,
    name: '仪陇',
  },
  {
    code: 51378,
    name: '吉木萨尔',
  },
  {
    code: 54263,
    name: '磐石',
  },
  {
    code: 53463,
    name: '呼和浩特',
  },
  {
    code: 57034,
    name: '武功',
  },
  {
    code: 50674,
    name: '乌伊岭',
  },
  {
    code: 56441,
    name: '得荣',
  },
  {
    code: 57807,
    name: '六枝',
  },
  {
    code: 58036,
    name: '东海',
  },
  {
    code: 53864,
    name: '蒲县',
  },
  {
    code: 58117,
    name: '利辛',
  },
  {
    code: 56569,
    name: '德昌',
  },
  {
    code: 52868,
    name: '贵德',
  },
  {
    code: 57498,
    name: '黄冈',
  },
  {
    code: 57926,
    name: '荔波',
  },
  {
    code: 59052,
    name: '恭城',
  },
  {
    code: 57355,
    name: '巴东',
  },
  {
    code: 51716,
    name: '巴楚',
  },
  {
    code: 53545,
    name: '伊金霍洛旗',
  },
  {
    code: 57600,
    name: '江安',
  },
  {
    code: 54434,
    name: '迁西',
  },
  {
    code: 53934,
    name: '合水',
  },
  {
    code: 53848,
    name: '甘泉',
  },
  {
    code: 58642,
    name: '武义',
  },
  {
    code: 56891,
    name: '罗平',
  },
  {
    code: 57573,
    name: '监利',
  },
  {
    code: 57783,
    name: '上栗',
  },
  {
    code: 57187,
    name: '社旗',
  },
  {
    code: 58423,
    name: '九华',
  },
  {
    code: 56596,
    name: '威信',
  },
  {
    code: 58443,
    name: '长兴',
  },
  {
    code: 56688,
    name: '东川',
  },
  {
    code: 56586,
    name: '昭通',
  },
  {
    code: 53916,
    name: '泾源',
  },
  {
    code: 57663,
    name: '汉寿',
  },
  {
    code: 57181,
    name: '宝丰',
  },
  {
    code: 56991,
    name: '砚山',
  },
  {
    code: 57153,
    name: '丹凤',
  },
  {
    code: 53928,
    name: '崇信',
  },
  {
    code: 58415,
    name: '潜山',
  },
  {
    code: 54701,
    name: '辛集',
  },
  {
    code: 54135,
    name: '通辽',
  },
  {
    code: 54609,
    name: '安平',
  },
  {
    code: 54399,
    name: '海淀',
  },
  {
    code: 58813,
    name: '广昌',
  },
  {
    code: 58565,
    name: '奉化',
  },
  {
    code: 58353,
    name: '张家港',
  },
  {
    code: 51356,
    name: '石河子',
  },
  {
    code: 53580,
    name: '怀仁',
  },
  {
    code: 53676,
    name: '定襄',
  },
  {
    code: 54243,
    name: '昌图',
  },
  {
    code: 56152,
    name: '色达',
  },
  {
    code: 50524,
    name: '陈巴尔虎旗',
  },
  {
    code: 59432,
    name: '南宁城区',
  },
  {
    code: 57799,
    name: '吉安',
  },
  {
    code: 58441,
    name: '广德',
  },
  {
    code: 54428,
    name: '蓟县',
  },
  {
    code: 57536,
    name: '黔江',
  },
  {
    code: 58751,
    name: '平阳',
  },
  {
    code: 58693,
    name: '新建',
  },
  {
    code: 57333,
    name: '城口',
  },
  {
    code: 57871,
    name: '衡阳县',
  },
  {
    code: 59122,
    name: '长泰',
  },
  {
    code: 58005,
    name: '商丘',
  },
  {
    code: 58942,
    name: '福清',
  },
  {
    code: 53770,
    name: '祁县',
  },
  {
    code: 58933,
    name: '屏南',
  },
  {
    code: 58624,
    name: '弋阳',
  },
  {
    code: 53773,
    name: '临漳',
  },
  {
    code: 57870,
    name: '祁东',
  },
  {
    code: 56167,
    name: '道孚',
  },
  {
    code: 57261,
    name: '淅川',
  },
  {
    code: 59480,
    name: '顺德',
  },
  {
    code: 56462,
    name: '九龙',
  },
  {
    code: 52713,
    name: '大柴旦',
  },
  {
    code: 57361,
    name: '保康',
  },
  {
    code: 58401,
    name: '罗田',
  },
  {
    code: 54102,
    name: '锡林浩特',
  },
  {
    code: 54419,
    name: '怀柔',
  },
  {
    code: 53886,
    name: '涉县',
  },
  {
    code: 57523,
    name: '丰都',
  },
  {
    code: 56959,
    name: '景洪',
  },
  {
    code: 57696,
    name: '宜丰',
  },
  {
    code: 53956,
    name: '万荣',
  },
  {
    code: 54824,
    name: '淄川',
  },
  {
    code: 54531,
    name: '滦县',
  },
  {
    code: 54807,
    name: '阳谷',
  },
  {
    code: 53231,
    name: '海力素',
  },
  {
    code: 52875,
    name: '平安',
  },
  {
    code: 58622,
    name: '德兴',
  },
  {
    code: 57178,
    name: '南阳市',
  },
  {
    code: 54938,
    name: '临沂',
  },
  {
    code: 53982,
    name: '焦作市',
  },
  {
    code: 57992,
    name: '南康',
  },
  {
    code: 54819,
    name: '肥城',
  },
  {
    code: 50948,
    name: '乾安',
  },
  {
    code: 54752,
    name: '蓬莱',
  },
  {
    code: 53935,
    name: '正宁',
  },
  {
    code: 54259,
    name: '清原',
  },
  {
    code: 53466,
    name: '呼和浩特市郊区',
  },
  {
    code: 56376,
    name: '汉源',
  },
  {
    code: 59229,
    name: '隆安',
  },
  {
    code: 57339,
    name: '云阳',
  },
  {
    code: 53775,
    name: '太谷',
  },
  {
    code: 58108,
    name: '界首',
  },
  {
    code: 57004,
    name: '武山',
  },
  {
    code: 59847,
    name: '昌江',
  },
  {
    code: 58116,
    name: '淮北',
  },
  {
    code: 54911,
    name: '东平',
  },
  {
    code: 53685,
    name: '盂县',
  },
  {
    code: 54903,
    name: '范县',
  },
  {
    code: 54406,
    name: '延庆',
  },
  {
    code: 56479,
    name: '昭觉',
  },
  {
    code: 58007,
    name: '柘城',
  },
  {
    code: 52855,
    name: '湟源',
  },
  {
    code: 54438,
    name: '卢龙',
  },
  {
    code: 51243,
    name: '克拉玛依',
  },
  {
    code: 54723,
    name: '阳信',
  },
  {
    code: 54497,
    name: '丹东',
  },
  {
    code: 58484,
    name: '岱山',
  },
  {
    code: 58107,
    name: '临泉',
  },
  {
    code: 52895,
    name: '靖远',
  },
  {
    code: 58125,
    name: '灵璧',
  },
  {
    code: 54619,
    name: '静海',
  },
  {
    code: 53863,
    name: '介休',
  },
  {
    code: 53455,
    name: '土默特右旗',
  },
  {
    code: 57217,
    name: '旺苍',
  },
  {
    code: 54918,
    name: '曲阜',
  },
  {
    code: 58657,
    name: '青田',
  },
  {
    code: 53472,
    name: '卓资',
  },
  {
    code: 52986,
    name: '临洮',
  },
  {
    code: 53941,
    name: '白水',
  },
  {
    code: 58414,
    name: '太湖',
  },
  {
    code: 58820,
    name: '泰宁',
  },
  {
    code: 57814,
    name: '平坝',
  },
  {
    code: 56838,
    name: '瑞丽',
  },
  {
    code: 59065,
    name: '贺州',
  },
  {
    code: 54432,
    name: '宽城',
  },
  {
    code: 53914,
    name: '隆德',
  },
  {
    code: 57257,
    name: '竹山',
  },
  {
    code: 57265,
    name: '老河口',
  },
  {
    code: 59322,
    name: '云霄',
  },
  {
    code: 57857,
    name: '城步',
  },
  {
    code: 53651,
    name: '神木',
  },
  {
    code: 54156,
    name: '公主岭',
  },
  {
    code: 59320,
    name: '诏安',
  },
  {
    code: 57180,
    name: '郏县',
  },
  {
    code: 57796,
    name: '新余',
  },
  {
    code: 53699,
    name: '无极',
  },
  {
    code: 50639,
    name: '扎兰屯',
  },
  {
    code: 57803,
    name: '黔西',
  },
  {
    code: 58111,
    name: '永城',
  },
  {
    code: 54816,
    name: '长清',
  },
  {
    code: 58132,
    name: '泗阳',
  },
  {
    code: 57377,
    name: '荆门',
  },
  {
    code: 53962,
    name: '翼城',
  },
  {
    code: 54171,
    name: '永吉',
  },
  {
    code: 50913,
    name: '乌拉盖',
  },
  {
    code: 58139,
    name: '洪泽',
  },
  {
    code: 56739,
    name: '腾冲',
  },
  {
    code: 54455,
    name: '兴城',
  },
  {
    code: 54929,
    name: '费县',
  },
  {
    code: 58402,
    name: '英山',
  },
  {
    code: 58342,
    name: '金坛',
  },
  {
    code: 59855,
    name: '琼海',
  },
  {
    code: 54064,
    name: '农安',
  },
  {
    code: 51369,
    name: '米泉',
  },
  {
    code: 56582,
    name: '大关',
  },
  {
    code: 53481,
    name: '察哈尔右翼前旗',
  },
  {
    code: 57260,
    name: '丹江口',
  },
  {
    code: 56125,
    name: '囊谦',
  },
  {
    code: 52675,
    name: '金昌',
  },
  {
    code: 55591,
    name: '拉萨',
  },
  {
    code: 57965,
    name: '道县',
  },
  {
    code: 56875,
    name: '玉溪',
  },
  {
    code: 53924,
    name: '灵台',
  },
  {
    code: 59290,
    name: '龙门',
  },
  {
    code: 51705,
    name: '乌恰',
  },
  {
    code: 55691,
    name: '扎囊',
  },
  {
    code: 57835,
    name: '剑河',
  },
  {
    code: 50655,
    name: '五大连池',
  },
  {
    code: 58151,
    name: '盐城',
  },
  {
    code: 53854,
    name: '延长',
  },
  {
    code: 58026,
    name: '邳州',
  },
  {
    code: 54584,
    name: '庄河',
  },
  {
    code: 54621,
    name: '深泽',
  },
  {
    code: 53680,
    name: '灵寿',
  },
  {
    code: 56842,
    name: '施甸',
  },
  {
    code: 56643,
    name: '泸水',
  },
  {
    code: 59310,
    name: '丰顺',
  },
  {
    code: 57908,
    name: '安龙',
  },
  {
    code: 59055,
    name: '荔浦',
  },
  {
    code: 58320,
    name: '肥西',
  },
  {
    code: 56778,
    name: '昆明',
  },
  {
    code: 58559,
    name: '天台',
  },
  {
    code: 53385,
    name: '商都',
  },
  {
    code: 54313,
    name: '喀喇沁旗',
  },
  {
    code: 58964,
    name: '基隆',
  },
  {
    code: 57143,
    name: '商洛',
  },
  {
    code: 58907,
    name: '安远',
  },
  {
    code: 54939,
    name: '莒南',
  },
  {
    code: 58637,
    name: '上饶',
  },
  {
    code: 53882,
    name: '长治',
  },
  {
    code: 54632,
    name: '平乡',
  },
  {
    code: 54386,
    name: '长白',
  },
  {
    code: 50915,
    name: '东乌珠穆沁旗',
  },
  {
    code: 58032,
    name: '临沭',
  },
  {
    code: 53853,
    name: '隰县',
  },
  {
    code: 57774,
    name: '双峰',
  },
  {
    code: 50871,
    name: '汤原',
  },
  {
    code: 51815,
    name: '泽普',
  },
  {
    code: 57439,
    name: '利川',
  },
  {
    code: 56383,
    name: '青神',
  },
  {
    code: 57609,
    name: '赤水',
  },
  {
    code: 50745,
    name: '齐齐哈尔',
  },
  {
    code: 53796,
    name: '宁晋',
  },
  {
    code: 58109,
    name: '太和',
  },
  {
    code: 57418,
    name: '华蓥山',
  },
  {
    code: 50946,
    name: '松原',
  },
  {
    code: 53397,
    name: '尚义',
  },
  {
    code: 57837,
    name: '雷山',
  },
  {
    code: 50557,
    name: '嫩江',
  },
  {
    code: 57460,
    name: '当阳',
  },
  {
    code: 52378,
    name: '拐子湖',
  },
  {
    code: 56751,
    name: '大理',
  },
  {
    code: 53337,
    name: '五原',
  },
  {
    code: 58656,
    name: '乐清',
  },
  {
    code: 58248,
    name: '镇江',
  },
  {
    code: 50775,
    name: '鹤岗',
  },
  {
    code: 59268,
    name: '郁南',
  },
  {
    code: 54730,
    name: '沾化',
  },
  {
    code: 57259,
    name: '房县',
  },
  {
    code: 57216,
    name: '南江',
  },
  {
    code: 57254,
    name: '白河',
  },
  {
    code: 53832,
    name: '志丹',
  },
  {
    code: 57128,
    name: '城固',
  },
  {
    code: 57564,
    name: '慈利',
  },
  {
    code: 54529,
    name: '宁河',
  },
  {
    code: 53512,
    name: '乌海',
  },
  {
    code: 50934,
    name: '突泉',
  },
  {
    code: 53192,
    name: '阿巴嘎旗',
  },
  {
    code: 58268,
    name: '通州',
  },
  {
    code: 54631,
    name: '广宗',
  },
  {
    code: 56147,
    name: '白玉',
  },
  {
    code: 53573,
    name: '左云',
  },
  {
    code: 57513,
    name: '渝北',
  },
  {
    code: 58338,
    name: '芜湖县',
  },
  {
    code: 53367,
    name: '希拉穆仁',
  },
  {
    code: 59033,
    name: '罗城',
  },
  {
    code: 56478,
    name: '喜德',
  },
  {
    code: 54530,
    name: '汉沽',
  },
  {
    code: 56331,
    name: '左贡',
  },
  {
    code: 51328,
    name: '霍尔果斯',
  },
  {
    code: 57517,
    name: '江津',
  },
  {
    code: 53553,
    name: '准格尔旗',
  },
  {
    code: 54811,
    name: '禹城',
  },
  {
    code: 57387,
    name: '京山',
  },
  {
    code: 56267,
    name: '雅江',
  },
  {
    code: 58004,
    name: '民权',
  },
  {
    code: 53688,
    name: '行唐',
  },
  {
    code: 56480,
    name: '马边',
  },
  {
    code: 50774,
    name: '伊春',
  },
  {
    code: 57845,
    name: '通道',
  },
  {
    code: 57022,
    name: '麟游',
  },
  {
    code: 56493,
    name: '南溪',
  },
  {
    code: 59856,
    name: '文昌',
  },
  {
    code: 57921,
    name: '平塘',
  },
  {
    code: 54374,
    name: '临江',
  },
  {
    code: 57506,
    name: '永川',
  },
  {
    code: 51431,
    name: '伊宁市',
  },
  {
    code: 56195,
    name: '江油',
  },
  {
    code: 56970,
    name: '石屏',
  },
  {
    code: 58517,
    name: '都昌',
  },
  {
    code: 57162,
    name: '嵩县',
  },
  {
    code: 54326,
    name: '建平',
  },
  {
    code: 57485,
    name: '仙桃',
  },
  {
    code: 58339,
    name: '高淳',
  },
  {
    code: 55655,
    name: '聂拉木',
  },
  {
    code: 52885,
    name: '永登',
  },
  {
    code: 56973,
    name: '建水',
  },
  {
    code: 54801,
    name: '临西',
  },
  {
    code: 53948,
    name: '蒲城',
  },
  {
    code: 58327,
    name: '庐江',
  },
  {
    code: 56475,
    name: '越西',
  },
  {
    code: 57343,
    name: '镇坪',
  },
  {
    code: 53906,
    name: '静宁',
  },
  {
    code: 56674,
    name: '仁和',
  },
  {
    code: 57053,
    name: '芮城',
  },
  {
    code: 57603,
    name: '合江',
  },
  {
    code: 54615,
    name: '青县',
  },
  {
    code: 54700,
    name: '武强',
  },
  {
    code: 58556,
    name: '嵊州',
  },
  {
    code: 56565,
    name: '盐源',
  },
  {
    code: 52818,
    name: '格尔木',
  },
  {
    code: 56494,
    name: '屏山',
  },
  {
    code: 58846,
    name: '宁德',
  },
  {
    code: 58665,
    name: '台州',
  },
  {
    code: 54715,
    name: '陵县',
  },
  {
    code: 50955,
    name: '双城',
  },
  {
    code: 57712,
    name: '汇川',
  },
  {
    code: 58044,
    name: '连云港',
  },
  {
    code: 54093,
    name: '穆棱',
  },
  {
    code: 56194,
    name: '北川',
  },
  {
    code: 58011,
    name: '单县',
  },
  {
    code: 53953,
    name: '乡宁',
  },
  {
    code: 57732,
    name: '印江',
  },
  {
    code: 50838,
    name: '乌兰浩特',
  },
  {
    code: 59848,
    name: '白沙',
  },
  {
    code: 57874,
    name: '常宁',
  },
  {
    code: 58361,
    name: '闵行',
  },
  {
    code: 58404,
    name: '浠水',
  },
  {
    code: 58335,
    name: '当涂',
  },
  {
    code: 55696,
    name: '隆子',
  },
  {
    code: 59230,
    name: '马山',
  },
  {
    code: 56394,
    name: '荣县',
  },
  {
    code: 53343,
    name: '白云鄂博',
  },
  {
    code: 54334,
    name: '义县',
  },
  {
    code: 54134,
    name: '开鲁',
  },
  {
    code: 59256,
    name: '藤县',
  },
  {
    code: 59481,
    name: '番禺',
  },
  {
    code: 53872,
    name: '沁县',
  },
  {
    code: null,
    name: '绍兴',
  },
  {
    code: 56697,
    name: '宣威',
  },
  {
    code: 53961,
    name: '曲沃',
  },
  {
    code: 58015,
    name: '砀山',
  },
  {
    code: 58045,
    name: '响水',
  },
  {
    code: 53976,
    name: '晋城',
  },
  {
    code: 58409,
    name: '黄梅',
  },
  {
    code: 58715,
    name: '南城',
  },
  {
    code: 57518,
    name: '巴南',
  },
  {
    code: 57975,
    name: '蓝山',
  },
  {
    code: 56357,
    name: '稻城',
  },
  {
    code: 52745,
    name: '天峻',
  },
  {
    code: 59421,
    name: '大新',
  },
  {
    code: 53979,
    name: '博爱县',
  },
  {
    code: 57134,
    name: '佛坪',
  },
  {
    code: 56288,
    name: '双流',
  },
  {
    code: 56592,
    name: '高县',
  },
  {
    code: 57073,
    name: '洛阳市',
  },
  {
    code: 58331,
    name: '和县',
  },
  {
    code: 59091,
    name: '全南',
  },
  {
    code: 59288,
    name: '佛山',
  },
  {
    code: 57822,
    name: '黄平',
  },
  {
    code: 53810,
    name: '同心',
  },
  {
    code: 57949,
    name: '永福',
  },
  {
    code: 57309,
    name: '西充',
  },
  {
    code: 58501,
    name: '武穴',
  },
  {
    code: 57719,
    name: '开阳',
  },
  {
    code: 58607,
    name: '莲塘',
  },
  {
    code: 54439,
    name: '迁安',
  },
  {
    code: 54285,
    name: '二道',
  },
  {
    code: 57285,
    name: '桐柏',
  },
  {
    code: 54225,
    name: '敖汉旗',
  },
  {
    code: 53841,
    name: '安塞',
  },
  {
    code: 57740,
    name: '凤凰',
  },
  {
    code: 54521,
    name: '香河',
  },
  {
    code: 57780,
    name: '株洲',
  },
  {
    code: 52495,
    name: '巴彦诺尔贡',
  },
  {
    code: 58704,
    name: '峡江',
  },
  {
    code: 57680,
    name: '汨罗',
  },
  {
    code: 56846,
    name: '凤庆',
  },
  {
    code: 54737,
    name: '博兴',
  },
  {
    code: 54940,
    name: '五莲',
  },
  {
    code: 57447,
    name: '恩施',
  },
  {
    code: 50566,
    name: '逊克',
  },
  {
    code: 57211,
    name: '宁强',
  },
  {
    code: 59644,
    name: '北海',
  },
  {
    code: 59294,
    name: '增城',
  },
  {
    code: 57828,
    name: '麻江',
  },
  {
    code: 53946,
    name: '黄龙',
  },
  {
    code: 57839,
    name: '黎平',
  },
  {
    code: 54830,
    name: '淄博',
  },
  {
    code: 58754,
    name: '福鼎',
  },
  {
    code: 53584,
    name: '应县',
  },
  {
    code: 57279,
    name: '枣阳',
  },
  {
    code: 52557,
    name: '临泽',
  },
  {
    code: 54525,
    name: '宝坻',
  },
  {
    code: 56571,
    name: '西昌',
  },
  {
    code: 59137,
    name: '晋江',
  },
  {
    code: 58557,
    name: '义乌',
  },
  {
    code: 56399,
    name: '富顺',
  },
  {
    code: 52418,
    name: '敦煌',
  },
  {
    code: 57834,
    name: '台江',
  },
  {
    code: 56984,
    name: '个旧',
  },
  {
    code: 56151,
    name: '班玛',
  },
  {
    code: 57297,
    name: '信阳市',
  },
  {
    code: 57144,
    name: '镇安',
  },
  {
    code: 53692,
    name: '唐县',
  },
  {
    code: 58024,
    name: '枣庄',
  },
  {
    code: 58510,
    name: '湖口',
  },
  {
    code: 50960,
    name: '宾县',
  },
  {
    code: 53774,
    name: '清徐',
  },
  {
    code: 53644,
    name: '乌审旗',
  },
  {
    code: 58451,
    name: '嘉善',
  },
  {
    code: 53856,
    name: '大宁',
  },
  {
    code: 57154,
    name: '商南',
  },
  {
    code: 56982,
    name: '开远',
  },
  {
    code: 53492,
    name: '阳原',
  },
  {
    code: 59218,
    name: '靖西',
  },
  {
    code: 52784,
    name: '古浪',
  },
  {
    code: 57577,
    name: '安乡',
  },
  {
    code: 59941,
    name: '五指山',
  },
  {
    code: 56487,
    name: '美姑',
  },
  {
    code: 54711,
    name: '景县',
  },
  {
    code: 51642,
    name: '轮台',
  },
  {
    code: 57173,
    name: '鲁山',
  },
  {
    code: 57359,
    name: '兴山',
  },
  {
    code: 53964,
    name: '新绛',
  },
  {
    code: 57016,
    name: '宝鸡',
  },
  {
    code: 58100,
    name: '郸城县',
  },
  {
    code: 59270,
    name: '怀集',
  },
  {
    code: 54712,
    name: '临邑',
  },
  {
    code: 54527,
    name: '西青',
  },
  {
    code: 53869,
    name: '霍州',
  },
  {
    code: 57040,
    name: '高陵',
  },
  {
    code: 58202,
    name: '阜南',
  },
  {
    code: 58617,
    name: '抚州',
  },
  {
    code: 56082,
    name: '卓尼',
  },
  {
    code: 53786,
    name: '左权',
  },
  {
    code: 58643,
    name: '永康',
  },
  {
    code: 54932,
    name: '沂水',
  },
  {
    code: 58420,
    name: '枞阳',
  },
  {
    code: 58346,
    name: '宜兴',
  },
  {
    code: 58563,
    name: '北仑',
  },
  {
    code: 57378,
    name: '钟祥',
  },
  {
    code: 57198,
    name: '商水县',
  },
  {
    code: 54919,
    name: '邹城',
  },
  {
    code: 56390,
    name: '井研',
  },
  {
    code: 57816,
    name: '贵阳',
  },
  {
    code: 57923,
    name: '三都',
  },
  {
    code: 56065,
    name: '河南',
  },
  {
    code: 50965,
    name: '延寿',
  },
  {
    code: 53896,
    name: '魏县',
  },
  {
    code: 59316,
    name: '汕头',
  },
  {
    code: 59313,
    name: '饶平',
  },
  {
    code: 54027,
    name: '巴林左旗',
  },
  {
    code: 51571,
    name: '托克逊',
  },
  {
    code: 55569,
    name: '拉孜',
  },
  {
    code: 53693,
    name: '井陉',
  },
  {
    code: 52866,
    name: '西宁',
  },
  {
    code: 58146,
    name: '建湖',
  },
  {
    code: 52575,
    name: '雅布赖',
  },
  {
    code: 57786,
    name: '萍乡',
  },
  {
    code: 53877,
    name: '安泽',
  },
  {
    code: 57318,
    name: '营山',
  },
  {
    code: 54590,
    name: '东港',
  },
  {
    code: 57865,
    name: '冷水滩',
  },
  {
    code: 57432,
    name: '万州',
  },
  {
    code: 54213,
    name: '翁牛特旗',
  },
  {
    code: 53984,
    name: '修武县',
  },
  {
    code: 56497,
    name: '盐津',
  },
  {
    code: 53993,
    name: '内黄县',
  },
  {
    code: 59134,
    name: '厦门',
  },
  {
    code: 57867,
    name: '东安',
  },
  {
    code: 54825,
    name: '博山',
  },
  {
    code: 58837,
    name: '尤溪',
  },
  {
    code: 54526,
    name: '东丽',
  },
  {
    code: 59034,
    name: '宜州',
  },
  {
    code: 54821,
    name: '济阳',
  },
  {
    code: 54532,
    name: '丰润',
  },
  {
    code: 59654,
    name: '廉江',
  },
  {
    code: null,
    name: '望城区',
  },
  {
    code: 54154,
    name: '梨树',
  },
  {
    code: 56885,
    name: '弥勒',
  },
  {
    code: 54922,
    name: '新泰',
  },
  {
    code: 54717,
    name: '吴桥',
  },
  {
    code: 55773,
    name: '帕里',
  },
  {
    code: 58918,
    name: '上杭',
  },
  {
    code: 58360,
    name: '海门',
  },
  {
    code: 58712,
    name: '金溪',
  },
  {
    code: 53391,
    name: '化德',
  },
  {
    code: 58553,
    name: '上虞',
  },
  {
    code: 58917,
    name: '武平',
  },
  {
    code: 53610,
    name: '贺兰',
  },
  {
    code: 53917,
    name: '庄浪',
  },
  {
    code: 53949,
    name: '澄城',
  },
  {
    code: 56021,
    name: '曲麻莱',
  },
  {
    code: 57278,
    name: '襄阳',
  },
  {
    code: 53997,
    name: '延津县',
  },
  {
    code: 56987,
    name: '金平',
  },
  {
    code: 58008,
    name: '宁陵',
  },
  {
    code: 57514,
    name: '璧山',
  },
  {
    code: 57772,
    name: '湘乡',
  },
  {
    code: 57063,
    name: '渑池',
  },
  {
    code: 54710,
    name: '阜城',
  },
  {
    code: 57913,
    name: '龙里',
  },
  {
    code: 55593,
    name: '墨竹贡卡',
  },
  {
    code: 54408,
    name: '涿鹿',
  },
  {
    code: 57558,
    name: '张家界',
  },
  {
    code: 58652,
    name: '仙居',
  },
  {
    code: 50949,
    name: '前郭',
  },
  {
    code: 57752,
    name: '溆浦',
  },
  {
    code: 55234,
    name: '革吉',
  },
  {
    code: 55686,
    name: '洛扎',
  },
  {
    code: 53792,
    name: '临城',
  },
  {
    code: 59085,
    name: '曲江',
  },
  {
    code: 51353,
    name: '莫索湾',
  },
  {
    code: 58921,
    name: '永安',
  },
  {
    code: 53845,
    name: '延安',
  },
  {
    code: 50950,
    name: '肇州',
  },
  {
    code: 58416,
    name: '怀宁',
  },
  {
    code: 54815,
    name: '东阿',
  },
  {
    code: 57589,
    name: '通城',
  },
  {
    code: 57411,
    name: '南充',
  },
  {
    code: 51829,
    name: '洛浦',
  },
  {
    code: 54453,
    name: '葫芦岛',
  },
  {
    code: 56144,
    name: '德格',
  },
  {
    code: 57140,
    name: '柞水',
  },
  {
    code: 57175,
    name: '镇平',
  },
  {
    code: 57039,
    name: '长安',
  },
  {
    code: 54205,
    name: '正兰旗',
  },
  {
    code: 53704,
    name: '中卫',
  },
  {
    code: 56989,
    name: '河口县',
  },
  {
    code: 58745,
    name: '庆元',
  },
  {
    code: 57088,
    name: '禹州',
  },
  {
    code: 53992,
    name: '浚县',
  },
  {
    code: 57281,
    name: '泌阳县',
  },
  {
    code: 56790,
    name: '富源',
  },
  {
    code: 57014,
    name: '麦积',
  },
  {
    code: 54323,
    name: '北票',
  },
  {
    code: 58531,
    name: '黄山市',
  },
  {
    code: 56595,
    name: '镇雄',
  },
  {
    code: 56223,
    name: '洛隆',
  },
  {
    code: 56251,
    name: '新龙',
  },
  {
    code: 57508,
    name: '泸县',
  },
  {
    code: 57669,
    name: '安化',
  },
  {
    code: 57872,
    name: '衡阳市',
  },
  {
    code: 52657,
    name: '祁连',
  },
  {
    code: 59152,
    name: '新竹',
  },
  {
    code: 59473,
    name: '鹤山',
  },
  {
    code: 57827,
    name: '都匀',
  },
  {
    code: 50425,
    name: '额尔古纳',
  },
  {
    code: 58537,
    name: '开化',
  },
  {
    code: 53705,
    name: '中宁',
  },
  {
    code: 51438,
    name: '特克斯',
  },
  {
    code: 56180,
    name: '茂县',
  },
  {
    code: 59242,
    name: '来宾',
  },
  {
    code: 57674,
    name: '益阳',
  },
  {
    code: 59241,
    name: '象州',
  },
  {
    code: 57191,
    name: '通许',
  },
  {
    code: 54738,
    name: '广饶',
  },
  {
    code: 57503,
    name: '内江',
  },
  {
    code: 53959,
    name: '运城',
  },
  {
    code: 58369,
    name: '南汇',
  },
  {
    code: 57824,
    name: '贵定',
  },
  {
    code: 57232,
    name: '石泉',
  },
  {
    code: 51777,
    name: '若羌',
  },
  {
    code: 53780,
    name: '寿阳',
  },
  {
    code: 56785,
    name: '嵩明',
  },
  {
    code: 56158,
    name: '炉霍',
  },
  {
    code: 51931,
    name: '于田',
  },
  {
    code: 54316,
    name: '八里罕',
  },
  {
    code: 58821,
    name: '将乐',
  },
  {
    code: 54347,
    name: '辽阳',
  },
  {
    code: 54727,
    name: '章丘',
  },
  {
    code: 58550,
    name: '诸暨',
  },
  {
    code: 56296,
    name: '金堂',
  },
  {
    code: 51430,
    name: '察布查尔',
  },
  {
    code: 57292,
    name: '平舆县',
  },
  {
    code: 59851,
    name: '定安',
  },
  {
    code: 54908,
    name: '东明',
  },
  {
    code: 59429,
    name: '上思',
  },
  {
    code: 58321,
    name: '合肥',
  },
  {
    code: 56079,
    name: '若尔盖',
  },
  {
    code: 56312,
    name: '林芝',
  },
  {
    code: 58735,
    name: '松溪',
  },
  {
    code: 59647,
    name: '涠洲',
  },
  {
    code: 52447,
    name: '金塔',
  },
  {
    code: 53806,
    name: '海原',
  },
  {
    code: 57081,
    name: '荥阳市',
  },
  {
    code: 57171,
    name: '平顶山',
  },
  {
    code: 54080,
    name: '五常',
  },
  {
    code: 56664,
    name: '华坪',
  },
  {
    code: 59021,
    name: '凤山',
  },
  {
    code: 51636,
    name: '新和',
  },
  {
    code: 54925,
    name: '平邑',
  },
  {
    code: 57197,
    name: '汝南县',
  },
  {
    code: 53884,
    name: '襄垣',
  },
  {
    code: 54172,
    name: '吉林',
  },
  {
    code: 54616,
    name: '沧州',
  },
  {
    code: 54848,
    name: '诸城',
  },
  {
    code: 51359,
    name: '玛纳斯',
  },
  {
    code: 52797,
    name: '景泰',
  },
  {
    code: 56444,
    name: '德钦',
  },
  {
    code: 51802,
    name: '英吉沙',
  },
  {
    code: 58719,
    name: '黎川',
  },
  {
    code: 58602,
    name: '安义',
  },
  {
    code: 57734,
    name: '石阡',
  },
  {
    code: 56434,
    name: '察隅',
  },
  {
    code: 59064,
    name: '钟山',
  },
  {
    code: 57042,
    name: '富平',
  },
  {
    code: 59664,
    name: '电白',
  },
  {
    code: 54472,
    name: '海城',
  },
  {
    code: 57308,
    name: '盐亭',
  },
  {
    code: 57011,
    name: '清水',
  },
  {
    code: 58654,
    name: '缙云',
  },
  {
    code: 57111,
    name: '两当',
  },
  {
    code: 58158,
    name: '大丰',
  },
  {
    code: 57426,
    name: '梁平',
  },
  {
    code: 57988,
    name: '乐昌',
  },
  {
    code: 57466,
    name: '枝江',
  },
  {
    code: 54927,
    name: '滕州',
  },
  {
    code: 56181,
    name: '崇庆',
  },
  {
    code: 58340,
    name: '溧水',
  },
  {
    code: 58463,
    name: '奉贤',
  },
  {
    code: 57238,
    name: '镇巴',
  },
  {
    code: 59488,
    name: '珠海',
  },
  {
    code: 57314,
    name: '南部',
  },
  {
    code: 59845,
    name: '儋州',
  },
  {
    code: 54505,
    name: '门头沟',
  },
  {
    code: 53754,
    name: '绥德',
  },
  {
    code: 56286,
    name: '龙泉驿',
  },
  {
    code: 56767,
    name: '南华',
  },
  {
    code: 57768,
    name: '新邵',
  },
  {
    code: 57169,
    name: '内乡',
  },
  {
    code: 56962,
    name: '墨江',
  },
  {
    code: 57798,
    name: '安福',
  },
  {
    code: 57886,
    name: '炎陵',
  },
  {
    code: 56474,
    name: '冕宁',
  },
  {
    code: 50442,
    name: '加格达奇',
  },
  {
    code: 53772,
    name: '太原',
  },
  {
    code: 56977,
    name: '江城',
  },
  {
    code: 50136,
    name: '漠河',
  },
  {
    code: 53892,
    name: '邯郸',
  },
  {
    code: 57634,
    name: '务川',
  },
  {
    code: 54195,
    name: '汪清',
  },
  {
    code: 54515,
    name: '廊坊',
  },
  {
    code: 57993,
    name: '赣州',
  },
  {
    code: 56652,
    name: '永胜',
  },
  {
    code: 56257,
    name: '理塘',
  },
  {
    code: 58118,
    name: '蒙城',
  },
  {
    code: 51463,
    name: '乌鲁木齐',
  },
  {
    code: 53817,
    name: '固原',
  },
  {
    code: 57245,
    name: '安康',
  },
  {
    code: 53781,
    name: '沙河',
  },
  {
    code: 56235,
    name: '察雅',
  },
  {
    code: 57584,
    name: '岳阳',
  },
  {
    code: 58706,
    name: '乐安',
  },
  {
    code: 55574,
    name: '谢通门',
  },
  {
    code: 51334,
    name: '精河',
  },
  {
    code: 56839,
    name: '镇康',
  },
  {
    code: 51434,
    name: '伊宁县',
  },
  {
    code: 53083,
    name: '那仁宝力格',
  },
  {
    code: 53769,
    name: '汾阳',
  },
  {
    code: 51633,
    name: '拜城',
  },
  {
    code: 54273,
    name: '桦甸',
  },
  {
    code: 58549,
    name: '金华',
  },
  {
    code: 54510,
    name: '大厂',
  },
  {
    code: 54834,
    name: '临淄',
  },
  {
    code: 59354,
    name: '嘉义',
  },
  {
    code: 53565,
    name: '偏关',
  },
  {
    code: 56280,
    name: '名山',
  },
  {
    code: 56878,
    name: '通海',
  },
  {
    code: 52995,
    name: '安定',
  },
  {
    code: 54618,
    name: '泊头',
  },
  {
    code: 59027,
    name: '巴马',
  },
  {
    code: 59053,
    name: '平乐',
  },
  {
    code: 51238,
    name: '博乐',
  },
  {
    code: 54633,
    name: '新河',
  },
  {
    code: 56764,
    name: '姚安',
  },
  {
    code: 56095,
    name: '宕昌',
  },
  {
    code: 57038,
    name: '兴平',
  },
  {
    code: 58935,
    name: '德化',
  },
  {
    code: 57915,
    name: '乌当',
  },
  {
    code: 53533,
    name: '杭锦旗',
  },
  {
    code: 58847,
    name: '福州',
  },
  {
    code: 53378,
    name: '察哈尔右翼中旗',
  },
  {
    code: 58523,
    name: '黟县',
  },
  {
    code: 57363,
    name: '南漳',
  },
  {
    code: 59656,
    name: '吴川',
  },
  {
    code: 57106,
    name: '略阳',
  },
  {
    code: 53980,
    name: '肥乡',
  },
  {
    code: 53965,
    name: '绛县',
  },
  {
    code: 57912,
    name: '惠水',
  },
  {
    code: 54822,
    name: '邹平',
  },
  {
    code: 58264,
    name: '如东',
  },
  {
    code: 50431,
    name: '根河',
  },
  {
    code: 50647,
    name: '阿荣旗',
  },
  {
    code: 58818,
    name: '宁化',
  },
  {
    code: 53698,
    name: '石家庄',
  },
  {
    code: 56870,
    name: '易门',
  },
  {
    code: 56228,
    name: '八宿',
  },
  {
    code: 57156,
    name: '西峡',
  },
  {
    code: 58544,
    name: '建德',
  },
  {
    code: 58546,
    name: '浦江',
  },
  {
    code: 58238,
    name: '南京',
  },
  {
    code: 58337,
    name: '繁昌',
  },
  {
    code: 53967,
    name: '闻喜',
  },
  {
    code: 57882,
    name: '茶陵',
  },
  {
    code: 50953,
    name: '哈尔滨',
  },
  {
    code: 57362,
    name: '神农架',
  },
  {
    code: 56443,
    name: '乡城',
  },
  {
    code: 57914,
    name: '花溪',
  },
  {
    code: 55298,
    name: '聂荣',
  },
  {
    code: 54266,
    name: '梅河口',
  },
  {
    code: 57846,
    name: '绥宁',
  },
  {
    code: 52515,
    name: '肃北',
  },
  {
    code: 53783,
    name: '昔阳',
  },
  {
    code: 51156,
    name: '和丰',
  },
  {
    code: 57525,
    name: '武隆',
  },
  {
    code: 57006,
    name: '天水',
  },
  {
    code: 51542,
    name: '巴音布鲁克',
  },
  {
    code: 54778,
    name: '荣成',
  },
  {
    code: 59321,
    name: '东山',
  },
  {
    code: 56985,
    name: '蒙自',
  },
  {
    code: 56498,
    name: '筠连',
  },
  {
    code: 59358,
    name: '台南',
  },
  {
    code: 57368,
    name: '远安',
  },
  {
    code: 53068,
    name: '二连浩特',
  },
  {
    code: 54849,
    name: '胶州',
  },
  {
    code: 58207,
    name: '潢川',
  },
  {
    code: 56978,
    name: '绿春',
  },
  {
    code: 57303,
    name: '苍溪',
  },
  {
    code: 59235,
    name: '上林',
  },
  {
    code: 50958,
    name: '阿城',
  },
  {
    code: 58025,
    name: '台儿庄',
  },
  {
    code: 54186,
    name: '敦化',
  },
  {
    code: 58130,
    name: '睢宁',
  },
  {
    code: 56196,
    name: '绵阳',
  },
  {
    code: 51811,
    name: '莎车',
  },
  {
    code: 57602,
    name: '泸州',
  },
  {
    code: 56871,
    name: '晋宁',
  },
  {
    code: 53576,
    name: '山阴',
  },
  {
    code: 59475,
    name: '开平',
  },
  {
    code: 52679,
    name: '武威',
  },
  {
    code: 58122,
    name: '宿州',
  },
  {
    code: 53923,
    name: '西峰',
  },
  {
    code: 57086,
    name: '新郑市',
  },
  {
    code: 57957,
    name: '桂林',
  },
  {
    code: 54336,
    name: '台安',
  },
  {
    code: 53368,
    name: '武川',
  },
  {
    code: 56849,
    name: '永德',
  },
  {
    code: 56548,
    name: '维西',
  },
  {
    code: 57761,
    name: '新化',
  },
  {
    code: 59125,
    name: '平和',
  },
  {
    code: 53336,
    name: '乌拉特中旗',
  },
  {
    code: 59131,
    name: '南安',
  },
  {
    code: 58530,
    name: '歙县',
  },
  {
    code: 53927,
    name: '华亭',
  },
  {
    code: 53768,
    name: '孝义',
  },
  {
    code: 54363,
    name: '通化',
  },
  {
    code: 53547,
    name: '乌审召',
  },
  {
    code: 57475,
    name: '潜江',
  },
  {
    code: 59492,
    name: '惠东',
  },
  {
    code: 58203,
    name: '阜阳',
  },
  {
    code: 54628,
    name: '海兴',
  },
  {
    code: 58336,
    name: '马鞍山',
  },
  {
    code: 58329,
    name: '无为',
  },
  {
    code: 56096,
    name: '武都',
  },
  {
    code: 59997,
    name: '南沙',
  },
  {
    code: 56373,
    name: '荥经县',
  },
  {
    code: 53590,
    name: '广灵',
  },
  {
    code: 59047,
    name: '柳江',
  },
  {
    code: 51810,
    name: '麦盖提',
  },
  {
    code: 57608,
    name: '叙永',
  },
  {
    code: 58568,
    name: '三门',
  },
  {
    code: 57718,
    name: '息烽',
  },
  {
    code: 54613,
    name: '大城',
  },
  {
    code: 54223,
    name: '奈曼旗',
  },
  {
    code: 53480,
    name: '集宁',
  },
  {
    code: 57922,
    name: '独山',
  },
  {
    code: 51628,
    name: '阿克苏',
  },
  {
    code: 53782,
    name: '阳泉',
  },
  {
    code: 58938,
    name: '秀屿港',
  },
  {
    code: 54910,
    name: '梁山',
  },
  {
    code: 59224,
    name: '田东',
  },
  {
    code: 58660,
    name: '临海',
  },
  {
    code: 58724,
    name: '光泽',
  },
  {
    code: 58555,
    name: '新昌',
  },
  {
    code: 56128,
    name: '类乌齐',
  },
  {
    code: 59132,
    name: '泉州',
  },
  {
    code: 58742,
    name: '云和',
  },
  {
    code: 58147,
    name: '金湖',
  },
  {
    code: 58627,
    name: '鹰潭',
  },
  {
    code: 53195,
    name: '苏尼特左旗',
  },
  {
    code: 57489,
    name: '蔡甸',
  },
  {
    code: 58714,
    name: '宜黄',
  },
  {
    code: 53889,
    name: '林州市',
  },
  {
    code: 57274,
    name: '邓州',
  },
  {
    code: 57345,
    name: '巫溪',
  },
  {
    code: 58520,
    name: '祁门',
  },
  {
    code: 53756,
    name: '吴堡',
  },
  {
    code: 58822,
    name: '建宁',
  },
  {
    code: 54636,
    name: '雄县',
  },
  {
    code: 58614,
    name: '进贤',
  },
  {
    code: 57123,
    name: '杨凌',
  },
  {
    code: 54725,
    name: '惠民',
  },
  {
    code: 58941,
    name: '长乐',
  },
  {
    code: 55542,
    name: '仲巴',
  },
  {
    code: 594760,
    name: '江门',
  },
  {
    code: 56684,
    name: '会泽',
  },
  {
    code: 56289,
    name: '彭山',
  },
  {
    code: 54540,
    name: '昌黎',
  },
  {
    code: 54707,
    name: '故城',
  },
  {
    code: 58459,
    name: '萧山',
  },
  {
    code: 57909,
    name: '册亨',
  },
  {
    code: 57554,
    name: '桑植',
  },
  {
    code: 54098,
    name: '宁安',
  },
  {
    code: 50548,
    name: '小二沟',
  },
  {
    code: 57293,
    name: '新蔡县',
  },
  {
    code: 55690,
    name: '错那',
  },
  {
    code: 57060,
    name: '夏县',
  },
  {
    code: 50749,
    name: '林甸',
  },
  {
    code: 57635,
    name: '秀山',
  },
  {
    code: 54142,
    name: '双辽',
  },
  {
    code: 52424,
    name: '瓜州',
  },
  {
    code: 53484,
    name: '丰镇',
  },
  {
    code: 53577,
    name: '宁武',
  },
  {
    code: 51886,
    name: '茫崖',
  },
  {
    code: 54430,
    name: '承德县',
  },
  {
    code: 592780,
    name: '肇庆',
  },
  {
    code: 56994,
    name: '文山',
  },
  {
    code: 57818,
    name: '长顺',
  },
  {
    code: 58446,
    name: '安吉',
  },
  {
    code: 52998,
    name: '渭源',
  },
  {
    code: 56986,
    name: '屏边',
  },
  {
    code: 56772,
    name: '富民',
  },
  {
    code: 58223,
    name: '明光',
  },
  {
    code: 56746,
    name: '永平',
  },
  {
    code: 57417,
    name: '武胜',
  },
  {
    code: 57883,
    name: '宁冈',
  },
  {
    code: 53289,
    name: '镶黄旗',
  },
  {
    code: 59075,
    name: '阳山',
  },
  {
    code: 54626,
    name: '肃宁',
  },
  {
    code: 56946,
    name: '耿马',
  },
  {
    code: 58154,
    name: '盐城',
  },
  {
    code: 57585,
    name: '临湘',
  },
  {
    code: 57208,
    name: '剑阁',
  },
  {
    code: 56958,
    name: '勐海',
  },
  {
    code: 51629,
    name: '温宿',
  },
  {
    code: 56279,
    name: '芦山',
  },
  {
    code: 58429,
    name: '铜陵',
  },
  {
    code: 57545,
    name: '来凤',
  },
  {
    code: 57326,
    name: '宣汉',
  },
  {
    code: 59431,
    name: '南宁',
  },
  {
    code: 57425,
    name: '垫江',
  },
  {
    code: 51711,
    name: '阿合奇',
  },
  {
    code: 58334,
    name: '芜湖',
  },
  {
    code: 57499,
    name: '大冶',
  },
  {
    code: 50758,
    name: '明水',
  },
  {
    code: 57057,
    name: '洛南',
  },
  {
    code: 57699,
    name: '上高',
  },
  {
    code: 58377,
    name: '太仓',
  },
  {
    code: 57606,
    name: '桐梓',
  },
  {
    code: 58247,
    name: '扬中',
  },
  {
    code: 53488,
    name: '大同县',
  },
  {
    code: 53966,
    name: '浮山',
  },
  {
    code: 53574,
    name: '平鲁',
  },
  {
    code: 57020,
    name: '陈仓',
  },
  {
    code: 58911,
    name: '长汀',
  },
  {
    code: 52972,
    name: '循化',
  },
  {
    code: 53991,
    name: '汤阴县',
  },
  {
    code: 57948,
    name: '融水',
  },
  {
    code: 54237,
    name: '阜新',
  },
  {
    code: 55178,
    name: '双湖',
  },
  {
    code: 56996,
    name: '麻栗坡',
  },
  {
    code: 59004,
    name: '西林',
  },
  {
    code: 57688,
    name: '浏阳',
  },
  {
    code: 56172,
    name: '马尔康',
  },
  {
    code: 58760,
    name: '洞头',
  },
  {
    code: 57633,
    name: '酉阳',
  },
  {
    code: 57887,
    name: '永兴',
  },
  {
    code: 58905,
    name: '于都',
  },
  {
    code: 59280,
    name: '清远',
  },
  {
    code: 57583,
    name: '嘉鱼',
  },
  {
    code: 58442,
    name: '郎溪',
  },
  {
    code: 57186,
    name: '漯河市',
  },
  {
    code: 58731,
    name: '浦城',
  },
  {
    code: 58237,
    name: '浦口',
  },
  {
    code: 57511,
    name: '北碚',
  },
  {
    code: 56016,
    name: '治多',
  },
  {
    code: 54502,
    name: '涿州',
  },
  {
    code: 57083,
    name: '郑州',
  },
  {
    code: 57396,
    name: '新县',
  },
  {
    code: 54818,
    name: '平阴',
  },
  {
    code: 58509,
    name: '永修',
  },
  {
    code: 56284,
    name: '邛崃',
  },
  {
    code: 56202,
    name: '嘉黎',
  },
  {
    code: 50968,
    name: '尚志',
  },
  {
    code: 57481,
    name: '应城',
  },
  {
    code: 57766,
    name: '邵阳市',
  },
  {
    code: 57574,
    name: '南县',
  },
  {
    code: 57192,
    name: '淮阳县',
  },
  {
    code: 57889,
    name: '桂东',
  },
  {
    code: 57494,
    name: '武汉',
  },
  {
    code: 57657,
    name: '泸溪',
  },
  {
    code: 50877,
    name: '依兰',
  },
  {
    code: 53578,
    name: '朔州',
  },
  {
    code: 52533,
    name: '酒泉',
  },
  {
    code: 56387,
    name: '峨边',
  },
  {
    code: 58220,
    name: '长丰',
  },
  {
    code: 59471,
    name: '云浮',
  },
  {
    code: 54844,
    name: '安丘',
  },
  {
    code: 59324,
    name: '南澳',
  },
  {
    code: 54260,
    name: '辽源',
  },
  {
    code: 57698,
    name: '万载',
  },
  {
    code: 52943,
    name: '兴海',
  },
  {
    code: 57971,
    name: '新田',
  },
  {
    code: 50983,
    name: '虎林',
  },
  {
    code: 57462,
    name: '三峡',
  },
  {
    code: 57760,
    name: '冷水江',
  },
  {
    code: 57973,
    name: '桂阳',
  },
  {
    code: 57491,
    name: '黄陂',
  },
  {
    code: 53972,
    name: '沁阳市',
  },
  {
    code: 58629,
    name: '铅山',
  },
  {
    code: null,
    name: '长沙县',
  },
  {
    code: 56298,
    name: '资阳',
  },
  {
    code: 59209,
    name: '那坡',
  },
  {
    code: 58926,
    name: '漳平',
  },
  {
    code: 53596,
    name: '顺平',
  },
  {
    code: 53725,
    name: '定边',
  },
  {
    code: 53983,
    name: '封丘县',
  },
  {
    code: 58934,
    name: '永春',
  },
  {
    code: 54331,
    name: '北镇',
  },
  {
    code: 53615,
    name: '陶乐',
  },
  {
    code: 53564,
    name: '河曲',
  },
  {
    code: 57295,
    name: '正阳县',
  },
  {
    code: 50750,
    name: '依安',
  },
  {
    code: 57233,
    name: '汉阴',
  },
  {
    code: 59023,
    name: '河池',
  },
  {
    code: 57881,
    name: '安仁',
  },
  {
    code: 56752,
    name: '宾川',
  },
  {
    code: 58750,
    name: '文成',
  },
  {
    code: 53491,
    name: '怀安',
  },
  {
    code: 54507,
    name: '易县',
  },
  {
    code: 56378,
    name: '石棉',
  },
  {
    code: 58362,
    name: '宝山',
  },
  {
    code: 54164,
    name: '伊通',
  },
  {
    code: 56952,
    name: '景谷',
  },
  {
    code: 54026,
    name: '扎鲁特旗',
  },
  {
    code: 53748,
    name: '子长',
  },
  {
    code: 57586,
    name: '崇阳',
  },
  {
    code: 54569,
    name: '普兰店',
  },
  {
    code: 54165,
    name: '双阳',
  },
  {
    code: 54276,
    name: '靖宇',
  },
  {
    code: 58834,
    name: '南平',
  },
  {
    code: 57647,
    name: '松桃',
  },
  {
    code: 59088,
    name: '英德',
  },
  {
    code: 57777,
    name: '衡山',
  },
  {
    code: 57762,
    name: '涟源',
  },
  {
    code: 51707,
    name: '伽师',
  },
  {
    code: 56950,
    name: '双江',
  },
  {
    code: 53950,
    name: '合阳',
  },
  {
    code: 57590,
    name: '咸宁',
  },
  {
    code: 50727,
    name: '阿尔山',
  },
  {
    code: 54921,
    name: '嘉祥',
  },
  {
    code: 56748,
    name: '保山',
  },
  {
    code: 58205,
    name: '淮滨',
  },
  {
    code: 56091,
    name: '漳县',
  },
  {
    code: 53490,
    name: '天镇',
  },
  {
    code: 57476,
    name: '荆州',
  },
  {
    code: 56278,
    name: '天全',
  },
  {
    code: 57969,
    name: '江永',
  },
  {
    code: 56281,
    name: '蒲江',
  },
  {
    code: 51663,
    name: '博湖',
  },
  {
    code: 57723,
    name: '凤冈',
  },
  {
    code: 56183,
    name: '汶川',
  },
  {
    code: 57066,
    name: '洛宁县',
  },
  {
    code: 53995,
    name: '滑县',
  },
  {
    code: 51087,
    name: '富蕴',
  },
  {
    code: 58126,
    name: '泗县',
  },
  {
    code: 57002,
    name: '秦安',
  },
  {
    code: 57962,
    name: '双牌',
  },
  {
    code: 53646,
    name: '榆林',
  },
  {
    code: 54829,
    name: '周村',
  },
  {
    code: 54474,
    name: '盖州',
  },
  {
    code: 56178,
    name: '小金',
  },
  {
    code: 59129,
    name: '漳浦',
  },
  {
    code: 52980,
    name: '永靖',
  },
  {
    code: 57876,
    name: '耒阳',
  },
  {
    code: 59314,
    name: '普宁',
  },
  {
    code: 58448,
    name: '临安',
  },
  {
    code: 54538,
    name: '曹妃甸',
  },
  {
    code: 58472,
    name: '嵊泗',
  },
  {
    code: 54640,
    name: '鸡泽',
  },
  {
    code: 58114,
    name: '涡阳',
  },
  {
    code: 56227,
    name: '波密',
  },
  {
    code: 58456,
    name: '桐乡',
  },
  {
    code: 58848,
    name: '连江',
  },
  {
    code: 55279,
    name: '班戈',
  },
  {
    code: 59758,
    name: '海口',
  },
  {
    code: 58250,
    name: '姜堰',
  },
  {
    code: 57743,
    name: '麻阳',
  },
  {
    code: 52876,
    name: '民和',
  },
  {
    code: 58035,
    name: '新沂',
  },
  {
    code: 58748,
    name: '福安',
  },
  {
    code: 53898,
    name: '安阳市',
  },
  {
    code: 59477,
    name: '恩平',
  },
  {
    code: 57738,
    name: '镇远',
  },
  {
    code: 53785,
    name: '柏乡',
  },
  {
    code: 53357,
    name: '固阳',
  },
  {
    code: 55694,
    name: '措美',
  },
  {
    code: 56969,
    name: '勐腊',
  },
  {
    code: 52881,
    name: '天祝',
  },
  {
    code: 54493,
    name: '宽甸',
  },
  {
    code: 54096,
    name: '绥芬河',
  },
  {
    code: 58806,
    name: '宁都',
  },
  {
    code: 58457,
    name: '杭州',
  },
  {
    code: 58819,
    name: '清流',
  },
  {
    code: 52643,
    name: '肃南',
  },
  {
    code: 56975,
    name: '红河',
  },
  {
    code: 54837,
    name: '昌乐',
  },
  {
    code: 59001,
    name: '隆林',
  },
  {
    code: 54945,
    name: '日照',
  },
  {
    code: 54245,
    name: '法库',
  },
  {
    code: 51377,
    name: '阜康',
  },
  {
    code: 57124,
    name: '留坝',
  },
  {
    code: 58547,
    name: '龙游',
  },
  {
    code: 56543,
    name: '香格里拉',
  },
  {
    code: 53913,
    name: '彭阳',
  },
  {
    code: 57758,
    name: '洞口',
  },
  {
    code: 55656,
    name: '珠峰大本营',
  },
  {
    code: 59456,
    name: '信宜',
  },
  {
    code: 59109,
    name: '兴宁',
  },
  {
    code: 54454,
    name: '绥中',
  },
  {
    code: 54901,
    name: '南乐县',
  },
  {
    code: 57464,
    name: '长阳',
  },
  {
    code: 57085,
    name: '新密市',
  },
  {
    code: 57776,
    name: '南岳',
  },
  {
    code: 57213,
    name: '南郑',
  },
  {
    code: 54805,
    name: '冠县',
  },
  {
    code: 57899,
    name: '泰和',
  },
  {
    code: 54094,
    name: '牡丹江',
  },
  {
    code: 54371,
    name: '白山',
  },
  {
    code: 58235,
    name: '六合',
  },
  {
    code: 56646,
    name: '剑川',
  },
  {
    code: 51709,
    name: '喀什',
  },
  {
    code: 57194,
    name: '上蔡县',
  },
  {
    code: 57045,
    name: '渭南',
  },
  {
    code: 57398,
    name: '红安',
  },
  {
    code: 53797,
    name: '内邱',
  },
  {
    code: 52546,
    name: '高台',
  },
  {
    code: 56033,
    name: '玛多',
  },
  {
    code: 57408,
    name: '安岳',
  },
  {
    code: 51804,
    name: '塔什库尔干',
  },
  {
    code: 53487,
    name: '大同',
  },
  {
    code: 54534,
    name: '唐山',
  },
  {
    code: 53723,
    name: '盐池',
  },
  {
    code: 54423,
    name: '承德',
  },
  {
    code: 57509,
    name: '万盛',
  },
  {
    code: 56307,
    name: '加查',
  },
  {
    code: 57996,
    name: '南雄',
  },
  {
    code: 59435,
    name: '邕宁',
  },
  {
    code: 56137,
    name: '昌都',
  },
  {
    code: 57625,
    name: '正安',
  },
  {
    code: 54063,
    name: '扶余',
  },
  {
    code: 54132,
    name: '青龙山',
  },
  {
    code: 58349,
    name: '苏州',
  },
  {
    code: 59446,
    name: '灵山',
  },
  {
    code: 53691,
    name: '正定',
  },
  {
    code: 56489,
    name: '永善',
  },
  {
    code: 50971,
    name: '七台河',
  },
  {
    code: 58543,
    name: '淳安',
  },
  {
    code: 58047,
    name: '灌云',
  },
  {
    code: 51639,
    name: '沙雅',
  },
  {
    code: 54436,
    name: '青龙',
  },
  {
    code: 53673,
    name: '原平',
  },
  {
    code: 56671,
    name: '会理',
  },
  {
    code: 59093,
    name: '定南',
  },
  {
    code: 58455,
    name: '海宁',
  },
  {
    code: 57821,
    name: '福泉',
  },
  {
    code: 58453,
    name: '绍兴',
  },
  {
    code: 54517,
    name: '天津',
  },
  {
    code: 58210,
    name: '颍上',
  },
  {
    code: 58021,
    name: '薛城',
  },
  {
    code: 56944,
    name: '沧源',
  },
  {
    code: 56742,
    name: '云龙',
  },
  {
    code: 58609,
    name: '丰城',
  },
  {
    code: 53776,
    name: '晋中',
  },
  {
    code: 53464,
    name: '土默特左旗',
  },
  {
    code: 57605,
    name: '古蔺',
  },
  {
    code: 54226,
    name: '宝过图',
  },
  {
    code: 58365,
    name: '嘉定',
  },
  {
    code: 57744,
    name: '新晃',
  },
  {
    code: 54806,
    name: '聊城',
  },
  {
    code: 54755,
    name: '招远',
  },
  {
    code: 57808,
    name: '普定',
  },
  {
    code: 59107,
    name: '龙川',
  },
  {
    code: 58659,
    name: '温州',
  },
  {
    code: 57307,
    name: '三台',
  },
  {
    code: 57707,
    name: '毕节',
  },
  {
    code: 57966,
    name: '宁远',
  },
  {
    code: 59451,
    name: '北流',
  },
  {
    code: 59298,
    name: '惠州',
  },
  {
    code: 58626,
    name: '贵溪',
  },
  {
    code: 58929,
    name: '安溪',
  },
  {
    code: 56843,
    name: '昌宁',
  },
  {
    code: 52737,
    name: '德令哈',
  },
  {
    code: 54836,
    name: '沂源',
  },
  {
    code: 54049,
    name: '长岭',
  },
  {
    code: 59441,
    name: '横县',
  },
  {
    code: 57655,
    name: '沅陵',
  },
  {
    code: 52203,
    name: '哈密',
  },
  {
    code: 51708,
    name: '阿克陶',
  },
  {
    code: 54702,
    name: '衡水',
  },
  {
    code: 58131,
    name: '宿迁',
  },
  {
    code: 59854,
    name: '屯昌',
  },
  {
    code: 56106,
    name: '索县',
  },
  {
    code: 53767,
    name: '中阳',
  },
  {
    code: 55666,
    name: '定结',
  },
  {
    code: 53998,
    name: '长垣县',
  },
  {
    code: 57405,
    name: '遂宁',
  },
  {
    code: 50962,
    name: '木兰',
  },
  {
    code: 58725,
    name: '邵武',
  },
  {
    code: 58104,
    name: '沈丘县',
  },
  {
    code: 54706,
    name: '清河',
  },
  {
    code: 50936,
    name: '白城',
  },
  {
    code: 57866,
    name: '永州',
  },
  {
    code: 59269,
    name: '德庆',
  },
  {
    code: 59278,
    name: '高要',
  },
  {
    code: 53852,
    name: '永和',
  },
  {
    code: 58357,
    name: '苏州',
  },
  {
    code: 54236,
    name: '彰武',
  },
  {
    code: 57544,
    name: '龙山',
  },
  {
    code: 56792,
    name: '普安',
  },
  {
    code: 50880,
    name: '集贤',
  },
  {
    code: 56745,
    name: '漾濞',
  },
  {
    code: 57082,
    name: '登封市',
  },
  {
    code: 57388,
    name: '安陆',
  },
  {
    code: 57717,
    name: '播州',
  },
  {
    code: 57031,
    name: '淳化',
  },
  {
    code: 53619,
    name: '灵武',
  },
  {
    code: 53687,
    name: '平定',
  },
  {
    code: 57385,
    name: '广水',
  },
  {
    code: 57581,
    name: '洪湖',
  },
  {
    code: 53478,
    name: '右玉',
  },
  {
    code: 59096,
    name: '连平',
  },
  {
    code: 57065,
    name: '宜阳县',
  },
  {
    code: 57954,
    name: '临桂',
  },
  {
    code: 92024,
    name: '吉隆镇',
  },
  {
    code: 56043,
    name: '玛沁',
  },
  {
    code: 54342,
    name: '沈阳',
  },
  {
    code: 57911,
    name: '白云',
  },
  {
    code: 52602,
    name: '冷湖',
  },
  {
    code: 57185,
    name: '舞阳县',
  },
  {
    code: 57679,
    name: '长沙',
  },
  {
    code: 57231,
    name: '紫阳',
  },
  {
    code: 57486,
    name: '汉川',
  },
  {
    code: 59502,
    name: '陆丰',
  },
  {
    code: 57195,
    name: '周口',
  },
  {
    code: 55594,
    name: '堆龙德庆',
  },
  {
    code: 56951,
    name: '临沧',
  },
  {
    code: 59945,
    name: '保亭',
  },
  {
    code: 53666,
    name: '静乐',
  },
  {
    code: 58016,
    name: '萧县',
  },
  {
    code: 58566,
    name: '象山',
  },
  {
    code: 57048,
    name: '咸阳',
  },
  {
    code: 53986,
    name: '新乡市',
  },
  {
    code: 50987,
    name: '鸡东',
  },
  {
    code: 51435,
    name: '巩留',
  },
  {
    code: 58701,
    name: '新干',
  },
  {
    code: 56774,
    name: '武定',
  },
  {
    code: 56976,
    name: '元阳',
  },
  {
    code: 51765,
    name: '铁干里克',
  },
  {
    code: 54208,
    name: '多伦',
  },
  {
    code: 53505,
    name: '孪井滩',
  },
  {
    code: 57956,
    name: '灵川',
  },
  {
    code: 51076,
    name: '阿勒泰',
  },
  {
    code: 56578,
    name: '宁南',
  },
  {
    code: 55294,
    name: '安多',
  },
  {
    code: 59500,
    name: '海丰',
  },
  {
    code: 52267,
    name: '额济纳旗',
  },
  {
    code: 59954,
    name: '陵水',
  },
  {
    code: 57070,
    name: '新安县',
  },
  {
    code: 54404,
    name: '赤城',
  },
  {
    code: 56247,
    name: '巴塘',
  },
  {
    code: 54645,
    name: '大港',
  },
  {
    code: 58449,
    name: '富阳',
  },
  {
    code: 58435,
    name: '旌德',
  },
  {
    code: 54627,
    name: '盐山',
  },
  {
    code: 56768,
    name: '楚雄',
  },
  {
    code: 50939,
    name: '洮南',
  },
  {
    code: 58705,
    name: '永丰',
  },
  {
    code: 53681,
    name: '五台县豆村',
  },
  {
    code: 58500,
    name: '阳新',
  },
  {
    code: 57091,
    name: '开封市',
  },
  {
    code: 59663,
    name: '阳江',
  },
  {
    code: 50985,
    name: '密山',
  },
  {
    code: 53985,
    name: '辉县市',
  },
  {
    code: 50978,
    name: '鸡西',
  },
  {
    code: 57662,
    name: '常德',
  },
  {
    code: 56168,
    name: '金川',
  },
  {
    code: 59211,
    name: '百色',
  },
  {
    code: 54513,
    name: '石景山',
  },
  {
    code: 57989,
    name: '仁化',
  },
  {
    code: 54161,
    name: '长春',
  },
  {
    code: 57520,
    name: '长寿',
  },
  {
    code: 57056,
    name: '灵宝',
  },
  {
    code: 53324,
    name: '乌拉特后旗',
  },
  {
    code: 54470,
    name: '盘锦',
  },
  {
    code: 50772,
    name: '五营',
  },
  {
    code: 54522,
    name: '玉田',
  },
  {
    code: 53659,
    name: '临县',
  },
  {
    code: 57505,
    name: '荣昌',
  },
  {
    code: 58631,
    name: '常山',
  },
  {
    code: 53475,
    name: '凉城',
  },
  {
    code: 54012,
    name: '西乌珠穆沁旗',
  },
  {
    code: 53575,
    name: '神池',
  },
  {
    code: 58749,
    name: '柘荣',
  },
  {
    code: 57012,
    name: '张家川',
  },
  {
    code: 58020,
    name: '微山',
  },
  {
    code: 54851,
    name: '莱西',
  },
  {
    code: 56067,
    name: '久治',
  },
  {
    code: 56380,
    name: '洪雅',
  },
  {
    code: 54936,
    name: '莒县',
  },
  {
    code: 53469,
    name: '和林格尔',
  },
  {
    code: 54943,
    name: '黄岛区',
  },
  {
    code: 50937,
    name: '科尔沁右翼中旗',
  },
  {
    code: 51826,
    name: '策勒',
  },
  {
    code: 57402,
    name: '蓬溪',
  },
  {
    code: 55590,
    name: '林周',
  },
  {
    code: 59265,
    name: '梧州',
  },
  {
    code: 58418,
    name: '望江',
  },
  {
    code: 58658,
    name: '永嘉',
  },
  {
    code: 56190,
    name: '安县',
  },
  {
    code: 54431,
    name: '通州',
  },
  {
    code: 57991,
    name: '上犹',
  },
  {
    code: 53272,
    name: '苏尼特右旗',
  },
  {
    code: 57414,
    name: '岳池',
  },
  {
    code: 54644,
    name: '孟村',
  },
  {
    code: 53955,
    name: '韩城',
  },
  {
    code: 59094,
    name: '翁源',
  },
  {
    code: 52856,
    name: '共和',
  },
  {
    code: 57972,
    name: '郴州',
  },
  {
    code: 54804,
    name: '大名',
  },
  {
    code: 51329,
    name: '霍城',
  },
  {
    code: 54827,
    name: '泰安',
  },
  {
    code: 56782,
    name: '马龙',
  },
  {
    code: 59304,
    name: '紫金',
  },
  {
    code: 57247,
    name: '岚皋',
  },
  {
    code: 53771,
    name: '文水',
  },
  {
    code: 54244,
    name: '康平',
  },
  {
    code: 57132,
    name: '户县',
  },
  {
    code: 57562,
    name: '石门',
  },
  {
    code: 57537,
    name: '彭水',
  },
  {
    code: 56863,
    name: '安宁',
  },
  {
    code: 57094,
    name: '尉氏',
  },
  {
    code: 58230,
    name: '全椒',
  },
  {
    code: 57722,
    name: '湄潭',
  },
  {
    code: 57947,
    name: '融安',
  },
  {
    code: 57415,
    name: '广安',
  },
  {
    code: 58427,
    name: '池州',
  },
  {
    code: 54614,
    name: '河间',
  },
  {
    code: 57565,
    name: '澧县',
  },
  {
    code: 51469,
    name: '白杨沟',
  },
  {
    code: 57974,
    name: '嘉禾',
  },
  {
    code: 54330,
    name: '凌海',
  },
  {
    code: 54362,
    name: '通化县',
  },
  {
    code: 54429,
    name: '遵化',
  },
  {
    code: 57105,
    name: '康县',
  },
  {
    code: 56136,
    name: '江达',
  },
  {
    code: 56883,
    name: '师宗',
  },
  {
    code: 52652,
    name: '张掖',
  },
  {
    code: 57033,
    name: '泾阳',
  },
  {
    code: 50963,
    name: '通河',
  },
  {
    code: 56294,
    name: '成都',
  },
  {
    code: 57658,
    name: '辰溪',
  },
  {
    code: 53890,
    name: '武安',
  },
  {
    code: 53483,
    name: '兴和',
  },
  {
    code: 54335,
    name: '黑山',
  },
  {
    code: 54324,
    name: '朝阳',
  },
  {
    code: 54857,
    name: '青岛',
  },
  {
    code: 58635,
    name: '广丰',
  },
  {
    code: 59659,
    name: '茂名',
  },
  {
    code: 52661,
    name: '山丹',
  },
  {
    code: 50973,
    name: '勃利',
  },
  {
    code: 57320,
    name: '通江',
  },
  {
    code: 58507,
    name: '武宁',
  },
  {
    code: 57049,
    name: '华县',
  },
  {
    code: 54749,
    name: '莱州',
  },
  {
    code: 58254,
    name: '海安',
  },
  {
    code: 57661,
    name: '桃源',
  },
  {
    code: 58001,
    name: '睢县',
  },
  {
    code: 54398,
    name: '顺义',
  },
  {
    code: 54612,
    name: '文安',
  },
  {
    code: 57349,
    name: '巫山',
  },
  {
    code: 57076,
    name: '偃师市',
  },
  {
    code: 53696,
    name: '定州',
  },
  {
    code: 59264,
    name: '封开',
  },
  {
    code: 57399,
    name: '麻城',
  },
  {
    code: 54744,
    name: '垦利',
  },
  {
    code: 53664,
    name: '兴县',
  },
  {
    code: 57767,
    name: '隆回',
  },
  {
    code: 58034,
    name: '郯城',
  },
  {
    code: 52836,
    name: '都兰',
  },
  {
    code: 54753,
    name: '龙口',
  },
  {
    code: 57483,
    name: '天门',
  },
  {
    code: 54620,
    name: '蠡县',
  },
  {
    code: 59306,
    name: '揭西',
  },
  {
    code: 51855,
    name: '且末',
  },
  {
    code: 52993,
    name: '会宁',
  },
  {
    code: 53978,
    name: '济源',
  },
  {
    code: 58744,
    name: '寿宁',
  },
  {
    code: 57029,
    name: '礼泉',
  },
  {
    code: 54812,
    name: '齐河',
  },
  {
    code: 53543,
    name: '东胜',
  },
  {
    code: 54099,
    name: '东宁',
  },
  {
    code: 54092,
    name: '海林',
  },
  {
    code: 59493,
    name: '深圳',
  },
  {
    code: 55579,
    name: '白朗',
  },
  {
    code: 58143,
    name: '阜宁',
  },
  {
    code: 59453,
    name: '玉林',
  },
  {
    code: 57841,
    name: '靖州',
  },
  {
    code: 53677,
    name: '太原北郊',
  },
  {
    code: 57465,
    name: '宜都',
  },
  {
    code: 55650,
    name: '吉隆',
  },
  {
    code: 58632,
    name: '江山',
  },
  {
    code: 54286,
    name: '和龙',
  },
  {
    code: 51436,
    name: '新源',
  },
  {
    code: 56775,
    name: '禄劝',
  },
  {
    code: 57868,
    name: '祁阳',
  },
  {
    code: 57329,
    name: '开江',
  },
  {
    code: 57025,
    name: '凤翔',
  },
  {
    code: 58215,
    name: '寿县',
  },
  {
    code: 54777,
    name: '文登',
  },
  {
    code: 58839,
    name: '闽清',
  },
  {
    code: 56382,
    name: '夹江',
  },
  {
    code: 59099,
    name: '和平',
  },
  {
    code: 51467,
    name: '巴仑台',
  },
  {
    code: 57640,
    name: '花垣',
  },
  {
    code: 58468,
    name: '余姚',
  },
  {
    code: 54332,
    name: '辽中',
  },
  {
    code: 55248,
    name: '改则',
  },
  {
    code: 52968,
    name: '泽库',
  },
  {
    code: 57306,
    name: '阆中',
  },
  {
    code: 59303,
    name: '五华',
  },
  {
    code: 55598,
    name: '泽当',
  },
  {
    code: 54511,
    name: '北京',
  },
  {
    code: 53348,
    name: '大佘太',
  },
  {
    code: 56485,
    name: '雷波',
  },
  {
    code: 52754,
    name: '刚察',
  },
  {
    code: 56580,
    name: '布拖',
  },
  {
    code: 54252,
    name: '西丰',
  },
  {
    code: 51379,
    name: '奇台',
  },
  {
    code: 54718,
    name: '平原',
  },
  {
    code: 56295,
    name: '简阳',
  },
  {
    code: 53674,
    name: '忻州',
  },
  {
    code: 58450,
    name: '湖州',
  },
  {
    code: 59469,
    name: '阳春',
  },
  {
    code: 54506,
    name: '高碑店',
  },
  {
    code: 59038,
    name: '忻城',
  },
  {
    code: 56285,
    name: '大邑',
  },
  {
    code: 59948,
    name: '三亚',
  },
  {
    code: 58101,
    name: '鹿邑县',
  },
  {
    code: 50353,
    name: '呼玛',
  },
  {
    code: 57519,
    name: '南川',
  },
  {
    code: 57090,
    name: '中牟县',
  },
  {
    code: 57842,
    name: '会同',
  },
  {
    code: 57324,
    name: '平昌',
  },
  {
    code: 58301,
    name: '商城',
  },
  {
    code: 53690,
    name: '阜平',
  },
  {
    code: 53947,
    name: '铜川',
  },
  {
    code: 58634,
    name: '玉山',
  },
  {
    code: 51581,
    name: '鄯善',
  },
  {
    code: 53763,
    name: '太原古交区',
  },
  {
    code: 57137,
    name: '宁陕',
  },
  {
    code: 56840,
    name: '梁河',
  },
  {
    code: 57067,
    name: '卢氏',
  },
  {
    code: 53679,
    name: '太原南郊',
  },
  {
    code: 56490,
    name: '沐川',
  },
  {
    code: 58646,
    name: '丽水',
  },
  {
    code: 59057,
    name: '金秀',
  },
  {
    code: 54766,
    name: '牟平',
  },
  {
    code: 58421,
    name: '青阳',
  },
  {
    code: 54841,
    name: '昌邑',
  },
  {
    code: 57942,
    name: '龙胜',
  },
  {
    code: 59041,
    name: '柳城',
  },
  {
    code: 53990,
    name: '鹤壁',
  },
  {
    code: 56191,
    name: '罗江',
  },
  {
    code: 58608,
    name: '樟树',
  },
  {
    code: 59126,
    name: '漳州',
  },
  {
    code: 59249,
    name: '贵港',
  },
  {
    code: 56046,
    name: '达日',
  },
  {
    code: 56777,
    name: '禄丰',
  },
  {
    code: 58244,
    name: '江都',
  },
  {
    code: 53850,
    name: '延川',
  },
  {
    code: 58454,
    name: '德清',
  },
  {
    code: 54328,
    name: '喀左',
  },
  {
    code: 56391,
    name: '眉山',
  },
  {
    code: 57902,
    name: '兴仁',
  },
  {
    code: 58330,
    name: '含山',
  },
  {
    code: 50673,
    name: '嘉荫',
  },
  {
    code: 59059,
    name: '昭平',
  },
  {
    code: 50834,
    name: '索伦',
  },
  {
    code: 53612,
    name: '吴忠',
  },
  {
    code: 56199,
    name: '中江',
  },
  {
    code: 54475,
    name: '大石桥',
  },
  {
    code: 59127,
    name: '龙海',
  },
  {
    code: 58030,
    name: '苍山',
  },
  {
    code: 58710,
    name: '崇仁',
  },
  {
    code: 56793,
    name: '盘州',
  },
  {
    code: 58127,
    name: '怀远',
  },
  {
    code: 56499,
    name: '珙县',
  },
  {
    code: 58814,
    name: '石城',
  },
  {
    code: 59071,
    name: '连南',
  },
  {
    code: 57036,
    name: '西安',
  },
  {
    code: 57729,
    name: '余庆',
  },
  {
    code: 53585,
    name: '繁峙',
  },
  {
    code: 54923,
    name: '蒙阴',
  },
  {
    code: 58012,
    name: '丰县',
  },
  {
    code: 56873,
    name: '澄江',
  },
  {
    code: 57196,
    name: '项城市',
  },
  {
    code: 57492,
    name: '新洲',
  },
  {
    code: 58519,
    name: '鄱阳',
  },
  {
    code: 54231,
    name: '科尔沁左翼后旗',
  },
  {
    code: 59417,
    name: '龙州',
  },
  {
    code: 54405,
    name: '怀来',
  },
  {
    code: 56074,
    name: '玛曲',
  },
  {
    code: 55597,
    name: '琼结',
  },
  {
    code: 57666,
    name: '桃江',
  },
  {
    code: 58145,
    name: '楚州',
  },
  {
    code: 59051,
    name: '阳朔',
  },
  {
    code: 56395,
    name: '威远',
  },
  {
    code: 52674,
    name: '永昌',
  },
  {
    code: 58625,
    name: '横峰',
  },
  {
    code: 51827,
    name: '墨玉',
  },
  {
    code: 58648,
    name: '景宁',
  },
  {
    code: 56084,
    name: '迭部',
  },
  {
    code: 56029,
    name: '玉树',
  },
  {
    code: 56666,
    name: '攀枝花',
  },
  {
    code: 53513,
    name: '临河',
  },
  {
    code: 58341,
    name: '丹阳',
  },
  {
    code: 53865,
    name: '汾西',
  },
  {
    code: 53660,
    name: '保德',
  },
  {
    code: 57737,
    name: '施秉',
  },
  {
    code: 54318,
    name: '隆化',
  },
  {
    code: 57793,
    name: '宜春',
  },
  {
    code: 53457,
    name: '达拉特旗',
  },
  {
    code: 56654,
    name: '鹤庆',
  },
  {
    code: 57710,
    name: '仁怀',
  },
  {
    code: 57636,
    name: '沿河',
  },
  {
    code: 59162,
    name: '宜兰',
  },
  {
    code: 59487,
    name: '斗门',
  },
  {
    code: 50842,
    name: '杜蒙',
  },
  {
    code: 57895,
    name: '万安',
  },
  {
    code: 59017,
    name: '田林',
  },
  {
    code: 50247,
    name: '呼中',
  },
  {
    code: 54610,
    name: '任丘',
  },
  {
    code: 59133,
    name: '崇武',
  },
  {
    code: 52853,
    name: '海晏',
  },
  {
    code: 50646,
    name: '讷河',
  },
  {
    code: 58352,
    name: '常熟',
  },
  {
    code: 58436,
    name: '宁国',
  },
  {
    code: 51053,
    name: '哈巴河',
  },
  {
    code: 54512,
    name: '固安',
  },
  {
    code: 53384,
    name: '察哈尔右翼后旗',
  },
  {
    code: 56385,
    name: '峨眉山',
  },
  {
    code: 58344,
    name: '句容',
  },
  {
    code: 53594,
    name: '灵丘',
  },
  {
    code: 54503,
    name: '容城',
  },
  {
    code: 57078,
    name: '汝阳县',
  },
  {
    code: 56171,
    name: '阿坝',
  },
  {
    code: 57256,
    name: '十堰',
  },
  {
    code: 58306,
    name: '金寨',
  },
  {
    code: 58845,
    name: '罗源',
  },
  {
    code: 55361,
    name: '尼玛',
  },
  {
    code: 59228,
    name: '平果',
  },
  {
    code: 50527,
    name: '海拉尔',
  },
  {
    code: 57206,
    name: '广元',
  },
  {
    code: 54935,
    name: '沂南',
  },
  {
    code: 58222,
    name: '凤阳',
  },
  {
    code: 53903,
    name: '西吉',
  },
  {
    code: 59106,
    name: '平远',
  },
  {
    code: 54311,
    name: '围场',
  },
  {
    code: 59297,
    name: '博罗',
  },
  {
    code: 58243,
    name: '兴化',
  },
  {
    code: 59454,
    name: '岑溪',
  },
  {
    code: 54349,
    name: '本溪县',
  },
  {
    code: 55670,
    name: '萨迦',
  },
  {
    code: 57936,
    name: '从江',
  },
  {
    code: 59037,
    name: '都安',
  },
  {
    code: 57496,
    name: '鄂州',
  },
  {
    code: 59317,
    name: '惠来',
  },
  {
    code: 59750,
    name: '雷州',
  },
  {
    code: 57079,
    name: '温县',
  },
  {
    code: 53987,
    name: '武陟县',
  },
  {
    code: 59448,
    name: '浦北',
  },
  {
    code: 58462,
    name: '松江',
  },
  {
    code: 58040,
    name: '赣榆',
  },
  {
    code: 54731,
    name: '利津',
  },
  {
    code: 57453,
    name: '夷陵',
  },
  {
    code: 54726,
    name: '乐陵',
  },
  {
    code: 53883,
    name: '任县',
  },
  {
    code: 57994,
    name: '大余',
  },
  {
    code: 53970,
    name: '沁水',
  },
  {
    code: 53937,
    name: '宁县',
  },
  {
    code: 53697,
    name: '藁城',
  },
  {
    code: 57792,
    name: '分宜',
  },
  {
    code: 58843,
    name: '霞浦',
  },
  {
    code: 57741,
    name: '铜仁',
  },
  {
    code: 57642,
    name: '保靖',
  },
  {
    code: 54519,
    name: '永清',
  },
  {
    code: 54533,
    name: '丰南',
  },
  {
    code: 56483,
    name: '绥江',
  },
  {
    code: 56297,
    name: '仁寿',
  },
  {
    code: 50776,
    name: '萝北',
  },
  {
    code: 52532,
    name: '嘉峪关',
  },
  {
    code: 54915,
    name: '济宁',
  },
  {
    code: 57189,
    name: '遂平县',
  },
  {
    code: 59981,
    name: '西沙永兴岛',
  },
  {
    code: 54346,
    name: '本溪',
  },
  {
    code: 57731,
    name: '思南',
  },
  {
    code: 54401,
    name: '张家口',
  },
  {
    code: 58647,
    name: '龙泉',
  },
  {
    code: 58645,
    name: '松阳',
  },
  {
    code: 58428,
    name: '石台',
  },
  {
    code: 53861,
    name: '襄汾',
  },
  {
    code: 57348,
    name: '奉节',
  },
  {
    code: 56585,
    name: '鲁甸',
  },
  {
    code: 56693,
    name: '水城',
  },
  {
    code: 57416,
    name: '邻水',
  },
  {
    code: 58049,
    name: '滨海',
  },
  {
    code: 54520,
    name: '三河',
  },
  {
    code: 56038,
    name: '石渠',
  },
  {
    code: 54917,
    name: '金乡',
  },
  {
    code: 58467,
    name: '慈溪',
  },
  {
    code: 57806,
    name: '安顺',
  },
  {
    code: 55437,
    name: '普兰',
  },
  {
    code: 59843,
    name: '澄迈',
  },
  {
    code: 45005,
    name: '香港',
  },
  {
    code: 56188,
    name: '都江堰',
  },
  {
    code: 59631,
    name: '防城',
  },
  {
    code: 57990,
    name: '崇义',
  },
  {
    code: 59074,
    name: '连山',
  },
  {
    code: 53885,
    name: '壶关',
  },
  {
    code: 58370,
    name: '浦东',
  },
  {
    code: 57516,
    name: '重庆',
  },
  {
    code: 58242,
    name: '仪征',
  },
  {
    code: 56186,
    name: '绵竹',
  },
  {
    code: 54290,
    name: '龙井',
  },
  {
    code: 54846,
    name: '高密',
  },
  {
    code: 53689,
    name: '晋州',
  },
  {
    code: 56374,
    name: '康定',
  },
  {
    code: 56889,
    name: '丘北',
  },
  {
    code: 57811,
    name: '修文',
  },
  {
    code: 55681,
    name: '浪卡子',
  },
  {
    code: 57080,
    name: '巩义市',
  },
  {
    code: 54337,
    name: '锦州',
  },
  {
    code: 57119,
    name: '勉县',
  },
  {
    code: 57840,
    name: '天柱',
  },
  {
    code: 50739,
    name: '龙江',
  },
  {
    code: 57008,
    name: '西和',
  },
  {
    code: 58746,
    name: '泰顺',
  },
  {
    code: 58458,
    name: '海盐',
  },
  {
    code: 58605,
    name: '高安',
  },
  {
    code: 50349,
    name: '新林',
  },
  {
    code: 50618,
    name: '新巴尔虎左旗',
  },
  {
    code: 58246,
    name: '泰州',
  },
  {
    code: 56879,
    name: '华宁',
  },
  {
    code: 56593,
    name: '长宁',
  },
  {
    code: 58824,
    name: '明溪',
  },
  {
    code: 56872,
    name: '太华山',
  },
  {
    code: 50246,
    name: '塔河',
  },
  {
    code: 56886,
    name: '泸西',
  },
  {
    code: 57714,
    name: '金沙',
  },
  {
    code: 56496,
    name: '兴文',
  },
  {
    code: 55493,
    name: '当雄',
  },
  {
    code: 53663,
    name: '五寨',
  },
  {
    code: 58317,
    name: '岳西',
  },
  {
    code: 57789,
    name: '莲花',
  },
  {
    code: 54719,
    name: '南皮',
  },
  {
    code: 55125,
    name: '日土',
  },
  {
    code: 52984,
    name: '临夏',
  },
  {
    code: 50742,
    name: '富裕',
  },
  {
    code: 53897,
    name: '磁县',
  },
  {
    code: 57071,
    name: '孟津县',
  },
  {
    code: 59254,
    name: '桂平',
  },
  {
    code: 56841,
    name: '龙陵',
  },
  {
    code: 52974,
    name: '同仁',
  },
  {
    code: 56093,
    name: '岷县',
  },
  {
    code: 57051,
    name: '三门峡',
  },
  {
    code: 50844,
    name: '泰来',
  },
  {
    code: 50879,
    name: '桦南',
  },
  {
    code: 58524,
    name: '浮梁',
  },
  {
    code: 53777,
    name: '交城',
  },
  {
    code: 50445,
    name: '鄂伦春旗',
  },
  {
    code: 54319,
    name: '平泉',
  },
  {
    code: 53433,
    name: '乌拉特前旗',
  },
  {
    code: 56763,
    name: '元谋',
  },
  {
    code: 56670,
    name: '米易',
  },
  {
    code: 55676,
    name: '康马',
  },
  {
    code: 56342,
    name: '芒康',
  },
  {
    code: 57682,
    name: '平江',
  },
  {
    code: 53790,
    name: '高邑',
  },
  {
    code: 51627,
    name: '乌什',
  },
  {
    code: 58002,
    name: '曹县',
  },
  {
    code: 53875,
    name: '沁源',
  },
  {
    code: 54843,
    name: '潍坊',
  },
  {
    code: 54518,
    name: '霸州',
  },
  {
    code: 53973,
    name: '高平',
  },
  {
    code: 59293,
    name: '河源',
  },
  {
    code: 57623,
    name: '道真',
  },
  {
    code: 57708,
    name: '大方',
  },
  {
    code: 53893,
    name: '曲周',
  },
  {
    code: 55652,
    name: '樟木',
  },
  {
    code: 53678,
    name: '阳曲',
  },
  {
    code: 57927,
    name: '天峨',
  },
  {
    code: 58251,
    name: '东台',
  },
  {
    code: 53891,
    name: '南和',
  },
  {
    code: 59087,
    name: '佛冈',
  },
  {
    code: 59124,
    name: '南靖',
  },
  {
    code: 57409,
    name: '潼南',
  },
  {
    code: 53954,
    name: '稷山',
  },
  {
    code: 54267,
    name: '柳河',
  },
  {
    code: 57317,
    name: '蓬安',
  },
  {
    code: 53593,
    name: '蔚县',
  },
  {
    code: 59227,
    name: '天等',
  },
  {
    code: 56594,
    name: '彝良',
  },
  {
    code: 56182,
    name: '松潘',
  },
  {
    code: 58240,
    name: '天长',
  },
  {
    code: 53602,
    name: '阿拉善左旗',
  },
  {
    code: 59838,
    name: '东方',
  },
  {
    code: 56164,
    name: '壤塘',
  },
  {
    code: 56263,
    name: '丹巴',
  },
  {
    code: 54031,
    name: '高力板',
  },
  {
    code: 54817,
    name: '台前县',
  },
  {
    code: 54072,
    name: '榆树',
  },
  {
    code: 54353,
    name: '新宾',
  },
  {
    code: 57188,
    name: '西平县',
  },
  {
    code: 59849,
    name: '琼中',
  },
  {
    code: 57055,
    name: '华阴',
  },
  {
    code: 59653,
    name: '高州',
  },
  {
    code: 54732,
    name: '河口',
  },
  {
    code: 57251,
    name: '郧西',
  },
  {
    code: 50853,
    name: '绥化',
  },
  {
    code: 58343,
    name: '常州',
  },
  {
    code: 54617,
    name: '献县',
  },
  {
    code: 53791,
    name: '元氏',
  },
  {
    code: 59276,
    name: '四会',
  },
  {
    code: 54293,
    name: '图们',
  },
  {
    code: 56273,
    name: '宝兴',
  },
  {
    code: 59102,
    name: '寻乌',
  },
  {
    code: 57268,
    name: '谷城',
  },
]

/**
 * 地域天气
 * @param stationId number - 地域代码
 */
export const station = async (stationId: number | 0 = 0, refresh = false) => {
  const MODULE = MODULES.WEATHER
  const url = 'https://weather.cma.cn/api/weather/view'

  const res = await ConfigModel.getItem(MODULE)
  if (res) {
    if (res.default_cma_station_id && !stationId)
      stationId = res.default_cma_station_id
  }

  const cacheKey = [MODULE, stationId]
  if (!refresh) {
    const cacheData = await RequestCache.get(cacheKey)
    if (cacheData)
      return cacheData
  }

  try {
    const res = await defHttp.get({
      url,
      params: {
        stationid: stationId,
      },
    })

    if (res.data.data) {
      const { data } = res.data
      if (!stationId || (stationId && parseInt(data.location.id) === stationId))
        return await RequestCache.set(cacheKey, { data: res.data.data }, MODULE, -1)
    }

    return false
  }
  catch (e) {
    return false
  }
}
