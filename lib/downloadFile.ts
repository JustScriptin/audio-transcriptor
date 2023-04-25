/**
 * Downloads a file with the given file name and content.
 * @function
 * @param {string} fileName - The name of the file to be downloaded.
 * @param {string} content - The content of the file to be downloaded.
 * @returns {void}
 * @example
 * downloadFile('file.txt', 'Hello world!');
 * // Downloads a file named 'file.txt' with the content 'Hello world!'
 */
const downloadFile = (fileName: string, content: string) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(
    new Blob([content], { type: "text/plain" })
  );
  downloadLink.download = fileName;
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
};

export default downloadFile;