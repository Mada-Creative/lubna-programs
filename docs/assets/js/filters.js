// Filter and Search Utility functions for the Catalog
(function() {
  
  // Combines all items from active databases based on application mode
  window.getCombinedCatalog = function() {
    const config = window.APP_CONFIG || { mode: "preview" };
    const mode = config.mode || "preview";
    
    let combined = [];
    
    // 1. Add core programs
    if (window.CATALOG_PROGRAMS) {
      window.CATALOG_PROGRAMS.forEach(item => {
        if (mode === "review" || mode === "preview") {
          if (item.status !== "incomplete" && item.status !== "legacy" && item.status !== "source-only") {
            combined.push({
              ...item,
              catalogType: item.sourceType || "program"
            });
          }
        } else if (mode === "public") {
          if (item.status === "published") {
            combined.push({
              ...item,
              catalogType: item.sourceType || "program"
            });
          }
        }
      });
    }
    
    // 2. Add workshops
    if (window.CATALOG_WORKSHOPS) {
      window.CATALOG_WORKSHOPS.forEach(item => {
        if (mode === "review") {
          combined.push({
            ...item,
            catalogType: item.sourceType || "workshop"
          });
        } else if (mode === "preview") {
          if (item.id !== "a17-incomplete-row" && item.status !== "incomplete") {
            combined.push({
              ...item,
              catalogType: item.sourceType || "workshop"
            });
          }
        } else if (mode === "public") {
          if (item.status === "published") {
            combined.push({
              ...item,
              catalogType: item.sourceType || "workshop"
            });
          }
        }
      });
    }
    
    // 3. Add legacy programs (Only in review mode)
    if (window.CATALOG_LEGACY_PROGRAMS && mode === "review") {
      window.CATALOG_LEGACY_PROGRAMS.forEach(item => {
        combined.push({
          ...item,
          catalogType: "legacy"
        });
      });
    }
    
    return combined;
  };
  
  // Matches items against target categories based on editorial definitions
  window.filterByTargetCategory = function(items, categoryKey) {
    if (!categoryKey || categoryKey === "all") {
      return items;
    }
    
    return items.filter(item => {
      const cat = item.category || "";
      const audience = item.audience || [];
      
      const checkAudience = (keywords) => {
        return audience.some(aud => keywords.some(kw => aud.includes(kw)));
      };
      
      switch (categoryKey) {
        case "students":
          return cat === "المدارس والطلاب" || checkAudience(["طلاب", "ثانوية", "مدرسة", "تاسع", "عاشر", "حادي عشر", "ثاني عشر"]);
        case "parents":
          return cat === "الأهالي والأسرة" || checkAudience(["أهال", "أمهات", "آباء", "أسرة", "عائلة"]);
        case "women":
          return cat === "النساء والتمكين" || checkAudience(["نساء", "أمهات", "زوجات", "مطلقات", "أرامل"]);
        case "youth":
          return cat === "الشباب والفتيات" || checkAudience(["شباب", "فتيات", "مراهق", "بنين", "بنات"]);
        case "recovery":
          return cat === "الإدمان والتعافي" || checkAudience(["تعافي", "تعاطي", "سموم", "إدمان", "متعاطين", "متعافين"]);
        case "general-workshops":
          return cat === "ورش ومحاضرات عامة";
        case "staff":
          return cat === "الطواقم المهنية" || checkAudience(["طاقم", "طواقم", "معلم", "معلمين", "تدريسي", "مهني"]);
        default:
          return false;
      }
    });
  };
  
  // Filters items by activity type (program, series, workshop, lecture, legacy)
  window.filterByActivityType = function(items, typeKey) {
    if (!typeKey || typeKey === "all") {
      return items;
    }
    
    return items.filter(item => {
      // Normalizes types (program, series, workshop, lecture, legacy)
      return item.catalogType === typeKey;
    });
  };
  
  // Performs deep Arabic text searching
  window.searchCatalog = function(items, query) {
    if (!query || query.trim() === "") {
      return items;
    }
    
    const cleanQuery = query.trim().toLowerCase();
    
    return items.filter(item => {
      const title = (item.title || "").toLowerCase();
      const topic = (item.topic || "").toLowerCase();
      const summary = (item.summary || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const cat = (item.category || "").toLowerCase();
      const audienceStr = (item.audience || []).join(" ").toLowerCase();
      
      // Also search sessions titles if any
      let sessionsStr = "";
      if (item.sessions && Array.isArray(item.sessions)) {
        sessionsStr = item.sessions.map(s => (s.title || "") + " " + (s.description || "")).join(" ").toLowerCase();
      }
      
      // Also search detailed goals if any
      let goalsStr = "";
      if (item.goals) {
        if (typeof item.goals === "string") {
          goalsStr = item.goals.toLowerCase();
        } else if (item.goals.detailed && Array.isArray(item.goals.detailed)) {
          goalsStr = item.goals.detailed.join(" ").toLowerCase();
        }
      }
      
      return title.includes(cleanQuery) ||
             topic.includes(cleanQuery) ||
             summary.includes(cleanQuery) ||
             desc.includes(cleanQuery) ||
             cat.includes(cleanQuery) ||
             audienceStr.includes(cleanQuery) ||
             sessionsStr.includes(cleanQuery) ||
             goalsStr.includes(cleanQuery);
    });
  };
  
})();
