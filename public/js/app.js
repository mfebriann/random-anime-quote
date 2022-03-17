const searchAnime = document.getElementById('search-anime');
const pageQuote = document.getElementById('page-quote');
const params = new URLSearchParams(window.location.search);

function linkLangActive(languages, linkLang) {
	languages.forEach((languageNonActive) => {
		languageNonActive.classList.replace('font-bold', 'font-light');
		languageNonActive.classList.remove('underline');
	});

	linkLang.classList.replace('font-light', 'font-bold');
	linkLang.classList.add('underline');
}

const titleSearchAnimeFirst = document.querySelector('#quotes h2');
function titleBasedPage(textEn, textId) {
	if (params.get('lang') === 'en') {
		titleSearchAnimeFirst.textContent = textEn;
	} else {
		titleSearchAnimeFirst.textContent = textId;
	}
}

const pageName = window.location.href.split('/').slice(-1)[0].split('.')[0];
if (pageName == 'random-quote') {
	titleBasedPage('Click button random', 'Klik tombol random');
} else {
	titleBasedPage('Search anime first', 'Cari anime terlebih dahulu');
}

function printHtmlQuotes(data) {
	const wrapQuote = document.getElementById('quotes');
	wrapQuote.innerHTML = '';
	wrapQuote.classList.remove('grid', 'gap-6', 'sm:grid-cols-2', 'md:grid-cols-3');
	wrapQuote.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" class="mx-auto animate-spin">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" fill="rgba(255,255,255,1)" />
                    </svg>`;

	setTimeout(() => {
		if (data.result.length === 0) {
			if (params.get('lang') === 'en') {
				wrapQuote.innerHTML = `<h2 class="text-2xl font-bold text-center w-full sm:text-3xl">Anime not found</h2>`;
			} else {
				wrapQuote.innerHTML = `<h2 class="text-2xl font-bold text-center w-full sm:text-3xl">Anime tidak ditemukan</h2>`;
			}
		} else {
			const animeQuotes = data.result;
			wrapQuote.innerHTML = '';
			wrapQuote.classList.add('grid', 'gap-6', 'sm:grid-cols-2');
			animeQuotes.forEach((animeQuote) => {
				if (params.get('lang') === 'en') {
					wrapQuote.innerHTML += `<div class="bg-gray-600 px-3 py-5 rounded shadow-md shadow-white/50 text-center h-max">
																		<blockquote class="italic font-light">"${animeQuote.english}"</blockquote>
																		<span class="text-sm mt-6 block font-bold">- ${animeQuote.character} -</span>
																		<span class="text-xs mt-1 block">Anime: ${animeQuote.anime}</span>
																	</div>`;
				} else {
					wrapQuote.innerHTML += `<div class="bg-gray-600 px-3 py-5 rounded shadow-md shadow-white/50 text-center h-max">
																		<blockquote class="italic font-light">"${animeQuote.indo}"</blockquote>
																		<span class="text-sm mt-6 block font-bold">- ${animeQuote.character} -</span>
																		<span class="text-xs mt-1 block">Anime: ${animeQuote.anime}</span>
																	</div>`;
				}
			});
		}
	}, 150);
}

function fetchAPI() {
	let url;
	if (pageQuote.value <= 0 || pageQuote.value === '' || isNaN(pageQuote.value)) {
		url = `https://katanime.vercel.app/api/getbyanime?anime=${searchAnime.value}&page=1`;
		pageQuote.value = 1;
	} else {
		url = `https://katanime.vercel.app/api/getbyanime?anime=${searchAnime.value}&page=${pageQuote.value}`;
	}

	fetch(url)
		.then((response) => response.json())
		.then((quotes) => {
			printHtmlQuotes(quotes);
		});
}

document.forms[0].addEventListener('submit', (e) => {
	e.preventDefault();

	fetchAPI();
});

const languages = document.getElementById('language').querySelectorAll('a');
languages.forEach((language) => {
	language.addEventListener('click', (e) => {
		e.preventDefault();

		languages.forEach((languageNonActive) => {
			languageNonActive.classList.replace('font-bold', 'font-light');
			languageNonActive.classList.remove('underline');
		});

		const valueParams = language.href.split('=')[1];
		window.history.pushState('', '', `?lang=${valueParams}`);
		language.classList.replace('font-light', 'font-bold');
		language.classList.add('underline');

		window.location.reload();
	});
});

if (params.get('lang') === 'en') {
	linkLangActive(languages, languages[1]);
} else {
	linkLangActive(languages, languages[0]);
}

const btnRandom = document.getElementById('btn-random');
if (btnRandom != null) {
	btnRandom.addEventListener('click', () => {
		fetch('https://katanime.vercel.app/api/getrandom')
			.then((response) => response.json())
			.then((quotes) => {
				printHtmlQuotes(quotes);
			});
	});
}
