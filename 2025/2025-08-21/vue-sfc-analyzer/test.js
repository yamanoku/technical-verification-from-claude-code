import VueSFCAnalyzer from './index.js';

/**
 * テスト用のサンプルVue SFCファイル
 */
const sampleVueContent = `<template>
  <div class="container">
    <h1 id="title">{{ title }}</h1>
    <section aria-label="コンテンツエリア">
      <article v-for="item in items" :key="item.id">
        <header>{{ item.title }}</header>
        <p>{{ item.description }}</p>
      </article>
    </section>
    <button @click="handleClick" :disabled="loading">
      クリック
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Item {
  id: number;
  title: string;
  description: string;
}

const title = ref<string>('Vue SFC解析テスト');
const loading = ref<boolean>(false);
const items = ref<Item[]>([]);

const computedValue = computed(() => {
  return items.value.filter(item => item.title.length > 5);
});

const handleClick = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    items.value = [...data];
  } catch (error) {
    console.error('データ取得エラー:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await handleClick();
});
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  padding: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

#title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: hsl(220, 13%, 18%);
  transform: translateY(-10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(0);
    color: hsl(220, 13%, 28%);
  }
}

section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

article {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  header {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
}

button {
  background: var(--primary-color, #3b82f6);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background: var(--primary-hover, #2563eb);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>`;

/**
 * テスト実行
 */
async function runTests() {
  console.log('🧪 Vue SFC解析ツールのテストを開始します...\n');
  
  const analyzer = new VueSFCAnalyzer();
  
  try {
    // サンプルコンテンツの解析
    const result = await analyzer.analyzeContent(sampleVueContent, 'test-component.vue');
    
    // レポート出力
    console.log(analyzer.generateReport(result));
    
    // 詳細な解析結果の出力
    console.log('\n=== 詳細解析結果 ===');
    console.log(JSON.stringify({
      filename: result.filename,
      blocks: {
        template: result.blocks.template ? {
          type: result.blocks.template.type,
          lang: result.blocks.template.lang,
          elements: result.blocks.template.elements,
          attributes: result.blocks.template.attributes
        } : null,
        script: result.blocks.script ? {
          type: result.blocks.script.type,
          lang: result.blocks.script.lang,
          setup: result.blocks.script.setup,
          jsFeatures: result.blocks.script.jsFeatures
        } : null,
        scriptSetup: result.blocks.scriptSetup ? {
          type: result.blocks.scriptSetup.type,
          lang: result.blocks.scriptSetup.lang,
          setup: result.blocks.scriptSetup.setup,
          jsFeatures: result.blocks.scriptSetup.jsFeatures
        } : null,
        styles: result.blocks.styles.map(style => ({
          type: style.type,
          lang: style.lang,
          scoped: style.scoped,
          cssFeatures: style.cssFeatures
        }))
      },
      analysis: result.analysis
    }, null, 2));
    
    console.log('\n✅ テスト完了！');
    
  } catch (error) {
    console.error('❌ テストエラー:', error.message);
    process.exit(1);
  }
}

runTests();