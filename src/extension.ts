'use strict';

import * as vscode from 'vscode';

var _config:any;

export function activate(context: vscode.ExtensionContext) {

    _config = vscode.workspace.getConfiguration('loadpreview');
    console.log("Config params : " + JSON.stringify(_config));

    vscode.workspace.registerTextDocumentContentProvider('ConfigLoadPreview',
     new LoadPagePreviewProvider(_config));

    let disposable = vscode.commands.registerTextEditorCommand('extension.load-preview.on',
         (textEditor: vscode.TextEditor) => {
    
        const workspacePath = 
        vscode.workspace.rootPath;

        const documentPath = 
        textEditor.document.uri.fsPath;

        const rootPath =
            (workspacePath && documentPath.startsWith(workspacePath))
                ? workspacePath 
                : "";

        const relativePath = documentPath.substr(rootPath.length + 1);

        const previewUri =
            vscode.Uri.parse(`ConfigLoadPreview://authority/${relativePath}`);

    vscode.commands
            .executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two)
            .then(s => console.log('done'), vscode.window.showErrorMessage);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}


export class LoadPagePreviewProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange: vscode.EventEmitter<vscode.Uri>;

    constructor (private _config:any){this._onDidChange = new vscode.EventEmitter<vscode.Uri>()}

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }
    
    provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    
        let port = this._config.port;
        let path = this._config.path;
        
        vscode.window.showInformationMessage(`Cargando servidor en http://127.0.0.1:${port}${path}`);
        return `
        <html>
            <header>
                <style>
                    body, html, div {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        background-color: #fff;
                    }
                </style>
            </header>
            <body>
                <div>
                    <iframe src='http://127.0.0.1:${port}${path}' 
                            width="100%" 
                            height="100%" 
                            seamless 
                            frameborder=0>
                    </iframe>
                </div>
            </body>
        </html>
    `;
    }
}