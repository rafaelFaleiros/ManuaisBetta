export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // category pode ser 'catalogos' ou 'manuais'
  const category = searchParams.get('category') || 'catalogos';

  const FOLDERS = {
    catalogos: process.env.NEXT_PUBLIC_CATALOGOS_FOLDER_ID,
    manuais:  process.env.NEXT_PUBLIC_MANAIS_FOLDER_ID,
  };
  const folderId = FOLDERS[category];
  if (!folderId) {
    return new Response(
      JSON.stringify({ error: 'Categoria inválida' }),
      { status: 400 }
    );
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  const url = `https://www.googleapis.com/drive/v3/files` +
    `?q='${folderId}'+in+parents` +
    `&key=${API_KEY}` +
    `&fields=files(id,name,mimeType,webViewLink)`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return new Response(JSON.stringify({ files: data.files }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Erro ao buscar dados' }),
      { status: 500 }
    );
  }
}
