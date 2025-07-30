<template>
  <div class="fontawesome-demo">
    <h2>Font Awesome v7 プロパティ検証</h2>
    
    <!-- 必須プロパティ: icon -->
    <section>
      <h3>必須プロパティ</h3>
      <div class="demo-item">
        <code>icon (必須)</code>
        <font-awesome-icon :icon="faHome" />
        <font-awesome-icon icon="coffee" />
        <font-awesome-icon :icon="['fab', 'github']" />
      </div>
    </section>

    <!-- v7新機能: 新アニメーション -->
    <section>
      <h3>Font Awesome v7 新アニメーション</h3>
      
      <div class="demo-item">
        <code>bounce</code>
        <font-awesome-icon :icon="faHeart" bounce />
      </div>
      
      <div class="demo-item">
        <code>beat</code>
        <font-awesome-icon :icon="faHeart" beat />
      </div>
      
      <div class="demo-item">
        <code>fade</code>
        <font-awesome-icon :icon="faStar" fade />
      </div>
      
      <div class="demo-item">
        <code>beat-fade</code>
        <font-awesome-icon :icon="faStar" beat-fade />
      </div>
      
      <div class="demo-item">
        <code>spin-pulse</code>
        <font-awesome-icon :icon="faSpinner" spin-pulse />
      </div>
      
      <div class="demo-item">
        <code>spin-reverse</code>
        <font-awesome-icon :icon="faSpinner" spin-reverse />
      </div>
    </section>

    <!-- v6から継続サポートされているプロパティ -->
    <section>
      <h3>v6から継続サポートのプロパティ</h3>
      
      <div class="demo-item">
        <code>size</code>
        <font-awesome-icon :icon="faHome" size="xs" />
        <font-awesome-icon :icon="faHome" size="sm" />
        <font-awesome-icon :icon="faHome" size="lg" />
        <font-awesome-icon :icon="faHome" size="xl" />
        <font-awesome-icon :icon="faHome" size="2xl" />
      </div>
      
      <div class="demo-item">
        <code>spin</code>
        <font-awesome-icon :icon="faSpinner" spin />
      </div>
      
      <div class="demo-item">
        <code>pulse</code>
        <font-awesome-icon :icon="faSpinner" pulse />
      </div>
      
      <div class="demo-item">
        <code>rotation</code>
        <font-awesome-icon :icon="faShield" :rotation="90" />
        <font-awesome-icon :icon="faShield" :rotation="180" />
        <font-awesome-icon :icon="faShield" :rotation="270" />
      </div>
      
      <div class="demo-item">
        <code>flip</code>
        <font-awesome-icon :icon="faShield" flip="horizontal" />
        <font-awesome-icon :icon="faShield" flip="vertical" />
        <font-awesome-icon :icon="faShield" flip="both" />
      </div>
      
      <div class="demo-item">
        <code>border</code>
        <font-awesome-icon :icon="faHome" border />
      </div>
      
      <div class="demo-item">
        <code>pull-left / pull-right</code>
        <div>
          <font-awesome-icon :icon="faQuoteLeft" pull-left />
          テキストの左側に配置されたアイコン。このテキストは回り込んで表示されます。
        </div>
        <div>
          <font-awesome-icon :icon="faQuoteRight" pull-right />
          テキストの右側に配置されたアイコン。このテキストは回り込んで表示されます。
        </div>
      </div>
      
      <div class="demo-item">
        <code>inverse</code>
        <span style="background: #333; color: white; padding: 10px;">
          <font-awesome-icon :icon="faHome" inverse />
        </span>
      </div>
      
      <div class="demo-item">
        <code>fixed-width</code>
        <div><font-awesome-icon :icon="faHome" fixed-width />Home</div>
        <div><font-awesome-icon :icon="faUserPlus" fixed-width />Library</div>
        <div><font-awesome-icon :icon="faPen" fixed-width />Applications</div>
      </div>
      
      <div class="demo-item">
        <code>transform</code>
        <font-awesome-icon :icon="faHome" :transform="{ rotate: 45, scale: 1.5 }" />
      </div>
      
      <div class="demo-item">
        <code>mask</code>
        <font-awesome-icon :icon="faHome" :mask="faCircle" />
      </div>
    </section>

    <!-- title prop 検証 -->
    <section>
      <h3>title プロパティ検証（Font Awesome v7制限あり）</h3>
      
      <div class="demo-item">
        <code>title (制限あり)</code>
        <p class="warning">⚠️ Font Awesome v7では title prop の動作が制限されています</p>
        <font-awesome-icon :icon="faHome" title="ホームアイコン" />
        <font-awesome-icon :icon="faHeart" title="ハートアイコン" />
        <font-awesome-icon :icon="faUser" title="ユーザーアイコン" />
      </div>
      
      <div class="demo-item">
        <code>title + titleId</code>
        <font-awesome-icon :icon="faInfoCircle" title="情報アイコン" titleId="info-icon-title" />
      </div>
      
      <div class="demo-item">
        <code>代替案: aria-label</code>
        <p class="info">💡 v7では aria-label の使用を推奨</p>
        <font-awesome-icon :icon="faWarning" aria-label="警告アイコン" />
        <font-awesome-icon :icon="faCheck" aria-label="チェックアイコン" />
      </div>
    </section>

    <!-- スタイル関連 -->
    <section>
      <h3>スタイル関連プロパティ</h3>
      
      <div class="demo-item">
        <code>style</code>
        <font-awesome-icon :icon="faHome" :style="{ color: 'red', fontSize: '2em' }" />
      </div>
      
      <div class="demo-item">
        <code>class</code>
        <font-awesome-icon :icon="faHome" class="custom-icon" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faHome, 
  faHeart, 
  faStar, 
  faSpinner, 
  faShield, 
  faQuoteLeft, 
  faQuoteRight,
  faUserPlus,
  faPen,
  faCircle,
  faUser,
  faInfoCircle,
  faExclamationTriangle as faWarning,
  faCheck
} from '@fortawesome/free-solid-svg-icons'
</script>

<style scoped>
.fontawesome-demo {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.demo-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.demo-item code {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 2px;
  margin-right: 10px;
  font-family: monospace;
}

.custom-icon {
  color: blue;
  font-size: 1.5em;
}

h2, h3 {
  color: #333;
}

section {
  margin: 20px 0;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.warning {
  color: #d04e00;
  background: #fff3cd;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #ffa500;
  margin: 5px 0;
}

.info {
  color: #0c5460;
  background: #d1ecf1;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #17a2b8;
  margin: 5px 0;
}
</style>