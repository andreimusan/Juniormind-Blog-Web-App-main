export const ShowAlert = (status: number) => {
  switch (status) {
    case 400:
      alert("400 - Bad request");
      break;
    case 401:
      alert("401 - Unauthorized");
      break;
    case 403:
      alert("403 - Forbidden");
      break;
    case 404:
      alert("404 - Not found");
      break;
    default:
      alert("500 - Unexpected server error");
      break;
  }
};
