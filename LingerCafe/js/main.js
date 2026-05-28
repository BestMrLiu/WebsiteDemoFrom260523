/* ============================================
   Linger 慢半拍 咖啡馆 — 主 JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. AOS 初始化 ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      once: true,
      offset: 60,
    });
  }

  /* ---------- 2. 导航栏滚动效果 ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. 手机端汉堡菜单 ---------- */
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- 4. 菜单筛选 ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      menuCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.remove('aos-animate');
          void card.offsetWidth;
          card.classList.add('aos-animate');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- 5. 表单提交处理 ---------- */
  const bookingForm  = document.getElementById('bookingForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const data = Object.fromEntries(formData.entries());

      const subject = encodeURIComponent(`【慢半拍】预订申请 — ${data.name}`);
      const body = encodeURIComponent(
        `姓名：${data.name}\n` +
        `电话：${data.phone}\n` +
        `日期：${data.date}\n` +
        `时间：${data.time}\n` +
        `人数：${data.guests}\n` +
        `场合：${data.occasion || '未选择'}\n` +
        `备注：${data.note || '无'}\n`
      );

      const mailtoLink = `mailto:hello@lingercoffee.com?subject=${subject}&body=${body}`;

      formSuccess.classList.add('show');
      bookingForm.reset();

      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    });
  }

  /* ---------- 6. 地图占位点击 → 唤起导航 ---------- */
  const mapPlaceholder = document.getElementById('mapPlaceholder');
  if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', () => {
      const gaodeUrl = 'https://uri.amap.com/marker?position=120.1551,30.2741&name=Linger慢半拍咖啡馆&src=LingerWebsite';
      window.open(gaodeUrl, '_blank');
    });
  }

  /* ---------- 7. 导航高亮当前板块 ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---------- 8. 飘落叶子动画 ---------- */
  const leafContainer = document.getElementById('fallingLeaves');
  const leafColors = ['#8FBC8F', '#6B9F6B', '#C4A35A', '#A8C8A8', '#D4C9A0'];

  const leafSVG = (color) => `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2C14 6 12 8 8 10c2 2 2 4 1 6-2 1-4 0-5-1 1 3 3 5 6 5-1 2-3 3-5 3 2 2 5 2 7 1 0 2-1 4-2 5 2-1 4-2 5-5 1-2 3-3 5-3 2 2 5 2 7 1 0 2-1 4-2 5-2-1-4-1-6 2 0 4 1 5 2-1-3-3-5-5-6 1-2 3-3 5-3 2 2 5 2 7 1z" fill="${color}" opacity="0.75"/>
      <path d="M16 2v28" stroke="${color}" stroke-width="0.5" opacity="0.4"/>
    </svg>`;

  function createLeaf() {
    if (!leafContainer) return;
    const leaf = document.createElement('div');
    leaf.className = 'falling-leaf';
    leaf.style.left = Math.random() * 100 + '%';
    leaf.style.width = (12 + Math.random() * 16) + 'px';
    leaf.style.height = leaf.style.width;
    leaf.style.animationDuration = (6 + Math.random() * 6) + 's';
    leaf.style.animationDelay = (Math.random() * 2) + 's';
    leaf.innerHTML = leafSVG(leafColors[Math.floor(Math.random() * leafColors.length)]);
    leafContainer.appendChild(leaf);
    leaf.addEventListener('animationend', () => leaf.remove());
  }

  setInterval(createLeaf, 1200);
  for (let i = 0; i < 5; i++) setTimeout(createLeaf, i * 300);

  /* ---------- 9. 全站背景小树 — 滚动生长 ---------- */
  const bgTrees = document.querySelectorAll('.bg-tree');
  if (bgTrees.length > 0) {
    // 每棵树有 data-threshold（0~1），滚动超过该值时开始生长
    function updateTrees() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = docH > 0 ? Math.min(1, scrollY / docH) : 0;

      bgTrees.forEach((tree, i) => {
        const threshold = parseFloat(tree.dataset.threshold || '0');
        // 滚动进度减去阈值，得到该树的生长进度
        let grow = (scrollRatio - threshold) * 2.5;
        grow = Math.max(0, Math.min(1, grow));

        // 越靠后的树越大（基础尺寸 + 滚动加成）
        const baseScale = 0.25 + (i % 3) * 0.08; // 0.25 / 0.33 / 0.41
        const targetScale = baseScale + grow * (0.35 + (i % 3) * 0.1);

        tree.style.setProperty('--tree-scale', targetScale.toFixed(3));
        tree.style.opacity = (grow * 0.5).toFixed(2);
      });
    }

    window.addEventListener('scroll', updateTrees, { passive: true });
    updateTrees(); // 初始化
  }

});
