# Brasa Viamão

Site institucional da Igreja Brasa Viamão, desenvolvido como página estática (`HTML`, `CSS` e JavaScript embutido).

## Visão geral

- Landing page com hero em vídeo
- Seções de igreja, ação social, cultos, ministérios e contato
- Galeria interativa com cards e animações de entrada
- Rolagem suave entre âncoras
- Configuração para deploy estático na Vercel

## Estrutura do projeto

```text
.
|-- assets/
|   |-- fotos/
|   `-- videos/
|-- index.html
|-- styles.css
`-- vercel.json
```

## Como executar localmente

Como o projeto é estático, basta abrir o `index.html` no navegador.

Se preferir servir com um servidor local:

```powershell
# opção 1 (Python)
python -m http.server 5500

# opção 2 (Node)
npx serve .
```

Depois acesse `http://localhost:5500` (ou a porta informada no terminal).

## Deploy

### Vercel

O arquivo `vercel.json` já está configurado para servir `index.html` como fallback de rota.

Passos:

1. Conectar o repositório no painel da Vercel.
2. Framework preset: `Other`.
3. Build command: vazio.
4. Output directory: raiz do projeto.
5. Deploy.

### GitHub

Fluxo básico:

```powershell
git add .
git commit -m "chore: update website"
git push origin main
```

## Observações

- Existem arquivos de vídeo grandes em `assets/videos`.
- O GitHub aceita até 100 MB por arquivo, mas recomenda usar Git LFS para arquivos acima de 50 MB.
