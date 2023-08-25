function uploadImageToServer() {
  const fileInput = document.getElementById('profileImageInput');
  const formData = new FormData();

  formData.append('file', fileInput.files[0]);

  fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const imageUrl = data.url;
      const mainProfileImage = document.getElementById('mainProfileImage');
      mainProfileImage.src = imageUrl;
    })
    .catch((error) => console.error('Error uploading image:', error));
}
