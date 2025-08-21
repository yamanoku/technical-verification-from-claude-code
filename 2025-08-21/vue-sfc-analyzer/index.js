import { parse as parseSFC } from '@vue/compiler-sfc';
import { computeBaseline } from 'compute-baseline';
import { features } from 'web-features';
import fs from 'fs';
import path from 'path';

/**
 * Vue SFC解析ツール
 * Single File Componentからtemplate、script、styleブロックを抽出し、
 * Baseline Widely Availableの評価を行う
 */
class VueSFCAnalyzer {
  constructor() {
    this.features = features;
  }

  /**
   * .vueファイルを解析してブロック情報を抽出
   * @param {string} filePath - .vueファイルのパス
   * @returns {Object} 解析結果
   */
  async analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return this.analyzeContent(content, filePath);
  }

  /**
   * Vue SFCの内容を解析
   * @param {string} content - .vueファイルの内容
   * @param {string} filename - ファイル名（エラー表示用）
   * @returns {Object} 解析結果
   */
  async analyzeContent(content, filename = 'unknown.vue') {
    try {
      // Vue SFCをパース
      const { descriptor, errors } = parseSFC(content, { filename });
      
      if (errors.length > 0) {
        throw new Error(`SFC解析エラー: ${errors.map(e => e.message).join(', ')}`);
      }

      const result = {
        filename,
        blocks: {
          template: this.analyzeTemplateBlock(descriptor.template),
          script: this.analyzeScriptBlock(descriptor.script),
          scriptSetup: this.analyzeScriptBlock(descriptor.scriptSetup),
          styles: descriptor.styles.map(style => this.analyzeStyleBlock(style))
        },
        analysis: {
          templateFeatures: [],
          scriptFeatures: [],
          styleFeatures: [],
          baselineStatus: 'unknown'
        }
      };

      // 各ブロックのBaseline評価を実行
      await this.evaluateBaselineCompatibility(result);

      return result;
    } catch (error) {
      return {
        filename,
        error: error.message,
        blocks: null,
        analysis: null
      };
    }
  }

  /**
   * templateブロックの解析
   * @param {Object} template - templateブロック
   * @returns {Object} 解析結果
   */
  analyzeTemplateBlock(template) {
    if (!template) return null;

    return {
      type: 'template',
      lang: template.lang || 'html',
      content: template.content,
      loc: template.loc,
      attrs: template.attrs,
      // HTMLタグと属性を抽出
      elements: this.extractHTMLElements(template.content),
      attributes: this.extractHTMLAttributes(template.content)
    };
  }

  /**
   * scriptブロックの解析
   * @param {Object} script - scriptブロック
   * @returns {Object} 解析結果
   */
  analyzeScriptBlock(script) {
    if (!script) return null;

    return {
      type: script.setup ? 'script-setup' : 'script',
      lang: script.lang || 'js',
      content: script.content,
      loc: script.loc,
      attrs: script.attrs,
      setup: script.setup || false,
      // JavaScript機能を抽出
      jsFeatures: this.extractJavaScriptFeatures(script.content)
    };
  }

  /**
   * styleブロックの解析
   * @param {Object} style - styleブロック
   * @returns {Object} 解析結果
   */
  analyzeStyleBlock(style) {
    return {
      type: 'style',
      lang: style.lang || 'css',
      content: style.content,
      loc: style.loc,
      attrs: style.attrs,
      scoped: style.scoped || false,
      module: style.module || false,
      // CSS機能を抽出
      cssFeatures: this.extractCSSFeatures(style.content)
    };
  }

  /**
   * HTMLの要素を抽出（簡易版）
   * @param {string} content - HTMLコンテンツ
   * @returns {Array} 抽出された要素名
   */
  extractHTMLElements(content) {
    const elementRegex = /<(\w+)(?:\s|>)/g;
    const elements = new Set();
    let match;
    
    while ((match = elementRegex.exec(content)) !== null) {
      elements.add(match[1].toLowerCase());
    }
    
    return Array.from(elements);
  }

  /**
   * HTML属性を抽出（簡易版）
   * @param {string} content - HTMLコンテンツ
   * @returns {Array} 抽出された属性名
   */
  extractHTMLAttributes(content) {
    const attrRegex = /\s([\w-]+)(?:=|[\s>])/g;
    const attributes = new Set();
    let match;
    
    while ((match = attrRegex.exec(content)) !== null) {
      const attr = match[1].toLowerCase();
      if (!attr.startsWith('v-') && !attr.startsWith(':') && !attr.startsWith('@')) {
        attributes.add(attr);
      }
    }
    
    return Array.from(attributes);
  }

  /**
   * JavaScript機能を抽出（簡易版）
   * @param {string} content - JavaScriptコンテンツ
   * @returns {Array} 抽出された機能
   */
  extractJavaScriptFeatures(content) {
    const features = new Set();
    
    // ES6+機能の検出
    if (content.includes('=>')) features.add('arrow-functions');
    if (content.includes('async') || content.includes('await')) features.add('async-await');
    if (content.includes('const ') || content.includes('let ')) features.add('block-scoping');
    if (content.includes('...')) features.add('spread-syntax');
    if (content.includes('`')) features.add('template-literals');
    if (content.match(/class\s+\w+/)) features.add('es6-classes');
    if (content.includes('import ') || content.includes('export ')) features.add('es6-modules');
    
    return Array.from(features);
  }

  /**
   * CSS機能を抽出（簡易版）
   * @param {string} content - CSSコンテンツ
   * @returns {Array} 抽出された機能
   */
  extractCSSFeatures(content) {
    const features = new Set();
    
    // CSS機能の検出
    if (content.includes('grid')) features.add('css-grid');
    if (content.includes('flex')) features.add('flexbox');
    if (content.includes('var(')) features.add('css-custom-properties');
    if (content.includes('@media')) features.add('css-media-queries');
    if (content.includes('transform')) features.add('css-transforms');
    if (content.includes('transition') || content.includes('animation')) features.add('css-transitions');
    if (content.includes('calc(')) features.add('css-calc');
    
    return Array.from(features);
  }

  /**
   * Baseline互換性評価
   * @param {Object} result - 解析結果オブジェクト
   */
  async evaluateBaselineCompatibility(result) {
    const allFeatures = new Set();
    
    // 各ブロックから機能を収集
    if (result.blocks.template) {
      result.blocks.template.elements.forEach(el => allFeatures.add(`html-${el}`));
      result.blocks.template.attributes.forEach(attr => allFeatures.add(`html-attr-${attr}`));
    }
    
    if (result.blocks.script) {
      result.blocks.script.jsFeatures.forEach(feature => allFeatures.add(`js-${feature}`));
    }
    
    if (result.blocks.scriptSetup) {
      result.blocks.scriptSetup.jsFeatures.forEach(feature => allFeatures.add(`js-${feature}`));
    }
    
    result.blocks.styles.forEach(style => {
      style.cssFeatures.forEach(feature => allFeatures.add(`css-${feature}`));
    });

    // 各機能のBaseline状態を評価
    const featureStatuses = {};
    const widelyAvailable = [];
    const newlyAvailable = [];
    const notBaseline = [];

    for (const feature of allFeatures) {
      // 実際のweb-featuresとの照合は簡易版
      const status = this.getFeatureBaselineStatus(feature);
      featureStatuses[feature] = status;
      
      switch (status) {
        case 'widely':
          widelyAvailable.push(feature);
          break;
        case 'newly':
          newlyAvailable.push(feature);
          break;
        default:
          notBaseline.push(feature);
      }
    }

    // 全体の評価
    let overallStatus = 'widely';
    if (notBaseline.length > 0) {
      overallStatus = 'not-baseline';
    } else if (newlyAvailable.length > 0) {
      overallStatus = 'newly';
    }

    result.analysis = {
      totalFeatures: allFeatures.size,
      featureStatuses,
      widelyAvailable,
      newlyAvailable,
      notBaseline,
      baselineStatus: overallStatus
    };
  }

  /**
   * 機能のBaseline状態を取得（簡易版）
   * @param {string} feature - 機能名
   * @returns {string} Baseline状態
   */
  getFeatureBaselineStatus(feature) {
    // 簡易的な評価ロジック
    const widelyAvailableFeatures = [
      'html-div', 'html-span', 'html-p', 'html-h1', 'html-h2', 'html-h3',
      'html-attr-class', 'html-attr-id', 'html-attr-style',
      'js-arrow-functions', 'js-block-scoping', 'js-template-literals',
      'css-flexbox', 'css-media-queries', 'css-transforms'
    ];
    
    const newlyAvailableFeatures = [
      'css-grid', 'css-custom-properties', 'js-async-await',
      'js-spread-syntax', 'css-calc'
    ];
    
    if (widelyAvailableFeatures.includes(feature)) {
      return 'widely';
    } else if (newlyAvailableFeatures.includes(feature)) {
      return 'newly';
    } else {
      return 'not-baseline';
    }
  }

  /**
   * 解析結果をレポート形式で出力
   * @param {Object} result - 解析結果
   * @returns {string} レポート文字列
   */
  generateReport(result) {
    if (result.error) {
      return `エラー: ${result.error}`;
    }

    let report = `\n=== Vue SFC解析レポート: ${result.filename} ===\n\n`;
    
    // ブロック情報
    if (result.blocks.template) {
      report += `📄 Template (${result.blocks.template.lang}):\n`;
      report += `  - 要素: ${result.blocks.template.elements.join(', ')}\n`;
      report += `  - 属性: ${result.blocks.template.attributes.join(', ')}\n\n`;
    }
    
    if (result.blocks.script) {
      report += `📜 Script (${result.blocks.script.lang}):\n`;
      report += `  - 機能: ${result.blocks.script.jsFeatures.join(', ')}\n\n`;
    }
    
    if (result.blocks.scriptSetup) {
      report += `⚙️ Script Setup (${result.blocks.scriptSetup.lang}):\n`;
      report += `  - 機能: ${result.blocks.scriptSetup.jsFeatures.join(', ')}\n\n`;
    }
    
    if (result.blocks.styles.length > 0) {
      result.blocks.styles.forEach((style, i) => {
        report += `🎨 Style ${i + 1} (${style.lang}):\n`;
        report += `  - Scoped: ${style.scoped}\n`;
        report += `  - 機能: ${style.cssFeatures.join(', ')}\n\n`;
      });
    }
    
    // Baseline評価
    report += `🎯 Baseline Widely Available評価:\n`;
    report += `  - 総合評価: ${result.analysis.baselineStatus}\n`;
    report += `  - 検出機能数: ${result.analysis.totalFeatures}\n`;
    report += `  - Widely Available: ${result.analysis.widelyAvailable.length}個\n`;
    report += `  - Newly Available: ${result.analysis.newlyAvailable.length}個\n`;
    report += `  - Not Baseline: ${result.analysis.notBaseline.length}個\n\n`;
    
    if (result.analysis.notBaseline.length > 0) {
      report += `⚠️ Baseline未対応機能:\n`;
      result.analysis.notBaseline.forEach(feature => {
        report += `  - ${feature}\n`;
      });
    }
    
    return report;
  }
}

export default VueSFCAnalyzer;

// CLI実行時の処理
if (process.argv[2]) {
  const analyzer = new VueSFCAnalyzer();
  const filePath = process.argv[2];
  
  analyzer.analyzeFile(filePath)
    .then(result => {
      console.log(analyzer.generateReport(result));
    })
    .catch(error => {
      console.error('解析エラー:', error.message);
    });
}