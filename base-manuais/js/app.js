const manuais = [
    {
      nome: "Turbina A",
      arquivos: [
        { nome: "Manual do Usuário", caminho: "manuais/turbina-a/manual.pdf" },
        { nome: "Esquema Elétrico", caminho: "manuais/turbina-a/esquema.pdf" },
      ],
    },
    {
      nome: "Turbina B",
      arquivos: [
        { nome: "Manual do Usuário", caminho: "manuais/turbina-b/manual.pdf" },
      ],
    },
  ];
  
  const container = document.getElementById("lista-manuais");
  
  manuais.forEach((produto) => {
    const div = document.createElement("div");
    div.className = "produto";
  
    const titulo = document.createElement("h2");
    titulo.textContent = produto.nome;
    div.appendChild(titulo);
  
    const lista = document.createElement("ul");
    produto.arquivos.forEach((arquivo) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = arquivo.caminho;
      link.textContent = arquivo.nome;
      link.target = "_blank";
      item.appendChild(link);
      lista.appendChild(item);
    });
  
    div.appendChild(lista);
    container.appendChild(div);
  });
  