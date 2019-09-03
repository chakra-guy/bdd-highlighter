import * as vscode from "vscode";
import * as path from "path";

type FileExtensions = Array<string>;

const bdd_regex = /Given |When |Then |And /g;

const defaultDecoration: vscode.DecorationRenderOptions = {
  backgroundColor: "#00000000",
  color: "#F15B20",
  borderRadius: "0px"
};

export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timer | undefined = undefined;
  let activeEditor = vscode.window.activeTextEditor;
  let keywordDecorationType: vscode.TextEditorDecorationType;
  let acceptedFiles: FileExtensions;

  function init() {
    const config:
      | vscode.WorkspaceConfiguration
      | undefined = vscode.workspace.getConfiguration().get("BDDHighlighter");

    const { includeFiles = [], ...decoration } = config || {};

    acceptedFiles = includeFiles;

    keywordDecorationType = vscode.window.createTextEditorDecorationType({
      ...defaultDecoration,
      ...decoration
    });
  }

  function updateDecorations() {
    if (!activeEditor || !includesFile()) return;

    let match;
    const text = activeEditor.document.getText();
    const keywords: vscode.DecorationOptions[] = [];

    while ((match = bdd_regex.exec(text))) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(
        match.index + match[0].length - 1
      );

      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage:
          "Given [initial context], When [event occurs], Then [ensure some outcomes]"
      };

      keywords.push(decoration);
    }

    activeEditor.setDecorations(keywordDecorationType, keywords);
  }

  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(updateDecorations, 250);
  }

  function includesFile() {
    if (!activeEditor) return false;
    if (acceptedFiles.length === 0) return true;

    const fileName = path.parse(activeEditor.document.fileName).base;
    const [, ...rest] = fileName.split(".");
    const extension = `.${rest.join(".")}`;

    return acceptedFiles.some(acceptedFile => acceptedFile === extension);
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
