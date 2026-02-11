# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## 배포 (GitHub Pages)

1. 이 저장소를 GitHub에 푸시한 뒤, **Settings → Pages**에서 Source를 **GitHub Actions**로 선택한다.
2. `main` 브랜치에 푸시하면 자동으로 빌드 후 Pages에 배포된다.
3. 배포 URL: `https://<사용자명>.github.io/ccc-app/`  
   (저장소 이름이 `ccc-app`이 아닐 경우 `.github/workflows/deploy.yml`의 `BASE_PATH`를 `/<저장소이름>/`으로 수정한다.)
4. 루트 도메인이나 다른 경로에 두려면 호스팅 서비스(Vercel, Netlify 등)를 쓰고, `vite.config.js`의 `base`를 `'/'`로 두면 된다.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
