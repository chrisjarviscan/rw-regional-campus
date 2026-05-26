# Fix: "Make the Case" deck never downloads

## Diagnosis

The edge function `generate-deck` works correctly — logs show `POST 200` after ~42s, returning both `pptx` and `html` base64 payloads. The break is on the client (`public/business-case/app.js`):

1. After a long (~40s) `await fetch`, the original click is no longer considered an active user gesture in some browsers. Chrome's "automatic downloads" blocker can suppress the file.
2. Two `downloadBase64()` calls fire ~800ms apart. Browsers commonly block the second one as "multiple downloads" — sometimes silently.
3. Errors in `atob`/`Blob` creation are not caught, so any failure leaves the UI showing "Both files downloaded" with no file.

## Fix

Rework the final step so the user always triggers downloads from a fresh click:

1. **Generate, then stage.** On `Generate & download`, call the edge function, decode both base64 payloads to `Blob`s and `URL.createObjectURL()` them. Store the two URLs + filenames in module-scope variables.
2. **Replace the success state.** Instead of auto-triggering downloads, swap the button row to show two explicit buttons:
   - `Download PowerPoint (.pptx)`
   - `Download interactive HTML`
   
   Each button does a simple `<a download>` click using the staged blob URL — guaranteed to be a user gesture, no multi-file block.
3. **Auto-trigger the PPTX once.** Right after generation, attempt a single download of the PPTX (most browsers allow one). If it succeeds, the buttons still serve as a fallback; if blocked, the user clicks.
4. **Update copy** on `step-done` and `step-7` status to reflect the new flow ("Your files are ready — click to download" instead of "Both files downloaded").
5. **Wrap base64 decode + blob creation in try/catch**, surface a clear error in `submit-status` if it fails, and `console.error` the cause.
6. **Revoke object URLs** when the user navigates away or clicks "Download again" to regenerate.

## Files changed

- `public/business-case/app.js` — rework `generateAndDownload()`, add staged-blob state, add per-file download handlers, error handling.
- `public/business-case/index.html` — add two download buttons inside `step-done` (hidden until populated); update step 7 hint copy.

## Out of scope

No changes to the edge function or to the React app. No styling overhaul of the business-case mini-app.
