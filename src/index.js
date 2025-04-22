import "./styles.css"

window.addEventListener("DOMContentLoaded", () => {
	setVh();
	adjustBannerMargin();
});
window.addEventListener("resize", () => {
	setVh();
	adjustBannerMargin();
});

document.getElementById('subscription-form').addEventListener('submit', function (event) {
	event.preventDefault();

	const selectedTypeSubscription = document.querySelector('input[name="subscription"]:checked').value;

	let url = '';

	if (selectedTypeSubscription === "yearly") {
		url = "https://apple.com/";
	} else {
		url = "https://google.com/";
	}

	window.location.href = url;
});

const supportedLanguages = [ "de", "en", "es", "fr", "ja", "pt" ]
const translations = {
	de: require('../public/lang/de.json'),
	en: require('../public/lang/en.json'),
	es: require('../public/lang/es.json'),
	fr: require('../public/lang/fr.json'),
	ja: require('../public/lang/ja.json'),
	pt: require('../public/lang/pt.json'),
};
window.addEventListener('DOMContentLoaded', () => {
	const lang = detectLanguage();
	document.body.setAttribute('data-lang', lang);
	translateText(lang);
})

function detectLanguage() {
	const searchParams = new URLSearchParams(window.location.search);
	const urlLanguage = searchParams.get("lang");
	const systemLanguage = navigator.language.slice(0, 2);
	if (urlLanguage && supportedLanguages.includes(urlLanguage)) {
		return urlLanguage;
	}
	return supportedLanguages.includes(systemLanguage) ? systemLanguage : 'en';
}

function translateText(lang) {
	const currentTranslations = translations[lang] || translations['en'];
	document.querySelectorAll('[data-i18n]').forEach((element) => {
		let key = element.getAttribute('data-i18n');
		let values = {};
		const valuesAttribute = element.getAttribute('data-i18n-values')
		if (valuesAttribute) {
			try {
				values = JSON.parse(valuesAttribute);
			} catch (error) {
				console.warn("Parsing error:", error);
			}
		}
		element.innerHTML = t(key, values, currentTranslations);
	})
}

function t(key, values = {}, currentTranslations) {
	const translateString = currentTranslations[key] || key;
	if (!translateString) {
		console.warn(`Missing translation key: "${ key }"`);
		return key;
	}
	return interpolate(translateString, values);
}

function interpolate(translateString, values = {}) {
	return translateString.replace(/{{(.*?)}}/g, (_, key) => values[key.trim()] || '')
}

setVh();

function setVh() {
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${ vh }px`);
}

function adjustBannerMargin() {
	const viewportHeight = window.innerHeight;
	const screenHeight = screen.height;
	const searchBarHeight = screenHeight - viewportHeight;

	const header = document.querySelector('h1');
	const baseMarginTop = parseFloat(getComputedStyle(header).marginTop) || 0;
	if (searchBarHeight > 0) {
		header.style.marginTop = `${ Math.max(baseMarginTop - searchBarHeight, 0) }px`;
	} else {
		header.style.marginTop = `${ baseMarginTop }px`;
	}
}











