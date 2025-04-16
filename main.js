// Substitua pelos seus dados diretamente aqui:
const API_KEY = 'SUA_API_KEY_AQUI';
const ROOT_FOLDER_ID = 'SEU_FOLDER_ID_AQUI';

let currentPath = [{ id: ROOT_FOLDER_ID, name: 'Central de Arquivos' }];
let currentFilesData = [];

async function listarItens(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)`;
  const res = await fetch(url);
  const data = await res.json();
  currentFilesData = data.files;
  renderItens(currentFilesData);
  atualizarBreadcrumbs();
  document.getElementById('backButton').style.display = currentPath.length > 1 ? 'inline-block' : 'none';
}

function renderItens(itens) {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('itemsGrid');
  grid.innerHTML = '';

  itens
    .filter(item => item.name.toLowerCase().includes(searchTerm))
    .forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btn-item';

      if (item.mimeType === 'application/vnd.google-apps.folder') {
        btn.innerHTML = `<span class="icon">📁</span>${item.name}`;
        btn.onclick = () => openItem(item.id, item.name, true);
      } else {
        btn.innerHTML = `<span class="icon">📄</span>${item.name}`;
        btn.onclick = () => {
          window.open(`https://drive.google.com/uc?export=download&id=${item.id}`, '_blank');
        };
      }
      grid.appendChild(btn);
    });
}

function atualizarBreadcrumbs() {
  const container = document.getElementById('breadcrumbs');
  container.innerHTML = '';
  currentPath.forEach((item, index) => {
    if (index > 0) container.innerHTML += '<span>/</span>';
    container.innerHTML += `<a href="#" onclick="navegarPara(${index})">${item.name}</a>`;
  });
}

function openItem(id, name, isFolder) {
  if (isFolder) {
    currentPath.push({ id, name });
    listarItens(id);
    document.getElementById('searchInput').value = '';
  }
}

function navegarPara(index) {
  currentPath = currentPath.slice(0, index + 1);
  listarItens(currentPath[index].id);
  document.getElementById('searchInput').value = '';
}

document.getElementById('searchInput').addEventListener('input', function () {
  renderItens(currentFilesData);
});

listarItens(ROOT_FOLDER_ID);
