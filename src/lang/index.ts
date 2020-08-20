import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './TranslationsEN'
import jp from './TranslationsJP'
import es from './TranslationsES'
import pt from './TranslationsPT'

Vue.use(VueI18n)

const translations = Object.assign(en, jp, es, pt)

var languages = ['en', 'ja', 'es', 'pt']

function checkLanguage(language) {
	return navigator.language.split('-')[0] == language
}

export default new VueI18n({
	locale: localStorage.getItem('language') != null ? localStorage.getItem('language') : (languages.some(checkLanguage) ? navigator.language.split('-')[0] : 'en'),
	fallbackLocale: 'en',
	messages: translations,
})
