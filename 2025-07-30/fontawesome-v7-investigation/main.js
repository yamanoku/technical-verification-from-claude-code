import { createApp } from 'vue'
import FontAwesome7Demo from './FontAwesome7Demo.vue'

// Font Awesome設定
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// アイコンライブラリに追加
library.add(fas, far, fab)

const app = createApp(FontAwesome7Demo)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')