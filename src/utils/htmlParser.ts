import DOMPurify from 'dompurify';

/**
 * HTML解析和处理工具类
 */
export class HTMLParser {
  /**
   * 提取HTML字符串中的纯文本内容
   * @param htmlString HTML字符串
   * @returns 纯文本内容
   */
  static extractText(htmlString: string): string {
    if (!htmlString) return '';
    
    if (typeof window !== 'undefined') {
      // 客户端：使用DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      return doc.body.textContent || doc.body.innerText || '';
    }
    
    // 服务端：使用正则表达式去除HTML标签
    return htmlString
      .replace(/<[^>]*>/g, '') // 去除HTML标签
      .replace(/&nbsp;/g, ' ') // 替换&nbsp;
      .replace(/&lt;/g, '<')   // 替换&lt;
      .replace(/&gt;/g, '>')   // 替换&gt;
      .replace(/&amp;/g, '&')  // 替换&amp;
      .replace(/&quot;/g, '"') // 替换&quot;
      .replace(/&#39;/g, "'")  // 替换&#39;
      .trim();
  }

  /**
   * 安全地清理HTML内容
   * @param htmlString HTML字符串
   * @param options 清理选项
   * @returns 清理后的HTML字符串
   */
  static sanitize(htmlString: string, options?: {
    allowedTags?: string[];
    allowedAttributes?: string[];
    maxLength?: number;
  }): string {
    if (!htmlString) return '';

    const defaultOptions = {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'],
      allowedAttributes: ['href', 'target', 'rel', 'class'],
      maxLength: undefined
    };

    const config = { ...defaultOptions, ...options };

    const cleanHTML = DOMPurify.sanitize(htmlString, {
      ALLOWED_TAGS: config.allowedTags,
      ALLOWED_ATTR: config.allowedAttributes,
      KEEP_CONTENT: true
    });

    if (config.maxLength) {
      const textContent = this.extractText(cleanHTML);
      if (textContent.length > config.maxLength) {
        const truncatedText = textContent.slice(0, config.maxLength) + '...';
        return DOMPurify.sanitize(`<p>${truncatedText}</p>`);
      }
    }

    return cleanHTML;
  }

  /**
   * 截断HTML内容到指定长度（保持HTML结构）
   * @param htmlString HTML字符串
   * @param maxLength 最大长度
   * @param suffix 后缀（默认为'...'）
   * @returns 截断后的HTML字符串
   */
  static truncateHTML(htmlString: string, maxLength: number, suffix: string = '...'): string {
    if (!htmlString) return '';

    const textContent = this.extractText(htmlString);
    if (textContent.length <= maxLength) {
      return htmlString;
    }

    // 简单截断：提取文本后重新包装
    const truncatedText = textContent.slice(0, maxLength) + suffix;
    return this.sanitize(`<p>${truncatedText}</p>`);
  }

  /**
   * 获取HTML内容的摘要信息
   * @param htmlString HTML字符串
   * @param maxLength 摘要最大长度
   * @returns 摘要信息
   */
  static getSummary(htmlString: string, maxLength: number = 150): {
    text: string;
    isTruncated: boolean;
    originalLength: number;
  } {
    const text = this.extractText(htmlString);
    const isTruncated = text.length > maxLength;
    
    return {
      text: isTruncated ? text.slice(0, maxLength) + '...' : text,
      isTruncated,
      originalLength: text.length
    };
  }

  /**
   * 检查字符串是否包含HTML标签
   * @param str 要检查的字符串
   * @returns 是否包含HTML标签
   */
  static containsHTML(str: string): boolean {
    if (!str) return false;
    return /<[^>]*>/g.test(str);
  }

  /**
   * 提取HTML中的所有链接
   * @param htmlString HTML字符串
   * @returns 链接数组
   */
  static extractLinks(htmlString: string): { text: string; href: string }[] {
    if (!htmlString || typeof window === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a[href]');
    
    return Array.from(links).map(link => ({
      text: link.textContent || '',
      href: link.getAttribute('href') || ''
    }));
  }

  /**
   * 提取HTML中的所有图片
   * @param htmlString HTML字符串
   * @returns 图片信息数组
   */
  static extractImages(htmlString: string): { src: string; alt: string }[] {
    if (!htmlString || typeof window === 'undefined') return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const images = doc.querySelectorAll('img[src]');
    
    return Array.from(images).map(img => ({
      src: img.getAttribute('src') || '',
      alt: img.getAttribute('alt') || ''
    }));
  }
}

/**
 * 便捷的导出函数
 */
export const {
  extractText,
  sanitize,
  truncateHTML,
  getSummary,
  containsHTML,
  extractLinks,
  extractImages
} = HTMLParser; 