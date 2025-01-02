export function getQueryParams(url = window.location.href) {
  const urlParams = new URLSearchParams(new URL(url).search);
  const queryParams: any = {};

  urlParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
}
