'use client';

import { useEffect, useState } from 'react';

const CATALOGOS_ID = process.env.NEXT_PUBLIC_CATALOGOS_FOLDER_ID;
const MANAIS_ID    = process.env.NEXT_PUBLIC_MANAIS_FOLDER_ID;

export default function Home({ isManuais = false }) {
  const rootId = isManuais ? MANAIS_ID : CATALOGOS_ID;
  const title  = isManuais ? 'Manuais' : 'Catálogos';

  const [currentPath, setCurrentPath] = useState([{ id: rootId, name: title }]);
  const [files, setFiles]             = useState([]);
  const [search, setSearch]           = useState('');

  useEffect(() => {
    listarItens(title.toLowerCase());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function listarItens(category) {
    const url = `/api/drive?category=${category}`;
    const res = await fetch(url);
    const json = await res.json();
    setFiles(json.files || []);
  }

  function openItem(id, name, isFolder) {
    if (isFolder) {
      setCurrentPath(path => [...path, { id, name }]);
      listarItens(name.toLowerCase());
      setSearch('');
    } else {
      window.open(`https://drive.google.com/uc?export=download&id=${id}`, '_blank');
    }
  }

  function navegarPara(idx) {
    const newPath = currentPath.slice(0, idx + 1);
    setCurrentPath(newPath);
    // volta sempre à raiz (não reﬁna navegação em subpastas)
    listarItens(title.toLowerCase());
    setSearch('');
  }

  return (
    <>
      <header className="p-4 bg-gray-100">
        <img src="/logo.png" alt="Logo da Empresa" className="h-10" />
      </header>

      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>

        <nav className="mb-4 text-sm text-blue-600">
          {currentPath.map((item, idx) => (
            <span key={item.id}>
              {idx > 0 && ' / '}
              <button onClick={() => navegarPara(idx)}>
                {item.name}
              </button>
            </span>
          ))}
        </nav>

        <input
          type="text"
          placeholder="Filtrar arquivos por nome"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files
            .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
            .map(f => {
              const isFolder = f.mimeType === 'application/vnd.google-apps.folder';
              return (
                <button
                  key={f.id}
                  onClick={() => openItem(f.id, f.name, isFolder)}
                  className="flex items-center gap-2 p-4 border rounded hover:bg-gray-50"
                >
                  <span className="text-2xl">
                    {isFolder ? '📁' : '📄'}
                  </span>
                  <span>{f.name}</span>
                </button>
              );
            })}
        </div>
      </main>
    </>
  );
}
