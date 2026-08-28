// Review Dashboard Logic
document.addEventListener("DOMContentLoaded", () => {
  const config = window.APP_CONFIG || { mode: "preview" };
  let currentPreviewMode = config.mode;
  
  // Set current year
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Mobile menu setup
  setupMobileMenu();

  // Initial populate
  renderAllSections();

  // Bind Public Mode Toggle
  const previewToggle = document.getElementById("modePreviewToggle");
  const activeAlert = document.getElementById("reviewActiveAlert");
  
  if (previewToggle) {
    previewToggle.checked = config.mode === "public";
    updateAlertBanner(config.mode === "public");
    
    previewToggle.addEventListener("change", (e) => {
      const isPublic = e.target.checked;
      currentPreviewMode = isPublic ? "public" : "review";
      window.APP_CONFIG.mode = currentPreviewMode;
      updateAlertBanner(isPublic);
      renderAllSections();
    });
  }

  function updateAlertBanner(isPublic) {
    if (!activeAlert) return;
    if (isPublic) {
      activeAlert.className = "alert alert-warning";
      activeAlert.style.borderColor = "var(--color-primary)";
      activeAlert.innerHTML = `
        <h4>وضع المعاينة العامة نشط (Public Mode)</h4>
        <p>تم إخفاء ملاحظات المراجعة، شارات التنبيه المهني، والبرامج غير المكتملة أو بنوك المواضيع. هكذا يظهر الموقع للمستخدم العام أو مدير المؤسسة.</p>
      `;
    } else {
      activeAlert.className = "alert alert-warning";
      activeAlert.style.borderColor = "var(--color-border)";
      activeAlert.innerHTML = `
        <h4>معاينة وضع المراجعة نشط حالياً</h4>
        <p>يتم الآن عرض جميع العلامات والبنود المكررة أو القديمة. يمكنك تشغيل التبديل بالأعلى لإخفاء تفاصيل المراجعة ومعاينة الكتالوج كما يظهر للجهات والمؤسسات الخارجية.</p>
      `;
    }
  }

  function renderAllSections() {
    renderIssues();
    renderSourceMap();
    renderTopicBank();
    renderLegacyPrograms();
  }

  // Section 1: Render Issues Tracker (Confirmation Items)
  function renderIssues() {
    const listContainer = document.getElementById("reviewIssuesList");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    
    if (currentPreviewMode === "public" || currentPreviewMode === "preview") {
      listContainer.innerHTML = `
        <div class="empty-state" style="padding: 32px 16px;">
          <p>قائمة المسائل معطلة في وضع المعاينة العامة (Public/Preview Mode).</p>
        </div>
      `;
      return;
    }

    const issues = [
      {
        num: "المسألة الأولى",
        title: "تأكيد المؤهلات الأكاديمية والشهادات المهنية",
        desc: "نحتاج إلى تزويدنا بالمؤهلات والشهادات المهنية وسيرة ذاتية مختصرة لإضافتها في قسم 'عن د. لبنى'.",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة الثانية",
        title: "تأكيد قنوات التواصل الرسمية (الهاتف، البريد، إنستغرام)",
        desc: "الرجاء تأكيد رقم الهاتف، رابط WhatsApp، البريد الإلكتروني وحساب Instagram المعتمد لتفعيل أزرار الاتصال.",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة الثالثة",
        title: "صورة الملف الشخصي وشعار الموقع",
        desc: "نحتاج صورة شخصية رسمية عالية الجودة لإضافتها بدلاً من الرمز المؤقت.",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة الرابعة",
        title: "مدة برنامج أم واعية… مراهق متوازن",
        desc: "هناك أكثر من مدة مكتوبة في الملف ونحتاج تأكيد المدة النهائية. (الملف يذكر 3 ساعات / 180-195 دقيقة).",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة الخامسة",
        title: "تقسيم خطة برنامج طلاب الثانوية (12 لقاء)",
        desc: "هل البرنامج يُقدم كمسار واحد مستمر للطلاب، أم كخطة سنوية مستقلة لكل طبقة صفية؟ نرجو تأكيد الهيكلية.",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة السادسة",
        title: "مراجعة المصطلحات المهنية والصحية",
        desc: "بعض المصطلحات الواردة (مثل: cbt، nlp، ptsd، تعافي، علاج إدمان) تحتاج مراجعة وتأكيداً مهنياً للتوافق مع التراخيص وتجنب تقديمها كعلاج طبي.",
        status: "المصطلح يحتاج تأكيد مهني"
      },
      {
        num: "المسألة السابعة",
        title: "أسعار البرامج في الكتالوج القديم",
        desc: "الأسعار القديمة الواردة في الملفات السابقة محجوبة حالياً. هل ترغبون بإظهار الأسعار أم إبقائها مخفية وتتم بالتنسيق المباشر؟",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة الثامنة",
        title: "مراجعة مسمى برنامج الوالدية القديم",
        desc: "ورد في الملف اسم 'على رب الوالدية الايجابية'، ونقترح تعديله ليكون 'على درب الوالدية الإيجابية'. الرجاء تأكيد المسمى.",
        status: "بحاجة لتأكيد"
      },
      {
        num: "المسألة التاسعة",
        title: "تكملة تفاصيل ورشة العمل العامة (A17)",
        desc: "النص الوارد في الملف الأصلي غير مكتمل وينتهي بعبارة 'ورشة تفاعلية تشمل مشاركة خبرات، تمارين ذاكرة، وأنشطة ج...'. نحتاج إمدادنا بالوصف الكامل.",
        status: "المعلومة تحتاج توثيق قبل نشرها"
      },
      {
        num: "المسألة العاشرة",
        title: "توثيق معايير برنامج التوجيه المهني للطلاب",
        desc: "وردت عبارات مثل 'معايير عالمية حديثة' و'أدوات معتمدة'. نحتاج تأكيد هذه الأدوات أو توثيقها لضمان المصداقية.",
        status: "المعلومة تحتاج توثيق قبل نشرها"
      },
      {
        num: "المسألة الحادية عشر",
        title: "دمج الملفات المتكررة والمتطابقة في المصادر",
        desc: "تم دمج الملفات المتكررة (مثل ملفات برنامج دعم الإدمان وملفات التمكين النسائي) لتجنب التكرار في العرض. الرجاء تأكيد هذا الإجراء.",
        status: "بحاجة لتأكيد"
      }
    ];

    issues.forEach(issue => {
      const card = document.createElement("article");
      card.className = "issue-card";
      
      let badgeClass = "badge-review";
      if (issue.status === "المصطلح يحتاج تأكيد مهني") {
        badgeClass = "badge-critical";
      } else if (issue.status === "المعلومة تحتاج توثيق قبل نشرها") {
        badgeClass = "badge-incomplete";
      }
      
      card.innerHTML = `
        <div class="issue-header">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <span class="issue-number">${issue.num}</span>
            <h4 class="issue-title">${issue.title}</h4>
          </div>
          <span class="badge ${badgeClass}">${issue.status}</span>
        </div>
        <p class="issue-body">${issue.desc}</p>
      `;
      listContainer.appendChild(card);
    });
  }

  // Section 2: Render Source Map (File Traceability)
  function renderSourceMap() {
    const mapContainer = document.getElementById("sourceMapContainer");
    if (!mapContainer) return;
    
    mapContainer.innerHTML = "";
    
    if (currentPreviewMode === "public" || currentPreviewMode === "preview") {
      mapContainer.innerHTML = `
        <div class="empty-state" style="padding: 32px 16px;">
          <p>خريطة تتبع المصادر مغلقة في وضع المعاينة العامة.</p>
        </div>
      `;
      return;
    }

    const sources = [
      {
        file: "SOURCE A — الخطة البرامجية للورشات والمحاضرات",
        records: [
          { name: "ورشة علاقتي مع نفسي (A01)", status: "published" },
          { name: "ورشة دائرة العلاقات (A02)", status: "published" },
          { name: "محاضرة الحصانة النفسية (A03)", status: "published" },
          { name: "ورشة إدارة المشاعر (A04)", status: "published" },
          { name: "ورشة السلام الداخلي (A05)", status: "published" },
          { name: "ورشة العلاقات الصحية (A06)", status: "published" },
          { name: "محاضرة التنمر أشكاله والوقاية منه (A07)", status: "published" },
          { name: "سلسلة تطوير الذات - 6 لقاءات مدمجة (A08 - A13)", status: "published" },
          { name: "ورشة الصحة النفسية والضغوطات في جيل المراهقة (A14)", status: "published" },
          { name: "محاضرة التفكير الإيجابي وإعادة صياغة الأفكار (A15)", status: "published" },
          { name: "محاضرة البحث عن الهدف وبناء المعنى (A16)", status: "published" },
          { name: "ورشة عمل غير مكتملة (A17) - منقوصة المحتوى", status: "incomplete" }
        ]
      },
      {
        file: "SOURCE B — الخطة المقترحة لبرنامج التوجيه المهني",
        records: [
          { name: "برنامج التوجيه المهني للطلاب (career-guidance)", status: "review" }
        ]
      },
      {
        file: "SOURCE C — برامج تدريبية مقترحة (بنك أفكار)",
        records: [
          { name: "بنك البرامج التدريبية المقترحة (source-c-ideas)", status: "source-only" }
        ]
      },
      {
        file: "SOURCE D — برامج مقترحة لمختلف الفئات (بنك أفكار)",
        records: [
          { name: "بنك مواضيع مختلف الفئات والمجموعات (source-d-groups)", status: "source-only" }
        ]
      },
      {
        file: "SOURCE E — برنامج دعم أسر المتعاطين والمتعافين (ملفان متطابقان)",
        records: [
          { name: "برنامج دعم أسر المتعاطين والمتعافين (family-addiction-support)", status: "review" }
        ]
      },
      {
        file: "SOURCE F — أم واعية… مراهق متوازن",
        records: [
          { name: "برنامج أم واعية… مراهق متوازن (aware-mother-balanced-teen)", status: "review" }
        ]
      },
      {
        file: "SOURCE G — قوتي من داخلي — رحلة اكتشاف وشفاء",
        records: [
          { name: "برنامج قوتي من داخلي (inner-strength-girls)", status: "review" }
        ]
      },
      {
        file: "SOURCE H — برنامج طلاب الثانوية (12 لقاء)",
        records: [
          { name: "برنامج طلاب الثانوية — 12 لقاء متعدد المواضيع (high-school-12-meetings)", status: "review" }
        ]
      },
      {
        file: "SOURCE I — برنامج الأمهات — طلاب الثانوية / ما بعد الصدمة للعائلة",
        records: [
          { name: "برنامج الأمهات — ما بعد الصدمة للعائلة (mothers-family-trauma)", status: "review" }
        ]
      },
      {
        file: "SOURCE J — من البقاء إلى القوة (ملفان متطابقان)",
        records: [
          { name: "برنامج من البقاء إلى القوة (survival-to-strength)", status: "review" }
        ]
      },
      {
        file: "SOURCE K — محاضرات للشباب الذين يعاني آباؤهم من الإدمان",
        records: [
          { name: "محاضرات الشباب لأسر الإدمان (source-k-addiction-youth)", status: "source-only" }
        ]
      },
      {
        file: "SOURCE L — محاضرات للنساء — زوجات متعاطين أو متعافين",
        records: [
          { name: "محاضرات زوجات المتعاطين والمتعافين (source-l-addiction-wives)", status: "source-only" }
        ]
      },
      {
        file: "SOURCE M — كتالوج البرامج القديم",
        records: [
          { name: "سجلات البرامج القديمة الـ 18 (M01 إلى M18)", status: "legacy" }
        ]
      }
    ];

    sources.forEach(src => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "source-map-group";
      
      const recordsHTML = src.records.map(rec => {
        let badgeClass = "badge-published";
        let statusLabel = "منشور";
        
        if (rec.status === "review") { badgeClass = "badge-review"; statusLabel = "قيد المراجعة"; }
        else if (rec.status === "incomplete") { badgeClass = "badge-incomplete"; statusLabel = "غير مكتمل"; }
        else if (rec.status === "legacy") { badgeClass = "badge-legacy"; statusLabel = "مسودة قديمة"; }
        else if (rec.status === "source-only") { badgeClass = "badge-source-only"; statusLabel = "بنك مواضيع"; }
        
        return `
          <li style="display:flex; justify-content:space-between; align-items:center; padding:10px 16px; border:1px solid var(--color-border); margin-bottom:8px; border-radius:8px; background-color: var(--color-surface);">
            <span>${rec.name}</span>
            <span class="badge ${badgeClass}">${statusLabel}</span>
          </li>
        `;
      }).join("");

      groupDiv.innerHTML = `
        <h4 class="source-map-title">${src.file}</h4>
        <ul style="list-style:none; padding:0; max-width:680px;">
          ${recordsHTML}
        </ul>
      `;
      mapContainer.appendChild(groupDiv);
    });
  }

  // Section 3: Render Topic Bank
  function renderTopicBank() {
    const bankContainer = document.getElementById("topicBankContainer");
    if (!bankContainer) return;
    
    bankContainer.innerHTML = "";
    
    if (currentPreviewMode === "public" || currentPreviewMode === "preview") {
      bankContainer.innerHTML = `
        <div class="empty-state" style="padding: 32px 16px;">
          <p>بنوك الأفكار والموضوعات مخفية تمامًا في وضع المعاينة العامة.</p>
        </div>
      `;
      return;
    }

    if (window.GUIDE_DATA && window.CATALOG_SOURCE_BANKS && window.CATALOG_SOURCE_BANKS.length > 0) {
      window.CATALOG_SOURCE_BANKS.forEach(bank => {
        const card = document.createElement("article");
        card.className = "section-card";
        card.style.marginBottom = "32px";
        
        let categoriesHTML = "";
        bank.categories.forEach(cat => {
          const reviewWarningHTML = cat.professionalReviewRequired 
            ? `<div class="badge badge-critical" style="margin-right:12px;">يتطلب مراجعة مهنية</div>` 
            : "";
            
          categoriesHTML += `
            <div style="margin-top:20px; border-top:1px dashed var(--color-border); padding-top:16px;">
              <div style="display:flex; align-items:center;">
                <h4 style="color:var(--color-primary-dark); margin-bottom:8px;">${cat.name}</h4>
                ${reviewWarningHTML}
              </div>
              <ul class="editorial-list" style="margin-top:12px;">
                ${cat.topics.map(t => `<li>${t}</li>`).join("")}
              </ul>
            </div>
          `;
        });

        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; flex-wrap:wrap; margin-bottom:12px;">
            <span class="badge badge-source-only">${bank.sourceFile}</span>
            ${bank.professionalReviewRequired ? `<span class="badge badge-critical">محتوى حساس مهنياً</span>` : ""}
          </div>
          <h3>${bank.title}</h3>
          <p style="font-size:14px; line-height:1.7;">${bank.description}</p>
          ${categoriesHTML}
          ${bank.notes ? `<p style="font-size:12px; margin-top:24px; font-style:italic; color:var(--color-text-muted);">* ملحوظة المصدر: ${bank.notes}</p>` : ""}
        `;
        bankContainer.appendChild(card);
      });
    }
  }

  // Section 4: Render Legacy Programs Catalog
  function renderLegacyPrograms() {
    const legacyContainer = document.getElementById("legacyProgramsContainer");
    if (!legacyContainer) return;
    
    legacyContainer.innerHTML = "";
    
    if (currentPreviewMode === "public" || currentPreviewMode === "preview") {
      legacyContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <p>البرامج القديمة مخفية في وضع المعاينة العامة.</p>
        </div>
      `;
      return;
    }

    if (window.CATALOG_LEGACY_PROGRAMS && window.CATALOG_LEGACY_PROGRAMS.length > 0) {
      window.CATALOG_LEGACY_PROGRAMS.forEach(item => {
        const card = document.createElement("article");
        card.className = "card";
        
        const reviewBadgeHTML = item.needsReview 
          ? `<span class="badge badge-incomplete" style="margin-top:8px; display:inline-block;">اسم يحتاج تدقيق</span>` 
          : "";
          
        card.innerHTML = `
          <div class="card-header">
            <div class="card-meta">
              <span class="card-type">${item.typeOriginal}</span>
              <span style="font-size: 11px; color: var(--color-text-muted); font-family: var(--font-headings);">${item.category}</span>
            </div>
            <h3 class="card-title">${item.title}</h3>
            <div style="font-size:11px; color: var(--color-text-muted);">${item.sourceFile} • الكود: ${item.sourceId}</div>
          </div>
          <div class="card-body">
            <p class="card-summary">${item.description}</p>
            <ul class="card-details-list">
              <li class="card-detail-item"><span class="card-detail-label">الجمهور:</span> <span>${item.audience.join("، ")}</span></li>
              <li class="card-detail-item"><span class="card-detail-label">المدة:</span> <span>${item.duration}</span></li>
              <li class="card-detail-item"><span class="card-detail-label">السعر القديم:</span> <strong>${item.priceLegacy} شيكل (${item.priceNote || "قديم"})</strong></li>
            </ul>
            ${reviewBadgeHTML}
          </div>
          <div class="card-footer">
            <a href="program.html?id=${item.id}" class="btn btn-secondary" style="width:100%;">معاينة التفاصيل الكاملة</a>
          </div>
        `;
        legacyContainer.appendChild(card);
      });
    }
  }

  function setupMobileMenu() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("navLinks");
    const overlay = document.getElementById("navOverlay");
    
    if (toggle && nav && overlay) {
      const toggleMenu = (forceClose) => {
        const isOpen = forceClose === true ? false : !nav.classList.contains("active");
        
        if (isOpen) {
          nav.classList.add("active");
          overlay.classList.add("active");
          toggle.setAttribute("aria-expanded", "true");
          document.body.style.overflow = "hidden";
        } else {
          nav.classList.remove("active");
          overlay.classList.remove("active");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      };
      
      toggle.addEventListener("click", () => toggleMenu());
      overlay.addEventListener("click", () => toggleMenu(true));
      
      // Close on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("active")) {
          toggleMenu(true);
        }
      });
      
      // Close menu if a nav link is clicked
      nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          toggleMenu(true);
        });
      });
    }
  }
});
