import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as http from 'http';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  http: typeof http;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      // If you wan to use remote object, pleanse set enableRemoteModule to true in main.ts
      // this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.http = window.require('http');
    }
  }
  send(value: number): void {
    const command = JSON.stringify({numberOfLights:1,lights:[{on:value}]});
    const options = {
      hostname: '10.0.0.184',
      port: 9123,
      path: '/elgato/lights',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': command.length,
      }
    }
    const req = this.http.request(options, res => {
      res.on('data',console.log);
    })
    req.on('error', console.error);
    req.write(command);
    req.end();
  }
}
