/**
 * KEMEKO Email Protection
 * @description Email obfuscation and protection utilities
 */

import { SECURITY_CONFIG } from '../config/animation';
import { ErrorHandler } from './errorHandler';

export class EmailProtection {
  private static instance: EmailProtection;

  private constructor() {}

  public static getInstance(): EmailProtection {
    if (!EmailProtection.instance) {
      EmailProtection.instance = new EmailProtection();
    }
    return EmailProtection.instance;
  }

  /**
   * Obfuscate email address using base64 encoding
   */
  public obfuscateEmail(email: string): string {
    if (!SECURITY_CONFIG.emailObfuscation) {
      return email;
    }

    try {
      // Base64 encode the email
      const encoded = btoa(email);
      return encoded;
    } catch (error) {
      ErrorHandler.getInstance().logError('Failed to obfuscate email', error);
      return email;
    }
  }

  /**
   * Deobfuscate email address
   */
  public deobfuscateEmail(encodedEmail: string): string {
    try {
      // Base64 decode the email
      const decoded = atob(encodedEmail);
      return decoded;
    } catch (error) {
      ErrorHandler.getInstance().logError('Failed to deobfuscate email', error);
      return encodedEmail;
    }
  }

  /**
   * Create protected mailto link
   */
  public createProtectedMailtoLink(
    email: string,
    subject?: string,
    body?: string,
    className?: string
  ): string {
    const obfuscatedEmail = this.obfuscateEmail(email);
    const params = new URLSearchParams();
    
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    
    const paramString = params.toString();
    const href = paramString ? `?${paramString}` : '';
    
    return `<a href="#" 
              data-email="${obfuscatedEmail}" 
              data-params="${href}"
              class="protected-email ${className || ''}"
              onclick="return EmailProtection.handleEmailClick(this)">
              ${this.displayEmail(email)}
            </a>`;
  }

  /**
   * Display email with partial obfuscation
   */
  private displayEmail(email: string): string {
    if (!SECURITY_CONFIG.emailObfuscation) {
      return email;
    }

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    // Obfuscate part of the local part
    const visibleStart = Math.min(2, localPart.length);
    const visibleEnd = Math.min(1, localPart.length - visibleStart);
    const obfuscatedMiddle = '*'.repeat(Math.max(0, localPart.length - visibleStart - visibleEnd));
    
    const obfuscatedLocal = localPart.substring(0, visibleStart) + 
                           obfuscatedMiddle + 
                           localPart.substring(localPart.length - visibleEnd);

    return `${obfuscatedLocal}@${domain}`;
  }

  /**
   * Handle email click (to be called from inline onclick)
   */
  public static handleEmailClick(element: HTMLElement): boolean {
    try {
      const instance = EmailProtection.getInstance();
      const encodedEmail = element.getAttribute('data-email');
      const params = element.getAttribute('data-params') || '';
      
      if (!encodedEmail) return false;
      
      const email = instance.deobfuscateEmail(encodedEmail);
      const mailtoUrl = `mailto:${email}${params}`;
      
      // Use window.location.href to avoid popup blockers
      window.location.href = mailtoUrl;
      
      return false;
    } catch (error) {
      ErrorHandler.getInstance().logError('Email click handler failed', error);
      return false;
    }
  }

  /**
   * Initialize email protection for existing elements
   */
  public initializeEmailProtection(): void {
    if (!SECURITY_CONFIG.emailObfuscation) {
      console.log('📧 Email protection disabled by configuration');
      return;
    }

    try {
      // Replace all mailto links with protected versions
      const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
      
      if (mailtoLinks.length === 0) {
        console.log('📧 No mailto links found to protect');
        return;
      }
      
      mailtoLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const email = href.replace('mailto:', '').split('?')[0];
        const url = new URL(href);
        const subject = url.searchParams.get('subject') || undefined;
        const body = url.searchParams.get('body') || undefined;
        const className = link.className;
        
        const protectedLink = this.createProtectedMailtoLink(email, subject, body, className);
        link.outerHTML = protectedLink;
      });
      
      console.log(`📧 Protected ${mailtoLinks.length} email links`);
    } catch (error) {
      ErrorHandler.getInstance().logError('Failed to initialize email protection', error);
    }
  }

  /**
   * Add email protection to form submissions
   */
  public protectContactForms(): void {
    try {
      const forms = document.querySelectorAll('form[data-protect-email]');
      
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const formData = new FormData(form as HTMLFormElement);
          const emailInputs = form.querySelectorAll('input[type="email"]');
          
          emailInputs.forEach(input => {
            const email = (input as HTMLInputElement).value;
            if (email) {
              formData.set(input.getAttribute('name') || 'email', this.obfuscateEmail(email));
            }
          });
          
          // Handle form submission with protected email
          this.handleProtectedFormSubmission(form as HTMLFormElement, formData);
        });
      });
    } catch (error) {
      ErrorHandler.getInstance().logError('Failed to protect contact forms', error);
    }
  }

  /**
   * Handle protected form submission
   */
  private handleProtectedFormSubmission(form: HTMLFormElement, formData: FormData): void {
    // This would typically send to your backend
    console.log('Protected form submission:', Object.fromEntries(formData));
    
    // For now, just show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.textContent = '訊息已安全送出！';
    form.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  }
}

/**
 * Initialize email protection when DOM is ready
 */
export function initializeEmailProtection(): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      EmailProtection.getInstance().initializeEmailProtection();
      EmailProtection.getInstance().protectContactForms();
    });
  } else {
    EmailProtection.getInstance().initializeEmailProtection();
    EmailProtection.getInstance().protectContactForms();
  }
}

/**
 * Make EmailProtection available globally for onclick handlers
 */
declare global {
  interface Window {
    EmailProtection: typeof EmailProtection;
  }
}

if (typeof window !== 'undefined') {
  window.EmailProtection = EmailProtection;
}