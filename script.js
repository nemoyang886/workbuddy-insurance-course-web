(function(){
  const slides = Array.from(document.querySelectorAll(".slide"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = slides.length;
  const stageList = [
    {end:5, label:"概念校准", color:"#1f5eff"},
    {end:10, label:"Agent 认知", color:"#1f5eff"},
    {end:21, label:"方法训练", color:"#0b8f7a"},
    {end:25, label:"进入实操", color:"#0b8f7a"},
    {end:29, label:"内容发布工作流", color:"#f59e0b"},
    {end:35, label:"定联/跟进系统", color:"#1aa6d9"},
    {end:39, label:"Skill 封装", color:"#7c3aed"},
    {end:44, label:"课后行动", color:"#1f5eff"}
  ];

  const pageLabelMap = {
    1:"3小时实操",
    2:"学习路线",
    3:"课堂产物",
    4:"Agent认知",
    5:"真实卡点",
    6:"Agent 方法",
    7:"概念过渡",
    8:"使用准备",
    9:"基础设置",
    10:"工作目录",
    11:"资料准备",
    12:"任务卡",
    13:"通用模板",
    14:"任务升级",
    15:"创建任务",
    16:"三种模式",
    17:"任务管理",
    18:"持续修改",
    19:"任务清单",
    20:"合规流程",
    21:"风格说明书",
    22:"安装演示",
    23:"安装检查",
    24:"界面认知",
    25:"排障休息",
    26:"内容场景",
    27:"内容角度",
    28:"三轮优化",
    29:"样本入库",
    30:"定联/跟进方法",
    31:"课堂案例",
    32:"跟进快照",
    33:"跟进分析",
    34:"跟进计划",
    35:"验收标准",
    36:"Skill 判断",
    37:"创建 Skill",
    38:"资料来源",
    39:"长期陪跑营",
    40:"现场验收",
    41:"知识资产",
    42:"3天跟进",
    43:"进阶地图",
    44:"收束页"
  };

  const promptMeta = {
    9:["让 AI 认识你","选择保险顾问版或通用版，替换身份画像和真实任务","基础画像和清晰任务"],
    10:["建立课堂工作目录","选择保险顾问版或通用版创建文件夹","一套可持续保存资料的目录"],
    13:["把模糊需求写成工单","选择保险顾问版或通用版，替换目标、资料、对象和边界","一张完整任务卡"],
    14:["对比错误任务和优化任务","按自己的身份选择保险顾问版或通用版","一条可执行内容任务"],
    16:["区分 Ask / Plan / Craft","按任务类型选择对应模式","知道三种模式什么时候用"],
    19:["写清 AI 工作任务清单","选择保险顾问版或通用版，替换定位、职责和交付规则","一份 AI 工作任务清单"],
    20:["写入表达、边界与交付流程","保留边界，替换个人表达要求","一套交付检查流程"],
    21:["生成个人表达风格说明书","读取个人画像、工作规则和样本","后续内容可调用的风格说明书"],
    27:["生成内容角度","先读取个人表达风格说明书","3个可选择内容角度"],
    28:["生成并优化内容初稿","用风格说明书做对照验收","一条符合个人风格的内容初稿"],
    32:["统一匿名案例","选择保险顾问版或通用版替换资料","一张跟进快照"],
    33:["整理事实和跟进分析","粘贴匿名客户或对象资料和沟通记录","一份ABCD分级和沟通分析"],
    34:["生成话术和行动计划","按分级周期安排联系动作","三套跟进话术和7天计划"],
    37:["创建内容 Skill V1","替换 Skill 名称和触发方式","一个内容 Skill 初版"],
    38:["补全 Skill 执行流程","加入录音卡、学习资料等来源","Skill V1 测试结果和 V2 更新方向"],
    41:["把沟通沉淀成资产","替换当天沟通或学习内容","一份可入库的复盘记录"]
  };

  const outputLabelMap = {
    4:"本页产出：理解聊天 AI 和桌面 Agent 的区别",
    6:"本页产出：理解正确使用 Agent 的底层方法",
    7:"本页产出：理解项目、资料库、任务和 Skill 的关系",
    8:"本页产出：第一次使用 Agent 前的三件准备",
    9:"本页产出：基础画像和一个真实工作问题",
    10:"本页产出：建好课堂工作目录",
    12:"本页产出：一张六格任务卡",
    13:"本页产出：一段通用任务模板",
    14:"本页产出：一条可执行内容任务",
    15:"本页产出：会写任务说明书",
    16:"本页产出：知道 Ask、Plan、Craft 什么时候用",
    17:"本页产出：会管理每一次任务",
    18:"本页产出：会在同一任务里持续修改",
    19:"本页产出：一份清晰的 AI 工作任务清单",
    21:"本页产出：后续内容可调用的个人表达风格说明书",
    22:"本页产出：完成安装入口确认",
    24:"本页产出：认识首页三块区域",
    27:"本页产出：3个内容角度",
    28:"本页产出：一条内容初稿和三轮优化方式",
    29:"本页产出：满意样板入库",
    30:"本页产出：理解定联/跟进ABCD分级和联系周期",
    31:"本页产出：知道课堂案例怎么用",
    32:"本页产出：匿名跟进快照",
    33:"本页产出：ABCD分级和沟通分析",
    34:"本页产出：跟进话术和7天行动计划",
    35:"本页产出：跟进方案验收标准",
    37:"本页产出：内容 Skill V1",
    38:"本页产出：Skill 可读取的真实资料来源清单",
    39:"本页产出：知道长期陪跑营能帮你定制什么",
    42:"本页产出：3天课后跟进清单",
    44:"本页产出：下一步迭代方向"
  };

  const routeTakeaways = [
    ["聊天 AI", "桌面 Agent", "办公室模型"],
    ["资料准备", "六格任务卡", "工作规则"],
    ["内容发布", "定联/跟进", "课堂产物"],
    ["满意样本", "Skill V1", "3天跟进"]
  ];

  const shotMarkerMap = {
    15:["任务说明", "产物预览", "继续修改"],
    17:["新建任务", "任务列表"],
    22:["选择版本", "下载安装"],
    24:["左侧导航", "任务输入区", "任务产物区"],
    37:["点添加技能", "选择创建技能"],
    39:[],
    43:[]
  };

  function text(el){
    return el ? el.textContent.replace(/\s+/g," ").trim() : "";
  }

  function el(tag, className, html){
    const node = document.createElement(tag);
    if(className) node.className = className;
    if(html !== undefined) node.innerHTML = html;
    return node;
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#39;"
    })[char]);
  }

  function stageFor(page){
    return stageList.find((item) => page <= item.end) || stageList[stageList.length - 1];
  }

  function pageOf(slide){
    return slides.indexOf(slide) + 1;
  }

  function contentRoot(slide){
    return slide.querySelector(".prompt-workspace") || slide.querySelector(".body");
  }

  function normalizeTimePills(){
    slides.forEach((slide, index) => {
      const pill = slide.querySelector(".time-pill");
      if(pill) pill.textContent = pageLabelMap[index + 1] || stageFor(index + 1).label;
    });
    document.querySelectorAll(".thumb-card").forEach((button) => {
      const index = Number(button.dataset.slide);
      const slide = slides[index];
      const meta = button.querySelector(".thumb-meta");
      if(!slide || !meta) return;
      const label = text(slide.querySelector(".time-pill"));
      const imageCount = slide.querySelectorAll("img").length;
      meta.textContent = label + (imageCount ? " / " + imageCount + " 张图" : "");
    });
  }

  function addProgress(){
    if(document.querySelector(".course-progress")) return;
    const progress = el("div","course-progress",`
      <div class="course-progress__bar" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="1"><span></span></div>
      <div class="course-progress__meta">
        <span class="course-progress__page">01 / ${String(total).padStart(2,"0")}</span>
        <span class="course-progress__stage">开场定位</span>
      </div>
    `);
    document.body.appendChild(progress);
  }

  function classifySlides(){
    slides.forEach((slide, index) => {
      const page = index + 1;
      const title = text(slide.querySelector("h1"));
      const hasPrompt = !!slide.querySelector(".prompt-box");
      const hasImage = !!slide.querySelector("img");
      slide.dataset.page = String(page);
      slide.dataset.stage = stageFor(page).label;
      slide.style.setProperty("--wb-stage-color", stageFor(page).color);
      if(slide.classList.contains("cover") || slide.classList.contains("closing")){
        slide.classList.add("template-cover");
      }else if(hasPrompt && page !== 12){
        slide.classList.add("template-prompt");
      }else if(hasImage || /安装|任务区|对话|知识库|Skill 页面|创建任务/.test(title)){
        slide.classList.add("template-practice");
      }else{
        slide.classList.add("template-concept");
      }
    });
  }

  function enhanceCover(){
    const slide = slides[0];
    const body = slide?.querySelector(".body");
    if(slide?.classList.contains("cover-poster-slide") || body?.classList.contains("cover-poster")) return;
    if(!body || body.querySelector(".cover-visual")) return;
    const left = el("div","cover-left");
    Array.from(body.children).forEach((child) => left.appendChild(child));
    const tags = el("div","cover-value-tags",`
      <span>3小时实操</span>
      <span>跑通2个真实场景</span>
      <span>带走可复用工作流</span>
    `);
    const visual = el("div","cover-visual ai-hero",`
      <figure class="cover-hero-card course-hero-card">
        <img src="images/workbuddy-course-hero.webp" alt="保险顾问 AI 工作流实操课程主视觉" loading="eager" decoding="async" fetchpriority="high">
        <figcaption>WorkBuddy AI 工作流 · 资料 / Task / Skill / 定联系统</figcaption>
        <div class="hero-marker marker-one">任务</div>
        <div class="hero-marker marker-two">知识库</div>
        <div class="hero-marker marker-three">Skill</div>
      </figure>
      <div class="hero-image-note">
        <strong>今天要跑通的不是工具演示</strong>
        <span>是一个能持续复用的个人 AI 工作台。</span>
      </div>
    `);
    body.classList.add("cover-layout");
    left.insertBefore(tags, left.querySelector(".cover-grid"));
    body.appendChild(left);
    body.appendChild(visual);
  }

  function promptStepsFor(page, meta){
    if(page === 33){
      return [
        ["定联分级", "把客户资料分成关系温度、联系周期和本次目标"],
        ["沟通分析", "只基于资料判断顾虑、关注点和待验证问题"],
        ["复制执行", "只替换匿名客户资料和沟通记录"]
      ];
    }
    if(page === 34){
      return [
        ["定联话术", "生成轻触达、价值型和探询型表达"],
        ["7天计划", "明确联系时间、目标和分支动作"],
        ["结果检查", "验收事实边界、语气和可回复性"]
      ];
    }
    if(page === 16){
      return [
        ["Ask", "适合问清楚、读资料、解释问题"],
        ["Plan", "适合先拆步骤、做计划、等确认"],
        ["Craft", "适合生成或修改文件和正式产物"]
      ];
    }
    return [
      ["先看目标", meta[0]],
      ["再改变量", meta[1]],
      ["最后验收", meta[2]]
    ];
  }

  function makePromptTeachPanel(page, meta){
    const cards = promptStepsFor(page, meta).map(([title, desc], index) => `
      <div class="prompt-step-card">
        <span>${index + 1}</span>
        <b>${escapeHtml(title)}</b>
        <em>${escapeHtml(desc)}</em>
      </div>
    `).join("");
    return el("div","prompt-teach-panel",cards);
  }

  function addShotMarkers(){
    slides.forEach((slide, index) => {
      const labels = shotMarkerMap[index + 1];
      if(!labels) return;
      slide.querySelectorAll(".shot-frame").forEach((frame) => {
        if(frame.querySelector(".shot-callouts")) return;
        const callouts = el("div","shot-callouts",labels.map((label, i) => `
          <span class="shot-callout callout-${i + 1}"><b>${i + 1}</b>${escapeHtml(label)}</span>
        `).join(""));
        frame.appendChild(callouts);
      });
    });
  }

  function splitDualPrompt(raw){
    const insuranceKey = "【保险顾问版】";
    const generalKey = "【通用版】";
    const insuranceStart = raw.indexOf(insuranceKey);
    const generalStart = raw.indexOf(generalKey);
    if(insuranceStart === -1 || generalStart === -1 || generalStart <= insuranceStart) return null;
    const insuranceText = raw.slice(insuranceStart, generalStart).replace(/\n-{3,}\n*/g,"\n").trim();
    const generalText = raw.slice(generalStart).replace(/\n-{3,}\n*/g,"\n").trim();
    return {
      insurance: insuranceText,
      general: generalText
    };
  }

  function enhancePromptVersionTabs(box, pre){
    if(box.querySelector(".prompt-version-tabs")) return;
    const versions = splitDualPrompt(pre.textContent.trim());
    if(!versions) return;
    const tabs = el("div","prompt-version-tabs",`
      <button type="button" class="active" data-version="insurance">保险顾问版</button>
      <button type="button" data-version="general">通用版</button>
    `);
    const setVersion = (version) => {
      const active = versions[version] ? version : "insurance";
      pre.textContent = versions[active];
      box.dataset.promptVersion = active;
      tabs.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.version === active);
      });
    };
    tabs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => setVersion(button.dataset.version));
    });
    box.insertBefore(tabs, pre);
    setVersion("insurance");
  }

  function wrapPromptSlides(){
    slides.forEach((slide) => {
      if(!slide.classList.contains("template-prompt")) return;
      const body = slide.querySelector(".body");
      if(!body || body.querySelector(".prompt-brief-card")) return;
      const page = pageOf(slide);
      const meta = promptMeta[page] || ["复制课堂提示词","替换括号里的个人资料","一个可直接使用的任务产物"];
      const steps = promptStepsFor(page, meta);
      const result = (outputLabelMap[page] || "").replace(/^本页产出：/,"") || meta[2];
      const workspace = el("div","prompt-workspace");
      Array.from(body.children).forEach((child) => workspace.appendChild(child));
      workspace.insertBefore(makePromptTeachPanel(page, meta), workspace.firstChild);
      const brief = el("aside","prompt-brief-card",`
        <strong>${escapeHtml(meta[0])}</strong>
        <p>${escapeHtml(result)}</p>
        <div class="prompt-flow-mini" aria-label="提示词使用步骤">
          ${steps.map(([title], index) => `<span data-step="${index + 1}">${escapeHtml(title)}</span>`).join("")}
        </div>
        <div class="prompt-result-mini">
          <b>本页产出</b>
          <span>${escapeHtml(result)}</span>
        </div>
      `);
      body.appendChild(brief);
      body.appendChild(workspace);
    });
  }

  function enhancePromptCopyAndTags(){
    document.querySelectorAll(".prompt-box").forEach((box) => {
      const slide = box.closest(".slide");
      const page = slide ? pageOf(slide) : 0;
      const pre = box.querySelector("pre");
      if(!pre) return;
      if(slide?.classList.contains("template-prompt") && !box.querySelector(".prompt-tags")){
        const meta = promptMeta[page] || ["课堂练习","替换成自己的资料","一个可使用产物"];
        const tags = el("div","prompt-tags",`
          <span><b>使用场景</b>${escapeHtml(meta[0])}</span>
          <span><b>复制后怎么改</b>${escapeHtml(meta[1])}</span>
          <span><b>本页产出</b>${escapeHtml(meta[2])}</span>
        `);
        box.insertBefore(tags, pre);
      }
      enhancePromptVersionTabs(box, pre);
      if(slide?.classList.contains("template-prompt") && !box.querySelector(".toggle-prompt")){
        const toggle = el("button","toggle-prompt","展开完整提示词");
        toggle.type = "button";
        toggle.setAttribute("aria-label","展开或收起完整提示词");
        toggle.addEventListener("click", () => {
          const expanded = box.classList.toggle("is-expanded");
          toggle.textContent = expanded ? "收起提示词" : "展开完整提示词";
        });
        box.appendChild(toggle);
      }
      if(box.querySelector(".copy-prompt")) return;
      const button = el("button","copy-prompt","复制提示词");
      button.type = "button";
      button.setAttribute("aria-label","复制提示词");
      button.addEventListener("click", async () => {
        const value = pre.textContent.trim();
        try{
          await navigator.clipboard.writeText(value);
        }catch(error){
          const temp = document.createElement("textarea");
          temp.value = value;
          temp.style.position = "fixed";
          temp.style.left = "-9999px";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          temp.remove();
        }
        button.textContent = "已复制";
        button.classList.add("copied");
        window.setTimeout(() => {
          button.textContent = "复制提示词";
          button.classList.remove("copied");
        }, 1400);
      });
      box.appendChild(button);
    });
  }

  function addOutputLabels(){
    slides.forEach((slide, index) => {
      const page = index + 1;
      const label = outputLabelMap[page];
      const body = slide.querySelector(".body");
      if(slide.classList.contains("template-prompt")) return;
      if(!label || !body || body.querySelector(".lesson-output")) return;
      body.appendChild(el("div","lesson-output",escapeHtml(label)));
    });
  }

  function enhanceLearningPathOverview(){
    const slide = slides[1];
    const map = slide?.querySelector(".route-map");
    if(!map || map.querySelector(".learning-path-overview")) return;
    const hero = map.querySelector(".route-hero");
    const overview = el("div","learning-path-overview",[
      ["概念","先懂 Agent","知道为什么不是普通聊天"],
      ["方法","会下任务","用六格任务卡交代工作"],
      ["实操","跑通场景","内容发布 + 定联/跟进"],
      ["沉淀","变成资产","样本、知识库、Skill"]
    ].map(([kicker,title,desc]) => `
      <div>
        <span>${escapeHtml(kicker)}</span>
        <b>${escapeHtml(title)}</b>
        <em>${escapeHtml(desc)}</em>
      </div>
    `).join(""));
    hero?.after(overview);
    const routeSteps = Array.from(map.querySelectorAll(".route-step"));
    const labels = [
      ["Concept","先讲概念","聊天 AI、桌面 Agent、办公室模型、资料边界。"],
      ["Method","再讲方法","资料准备、六格任务卡、工作规则和表达风格。"],
      ["Practice","最后实操","安装检查、界面认知、内容发布、定联/跟进。"],
      ["Reuse","沉淀复用","把满意结果保存成知识库和 Skill。"]
    ];
    routeSteps.forEach((step, index) => {
      const data = labels[index];
      if(!data) return;
      const tag = step.querySelector(".step-tag");
      const title = step.querySelector("h3");
      const desc = step.querySelector("p");
      if(tag) tag.textContent = data[0];
      if(title) title.textContent = data[1];
      if(desc) desc.textContent = data[2];
    });
  }

  function enhanceIdentityChoice(){
    const slide = slides[2];
    const body = slide?.querySelector(".body");
    const stage = body?.querySelector(".outcome-stage");
    if(!body || !stage || body.querySelector(".identity-choice")) return;
    const items = [
      ["保险顾问","用朋友圈、定联、保单年检和客户复盘练习。"],
      ["普通新人","用学习整理、内容发布、资料整理和日常跟进练习。"],
      ["其他行业","用客户经营、团队协作、项目推进和知识沉淀练习。"]
    ];
    const panel = el("div","identity-choice",`
      <strong>先选你的课堂身份</strong>
      <div>
        ${items.map(([title,desc], index) => `
          <button type="button" class="${index === 0 ? "active" : ""}">
            <b>${escapeHtml(title)}</b>
            <span>${escapeHtml(desc)}</span>
          </button>
        `).join("")}
      </div>
    `);
    panel.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        panel.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      });
    });
    body.insertBefore(panel, stage);
  }

  function enhanceRouteTimeline(){
    const slide = slides[1];
    const map = slide?.querySelector(".route-map");
    if(!map || map.classList.contains("timeline-enhanced")) return;
    map.classList.add("timeline-enhanced");
    const end = map.querySelector(".route-end strong");
    if(end) end.textContent = "今天最终带走";
    const steps = Array.from(map.querySelectorAll(".route-step"));
    steps.forEach((step, index) => {
      if(!step.querySelector(".route-proof")){
        const labels = routeTakeaways[index] || [];
        step.appendChild(el("div","route-proof",labels.map((item) => `<span>${escapeHtml(item)}</span>`).join("")));
      }
      makeButtonLike(step, () => setActive(index), "查看学习路线阶段");
    });
    function setActive(index){
      steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    }
    setActive(0);
  }

  function enhanceOutcomeBadges(){
    const slide = slides[2];
    const body = slide?.querySelector(".body");
    const grid = body?.querySelector(".grid.cols-4");
    if(!body || !grid || body.querySelector(".outcome-stage")) return;
    const detail = el("aside","outcome-detail");
    const stage = el("div","outcome-stage");
    body.replaceChild(stage, grid);
    stage.appendChild(grid);
    stage.appendChild(detail);
    grid.classList.add("outcome-badges");
    const cards = Array.from(grid.querySelectorAll(".card"));
    cards.forEach((card, index) => makeButtonLike(card, () => setActive(index), "查看课堂成果说明"));
    function setActive(index){
      cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
      const title = text(cards[index].querySelector(".card-title"));
      const bodyText = text(cards[index].querySelector(".card-body"));
      detail.innerHTML = `
        <span>当前成果</span>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(bodyText)}</p>
      `;
    }
    setActive(0);
    body.appendChild(el("div","outcome-statement","今天结束，你将带走一个可继续迭代的个人 AI 工作台。"));
  }

  function addModuleGuides(){
    const guides = {
      4:["概念理解","你现在要学什么：先分清聊天 AI 和桌面 Agent，知道为什么要用工作流。"],
      11:["方法训练","你现在要学什么：准备资料、写任务卡、把模糊需求变成可执行工单。"],
      22:["进入实操","你现在要学什么：先让所有人进入可操作状态，没装好也能跟着做。"],
      26:["场景一","你现在要学什么：用同一套任务方法，跑通内容发布。"],
      30:["场景二","你现在要学什么：把长期联系对象变成有节奏、可记录、可复盘的系统。"],
      36:["沉淀复用","你现在要学什么：从一次任务，变成知识资产、Skill 和课后行动。"]
    };
    Object.entries(guides).forEach(([page, [label, desc]]) => {
      const body = slides[Number(page) - 1]?.querySelector(".body");
      if(!body || body.querySelector(".module-guide")) return;
      body.insertBefore(el("div","module-guide",`
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(desc)}</strong>
      `), body.firstChild);
    });
  }

  function addCatchUpNotes(){
    const notes = {
      22:"还没装好：先看演示，把提示词复制到文档里。已经装好：跟着完成下载和登录检查。",
      24:"看不清界面：只记住左侧导航、中间任务输入、右侧产物区三块。后面都会围绕这三块操作。",
      26:"还没跟上：先复制老师示例，不急着改成自己的主题。已经跟上：替换成自己的内容主题。",
      30:"没有客户资料：用课堂匿名案例练习。其他行业学员：把客户替换成需要持续联系的对象。",
      37:"不会创建 Skill：先看老师演示，课后用陪跑营或模板直接生成你的专属 Skill。"
    };
    Object.entries(notes).forEach(([page, note]) => {
      const body = slides[Number(page) - 1]?.querySelector(".body");
      if(!body || body.querySelector(".catch-up-note")) return;
      body.insertBefore(el("div","catch-up-note",`
        <b>掉队也能跟上</b>
        <span>${escapeHtml(note)}</span>
      `), body.firstChild);
    });
  }

  function enhanceFlipCards(){
    const slide = slides[4];
    const grid = slide?.querySelector(".grid.cols-3");
    if(!grid || grid.classList.contains("flip-grid")) return;
    const solutions = {
      "客户资料零散":"用项目和知识库整理客户资料、沟通记录、内容样本。",
      "方案推进卡点":"用任务卡生成下一步话术和行动计划。",
      "专业问题接不上":"用知识库和 Ask 模式，把问题先讲清再作答。",
      "老客户难衔接":"调出客户快照，生成自然破冰和复访目标。",
      "成交经验难复盘":"把沟通结果整理成可复用方法和 Skill 规则。",
      "新人上手慢":"照着任务卡和模板，先跑通再逐步优化。"
    };
    grid.classList.add("flip-grid");
    Array.from(grid.querySelectorAll(".card")).forEach((card) => {
      const original = card.innerHTML;
      const title = text(card.querySelector(".card-title"));
      const back = solutions[title] || "用 WorkBuddy 把问题拆成资料、任务、产物和验收标准。";
      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-face front">${original}</div>
          <div class="flip-face back">
            <div class="card-title">${escapeHtml(title)}</div>
            <div class="card-body">${escapeHtml(back)}</div>
          </div>
        </div>
      `;
      makeButtonLike(card, () => card.classList.toggle("is-flipped"), "翻看 WorkBuddy 解决方式");
    });
  }

  function enhanceOfficeMap(){
    const slide = slides[6];
    if(!/办公室模型/.test(text(slide?.querySelector("h1")))) return;
    const body = slide?.querySelector(".body");
    const grid = body?.querySelector(".grid.cols-3");
    if(!body || !grid || body.querySelector(".office-map")) return;
    const map = el("div","office-map",`
      <div class="office-map-title">搭建你的保险展业 AI 办公室</div>
      <div class="office-map-lines">
        <div><b>项目</b><span>办公室</span></div>
        <div><b>项目指令</b><span>员工手册</span></div>
        <div><b>知识库</b><span>文件柜</span></div>
        <div><b>Skill</b><span>标准动作</span></div>
        <div><b>任务</b><span>工单</span></div>
        <div><b>产物</b><span>交付文件</span></div>
      </div>
    `);
    body.insertBefore(map, grid);
    grid.classList.add("office-source-grid");
  }

  function enhanceAskPlanCraft(){
    const slide = slides[15];
    const root = contentRoot(slide);
    const imageGrid = slide?.querySelector(".image-grid");
    const promptGrid = slide?.querySelector(".three-prompts");
    if(!root || !imageGrid || !promptGrid || root.querySelector(".mode-tabs")) return;
    const modes = [
      ["Ask","问清楚、读文件、解释问题"],
      ["Plan","先规划多步骤，再等确认"],
      ["Craft","直接生成或修改文件"]
    ];
    const tabs = el("div","mode-tabs");
    tabs.setAttribute("role","tablist");
    tabs.setAttribute("aria-label","Ask Plan Craft 模式切换");
    modes.forEach(([mode, desc], index) => {
      const button = el("button","mode-tab",mode);
      button.type = "button";
      button.id = `apc-tab-${index}`;
      button.setAttribute("role","tab");
      button.setAttribute("aria-controls",`apc-panel-${index}`);
      button.setAttribute("aria-label",`${mode}：${desc}`);
      button.addEventListener("click", () => setMode(index));
      tabs.appendChild(button);
    });
    const panel = el("div","apc-panel");
    panel.setAttribute("role","tabpanel");
    root.insertBefore(tabs, imageGrid);
    root.insertBefore(panel, imageGrid);
    panel.appendChild(imageGrid);
    panel.appendChild(promptGrid);
    const tip = el("div","apc-tip","先 Ask 问清楚，再 Plan 拆步骤，最后 Craft 做产物。");
    root.appendChild(tip);
    const figures = Array.from(imageGrid.querySelectorAll("figure"));
    const prompts = Array.from(promptGrid.querySelectorAll(".prompt-box"));
    function setMode(index){
      panel.id = `apc-panel-${index}`;
      Array.from(tabs.children).forEach((button, i) => {
        button.classList.toggle("is-active", i === index);
        button.setAttribute("aria-selected", i === index ? "true" : "false");
        button.tabIndex = i === index ? 0 : -1;
      });
      figures.forEach((figure, i) => figure.classList.toggle("is-active", i === index));
      prompts.forEach((prompt, i) => prompt.classList.toggle("is-active", i === index));
    }
    setMode(0);
  }

  function enhanceTaskCards(){
    const slide = slides[11];
    const body = slide?.querySelector(".body");
    const grid = body?.querySelector(".grid.cols-3");
    if(!body || !grid || body.querySelector(".task-builder")) return;
    const examples = [
      ["做什么","生成一条养老主题朋友圈"],
      ["给什么","个人介绍、朋友圈样本、目标客户资料"],
      ["给谁","35 至 50 岁的家庭客户"],
      ["怎么做","先给 3 个角度，确认后写正式文案"],
      ["交付什么","120 至 180 字朋友圈文案"],
      ["怎样算完成","自然、克制、不承诺收益、不直接推销"]
    ];
    const exampleMap = Object.fromEntries(examples);
    const inspector = el("aside","task-card-inspector");
    const builder = el("div","task-builder");
    body.replaceChild(builder, grid);
    builder.appendChild(grid);
    builder.appendChild(inspector);
    const cards = Array.from(grid.querySelectorAll(".card"));
    cards.forEach((card, index) => makeButtonLike(card, () => setActive(index), "查看六格任务卡示例"));
    function setActive(index){
      cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
      const title = text(cards[index].querySelector(".card-title"));
      inspector.innerHTML = `
        <strong>保险顾问示例工单</strong>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(exampleMap[title] || text(cards[index].querySelector(".card-body")))}</p>
        <div class="sample-task-card">
          ${examples.map(([key, value]) => `
            <div class="sample-slot ${key === title ? "is-active" : ""}">
              <b>${escapeHtml(key)}</b>
              <span>${escapeHtml(value)}</span>
            </div>
          `).join("")}
        </div>
      `;
    }
    setActive(0);
    body.appendChild(el("div","task-principle","目标清楚、资料清楚、交付清楚、边界清楚。"));
  }

  function enhanceCompare(){
    const slide = slides[13];
    const pair = slide?.querySelector(".two-col");
    if(!pair || pair.classList.contains("compare-enhanced")) return;
    slide.classList.add("compare-slide");
    pair.classList.add("compare-enhanced");
    const boxes = Array.from(pair.querySelectorAll(".prompt-box"));
    if(boxes.length < 2) return;
    addTags(boxes[0],["目标不清","资料缺失","对象不明","没有验收标准"]);
    addTags(boxes[1],["目标清楚","资料明确","步骤清晰","边界完整"]);
    const button = el("button","upgrade-task",`
      <span>补齐任务卡</span>
      <b>6 格</b>
      <i>→</i>
    `);
    button.type = "button";
    button.setAttribute("aria-label","高亮优化后的任务");
    const reasons = el("div","compare-reasons",`
      <span>说明面向谁</span>
      <span>说明参考资料</span>
      <span>说明输出步骤</span>
      <span>说明合规边界</span>
    `);
    boxes[1].appendChild(reasons);
    pair.insertBefore(button, boxes[1]);
    button.addEventListener("click", () => pair.classList.toggle("is-upgraded"));
    function addTags(box, tags){
      if(box.querySelector(".compare-tags")) return;
      const node = el("div","compare-tags",tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join(""));
      box.insertBefore(node, box.querySelector("pre"));
    }
  }

  function enhanceFriendCircleFlow(){
    const steps = [
      ["主题选择","先确定内容方向"],
      ["3个内容角度","暂时不写全文"],
      ["生成初稿","120至180字"],
      ["三轮优化","自然、风格、合规"],
      ["保存样本","命名成文件"],
      ["加入知识库","后续继续参考"]
    ];
    [26,27,28,29].forEach((page) => {
      const slide = slides[page - 1];
      const root = contentRoot(slide);
      if(!root || root.querySelector(".friend-flow")) return;
      const active = page === 26 ? 0 : page === 27 ? 1 : page === 28 ? 3 : 4;
      root.insertBefore(makeWorkflowRail(steps, active, "friend-flow"), root.firstChild);
    });
    addAngleCards();
    addOptimizerCards();
    addFileToKnowledge();
  }

  function addAngleCards(){
    const root = contentRoot(slides[26]);
    if(!root || root.querySelector(".angle-card-grid")) return;
    const cards = [
      ["生活观察","从身边变化切入","容易共鸣","低"],
      ["对象顾虑","从常见想法切入","有被提醒感","中"],
      ["家庭现金流","从未来支出切入","更理性","低"]
    ].map(([title, angle, feeling, risk]) => `
      <div class="angle-card">
        <h3>${title}</h3>
        <p><b>切入方式</b>${angle}</p>
        <p><b>读者感受</b>${feeling}</p>
        <p><b>生硬感风险</b>${risk}</p>
      </div>
    `).join("");
    root.insertBefore(el("div","angle-card-grid",cards), root.querySelector(".prompt-box"));
  }

  function addOptimizerCards(){
    const root = contentRoot(slides[27]);
    if(!root || root.querySelector(".optimizer-stack")) return;
    const html = [
      ["第一轮：自然化","减少培训课式表达，增加日常观察感。"],
      ["第二轮：个人风格对齐","参考资料库中的朋友圈句式和节奏。"],
      ["第三轮：合规与发布检查","检查夸张表达、销售感和收益承诺。"]
    ].map(([title, desc], index) => `
      <div class="optimizer-layer" style="--layer:${index}">
        <strong>${title}</strong>
        <span>${desc}</span>
      </div>
    `).join("");
    root.insertBefore(el("div","optimizer-stack",html), root.querySelector(".two-col"));
  }

  function addFileToKnowledge(){
    const root = contentRoot(slides[28]);
    if(!root || root.querySelector(".file-to-kb")) return;
    root.insertBefore(el("div","file-to-kb",`
      <div class="file-card-name">内容样板_主题_V1.md</div>
      <div class="file-arrow">→</div>
      <div class="kb-card-name">知识库：满意样本</div>
    `), root.firstChild);
  }

  function enhanceStyleManualValue(){
    const root = contentRoot(slides[20]);
    if(!root || root.querySelector(".style-manual-value")) return;
    const panel = el("div","style-manual-value",`
      <div>
        <span>没有它</span>
        <strong>AI 写出来像模板</strong>
      </div>
      <div class="accent">
        <span>有了它</span>
        <strong>AI 才开始像你的助理</strong>
      </div>
      <div>
        <span>后面所有内容</span>
        <strong>先读说明书，再生成初稿</strong>
      </div>
    `);
    const anchor = root.querySelector(".prompt-teach-panel");
    if(anchor) anchor.after(panel);
    else root.insertBefore(panel, root.firstChild);
  }

  function enhanceTaskSkill(){
    const board = slides[35]?.querySelector(".decision-board");
    if(!board || board.classList.contains("skill-converter-board")) return;
    board.classList.add("skill-converter-board");
    const arrow = board.querySelector(".decision-arrow");
    if(arrow){
      arrow.innerHTML = `<div class="skill-machine"><span class="skill-gear">规则</span><small>沉淀</small></div>`;
    }
  }

  function enhanceCustomerWorkflow(){
    enhanceCustomerLoop();
    enhancePrivacyRules();
    enhanceCustomerSnapshot();
    enhanceCustomerPromptStructure();
    enhanceCustomerChecks();
    enhanceFollowupProfessional();
  }

  function enhanceCustomerLoop(){
    const slide = slides[29];
    const board = slide?.querySelector(".workflow-board");
    if(!board || board.querySelector(".customer-loop")) return;
    board.classList.add("customer-enhanced");
    const rail = makeWorkflowRail([
      ["对象池","匿名输入"],
      ["跟进分级","关系温度"],
      ["沟通分析","看见顾虑"],
      ["跟进话术","微信可直接改"],
      ["7天计划","持续联系"],
      ["复盘沉淀","进入知识库"]
    ],0,"customer-loop");
    board.insertBefore(rail, board.firstChild);
    const steps = Array.from(board.querySelectorAll(".workflow-step"));
    steps.forEach((step, index) => makeButtonLike(step, () => {
      steps.forEach((item, i) => item.classList.toggle("is-active", i === index));
    }, "查看跟进动作"));
    steps[0]?.classList.add("is-active");
  }

  function enhancePrivacyRules(){
    const slide = slides[30];
    const board = slide?.querySelector(".privacy-board");
    if(!board || board.classList.contains("privacy-enhanced")) return;
    board.classList.add("privacy-enhanced");
    const groups = board.querySelectorAll(".token-grid");
    if(groups[0]) groups[0].innerHTML = ["匿名对象画像","沟通大意","明确反馈","当前推进状态"].map((item) => `<span class="token">${item}</span>`).join("");
    if(groups[1]) groups[1].innerHTML = ["真实姓名","电话","身份证","家庭住址","保单号","银行信息","详细健康资料"].map((item) => `<span class="token">${item}</span>`).join("");
    const rule = board.querySelector(".rule-card");
    if(rule && !rule.querySelector(".privacy-lock-scene")){
      rule.insertBefore(el("div","privacy-lock-scene",`
        <div class="lock-mark" aria-hidden="true"></div>
        <div class="blur-customer-card">
          <b>客户A</b>
          <span>身份信息已模糊</span>
          <span>只保留沟通判断所需资料</span>
        </div>
      `), rule.firstChild);
    }
  }

  function enhanceCustomerSnapshot(){
    const root = contentRoot(slides[31]);
    if(!root || root.querySelector(".customer-snapshot")) return;
    const snapshot = el("div","customer-snapshot",[
      ["年龄段","38岁"],
      ["家庭阶段","已婚，有一个孩子"],
      ["职业","自由职业"],
      ["沟通状态","两个月没有定联"],
      ["客户反馈","觉得长期规划收益不明显"],
      ["当前卡点","暂时不着急，缺少自然定联切入点"]
    ].map(([k,v]) => `<div><b>${k}</b><span>${v}</span></div>`).join(""));
    root.insertBefore(snapshot, root.firstChild);
  }

  function enhanceCustomerPromptStructure(){
    [33,34].forEach((page) => {
      const root = contentRoot(slides[page - 1]);
      if(!root || root.querySelector(".task-structure")) return;
      const structure = el("div","task-structure",["事实整理","定联分级","沟通分析","定联话术","7天计划","自检"].map((item) => `<span>${item}</span>`).join(""));
      root.insertBefore(structure, root.firstChild);
    });
  }

  function enhanceCustomerChecks(){
    const slide = slides[34];
    const body = slide?.querySelector(".body");
    const grid = body?.querySelector(".grid.cols-3");
    if(!body || !grid || body.querySelector(".check-inspector")) return;
    const checks = [
      ["事实和推测分开","没有依据就标注为待验证假设。"],
      ["话术像真人微信","读起来像你发给客户的话，不像模板。"],
      ["没有明显推销感","先经营关系，再寻找自然切入点。"],
      ["客户容易回复","问题具体、温和，对方知道怎么接。"],
      ["定联节奏清晰","联系周期、联系理由、下一步动作明确。"],
      ["尊重客户关系","不压迫、不替客户做决定，不透支信任。"]
    ];
    const cards = Array.from(grid.querySelectorAll(".card"));
    cards.forEach((card, index) => {
      const title = card.querySelector(".card-title");
      const bodyText = card.querySelector(".card-body");
      if(title) title.textContent = checks[index][0];
      if(bodyText) bodyText.textContent = checks[index][1];
      makeButtonLike(card, () => setActive(index), "查看验收解释");
    });
    grid.classList.add("check-grid");
    const inspector = el("aside","check-inspector");
    body.appendChild(inspector);
    function setActive(index){
      cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
      inspector.innerHTML = `<strong>${escapeHtml(checks[index][0])}</strong><p>${escapeHtml(checks[index][1])}</p>`;
    }
    setActive(0);
  }

  function enhanceSevenDayPlan(){
    const slide = slides[41];
    const body = slide?.querySelector(".body");
    const grid = body?.querySelector(".grid.cols-4");
    if(!body || !grid || body.querySelector(".action-calendar")) return;
    const details = [
      ["20分钟","用朋友圈 Skill 跑出第一条可修改样本。"],
      ["20分钟","把修改后的满意样本保存进知识库。"],
      ["30分钟","用匿名客户资料完整跑通一次定联案例。"]
    ];
    const calendar = el("div","action-calendar");
    const panel = el("aside","day-detail");
    const side = el("div","action-side");
    body.replaceChild(calendar, grid);
    calendar.appendChild(grid);
    calendar.appendChild(side);
    side.appendChild(panel);
    grid.classList.add("day-grid");
    const cards = Array.from(grid.querySelectorAll(".card"));
    const longTerm = cards.find((card) => text(card.querySelector(".card-title")) === "长期");
    if(longTerm){
      longTerm.remove();
      longTerm.classList.add("long-term-card");
      side.appendChild(longTerm);
    }
    const dayCards = Array.from(grid.querySelectorAll(".card"));
    dayCards.forEach((card, index) => {
      card.classList.add("day-card");
      card.insertAdjacentHTML("afterbegin",`<span class="day-check" aria-hidden="true"></span>`);
      makeButtonLike(card, () => {
        card.classList.toggle("is-done", true);
        setActive(index);
      }, "展开课后行动");
    });
    function setActive(index){
      dayCards.forEach((card, i) => card.classList.toggle("is-active", i === index));
      panel.innerHTML = `
        <strong>${escapeHtml(text(dayCards[index].querySelector(".card-title")))}</strong>
        <p>${escapeHtml(text(dayCards[index].querySelector(".card-body")))}</p>
        <div><b>预计用时</b><span>${escapeHtml(details[index][0])}</span></div>
        <div><b>完成标准</b><span>${escapeHtml(details[index][1])}</span></div>
      `;
    }
    setActive(0);
    body.appendChild(el("div","action-closing","3 天只盯两个成果：一条满意朋友圈样本，一个跑通的客户定联案例。"));
  }

  function enhanceLadder(){
    const slide = slides[42];
    const grid = slide?.querySelector(".grid.cols-1");
    if(!grid || grid.classList.contains("ladder-map")) return;
    const steps = [
      ["会下任务","把一次需求写成清晰任务"],
      ["会建项目","让资料和规则长期保留"],
      ["会做 Skill","把重复动作变成标准技能"],
      ["会做自动化","让固定流程自动跑起来"],
      ["会做团队工作流","把个人方法复制给团队"]
    ];
    grid.classList.add("ladder-map");
    Array.from(grid.querySelectorAll(".card")).forEach((card, index) => {
      const [title, desc] = steps[index];
      card.classList.add("ladder-card");
      card.style.setProperty("--level", index);
      card.innerHTML = `
        <span class="ladder-index">${index + 1}</span>
        <div>
          <div class="card-title">${escapeHtml(title)}</div>
          <div class="card-body">${escapeHtml(desc)}</div>
        </div>
      `;
    });
  }

  function enhanceFollowupProfessional(){
    const slide = slides[29];
    const body = slide?.querySelector(".body");
    const board = body?.querySelector(".workflow-board");
    if(!body || !board || body.querySelector(".followup-principles")) return;
    const panel = el("div","followup-principles",`
      <strong>定联的专业逻辑</strong>
      <span>不是催促成交，而是把获客、留客、养客变成固定节奏。</span>
      <div>
        <b>名单池</b>
        <b>关系温度</b>
        <b>价值触达</b>
        <b>记录反馈</b>
        <b>下次行动</b>
      </div>
    `);
    body.insertBefore(panel, board);
  }

  function enhanceCampValue(){
    const slide = slides[38];
    if(slide?.querySelector(".camp-page")) return;
    const panel = slide?.querySelector(".teach-panel");
    if(!panel || panel.querySelector(".camp-deliverables")) return;
    panel.insertBefore(el("div","camp-deliverables",`
      <strong>陪跑营核心价值</strong>
      <span>你不用自己创建、更新、调试 Skill，直接拿适合你业务的工作流来用。</span>
      <div>
        <b>专属 Skill</b>
        <b>流程定制</b>
        <b>持续调试</b>
        <b>拿来就用</b>
      </div>
    `), panel.firstChild);
  }

  function enhanceClosing(){
    const slide = slides[43];
    const body = slide?.querySelector(".body");
    const title = slide?.querySelector("h1");
    if(title) title.textContent = "今天你已经搭好了第一间 AI 办公室";
    if(!body || body.querySelector(".closing-actions")) return;
    const copy = body.querySelector(".closing-copy");
    const actions = el("div","closing-actions",[
      ["继续补资料","个人介绍、客户画像、朋友圈样本"],
      ["继续做 Skill","把高频任务沉淀成固定方法"],
      ["继续跑业务场景","朋友圈、定联、复访、复盘"],
      ["继续复盘优化","用反馈更新你的 AI 工作流"]
    ].map(([titleText, desc]) => `<span><b>${titleText}</b><em>${desc}</em></span>`).join(""));
    const visual = el("div","closing-office closing-finale",`
      <div class="closing-finale-card">
        <div class="closing-finale-head">
          <span>课后行动</span>
          <strong>3 天把第一版跑顺</strong>
        </div>
        <div class="closing-loop">
          <div><b>资料</b><span>先补齐</span></div>
          <i></i>
          <div><b>Task</b><span>先跑通</span></div>
          <i></i>
          <div><b>Skill</b><span>再固化</span></div>
          <i></i>
          <div><b>复盘</b><span>持续改</span></div>
        </div>
        <div class="closing-sprint">
          <div><span>Day 1</span><b>用 Skill 跑朋友圈样本</b></div>
          <div><span>Day 2</span><b>修改并保存满意样本</b></div>
          <div><span>Day 3</span><b>跑通客户定联案例</b></div>
        </div>
        <figure class="closing-image-card course-hero-card">
          <img src="images/workbuddy-course-hero.webp" alt="保险顾问 AI 工作流实操课程主视觉" loading="lazy" decoding="async">
          <figcaption>从一次实操，走向长期可复用的展业工作流</figcaption>
        </figure>
        <div class="closing-final-line">每天只推进一个高频场景，让 WorkBuddy 龙虾越来越懂你的业务。</div>
      </div>
    `);
    body.classList.add("closing-layout");
    if(copy) copy.after(actions);
    body.appendChild(visual);
  }

  function makeWorkflowRail(items, activeIndex, extraClass){
    const rail = el("div",`workflow-rail ${extraClass || ""}`.trim());
    rail.setAttribute("role","group");
    items.forEach(([title, desc], index) => {
      const node = el("button","workflow-node",`<strong>${escapeHtml(title)}</strong><span>${escapeHtml(desc)}</span>`);
      node.type = "button";
      node.setAttribute("aria-label",`${title}：${desc}`);
      node.addEventListener("click", () => setActive(index));
      rail.appendChild(node);
    });
    function setActive(index){
      Array.from(rail.children).forEach((node, i) => node.classList.toggle("is-active", i === index));
    }
    setActive(activeIndex || 0);
    return rail;
  }

  function makeButtonLike(node, handler, label){
    node.tabIndex = 0;
    node.setAttribute("role","button");
    if(label) node.setAttribute("aria-label", label);
    node.addEventListener("click", handler);
    node.addEventListener("keydown", (event) => {
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        handler(event);
      }
    });
  }

  function addRevealIndexes(slide){
    const items = slide.querySelectorAll(".card,.route-step,.cue-card,.workflow-step,.privacy-card,.rule-card,.shot,.prompt-box,.workflow-node,.angle-card,.optimizer-layer,.file-to-kb,.office-map-lines > div,.customer-snapshot > div,.task-structure span,.day-card,.ladder-card,.prompt-step-card,.route-proof span,.sample-slot,.shot-callout,.learning-path-overview > div,.identity-choice,.module-guide,.catch-up-note,.style-manual-value,.followup-principles,.camp-deliverables");
    items.forEach((item, index) => item.style.setProperty("--reveal-i", index));
  }

  function updateSlideState(index){
    const page = index + 1;
    const stage = stageFor(page);
    document.documentElement.style.setProperty("--wb-progress", `${(page / total) * 100}%`);
    document.documentElement.style.setProperty("--wb-stage-color", stage.color);
    const pageNode = document.querySelector(".course-progress__page");
    const stageNode = document.querySelector(".course-progress__stage");
    const bar = document.querySelector(".course-progress__bar");
    if(pageNode) pageNode.textContent = `${String(page).padStart(2,"0")} / ${String(total).padStart(2,"0")}`;
    if(stageNode) stageNode.textContent = stage.label;
    if(bar) bar.setAttribute("aria-valuenow", String(page));
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
  }

  normalizeTimePills();
  addProgress();
  classifySlides();
  enhanceCover();
  wrapPromptSlides();
  enhancePromptCopyAndTags();
  enhanceLearningPathOverview();
  enhanceRouteTimeline();
  enhanceOutcomeBadges();
  enhanceIdentityChoice();
  addModuleGuides();
  addCatchUpNotes();
  enhanceFlipCards();
  enhanceOfficeMap();
  enhanceAskPlanCraft();
  enhanceTaskCards();
  enhanceCompare();
  addShotMarkers();
  enhanceStyleManualValue();
  enhanceFriendCircleFlow();
  enhanceTaskSkill();
  enhanceCustomerWorkflow();
  enhanceSevenDayPlan();
  enhanceLadder();
  enhanceCampValue();
  enhanceClosing();
  addOutputLabels();
  slides.forEach(addRevealIndexes);

  window.addEventListener("workbuddy:slidechange", (event) => {
    updateSlideState(event.detail.current);
  });
  updateSlideState(window.__currentSlideIndex || 0);
})();
