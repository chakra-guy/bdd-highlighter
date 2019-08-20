import * as vscode from "vscode";

const regEx = /Given|When|Then|And/g;

export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timer | undefined = undefined;
  let activeEditor = vscode.window.activeTextEditor;
  let KeywordDecorationType: vscode.TextEditorDecorationType;

  function init() {
    const config: vscode.DecorationRenderOptions = {
      backgroundColor: "#00000000",
      color: "#F15B20",
      borderRadius: "0px"
    };

    const customConfig: vscode.DecorationRenderOptions =
      vscode.workspace.getConfiguration().get("BDDHighlighter") || {};

    KeywordDecorationType = vscode.window.createTextEditorDecorationType({
      ...config,
      ...customConfig
    });
  }

  function updateDecorations() {
    if (!activeEditor) return;

    let match;
    const text = activeEditor.document.getText();
    const keywords: vscode.DecorationOptions[] = [];

    while ((match = regEx.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match[0].length
      );

      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage:
          "Given [initial context], When [event occurs], Then [ensure some outcomes]"
      };

      keywords.push(decoration);
    }

    activeEditor.setDecorations(KeywordDecorationType, keywords);
  }

  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(updateDecorations, 250);
  }

  init();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      init();
      updateDecorations();
    }),

    vscode.window.onDidChangeActiveTextEditor(editor => {
      activeEditor = editor;
      updateDecorations();
    }),

    vscode.workspace.onDidChangeTextDocument(event => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    })
  );

  updateDecorations();
}
