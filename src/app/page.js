'use client';

import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const ROOT_FOLDER_ID = process.env.NEXT_PUBLIC_ROOT_FOLDER_ID;

export default function Home() {
  const [currentPath, setCurrentPath] = useState([{ id: ROOT_FOLDER_ID, name: 'Central de Arquivos' }]);
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listarItens(currentPath.at(-1).id);
  }, []);

  async function listarItens(folderId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)`;
    const res = await fetch(url);
    const data = await res.json();
    setFiles(data.files);
  }

  function openItem(id, name, isFolder) {
    if (isFolder) {
      const newPath = [...currentPath, { id, name }];
      setCurrentPath(newPath);
      listarItens(id);
      setSearch('');
    } else {
      window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
    }
  }

  function navegarPara(index) {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    listarItens(newPath[index].id);
    setSearch('');
  }

  return (
    <>
      <header>
        <img src="/logo.png" alt="Logo da Empresa" />
      </header>

      <main>
        <div className="breadcrumbs" id="breadcrumbs">
          {currentPath.map((item, index) => (
            <span key={item.id}>
              {index > 0 && <span>/</span>}
              <a href="#" onClick={() => navegarPara(index)}>{item.name}</a>
            </span>
          ))}
        </div>

        {currentPath.length > 1 && (
          <div className="back-button" onClick={() => navegarPara(currentPath.length - 2)}>⬅️ Voltar</div>
        )}

        <div id="searchContainer">
          <input
            type="text"
            id="searchInput"
            placeholder="Filtrar arquivos da página por nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid" id="itemsGrid">
          {files
            .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
            .map(item => (
              <button
                key={item.id}
                className="btn-item"
                onClick={() => openItem(item.id, item.name, item.mimeType === 'application/vnd.google-apps.folder')}
              >
                <span className="icon">{item.mimeType === 'application/vnd.google-apps.folder' ? '📁' : '📄'}</span>
                {item.name}
              </button>
          ))}
        </div>
      </main>
    </>
  );
}
