// App.js — Main catalog controller
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial State
  const config = window.APP_CONFIG || { mode: "review" };
  const isReviewMode = config.mode === "review";
  
  // Set current year in footer
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // 2. Configure UI based on App Mode
  setupAppModeUI(isReviewMode, config);
  
  // 3. Setup Contact Buttons Hrefs/Disabled states
  setupContactButtons(config, isReviewMode);
  
  // 4. Mobile Menu Navigation Drawer Toggle
  setupMobileMenu();
  setupContactFormAndWhatsApp(config);
  
  // 5. Initialize Catalog Filter State
  let activeCategory = "all";
  let activeType = "all";
  let activeSearchQuery = "";
  
  // DOM Elements
  const gridContainer = document.getElementById("catalogGrid");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const categoryChipsContainer = document.getElementById("categoryChips");
  
  // Initial render
  updateCatalog();
  
  // 6. Bind Event Listeners
  
  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value;
      updateCatalog();
    });
  }
  
  // Type Select Filter
  if (typeFilter) {
    typeFilter.addEventListener("change", (e) => {
      activeType = e.target.value;
      updateCatalog();
    });
  }
  
  // Category Chips Filter
  if (categoryChipsContainer) {
    categoryChipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".category-chip");
      if (!chip) return;
      
      // Update active chip classes
      const chips = categoryChipsContainer.querySelectorAll(".category-chip");
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      
      activeCategory = chip.getAttribute("data-category");
      updateCatalog();
    });
  }
  
  // Category Cards Grid Click Handler
  const visualCategoryGrid = document.getElementById("visualCategoryGrid");
  if (visualCategoryGrid) {
    visualCategoryGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".category-card");
      if (!card) return;
      
      const category = card.getAttribute("data-category");
      const chip = document.querySelector(`.category-chip[data-category="${category}"]`);
      if (chip) {
        chip.click();
        const catalogSection = document.getElementById("catalog");
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }
  
  // Master function to filter and render items
  function updateCatalog() {
    if (!gridContainer) return;
    
    // Get combined list (respects mode: review/public)
    let list = window.getCombinedCatalog();
    
    // Filter by target category
    list = window.filterByTargetCategory(list, activeCategory);
    
    // Filter by activity type
    list = window.filterByActivityType(list, activeType);
    
    // Search query match
    list = window.searchCatalog(list, activeSearchQuery);
    
    // Render list
    renderGrid(list);
  }
  
  // Renders cards to the catalog grid
  function renderGrid(items) {
    gridContainer.innerHTML = "";
    
    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon" aria-hidden="true">📭</div>
          <h3>لم نجد برامج مطابقة لهذا الاختيار</h3>
          <p>جرّب تعديل البحث أو اختيار فئة أخرى لاستكشاف المزيد.</p>
          <button class="btn btn-secondary" id="resetCatalogFiltersBtn" style="margin-top: 16px;">عرض جميع البرامج</button>
        </div>
      `;
      
      // Bind click handler for reset button
      const resetBtn = document.getElementById("resetCatalogFiltersBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", resetAllFilters);
      }
      return;
    }
    
    // Generate HTML for each item
    items.forEach(item => {
      const card = createCardElement(item);
      gridContainer.appendChild(card);
    });
  }
  
  // Resets filters to default "all" state
  function resetAllFilters() {
    activeCategory = "all";
    activeType = "all";
    activeSearchQuery = "";
    
    if (searchInput) searchInput.value = "";
    if (typeFilter) typeFilter.value = "all";
    
    const chips = categoryChipsContainer.querySelectorAll(".category-chip");
    chips.forEach(c => c.classList.remove("active"));
    const firstChip = categoryChipsContainer.querySelector('[data-category="all"]');
    if (firstChip) firstChip.classList.add("active");
    
    updateCatalog();
  }
  
  // Helper to resolve category fallback image
  function getCategoryFallbackImage(category) {
    switch (category) {
      case "المدارس والطلاب":
        return "assets/images/categories/students.webp";
      case "الأهالي والأسرة":
        return "assets/images/categories/parents.webp";
      case "النساء والتمكين":
        return "assets/images/categories/women.webp";
      case "الشباب والفتيات":
        return "assets/images/categories/youth.webp";
      case "الإدمان والتعافي":
        return "assets/images/categories/recovery.webp";
      case "الطواقم المهنية":
        return "assets/images/categories/staff.webp";
      case "ورش ومحاضرات عامة":
      default:
        return "assets/images/categories/general.webp";
    }
  }

  // Helper to format visible category label
  function formatCategoryLabel(category) {
    if (category === "الشباب والفتيات") {
      return "الشباب والفتيات (طلاب إعدادية وثانوية) – مراكز";
    }
    return category || "عام";
  }

  // Generates semantic Card element
  function createCardElement(item) {
    const cardEl = document.createElement("article");
    cardEl.className = "card";
    
    // Determine badges to show in Review Mode
    let reviewBadgesHTML = "";
    if (isReviewMode) {
      if (item.status === "review") {
        reviewBadgesHTML += `<span class="badge badge-review">تحت المراجعة</span> `;
      } else if (item.status === "incomplete") {
        reviewBadgesHTML += `<span class="badge badge-incomplete">غير مكتمل</span> `;
      } else if (item.status === "legacy") {
        reviewBadgesHTML += `<span class="badge badge-legacy">مصدر قديم</span> `;
      } else if (item.status === "source-only") {
        reviewBadgesHTML += `<span class="badge badge-source-only">بنك أفكار</span> `;
      }
      
      if (item.professionalReviewRequired) {
        reviewBadgesHTML += `<span class="badge badge-critical">مراجعة مهنية</span> `;
      }
      if (item.evidenceRequired) {
        reviewBadgesHTML += `<span class="badge badge-critical">طلب توثيق</span> `;
      }
    }
    
    // Resolve Activity Type labels
    let typeLabel = "ورشة عمل";
    if (item.catalogType === "program") typeLabel = "برنامج متكامل";
    else if (item.catalogType === "series" || item.sourceType === "series") typeLabel = "سلسلة لقاءات";
    else if (item.catalogType === "lecture" || item.sourceType === "lecture" || (item.typeOriginal && item.typeOriginal.includes("محاضرة"))) typeLabel = "محاضرة";
    else if (item.catalogType === "legacy") typeLabel = "برنامج قديم (Legacy)";
    
    // Setup target URL based on catalogType
    let targetUrl = `program.html?id=${item.id}`;
    if (item.catalogType === "workshop" || item.catalogType === "series" || item.catalogType === "lecture" || item.sourceType === "lecture" || (item.typeOriginal && item.typeOriginal.includes("محاضرة"))) {
      targetUrl = `workshop.html?id=${item.id}`;
    }
    
    // Render target audiences tags
    const audienceTags = (item.audience || []).slice(0, 3).map(aud => `<span style="font-size: 11px; background-color: var(--color-soft); padding: 2px 8px; border-radius: 4px; color: var(--color-text); font-weight: 500;">${aud}</span>`).join(" ");
    
    // Meetings & Duration string representation
    let meetingsText = item.meetings ? (typeof item.meetings === "number" ? `${item.meetings} لقاءات` : item.meetings) : null;
    let durationText = item.duration || null;
    
    let statsHTML = "";
    if (meetingsText || durationText) {
      statsHTML += `
        <ul class="card-details-list">
          ${meetingsText ? `<li class="card-detail-item"><span class="card-detail-label">اللقاءات:</span> <span>${meetingsText}</span></li>` : ""}
          ${durationText ? `<li class="card-detail-item"><span class="card-detail-label">المدة:</span> <span>${durationText}</span></li>` : ""}
        </ul>
      `;
    }

    const imageUrl = item.image || getCategoryFallbackImage(item.category);
    const summaryText = item.summary || item.description || "";
    
    // Programs and legacy catalog get a top 16:9 cover image, workshops get a compact header thumbnail
    if (item.catalogType === "program" || item.catalogType === "legacy") {
      cardEl.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${imageUrl}" class="card-image" alt="" loading="lazy">
        </div>
        <div class="card-header">
          <div class="card-meta">
            <span class="card-type">${typeLabel}</span>
            <span style="font-size: 11px; color: var(--color-text-muted); font-family: var(--font-headings); font-weight: 500;">${formatCategoryLabel(item.category)}</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${audienceTags}
          </div>
        </div>
        <div class="card-body">
          ${summaryText ? `<p class="card-summary">${summaryText}</p>` : ""}
          ${statsHTML}
          ${isReviewMode && reviewBadgesHTML ? `<div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 4px;">${reviewBadgesHTML}</div>` : ""}
        </div>
        <div class="card-footer">
          <a href="${targetUrl}" class="btn btn-secondary" style="width: 100%;">تفاصيل ومحاور الفعالية</a>
        </div>
      `;
    } else {
      cardEl.innerHTML = `
        <div class="card-header">
          <div style="display: flex; gap: 16px; align-items: start;">
            <img src="${imageUrl}" class="card-thumbnail" alt="" loading="lazy">
            <div style="flex-grow: 1;">
              <div class="card-meta">
                <span class="card-type">${typeLabel}</span>
                <span style="font-size: 11px; color: var(--color-text-muted); font-family: var(--font-headings); font-weight: 500;">${formatCategoryLabel(item.category)}</span>
              </div>
              <h3 class="card-title">${item.title}</h3>
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${audienceTags}
          </div>
        </div>
        <div class="card-body">
          ${summaryText ? `<p class="card-summary">${summaryText}</p>` : ""}
          ${statsHTML}
          ${isReviewMode && reviewBadgesHTML ? `<div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 4px;">${reviewBadgesHTML}</div>` : ""}
        </div>
        <div class="card-footer">
          <a href="${targetUrl}" class="btn btn-secondary" style="width: 100%;">تفاصيل ومحاور الفعالية</a>
        </div>
      `;
    }
    
    return cardEl;
  }
  
  // App Mode UI toggles
  function setupAppModeUI(isReviewMode, config) {
    // Show banner & nav links if in review
    const banner = document.getElementById("reviewBanner");
    const navLink = document.getElementById("reviewNavLink");
    const aboutNote = document.getElementById("aboutReviewNote");
    const legacyFilterOption = document.getElementById("legacyFilterOption");
    const robotsMeta = document.getElementById("robots-meta");
    
    if (isReviewMode) {
      if (banner) banner.style.display = "block";
      if (navLink) navLink.style.display = "block";
      if (aboutNote) aboutNote.style.display = "block";
      if (legacyFilterOption) legacyFilterOption.style.display = "block";
      if (robotsMeta) robotsMeta.setAttribute("content", "noindex,nofollow");
    } else {
      if (banner) banner.style.display = "none";
      if (navLink) navLink.style.display = "none";
      if (aboutNote) aboutNote.style.display = "none";
      if (legacyFilterOption) legacyFilterOption.style.display = "none";
      // In public mode, allow indexing if specified
      if (robotsMeta) robotsMeta.setAttribute("content", "index,follow");
    }
  }
  
  // WhatsApp, Call and Email dynamic configurations
  function setupContactButtons(config, isReviewMode) {
    const heroWhatsapp = document.getElementById("heroWhatsappBtn");
    const contactWhatsapp = document.getElementById("contactWhatsappBtn");
    const contactCall = document.getElementById("contactCallBtn");
    const contactEmail = document.getElementById("contactEmailBtn");
    const footerContactsPlaceholder = document.getElementById("footerContactsPlaceholder");
    
    // 1. WhatsApp Button
    if (config.whatsapp && config.whatsapp.trim() !== "") {
      const waUrl = `https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`;
      if (heroWhatsapp) heroWhatsapp.setAttribute("href", waUrl);
      if (contactWhatsapp) contactWhatsapp.setAttribute("href", waUrl);
    } else {
      if (isReviewMode) {
        disableButton(heroWhatsapp, "رقم WhatsApp بحاجة للإضافة.");
        disableButton(contactWhatsapp, "رقم WhatsApp بحاجة للإضافة.");
      } else {
        hideButton(heroWhatsapp);
        hideButton(contactWhatsapp);
      }
    }
    
    // 2. Call Button
    if (config.phone && config.phone.trim() !== "") {
      if (contactCall) contactCall.setAttribute("href", `tel:${config.phone.trim()}`);
    } else {
      if (isReviewMode) {
        disableButton(contactCall, "رقم الهاتف بحاجة للإضافة.");
      } else {
        hideButton(contactCall);
      }
    }
    
    // 3. Email Button
    if (config.email && config.email.trim() !== "") {
      if (contactEmail) contactEmail.setAttribute("href", `mailto:${config.email.trim()}`);
    } else {
      if (isReviewMode) {
        disableButton(contactEmail, "البريد الإلكتروني بحاجة للإضافة.");
      } else {
        hideButton(contactEmail);
      }
    }
    
    // Update footer contacts dynamically
    if (footerContactsPlaceholder) {
      let contacts = [];
      if (config.phone && config.phone.trim() !== "") contacts.push(`هاتف: ${config.phone}`);
      if (config.email && config.email.trim() !== "") contacts.push(`بريد: ${config.email}`);
      if (config.instagram && config.instagram.trim() !== "") contacts.push(`إنستغرام: ${config.instagram}`);
      
      if (contacts.length > 0) {
        footerContactsPlaceholder.innerHTML = contacts.join(" • ");
      } else {
        const footerContactArea = footerContactsPlaceholder.closest(".footer-contact");
        if (footerContactArea) {
          footerContactArea.style.display = "none";
        }
      }
    }
  }
  
  // Disable button helper
  function disableButton(btn, titleText) {
    if (!btn) return;
    btn.classList.add("disabled");
    btn.setAttribute("title", titleText);
    btn.setAttribute("aria-disabled", "true");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }
  
  // Hide button helper
  function hideButton(btn) {
    if (!btn) return;
    btn.style.display = "none";
  }
  
  // Mobile Navigation Drawer Menu Toggle with scroll lock and Escape closing
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

  function setupContactFormAndWhatsApp(config) {
    // Mada credit and WhatsApp FAB are handled globally by config.js

    // 3. Contact Form Setup
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      if (config.contactFormEmail && config.contactFormEmail.trim() !== "" && config.contactFormEmail.trim() !== "YOUR_EMAIL_HERE") {
        contactForm.setAttribute("action", `https://formsubmit.co/${config.contactFormEmail.trim()}`);
      } else {
        contactForm.setAttribute("action", "#");
      }

      const formPageTitle = document.getElementById("formPageTitle");
      const formPageUrl = document.getElementById("formPageUrl");
      if (formPageTitle) formPageTitle.value = document.title;
      if (formPageUrl) formPageUrl.value = window.location.href;

      // Populate formProgram dropdown select dynamically
      const programSelect = document.getElementById("formProgram");
      if (programSelect) {
        programSelect.innerHTML = '<option value="">اختر البرنامج أو الموضوع</option>';

        // optgroup for Programs
        if (window.CATALOG_PROGRAMS) {
          const programsGroup = document.createElement("optgroup");
          programsGroup.label = "البرامج";
          window.CATALOG_PROGRAMS.forEach(prog => {
            if (prog.status !== "incomplete" && prog.status !== "legacy" && prog.status !== "source-only") {
              const option = document.createElement("option");
              option.value = prog.id;
              option.textContent = prog.title;
              programsGroup.appendChild(option);
            }
          });
          if (programsGroup.children.length > 0) {
            programSelect.appendChild(programsGroup);
          }
        }

        // optgroup for Workshops
        if (window.CATALOG_WORKSHOPS) {
          const workshopsGroup = document.createElement("optgroup");
          workshopsGroup.label = "الورشات والمحاضرات";
          window.CATALOG_WORKSHOPS.forEach(wk => {
            if (wk.id !== "a17-incomplete-row" && wk.status !== "incomplete") {
              const option = document.createElement("option");
              option.value = wk.id;
              option.textContent = wk.title;
              workshopsGroup.appendChild(option);
            }
          });
          if (workshopsGroup.children.length > 0) {
            programSelect.appendChild(workshopsGroup);
          }
        }
      }

      // Read query parameters and preselect
      const urlParams = new URLSearchParams(window.location.search);
      const prefillProgId = urlParams.get("program");
      const prefillWkId = urlParams.get("workshop");
      const targetId = prefillProgId || prefillWkId;
      if (targetId && programSelect) {
        programSelect.value = targetId;
      }

      contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const formStatus = document.getElementById("formStatus");
        if (!formStatus) return;
        
        const nameInput = document.getElementById("formName");
        const instInput = document.getElementById("formInstitution");
        const phoneInput = document.getElementById("formPhone");
        const emailInput = document.getElementById("formEmail");
        
        let isValid = true;
        
        if (!nameInput.value.trim()) {
          nameInput.style.borderColor = "var(--color-accent)";
          isValid = false;
        } else {
          nameInput.style.borderColor = "";
        }
        
        if (!instInput.value.trim()) {
          instInput.style.borderColor = "var(--color-accent)";
          isValid = false;
        } else {
          instInput.style.borderColor = "";
        }
        
        if (!phoneInput.value.trim()) {
          phoneInput.style.borderColor = "var(--color-accent)";
          isValid = false;
        } else {
          phoneInput.style.borderColor = "";
        }
        
        if (emailInput.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.style.borderColor = "var(--color-accent)";
            isValid = false;
          } else {
            emailInput.style.borderColor = "";
          }
        } else {
          emailInput.style.borderColor = "";
        }
        
        if (!isValid) {
          formStatus.className = "form-status error";
          formStatus.textContent = "يرجى تعبئة الحقول المطلوبة بشكل صحيح.";
          formStatus.style.display = "block";
          return;
        }
        
        formStatus.className = "form-status";
        formStatus.textContent = "جاري إرسال الطلب...";
        formStatus.style.display = "block";
        
        const actionUrl = contactForm.getAttribute("action");
        if (!actionUrl || actionUrl === "#") {
          formStatus.className = "form-status error";
          formStatus.textContent = "بريد الاستلام غير مهيأ بعد. يرجى مراجعة ملف الإعدادات.";
          return;
        }
        
        const formData = new FormData(contactForm);
        
        fetch(actionUrl, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            formStatus.className = "form-status success";
            formStatus.innerHTML = "شكرًا لكم، تم إرسال التفاصيل بنجاح.<br><span style='font-size:13px; font-weight:normal;'>سيتم التواصل معكم في أقرب وقت.</span>";
            contactForm.reset();
          } else {
            throw new Error("Submission failed");
          }
        })
        .catch(err => {
          formStatus.className = "form-status error";
          formStatus.textContent = "تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";
        });
      });
    }
  }
});
