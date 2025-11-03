// Robust client-side search for product cards
// Collect product data from elements with classes like `.col-6.col-md-3`.
function getAllProducts() {
	const products = [];
	const productElements = document.querySelectorAll('.col-6.col-md-3');

	productElements.forEach(product => {
		const titleEl = product.querySelector('.fw-semibold');
		const imgEl = product.querySelector('img');
		const priceEl = product.querySelector('.text-danger');

		const title = titleEl ? titleEl.textContent.trim() : 'Untitled';
		const image = (imgEl && imgEl.src) ? imgEl.src : 'assets/img/placeholder.png';
		const price = priceEl ? priceEl.textContent.trim() : '';

		products.push({
			title,
			image,
			price,
			element: product
		});
	});

	return products;
}

function createSearchDropdown() {
	const searchBox = document.querySelector('.search-box');
	if (!searchBox) return null;
	const dropdown = document.createElement('div');
	dropdown.className = 'search-dropdown';
	dropdown.style.cssText = `
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		box-shadow: 0 4px 6px rgba(0,0,0,0.08);
		border-radius: 4px;
		max-height: 300px;
		overflow-y: auto;
		z-index: 1000;
		display: none;
	`;
	searchBox.appendChild(dropdown);
	return dropdown;
}

function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function createResultItem(product) {
	return `
		<div class="search-result-item" data-title="${escapeHtml(product.title)}" style="
			display: flex;
			align-items: center;
			padding: 10px;
			cursor: pointer;
			border-bottom: 1px solid #eee;
		">
			<img src="${escapeHtml(product.image)}" alt="" style="
				width: 50px;
				height: 50px;
				object-fit: cover;
				margin-right: 10px;
			">
			<div style="flex-grow: 1;">
				<div style="font-weight: 500; color: #111;">${escapeHtml(product.title)}</div>
				<div style="color: #666; font-size: 0.9em;">${escapeHtml(product.price)}</div>
			</div>
		</div>
	`;
}

function initializeSearch() {
	const searchInput = document.getElementById('searchInput');
	const searchIcon = document.getElementById('searchIcon');
	if (!searchInput) return;

	const products = getAllProducts();
	const dropdown = createSearchDropdown();
	if (!dropdown) return;

	function performSearch(query) {
		query = String(query || '').toLowerCase();
		if (!query) {
			dropdown.style.display = 'none';
			return;
		}

		const results = products.filter(product =>
			product.title.toLowerCase().includes(query)
		);

		if (results.length > 0) {
			dropdown.innerHTML = results.map(r => createResultItem(r)).join('');
			dropdown.style.display = 'block';
		} else {
			dropdown.style.display = 'none';
		}
	}

	searchInput.addEventListener('input', (e) => {
		performSearch(e.target.value);
	});

	searchInput.addEventListener('focus', () => {
		if (searchInput.value) performSearch(searchInput.value);
	});

	if (searchIcon) {
		searchIcon.addEventListener('click', () => performSearch(searchInput.value));
	}

	document.addEventListener('click', (e) => {
		if (!e.target.closest('.search-box')) {
			dropdown.style.display = 'none';
		}
	});

	dropdown.addEventListener('click', (e) => {
		const resultItem = e.target.closest('.search-result-item');
		if (!resultItem) return;
		const title = resultItem.getAttribute('data-title');
		const product = products.find(p => p.title === title);
		if (product && product.element) {
			product.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
			product.element.style.transition = 'background-color 0.3s';
			product.element.style.backgroundColor = '#fff9c4';
			setTimeout(() => { product.element.style.backgroundColor = ''; }, 1500);
		}
		dropdown.style.display = 'none';
		searchInput.value = '';
	});
}

document.addEventListener('DOMContentLoaded', initializeSearch);

