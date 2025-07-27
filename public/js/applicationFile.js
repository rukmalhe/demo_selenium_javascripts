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
async function filesUploadToCloudinary(fileInputID, fileLabel, submitButtonID) {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const fileInput = document.querySelector(`#${fileInputID}`);
  const warningElement = document.querySelector(`#${fileInputID}-warning`);
  const submissionButton = document.querySelector(`#${submitButtonID}`);

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
    submissionButton.style.opacity = "0.5";

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
    submissionButton.style.opacity = "1";
  }
}

// handling CV upload
document.getElementById("cv-upload-id").addEventListener("change", async () => {
  cvUploadResponse = await filesUploadToCloudinary("cv-upload-id", "CV", "form-submit-button-vacancy-id");
  console.log("CV uploaded");
});

// handling candidate registration
/*
document.getElementById("reg-cv-upload").addEventListener("change", async () => {
  cvUploadResponse = await filesUploadToCloudinary("reg-cv-upload", "CV", "form-submit-button-registration");
  console.log("CV registration completed")
});
*/

//handling other files
document.getElementById("additional-files-vacancy-id").addEventListener("change", async () => {
  console.log("Cover letter upload started");
  coverLetterResponse = await filesUploadToCloudinary("additional-files-vacancy-id", "Cover Letter", "form-submit-button-vacancy-id");
  console.log("Cover letter uploaded")
});
