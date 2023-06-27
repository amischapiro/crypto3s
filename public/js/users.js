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