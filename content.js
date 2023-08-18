chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "displayOCR") {
    const words = request.words;

    // Remove existing overlays if a  ny
    const existingOverlays = document.querySelectorAll(".word-overlay");
    existingOverlays.forEach((overlay) => overlay.remove());

    // Inject the OCR words into separate containers
    for (const word of words) {
      const overlay = document.createElement("div");
      overlay.className = "word-overlay";
      overlay.textContent = word.WordText;
      overlay.style.top = `${word.Top - word.Top * (20 / 100) - 1}px`;
      overlay.style.left = `${word.Left - word.Left * (20 / 100)}px`;
      overlay.style.height = `${word.Height}px`; // Set the height of the div
      overlay.style.width = `${word.Width}px`; // Set the width of the div
      overlay.style.position = "absolute";
      overlay.style.color = "red";
      overlay.style.backgroundColor = "white";
      // overlay.style.height = "auto";
      // overlay.style.width = "auto";
      document.body.appendChild(overlay);
    }
  }
});
// Top * (10 / 100)
