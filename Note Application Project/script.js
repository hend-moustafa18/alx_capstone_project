// Array to store notes
let notes = [];

// Function to populate the note list
function populateNoteList() {
  // Select the container for the note list
  const noteList = document.querySelector('.note-list');
    // Clear any existing content in the note list container
  noteList.innerHTML = '';

    // Check if there are no notes available
  if (notes.length === 0) {
        // Create a message indicating no notes available
    const noNotesMessage = document.createElement('div');
    noNotesMessage.textContent = 'No notes available';
        // Append the message to the note list container
    noteList.appendChild(noNotesMessage);
  } else {
        // Iterate over each note in the notes array
    notes.forEach((note, index) => {
            // Create a new element to represent the note
      const noteItem = document.createElement('div');
            // Add the class 'note' to the note element
      noteItem.classList.add('note');
      noteItem.dataset.index = index; // Store index as a data attribute

            // Set the inner HTML of the note element to display the note's title and last edited date
      noteItem.innerHTML = `
        <div>${note.title}</div>
        <div>Last edited: ${note.date}</div>
      `
      // Append the note element to the note list container
      noteList.appendChild(noteItem);
    });

    // Attach event listener to each note in the list
    noteList.querySelectorAll('.note').forEach(noteItem => {
      noteItem.addEventListener('click', () => {
        displayNote(parseInt(noteItem.dataset.index)); // Call the displayNote function when a note is clicked, passing the index of the clicked note
      });
    });
  }
  // Save notes to storage after populating the note list
  saveNotesToStorage();
}


// Function to display the selected note in the note body
function displayNote(index) {
    // Retrieve the selected note from the notes array based on its index
  const selectedNote = notes[index];
    // Select the title input element
  const titleInput = document.querySelector('.title-box input');
    // Select the body input element
  const bodyInput = document.querySelector('.note-box textarea');

    // Set the value of the title input to the title of the selected note
  titleInput.value = selectedNote.title;
    // Set the value of the body input to the content of the selected note
  bodyInput.value = selectedNote.content;
}

// Function to handle delete note button click
document.getElementById('delete-note').addEventListener('click', () => {
    // Select title and body input elements
  const titleInput = document.querySelector('.title-box input');
  const bodyInput = document.querySelector('.note-box textarea');
  // Retrieve the trimmed values of title and body inputs
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (title === '' && body === '') {
    alert('There is no note to delete.');
    return;
  }

  const confirmation = confirm(`Are you sure you want to delete the note "${title}"?`);

  if (confirmation) {
    // Find the index of the note to delete
    const noteIndex = notes.findIndex(note => note.title === title && note.content === body);

    if (noteIndex !== -1) {
      // Remove the note from the notes array
      notes.splice(noteIndex, 1);

      // Clear title and body inputs
      titleInput.value = '';
      bodyInput.value = '';

      // Repopulate the note list
      populateNoteList();
    }
  }
});

// Function to handle new note button click
document.getElementById('new-note').addEventListener('click', () => {
  const titleInput = document.querySelector('.title-box input');
  const bodyInput = document.querySelector('.note-box textarea');

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (title === '' || body === '') {
    alert('Please add title and body to save the note.');
    return;
  }

  // Check if the selected note exists
  const selectedNoteIndex = notes.findIndex(note => note.title === title);

  if (selectedNoteIndex !== -1) {
    // If selected note exists, modify it
    notes[selectedNoteIndex].title = title;
    notes[selectedNoteIndex].content = body;
  } else {
    // If selected note doesn't exist, create a new note
    const newNote = {
      title: title,
      date: new Date().toLocaleString(),
      content: body,
    };
    notes.push(newNote); // Add new note to notes array
  }

  // Update the note list
  populateNoteList();

  // Reset inputs
  titleInput.value = '';
  bodyInput.value = '';
});

// Function to handle search input
document.querySelector('.search-box input').addEventListener('input', () => {
  const searchQuery = document.querySelector('.search-box input').value.toLowerCase();
  const noteList = document.querySelector('.note-list');

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    return note.title.toLowerCase().includes(searchQuery) || note.content.toLowerCase().includes(searchQuery);
  });

  // Clear existing notes
  noteList.innerHTML = '';

  // Display filtered notes
  if (filteredNotes.length === 0) {
    const noNotesMessage = document.createElement('div');
    noNotesMessage.textContent = 'No matching notes found';
    noteList.appendChild(noNotesMessage);
  } else {
    filteredNotes.forEach((note, index) => {
      const noteItem = document.createElement('div');
      noteItem.classList.add('note');
      noteItem.dataset.index = index; // Store index as a data attribute
      noteItem.innerHTML = `<div>${note.title}</div><div>Last edited: ${note.date}</div>`;
      noteList.appendChild(noteItem);
    });
  }
});

// Function to save notes to local storage
function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
  }
  
  // Function to load notes from local storage
  function loadNotesFromStorage() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      notes = JSON.parse(storedNotes);
      populateNoteList(); // Update the note list with the loaded notes
    }
  }
  
  // function to load stored notes when the app starts

  loadNotesFromStorage();
  
  // Update the saveNotesToStorage function to be called whenever notes are modified
  function modifyNoteAndUpdateStorage() {
    // Call the saveNotesToStorage function whenever notes are modified
    saveNotesToStorage();
    // Update the note list after saving to storage
    populateNoteList();
  }
  
  // Modify existing functions to call modifyNoteAndUpdateStorage after modifying notes
  // For example, in the new note button click event handler:
  document.getElementById('new-note').addEventListener('click', () => {
    // ... existing code
    modifyNoteAndUpdateStorage();
  });

// Function to handle sort select change
document.getElementById('sort').addEventListener('change', () => {
  const sortOption = document.getElementById('sort').value;

  // Sort notes based on the selected option
  switch (sortOption) {
    case 'title':
      notes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'date':
      notes.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      // Reset sort order to default (by index)
      notes.sort((a, b) => a.index - b.index);
  }

  // Repopulate the note list with the sorted notes
  populateNoteList();
});

// Attach event listener to attach file button
document.getElementById('attach-file').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

// Function to handle file input change
document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();   // Create a new FileReader instance
      reader.onload = function(e) {
              // When the file is loaded
        const attachmentDiv = document.querySelector('.attachment');  // Select the attachment div
              // Display a button to open the file with its name
        attachmentDiv.innerHTML = `<button id="open-file">Open File: ${file.name}</button>`;
              // Attach event listener to the open file button
        attachmentDiv.querySelector('#open-file').addEventListener('click', () => {
                  // When the open file button is clicked, open a new window
          const newWindow = window.open();
                  // Display the file in an iframe within the new window
          newWindow.document.write(`<iframe src="${e.target.result}" style="width:100%;height:100%;border:none;"></iframe>`);
        });
      }
      reader.readAsDataURL(file);
    }
  });

// Initial population of note list
populateNoteList();
