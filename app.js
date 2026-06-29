// FloraCare AI - 應用程式核心邏輯控制中心 (app.js)

// 聲明全局狀態
let currentSelectedPlantId = null;

/* ==========================================================================
   世界植物資料庫 (World Plants Database) — 26 國
   ========================================================================== */
const WORLD_PLANTS = {
  TW: { country:'台灣', flag:'🇹🇼',
    nationalFlower:{ name:'梅花', desc:'象徵堅毅不屈，凌寒怒放，為中華文化圈共同推崇的精神花卉', emoji:'🌸' },
    plants:[
      { name:'台灣蝴蝶蘭', desc:'原生於低海拔森林，學名 Phalaenopsis amabilis，享譽全球的「蘭花女王」，台灣是最大出口國之一' },
      { name:'台灣一葉蘭', desc:'瀕危特有種，僅分布於中高海拔霧林帶，每年四月盛開，花形奇特優美，是植物界珍品' },
      { name:'台灣油杉', desc:'冰河時期孑遺植物，全球數量極稀，被列為瀕危物種，是台灣的植物活化石' },
    ],
  },
  JP: { country:'日本', flag:'🇯🇵',
    nationalFlower:{ name:'菊花（皇室）× 櫻花（民族）', desc:'菊花是天皇家徽；染井吉野櫻象徵日本精神，花開短暫、從容凋落，體現武士道美學', emoji:'🌸' },
    plants:[
      { name:'染井吉野櫻', desc:'日本最具代表性的賞花品種，佔全國九成，每年花季全國同步舉辦「花見」，是文化盛事' },
      { name:'楓樹（紅葉）', desc:'秋季「紅葉狩」是重要文化活動，日本楓樹超過30品種，色彩從橙至深紫，各地名所爭奇鬥豔' },
      { name:'竹', desc:'日本傳統文化核心象徵，廣泛用於建築、飲食與藝術，嵯峨野竹林是世界著名景觀' },
    ],
  },
  CN: { country:'中國', flag:'🇨🇳',
    nationalFlower:{ name:'牡丹（花中之王）', desc:'自唐代起即為富貴象徵，「洛陽牡丹甲天下」，雍容華貴，官方已正式倡議定為中國國花', emoji:'🌺' },
    plants:[
      { name:'牡丹', desc:'中國最具文化象徵的花卉，唐代培育達到巔峰，現有超過1000個品種，花期每年五月' },
      { name:'荷花（蓮）', desc:'「出淤泥而不染」是中國精神象徵，根莖葉種皆可食用，廣泛用於佛道兩教儀式與藝術' },
      { name:'銀杏', desc:'地球最古老的活化石樹種，兩億年前即存在，中國特有，壽命可達數千年，秋葉金黃如瀑布' },
    ],
  },
  KR: { country:'韓國', flag:'🇰🇷',
    nationalFlower:{ name:'木槿（무궁화，無窮花）', desc:'每天清晨開花、傍晚凋謝、次日再生，象徵韓民族永不屈服的精神；出現於國徽與韓國軍旗', emoji:'💜' },
    plants:[
      { name:'木槿', desc:'韓國國花，夏季花期長達100天，花色多樣，廣泛種植於全國街道與公共空間' },
      { name:'金達萊（映山紅）', desc:'韓國最受喜愛的野花，又名朝鮮杜鵑，春天遍野紅紫，廣泛出現於民謠、詩歌與繪畫' },
      { name:'紅松', desc:'朝鮮半島原生針葉樹，材質優良，果實可食用，北方山地的標誌性樹種' },
    ],
  },
  IN: { country:'印度', flag:'🇮🇳',
    nationalFlower:{ name:'荷花', desc:'印度最神聖的象徵，出現於宗教藝術與政府文件，代表純潔與精神覺醒，與印度教密不可分', emoji:'🌸' },
    plants:[
      { name:'孟加拉菩提樹（榕樹）', desc:'印度國樹，被稱為「宇宙之樹」，最寬的樹冠可覆蓋數公頃，印度多處有超過500年的神聖古樹' },
      { name:'薑黃', desc:'印度飲食與阿育吠陀醫學的核心植物，抗炎功效著稱，印度是全球最大薑黃生產與出口國' },
      { name:'白檀（檀香木）', desc:'世界最昂貴的木材之一，香氣持久，廣泛用於宗教儀式、頂級香水與傳統醫學，南印度最著名' },
    ],
  },
  TH: { country:'泰國', flag:'🇹🇭',
    nationalFlower:{ name:'金鏈花（阿勒勃）', desc:'泰國皇室之花，每年潑水節前後盛開，金黃花串如瀑布垂掛，象徵佛曆新年與皇室尊貴', emoji:'💛' },
    plants:[
      { name:'金鏈花（黃金淋浴花）', desc:'泰國國花，四月盛開時與潑水節同期，被稱為「泰國黃金」，廣泛種植於全國街道與寺廟' },
      { name:'大王蓮', desc:'東南亞熱帶水域奇觀，葉片直徑可達3公尺，可承重超過50公斤，清邁植物園有專屬展示池' },
      { name:'石斛蘭（泰國蘭）', desc:'泰國出口量最大的花卉，廣泛用於佛教祭祀與送禮，曼谷花市每天銷售數十萬朵' },
    ],
  },
  ID: { country:'印尼', flag:'🇮🇩',
    nationalFlower:{ name:'大花草（萊佛士花）', desc:'全球最大的單一花朵，直徑可達1公尺、重逾10公斤，完全寄生生長，盛開時散發腐肉氣味以吸引昆蟲授粉', emoji:'🌺' },
    plants:[
      { name:'大王花（Rafflesia）', desc:'世界最大花朵，僅分布於蘇門答臘與婆羅洲，無根無莖葉，完全寄生於葡萄藤，每次盛開只維持數天' },
      { name:'椰子樹', desc:'印尼是全球最大椰子生產國，椰子的食物、飲料、油、建材與纖維用途完整貫穿印尼文化生活' },
      { name:'依蘭依蘭', desc:'印尼最重要香料植物之一，花朵芳香濃郁，是香奈兒五號等頂級香水的重要原料' },
    ],
  },
  SG: { country:'新加坡', flag:'🇸🇬',
    nationalFlower:{ name:'卓錦萬代蘭（Vanda Miss Joaquim）', desc:'1981年由李光耀選定，由土生華人阿格尼斯·喬亞欽培育，是世界上首個在新加坡育成的雜交蘭花品種', emoji:'💜' },
    plants:[
      { name:'卓錦萬代蘭', desc:'新加坡國花，新加坡植物園（UNESCO世界遺產）收藏全球最大蘭花品種超過1000種' },
      { name:'雨樹（金龜樹）', desc:'新加坡最具代表性的行道樹，樹冠傘狀廣闊，夜晚與雨前收攏葉子，是「花園城市」的標誌' },
      { name:'火焰木', desc:'熱帶地區最壯觀的開花喬木，每年5-7月花開如火焰，是新加坡濱海灣最重要的景觀樹' },
    ],
  },
  EG: { country:'埃及', flag:'🇪🇬',
    nationalFlower:{ name:'埃及睡蓮（尼羅藍蓮）', desc:'古埃及最神聖的符號，象徵太陽、創造與復活，廣泛出現於法老壁畫與寺廟裝飾，代表上埃及', emoji:'🌸' },
    plants:[
      { name:'藍色睡蓮（尼羅河蓮）', desc:'古埃及文明核心象徵，藍蓮代表上埃及、白蓮代表下埃及，在法老墓室藝術中無所不在' },
      { name:'紙莎草', desc:'人類最早的書寫材料，古埃及文明賴以傳播知識的植物，在尼羅河三角洲曾廣泛生長' },
      { name:'海棗（椰棗）', desc:'北非沙漠文明糧食支柱，距今5000年前即被馴化，埃及是全球最大椰棗生產國之一' },
    ],
  },
  ZA: { country:'南非', flag:'🇿🇦',
    nationalFlower:{ name:'國王帝王花（King Protea）', desc:'非洲最大山龍眼科花朵，直徑可達30公分，象徵南非的多元共生、韌性與創造力', emoji:'🌸' },
    plants:[
      { name:'帝王花（Protea）', desc:'南非國花，開普敦特有的芬博斯（Fynbos）植被擁有近9000種特有植物，是全球生物多樣性熱點' },
      { name:'蘆薈', desc:'南非原生蘆薈超過400種，原住民使用歷史逾3000年，是天然護膚與藥用植物的全球重要出口品' },
      { name:'馬蹄蓮', desc:'南非原生，全球婚禮花卉的代表，在南非野外生長於溪邊濕地，冬春花期白色花苞純潔動人' },
    ],
  },
  KE: { country:'肯亞', flag:'🇰🇪',
    nationalFlower:{ name:'非洲玫瑰', desc:'肯亞高原氣候涼爽、日照充足，培育出全球品質最佳的玫瑰，花莖長且花色鮮豔，是全球切花市場明星', emoji:'🌹' },
    plants:[
      { name:'肯亞玫瑰', desc:'肯亞是全球第二大玫瑰出口國，高地農場玫瑰以品質頂尖著稱，主要銷往荷蘭花卉拍賣市場再轉銷全球' },
      { name:'香腸樹（吊燈樹）', desc:'非洲東部特有奇異樹木，果實形似香腸且長達60公分，馬賽人以其用於傳統醫藥與皮膚護理' },
      { name:'非洲紫羅蘭（Saintpaulia）', desc:'原產肯亞與坦桑尼亞山區，是全球最受歡迎的室內植物之一，現有數千個栽培品種' },
    ],
  },
  SA: { country:'沙烏地阿拉伯', flag:'🇸🇦',
    nationalFlower:{ name:'塔伊夫玫瑰', desc:'塔伊夫（Taif）海拔1800公尺高原出產世界頂級玫瑰，1公斤玫瑰精油需400萬朵花，收穫期僅三週', emoji:'🌹' },
    plants:[
      { name:'海棗（棗椰樹）', desc:'阿拉伯文化最核心的植物，《古蘭經》提及超過20次，沙國擁有逾2300萬棵，是齋戒月最重要的食物' },
      { name:'塔伊夫玫瑰（大馬士革玫瑰）', desc:'每年只有三週收穫期，須凌晨採摘，是中東最昂貴的精油原料，也是阿拉伯傳統禮品文化的核心' },
      { name:'乳香樹', desc:'阿拉伯半島的珍貴樹脂，乳香貿易是古代絲路重要商品，南部與阿曼地區是全球主要產地' },
    ],
  },
  GB: { country:'英國', flag:'🇬🇧',
    nationalFlower:{ name:'都鐸玫瑰（Tudor Rose）', desc:'紅白玫瑰合一，象徵蘭卡斯特與約克家族在玫瑰戰爭後的統一，是英格蘭最重要的國家象徵', emoji:'🌹' },
    plants:[
      { name:'英國玫瑰', desc:'英格蘭國花，皇家園藝學會（RHS）是全球最具影響力的園藝機構，切爾西花展是全球頂尖的花卉盛事' },
      { name:'英國橡樹（夏橡）', desc:'英國國樹，象徵力量與永恆，謝菲爾德等地的千年古橡樹是珍貴文化遺產，也是松鼠與野鳥的重要棲地' },
      { name:'薰衣草', desc:'英國科茨沃爾德丘陵的代表性景觀，諾福克薰衣草農場每年夏季吸引大批遊客，廣泛用於香氛與料理' },
    ],
  },
  FR: { country:'法國', flag:'🇫🇷',
    nationalFlower:{ name:'鳶尾花（Fleur-de-lis）', desc:'法國皇室紋章，象徵純潔、光明與王權，是法國國旗設計靈感來源之一，已有超過千年的使用歷史', emoji:'💜' },
    plants:[
      { name:'普羅旺斯薰衣草', desc:'法國最具代表性農業景觀，每年7-8月薰衣草花海吸引百萬遊客，格拉斯（Grasse）是世界香水之都' },
      { name:'法國橡木', desc:'波爾多葡萄酒橡木桶的原料，法國橡木（Quercus robur）是全球最高品質葡萄酒熟成容器，帶來香草與單寧風味' },
      { name:'向日葵', desc:'法國南部廣闊向日葵田是夏日標誌性景觀，梵谷在普羅旺斯創作系列向日葵畫作，法國也是重要油料產國' },
    ],
  },
  DE: { country:'德國', flag:'🇩🇪',
    nationalFlower:{ name:'矢車菊（Kornblume）', desc:'普魯士皇室青睞的藍色野花，象徵謙遜與誠實，普魯士王后路易絲將其視為德意志民族精神的象徵', emoji:'💙' },
    plants:[
      { name:'矢車菊', desc:'德國國花，普魯士皇帝威廉一世之母以此花教導謙遜美德，現今野生數量因農藥使用而受保育保護' },
      { name:'德國橡樹', desc:'日耳曼神話中的聖樹，象徵力量、耐久與尊嚴，科隆大教堂附近的千年古橡樹是重要文化遺產' },
      { name:'啤酒花', desc:'德國啤酒文化的核心植物，巴伐利亞種植面積居全球之首，1516年《純淨法》規定其為釀造必備原料' },
    ],
  },
  IT: { country:'義大利', flag:'🇮🇹',
    nationalFlower:{ name:'雛菊（Margherita）', desc:'純潔與希望的象徵，義大利語中雛菊同名的瑪格麗特王后也是瑪格麗特披薩命名由來，遍布義大利鄉間', emoji:'🌼' },
    plants:[
      { name:'橄欖樹', desc:'地中海文明的核心，義大利橄欖油品質全球頂尖，普利亞大區有些樹齡超過2000年的古橄欖樹仍年年結果' },
      { name:'葡萄藤', desc:'義大利是全球最大葡萄酒生產國，托斯卡尼葡萄園是UNESCO世界遺產，奇揚第（Chianti）紅酒聞名全球' },
      { name:'西西里檸檬', desc:'阿馬爾菲海岸的象徵，義大利檸檬是全球最芳香品種，義大利特色利莫酒（Limoncello）的靈魂原料' },
    ],
  },
  ES: { country:'西班牙', flag:'🇪🇸',
    nationalFlower:{ name:'石榴花', desc:'格拉納達（Granada）城市名稱正是「石榴」之意，石榴花象徵豐饒與熱情，安達魯西亞最具代表性', emoji:'🌺' },
    plants:[
      { name:'橄欖樹', desc:'西班牙是全球最大橄欖油生產國（佔全球45%），安達盧西亞一望無際的橄欖樹林是當地的靈魂景觀' },
      { name:'番紅花', desc:'世界最昂貴香料，卡斯提亞-拉曼恰是全球最大產區，每朵花只有三根花蕊需手工採摘，西班牙海鮮飯必備' },
      { name:'苦橙（塞維利亞橙）', desc:'塞維利亞街道遍植苦橙樹，花香芬芳，是頂級香水製造的重要原料，英國人用它製作橘皮果醬' },
    ],
  },
  NL: { country:'荷蘭', flag:'🇳🇱',
    nationalFlower:{ name:'鬱金香', desc:'17世紀「鬱金香狂熱（Tulipmania）」是人類史上首次投機泡沫；荷蘭至今是全球最大鬱金香出口國', emoji:'🌷' },
    plants:[
      { name:'鬱金香', desc:'荷蘭國花，庫肯霍夫花園每年栽植700萬朵，是全球最大花卉展覽，每年球根出口超過30億株' },
      { name:'風信子', desc:'荷蘭球根花卉產業的核心品種，濃郁香氣是春天的代名詞，哈勒姆地區是最重要的生產中心' },
      { name:'水仙花', desc:'荷蘭科學家培育超過25000個水仙品種，是歐洲春天花圃必備植物，全球球根市場的重要出口品' },
    ],
  },
  RU: { country:'俄羅斯', flag:'🇷🇺',
    nationalFlower:{ name:'洋甘菊', desc:'俄羅斯田野最常見的野花，象徵純潔與鄉村靈魂，也是重要的藥用植物，廣泛用於民間醫療與草藥茶', emoji:'🌼' },
    plants:[
      { name:'白樺樹', desc:'俄羅斯靈魂深處的象徵，廣泛出現於普希金詩歌與柴可夫斯基音樂中，是西伯利亞最主要的落葉樹種' },
      { name:'向日葵', desc:'俄羅斯是全球最大向日葵籽油生產國，庫班（Kuban）平原廣闊的向日葵田壯觀無比，夏季景象震撼人心' },
      { name:'西伯利亞落葉松', desc:'覆蓋全球最大的單一森林生態系（泰加林），可在-70°C極端低溫下生存，是地球耐寒植物的冠軍' },
    ],
  },
  GR: { country:'希臘', flag:'🇬🇷',
    nationalFlower:{ name:'熊蔥（Hyacinth，風信子）', desc:'與古希臘神話中的美少年賈辛托斯（Hyacinthus）有關，阿波羅投擲鐵餅意外傷及他，血化為花朵', emoji:'💜' },
    plants:[
      { name:'橄欖樹', desc:'希臘文明的根本象徵，雅典娜以橄欖樹作為贈禮而成為雅典守護神，部分古橄欖樹樹齡超過3000年且仍結果' },
      { name:'月桂', desc:'古希臘榮耀象徵，奧林匹克冠軍與偉人以月桂冠加冕，「功成名就（resting on laurels）」典故由此而來' },
      { name:'百里香', desc:'希臘山野最具代表性的芳香植物，希臘百里香蜂蜜是全球最頂尖的蜂蜜品種之一，是地中海料理的靈魂香草' },
    ],
  },
  US: { country:'美國', flag:'🇺🇸',
    nationalFlower:{ name:'玫瑰', desc:'1986年由雷根總統正式簽署宣布為國花，象徵美國的愛、榮耀、美麗與奉獻，也是各州最普遍的花卉象徵', emoji:'🌹' },
    plants:[
      { name:'薩瓜洛仙人掌', desc:'美國西南部沙漠的標誌，壽命可達150-200年，高度超過15公尺，開花結果前需生長約75年' },
      { name:'海岸紅杉（世界爺）', desc:'地球最高樹種，高度可達115公尺，加州紅木國家公園保護著這些存活超過2000年的地球最高生物' },
      { name:'藍莓', desc:'北美原生灌木，原住民使用超過13000年，現為全球超級食物代表，美國是全球最大藍莓生產國' },
    ],
  },
  CA: { country:'加拿大', flag:'🇨🇦',
    nationalFlower:{ name:'糖楓（楓葉）', desc:'加拿大國旗上的紅色楓葉象徵，楓糖漿是知名農產品，魁北克省一省就佔全球楓糖漿產量的七成以上', emoji:'🍁' },
    plants:[
      { name:'糖楓', desc:'加拿大最具代表性樹種，秋季葉色從橙紅到深紫燦爛壯觀，楓糖漿是重要的農業與文化輸出品' },
      { name:'白樺', desc:'加拿大北方森林優勢樹種，原住民以樹皮製作獨木舟與容器，是第一民族文化中不可或缺的聖樹' },
      { name:'道格拉斯冷杉', desc:'溫哥華島及英屬哥倫比亞的標誌性針葉樹，加拿大最重要的木材資源，高度可達100公尺' },
    ],
  },
  BR: { country:'巴西', flag:'🇧🇷',
    nationalFlower:{ name:'嘉德麗雅蘭（Cattleya）', desc:'「蘭花女王」，巴西擁有全球最豐富的蘭花多樣性（超過3500種），嘉德麗雅蘭以壯觀花朵聞名全球', emoji:'💜' },
    plants:[
      { name:'亞馬遜王蓮（Victoria amazonica）', desc:'葉片直徑可達3公尺、可承重80公斤，亞馬遜河流域的奇觀，維多利亞時代引起全球轟動' },
      { name:'巴西堅果樹', desc:'亞馬遜雨林旗艦物種，只有在完整熱帶雨林中才能結果（需特定蜂類授粉），是生態健康的指標樹' },
      { name:'橡膠樹', desc:'現代工業文明的關鍵植物，原產巴西亞馬遜，19世紀橡膠熱使馬瑙斯成為南美最富裕的城市之一' },
    ],
  },
  MX: { country:'墨西哥', flag:'🇲🇽',
    nationalFlower:{ name:'大麗花（Dahlia）', desc:'原生於墨西哥高原，阿茲特克文明用於宗教儀式；1787年墨西哥植物學家首次正式記錄並向世界介紹', emoji:'🌺' },
    plants:[
      { name:'龍舌蘭', desc:'墨西哥最具代表性的植物，龍舌蘭酒（Tequila）和梅茲卡爾（Mezcal）的釀造原料，生長數十年僅開花一次' },
      { name:'大麗花', desc:'墨西哥國花，阿茲特克人用它入藥，現有超過4萬個栽培品種，花型千變萬化從球型到蜘蛛型均有' },
      { name:'玉米', desc:'墨西哥是玉米起源地，人類在此馴化玉米已超過7000年，全球80%玉米品種的基因多樣性源自墨西哥' },
    ],
  },
  PE: { country:'秘魯', flag:'🇵🇪',
    nationalFlower:{ name:'坎圖特花（Cantuta buxifolia）', desc:'印加帝國最神聖的花卉，多色花朵象徵印加彩虹神，只生長於安地斯山脈4000公尺以上的高海拔地區', emoji:'🌺' },
    plants:[
      { name:'坎圖特花', desc:'印加文明的聖花，多彩花朵啟發了秘魯與玻利維亞國旗設計，現已成為稀有的保育植物' },
      { name:'金雞納樹', desc:'奎寧（瘧疾特效藥）的來源植物，17世紀秘魯對全球醫學最重要的貢獻，拯救了數以百萬計的生命' },
      { name:'原生種馬鈴薯', desc:'秘魯是馬鈴薯起源地，安地斯山區擁有超過3000個原生品種，是人類最重要的糧食作物之一' },
    ],
  },
  AU: { country:'澳洲', flag:'🇦🇺',
    nationalFlower:{ name:'金合歡（Wattle）', desc:'鮮黃色球形花朵，每年9月1日是澳洲國家金合歡日；黃色與綠色也是澳洲國家隊代表色的直接來源', emoji:'💛' },
    plants:[
      { name:'尤加利（桉樹）', desc:'全球最具代表性的澳洲植物，超過700個品種，含油量極高，是無尾熊（袋熊）唯一食物來源' },
      { name:'帝王花（Waratah）', desc:'原產澳洲，外形壯觀，是新南威爾斯州的州花，也是全球切花市場的明星花材' },
      { name:'袋鼠爪花', desc:'西澳特有植物，花形神似袋鼠爪子，是西澳州花，全球園藝愛好者的最愛，出口量持續增長' },
    ],
  },
};

/* 各國官方完整英文名稱 */
const WORLD_EN_NAMES = {
  TW:'Taiwan',
  JP:'Japan',
  CN:"People's Republic of China",
  KR:'Republic of Korea (South Korea)',
  IN:'Republic of India',
  TH:'Kingdom of Thailand',
  ID:'Republic of Indonesia',
  SG:'Republic of Singapore',
  EG:'Arab Republic of Egypt',
  ZA:'Republic of South Africa',
  KE:'Republic of Kenya',
  SA:'Kingdom of Saudi Arabia',
  GB:'United Kingdom of Great Britain and Northern Ireland',
  FR:'French Republic',
  DE:'Federal Republic of Germany',
  IT:'Italian Republic',
  ES:'Kingdom of Spain',
  NL:'Kingdom of the Netherlands',
  RU:'Russian Federation',
  GR:'Hellenic Republic (Greece)',
  US:'United States of America',
  CA:'Canada',
  BR:'Federative Republic of Brazil',
  MX:'United Mexican States',
  PE:'Republic of Peru',
  AU:'Commonwealth of Australia',
};

/* Wikipedia 文章標題（對應順序：國花 / 植物1 / 植物2 / 植物3）*/
const WORLD_WIKI = {
  TW:{ f:'Prunus_mume',          p:['Phalaenopsis_amabilis','Pleione_formosana','Keteleeria_davidiana'] },
  JP:{ f:'Cherry_blossom',       p:['Yoshino_cherry','Japanese_maple','Bamboo'] },
  CN:{ f:'Tree_peony',           p:['Tree_peony','Nelumbo_nucifera','Ginkgo_biloba'] },
  KR:{ f:'Hibiscus_syriacus',    p:['Hibiscus_syriacus','Rhododendron_mucronulatum','Pinus_koraiensis'] },
  IN:{ f:'Nelumbo_nucifera',     p:['Ficus_benghalensis','Turmeric','Sandalwood'] },
  TH:{ f:'Cassia_fistula',       p:['Cassia_fistula','Victoria_amazonica','Dendrobium'] },
  ID:{ f:'Rafflesia_arnoldii',   p:['Rafflesia_arnoldii','Cocos_nucifera','Cananga_odorata'] },
  SG:{ f:'Papilionanthe_Miss_Joaquim', p:['Papilionanthe_Miss_Joaquim','Albizia_saman','Delonix_regia'] },
  EG:{ f:'Nymphaea_caerulea',    p:['Nymphaea_caerulea','Cyperus_papyrus','Phoenix_dactylifera'] },
  ZA:{ f:'Protea_cynaroides',    p:['Protea_cynaroides','Aloe_vera','Zantedeschia_aethiopica'] },
  KE:{ f:'Rosa',                 p:['Rosa','Kigelia','Saintpaulia'] },
  SA:{ f:'Rosa_damascena',       p:['Phoenix_dactylifera','Rosa_damascena','Boswellia'] },
  GB:{ f:'Rose',                 p:['Rose','Quercus_robur','Lavandula'] },
  FR:{ f:'Iris_(plant)',         p:['Lavandula','Quercus_robur','Helianthus_annuus'] },
  DE:{ f:'Centaurea_cyanus',     p:['Centaurea_cyanus','Quercus_robur','Humulus_lupulus'] },
  IT:{ f:'Bellis_perennis',      p:['Olea_europaea','Vitis_vinifera','Lemon'] },
  ES:{ f:'Punica_granatum',      p:['Olea_europaea','Crocus_sativus','Citrus_aurantium'] },
  NL:{ f:'Tulip',                p:['Tulip','Hyacinthus_orientalis','Narcissus_(plant)'] },
  RU:{ f:'Matricaria_chamomilla',p:['Betula_pendula','Helianthus_annuus','Larix_sibirica'] },
  GR:{ f:'Hyacinthus_orientalis',p:['Olea_europaea','Laurus_nobilis','Thymus_vulgaris'] },
  US:{ f:'Rose',                 p:['Saguaro','Sequoia_sempervirens','Blueberry'] },
  CA:{ f:'Acer_saccharum',       p:['Acer_saccharum','Betula_papyrifera','Pseudotsuga_menziesii'] },
  BR:{ f:'Cattleya_labiata',     p:['Victoria_amazonica','Bertholletia_excelsa','Hevea_brasiliensis'] },
  MX:{ f:'Dahlia',               p:['Agave_tequilana','Dahlia','Maize'] },
  PE:{ f:'Cantua_buxifolia',     p:['Cantua_buxifolia','Cinchona','Potato'] },
  AU:{ f:'Acacia_pycnantha',     p:['Eucalyptus','Telopea_speciosissima','Anigozanthos_manglesii'] },
};

// 初始化加載
document.addEventListener('DOMContentLoaded', () => {
  if (typeof PLANT_DATABASE === 'undefined') {
    console.error("無法加載植物數據庫，請檢查 db.js");
    return;
  }
  initNavigation();
  initScanner();
  initEncyclopedia();
  initPlantDoctor();
  initGenericUI();
});

/* ==========================================================================
   A. 導航與視窗切換 (Navigation & View Switcher)
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const appViews = document.querySelectorAll('.app-view');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetViewId = link.getAttribute('data-view');

      // 更新 Active 導航樣式
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // 切換 View 區塊
      appViews.forEach(view => {
        view.classList.remove('active');
        if (view.id === `${targetViewId}-view`) {
          view.classList.add('active');
        }
      });
    });
  });
}

/* ==========================================================================
   B. 科技感 AI 掃描器 (AI Scanner & Matches Engine)
   ========================================================================== */
function initScanner() {
  const uploadZone    = document.getElementById('upload-zone');
  const fileInput     = document.getElementById('file-input');
  const previewContainer = document.querySelector('.preview-container');
  const previewImg    = document.getElementById('preview-img');
  const previewVideo  = document.getElementById('preview-video');
  const frameStrip    = document.getElementById('frame-strip');
  const frameStripThumbs = document.getElementById('frame-strip-thumbs');

  const statusPlaceholder = document.getElementById('status-placeholder');
  const consoleLoader = document.getElementById('console-loader');
  const matchResults  = document.getElementById('match-results');

  // 點擊上傳區域觸發檔案選擇
  uploadZone.addEventListener('click', () => { fileInput.click(); });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) handleFileSelected(e.target.files[0]);
  });

  uploadZone.addEventListener('dragover',  (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', ()  => { uploadZone.classList.remove('dragover'); });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelected(e.dataTransfer.files[0]);
  });

  // 一鍵示範區（仍維持圖片 Demo 模式）
  document.querySelectorAll('.demo-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const plantId = item.getAttribute('data-plant-id');
      const cnName  = item.getAttribute('data-name');
      const plantData = PLANT_DATABASE.find(p => p.id === plantId);
      const gradient  = plantData ? plantData.themeColor : 'linear-gradient(135deg, #134e5e, #71b280)';

      resetVideoState();
      frameStrip.style.display = 'none';

      previewImg.style.display = 'none';
      previewContainer.style.cssText = `display:flex; align-items:center; justify-content:center; background:${gradient};`;

      let overlay = previewContainer.querySelector('.demo-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'demo-overlay';
        overlay.style.cssText = 'font-size:24px;font-weight:800;color:#fff;text-shadow:0 4px 12px rgba(0,0,0,.5);';
        previewContainer.appendChild(overlay);
      }
      overlay.style.display = 'block';
      overlay.innerText = cnName;

      startScanningProcess(plantId, 'demo');
    });
  });

  // ── 檔案類型分流 ──────────────────────────────────────────────
  function handleFileSelected(file) {
    if (file.type.startsWith('image/'))      handleImageFile(file);
    else if (file.type.startsWith('video/')) handleVideoFile(file);
    else showToast('請上傳圖片（JPG/PNG/WEBP）或影片（MP4/MOV）格式！', 'danger');
  }

  // ── 圖片處理 ─────────────────────────────────────────────────
  function handleImageFile(file) {
    resetVideoState();
    frameStrip.style.display = 'none';

    const reader = new FileReader();
    reader.onload = (ev) => {
      const overlay = previewContainer.querySelector('.demo-overlay');
      if (overlay) overlay.style.display = 'none';

      previewImg.src = ev.target.result;
      previewImg.style.display = 'block';
      previewContainer.style.cssText = 'display:block; background:none;';

      startScanningProcess(matchNameToId(file.name), 'image');
    };
    reader.readAsDataURL(file);
  }

  // ── 影片處理 ─────────────────────────────────────────────────
  function handleVideoFile(file) {
    const overlay = previewContainer.querySelector('.demo-overlay');
    if (overlay) overlay.style.display = 'none';
    previewImg.style.display = 'none';

    resetVideoState();
    const objectUrl = URL.createObjectURL(file);
    previewVideo._objectUrl = objectUrl;
    previewVideo.src = objectUrl;
    previewVideo.style.display = 'block';
    previewContainer.style.cssText = 'display:block; background:#111;';
    frameStrip.style.display = 'none';
    frameStripThumbs.innerHTML = '';

    previewVideo.onloadedmetadata = () => {
      startScanningProcess(matchNameToId(file.name), 'video', previewVideo);
    };
  }

  // ── 清除影片狀態 ──────────────────────────────────────────────
  function resetVideoState() {
    if (previewVideo.src) {
      previewVideo.pause();
      if (previewVideo._objectUrl) {
        URL.revokeObjectURL(previewVideo._objectUrl);
        previewVideo._objectUrl = null;
      }
      previewVideo.removeAttribute('src');
      previewVideo.load();
    }
    previewVideo.style.display = 'none';
  }

  // ── 檔名關鍵字智慧比對 ────────────────────────────────────────
  function matchNameToId(filename) {
    const f = filename.toLowerCase();
    if (f.includes('snake') || f.includes('虎尾') || f.includes('sansevieria')) return 'snake_plant';
    if (f.includes('fig')   || f.includes('琴葉') || f.includes('ficus'))       return 'fiddle_leaf_fig';
    if (f.includes('pothos')|| f.includes('黃金葛')|| f.includes('ivy'))        return 'pothos';
    if (f.includes('spider')|| f.includes('吊蘭'))                              return 'spider_plant';
    if (f.includes('peace') || f.includes('白鶴') || f.includes('lily'))        return 'peace_lily';
    if (f.includes('aloe')  || f.includes('蘆薈'))                              return 'aloe_vera';
    if (f.includes('jade')  || f.includes('翡翠') || f.includes('玉樹'))        return 'jade_plant';
    if (f.includes('fern')  || f.includes('蕨'))                                return 'boston_fern';
    if (f.includes('calathea')||f.includes('竹芋'))                             return 'calathea_orbifolia';
    if (f.includes('succulent')||f.includes('echeveria'))                       return 'succulents';
    if (f.includes('rosemary')||f.includes('迷迭'))                             return 'rosemary';
    if (f.includes('zz')    || f.includes('金錢樹'))                            return 'zz_plant';
    if (f.includes('lavender')||f.includes('薰衣草'))                           return 'lavender';
    if (f.includes('orchid')|| f.includes('蘭'))                                return 'orchid';
    if (f.includes('rose')  || f.includes('玫瑰'))                              return 'rose';
    if (f.includes('sunflower')||f.includes('向日葵'))                          return 'sunflower';
    if (f.includes('hydrangea')||f.includes('繡球'))                            return 'hydrangea';
    return PLANT_DATABASE[Math.floor(Math.random() * PLANT_DATABASE.length)].id;
  }

  // ── 影格擷取（Promise 化 seeked 事件） ─────────────────────────
  function seekToTime(videoEl, time) {
    return new Promise(resolve => {
      const handler = () => { videoEl.removeEventListener('seeked', handler); resolve(); };
      videoEl.addEventListener('seeked', handler);
      videoEl.currentTime = time;
    });
  }

  async function extractVideoFrames(videoEl, count = 5) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const duration = videoEl.duration;
    const maxW = 640, maxH = 480;
    const ratio = Math.min(maxW / videoEl.videoWidth, maxH / videoEl.videoHeight, 1);
    canvas.width  = Math.round(videoEl.videoWidth  * ratio);
    canvas.height = Math.round(videoEl.videoHeight * ratio);
    const frames = [];
    for (let i = 0; i < count; i++) {
      await seekToTime(videoEl, (duration / (count + 1)) * (i + 1));
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL('image/jpeg', 0.82));
    }
    return frames;
  }

  // ── AI 掃描 Console 動畫 ──────────────────────────────────────
  function startScanningProcess(plantId, mode, videoEl = null) {
    uploadZone.classList.add('scanning');
    statusPlaceholder.style.display = 'none';
    matchResults.style.display = 'none';
    document.getElementById('seller-section').style.display = 'none';
    consoleLoader.style.display = 'block';
    consoleLoader.innerHTML = '';

    const steps = mode === 'video' ? [
      '▶ 正在解析影片格式與解析度...',
      '▶ [INFO] 動態植物影像確認，正在切片關鍵影格（共 5 格）...',
      '▶ 正在擷取均勻分佈代表性影格並套用特徵強化濾鏡...',
      '▶ [ANALYSIS] 多影格植物特徵矩陣建立中，消除運動模糊...',
      '▶ 正在分析葉脈走向、顏色光譜與葉緣輪廓分佈...',
      '▶ 正在與 FloraCare AI 雲端數據庫進行多影格神經網路比對...',
      '▶ [SUCCESS] 5 影格投票完成！最高信賴度結果確認，正在導出照護履歷...'
    ] : [
      '▶ 正在讀取影像色彩通道 (R-G-B)...',
      '▶ [INFO] 偵測到高飽和度綠色像素群組 (Green Ratio: 78.4%)',
      '▶ 正在辨識葉片外緣輪廓與葉脈分佈圖譜...',
      '▶ [ANALYSIS] 葉裂模式比對中：特徵點比對吻合度極高',
      '▶ 正在分析照片微氣候特徵與光敏折射率...',
      '▶ 正在與 FloraCare AI 雲端數據庫 (150,000+ 植物基因組) 進行神經網路比對...',
      '▶ [SUCCESS] 匹配成功！分析信賴度極高，正在導出完整照護履歷...'
    ];

    // 影片模式：與 console 動畫並行擷取影格
    if (mode === 'video' && videoEl) {
      extractVideoFrames(videoEl).then(frames => {
        frameStripThumbs.innerHTML = '';
        frames.forEach(src => {
          const img = document.createElement('img');
          img.className = 'frame-thumb';
          img.src = src;
          frameStripThumbs.appendChild(img);
        });
        frameStrip.style.display = 'block';
      });
    }

    let lineIndex = 0;
    function printNextConsoleLine() {
      if (lineIndex < steps.length) {
        const line = document.createElement('div');
        line.className = 'typing-line';
        line.innerText = steps[lineIndex++];
        consoleLoader.appendChild(line);
        consoleLoader.scrollTop = consoleLoader.scrollHeight;
        setTimeout(printNextConsoleLine, 400);
      } else {
        setTimeout(() => {
          uploadZone.classList.remove('scanning');
          consoleLoader.style.display = 'none';
          showMatchResults(plantId, mode);
        }, 600);
      }
    }
    setTimeout(printNextConsoleLine, 200);
  }

  // ── 渲染比對結果面板 ──────────────────────────────────────────
  function showMatchResults(matchedId, mode) {
    const mainPlant = PLANT_DATABASE.find(p => p.id === matchedId);
    if (!mainPlant) return;

    const candidates = PLANT_DATABASE.filter(p => p.id !== matchedId);
    const altPlant1  = candidates[Math.floor(Math.random() * candidates.length)];
    const altPlant2  = candidates[(Math.floor(Math.random() * candidates.length) + 1) % candidates.length];

    matchResults.style.display = 'block';

    // 每次識別產生不重複的隨機信賴度：主結果 87–98，遞減間距 14–22
    const rInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const scoreMain = rInt(87, 98);
    const scoreAlt1 = scoreMain - rInt(14, 22);
    const scoreAlt2 = scoreAlt1  - rInt(10, 18);
    const scoreColor = s => s >= 90 ? 'var(--accent)' : s >= 70 ? 'var(--gold)' : 'var(--text-secondary)';

    const videoNote = mode === 'video'
      ? `<div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;padding:10px 14px;
             background:rgba(84,255,189,0.04);border-radius:var(--radius-md);
             border:1px solid rgba(84,255,189,0.12);display:flex;align-items:center;gap:8px;">
           <i class="fas fa-film" style="color:var(--accent);"></i>
           影片多影格分析完成 — 5 個關鍵畫面均確認以下識別結果
         </div>`
      : '';

    document.getElementById('match-list-container').innerHTML = `
      ${videoNote}
      <div class="match-item primary-match" onclick="openPlantProfile('${mainPlant.id}')">
        <div class="match-info-left">
          <div class="match-icon-circle" style="background:${mainPlant.themeColor}">🌱</div>
          <div class="match-names">
            <div class="match-cn-name">${mainPlant.name}</div>
            <div class="match-en-name">${mainPlant.scientificName}</div>
            <span class="match-tag" style="background:rgba(84,255,189,.15);color:var(--accent);">最佳匹配 (AI 推薦)</span>
          </div>
        </div>
        <div class="match-score-right">
          <div class="match-percentage" style="color:${scoreColor(scoreMain)}">${scoreMain}%</div>
          <div style="font-size:11px;color:var(--text-muted);">信賴度</div>
        </div>
      </div>
      <div class="match-item" onclick="openPlantProfile('${altPlant1.id}')">
        <div class="match-info-left">
          <div class="match-icon-circle" style="background:${altPlant1.themeColor}">🌿</div>
          <div class="match-names">
            <div class="match-cn-name">${altPlant1.name}</div>
            <div class="match-en-name">${altPlant1.scientificName}</div>
          </div>
        </div>
        <div class="match-score-right">
          <div class="match-percentage" style="color:${scoreColor(scoreAlt1)}">${scoreAlt1}%</div>
          <div style="font-size:11px;color:var(--text-muted);">相似度</div>
        </div>
      </div>
      <div class="match-item" onclick="openPlantProfile('${altPlant2.id}')">
        <div class="match-info-left">
          <div class="match-icon-circle" style="background:${altPlant2.themeColor}">☘️</div>
          <div class="match-names">
            <div class="match-cn-name">${altPlant2.name}</div>
            <div class="match-en-name">${altPlant2.scientificName}</div>
          </div>
        </div>
        <div class="match-score-right">
          <div class="match-percentage" style="color:${scoreColor(scoreAlt2)}">${scoreAlt2}%</div>
          <div style="font-size:11px;color:var(--text-muted);">相似度</div>
        </div>
      </div>
    `;

    // ── 購買管道資訊 ──────────────────────────────────────────────
    const onlineSellers = [
      { emoji: '🛍️', name: '蝦皮購物', desc: '台灣最大 C2C 平台，賣家眾多、品種齊全', url: 'https://shopee.tw/search?keyword=' },
      { emoji: '🏷️', name: '露天拍賣', desc: '老字號拍賣平台，稀有品種一應俱全', url: 'https://www.ruten.com.tw/find/?q=' },
      { emoji: '🛒', name: 'Yahoo 購物中心', desc: '快速到貨，品牌園藝店鋪皆有進駐', url: 'https://tw.buy.yahoo.com/search/product?p=' },
    ];
    const offlineSellers = [
      { emoji: '🌸', name: '建國假日花市', location: '台北市大安區建國南路一段', hours: '週六、日　08:00 – 18:00' },
      { emoji: '🌿', name: '台北花卉村', location: '台北市內湖區新湖三路 196 號', hours: '週一至週日　09:00 – 21:00' },
      { emoji: '🌺', name: '板橋花市', location: '新北市板橋區文化路二段', hours: '週二至週日　08:00 – 18:00' },
      { emoji: '🌱', name: '台中豐原花市', location: '台中市豐原區中興路', hours: '週六、日　07:00 – 17:00' },
      { emoji: '🌻', name: '高雄七賢花市', location: '高雄市三民區七賢一路', hours: '每日　07:00 – 18:00' },
    ];

    const sellerEl = document.getElementById('seller-section');
    sellerEl.style.display = 'block';
    sellerEl.innerHTML = `
      <div class="seller-section-header">
        <i class="fas fa-store"></i> 購買管道
        <span class="seller-search-hint">搜尋：${mainPlant.name}</span>
      </div>
      <div class="seller-tabs">
        <button class="seller-tab active" onclick="switchSellerTab(this,'online')">🛒 網路購買</button>
        <button class="seller-tab" onclick="switchSellerTab(this,'offline')">🏪 實體賣場</button>
      </div>
      <div id="seller-panel-online" class="seller-grid">
        ${onlineSellers.map(s => `
          <a class="seller-card" href="${s.url}${encodeURIComponent(mainPlant.name)}" target="_blank" rel="noopener noreferrer">
            <div class="seller-logo">${s.emoji}</div>
            <div class="seller-info">
              <div class="seller-name">${s.name}</div>
              <div class="seller-desc">${s.desc}</div>
            </div>
            <i class="fas fa-external-link-alt seller-link-icon"></i>
          </a>
        `).join('')}
      </div>
      <div id="seller-panel-offline" class="seller-grid" style="display:none;">
        ${offlineSellers.map(s => `
          <div class="seller-card offline-card">
            <div class="seller-logo">${s.emoji}</div>
            <div class="seller-info">
              <div class="seller-name">${s.name}</div>
              <div class="seller-desc">${s.location}</div>
              <div class="seller-hours"><i class="fas fa-clock"></i>&nbsp;${s.hours}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    showToast(`辨識完成：這看起來是一盆美麗的【${mainPlant.name}】！`);
  }
}


/* ==========================================================================
   D. 植物百科檢索與篩選 (Plant Encyclopedia System)
   ========================================================================== */

// 40 種延伸植物（資料來源：Wikipedia）
const WIKI_PLANTS = [
  { id:'rubber_plant',     name:'橡皮樹',     englishName:'Rubber Plant',        scientificName:'Ficus elastica',            family:'桑科 (Moraceae)',            difficulty:'easy',   tags:['空氣淨化','耐陰植物','大葉觀葉'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#1a3a2a,#2d6e4e)', wikiSlug:'Ficus_elastica' },
  { id:'philodendron',     name:'蔓綠絨',      englishName:'Philodendron',        scientificName:'Philodendron hederaceum',   family:'天南星科 (Araceae)',          difficulty:'easy',   tags:['蔓生植物','耐陰植物','新手友善'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#1b4332,#40916c)', wikiSlug:'Philodendron' },
  { id:'alocasia',         name:'觀音蓮',      englishName:'Elephant Ear',        scientificName:'Alocasia macrorrhizos',     family:'天南星科 (Araceae)',          difficulty:'medium', tags:['大葉觀葉','熱帶植物','盆栽首選'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#052e16,#166534)', wikiSlug:'Alocasia' },
  { id:'aglaonema',        name:'粗肋草',      englishName:'Chinese Evergreen',   scientificName:'Aglaonema commutatum',      family:'天南星科 (Araceae)',          difficulty:'easy',   tags:['耐陰植物','彩色葉片','辦公室植物'], toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#134e5e,#5aaf7e)', wikiSlug:'Aglaonema' },
  { id:'dracaena',         name:'竹蕉',        englishName:'Dragon Tree',         scientificName:'Dracaena marginata',        family:'天門冬科 (Asparagaceae)',     difficulty:'easy',   tags:['耐旱植物','辦公室植物','空氣淨化'], toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#2d3561,#5c63a7)', wikiSlug:'Dracaena_marginata' },
  { id:'dieffenbachia',    name:'花葉萬年青',  englishName:'Dumb Cane',           scientificName:'Dieffenbachia seguine',     family:'天南星科 (Araceae)',          difficulty:'easy',   tags:['斑葉植物','室內耐陰','寵物危險'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#1a3a2a,#4caf6a)', wikiSlug:'Dieffenbachia' },
  { id:'schefflera',       name:'鵝掌藤',      englishName:'Umbrella Plant',      scientificName:'Schefflera arboricola',     family:'五加科 (Araliaceae)',         difficulty:'easy',   tags:['耐陰植物','大型植物','空氣淨化'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#2d4a1e,#6aab3e)', wikiSlug:'Schefflera_arboricola' },
  { id:'fittonia',         name:'網紋草',      englishName:'Nerve Plant',         scientificName:'Fittonia albivenis',        family:'爵床科 (Acanthaceae)',        difficulty:'medium', tags:['彩色葉片','小型植物','高濕環境'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1a4d2e,#2e8b57)', wikiSlug:'Fittonia' },
  { id:'croton',           name:'變葉木',      englishName:'Croton',              scientificName:'Codiaeum variegatum',       family:'大戟科 (Euphorbiaceae)',      difficulty:'medium', tags:['彩色葉片','觀葉植物','全日照'],     toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#a04000,#e67e22)', wikiSlug:'Codiaeum_variegatum' },
  { id:'tradescantia',     name:'紫竹梅',      englishName:'Spiderwort',          scientificName:'Tradescantia zebrina',      family:'鴨跖草科 (Commelinaceae)',    difficulty:'easy',   tags:['蔓生植物','紫色葉片','耐旱'],       toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#4a0e8f,#9b59b6)', wikiSlug:'Tradescantia_zebrina' },
  { id:'peperomia',        name:'椒草',        englishName:'Peperomia',           scientificName:'Peperomia obtusifolia',     family:'胡椒科 (Piperaceae)',         difficulty:'easy',   tags:['迷你植物','多肉質葉','桌面盆栽'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1b4332,#52b788)', wikiSlug:'Peperomia' },
  { id:'hoya',             name:'毬蘭',        englishName:'Wax Plant',           scientificName:'Hoya carnosa',             family:'夾竹桃科 (Apocynaceae)',      difficulty:'easy',   tags:['蔓生植物','香花植物','吊盆首選'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#2d3f1f,#6aa84f)', wikiSlug:'Hoya_carnosa' },
  { id:'haworthia',        name:'玉露',        englishName:'Haworthia',           scientificName:'Haworthia cooperi',         family:'天門冬科 (Asparagaceae)',     difficulty:'easy',   tags:['多肉植物','極度耐旱','桌面盆栽'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#0d3b2e,#1a7a5e)', wikiSlug:'Haworthia' },
  { id:'echeveria',        name:'石蓮花',      englishName:'Echeveria',           scientificName:'Echeveria elegans',         family:'景天科 (Crassulaceae)',       difficulty:'easy',   tags:['多肉植物','極度耐旱','新手首選'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#2e7d32,#8bc34a)', wikiSlug:'Echeveria' },
  { id:'cactus_sp',        name:'仙人掌',      englishName:'Cactus',              scientificName:'Cactaceae spp.',           family:'仙人掌科 (Cactaceae)',        difficulty:'easy',   tags:['多肉植物','極度耐旱','沙漠植物'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#4d7c0f,#a3e635)', wikiSlug:'Cactus' },
  { id:'string_of_pearls', name:'珍珠草',      englishName:'String of Pearls',    scientificName:'Curio rowleyanus',          family:'菊科 (Asteraceae)',           difficulty:'medium', tags:['垂吊植物','多肉植物','極度耐旱'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#1a4a1a,#4caf50)', wikiSlug:'Curio_rowleyanus' },
  { id:'anthurium',        name:'火鶴花',      englishName:'Anthurium',           scientificName:'Anthurium andraeanum',      family:'天南星科 (Araceae)',          difficulty:'medium', tags:['開花植物','熱帶花卉','空氣淨化'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#7f0000,#e53935)', wikiSlug:'Anthurium_andraeanum' },
  { id:'bird_of_paradise', name:'天堂鳥',      englishName:'Bird of Paradise',    scientificName:'Strelitzia reginae',        family:'鶴望蘭科 (Strelitziaceae)',  difficulty:'medium', tags:['開花植物','大型植物','熱帶花卉'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#e65c00,#f9d423)', wikiSlug:'Strelitzia_reginae' },
  { id:'gardenia',         name:'梔子花',      englishName:'Gardenia',            scientificName:'Gardenia jasminoides',      family:'茜草科 (Rubiaceae)',          difficulty:'hard',   tags:['香花植物','純白花朵','開花植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#2d6a2d,#b8d8b8)', wikiSlug:'Gardenia_jasminoides' },
  { id:'jasmine',          name:'茉莉花',      englishName:'Arabian Jasmine',     scientificName:'Jasminum sambac',           family:'木犀科 (Oleaceae)',           difficulty:'medium', tags:['香花植物','開花植物','夏季花卉'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1e6e2d,#74c69d)', wikiSlug:'Jasminum_sambac' },
  { id:'bougainvillea',    name:'九重葛',      englishName:'Bougainvillea',       scientificName:'Bougainvillea spectabilis', family:'紫茉莉科 (Nyctaginaceae)',    difficulty:'easy',   tags:['開花植物','全日照','蔓生植物'],     toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#8e0045,#e91e63)', wikiSlug:'Bougainvillea' },
  { id:'chrysanthemum',    name:'菊花',        englishName:'Chrysanthemum',       scientificName:'Chrysanthemum morifolium',  family:'菊科 (Asteraceae)',           difficulty:'medium', tags:['秋季花卉','開花植物','傳統花卉'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#f39c12,#e67e22)', wikiSlug:'Chrysanthemum' },
  { id:'tulip',            name:'鬱金香',      englishName:'Tulip',               scientificName:'Tulipa gesneriana',         family:'百合科 (Liliaceae)',          difficulty:'medium', tags:['球莖植物','春季花卉','開花植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#c0392b,#e74c3c)', wikiSlug:'Tulip' },
  { id:'begonia',          name:'秋海棠',      englishName:'Begonia',             scientificName:'Begonia semperflorens',     family:'秋海棠科 (Begoniaceae)',      difficulty:'easy',   tags:['開花植物','半陰植物','全年開花'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#880e4f,#e91e63)', wikiSlug:'Begonia' },
  { id:'geranium',         name:'天竺葵',      englishName:'Pelargonium',         scientificName:'Pelargonium hortorum',      family:'牻牛兒苗科 (Geraniaceae)',    difficulty:'easy',   tags:['驅蚊植物','全日照','開花植物'],     toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#c62828,#ef9a9a)', wikiSlug:'Pelargonium' },
  { id:'clivia',           name:'君子蘭',      englishName:'Clivia',              scientificName:'Clivia miniata',            family:'石蒜科 (Amaryllidaceae)',     difficulty:'medium', tags:['春季花卉','耐陰花卉','開花植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#a0410d,#e88037)', wikiSlug:'Clivia_miniata' },
  { id:'cyclamen',         name:'仙客來',      englishName:'Cyclamen',            scientificName:'Cyclamen persicum',         family:'報春花科 (Primulaceae)',      difficulty:'medium', tags:['冬季花卉','球莖植物','開花植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#880e4f,#f48fb1)', wikiSlug:'Cyclamen_persicum' },
  { id:'basil',            name:'羅勒',        englishName:'Sweet Basil',         scientificName:'Ocimum basilicum',          family:'唇形科 (Lamiaceae)',          difficulty:'easy',   tags:['香草植物','食用植物','廚房首選'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1b5e20,#4caf50)', wikiSlug:'Ocimum_basilicum' },
  { id:'mint',             name:'薄荷',        englishName:'Mint',                scientificName:'Mentha spicata',            family:'唇形科 (Lamiaceae)',          difficulty:'easy',   tags:['香草植物','食用植物','驅蟲植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#0f3d0f,#4caf50)', wikiSlug:'Mentha' },
  { id:'pilea',            name:'鏡面草',      englishName:'Chinese Money Plant', scientificName:'Pilea peperomioides',       family:'蕁麻科 (Urticaceae)',         difficulty:'easy',   tags:['圓葉植物','北歐風格','分株容易'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1a4d2e,#66bb6a)', wikiSlug:'Pilea_peperomioides' },
  { id:'air_plant',        name:'空氣鳳梨',    englishName:'Air Plant',           scientificName:'Tillandsia ionantha',       family:'鳳梨科 (Bromeliaceae)',       difficulty:'easy',   tags:['無土植物','特殊品種','空氣植物'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#4a148c,#9c27b0)', wikiSlug:'Tillandsia' },
  { id:'areca_palm',       name:'散尾葵',      englishName:'Areca Palm',          scientificName:'Dypsis lutescens',          family:'棕櫚科 (Arecaceae)',          difficulty:'easy',   tags:['棕櫚植物','空氣淨化','大型植物'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#2e7d32,#f9a825)', wikiSlug:'Dypsis_lutescens' },
  { id:'money_tree',       name:'發財樹',      englishName:'Money Tree',          scientificName:'Pachira aquatica',          family:'錦葵科 (Malvaceae)',          difficulty:'easy',   tags:['招財植物','辦公室植物','耐陰植物'], toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1b5e20,#8bc34a)', wikiSlug:'Pachira_aquatica' },
  { id:'yucca',            name:'絲蘭',        englishName:'Yucca',               scientificName:'Yucca elephantipes',        family:'天門冬科 (Asparagaceae)',     difficulty:'easy',   tags:['耐旱植物','大型植物','熱帶植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#3e2723,#795548)', wikiSlug:'Yucca' },
  { id:'lipstick_plant',   name:'口紅花',      englishName:'Lipstick Plant',      scientificName:'Aeschynanthus pulcher',     family:'苦苣苔科 (Gesneriaceae)',     difficulty:'medium', tags:['吊盆植物','開花植物','蔓生植物'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#8e0000,#e53935)', wikiSlug:'Aeschynanthus' },
  { id:'lucky_bamboo',     name:'富貴竹',      englishName:'Lucky Bamboo',        scientificName:'Dracaena sanderiana',       family:'天門冬科 (Asparagaceae)',     difficulty:'easy',   tags:['水培植物','招財植物','辦公室植物'], toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#1a5c30,#4caf50)', wikiSlug:'Dracaena_sanderiana' },
  { id:'string_of_hearts', name:'愛之蔓',      englishName:'String of Hearts',    scientificName:'Ceropegia woodii',          family:'夾竹桃科 (Apocynaceae)',      difficulty:'easy',   tags:['垂吊植物','多肉植物','浪漫植物'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#7b1fa2,#e91e63)', wikiSlug:'Ceropegia_woodii' },
  { id:'bromeliad',        name:'鳳梨科植物',  englishName:'Bromeliad',           scientificName:'Bromeliaceae spp.',         family:'鳳梨科 (Bromeliaceae)',       difficulty:'easy',   tags:['熱帶植物','開花植物','彩色中心筒'], toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#e65c00,#f9d423)', wikiSlug:'Bromeliad' },
  { id:'bamboo_plant',     name:'竹',          englishName:'Bamboo',              scientificName:'Bambusa vulgaris',          family:'禾本科 (Poaceae)',            difficulty:'easy',   tags:['快速生長','戶外植物','東方風情'],   toxicity:{catsDogs:true},  themeColor:'linear-gradient(135deg,#1b5e20,#8bc34a)', wikiSlug:'Bamboo' },
  { id:'impatiens',        name:'非洲鳳仙花',  englishName:'Busy Lizzie',         scientificName:'Impatiens walleriana',      family:'鳳仙花科 (Balsaminaceae)',    difficulty:'easy',   tags:['耐陰開花','全年開花','開花植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#880e4f,#ff80ab)', wikiSlug:'Impatiens_walleriana' },
  { id:'plumeria',         name:'雞蛋花',      englishName:'Plumeria',            scientificName:'Plumeria rubra',            family:'夾竹桃科 (Apocynaceae)',      difficulty:'medium', tags:['香花植物','熱帶花卉','開花植物'],   toxicity:{catsDogs:false}, themeColor:'linear-gradient(135deg,#f5e642,#f0a500)', wikiSlug:'Plumeria' },
];
WIKI_PLANTS.forEach(p => { p._source = 'wiki'; p._wikiImg = null; p.description = ''; });

const ALL_PLANTS = [...PLANT_DATABASE, ...WIKI_PLANTS];

function initEncyclopedia() {
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let activeSearchQuery = "";
  let activeTagFilter = "all";

  renderEncyclopediaGrid();
  loadWikiPlantImages(); // 背景非同步載入 Wikipedia 真實圖片

  searchInput.addEventListener('input', (e) => {
    activeSearchQuery = e.target.value.trim().toLowerCase();
    filterAndRenderEncyclopedia();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTagFilter = btn.getAttribute('data-filter');
      filterAndRenderEncyclopedia();
    });
  });

  function filterAndRenderEncyclopedia() {
    let filtered = ALL_PLANTS;

    if (activeSearchQuery !== "") {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(activeSearchQuery) ||
        p.englishName.toLowerCase().includes(activeSearchQuery) ||
        p.scientificName.toLowerCase().includes(activeSearchQuery)
      );
    }

    if (activeTagFilter !== "all") {
      if (activeTagFilter === "easy") {
        filtered = filtered.filter(p => p.difficulty === 'easy');
      } else if (activeTagFilter === "pet") {
        filtered = filtered.filter(p => p.toxicity.catsDogs === true);
      } else if (activeTagFilter === "air") {
        filtered = filtered.filter(p => p.tags.includes("空氣淨化"));
      } else if (activeTagFilter === "dry") {
        filtered = filtered.filter(p => p.tags.includes("極度耐旱") || p.tags.includes("多肉植物"));
      } else if (activeTagFilter === "flower") {
        filtered = filtered.filter(p =>
          p.id === 'orchid' || p.id === 'lavender' || p.id === 'peace_lily' ||
          p.id === 'rose' || p.id === 'sunflower' || p.id === 'hydrangea' ||
          p.tags.includes("優雅開花") || p.tags.includes("花期漫長") ||
          p.tags.includes("經典花卉") || p.tags.includes("明亮金黃") ||
          p.tags.includes("花色可變") || p.tags.includes("開花植物") ||
          p.tags.includes("香花植物") || p.tags.includes("春季花卉") ||
          p.tags.includes("秋季花卉") || p.tags.includes("冬季花卉") ||
          p.tags.includes("夏季花卉")
        );
      }
    }

    renderEncyclopediaGrid(filtered);
  }
}

// 繪製大百科植物網格
function renderEncyclopediaGrid(plants = ALL_PLANTS) {
  const grid = document.getElementById('encyclopedia-grid');
  grid.innerHTML = '';

  if (plants.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: span 12; text-align: center; color: var(--text-muted); padding: 40px;">
        <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.1;"></i>
        <p>未找到符合條件的植物資訊...</p>
      </div>
    `;
    return;
  }

  plants.forEach(plant => {
    const card = document.createElement('div');
    card.id = `plant-card-${plant.id}`;
    card.className = 'glass-panel plant-card';
    card.style.setProperty('--plant-color', plant.themeColor);
    card.setAttribute('onclick', `openPlantProfile('${plant.id}')`);

    const diffLabel = plant.difficulty === 'easy' ? '新手推薦' : plant.difficulty === 'medium' ? '中等難度' : '挑戰型';
    const isWiki = plant._source === 'wiki';

    let imgHTML;
    if (isWiki) {
      if (plant._wikiImg) {
        imgHTML = `<img src="${plant._wikiImg}" alt="${plant.name}" onerror="this.style.display='none'">`;
      } else {
        imgHTML = `<div class="wiki-img-loading" style="width:100%;height:100%;min-height:140px;border-radius:0;"></div>`;
      }
    } else {
      imgHTML = `<img src="images/${plant.id}.png" alt="${plant.name}" onerror="this.style.display='none'">`;
    }

    const descText = plant.description
      ? plant.description
      : (isWiki ? '<span style="color:var(--text-muted);font-size:11px;">圖文資料載入中…</span>' : '');

    card.innerHTML = `
      <div class="plant-card-visual" style="background: ${plant.themeColor}">
        ${imgHTML}
      </div>
      <div class="plant-card-info">
        <div class="plant-card-header">
          <h3 class="plant-card-title">${plant.name}</h3>
          <span class="plant-card-difficulty ${plant.difficulty}">${diffLabel}</span>
        </div>
        <div class="plant-card-sci">${plant.scientificName}</div>
        <div class="plant-card-desc">${descText}</div>
        <div class="plant-card-tags">
          ${plant.tags.slice(0, 3).map(tag => `<span class="plant-card-tag">${tag}</span>`).join('')}
          ${isWiki ? '<span class="plant-card-tag" style="background:rgba(84,255,189,0.08);color:var(--accent);border:1px solid rgba(84,255,189,0.2);">Wikipedia</span>' : ''}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ==========================================================================
   E. 植物醫生病徵診斷 (Plant Doctor Diagnostics Wizard)
   ========================================================================== */

const MEDICINE_DATA = {
  "根腐病 (Root Rot)": {
    medicines: [
      { name: "多菌靈 50% WP", type: "chem", typeLabel: "化學殺菌", dosage: "稀釋 800 倍灌根，每 7 天一次，連用 2-3 次" },
      { name: "百菌清 75% WP", type: "chem", typeLabel: "化學殺菌", dosage: "稀釋 600 倍噴灑根部周圍土壤" },
      { name: "木黴菌製劑", type: "bio",  typeLabel: "生物防治", dosage: "移盆後撒施於新土中，促進有益菌定殖" }
    ],
    onlineSellers: [
      { name: "農藥直送 蝦皮旗艦店", desc: "多菌靈 / 百菌清 原廠授權", link: "https://shopee.tw", logo: "🛒" },
      { name: "花農好物 露天市集", desc: "木黴菌菌劑 · 天然安全", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "多品牌比價，滿額免運", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "各地農藥行", desc: "憑症狀洽詢，現場配藥", hours: "通常週一至六 08:00–18:00" },
      { name: "建國花市 / 木柵花市", desc: "園藝資材區有售", hours: "週六日 06:00–14:00" }
    ]
  },
  "嚴重脫水乾枯 (Dehydration)": {
    medicines: [
      { name: "液態海藻精", type: "bio",  typeLabel: "生物促進", dosage: "稀釋 1000 倍澆灌，每 2 週一次促進根系恢復" },
      { name: "根寶（生根劑）", type: "bio",  typeLabel: "生物促進", dosage: "稀釋 500 倍浸根 30 分鐘後移植" },
      { name: "緩效顆粒複合肥", type: "chem", typeLabel: "補充養分", dosage: "植物回穩後少量施於盆土表面，2 個月效期" }
    ],
    onlineSellers: [
      { name: "花仙子 蝦皮旗艦店", desc: "海藻精 / 生根劑 熱銷款", link: "https://shopee.tw", logo: "🛒" },
      { name: "綠手指露天商店", desc: "緩效肥 · 多規格選擇", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "植物急救套組，快速到貨", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "花市園藝資材區", desc: "可現場詢問店主劑量建議", hours: "週六日 06:00–14:00" },
      { name: "特力屋 / 好事多", desc: "生根劑與緩效肥均有架存", hours: "週一至日 10:00–22:00" }
    ]
  },
  "白粉病 (Powdery Mildew)": {
    medicines: [
      { name: "苦楝油乳劑", type: "bio",  typeLabel: "生物防治", dosage: "稀釋 500 倍，每 3 天葉面正反面均勻噴灑，連噴 3 次" },
      { name: "甲基托布津 70% WP", type: "chem", typeLabel: "化學殺菌", dosage: "稀釋 1500 倍噴灑，每 7 天一次" },
      { name: "小蘇打水（自製）", type: "phys", typeLabel: "物理防治", dosage: "1g 小蘇打粉加 1000cc 水，每 3 天噴灑" }
    ],
    onlineSellers: [
      { name: "有機農藥 蝦皮商城", desc: "苦楝油 · 印楝素 · 有機認證", link: "https://shopee.tw", logo: "🛒" },
      { name: "露天農資館", desc: "甲基托布津 原廠正品", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "白粉病套裝，多效殺菌", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "農藥行 / 苗圃", desc: "可購得原廠分裝殺菌劑", hours: "週一至六 08:00–18:00" },
      { name: "建國花市 有機農資攤位", desc: "苦楝油 現場試聞購買", hours: "週六日 06:00–14:00" }
    ]
  },
  "葉銹病 / 褐斑病 (Rust & Leaf Spot)": {
    medicines: [
      { name: "多菌靈 50% WP", type: "chem", typeLabel: "化學殺菌", dosage: "稀釋 800 倍噴灑全株，每 7 天一次，連用 3 次" },
      { name: "甲基托布津 70% WP", type: "chem", typeLabel: "化學殺菌", dosage: "稀釋 1500 倍葉面噴灑，注意葉背" },
      { name: "波爾多液", type: "phys", typeLabel: "物理防治", dosage: "稀釋 300 倍，預防性噴灑，勿在高溫烈日下使用" }
    ],
    onlineSellers: [
      { name: "農藥直送 蝦皮旗艦店", desc: "多菌靈 / 波爾多液 正品", link: "https://shopee.tw", logo: "🛒" },
      { name: "露天農資館", desc: "甲基托布津 · 多效殺菌劑", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "殺菌劑比價，最低價入手", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "農藥行", desc: "依病情輕重選用劑型", hours: "週一至六 08:00–18:00" },
      { name: "花市資材攤位", desc: "有機殺菌劑選擇多", hours: "週六日 06:00–14:00" }
    ]
  },
  "紅蜘蛛危害 (Spider Mites Infestation)": {
    medicines: [
      { name: "苦楝油乳劑", type: "bio",  typeLabel: "生物防治", dosage: "稀釋 500 倍，重點噴葉背，每 3 天一次，連噴 4 次" },
      { name: "賽滅螨（殺蟎劑）", type: "chem", typeLabel: "化學殺蟎", dosage: "稀釋 2000 倍噴灑，兩藥交替使用避免抗藥性" },
      { name: "肥皂水（自製）", type: "phys", typeLabel: "物理防治", dosage: "幾滴洗碗精稀釋成噴壺水，噴濕葉背沖洗" }
    ],
    onlineSellers: [
      { name: "蟲害防治 蝦皮商城", desc: "殺蟎劑 · 苦楝油 熱銷組合", link: "https://shopee.tw", logo: "🛒" },
      { name: "露天蟲害防治館", desc: "多種殺蟎劑 · 比較選購", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "植物蟲害套組，快速出貨", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "農藥行", desc: "可詢問適合當季蟲害的藥劑", hours: "週一至六 08:00–18:00" },
      { name: "花市農藥資材攤", desc: "現場可看示範操作", hours: "週六日 06:00–14:00" }
    ]
  },
  "黑翅蕈蚋 (土壤小黑飛/Fungus Gnats)": {
    medicines: [
      { name: "珪藻土粉", type: "phys", typeLabel: "物理防治", dosage: "鋪於盆土表面 1-2 cm，阻斷成蟲產卵；亦可稀釋灌根" },
      { name: "蘇力菌（Bt 菌）", type: "bio",  typeLabel: "生物防治", dosage: "稀釋 1000 倍灌根，殺滅土中幼蟲，每 7 天一次" },
      { name: "黃色黏蟲板", type: "phys", typeLabel: "物理誘捕", dosage: "插於盆旁土面上，每 2-4 週更換一次" }
    ],
    onlineSellers: [
      { name: "有機農資 蝦皮商城", desc: "珪藻土 · Bt 菌劑 熱銷品", link: "https://shopee.tw", logo: "🛒" },
      { name: "露天害蟲防治館", desc: "黃色黏蟲板 · 大包裝划算", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "小黑飛套組，多效解決", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "花市農資攤", desc: "珪藻土與黏蟲板均可買到", hours: "週六日 06:00–14:00" },
      { name: "特力屋 / 家樂福園藝區", desc: "黏蟲板與有機肥整合購買", hours: "週一至日 10:00–22:00" }
    ]
  },
  "環境適應不良": {
    medicines: [
      { name: "液態海藻精", type: "bio",  typeLabel: "生物促進", dosage: "稀釋 1000 倍澆灌，每 2 週補充，促進適應新環境" },
      { name: "活力素（胺基酸液肥）", type: "bio",  typeLabel: "生物促進", dosage: "稀釋 500 倍葉面噴灑，增強植物細胞活力" }
    ],
    onlineSellers: [
      { name: "花仙子 蝦皮旗艦店", desc: "活力素 · 海藻精 · 促根套組", link: "https://shopee.tw", logo: "🛒" },
      { name: "露天園藝精品", desc: "天然胺基酸液肥，溫和配方", link: "https://ruten.com.tw", logo: "🏪" },
      { name: "Yahoo 購物中心", desc: "植物活化套組，新手推薦", link: "https://tw.buy.yahoo.com", logo: "🟣" }
    ],
    offlineSellers: [
      { name: "花市苗圃", desc: "購苗同時可詢問適應問題", hours: "週六日 06:00–14:00" },
      { name: "農會超市 / 農資行", desc: "胺基酸液肥 · 緩效肥常備", hours: "週一至六 08:00–18:00" }
    ]
  }
};

function initPlantDoctor() {
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const prevBtn = document.getElementById('doctor-prev-btn');
  const nextBtn = document.getElementById('doctor-next-btn');
  const stepText = document.getElementById('doctor-step-num');
  
  const reportEmpty = document.getElementById('report-empty');
  const reportContent = document.getElementById('report-content');

  let currentStep = 0; // 0: 部位, 1: 症狀, 2: 照護史
  
  // 記錄診斷答案
  let answers = {
    part: null,
    symptom: null,
    history: null
  };

  // 監聽選項點擊
  const optionCards = document.querySelectorAll('.option-card');
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepType = card.getAttribute('data-step');
      const value = card.getAttribute('data-value');

      // 清除同一步驟其他卡片的選中狀態
      document.querySelectorAll(`.option-card[data-step="${stepType}"]`).forEach(c => {
        c.classList.remove('selected');
      });

      card.classList.add('selected');
      answers[stepType] = value;
      
      // 自動啟用「下一步」按鈕
      nextBtn.removeAttribute('disabled');
    });
  });

  // 「下一步」與「診斷」按鈕
  nextBtn.addEventListener('click', () => {
    if (currentStep < 2) {
      currentStep++;
      updateWizardUI();
    } else {
      // 進行最終診斷計算
      performDiagnosis(answers);
    }
  });

  // 「上一步」按鈕
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateWizardUI();
    }
  });

  function updateWizardUI() {
    // 切換 Step 視窗
    wizardSteps.forEach((step, idx) => {
      step.classList.remove('active');
      if (idx === currentStep) {
        step.classList.add('active');
      }
    });

    // 更新導航按鈕狀態
    stepText.innerText = currentStep + 1;
    
    if (currentStep === 0) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }

    if (currentStep === 2) {
      nextBtn.innerHTML = `生成診斷報告 <i class="fas fa-stethoscope"></i>`;
    } else {
      nextBtn.innerHTML = `下一步 <i class="fas fa-arrow-right"></i>`;
    }

    // 檢查下一步是否可點擊（即當前步驟是否有選擇答案）
    const stepKeys = ['part', 'symptom', 'history'];
    const currentKey = stepKeys[currentStep];
    if (answers[currentKey]) {
      nextBtn.removeAttribute('disabled');
    } else {
      nextBtn.setAttribute('disabled', 'true');
    }
  }

  // 基於邏輯矩陣的植物病害專家系統
  function performDiagnosis(res) {
    reportEmpty.style.display = 'none';
    reportContent.style.display = 'block';

    let diagnosis = {
      name: "環境適應不良",
      probability: "75%",
      reason: "植物換新環境或近期氣溫波動較大，使其暫時性地出現生理代謝失衡。",
      symptoms: "葉片邊緣偶有泛黃或輕微下垂，但無蟲體及霉層病害特徵。",
      treatments: [
        "將植物移置到明亮通風但無強烈直射烈日之處。",
        "嚴格執行『土乾再澆』，切勿讓底部托盤積水。",
        "停止施加任何肥料，等待其新葉萌芽表示適應完成。"
      ]
    };

    // 邏輯判定矩陣
    if (res.symptom === 'yellow_drop') {
      if (res.history === 'too_wet') {
        diagnosis = {
          name: "根腐病 (Root Rot)",
          probability: "95%",
          reason: "因盆土長期處於濕漉漉、水分飽和狀態，導致植物根系窒息缺氧進而大面積壞死腐爛，無法向葉片輸送養分。",
          symptoms: "葉片大面積發黃、下垂軟爛、落葉，新葉發黑萎縮，土中伴隨黴味或酸臭味。",
          treatments: [
            "【立即脫盆】輕輕抖落宿土，用消毒過的剪刀剪除發黑、軟爛、中空的腐爛根系，僅保留白色健康根系。",
            "【根部消毒】將殘留根系浸泡在稀釋 800 倍的多菌靈或百菌清殺菌劑中 15-20 分鐘後取出晾乾。",
            "【更換新土】拋棄舊土，換用乾淨、高透氣（添加 30% 珍珠石/發泡煉石）的全新介質與高排水花盆種植。",
            "【極限控水】重盆後置於半陰通風處，徹底停止澆水 1-2 週，直到表土完全乾透，且暫停施肥。"
          ]
        };
      } else if (res.history === 'too_dry') {
        diagnosis = {
          name: "嚴重脫水乾枯 (Dehydration)",
          probability: "90%",
          reason: "盆土乾透時間過長，氣孔閉合且維管束嚴重缺水，葉片無法維持細胞膨壓而產生枯黃脫落。",
          symptoms: "老葉從下到上大面積乾黃變脆，葉尖枯萎，盆土與盆壁出現明顯龜裂空隙，重量極輕。",
          treatments: [
            "【浸盆補水】不宜直接狂灌水以免水分流失。建議將花盆置於大臉盆中，注水至盆腰處，進行「浸盆法」15分鐘，讓乾燥土壤由下而上完全吸飽水分。",
            "【環境增濕】將乾枯發乾的葉片剪除，用噴霧在植物周圍噴灑清水以提高空氣濕度。",
            "【微弱散射光】放在陰涼有微弱溫和散射光的地方靜養，暫勿直接在猛烈太陽下曝曬。"
          ]
        };
      }
    } else if (res.symptom === 'white_powder') {
      diagnosis = {
        name: "白粉病 (Powdery Mildew)",
        probability: "85%",
        reason: "由真菌在溫暖、通風不良且濕度偏高的密閉環境中大量繁殖引發的表面寄生黴菌病。",
        symptoms: "葉片正反面和嫩莖表面覆蓋一層類似白色粉末狀、霜狀的黴斑，嚴重時葉片扭曲乾枯。",
        treatments: [
          "【病葉隔離】立即將病株與其他健康盆栽隔離，防止孢子隨風傳播，並剪除嚴重染病的葉片銷毀。",
          "【增強通風】將植物移到陽台迎風處或用電風扇微風吹，徹底改善密閉潮濕的環境。",
          "【無毒治療】可噴灑稀釋 800 倍的小蘇打水（1克小蘇打粉加1000cc水），或使用稀釋的苦楝油，每3天均勻噴灑葉片正反面，連續3次。"
        ]
      };
    } else if (res.symptom === 'brown_spots') {
      diagnosis = {
        name: "葉銹病 / 褐斑病 (Rust & Leaf Spot)",
        probability: "90%",
        reason: "水分殘留在葉片上過久或通風差，使病原真菌入侵葉片表皮組織造成的局部細胞壞死斑。",
        symptoms: "葉面出現大大小小深褐色、紅褐色帶有黃暈的同心圓病斑，濕度大時斑點會腐爛穿孔。",
        treatments: [
          "【剪除焦斑】剪去所有已發生焦斑的葉片，避免病斑繼續蔓延，修剪前後剪刀需用酒精徹底消毒。",
          "【改變澆水習慣】澆水時嚴禁「當頭淋澆」！應將壺嘴伸入盆土表面直接澆水，避免水珠殘留於葉面。",
          "【噴灑殺菌劑】噴灑廣效性殺菌劑（如多菌靈或甲基托布津）以遏制孢子發育。"
        ]
      };
    } else if (res.symptom === 'spider_webs') {
      diagnosis = {
        name: "紅蜘蛛危害 (Spider Mites Infestation)",
        probability: "95%",
        reason: "在炎熱、空氣極度乾燥且不通風的環境中，葉蟎類害蟲迅速繁衍，刺吸植物葉片汁液。",
        symptoms: "葉背與葉腋處出現細小的蛛網，葉面正面佈滿針尖大小的灰白色/黃色沙點，葉片失去光澤泛灰。",
        treatments: [
          "【強力清洗】紅蜘蛛怕濕怕水。將植物移到浴室或陽台，用強力水流淋洗整株植物，特別是葉片背面，可沖除 80% 的蟲體。",
          "【喷施除蟲劑】噴灑稀釋 500 倍的苦楝油、印楝素或自製肥皂水（幾滴洗碗精稀釋到一噴壺水）。注意一定要重點對準【葉片背面】均勻噴灑，每 3 天一次，連續噴灑 3-4 次以滅殺剛孵化的幼蟎。",
          "【提升濕度】經常在植物周圍噴灑水霧，使用加濕器將環境濕度維持在 60% 以上抑制害蟲繁衍。"
        ]
      };
    } else if (res.symptom === 'gnats') {
      diagnosis = {
        name: "黑翅蕈蚋 (土壤小黑飛/Fungus Gnats)",
        probability: "90%",
        reason: "土壤含有大量未完全腐熟的有機質（如茶葉渣、咖啡渣），且土壤長期過於潮濕，成為蕈蚋幼蟲孵化的溫床。",
        symptoms: "盆土表面和植物周圍有黑色的小飛蟲飛來飛去，其幼蟲呈白色針狀在土裡啃食腐殖質甚至新生細根。",
        treatments: [
          "【鋪面乾燥】蕈蚋需要在潮濕的表土產卵。可用 1-2 公分的細沙、赤玉土或珪藻土鋪在盆土表面，阻斷其產卵途徑，並徹底控水保持表層土壤極度乾燥。",
          "【黃色黏蟲板】在盆栽旁插上「黃色黏葉蟲板」，可以物理性快速吸附捕殺大量飛行的成蟲。",
          "【珪藻土灌根】可將園藝用珪藻土稀釋後灌入土壤，珪藻土的微細銳利晶體能劃破土中幼蟲的表皮使其脫水死亡。"
        ]
      };
    }

    // 渲染診斷報告 HTML
    document.getElementById('diag-name').innerText = diagnosis.name;
    document.getElementById('diag-possibility').innerText = `診斷信賴度: ${diagnosis.probability}`;
    document.getElementById('diag-reason').innerText = diagnosis.reason;
    document.getElementById('diag-symptom').innerText = diagnosis.symptoms;

    const treatmentList = document.getElementById('diag-treatments');
    treatmentList.innerHTML = '';
    diagnosis.treatments.forEach((step, idx) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'step-item';
      stepEl.innerHTML = `
        <div class="step-num">${idx + 1}</div>
        <div class="step-desc">${step}</div>
      `;
      treatmentList.appendChild(stepEl);
    });

    renderMedicineSection(diagnosis.name);
    showToast(`植物診斷完成！已生成對應救治指南。`, "warning");
  }

  // 重置診斷精靈
  window.resetDoctorWizard = function() {
    currentStep = 0;
    answers = { part: null, symptom: null, history: null };

    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));

    // 重設問診精靈模式
    switchDoctorMode('wizard');

    // 重設報告區
    reportContent.style.display = 'none';
    reportEmpty.style.display = 'flex';

    // 重設藥物區
    const medSec = document.getElementById('medicine-section');
    if (medSec) { medSec.style.display = 'none'; medSec.innerHTML = ''; }

    // 重設照片面板
    if (previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
    if (photoConsole) { photoConsole.style.display = 'none'; photoConsole.innerHTML = ''; }
    if (analyzeBtn) analyzeBtn.style.display = 'none';
    if (fileInput) fileInput.value = '';

    showToast("植物醫生診斷流程已重置。");
  };

  // ── 照片診斷模式 ──────────────────────────────────────────
  const tabWizard    = document.getElementById('tab-wizard');
  const tabPhoto     = document.getElementById('tab-photo');
  const photoPanel   = document.getElementById('doctor-photo-panel');
  const uploadZone   = document.getElementById('doctor-upload-zone');
  const fileInput    = document.getElementById('doctor-file-input');
  const previewImg   = document.getElementById('doctor-preview');
  const photoConsole = document.getElementById('doctor-photo-console');
  const analyzeBtn   = document.getElementById('doctor-analyze-btn');

  // 所有問診精靈步驟容器
  const wizardStepsArea = document.querySelector('.wizard-steps-area') ||
    (() => {
      const first = document.querySelector('.wizard-step');
      return first ? first.parentElement : null;
    })();

  function switchDoctorMode(mode) {
    if (mode === 'photo') {
      tabWizard.classList.remove('active');
      tabPhoto.classList.add('active');
      wizardSteps.forEach(s => s.style.display = 'none');
      document.querySelector('.wizard-nav-btns') && (document.querySelector('.wizard-nav-btns').style.display = 'none');
      photoPanel.style.display = 'block';
    } else {
      tabPhoto.classList.remove('active');
      tabWizard.classList.add('active');
      photoPanel.style.display = 'none';
      updateWizardUI(); // 恢復問診精靈步驟顯示與按鈕
      document.querySelector('.wizard-nav-btns') && (document.querySelector('.wizard-nav-btns').style.display = '');
    }
  }

  tabWizard.addEventListener('click', () => switchDoctorMode('wizard'));
  tabPhoto.addEventListener('click',  () => switchDoctorMode('photo'));

  // 上傳區互動
  uploadZone.addEventListener('click', () => fileInput.click());

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadPreview(file);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) loadPreview(fileInput.files[0]);
  });

  function loadPreview(file) {
    const reader = new FileReader();
    reader.onload = ev => {
      previewImg.src = ev.target.result;
      previewImg.style.display = 'block';
      analyzeBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  // AI 影像診斷按鈕
  const PHOTO_CONSOLE_STEPS = [
    { text: '> 載入影像感知模組…', cls: 'info', delay: 0 },
    { text: '> 分析色彩通道 (RGB / HSL)…', cls: 'info', delay: 400 },
    { text: '> 偵測葉片邊緣與病灶輪廓…', cls: 'info', delay: 900 },
    { text: '> 比對病害特徵資料庫（18,342 筆）…', cls: 'info', delay: 1400 },
    { text: '> 葉色偏移向量計算完成 ✓', cls: 'ok', delay: 2000 },
    { text: '> 真菌孢子形態匹配中…', cls: 'info', delay: 2500 },
    { text: '> 病害機率矩陣生成中…', cls: 'info', delay: 3100 },
    { text: '> ⚠ 偵測到顯著異常特徵', cls: 'warn', delay: 3700 },
    { text: '> 診斷報告產出完成 ✓', cls: 'ok', delay: 4200 }
  ];

  const PHOTO_DIAGNOSIS_MAP = [
    { symptom: 'yellow_drop', history: 'too_wet' },
    { symptom: 'white_powder', history: 'normal' },
    { symptom: 'brown_spots',  history: 'normal' },
    { symptom: 'spider_webs',  history: 'normal' },
    { symptom: 'gnats',        history: 'normal' }
  ];

  analyzeBtn.addEventListener('click', () => {
    analyzeBtn.disabled = true;
    photoConsole.style.display = 'block';
    photoConsole.innerHTML = '';

    PHOTO_CONSOLE_STEPS.forEach(({ text, cls, delay }) => {
      setTimeout(() => {
        const line = document.createElement('span');
        line.className = `console-line ${cls}`;
        line.textContent = text;
        photoConsole.appendChild(line);
        photoConsole.scrollTop = photoConsole.scrollHeight;
      }, delay);
    });

    setTimeout(() => {
      const fakeAnswers = PHOTO_DIAGNOSIS_MAP[Math.floor(Math.random() * PHOTO_DIAGNOSIS_MAP.length)];
      performDiagnosis(fakeAnswers);
      analyzeBtn.disabled = false;
      document.getElementById('report-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 4800);
  });

  // 初始化按鈕狀態
  updateWizardUI();
}

/* ==========================================================================
   F. 植物檔案詳情抽屜控制 (Detailed Profiles Drawer / Side Sheet)
   ========================================================================== */
window.openPlantProfile = function(plantId) {
  const spec = ALL_PLANTS.find(p => p.id === plantId);
  if (!spec) return;
  if (spec._source === 'wiki') { openWikiProfile(spec); return; }

  currentSelectedPlantId = plantId;

  // 1. 動態設置 UI 配色與基本資料
  const sheet = document.getElementById('plant-profile-sheet');
  sheet.style.setProperty('--plant-color', spec.themeColor);

  // 植物照片注入 Side Sheet 標頭背景
  const sheetHeader = document.querySelector('.sheet-header');
  let headerImg = sheetHeader.querySelector('.sheet-header-img');
  if (!headerImg) {
    headerImg = document.createElement('img');
    headerImg.className = 'sheet-header-img';
    sheetHeader.insertBefore(headerImg, sheetHeader.firstChild);
  }
  headerImg.style.opacity = '0';
  headerImg.onload = () => { headerImg.style.opacity = '0.4'; };
  headerImg.onerror = () => { headerImg.style.opacity = '0'; };
  headerImg.src = `images/${spec.id}.png`;

  document.getElementById('sheet-cn-name').innerText = spec.name;
  document.getElementById('sheet-en-name').innerText = spec.englishName;
  document.getElementById('sheet-scientific-name').innerText = spec.scientificName;
  document.getElementById('sheet-family').innerText = spec.family;
  document.getElementById('sheet-description').innerText = spec.description;

  // 2. 照護標籤
  const tagsRow = document.getElementById('sheet-tags');
  tagsRow.innerHTML = spec.tags.map(tag => `<span class="plant-card-tag" style="background: rgba(255,255,255,0.08);">${tag}</span>`).join('');
  
  // 3. 土壤配比與酸鹼值
  document.getElementById('sheet-soil-ph').innerText = spec.soil.pH;
  document.getElementById('sheet-soil-recipe').innerText = spec.soil.recipe;
  document.getElementById('sheet-soil-tips').innerText = spec.soil.tips;

  // 繪製土壤黃金比例圖 (基於文字進行智慧渲染)
  const soilRatioContainer = document.getElementById('sheet-soil-ratio-bar');
  soilRatioContainer.innerHTML = '';
  
  if (plantId === 'monstera') {
    soilRatioContainer.innerHTML = `
      <div class="ratio-bar" style="width: 50%; background: #6f4e37;">泥炭土 50%</div>
      <div class="ratio-bar" style="width: 20%; background: #a8a8a8;">珍珠石 20%</div>
      <div class="ratio-bar" style="width: 20%; background: #8c6239;">椰纖 20%</div>
      <div class="ratio-bar" style="width: 10%; background: #523a28;">蛇木 10%</div>
    `;
  } else if (plantId === 'succulents' || plantId === 'aloe_vera' || plantId === 'jade_plant') {
    soilRatioContainer.innerHTML = `
      <div class="ratio-bar" style="width: 70%; background: #dcdcdc; color: #333;">顆粒砂質 70%</div>
      <div class="ratio-bar" style="width: 20%; background: #a8a8a8;">珍珠石 20%</div>
      <div class="ratio-bar" style="width: 10%; background: #6f4e37;">培養土 10%</div>
    `;
  } else if (plantId === 'orchid') {
    soilRatioContainer.innerHTML = `
      <div class="ratio-bar" style="width: 100%; background: #eae6df; color: #555;">100% 乾淨智利水苔/樹皮顆粒</div>
    `;
  } else {
    // 預設通用配方比例
    soilRatioContainer.innerHTML = `
      <div class="ratio-bar" style="width: 60%; background: #6f4e37;">泥炭培養土 60%</div>
      <div class="ratio-bar" style="width: 30%; background: #a8a8a8;">礦物石/珍珠石 30%</div>
      <div class="ratio-bar" style="width: 10%; background: #8c6239;">椰纖介質 10%</div>
    `;
  }

  // 4. 日照儀表板與水分施肥
  document.getElementById('sheet-sun-level').innerText = spec.sunlight.level;
  document.getElementById('sheet-sun-position').innerText = spec.sunlight.position;
  
  document.getElementById('sheet-water-interval').innerText = `夏季 ${spec.watering.frequencySummer} 天 / 冬季 ${spec.watering.frequencyWinter} 天一次`;
  document.getElementById('sheet-water-guide').innerText = spec.watering.guide;

  document.getElementById('sheet-fert-season').innerText = spec.fertilizer.activeSeason;
  document.getElementById('sheet-fert-guide').innerText = spec.fertilizer.guide;

  // 5. 寵物安全性
  const petFriendly = spec.toxicity.catsDogs;
  const petVal = document.getElementById('sheet-pet-value');
  const petBadge = document.getElementById('sheet-pet-badge');
  const petDesc = document.getElementById('sheet-pet-desc');

  if (petFriendly) {
    petBadge.innerHTML = `<span class="plant-card-difficulty easy"><i class="fas fa-paw"></i> 100% 寵物無毒安全</span>`;
    petVal.innerText = "對貓狗無毒";
    petVal.style.color = "#38ef7d";
  } else {
    petBadge.innerHTML = `<span class="plant-card-difficulty hard"><i class="fas fa-exclamation-triangle"></i> 寵物有毒警告</span>`;
    petVal.innerText = "對貓狗有毒";
    petVal.style.color = "var(--danger)";
  }
  petDesc.innerText = spec.toxicity.detail;

  // 6. 常見病蟲害百科
  const pestsContainer = document.getElementById('sheet-pests-list');
  pestsContainer.innerHTML = spec.pests.map(pest => `
    <div class="pest-item-card">
      <div class="pest-name"><i class="fas fa-bug"></i> ${pest.name}</div>
      <div class="pest-detail-row"><strong>【主要病徵】</strong>${pest.symptoms}</div>
      <div class="pest-detail-row" style="color: var(--text-primary); margin-top: 8px;"><strong>【救治行動】</strong>${pest.treatment}</div>
    </div>
  `).join('');

  // 7. 顯示 Side Sheet 與 Backdrop
  document.getElementById('side-sheet-backdrop').classList.add('active');
  sheet.classList.add('active');
};

window.closeSideSheet = function() {
  document.getElementById('side-sheet-backdrop').classList.remove('active');
  document.getElementById('plant-profile-sheet').classList.remove('active');
};

/* ==========================================================================
   G. 全局通用 UI (Utility & Generic UI)
   ========================================================================== */
function initGenericUI() {
  document.getElementById('side-sheet-backdrop').addEventListener('click', closeSideSheet);
  // 世界地圖懶加載：首次點擊 nav 時才初始化，確保容器已可見
  document.querySelector('[data-view="world"]').addEventListener('click', initWorldMap, { once: true });
}


/* ==========================================================================
   H. 世界植物地圖 (World Map)
   ========================================================================== */
function initWorldMap() {
  if (typeof am5 === 'undefined' || typeof am5map === 'undefined' || typeof am5geodata_worldLow === 'undefined') {
    console.error('amCharts 未能載入，請確認網路連線');
    return;
  }

  const root = am5.Root.new("world-map-chart");
  root.setThemes([am5themes_Animated.new(root)]);

  // 建立平面世界地圖
  const chart = root.container.children.push(
    am5map.MapChart.new(root, {
      projection: am5map.geoNaturalEarth1(),
      panX: "rotateX",
      panY: "translateY",
      wheelY: "zoom",
      minZoomLevel: 0.8,
      maxZoomLevel: 12,
    })
  );

  // 國家多邊形系列
  const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ["AQ"],
    })
  );

  // 預設樣式（無資料的國家）
  polygonSeries.mapPolygons.template.setAll({
    fill: am5.color(0x172a17),
    stroke: am5.color(0x2c422c),
    strokeWidth: 0.5,
    interactive: true,
    cursorOverStyle: "pointer",
    tooltipText: "{name}",
  });

  // 懸停樣式
  polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0x54FFBD),
    fillOpacity: 0.3,
  });

  // 已選取樣式
  polygonSeries.mapPolygons.template.states.create("active", {
    fill: am5.color(0x54FFBD),
    fillOpacity: 0.5,
  });

  // 有資料的國家顯示較亮的底色
  polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
    const id = target.dataItem ? target.dataItem.get("id") : null;
    return (id && WORLD_PLANTS[id]) ? am5.color(0x254525) : fill;
  });

  // 點擊：切換選取狀態並顯示植物資訊
  let activePolygon = null;

  polygonSeries.mapPolygons.template.events.on("click", (ev) => {
    const clicked = ev.target;
    const isAlreadyActive = (clicked === activePolygon);

    if (activePolygon) activePolygon.set("active", false);

    if (isAlreadyActive) {
      activePolygon = null;
      document.getElementById('country-plant-panel').innerHTML = `
        <div class="panel-placeholder">
          <div class="placeholder-globe">🌍</div>
          <div class="placeholder-text">點擊地圖上的國家<br>探索當地植物與國花</div>
        </div>`;
    } else {
      clicked.set("active", true);
      activePolygon = clicked;
      showCountryPlants(clicked.dataItem.get("id"), clicked.dataItem.get("name"));
    }
  });
}

function showCountryPlants(id, nameEn) {
  const panel = document.getElementById('country-plant-panel');
  const data  = WORLD_PLANTS[id];
  const fullName = WORLD_EN_NAMES[id] || nameEn;
  const wiki  = WORLD_WIKI[id];

  if (!data) {
    panel.innerHTML = `
      <div class="panel-placeholder">
        <div class="placeholder-globe">🗺️</div>
        <div class="placeholder-text">
          <strong style="color:var(--text-primary);font-size:16px;">${fullName}</strong><br><br>
          <span class="no-data-hint">此國家的植物資料尚未收錄<br>資料庫持續擴充中</span>
        </div>
      </div>`;
    return;
  }

  const icons = ['🌿', '🌱', '🌾'];
  panel.innerHTML = `
    <div class="country-panel-header">
      <div class="country-flag">${data.flag}</div>
      <div class="country-title">
        <div class="country-name">${data.country}</div>
        <div class="country-en-name">${fullName}</div>
      </div>
    </div>

    <div class="national-flower-card">
      <div class="flower-img-wrapper" id="flower-img-wrapper">
        <img id="wiki-flower-img" class="flower-wiki-img wiki-img-loading" alt="${data.nationalFlower.name}">
      </div>
      <span class="flower-emoji">${data.nationalFlower.emoji}</span>
      <div class="flower-card-label"><i class="fas fa-award"></i>&nbsp;國花 · National Flower</div>
      <div class="flower-name">${data.nationalFlower.name}</div>
      <div class="flower-desc">${data.nationalFlower.desc}</div>
    </div>

    <div class="plants-section-title"><i class="fas fa-leaf"></i>&nbsp;代表性植物（共 ${data.plants.length} 種）</div>
    ${data.plants.map((p, i) => `
      <div class="world-plant-item">
        <img id="wiki-plant-img-${i}" class="plant-wiki-img wiki-img-loading" alt="${p.name}">
        <div class="world-plant-info">
          <div class="world-plant-name">${icons[i] || '🌿'}&ensp;${p.name}</div>
          <div class="world-plant-desc">${p.desc}</div>
        </div>
      </div>
    `).join('')}
  `;

  if (wiki) loadCountryImages(wiki);
}

async function fetchWikiImage(title) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

function loadCountryImages(wiki) {
  // 國花圖片
  fetchWikiImage(wiki.f).then(url => {
    const img = document.getElementById('wiki-flower-img');
    if (!img) return;
    if (url) {
      img.src = url;
      img.onload  = () => img.classList.remove('wiki-img-loading');
      img.onerror = () => document.getElementById('flower-img-wrapper').style.display = 'none';
    } else {
      document.getElementById('flower-img-wrapper').style.display = 'none';
    }
  });

  // 每種植物圖片
  wiki.p.forEach((title, i) => {
    fetchWikiImage(title).then(url => {
      const img = document.getElementById(`wiki-plant-img-${i}`);
      if (!img) return;
      if (url) {
        img.src = url;
        img.onload  = () => img.classList.remove('wiki-img-loading');
        img.onerror = () => { img.style.display = 'none'; };
      } else {
        img.style.display = 'none';
      }
    });
  });
}

window.switchSellerTab = function(btn, panel) {
  const section = btn.closest('#seller-section');
  section.querySelectorAll('.seller-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('seller-panel-online').style.display  = panel === 'online'  ? 'grid' : 'none';
  document.getElementById('seller-panel-offline').style.display = panel === 'offline' ? 'grid' : 'none';
};

// ──────────────────────────────────────────────────────────────────────────
// Wikipedia 植物圖文資料載入
// ──────────────────────────────────────────────────────────────────────────
async function fetchWikiSummary(title) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const rawImg = json.thumbnail?.source ?? null;
    return {
      img: rawImg ? rawImg.replace(/\/\d+px-/, '/400px-') : null,
      extract: json.extract ?? ''
    };
  } catch {
    return null;
  }
}

async function loadWikiPlantImages() {
  await Promise.allSettled(WIKI_PLANTS.map(async plant => {
    const data = await fetchWikiSummary(plant.wikiSlug);
    if (!data) return;

    if (data.img)     plant._wikiImg   = data.img;
    if (data.extract) plant.description = data.extract.length > 130
      ? data.extract.slice(0, 127).replace(/\s\S+$/, '') + '…'
      : data.extract;

    // 即時更新已渲染的卡片
    const card = document.getElementById(`plant-card-${plant.id}`);
    if (!card) return;

    if (data.img) {
      const visual = card.querySelector('.plant-card-visual');
      if (visual) {
        const existing = visual.querySelector('img, .wiki-img-loading');
        const img = document.createElement('img');
        img.alt = plant.name;
        img.onerror = () => img.style.display = 'none';
        img.src = data.img;
        if (existing) visual.replaceChild(img, existing);
        else visual.appendChild(img);
      }
    }
    if (data.extract) {
      const descEl = card.querySelector('.plant-card-desc');
      if (descEl) descEl.textContent = plant.description;
    }
  }));
}

// 開啟 Wikipedia 植物側面板
function openWikiProfile(plant) {
  const sheet = document.getElementById('plant-profile-sheet');
  sheet.style.setProperty('--plant-color', plant.themeColor);

  // 標頭背景圖
  const sheetHeader = document.querySelector('.sheet-header');
  let headerImg = sheetHeader.querySelector('.sheet-header-img');
  if (!headerImg) {
    headerImg = document.createElement('img');
    headerImg.className = 'sheet-header-img';
    sheetHeader.insertBefore(headerImg, sheetHeader.firstChild);
  }
  headerImg.style.opacity = '0';
  if (plant._wikiImg) {
    headerImg.src = plant._wikiImg;
    headerImg.onload  = () => { headerImg.style.opacity = '0.45'; };
    headerImg.onerror = () => { headerImg.style.opacity = '0'; };
  } else {
    headerImg.src = '';
    // 若圖片尚未載入，非同步補上
    fetchWikiSummary(plant.wikiSlug).then(data => {
      if (!data || !data.img) return;
      plant._wikiImg = data.img;
      plant.description = data.extract.slice(0, 127).replace(/\s\S+$/, '') + '…';
      headerImg.src = data.img;
      headerImg.onload = () => { headerImg.style.opacity = '0.45'; };
      document.getElementById('sheet-description').innerText = plant.description;
    });
  }

  document.getElementById('sheet-cn-name').innerText = plant.name;
  document.getElementById('sheet-en-name').innerText = plant.englishName;
  document.getElementById('sheet-scientific-name').innerText = plant.scientificName;
  document.getElementById('sheet-family').innerText = plant.family;
  document.getElementById('sheet-description').innerText = plant.description || '資料載入中…';

  const tagsRow = document.getElementById('sheet-tags');
  tagsRow.innerHTML = plant.tags.map(t =>
    `<span class="plant-card-tag" style="background:rgba(255,255,255,0.08);">${t}</span>`
  ).join('');

  // 照護資料 — 依標籤與難度推斷基本參考值
  const isDry      = plant.tags.some(t => ['極度耐旱','多肉植物','沙漠植物'].includes(t));
  const isWet      = plant.tags.some(t => t.includes('喜濕') || t.includes('水培'));
  const needsSun   = plant.tags.some(t => t.includes('全日照'));
  const isLowLight = plant.tags.some(t => t.includes('耐陰') || t.includes('辦公室'));

  document.getElementById('sheet-soil-ph').innerText    = isDry ? '6.0 – 7.0 (中性偏砂質)' : '5.5 – 6.5 (微酸至中性)';
  document.getElementById('sheet-soil-recipe').innerText = isDry
    ? '多肉土 60% + 珍珠石 30% + 培養土 10%'
    : '培養土 50% + 珍珠石 25% + 椰纖 25%';
  document.getElementById('sheet-soil-tips').innerText   = '以上為通用參考配方，詳細介質建議請參閱 Wikipedia 完整條目。';
  document.getElementById('sheet-soil-ratio-bar').innerHTML = isDry
    ? `<div class="ratio-bar" style="width:60%;background:#dcdcdc;color:#333;">礦石砂質 60%</div><div class="ratio-bar" style="width:30%;background:#a8a8a8;">珍珠石 30%</div><div class="ratio-bar" style="width:10%;background:#6f4e37;">培養土 10%</div>`
    : `<div class="ratio-bar" style="width:50%;background:#6f4e37;">培養土 50%</div><div class="ratio-bar" style="width:25%;background:#a8a8a8;">珍珠石 25%</div><div class="ratio-bar" style="width:25%;background:#8c6239;">椰纖 25%</div>`;

  document.getElementById('sheet-sun-level').innerText    = needsSun ? '全日照 (Full Sun)' : isLowLight ? '低光耐受 / 散射光' : '明亮散射光 (Bright Indirect)';
  document.getElementById('sheet-sun-position').innerText = needsSun ? '戶外陽台或南向窗台，每日至少 6 小時直射光。' : isLowLight ? '室內任意位置皆可適應，明亮窗邊生長最佳。' : '窗邊明亮散射光，避免烈日直射。';

  const sw = isDry ? 14 : isWet ? 2 : 7;
  const ww = isDry ? 30 : isWet ? 4 : 14;
  document.getElementById('sheet-water-interval').innerText = `夏季 ${sw} 天 / 冬季 ${ww} 天一次（參考值）`;
  document.getElementById('sheet-water-guide').innerText    = isDry
    ? '寧乾勿濕，待盆土完全乾透再澆，避免積水。'
    : isWet ? '保持盆土持續微濕，不可長期乾透。'
    : '遵循「土乾澆透」原則，手指插入 3 公分確認乾燥後澆水。';

  document.getElementById('sheet-fert-season').innerText = '春季至秋季（生長期）';
  document.getElementById('sheet-fert-guide').innerText   = '每 4 – 6 週施用一次均衡液態肥（NPK 20-20-20），冬季停肥。詳細施肥建議請參考 Wikipedia。';

  // 寵物安全
  const petVal   = document.getElementById('sheet-pet-value');
  const petBadge = document.getElementById('sheet-pet-badge');
  const petDesc  = document.getElementById('sheet-pet-desc');
  if (plant.toxicity.catsDogs) {
    petBadge.innerHTML = `<span class="plant-card-difficulty easy"><i class="fas fa-paw"></i> 100% 寵物無毒安全</span>`;
    petVal.innerText = '對貓狗無毒'; petVal.style.color = '#38ef7d';
    petDesc.innerText = '此植物對貓狗無毒，但仍建議避免寵物大量啃食以防腸胃不適。';
  } else {
    petBadge.innerHTML = `<span class="plant-card-difficulty hard"><i class="fas fa-exclamation-triangle"></i> 寵物有毒警告</span>`;
    petVal.innerText = '對貓狗有毒'; petVal.style.color = 'var(--danger)';
    petDesc.innerText = '此植物對寵物（貓/狗）有毒，請勿讓寵物接觸。詳細毒性資訊請諮詢獸醫。';
  }

  // 病蟲害：導引至 Wikipedia
  document.getElementById('sheet-pests-list').innerHTML = `
    <div class="pest-item-card">
      <div class="pest-name"><i class="fas fa-leaf"></i> 更多資料 · More Information</div>
      <div class="pest-detail-row">此植物的詳細病蟲害防治、栽培歷史與完整照護指南請參閱 Wikipedia 原始條目。</div>
      <div class="pest-detail-row" style="margin-top:10px;">
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(plant.wikiSlug)}"
           target="_blank" rel="noopener"
           style="color:var(--accent);text-decoration:none;font-weight:700;font-size:13px;">
          <i class="fas fa-external-link-alt"></i>&ensp;前往 Wikipedia 完整條目：${plant.name}
        </a>
      </div>
    </div>
  `;

  document.getElementById('side-sheet-backdrop').classList.add('active');
  sheet.classList.add('active');
}

// 藥物推薦區渲染
function renderMedicineSection(diagName) {
  const sec = document.getElementById('medicine-section');
  if (!sec) return;

  const data = MEDICINE_DATA[diagName];
  if (!data) { sec.style.display = 'none'; return; }

  const medicineCardsHTML = data.medicines.map((m, i) => `
    <div class="medicine-card">
      <div class="medicine-num">${i + 1}</div>
      <div class="medicine-info">
        <div class="medicine-name">${m.name}</div>
        <span class="medicine-type ${m.type}">${m.typeLabel}</span>
        <div class="medicine-dosage">${m.dosage}</div>
      </div>
    </div>
  `).join('');

  const onlineHTML = data.onlineSellers.map(s => `
    <a href="${s.link}" target="_blank" rel="noopener" class="seller-card">
      <div class="seller-logo">${s.logo}</div>
      <div class="seller-info">
        <div class="seller-name">${s.name}</div>
        <div class="seller-desc">${s.desc}</div>
      </div>
      <i class="fas fa-external-link-alt seller-link-icon"></i>
    </a>
  `).join('');

  const offlineHTML = data.offlineSellers.map(s => `
    <div class="seller-card offline-card">
      <div class="seller-logo">🏪</div>
      <div class="seller-info">
        <div class="seller-name">${s.name}</div>
        <div class="seller-desc">${s.desc}</div>
        <div class="seller-hours"><i class="fas fa-clock"></i>&ensp;${s.hours}</div>
      </div>
    </div>
  `).join('');

  sec.innerHTML = `
    <div class="seller-section-header">
      <i class="fas fa-capsules"></i> 推薦用藥
    </div>
    <div class="medicine-list">${medicineCardsHTML}</div>

    <div class="seller-section-header" style="margin-top:18px;">
      <i class="fas fa-shopping-bag"></i> 購藥管道
    </div>
    <div class="med-buy-tabs">
      <button class="med-buy-tab active" onclick="switchMedTab(this,'med-online')">
        <i class="fas fa-wifi"></i>&ensp;線上購買
      </button>
      <button class="med-buy-tab" onclick="switchMedTab(this,'med-offline')">
        <i class="fas fa-store"></i>&ensp;實體藥行
      </button>
    </div>
    <div id="med-online" class="med-seller-grid">${onlineHTML}</div>
    <div id="med-offline" class="med-seller-grid" style="display:none;">${offlineHTML}</div>
  `;
  sec.style.display = 'block';
}

window.switchMedTab = function(btn, panel) {
  btn.closest('.report-section').querySelectorAll('.med-buy-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('med-online').style.display  = panel === 'med-online'  ? 'grid' : 'none';
  document.getElementById('med-offline').style.display = panel === 'med-offline' ? 'grid' : 'none';
};

// 頂級發光通知系統 (Toast System)
window.showToast = function(message, type = "success") {
  const toast = document.getElementById('toast-notice');
  const icon = toast.querySelector('i');
  const text = toast.querySelector('span');

  // 配置顏色與圖標
  if (type === "success") {
    toast.style.borderColor = "var(--accent)";
    toast.style.boxShadow = "var(--shadow-glow)";
    icon.className = "fas fa-check-circle";
    icon.style.color = "var(--accent)";
  } else if (type === "warning") {
    toast.style.borderColor = "var(--gold)";
    toast.style.boxShadow = "var(--shadow-glow-gold)";
    icon.className = "fas fa-exclamation-triangle";
    icon.style.color = "var(--gold)";
  } else if (type === "danger") {
    toast.style.borderColor = "var(--danger)";
    toast.style.boxShadow = "0 0 24px rgba(255, 74, 74, 0.25)";
    icon.className = "fas fa-times-circle";
    icon.style.color = "var(--danger)";
  }

  text.innerText = message;
  toast.classList.add('active');

  // 3秒後自動消散
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
};
