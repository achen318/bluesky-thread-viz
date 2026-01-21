import './style.css';

import { renderTree } from './renderTree';

document.getElementById('threadForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const input = document.getElementById('threadUrl') as HTMLInputElement;
  const parts = input.value.split('/');

  const atId = parts[4];
  const rkey = parts[6];

  try {
    const res = await fetch(
      `http://localhost:8000/?at_id=${atId}&rkey=${rkey}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();

    console.log('Fetched thread data:', data);

    renderTree(data);
    window.addEventListener('resize', () => renderTree(data));
  } catch (error) {
    console.error('Error fetching thread data:', error);
  }
});
