import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './TranslationsEN'
import jp from './TranslationsJP'

Vue.use(VueI18n)

const translations = Object.assign(en, jp)

export default new VueI18n({
	locale: navigator.language.split('-')[0],
	fallbackLocale: 'en',
	messages: translations,
})
