// Le script principal qui fait tourner la boutique
document.addEventListener('DOMContentLoaded', function() {
    const tagInput = document.getElementById('tagInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const suggestionsBox = document.getElementById('suggestions');
    const copyPromptBtn = document.getElementById('copyPrompt');
    const savePromptBtn = document.getElementById('savePrompt');
    const promptNameInput = document.getElementById('promptName');
    const savedPromptsList = document.getElementById('savedPromptsList');
  
    let availableTags = [];
  
    // On va chercher tous les tags dispo sur le serveur
    fetch('/tags')
      .then(response => response.json())
      .then(data => {
        availableTags = data;
      })
      .catch(err => console.error(err));
  
    // Check si y'a des doublons et les highlight
    function updateDuplicates() {
      const tagElements = tagsContainer.querySelectorAll('.tag');
      const tagCount = {};
      tagElements.forEach(elem => {
        const tag = elem.getAttribute('data-tag');
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
      tagElements.forEach(elem => {
        const tag = elem.getAttribute('data-tag');
        if (tagCount[tag] > 1) {
          elem.classList.add('duplicate');
        } else {
          elem.classList.remove('duplicate');
        }
      });
    }
  
    // Fabrique un petit tag tout mignon
    function createTagElement(tagText) {
      const tagElem = document.createElement('div');
      tagElem.className = 'tag';
      tagElem.setAttribute('draggable', 'true');
      tagElem.setAttribute('data-tag', tagText);
  
      const span = document.createElement('span');
      span.textContent = tagText;
      tagElem.appendChild(span);
  
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-tag';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        tagsContainer.removeChild(tagElem);
        updateDuplicates();
      });
      tagElem.appendChild(removeBtn);
  
      // Setup du drag & drop pour bouger les tags
      tagElem.addEventListener('dragstart', (e) => {
        tagElem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tagText);
      });
      tagElem.addEventListener('dragend', () => {
        tagElem.classList.remove('dragging');
      });
      return tagElem;
    }
  
    // Balance le tag dans le container
    function addTag(tagText) {
      tagText = tagText.trim();
      if (tagText === '') return;
      const tagElem = createTagElement(tagText);
      tagsContainer.appendChild(tagElem);
      updateDuplicates();
    }
  
    // Quand on tape Enter ou une virgule, ça ajoute le tag
    tagInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        let inputValue = tagInput.value;
        let parts = inputValue.split(',');
        parts.forEach(part => {
          addTag(part);
        });
        tagInput.value = '';
        suggestionsBox.style.display = 'none';
      }
    });
  
    // Affiche les suggestions pendant qu'on tape
    tagInput.addEventListener('input', () => {
        const query = tagInput.value.toLowerCase();
        suggestionsBox.innerHTML = '';
        if (query === '') {
        suggestionsBox.style.display = 'none';
        return;
        }
        // Compare en remplaçant les underscores par des espaces
        let suggestions = availableTags.filter(item => {
        const tagWithSpaces = item.tag.toLowerCase().replace(/_/g, ' ');
        return tagWithSpaces.includes(query);
        });
        // Les tags qui matchent direct passent en premier
        suggestions.sort((a, b) => {
        const aStarts = a.tag.toLowerCase().replace(/_/g, ' ').startsWith(query);
        const bStarts = b.tag.toLowerCase().replace(/_/g, ' ').startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (bStarts && !aStarts) return 1;
        return a.tag.localeCompare(b.tag);
        });
        suggestions = suggestions.slice(0, 10); // On garde que les 10 premiers
        suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = `${suggestion.tag} (${suggestion.id})`;
        item.addEventListener('click', () => {
            addTag(suggestion.tag);
            tagInput.value = '';
            suggestionsBox.style.display = 'none';
        });
        suggestionsBox.appendChild(item);
        });
        suggestionsBox.style.display = suggestions.length > 0 ? 'block' : 'none';
    });
    
  
    // La magie du drag & drop pour réorganiser les tags
    tagsContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      const afterElement = getDragAfterElement(tagsContainer, e.clientX);
      if (afterElement == null) {
        tagsContainer.appendChild(dragging);
      } else {
        tagsContainer.insertBefore(dragging, afterElement);
      }
    });
  
    function getDragAfterElement(container, x) {
      const draggableElements = [...container.querySelectorAll('.tag:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  
    // Bouton "Copy Prompt" : copie le prompt dans le presse-papiers en remplaçant les underscores par des espaces
    copyPromptBtn.addEventListener('click', () => {
      const tagElements = tagsContainer.querySelectorAll('.tag');
      const tags = Array.from(tagElements).map(elem => elem.getAttribute('data-tag'));
      const promptText = tags.map(tag => tag.replace(/_/g, ' ')).join(', ');
      navigator.clipboard.writeText(promptText)
        .catch(err => alert('Error copying to clipboard.'));
    });
  
    // Save le prompt dans le storage local
    savePromptBtn.addEventListener('click', () => {
      const name = promptNameInput.value.trim();
      if (name === '') {
        alert('Please enter a name for the prompt.');
        return;
      }
      const tagElements = tagsContainer.querySelectorAll('.tag');
      const tags = Array.from(tagElements).map(elem => elem.getAttribute('data-tag'));
      const promptObj = { name, tags };
      let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts')) || [];
      const existingIndex = savedPrompts.findIndex(p => p.name === name);
      if (existingIndex > -1) {
        if (!confirm('A prompt with this name already exists. Do you want to replace it?')) return;
        savedPrompts[existingIndex] = promptObj;
      } else {
        savedPrompts.push(promptObj);
      }
      localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
      promptNameInput.value = '';
      loadSavedPrompts();
    });

// Export les prompts en JSON pour les backup
const exportPromptsBtn = document.getElementById('exportPrompts');
exportPromptsBtn.addEventListener('click', () => {
  let savedPrompts = localStorage.getItem('savedPrompts');
  if (!savedPrompts) {
    alert("No saved prompts to export.");
    return;
  }
  // Crée un fichier JSON à dl
  const blob = new Blob([savedPrompts], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  // Petit trick pour forcer le download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved_prompts.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

    // Import des prompts depuis un backup JSON
    const importPromptsBtn = document.getElementById('importPrompts');
    const importFileInput = document.getElementById('importFile');

    importPromptsBtn.addEventListener('click', () => {
    // Click caché sur l'input file
    importFileInput.click();
    });

    importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
        const importedPrompts = JSON.parse(e.target.result);
        if (!Array.isArray(importedPrompts)) {
            alert("The imported file is not in the expected format.");
            return;
        }
        // Enregistre les prompts importés dans le localStorage
        localStorage.setItem('savedPrompts', JSON.stringify(importedPrompts));
        loadSavedPrompts();
        alert("Prompts imported successfully!");
        } catch (err) {
        alert("Error importing JSON file.");
        }
    };
    reader.readAsText(file);
    });

    // Affiche la liste des prompts sauvegardés
    function loadSavedPrompts() {
      savedPromptsList.innerHTML = '';
      let savedPrompts = JSON.parse(localStorage.getItem('savedPrompts')) || [];
      savedPrompts.forEach((promptObj, index) => {
        const li = document.createElement('li');
        li.textContent = promptObj.name;
        
        const loadBtn = document.createElement('button');
        loadBtn.textContent = 'Load';
        loadBtn.addEventListener('click', () => {
          tagsContainer.innerHTML = '';
          promptObj.tags.forEach(tag => {
            addTag(tag);
          });
        });
        li.appendChild(loadBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete';
        deleteBtn.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete this prompt?')) {
            savedPrompts.splice(index, 1);
            localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
            loadSavedPrompts();
          }
        });
        li.appendChild(deleteBtn);
        
        savedPromptsList.appendChild(li);
      });
    }
    loadSavedPrompts();
  });