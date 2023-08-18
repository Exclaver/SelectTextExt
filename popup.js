document.addEventListener("DOMContentLoaded", function () {
  const screenshotButton = document.getElementById("screenshotButton");
  // hey
  screenshotButton.addEventListener("click", function () {
    chrome.runtime.sendMessage(
      { action: "takeScreenshot" },
      function (response) {
        if (response && response.screenshot) {
          const screenshotImage = document.getElementById("screenshotImage");
          screenshotImage.src = response.screenshot;

          const byteString = atob(response.screenshot.split(",")[1]);
          const mimeString = response.screenshot
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          const apikey = "K87012709288957"; // Replace with your actual API key
          const url = "https://api.ocr.space/parse/image";
          const formData = new FormData();
          formData.append("apikey", apikey);
          formData.append("file", blob, "screenshot.png"); // Set the file extension to .png
          formData.append("isOverlayRequired", "true");

          fetch(url, {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((responseData) => {
              if (responseData.IsErroredOnProcessing) {
                const errorMessage = responseData.ErrorMessage;
                console.log(`OCR processing error: ${errorMessage}`);
              } else {
                const words =
                  responseData.ParsedResults[0].TextOverlay.Lines.flatMap(
                    (line) => line.Words
                  );
                // ocrResultsElement.textContent = "";
                console.log(words);

                chrome.tabs.query(
                  { active: true, currentWindow: true },
                  function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                      action: "displayOCR",
                      words: words,
                    });
                  }
                );
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    );
  });
});
