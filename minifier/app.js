const sourceCodeInput = document.querySelector(".js-source");
const minifiedCodeInput = document.querySelector(".js-minified");
const removeClosingTagsInput = document.querySelector(
  ".js-remove_closing_tags"
);
const copyButton = document.querySelector(".js-copy");

const minify = (s, removeClosingTags = false) => {
  /* Remove \n followed by \s */
  s = s.replace(/\n\s*/gim, "");

  if (removeClosingTags) {
    s = s.replace(/<\/\w+>/gim, "");
  }

  /* Remove extra spaces after : , */
  s = s.replace(/(:|,)\s+/g, "$1");

  /* Remove extra spaces before { */
  s = s.replace(/\s+({)/g, "$1");

  /* Remove px from width, height, margin, padding & inset values */
  s = s.replace(
    /(width|height|margin|padding|top|right|bottom|left):(\d+)px/gim,
    "$1:$2"
  );

  /* Remove quotes from attributes' values */
  s = s.replace(
    /(\w+)=("|')([^"']+)("|')/gim,
    (match, attribute, openQuote, value, closeQuote) =>
      /* if the value contains a space, quotes are needed */
      `${attribute}=${value.includes(" ") ? '"' : ""}${value}${
        value.includes(" ") ? '"' : ""
      }`
  );

  /* Remove ; before } */
  s = s.replace(/;(})/g, "$1");

  /* Remove the last )} */
  s = s.replace(/\)?}$/g, "");
  console.debug({ s });

  try {
    navigator.clipboard
      .writeText(s)
      .then(() => console.debug("Minified code is copied to clipboard."));
  } catch (error) {
    console.error(error);
  }
  return s;
};

const refreshMinifiedCode = () => {
  console.log("refreshing minified code");
  minifiedCodeInput.value = minify(
    sourceCodeInput.value,
    removeClosingTagsInput.checked
  );
};

window.onload = () => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const source = searchParams.get("s");
  const splittedUrl = window.location.href.split("s=");
  const source = decodeURIComponent(splittedUrl[splittedUrl.length - 1]);
  sourceCodeInput.value = source;
  refreshMinifiedCode();
};

[sourceCodeInput, removeClosingTagsInput].forEach((element) =>
  element.addEventListener("input", refreshMinifiedCode)
);

copyButton.addEventListener("click", () => {
  try {
    navigator.clipboard
      .writeText(minifiedCodeInput.value)
      .then(() => console.debug("Minified code is copied to clipboard."));
  } catch (error) {
    alert(error);
  }
});
