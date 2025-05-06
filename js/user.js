// This script handles the user profile form, including saving and loading data from localStorage
// and previewing the uploaded profile photo. It uses the FileReader API to read the image file and display it in an <img> element.

  // Load saved data from localStorage
  window.onload = function () {
    const userData = JSON.parse(localStorage.getItem('userProfile'));
    if (userData) {
      document.getElementById('firstName').value = userData.firstName || '';
      document.getElementById('lastName').value = userData.lastName || '';
      document.getElementById('email').value = userData.email || '';
      document.getElementById('address').value = userData.address || '';
      if (userData.profilePhoto) {
        document.getElementById('profileImg').src = userData.profilePhoto;
      }
    }
  };

  // Save data to localStorage
  function saveUserInfo() {
    const userData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      profilePhoto: document.getElementById('profileImg').src
    };
    localStorage.setItem('userProfile', JSON.stringify(userData));
    alert('User info saved!');
  }

  // Preview and store uploaded profile photo as Base64
  document.getElementById('photoInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById('profileImg').src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
