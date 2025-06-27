let serverSignature;
let serverTimeStamp;
let cvUploadResponse;
let coverLetterResponse;
let isFormSubmit = false;

async function getSignature() {
  try {
    const signaturePromise = await fetch("/.netlify/functions/getSignature?context=cv");
    const theResponse = await signaturePromise.json();
    serverSignature = theResponse.signature;
    serverTimeStamp = theResponse.timestamp;
    console.log("📥 Signature:", serverSignature);

  } catch (err) {
    console.error("VacancyPhoto: Failed to fetch signature", err);
  }
}

getSignature();

//generic function to upload files
async function filesUploadToCloudinary(fileInputID, fileLabel) {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const fileInput = document.querySelector(`#${fileInputID}`);
  const warningElement = document.querySelector(`#${fileInputID}_warning`);

  console.log(warningElement);

  if (!fileInput || !fileInput.files.length) return null;

  const file = fileInput.files[0];
  if (file.type !== "application/pdf" || file.size > MAX_FILE_SIZE) {

    if (warningElement) {
      warningElement.textContent = `${fileLabel} must be a PDF file, less than 2 MB`;
      warningElement.style.display = "block";
    }
    fileInput.value = ""; // reset input
    return null;
  } else if (warningElement) {
    warningElement.style.display = "none";
    warningElement.textContent = "";
  }

  const data = new FormData();
  data.append("file", file);
  data.append("api_key", "921339666624515");
  data.append("signature", serverSignature);
  data.append("timestamp", serverTimeStamp);
  data.append("folder", "cv_uploads"); // cvs should be uploaded to ths folder, else, unauthorizied

  try {
    isFormSubmit = false;
    document.querySelector("#app-form-submit-button").style.opacity = "0.5";

    const res = await axios.post("https://api.cloudinary.com/v1_1/dnf2dypvu/auto/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: e => console.log(`${fileLabel} Upload Progress:`, (e.loaded / e.total).toFixed(2))
    });

    console.log(`${fileLabel} Upload Success:`, res.data);
    return res.data;

  } catch (err) {
    console.error(`${fileLabel} Upload Failed`, err);
    return null;

  } finally {

    isFormSubmit = true;
    document.querySelector("#app-form-submit-button").style.opacity = "1";
  }
}

// handling CV upload
document.querySelector("#cv_upload").addEventListener("change", async () => {
  cvUploadResponse = await filesUploadToCloudinary("cv_upload", "CV");
});

//handling other files
document.querySelector("#additional_files").addEventListener("change", async () => {
  coverLetterResponse = await filesUploadToCloudinary("additional_files", "Cover Letter");
});