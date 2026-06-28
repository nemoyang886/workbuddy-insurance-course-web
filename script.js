(function(){
  const slides = Array.from(document.querySelectorAll(".slide"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stageList = [
    {end:4, label:"定位与目标", color:"#1f5eff"},
    {end:13, label:"WorkBuddy 基础操作", color:"#1f5eff"},
    {end:23, label:"项目与知识库", color:"#0b8f7a"},
    {end:31, label:"朋友圈 Skill 工作流", color:"#f59e0b"},
    {end:39, label:"客户跟进工作流", color:"#1aa6d9"},
    {end:42, label:"课后行动", color:"#1f5eff"}
  ];

  function text(el){
    return el ? el.textContent.replace(/\s+/g," ").trim() : "";
  }

  function el(tag, className, html){
    const node = document.createElement(tag);
    if(className) node.className = className;
    if(html !== undefined) node.innerHTML = html;
    return node;
  }

  function stageFor(page){
    return stageList.find((item) => page <= item.end) || stageList[stageList.length - 1];
  }

  function addProgress(){
    if(document.querySelector(".course-progress")) return;
    const progress = el("div","course-progress",`
      <div class="course-progress__bar"><span></span></div>
      <div class="course-progress__meta">
        <span class="course-progress__page">01 / ${String(slides.length).padStart(2,"0")}</span>
        <span class="course-progress__stage">定位与目标</span>
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
      slide.style.setProperty("--wb-stage-color", stageFor(page).color);
      if(slide.classList.contains("cover") || slide.classList.contains("closing")){
        slide.classList.add("template-cover");
      }else if(hasPrompt && page !== 11){
        slide.classList.add("template-prompt");
      }else if(hasImage || /安装|任务区|对话|知识库|Skill 页面|创建任务/.test(title)){
        slide.classList.add("template-practice");
      }else{
        slide.classList.add("template-concept");
      }
    });
  }

  function addRevealIndexes(slide){
    const items = slide.querySelectorAll(".card,.route-step,.cue-card,.workflow-step,.privacy-card,.rule-card,.shot,.prompt-box,.workflow-node");
    items.forEach((item, index) => item.style.setProperty("--reveal-i", index));
  }

  function wrapPromptSlides(){
    slides.forEach((slide) => {
      if(!slide.classList.contains("template-prompt")) return;
      const body = slide.querySelector(".body");
      if(!body || body.querySelector(".prompt-brief-card")) return;
      const workspace = el("div","prompt-workspace");
      Array.from(body.children).forEach((child) => workspace.appendChild(child));
      const title = text(slide.querySelector("h1"));
      const brief = el("aside","prompt-brief-card",`
        <div>
          <strong>课堂讲解卡</strong>
          <p>${escapeHtml(title)}</p>
        </div>
        <div class="prompt-flow-mini" aria-label="提示词使用步骤">
          <span data-step="1">明确资料</span>
          <span data-step="2">复制指令</span>
          <span data-step="3">检查产物</span>
        </div>
        <p>先讲清楚这段提示词解决什么问题，再让学员复制执行。重点看资料、输出和边界是否写完整。</p>
      `);
      body.appendChild(brief);
      body.appendChild(workspace);
    });
  }

  function enhancePromptCopy(){
    document.querySelectorAll(".prompt-box").forEach((box) => {
      if(box.querySelector(".copy-prompt")) return;
      const pre = box.querySelector("pre");
      if(!pre) return;
      const button = el("button","copy-prompt","复制提示词");
      button.type = "button";
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

  function enhanceRouteTimeline(){
    const slide = slides[1];
    const map = slide?.querySelector(".route-map");
    if(!map) return;
    map.classList.add("timeline-enhanced");
    const steps = Array.from(map.querySelectorAll(".route-step"));
    steps.forEach((step, index) => {
      step.tabIndex = 0;
      step.setAttribute("role","button");
      step.addEventListener("click", () => setActive(index));
      step.addEventListener("keydown", (event) => {
        if(event.key === "Enter" || event.key === " "){
          event.preventDefault();
          setActive(index);
        }
      });
    });
    function setActive(index){
      steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    }
    setActive(0);
  }

  function enhanceFlipCards(){
    const slide = slides[3];
    const grid = slide?.querySelector(".grid.cols-3");
    if(!grid || grid.classList.contains("flip-grid")) return;
    grid.classList.add("flip-grid");
    Array.from(grid.querySelectorAll(".card")).forEach((card) => {
      const original = card.innerHTML;
      const title = text(card.querySelector(".card-title"));
      const body = text(card.querySelector(".card-body"));
      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-face front">${original}</div>
          <div class="flip-face back">
            <div class="card-title">${escapeHtml(title)}</div>
            <div class="card-body">课堂动作：把“${escapeHtml(body)}”改写成一个可执行的 WorkBuddy 任务。</div>
          </div>
        </div>
      `;
      card.tabIndex = 0;
      card.setAttribute("role","button");
      card.addEventListener("click", () => card.classList.toggle("is-flipped"));
      card.addEventListener("keydown", (event) => {
        if(event.key === "Enter" || event.key === " "){
          event.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });
  }

  function enhanceAskPlanCraft(){
    const slide = slides[10];
    const body = slide?.querySelector(".body");
    const imageGrid = slide?.querySelector(".image-grid");
    const promptGrid = slide?.querySelector(".three-prompts");
    if(!body || !imageGrid || !promptGrid || body.querySelector(".mode-tabs")) return;
    const modes = ["Ask","Plan","Craft"];
    const tabs = el("div","mode-tabs");
    modes.forEach((mode, index) => {
      const button = el("button","mode-tab",mode);
      button.type = "button";
      button.addEventListener("click", () => setMode(index));
      tabs.appendChild(button);
    });
    const panel = el("div","apc-panel");
    body.insertBefore(tabs, imageGrid);
    body.insertBefore(panel, imageGrid);
    panel.appendChild(imageGrid);
    panel.appendChild(promptGrid);
    const figures = Array.from(imageGrid.querySelectorAll("figure"));
    const prompts = Array.from(promptGrid.querySelectorAll(".prompt-box"));
    function setMode(index){
      Array.from(tabs.children).forEach((button, i) => button.classList.toggle("is-active", i === index));
      figures.forEach((figure, i) => figure.classList.toggle("is-active", i === index));
      prompts.forEach((prompt, i) => prompt.classList.toggle("is-active", i === index));
    }
    setMode(0);
  }

  function enhanceTaskCards(){
    const slide = slides[14];
    const body = slide?.querySelector(".body");
    const grid = body?.querySelector(".grid.cols-3");
    if(!body || !grid || body.querySelector(".task-builder")) return;
    const inspector = el("aside","task-card-inspector");
    const builder = el("div","task-builder");
    body.insertBefore(builder, grid);
    builder.appendChild(grid);
    builder.appendChild(inspector);
    const cards = Array.from(grid.querySelectorAll(".card"));
    cards.forEach((card, index) => {
      card.tabIndex = 0;
      card.setAttribute("role","button");
      card.addEventListener("click", () => setActive(index));
      card.addEventListener("keydown", (event) => {
        if(event.key === "Enter" || event.key === " "){
          event.preventDefault();
          setActive(index);
        }
      });
    });
    function setActive(index){
      cards.forEach((card, i) => card.classList.toggle("is-active", i === index));
      const title = text(cards[index].querySelector(".card-title"));
      const bodyText = text(cards[index].querySelector(".card-body"));
      inspector.innerHTML = `
        <div>
          <strong>当前讲解</strong>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(bodyText)}</p>
        </div>
        <p>课堂动作：这一格补清楚，任务就从模糊需求变成可交付工单。</p>
      `;
    }
    setActive(0);
  }

  function enhanceCompare(){
    const slide = slides[16];
    const pair = slide?.querySelector(".two-col");
    if(!pair || pair.classList.contains("compare-enhanced")) return;
    pair.classList.add("compare-enhanced");
    const boxes = pair.querySelectorAll(".prompt-box");
    const labels = ["问题在哪里","优化方向"];
    boxes.forEach((box, index) => {
      box.insertBefore(el("div","compare-badge",labels[index] || "示范"), box.firstChild);
    });
  }

  function addFriendCircleFlow(){
    const slide = slides[23];
    const body = slide?.querySelector(".body");
    if(!body || body.querySelector(".workflow-rail")) return;
    const rail = makeWorkflowRail([
      ["定主题","养老准备"],
      ["出角度","先不写全文"],
      ["生成初稿","120至180字"],
      ["三轮优化","语气、风格、合规"],
      ["保存样本","进入知识库"]
    ]);
    body.insertBefore(rail, body.firstChild);
    setupFlow(rail);
  }

  function enhanceTaskSkill(){
    const board = slides[27]?.querySelector(".decision-board");
    if(board) board.classList.add("is-animated");
  }

  function enhanceCustomerFlow(){
    const board = slides[31]?.querySelector(".workflow-board");
    if(!board) return;
    board.classList.add("flow-enhanced");
    if(!board.querySelector(".workflow-rail")){
      const rail = makeWorkflowRail([
        ["整理","客户快照"],
        ["话术","破冰探询"],
        ["复访","本次目标"],
        ["复盘","下次动作"]
      ]);
      rail.classList.add("three");
      board.insertBefore(rail, board.firstChild);
      setupFlow(rail);
    }
    const steps = Array.from(board.querySelectorAll(".workflow-step"));
    steps.forEach((step, index) => {
      step.tabIndex = 0;
      step.setAttribute("role","button");
      step.addEventListener("click", () => setActive(index));
      step.addEventListener("keydown", (event) => {
        if(event.key === "Enter" || event.key === " "){
          event.preventDefault();
          setActive(index);
        }
      });
    });
    function setActive(index){
      steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
    }
    setActive(0);
  }

  function makeWorkflowRail(items){
    const rail = el("div","workflow-rail");
    items.forEach(([title, desc]) => {
      rail.appendChild(el("div","workflow-node",`${escapeHtml(title)}<span>${escapeHtml(desc)}</span>`));
    });
    return rail;
  }

  function setupFlow(rail){
    const nodes = Array.from(rail.querySelectorAll(".workflow-node"));
    let active = 0;
    function setActive(index){
      active = index;
      nodes.forEach((node, i) => node.classList.toggle("is-active", i === index));
    }
    nodes.forEach((node, index) => {
      node.tabIndex = 0;
      node.setAttribute("role","button");
      node.addEventListener("click", () => setActive(index));
    });
    setActive(0);
    if(reduceMotion) return;
    window.setInterval(() => {
      const slide = rail.closest(".slide");
      if(!slide?.classList.contains("is-active")) return;
      setActive((active + 1) % nodes.length);
    }, 1800);
  }

  function updateSlideState(index){
    const page = index + 1;
    const stage = stageFor(page);
    document.documentElement.style.setProperty("--wb-progress", `${(page / slides.length) * 100}%`);
    document.documentElement.style.setProperty("--wb-stage-color", stage.color);
    const pageNode = document.querySelector(".course-progress__page");
    const stageNode = document.querySelector(".course-progress__stage");
    if(pageNode) pageNode.textContent = `${String(page).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
    if(stageNode) stageNode.textContent = stage.label;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
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

  addProgress();
  classifySlides();
  wrapPromptSlides();
  enhancePromptCopy();
  enhanceRouteTimeline();
  enhanceFlipCards();
  enhanceAskPlanCraft();
  enhanceTaskCards();
  enhanceCompare();
  addFriendCircleFlow();
  enhanceTaskSkill();
  enhanceCustomerFlow();
  slides.forEach(addRevealIndexes);
  window.addEventListener("workbuddy:slidechange", (event) => {
    updateSlideState(event.detail.current);
  });
  updateSlideState(window.__currentSlideIndex || 0);
})();
