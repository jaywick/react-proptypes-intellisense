//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

//import { activate } from '../src/extension';
import * as vscode from 'vscode';
import { completionItemsEquals, pathEquals } from './utils';
import * as path from 'path';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension', () => {
    const proposal = [
        new vscode.CompletionItem('boolProp', vscode.CompletionItemKind.Property),
        new vscode.CompletionItem('funcProp', vscode.CompletionItemKind.Property),
        new vscode.CompletionItem('objectProp', vscode.CompletionItemKind.Property)
    ];
    test('Find props for an imported component', () => {
        const workspace = vscode.workspace;
        const cursorPositionForComponent = new vscode.Position(13, 35);

        const workspaceFolders = workspace!.workspaceFolders;
        assert.ok(workspaceFolders!.length > 0);
        const workspaceFolder = workspaceFolders![0];
        assert.ok(
            pathEquals(workspaceFolder.uri.fsPath, path.join(__dirname, '../../testWorkspace'))
        );
        const indexJsxPath = path.join(workspaceFolder.uri.fsPath, './index.jsx');
        const indexJsxUriPath = vscode.Uri.file(indexJsxPath);

        return workspace
            .openTextDocument(indexJsxPath)
            .then(vscode.window.showTextDocument, err => {
                throw err;
            })
            .then(
                document => {
                    return vscode.commands
                        .executeCommand<vscode.CompletionList>(
                            'vscode.executeCompletionItemProvider',
                            indexJsxUriPath,
                            cursorPositionForComponent
                        );
                })
            .then(
                (result: vscode.CompletionList | undefined) => {
                    proposal.forEach(elem => {
                        const ifCompletionItemWasPresent = result!.items.find(
                            (item: vscode.CompletionItem, index: number) => {
                                return completionItemsEquals(elem, item);
                            }
                        );
                        assert.notEqual(ifCompletionItemWasPresent, undefined,
                            'Completion item ' + elem.label + ' was not present');
                    });
                }
            );
    }
    );
});
