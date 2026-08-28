// Program details rendering logic
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
  const programId = params.get("id");
  
  if (!programId) {
    showErrorState("معرّف غير صالح", "لم يتم توفير معرّف برنامج صالح في الرابط.");
    return;
  }

  // 2. Find program in databases
  let program = null;
  
  if (window.CATALOG_PROGRAMS) {
    program = window.CATALOG_PROGRAMS.find(p => p.id === programId);
  }
  
  if (!program && window.CATALOG_LEGACY_PROGRAMS) {
    const legacyItem = window.CATALOG_LEGACY_PROGRAMS.find(p => p.id === programId);
    if (legacyItem) {
      program = {
        ...legacyItem,
        catalogType: "legacy"
      };
    }
  }
  
  if (!program) {
    showErrorState("البرنامج غير موجود", "عذرًا، لم نجد برنامجًا يطابق المعرف المحدد.");
    return;
  }

  // 3. Update SEO and Document Metadata
  document.title = `${program.title} — د. لبنى كعبية`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", program.summary || program.description || "");
  }
  
  // Update OG tags
  updateOGTags(program.title, program.summary || program.description || "");

  // 4. Render Header Banner
  const titleEl = document.getElementById("programTitle");
  const typeEl = document.getElementById("programType");
  const summaryEl = document.getElementById("programSummary");
  const badgesContainer = document.getElementById("programBadgesContainer");
  const headerImg = document.getElementById("detailHeaderImage");
  
  if (titleEl) titleEl.textContent = program.title;
  if (summaryEl) summaryEl.textContent = program.summary || (program.description ? program.description.slice(0, 120) + "..." : "");
  
  let typeLabel = "برنامج متكامل";
  if (program.catalogType === "legacy") typeLabel = "برنامج قديم (Legacy)";
  if (typeEl) typeEl.textContent = typeLabel;

  if (headerImg) {
    const media = headerImg.closest(".detail-header-media");
    if (media) media.style.display = "flex";
    
    headerImg.addEventListener("error", () => {
      if (media) media.style.display = "none";
    });
    
    headerImg.src = program.image || getCategoryFallbackImage(program.category);
    headerImg.alt = program.title;
  }

  // Render review badges if in Review Mode
  if (isReviewMode && badgesContainer) {
    badgesContainer.innerHTML = "";
    if (program.status === "review") {
      badgesContainer.innerHTML += `<span class="badge badge-review">تحت المراجعة</span> `;
    } else if (program.status === "legacy") {
      badgesContainer.innerHTML += `<span class="badge badge-legacy">مصدر قديم</span> `;
    }
    if (program.professionalReviewRequired) {
      badgesContainer.innerHTML += `<span class="badge badge-critical">مراجعة مهنية مطلوبة</span> `;
    }
    if (program.evidenceRequired) {
      badgesContainer.innerHTML += `<span class="badge badge-critical">يتطلب توثيق/إثبات</span> `;
    }
    if (program.needsReview) {
      badgesContainer.innerHTML += `<span class="badge badge-incomplete">بيانات متناقضة/ناقصة</span> `;
    }
  }

  // 5. Render Meta Details with hiding rules
  const metaAudience = document.getElementById("metaAudience");
  const metaMeetings = document.getElementById("metaMeetings");
  const metaDuration = document.getElementById("metaDuration");
  
  const audienceCard = document.getElementById("audienceMetaCard");
  const meetingsCard = document.getElementById("meetingsMetaCard");
  const durationCard = document.getElementById("durationMetaCard");
  
  // Render Audience
  const resolvedAudience = program.audience && program.audience.length > 0 ? program.audience.join("، ") : null;
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
  
  // Render Meetings
  const resolvedMeetings = program.meetings ? `${program.meetings} لقاءات` : null;
  if (resolvedMeetings) {
    if (metaMeetings) metaMeetings.textContent = resolvedMeetings;
    if (meetingsCard) meetingsCard.style.display = "flex";
  } else {
    if (isReviewMode) {
      if (metaMeetings) metaMeetings.textContent = "بحاجة لتأكيد";
      if (meetingsCard) meetingsCard.style.display = "flex";
    } else {
      if (meetingsCard) meetingsCard.style.display = "none";
    }
  }
  
  // Render Duration (specifically keep aware-mother-balanced-teen duration unresolved)
  let resolvedDuration = program.duration || null;
  if (program.id === "aware-mother-balanced-teen") {
    resolvedDuration = null;
  }
  
  if (resolvedDuration) {
    if (metaDuration) metaDuration.textContent = resolvedDuration;
    if (durationCard) durationCard.style.display = "flex";
  } else {
    if (isReviewMode) {
      if (metaDuration) {
        if (program.id === "aware-mother-balanced-teen") {
          metaDuration.innerHTML = `<span class="text-accent" style="font-weight:600;">بحاجة لتأكيد (تناقض)</span>`;
        } else {
          metaDuration.textContent = "بحاجة لتأكيد";
        }
      }
      if (durationCard) durationCard.style.display = "flex";
    } else {
      if (durationCard) durationCard.style.display = "none";
    }
  }

  // Handle Legacy Prices
  const legacyPriceCard = document.getElementById("legacyPriceContainer");
  const metaPrice = document.getElementById("metaPrice");
  
  if (program.catalogType === "legacy") {
    if (isReviewMode || config.showPrices) {
      if (legacyPriceCard) legacyPriceCard.style.display = "flex";
      if (metaPrice) {
        metaPrice.textContent = program.priceLegacy 
          ? `${program.priceLegacy} شيكل جديد ${program.priceNote || ""}` 
          : "غير متوفر";
      }
    }
  }

  // 6. Render Review Notes block if present
  const reviewAlert = document.getElementById("reviewNotesAlertContainer");
  const reviewNotesList = document.getElementById("reviewNotesList");
  
  if (isReviewMode && reviewAlert && reviewNotesList && (program.reviewNotes && program.reviewNotes.length > 0)) {
    reviewAlert.style.display = "block";
    reviewNotesList.innerHTML = program.reviewNotes.map(note => `<li>${note}</li>`).join("");
  }

  // 7. Render About Section with Latin word formatting
  const descEl = document.getElementById("programDescription");
  if (descEl) descEl.innerHTML = wrapLatinTerms(program.description || "لا يوجد وصف متوفر للبرنامج حاليًا.");

  // 8. Render Goals Section with Latin word formatting
  const goalsSection = document.getElementById("goalsSection");
  const goalsGeneral = document.getElementById("goalsGeneral");
  const goalsDetailedList = document.getElementById("goalsDetailedList");
  
  if (goalsSection) {
    const hasGeneralGoal = program.goals && program.goals.general;
    const hasDetailedGoals = program.goals && program.goals.detailed && program.goals.detailed.length > 0;
    
    if (hasGeneralGoal || hasDetailedGoals) {
      goalsSection.style.display = "block";
      if (goalsGeneral) {
        goalsGeneral.innerHTML = wrapLatinTerms(program.goals.general || "أهداف البرنامج العامة:");
      }
      if (goalsDetailedList) {
        if (hasDetailedGoals) {
          goalsDetailedList.innerHTML = program.goals.detailed.map(g => `<li>${wrapLatinTerms(g)}</li>`).join("");
        } else {
          goalsDetailedList.style.display = "none";
        }
      }
    } else {
      goalsSection.style.display = "none";
    }
  }

  // 9. Render Sessions timeline
  const sessionsSection = document.getElementById("sessionsSection");
  const sessionsTimeline = document.getElementById("sessionsTimeline");
  
  if (sessionsSection && sessionsTimeline) {
    if (program.sessions && program.sessions.length > 0) {
      sessionsSection.style.display = "block";
      sessionsTimeline.innerHTML = "";
      
      program.sessions.forEach(sess => {
        const node = document.createElement("div");
        node.className = "session-node";
        
        const topicsHTML = (sess.topics && sess.topics.length > 0)
          ? `<div class="session-topics">
               <h5>المواضيع والمحاور الرئيسية:</h5>
               <ul class="editorial-list" style="margin-top: 8px;">
                 ${sess.topics.map(t => `<li>${wrapLatinTerms(t)}</li>`).join("")}
               </ul>
             </div>`
          : "";
          
        const activitiesHTML = (sess.activities && sess.activities.length > 0)
          ? `<div class="session-topics" style="border-top:none; padding-top:4px;">
               <h5>الأنشطة المقترحة:</h5>
               <ul class="editorial-list" style="margin-top: 8px; font-size:13px;">
                 ${sess.activities.map(a => `<li>${wrapLatinTerms(a)}</li>`).join("")}
               </ul>
             </div>`
          : "";
        
        const sessDuration = sess.duration || program.duration || null;
        const durationHTML = sessDuration ? `<span class="session-meta-tag">${sessDuration}</span>` : "";

        node.innerHTML = `
          <div class="session-number">${sess.number}</div>
          <div class="session-details">
            ${durationHTML}
            <h4 class="session-title">${wrapLatinTerms(sess.title)}</h4>
            ${sess.goal ? `<p style="font-size:13px; color: var(--color-text); margin-bottom:8px;"><strong>الهدف:</strong> ${wrapLatinTerms(sess.goal)}</p>` : ""}
            ${sess.description ? `<p style="font-size:13px; margin-bottom:12px;">${wrapLatinTerms(sess.description)}</p>` : ""}
            ${topicsHTML}
            ${activitiesHTML}
          </div>
        `;
        sessionsTimeline.appendChild(node);
      });
    } else {
      sessionsSection.style.display = "none";
    }
  }

  // 10. Sidebar sections
  
  // Methodology list
  const methodologyCard = document.getElementById("methodologyCard");
  const methodologyList = document.getElementById("methodologyList");
  if (methodologyCard && methodologyList) {
    if (program.methodology && program.methodology.length > 0) {
      methodologyCard.style.display = "block";
      methodologyList.innerHTML = program.methodology.map(m => `<li>${wrapLatinTerms(m)}</li>`).join("");
    } else {
      methodologyCard.style.display = "none";
    }
  }

  // Outcomes / Benefits
  const outcomesCard = document.getElementById("outcomesCard");
  const outcomesList = document.getElementById("outcomesList");
  if (outcomesCard && outcomesList) {
    const combinedList = [...(program.outcomes || []), ...(program.benefits || [])];
    if (combinedList.length > 0) {
      outcomesCard.style.display = "block";
      outcomesList.innerHTML = combinedList.map(o => `<li>${wrapLatinTerms(o)}</li>`).join("");
    } else {
      outcomesCard.style.display = "none";
    }
  }

  // 11. WhatsApp and Share Action Setup
  setupSidebarActions(program, config, isReviewMode);

  // 12. Related Programs Sidebar Section
  renderRelatedPrograms(program);

  // Helper functions
  
  function showErrorState(title, desc) {
    const errorContainer = document.getElementById("errorMessageContainer");
    const detailsContainer = document.getElementById("programDetailsContainer");
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

  function setupSidebarActions(program, config, isReviewMode) {
    const shareBtn = document.getElementById("shareProgramBtn");
    const inquiryBtn = document.getElementById("inquiryBtn");
    
    // Share button
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const shareData = {
          title: `${program.title} — د. لبنى كعبية`,
          text: program.summary || program.description || "",
          url: window.location.href
        };
        
        if (navigator.share) {
          navigator.share(shareData)
            .catch(err => console.log("Error sharing:", err));
        } else {
          // Copy fallback using custom toast notification
          navigator.clipboard.writeText(window.location.href)
            .then(() => {
              showToast("تم نسخ رابط البرنامج بنجاح!");
            })
            .catch(err => {
              console.error("Could not copy text: ", err);
            });
        }
      });
    }

    // Inquiry Button
    if (inquiryBtn) {
      inquiryBtn.setAttribute("href", `index.html?program=${program.id}#contact`);
    }
  }

  function renderRelatedPrograms(currentProg) {
    const relatedCard = document.getElementById("relatedCard");
    const relatedContainer = document.getElementById("relatedContainer");
    if (!relatedCard || !relatedContainer || !window.CATALOG_PROGRAMS) return;

    // Filter by same category and exclude current
    const related = window.CATALOG_PROGRAMS.filter(p => p.category === currentProg.category && p.id !== currentProg.id && (isReviewMode || p.status === "published"));
    
    if (related.length > 0) {
      relatedCard.style.display = "block";
      relatedContainer.innerHTML = "";
      
      related.slice(0, 3).forEach(p => {
        const link = document.createElement("a");
        link.href = `program.html?id=${p.id}`;
        link.className = "related-card-link";
        link.innerHTML = `
          <h4>${p.title}</h4>
          <p class="related-card-desc">${p.summary || p.description}</p>
        `;
        relatedContainer.appendChild(link);
      });
    } else {
      relatedCard.style.display = "none";
    }
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
