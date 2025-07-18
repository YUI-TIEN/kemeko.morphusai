/**
 * Section Progress Tracker
 * @description 智能的 Section 基礎進度條系統
 * 
 * 功能：
 * - 偵測當前用戶所在的 Section
 * - 計算 Section 內的滾動百分比
 * - 精確顯示進度條在對應的導航項目上
 * - 支援平滑過渡和點擊導航時的精確定位
 */

interface SectionInfo {
  id: string;
  element: HTMLElement;
  navItem: HTMLElement;
  progressFiller: HTMLElement;
  navLink: HTMLElement;
  index: number;
}

interface ScrollInfo {
  y: number;
  limit: number;
  direction: 'up' | 'down';
}

export class SectionProgressTracker {
  private sections: SectionInfo[] = [];
  private currentSection: SectionInfo | null = null;
  private observer: IntersectionObserver | null = null;
  private isScrolling = false;
  private scrollTimeout: number | null = null;
  
  // 設定
  private readonly INTERSECTION_THRESHOLD = 0.5; // 50% 可見度才算進入section
  private readonly SCROLL_THROTTLE = 16; // 約 60fps
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    // 等待 DOM 完全載入
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  private setup(): void {
    this.collectSections();
    this.setupIntersectionObserver();
    this.setupScrollListener();
    this.updateInitialState();
  }
  
  /**
   * 收集所有相關的 Section 和對應的導航項目
   */
  private collectSections(): void {
    const navItems = Array.from(document.querySelectorAll('.nav__item:not(.nav__item--lang)'));
    
    this.sections = navItems
      .map((navItem, index) => {
        const navLink = navItem.querySelector('.nav__link') as HTMLElement;
        const progressFiller = navItem.querySelector('.nav-item-progress') as HTMLElement;
        
        if (!navLink || !progressFiller) return null;
        
        // 跳過 logo 項目
        if (navLink.classList.contains('nav__link--logo')) return null;
        
        const href = navLink.getAttribute('href');
        if (!href || !href.startsWith('#')) return null;
        
        const sectionId = href.substring(1);
        const sectionElement = document.getElementById(sectionId);
        
        if (!sectionElement) return null;
        
        return {
          id: sectionId,
          element: sectionElement,
          navItem: navItem as HTMLElement,
          progressFiller,
          navLink,
          index
        };
      })
      .filter(Boolean) as SectionInfo[];
  }
  
  /**
   * 設置 Intersection Observer 來偵測當前 Section
   */
  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // 上下各保留20%的邊距
      threshold: this.INTERSECTION_THRESHOLD
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionInfo = this.sections.find(s => s.element === entry.target);
          if (sectionInfo) {
            this.setCurrentSection(sectionInfo);
          }
        }
      });
    }, options);
    
    // 觀察所有 sections
    this.sections.forEach(section => {
      this.observer?.observe(section.element);
    });
  }
  
  /**
   * 設置滾動監聽器
   */
  private setupScrollListener(): void {
    // 支援 Locomotive Scroll
    window.addEventListener('locomotiveScroll', (event: CustomEvent) => {
      this.handleScroll(event.detail);
    });
    
    // 回退到原生滾動
    window.addEventListener('scroll', () => {
      this.handleScroll({
        y: window.scrollY,
        limit: document.documentElement.scrollHeight - window.innerHeight,
        direction: 'down' // 簡化處理
      });
    }, { passive: true });
  }
  
  /**
   * 處理滾動事件
   */
  private handleScroll(scrollInfo: ScrollInfo): void {
    if (this.isScrolling) return;
    
    this.isScrolling = true;
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = window.setTimeout(() => {
      requestAnimationFrame(() => {
        this.updateProgress(scrollInfo);
        this.isScrolling = false;
      });
    }, this.SCROLL_THROTTLE);
  }
  
  /**
   * 設置當前 Section
   */
  private setCurrentSection(sectionInfo: SectionInfo): void {
    if (this.currentSection === sectionInfo) return;
    
    // 清除舊的活動狀態
    if (this.currentSection) {
      this.currentSection.navLink.classList.remove('active-section');
    }
    
    // 設置新的活動狀態
    this.currentSection = sectionInfo;
    this.currentSection.navLink.classList.add('active-section');
    
    // 立即更新進度
    this.updateProgress();
  }
  
  /**
   * 更新進度條
   */
  private updateProgress(scrollInfo?: ScrollInfo): void {
    if (!this.currentSection) return;
    
    // 計算當前 Section 的滾動百分比
    const sectionProgress = this.calculateSectionProgress(this.currentSection, scrollInfo);
    
    // 更新進度條顯示
    this.updateProgressDisplay(this.currentSection, sectionProgress);
  }
  
  /**
   * 計算 Section 內的滾動百分比
   */
  private calculateSectionProgress(sectionInfo: SectionInfo, scrollInfo?: ScrollInfo): number {
    const element = sectionInfo.element;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // 如果 Section 完全在視窗上方，進度為 100%
    if (rect.bottom < 0) return 100;
    
    // 如果 Section 完全在視窗下方，進度為 0%
    if (rect.top > windowHeight) return 0;
    
    // 計算 Section 在視窗中的可見部分
    const visibleTop = Math.max(0, -rect.top);
    const visibleBottom = Math.min(rect.height, windowHeight - rect.top);
    const visibleHeight = visibleBottom - visibleTop;
    
    // 計算滾動進度
    const progress = Math.max(0, Math.min(100, (visibleTop / rect.height) * 100));
    
    return progress;
  }
  
  /**
   * 更新進度條顯示
   */
  private updateProgressDisplay(sectionInfo: SectionInfo, progress: number): void {
    const { progressFiller, navLink, index } = sectionInfo;
    
    // 清除所有其他項目的進度
    this.sections.forEach((section, idx) => {
      if (section === sectionInfo) return;
      
      let fillPercent = 0;
      
      // 在當前 section 之前的項目顯示 100%
      if (idx < index) {
        fillPercent = 100;
      }
      // 在當前 section 之後的項目顯示 0%
      else if (idx > index) {
        fillPercent = 0;
      }
      
      section.progressFiller.style.width = fillPercent + '%';
      section.navLink.style.setProperty('--progress-text-start', fillPercent + '%');
      section.navLink.classList.toggle('progress-filled', fillPercent === 100);
    });
    
    // 更新當前 section 的進度
    progressFiller.style.width = progress + '%';
    navLink.style.setProperty('--progress-text-start', progress + '%');
    navLink.classList.toggle('progress-filled', progress === 100);
  }
  
  /**
   * 更新初始狀態
   */
  private updateInitialState(): void {
    // 找到當前可見的 section
    const viewportCenter = window.innerHeight / 2;
    let closestSection: SectionInfo | null = null;
    let closestDistance = Infinity;
    
    this.sections.forEach(section => {
      const rect = section.element.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = section;
      }
    });
    
    if (closestSection) {
      this.setCurrentSection(closestSection);
    }
  }
  
  /**
   * 當點擊導航項目時調用
   */
  public onNavigationClick(targetSectionId: string): void {
    const targetSection = this.sections.find(s => s.id === targetSectionId);
    if (!targetSection) return;
    
    // 立即設置為當前 section
    this.setCurrentSection(targetSection);
    
    // 滾動完成後確保進度正確
    setTimeout(() => {
      this.updateProgress();
    }, 500); // 給滾動動畫時間
  }
  
  /**
   * 銷毀實例
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}

// 全域實例
let sectionProgressTracker: SectionProgressTracker | null = null;

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  sectionProgressTracker = new SectionProgressTracker();
});

// 導出給其他模組使用
export function getSectionProgressTracker(): SectionProgressTracker | null {
  return sectionProgressTracker;
}