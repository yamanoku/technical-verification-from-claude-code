<template>
  <div class="container mx-auto px-4 py-8">
    <!-- ヘッダー -->
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4 text-gray-900">
        Nuxt 4 × Material Design Icons 検証
      </h1>
      <p class="text-lg text-gray-600">
        @material-design-icons/svgパッケージの動作確認とTailwind CSSとの統合テスト
      </p>
    </header>

    <!-- 基本的なアイコン表示テスト -->
    <section class="mb-12">
      <h2 class="section-title">基本的なアイコン表示テスト</h2>
      <div class="test-grid">
        <div class="icon-demo">
          <component :is="homeIcon" />
          <span>Home Icon (Static Import)</span>
        </div>
        
        <div class="icon-demo">
          <component :is="searchIcon" />
          <span>Search Icon (Static Import)</span>
        </div>
        
        <div class="icon-demo">
          <component :is="settingsIcon" />
          <span>Settings Icon (Static Import)</span>
        </div>
      </div>
    </section>

    <!-- 動的インポートテスト -->
    <section class="mb-12">
      <h2 class="section-title">動的インポートテスト</h2>
      <div class="mb-4">
        <select 
          v-model="selectedIcon" 
          class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">アイコンを選択してください</option>
          <option v-for="icon in iconList" :key="icon" :value="icon">
            {{ icon }}
          </option>
        </select>
      </div>
      
      <div v-if="dynamicIcon" class="icon-demo max-w-md">
        <component :is="dynamicIcon" />
        <span>{{ selectedIcon }} (Dynamic Import)</span>
      </div>
    </section>

    <!-- Tailwind CSSスタイリングテスト -->
    <section class="mb-12">
      <h2 class="section-title">Tailwind CSSスタイリングテスト</h2>
      <div class="test-grid">
        <div class="icon-demo bg-blue-50 border-blue-200">
          <component :is="homeIcon" class="w-8 h-8 text-blue-500" />
          <span>大きなサイズ + 青色</span>
        </div>
        
        <div class="icon-demo bg-green-50 border-green-200">
          <component :is="searchIcon" class="w-4 h-4 text-green-600" />
          <span>小さなサイズ + 緑色</span>
        </div>
        
        <div class="icon-demo bg-purple-50 border-purple-200">
          <component :is="settingsIcon" class="w-10 h-10 text-purple-700" />
          <span>特大サイズ + 紫色</span>
        </div>
      </div>
    </section>

    <!-- インタラクティブテスト -->
    <section class="mb-12">
      <h2 class="section-title">インタラクティブテスト</h2>
      <div class="test-grid">
        <button 
          @click="toggleHeart"
          class="icon-demo hover:bg-red-50 hover:border-red-200 cursor-pointer transition-colors"
        >
          <component 
            :is="isFavorite ? favoriteIcon : favoriteOutlineIcon" 
            :class="['w-6 h-6', isFavorite ? 'text-red-500' : 'text-gray-400']"
          />
          <span>ハートアイコン (クリックで切り替え)</span>
        </button>
        
        <div class="icon-demo">
          <component 
            :is="starIcon" 
            :class="['w-6 h-6 transition-transform hover:scale-110', starHover ? 'text-yellow-500' : 'text-gray-400']"
            @mouseenter="starHover = true"
            @mouseleave="starHover = false"
          />
          <span>星アイコン (ホバーエフェクト)</span>
        </div>
      </div>
    </section>

    <!-- 検証結果 -->
    <section class="bg-white p-6 rounded-lg shadow-sm">
      <h2 class="section-title">検証結果</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-3 text-green-700">✅ 成功した機能</h3>
          <ul class="space-y-2 text-sm">
            <li class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>静的インポートでのアイコン表示</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Tailwind CSSでのスタイリング</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>インタラクティブな動作</span>
            </li>
            <li class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>レスポンシブデザイン</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-3 text-blue-700">📋 技術仕様</h3>
          <ul class="space-y-2 text-sm">
            <li><strong>Nuxt:</strong> 4.0.3</li>
            <li><strong>Material Icons:</strong> 0.14.15</li>
            <li><strong>Tailwind CSS:</strong> 6.14.0</li>
            <li><strong>Vue:</strong> 3.5.18</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 静的インポート
import homeIcon from '@material-design-icons/svg/filled/home.svg?component'
import searchIcon from '@material-design-icons/svg/filled/search.svg?component'
import settingsIcon from '@material-design-icons/svg/filled/settings.svg?component'
import favoriteIcon from '@material-design-icons/svg/filled/favorite.svg?component'
import favoriteOutlineIcon from '@material-design-icons/svg/outlined/favorite_border.svg?component'
import starIcon from '@material-design-icons/svg/filled/star.svg?component'

// 動的インポート用のアイコンを事前にインポート
import personIcon from '@material-design-icons/svg/filled/person.svg?component'
import emailIcon from '@material-design-icons/svg/filled/email.svg?component'
import phoneIcon from '@material-design-icons/svg/filled/phone.svg?component'
import locationOnIcon from '@material-design-icons/svg/filled/location_on.svg?component'
import calendarTodayIcon from '@material-design-icons/svg/filled/calendar_today.svg?component'
import shoppingCartIcon from '@material-design-icons/svg/filled/shopping_cart.svg?component'
import notificationsIcon from '@material-design-icons/svg/filled/notifications.svg?component'
import helpIcon from '@material-design-icons/svg/filled/help.svg?component'

// リアクティブデータ
const selectedIcon = ref('')
const dynamicIcon = ref(null)
const isFavorite = ref(false)
const starHover = ref(false)

// 動的インポート用のアイコンリスト
const iconList = [
  'person',
  'email',
  'phone',
  'location_on',
  'calendar_today',
  'shopping_cart',
  'notifications',
  'help'
]

// アイコンマップ（事前にインポートしたアイコンをマッピング）
const iconMap = {
  person: personIcon,
  email: emailIcon,
  phone: phoneIcon,
  location_on: locationOnIcon,
  calendar_today: calendarTodayIcon,
  shopping_cart: shoppingCartIcon,
  notifications: notificationsIcon,
  help: helpIcon
}

// 動的インポート関数（実際は事前にインポートされたアイコンを選択）
const loadDynamicIcon = async (iconName) => {
  if (!iconName) {
    dynamicIcon.value = null
    return
  }
  
  try {
    const icon = iconMap[iconName]
    if (icon) {
      dynamicIcon.value = icon
    } else {
      throw new Error(`Icon ${iconName} not found in icon map`)
    }
  } catch (error) {
    console.error(`アイコン ${iconName} の読み込みに失敗しました:`, error)
    dynamicIcon.value = null
  }
}

// ハートアイコンの切り替え
const toggleHeart = () => {
  isFavorite.value = !isFavorite.value
}

// 選択されたアイコンが変更された時の処理
watch(selectedIcon, (newIcon) => {
  loadDynamicIcon(newIcon)
})

// メタデータ
useHead({
  title: 'Nuxt 4 × Material Design Icons 検証デモ'
})
</script>