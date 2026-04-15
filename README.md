# Brasa Viamão

Site institucional da Igreja Brasa Viamão, migrado para Angular (standalone app).

## Visão geral

- Landing page com hero em vídeo
- Seções de igreja, ação social, cultos, ministérios e contato
- Galeria interativa com cards e animações de entrada
- Rolagem suave entre âncoras
- Build de produção com Angular CLI

## Estrutura do projeto

```text
.
|-- src/
|   |-- app/
|   |   |-- app.component.html
|   |   `-- app.component.ts
|   |-- index.html
|   |-- main.ts
|   `-- styles.css
|-- assets/
|   |-- fotos/
|   `-- videos/
|-- angular.json
|-- package.json
|-- tsconfig.app.json
|-- tsconfig.json
`-- vercel.json
```

## Como executar localmente

```powershell
npm install
npm start
```

A aplicação sobe em `http://localhost:4200`.

## Build de produção

```powershell
npm run build
```

Saída em `dist/brasa-viamao/browser`.

## Deploy

### Vercel

O arquivo `vercel.json` mantém fallback para SPA.

Passos:

1. Conectar o repositório no painel da Vercel.
2. Framework preset: `Angular` (ou `Other` manual).
3. Build command: `npm run build`.
4. Output directory: `dist/brasa-viamao/browser`.
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
