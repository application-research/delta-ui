export function setCookie(name: string, val: string) {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);

  const expires = date.toUTCString();
  document.cookie = `${name}=${val}; expires=${expires}; path=/`;
}

/**
 * Source: https://gist.github.com/wpsmith/6cf23551dd140fb72ae7
 */
export function getCookie(name: string): string {
  let value = `; ${document.cookie}`;
	let parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}