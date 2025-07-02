// app/home.js
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CATALOGOS_ID = process.env.NEXT_PUBLIC_ROOT_FOLDER_ID;
const MANAIS_ID   = process.env.NEXT_PUBLIC_MANAIS_FOLDER_ID;

export default function Home({ isManuais = false }) {
  const pathname = usePathname();
  // se preferir, pode ignorar a prop e usar só pathname:
  // const isManuais = pathname.startsWith('/manuais');
  const rootId = isManuais ? MANAIS_ID : CATALOGOS_ID;

  const [currentPath, setCurrentPath] = useState([{ id: rootId, name: isManuais ? 'Manuais' : 'Catálogos' }]);
  const [files, setFiles]       = useState([]);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    listarItens(currentPath.at(-1).id);
  }, []);

  async function listarItens(folderId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)`;
    const res = await fetch(url);
    const data = await res.json();
    setFiles(data.files || []);
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
        <h1>{isManuais ? 'Manuais' : 'Catálogos'}</h1>

        <nav className="breadcrumbs" id="breadcrumbs">
          {currentPath.map((item, idx) => (
            <span key={item.id}>
              {idx > 0 && <span> / </span>}
              <a href="#" onClick={() => navegarPara(idx)}>{item.name}</a>
            </span>
          ))}
        </nav>

        {currentPath.length > 1 && (
          <button onClick={() => navegarPara(currentPath.length - 2)}>
            ⬅️ Voltar
          </button>
        )}

        <input
          type="text"
          placeholder="Filtrar arquivos por nome"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="grid" id="itemsGrid">
          {files
            .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
            .map(f => {
              const isFolder = f.mimeType === 'application/vnd.google-apps.folder';
              return (
                <button
                  key={f.id}
                  className="btn-item"
                  onClick={() => openItem(f.id, f.name, isFolder)}
                >
                  <span className="icon">{isFolder ? '📁' : '📄'}</span>
                  {f.name}
                </button>
              );
            })}
        </div>
      </main>
    </>
  );
}
