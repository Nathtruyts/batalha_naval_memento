export class GameStateCaretaker {
    save(state: string, fileName: string): void {
        // Valida o nome do arquivo
        if (!fileName || fileName.trim() === "") {
            console.error("Nome do arquivo não definido.");
            alert("Por favor, insira um nome de arquivo válido.");
            return;
        }

        // Adiciona a extensão .json se não estiver presente
        const sanitizedFileName = fileName.endsWith(".json") ? fileName : `${fileName}.json`;

        try {
            // Cria um Blob com o estado do jogo
            const blob = new Blob([state], { type: "application/json" });

            // Gera uma URL temporária para o Blob
            const url = window.URL.createObjectURL(blob);

            // Cria um elemento <a> temporário para o download
            const link = document.createElement("a");
            link.href = url;
            link.download = sanitizedFileName;

            // Adiciona o link ao DOM, dispara o clique e remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoga a URL do Blob
            window.URL.revokeObjectURL(url);

            console.log(`Arquivo "${sanitizedFileName}" foi baixado com sucesso.`);
        } catch (error) {
            console.error("Erro ao salvar o arquivo:", error);
            alert("Erro ao salvar o arquivo. Por favor, tente novamente.");
        }
    }

    async load(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    resolve(event.target.result.toString());
                } else {
                    reject("Erro ao ler o arquivo.");
                }
            };
            reader.onerror = () => reject("Erro ao carregar o arquivo.");
            reader.readAsText(file);
        });
    }
}
