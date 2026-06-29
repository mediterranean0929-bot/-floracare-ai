// FloraCare AI - 伺服器核心入口主模組 (server.js)

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. 中間件配置
app.use(cors());
app.use(express.json());

// 2. 初始化必備目錄（data, public, public/uploads）
const directories = [
  path.join(__dirname, 'data'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'public', 'uploads')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`已建立目錄: ${dir}`);
  }
});

// 3. 配置 Multer 圖片上傳引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    // 建立唯一檔案名稱，保留原始副檔名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'plant-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 最大 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只限上傳圖片檔案！'));
    }
  }
});

// 4. Helper 函數：讀取與寫入資料庫
const readJSONFile = (filePath, defaultData = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`讀取檔案錯誤 ${filePath}:`, err);
    return defaultData;
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`寫入檔案錯誤 ${filePath}:`, err);
    return false;
  }
};

// 檔案路徑變數
const plantsDbPath = path.join(__dirname, 'data', 'plants.json');
const gardenDbPath = path.join(__dirname, 'data', 'garden.json');

// ==========================================================================
// 5. RESTful API 路由宣告
// ==========================================================================

/**
 * API: 獲取大百科植物數據
 * GET /api/plants
 */
app.get('/api/plants', (req, res) => {
  const plants = readJSONFile(plantsDbPath);
  res.json(plants);
});

/**
 * API: 實體圖片上傳與 AI 模擬比對
 * POST /api/upload
 */
app.post('/api/upload', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上傳任何檔案。' });
    }

    // 取得圖片的伺服器靜態路徑 (相對於 public)
    const fileUrl = `/uploads/${req.file.filename}`;
    const originalName = req.file.originalname.toLowerCase();

    // 讀取植物庫進行相似度比對
    const plants = readJSONFile(plantsDbPath);
    let matchedId = "monstera"; // 預設為龜背竹

    // 模糊檔名映射算法 (移轉自前端，在後端進行安全比對)
    if (originalName.includes("snake") || originalName.includes("虎尾") || originalName.includes("sansevieria")) matchedId = "snake_plant";
    else if (originalName.includes("fig") || originalName.includes("琴葉") || originalName.includes("ficus")) matchedId = "fiddle_leaf_fig";
    else if (originalName.includes("pothos") || originalName.includes("黃金葛") || originalName.includes("ivy")) matchedId = "pothos";
    else if (originalName.includes("spider") || originalName.includes("吊蘭")) matchedId = "spider_plant";
    else if (originalName.includes("peace") || originalName.includes("白鶴") || originalName.includes("lily")) matchedId = "peace_lily";
    else if (originalName.includes("aloe") || originalName.includes("蘆薈")) matchedId = "aloe_vera";
    else if (originalName.includes("jade") || originalName.includes("翡翠") || originalName.includes("玉樹")) matchedId = "jade_plant";
    else if (originalName.includes("fern") || originalName.includes("蕨")) matchedId = "boston_fern";
    else if (originalName.includes("calathea") || originalName.includes("竹芋")) matchedId = "calathea_orbifolia";
    else if (originalName.includes("succulent") || originalName.includes("肉") || originalName.includes("echeveria")) matchedId = "succulents";
    else if (originalName.includes("rosemary") || originalName.includes("迷迭香")) matchedId = "rosemary";
    else if (originalName.includes("rose") || originalName.includes("玫瑰")) matchedId = "rose";
    else if (originalName.includes("sunflower") || originalName.includes("向日葵") || originalName.includes("葵花")) matchedId = "sunflower";
    else if (originalName.includes("hydrangea") || originalName.includes("繡球")) matchedId = "hydrangea";
    else if (originalName.includes("zz") || originalName.includes("金錢樹")) matchedId = "zz_plant";
    else if (originalName.includes("lavender") || originalName.includes("薰衣草")) matchedId = "lavender";
    else if (originalName.includes("orchid") || originalName.includes("蘭")) matchedId = "orchid";
    else {
      // 隨機匹配一個
      const randIndex = Math.floor(Math.random() * plants.length);
      matchedId = plants[randIndex].id;
    }

    // 找出匹配的主植物與候補
    const mainPlant = plants.find(p => p.id === matchedId) || plants[0];
    const candidates = plants.filter(p => p.id !== matchedId);
    
    const altPlant1 = candidates[Math.floor(Math.random() * candidates.length)];
    const altPlant2 = candidates[(Math.floor(Math.random() * candidates.length) + 1) % candidates.length];

    res.json({
      success: true,
      imageUrl: fileUrl, // 真正的上傳圖片 URL
      primaryMatch: {
        id: mainPlant.id,
        name: mainPlant.name,
        scientificName: mainPlant.scientificName,
        themeColor: mainPlant.themeColor,
        score: "98%"
      },
      alternatives: [
        {
          id: altPlant1.id,
          name: altPlant1.name,
          scientificName: altPlant1.scientificName,
          themeColor: altPlant1.themeColor,
          score: "72%"
        },
        {
          id: altPlant2.id,
          name: altPlant2.name,
          scientificName: altPlant2.scientificName,
          themeColor: altPlant2.themeColor,
          score: "54%"
        }
      ]
    });

  } catch (err) {
    console.error("檔案上傳處理異常:", err);
    res.status(500).json({ error: "伺服器內部上傳處理失敗" });
  }
});

/**
 * API: 植物醫生專家系統診斷
 * POST /api/diagnose
 */
app.post('/api/diagnose', (req, res) => {
  const { part, symptom, history } = req.body;

  if (!part || !symptom || !history) {
    return res.status(400).json({ error: "參數填寫不齊全。" });
  }

  // 診斷推理邏輯 (在後端伺服器運行，符合專家決策系統規格)
  let report = {
    name: "環境生理代謝失衡",
    probability: "75%",
    reason: "植物換新擺放地點或受近期的冷熱通風波動影響，產生暫時性水分與葉面色素代謝失調。",
    symptoms: "葉面局部或邊緣有零星黃點、微微下垂，但未偵測到病菌孢子與有害寄生蟲體。",
    treatments: [
      "移往明亮散射光且空氣流暢處，阻隔直射烈日與冷氣直吹。",
      "控制水分，維持盆土表面兩指節深乾燥後，再小水量澆灌。",
      "停止施加任何緩釋肥與水溶肥，待其適應期渡過並冒出新芽。"
    ]
  };

  if (symptom === 'yellow_drop') {
    if (history === 'too_wet') {
      report = {
        name: "盆土積水引發根腐病 (Root Rot)",
        probability: "95%",
        reason: "因盆土長期處於高水分飽和、窒息狀態，使毛細根部缺氧而大量變褐壞死腐爛，植物失去養分汲取能力。",
        symptoms: "葉面由下而上泛黃、下垂癱軟，新葉發黑乾枯，土面泛起白色黴網並散發微弱霉腐味。",
        treatments: [
          "【緊急脫盆】將植株與濕宿土分離，以酒精消毒後的剪刀，剪除所有中空發黑、黏滑的腐爛根系。",
          "【藥劑殺菌】將殘存的健康白根置入稀釋 800 倍的百菌清或多菌靈溶液中洗滌消毒 20 分鐘後晾乾。",
          "【重組土質】捨棄舊土，換入調配有 30% 珍珠石/發泡煉石等高度疏鬆透水之全新介質並重新種植。",
          "【極度控水】放置於無直射烈日的陰涼風扇前，徹底斷水 10-14 天，直至葉片停止發黃。"
        ]
      };
    } else if (history === 'too_dry') {
      report = {
        name: "土壤過乾引發嚴重脫水 (Severe Dehydration)",
        probability: "92%",
        reason: "長期缺水使植物細胞膨壓降至冰點，葉面導管閉合阻斷，造成不可逆的生理枯死與落葉自保反應。",
        symptoms: "葉尖大量枯焦發脆，老葉快速乾黃並大面積脫落，盆土收縮與花園盆邊出現開裂空隙，重量極輕。",
        treatments: [
          "【浸盆回水】若直接倒水會隨裂縫流失。應改用「浸盆法」：將盆底部浸入裝水的臉盆中 15-20 分鐘，由下而上完全濕潤吸飽。",
          "【微霧增濕】修剪所有完全焦枯的乾脆葉片，用噴水槍在植物四周與空氣噴霧以快速拉高局部濕度。",
          "【半陰休養】擺放在通風且有溫和光照之處，暫時嚴禁放到毒辣烈日下以防加速水分枯竭。"
        ]
      };
    }
  } else if (symptom === 'white_powder') {
    report = {
      name: "白粉真菌病 (Powdery Mildew)",
      probability: "88%",
      reason: "白粉菌孢子在氣溫溫暖、光照弱、空氣密閉且通風差的高濕環境中，迅速在表皮組織寄生繁衍。",
      symptoms: "葉片正面、背面及細芽表面覆蓋一層類似白色爽身粉的白黴斑塊，阻斷植物正常光合作用。",
      treatments: [
        "【病株隔離】立即將染病植物移開，避免孢子借由室內氣流感染其他健康盆栽，並剪除重災區葉片。",
        "【環境重組】移至迎風通風極佳的陽台外側，或使用電風扇增加空氣對流以降低局部濕度與黴菌滋生率。",
        "【天然處方】使用稀釋 800 倍的小蘇打水（1公克小蘇打粉加入1000cc水），或印楝油、稀釋苦楝乳劑，每 3 天噴灑整株正反面，連續噴灑 3-4 次。"
      ]
    };
  } else if (symptom === 'brown_spots') {
    report = {
      name: "炭疽病 / 真菌性褐斑病 (Rust & Leaf Spot)",
      probability: "90%",
      reason: "常因夜晚向葉片噴水，導致水分殘留葉面時間過長，或環境溫熱密閉，讓真菌孢子得以在濕葉上發芽入侵。",
      symptoms: "葉面出現大大小小圓形褐色、黑色病斑，斑點邊緣常有明顯黃暈圈，嚴重時病斑融合成大塊乾枯壞死。",
      treatments: [
        "【修剪除源】剪掉帶有黑色斑點的病葉，修剪前後剪刀均以酒精消毒，避免剪刀帶菌擴散。",
        "【調整澆水習慣】停止直接從頂部當頭淋洗植物！澆水時應直對土壤，並避免水珠長時間滯留在葉面上。",
        "【殺菌保護】對葉面均勻噴灑稀釋的多菌靈或百菌清廣效性殺菌劑，以防止新生葉片再度受感染。"
      ]
    };
  } else if (symptom === 'spider_webs') {
    report = {
      name: "紅蜘蛛危害 (Spider Mites Infestation)",
      probability: "95%",
      reason: "在高溫、空氣極度乾燥且不通風的惡劣微氣候中，葉蟎類害蟲以驚人速度增殖，刺吸植物細胞汁液。",
      symptoms: "葉腋及葉背發現白色細微蛛絲網，葉片正面退綠起沙、佈滿針孔大小黃白色小斑，葉片乾枯失綠泛灰。",
      treatments: [
        "【實體沖洗】紅蜘蛛極怕高濕。立刻將植物抱至淋浴間，用強力噴頭對準葉片【特別是背面】進行強力沖洗，以物理方式沖走 80% 蟲體。",
        "【葉背噴施】將苦楝油、印楝素、或一般洗碗精水（稀釋 800 倍）裝入噴壺，對準【葉片背面】及隱密死角全面噴佈，每 3 天一次以殺滅新孵化幼蟲，連續 3 次。",
        "【加濕增防】每日在周圍噴灑水霧，維持空氣濕度 60% 以上，並增加擺放環境的對流風速。"
      ]
    };
  } else if (symptom === 'gnats') {
    report = {
      name: "黑翅蕈蚋 (土壤小黑飛/Fungus Gnats)",
      probability: "90%",
      reason: "土壤常濕、排水性差，且土中混有未完全腐熟的茶葉、咖啡渣等有機物，吸引蕈蚋成蟲產卵並孵化幼蟲。",
      symptoms: "花盆四周出現微型小飛蟲飛舞。其白色小針狀幼蟲在潮濕的土表下活動，啃食有機腐植質與嫩植物根系。",
      treatments: [
        "【表土乾燥與隔絕】蕈蚋產卵需要高溫高濕。需控水讓表土完全乾透，並在土面鋪設 2 公分乾爽的細沙、赤玉土或硅藻土，阻斷成蟲產卵之路。",
        "【實體誘捕】在盆栽上方或盆土邊插滿「黃色雙面黏蟲板」，物理性大量捕吸飛行成蟲阻斷交配。",
        "【物理灌根】將珪藻土粉末稀釋後，在需要澆水時灌洗盆土。珪藻土晶體的尖銳切割面能磨穿幼蟲皮膚使其脫水死亡。"
      ]
    };
  }

  res.json(report);
});

/**
 * API: 獲取花園所有植物
 * GET /api/garden
 */
app.get('/api/garden', (req, res) => {
  const garden = readJSONFile(gardenDbPath);
  res.json(garden);
});

/**
 * API: 新增植物至花園
 * POST /api/garden
 */
app.post('/api/garden', (req, res) => {
  const { plantId, nickname, location } = req.body;

  if (!plantId || !nickname || !location) {
    return res.status(400).json({ error: "缺少參數！" });
  }

  const garden = readJSONFile(gardenDbPath);
  
  const newItem = {
    id: `garden_${Date.now()}`,
    plantId,
    nickname,
    location,
    addedDate: new Date().toISOString()
  };

  garden.push(newItem);
  const success = writeJSONFile(gardenDbPath, garden);

  if (success) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: "寫入伺服器資料庫失敗。" });
  }
});

/**
 * API: 從花園中移出植物
 * DELETE /api/garden/:id
 */
app.delete('/api/garden/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "未提供 ID。" });
  }

  const garden = readJSONFile(gardenDbPath);
  const filtered = garden.filter(item => item.id !== id);

  if (garden.length === filtered.length) {
    return res.status(404).json({ error: "找不到該花園植物項目。" });
  }

  const success = writeJSONFile(gardenDbPath, filtered);

  if (success) {
    res.json({ success: true, message: "植物項目已從伺服器端花園中移除。" });
  } else {
    res.status(500).json({ error: "寫入伺服器資料庫失敗。" });
  }
});

// ==========================================================================
// 6. 託管靜態前端檔案與啟動
// ==========================================================================
app.use(express.static(path.join(__dirname, 'public')));

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🍀 FloraCare AI 後端伺服器已順利啟動！`);
  console.log(`🌐 本地預覽網址: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
