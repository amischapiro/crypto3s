function deleteUser(id) {
    fetch(`/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          console.log('User deleted successfully');
          window.location.href = '/users';
        } else {
          throw new Error('Error deleting User');
        }
      })
      .catch(error => {
        console.error('Error deleting User:', error);
      });
  }

  function searchUsers() {
    const searchInput = document.getElementById('search-inputuser');
    const searchQuery = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll('#user-table tbody tr');
  
    tableRows.forEach(row => {
      const username = row.querySelector('td:first-child');
  
      if (username && username.innerText.toLowerCase().includes(searchQuery)) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });
  }
  
  