import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from 'react';
import './style/generalStyle.css';

import ConnectionPage from "./pages/ConnectionPage";
import AddGame from "./pages/AddGame";
import AddArticle from "./pages/AddArticle";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route index element={<ConnectionPage />} />
          <Route path="addGame" element={<AddGame />} />
          <Route path="addArticle" element={<AddArticle />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
