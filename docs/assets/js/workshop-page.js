// Workshop details rendering logic
document.addEventListener("DOMContentLoaded", () => {
  const config = window.APP_CONFIG || { mode: "preview" };
  const isReviewMode = config.mode === "review";
  
  // Set current year
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Mobile menu setup
  setupMobileMenu();
  setupAppModeUI(isReviewMode);

  // 1. Resolve ID from URL
  const params = new URLSearchParams(window.location.search);
  const workshopId = params.get("id");
  
  if (!workshopId) {
    showErrorState("معرّف غير صالح", "لم يتم توفير معرّف ورشة صالح في الرابط.");
    return;
  }

  // 2. Find workshop in database
  let workshop = null;
  if (window.CATALOG_WORKSHOPS) {
    workshop = window.CATALOG_WORKSHOPS.find(w => w.id === workshopId);
  }
  
  if (!workshop) {
    showErrorState("الورشة غير موجودة", "عذرًا، لم نجد الورشة أو المحاضرة المطلوبة في قاعدة البيانات.");
    return;
  }

  // 3. Update SEO and Document Metadata
  document.title = `${workshop.title} — د. لبنى كعبية`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", workshop.description || workshop.topic || "");
  }
  
  // Update OG tags
  updateOGTags(workshop.title, workshop.description || workshop.topic || "");

  // 4. Render Header Banner
  const titleEl = document.getElementById("workshopTitle");
  const topicEl = document.getElementById("workshopTopic");
  const typeEl = document.getElementById("workshopType");
  const badgesContainer = document.getElementById("workshopBadgesContainer");
  const headerImg = document.getElementById("detailHeaderImage");
  
  if (titleEl) titleEl.textContent = workshop.title;
  if (topicEl) topicEl.textContent = workshop.topic || "المحور: ورشة عمل تفاعلية";
  
  let typeLabel = "ورشة عمل";
  if (workshop.catalogType === "series") typeLabel = "سلسلة لقاءات";
  else if (workshop.catalogType === "lecture") typeLabel = "محاضرة";
  if (typeEl) typeEl.textContent = typeLabel;

  if (headerImg) {
    const media = headerImg.closest(".detail-header-media");
    if (media) media.style.display = "flex";
    
    headerImg.addEventListener("error", () => {
      if (media) media.style.display = "none";
    });
    
    headerImg.src = workshop.image || getCategoryFallbackImage(workshop.category);
    headerImg.alt = workshop.title;
  }

  // Render review badges if in Review Mode
  if (isReviewMode && badgesContainer) {
    badgesContainer.innerHTML = "";
    if (workshop.status === "review") {
      badgesContainer.innerHTML += `<span class="badge badge-review">تحت المراجعة</span> `;
    } else if (workshop.status === "incomplete") {
      badgesContainer.innerHTML += `<span class="badge badge-incomplete">غير مكتمل</span> `;
    }
    if (workshop.needsReview) {
      badgesContainer.innerHTML += `<span class="badge badge-incomplete">بيانات ناقصة</span> `;
    }
  }

  // 5. Render Meta Details
  const metaAudience = document.getElementById("metaAudience");
  const metaDuration = document.getElementById("metaDuration");
  
  const audienceCard = document.getElementById("audienceMetaCard");
  const durationCard = document.getElementById("durationCard");
  
  // Render Audience
  const resolvedAudience = workshop.audience && workshop.audience.length > 0 ? workshop.audience.join("، ") : null;
  if (resolvedAudience) {
    if (metaAudience) metaAudience.textContent = resolvedAudience;
    if (audienceCard) audienceCard.style.display = "flex";
  } else {
    if (isReviewMode) {
      if (metaAudience) metaAudience.textContent = "بحاجة لتأكيد";
      if (audienceCard) audienceCard.style.display = "flex";
    } else {
      if (audienceCard) audienceCard.style.display = "none";
    }
  }
  
  // Render Duration
  const resolvedDuration = workshop.duration || null;
  if (resolvedDuration) {
    if (metaDuration) metaDuration.textContent = resolvedDuration;
    if (durationCard) durationCard.style.display = "flex";
  } else {
    if (isReviewMode) {
      if (metaDuration) metaDuration.textContent = "بحاجة لتأكيد";
      if (durationCard) durationCard.style.display = "flex";
    } else {
      if (durationCard) durationCard.style.display = "none";
    }
  }

  // Handle Legacy Prices
  const legacyPriceCard = document.getElementById("legacyPriceContainer");
  const metaPrice = document.getElementById("metaPrice");
  
  if (isReviewMode || config.showPrices) {
    if (workshop.priceLegacy) {
      if (legacyPriceCard) legacyPriceCard.style.display = "flex";
      if (metaPrice) {
        metaPrice.textContent = `${workshop.priceLegacy} شيكل جديد ${workshop.priceNote || ""}`;
      }
    }
  }

  // 6. Render Review Notes block if present (Review Mode only)
  const reviewAlert = document.getElementById("reviewNotesAlertContainer");
  const reviewNotesList = document.getElementById("reviewNotesList");
  
  if (isReviewMode && reviewAlert && reviewNotesList && (workshop.reviewNotes && workshop.reviewNotes.length > 0)) {
    reviewAlert.style.display = "block";
    reviewNotesList.innerHTML = workshop.reviewNotes.map(note => `<li>${note}</li>`).join("");
  }

  // 7. Render About Section with Latin word formatting
  const descEl = document.getElementById("workshopDescription");
  if (descEl) descEl.innerHTML = wrapLatinTerms(workshop.description || "لا يوجد وصف أو محاور مفصلة متوفرة حالياً.");

  // Dynamic About Section Heading
  const aboutHeading = document.getElementById("aboutHeading");
  if (aboutHeading) {
    const isLecture = workshop.typeOriginal && (workshop.typeOriginal.includes("محاضرة") || workshop.sourceType === "lecture" || workshop.typeOriginal.includes("تدريب"));
    aboutHeading.textContent = isLecture ? "حول المحاضرة" : "حول الورشة";
  }

  // 8. Render Benefits Section with Latin word formatting
  const benefitsSection = document.getElementById("benefitsSection");
  const benefitsList = document.getElementById("benefitsList");
  
  if (benefitsSection && benefitsList) {
    if (workshop.benefits && workshop.benefits.length > 0) {
      benefitsSection.style.display = "block";
      benefitsList.innerHTML = workshop.benefits.map(b => `<li>${wrapLatinTerms(b)}</li>`).join("");
    } else {
      benefitsSection.style.display = "none";
    }
  }

  // 9. Render Series Accordions (Only if item is a series)
  const seriesSection = document.getElementById("seriesSection");
  const accordionsContainer = document.getElementById("seriesAccordionsContainer");
  
  if (workshop.catalogType === "series" && seriesSection && accordionsContainer) {
    seriesSection.style.display = "block";
    accordionsContainer.innerHTML = "";
    
    if (workshop.sessions && workshop.sessions.length > 0) {
      workshop.sessions.forEach((sess, idx) => {
        const itemEl = document.createElement("div");
        itemEl.className = "accordion-item";
        
        const sessBenefitsHTML = (sess.benefits && sess.benefits.length > 0)
          ? `<div style="margin-top:16px;">
               <h5 style="font-size:13px; margin-bottom:8px; color:var(--color-text);">الفوائد:</h5>
               <ul class="editorial-list" style="font-size:13px;">
                 ${sess.benefits.map(b => `<li>${wrapLatinTerms(b)}</li>`).join("")}
               </ul>
             </div>`
          : "";
        
        const sessDuration = sess.duration || workshop.duration || null;
        const durationHTML = sessDuration ? `<span>المدة: ${sessDuration}</span>` : "";

        const sessAudience = sess.audience && sess.audience.length > 0 ? sess.audience.join("، ") : null;
        const audienceHTML = sessAudience ? `<span>الجمهور: ${sessAudience}</span>` : "";
        
        let metaRowHTML = "";
        if (durationHTML || audienceHTML) {
          metaRowHTML = `
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; font-size:11px; color:var(--color-accent); font-family:var(--font-headings); font-weight:500; margin-bottom:8px;">
              ${durationHTML}
              ${audienceHTML}
            </div>
          `;
        }
          
        itemEl.innerHTML = `
          <button class="accordion-trigger" aria-expanded="false" id="accordion-btn-${idx}" aria-controls="accordion-panel-${idx}">
            <span>اللقاء ${sess.number}: ${wrapLatinTerms(sess.title)}</span>
            <span class="accordion-icon" aria-hidden="true">▼</span>
          </button>
          <div class="accordion-content" id="accordion-panel-${idx}" role="region" aria-labelledby="accordion-btn-${idx}">
            ${metaRowHTML}
            <p style="font-size:13.5px; line-height:1.7;">${wrapLatinTerms(sess.description || "لا يوجد تفاصيل إضافية لهذا اللقاء حاليًا.")}</p>
            ${sessBenefitsHTML}
          </div>
        `;
        accordionsContainer.appendChild(itemEl);
      });
      
      setupAccordions();
    }
  }

  // 10. WhatsApp and Share Action Setup
  setupSidebarActions(workshop, config, isReviewMode);

  // 11. Related Workshops Sidebar Section
  renderRelatedWorkshops(workshop);

  // Helper functions
  
  function showErrorState(title, desc) {
    const errorContainer = document.getElementById("errorMessageContainer");
    const detailsContainer = document.getElementById("workshopDetailsContainer");
    const errTitle = document.getElementById("errorMessageTitle");
    const errDesc = document.getElementById("errorMessageDesc");
    
    if (detailsContainer) detailsContainer.style.display = "none";
    if (errorContainer) errorContainer.style.display = "block";
    if (errTitle) errTitle.textContent = title;
    if (errDesc) errDesc.textContent = desc;
  }
  
  function updateOGTags(title, desc) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute("content", `${title} — د. لبنى كعبية`);
    if (ogDesc) ogDesc.setAttribute("content", desc);
  }

  function setupSidebarActions(workshop, config, isReviewMode) {
    const shareBtn = document.getElementById("shareWorkshopBtn");
    const inquiryBtn = document.getElementById("inquiryBtn");
    
    // Share button
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const shareData = {
          title: `${workshop.title} — د. لبنى كعبية`,
          text: workshop.description || workshop.topic || "",
          url: window.location.href
        };
        
        if (navigator.share) {
          navigator.share(shareData)
            .catch(err => console.log("Error sharing:", err));
        } else {
          // Copy fallback with toast notification
          navigator.clipboard.writeText(window.location.href)
            .then(() => {
              showToast("تم نسخ رابط الورشة بنجاح!");
            })
            .catch(err => {
              console.error("Could not copy text: ", err);
            });
        }
      });
    }

    // Inquiry Button
    if (inquiryBtn) {
      inquiryBtn.setAttribute("href", `index.html?workshop=${workshop.id}#contact`);
    }
  }

  function renderRelatedWorkshops(currentWork) {
    const relatedCard = document.getElementById("relatedCard");
    const relatedContainer = document.getElementById("relatedContainer");
    if (!relatedCard || !relatedContainer || !window.CATALOG_WORKSHOPS) return;

    // Filter by same category and exclude current
    const related = window.CATALOG_WORKSHOPS.filter(w => w.category === currentWork.category && w.id !== currentWork.id && (isReviewMode || w.status === "published"));
    
    if (related.length > 0) {
      relatedCard.style.display = "block";
      relatedContainer.innerHTML = "";
      
      related.slice(0, 3).forEach(w => {
        const link = document.createElement("a");
        link.href = `workshop.html?id=${w.id}`;
        link.className = "related-card-link";
        link.innerHTML = `
          <h4>${w.title}</h4>
          <p class="related-card-desc">${w.topic || w.description}</p>
        `;
        relatedContainer.appendChild(link);
      });
    } else {
      relatedCard.style.display = "none";
    }
  }

  function setupAccordions() {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach(item => {
      const trigger = item.querySelector(".accordion-trigger");
      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        item.classList.toggle("active");
        trigger.setAttribute("aria-expanded", !isActive ? "true" : "false");
      });
    });
  }

  function setupAppModeUI(isReviewMode) {
    const banner = document.getElementById("reviewBanner");
    const navLink = document.getElementById("reviewNavLink");
    
    if (isReviewMode) {
      if (banner) banner.style.display = "block";
      if (navLink) navLink.style.display = "block";
    }
  }

  // Mobile Navigation Drawer with scroll lock and Escape closing
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

  // Helper to wrap Latin terms in bidi-safe markup
  function wrapLatinTerms(text) {
    if (typeof text !== "string") return text;
    const words = ["NLP", "PTSD", "CBT", "SMART", "Burnout", "Enabling"];
    let result = text;
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      result = result.replace(regex, `<bdi>${word}</bdi>`);
    });
    return result;
  }

  // Toast notifier
  function showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-notification";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }
});
