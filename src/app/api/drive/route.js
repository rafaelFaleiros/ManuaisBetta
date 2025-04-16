export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') || 'RAIZ';
  
    const API_KEY = process.env.GOOGLE_API_KEY;
    const ROOT_FOLDER_ID = process.env.ROOT_FOLDER_ID;    
    const idToUse = folderId === 'RAIZ' ? ROOT_FOLDER_ID : folderId;
  
    const url = `https://www.googleapis.com/drive/v3/files?q='${idToUse}'+in+parents&key=${API_KEY}&fields=files(id,name,mimeType)`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Erro ao buscar dados' }), { status: 500 });
    }
  }
  