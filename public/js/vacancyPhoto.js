let serverSignature;
let serverTimeStamp;
let coudinaryReturnResponse;
let isFormSubmit = false;

async function getSignature() {
  try {
    const signaturePromise = await fetch("/.netlify/functions/getSignature?context=admin");
    const theResponse = await signaturePromise.json();
    serverSignature = theResponse.signature;
    serverTimeStamp = theResponse.timestamp;
    console.log("📥 Signature:", serverSignature);

  } catch (err) {
    console.error("VacancyPhoto: Failed to fetch signature", err);
  }
}

getSignature();

document.querySelector("#add-vacancy-photo").addEventListener("change", async function () {
  const data = new FormData();
  data.append("file", document.querySelector("#add-vacancy-photo").files[0]);
  data.append("api_key", "921339666624515");
  data.append("signature", serverSignature);
  data.append("timestamp", serverTimeStamp);

  try {
    //disabling form submission while uploading
    isFormSubmit = false;
    document.querySelector("#submit-btn").style.opacity = "0.1";

    //seding data to cloudinary, inbuild function in coudinary : axios.js
    const cloudinaryResponse = await axios.post("https://api.cloudinary.com/v1_1/dnf2dypvu/auto/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
      // this is to check the progress of file upload..
      onUploadProgress: function (e) {
        //console.log(e.loaded / e.total)
        console.log("VacancyPhoto: upload status", e.loaded / e.total);
      }
    });
    coudinaryReturnResponse = cloudinaryResponse.data;

    //enabling the form submission button
    isFormSubmit = true;
    document.querySelector("#submit-btn").style.opacity = "1";

    console.log("VacancyPhoto: Cloudinary upload successful", cloudinaryResponse.data);

    //assign photo src into the html file
    document.querySelector("#photo-preview").innerHTML = `<img src="https://res.cloudinary.com/dnf2dypvu/image/upload/w_190,h_190,c_fill/${cloudinaryResponse.data.public_id}.jpg">`;
  } catch (err) {
    console.error("VacancyPhoto: Cloudinary upload failed", err);
  }
});