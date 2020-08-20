const actions = {
	saveLanguage({ commit }, language) {
		localStorage.setItem('language', language)
	},
}

export default {
  actions,
}
