'use strict';
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dim', {
  lerConfig: () => ipcRenderer.invoke('config:ler'),
  salvarUltimo: (formulario) => ipcRenderer.invoke('config:salvarUltimo', formulario),
  escolherPasta: () => ipcRenderer.invoke('pasta:escolher'),
  abrirPasta: () => ipcRenderer.invoke('pasta:abrir'),
  gerarPdf: (dados) => ipcRenderer.invoke('pdf:gerar', dados),
  abrirPdf: (caminho) => ipcRenderer.invoke('pdf:abrir', caminho),
});
