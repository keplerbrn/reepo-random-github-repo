import { localization } from '../core/localization.js';

export function createSearchBar(onSearch) {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-bar';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-input';
  input.placeholder = localization.t('search.placeholder');
  input.setAttribute('aria-label', localization.t('search.placeholder'));

  const clearBtn = document.createElement('button');
  clearBtn.className = 'search-clear btn btn-ghost btn-small';
  clearBtn.textContent = '✕';
  clearBtn.style.display = 'none';
  clearBtn.setAttribute('aria-label', localization.t('search.clear'));

  input.addEventListener('input', (e) => {
    const val = e.target.value;
    clearBtn.style.display = val ? 'block' : 'none';
    onSearch(val);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    onSearch('');
    input.focus();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);
  return wrapper;
}