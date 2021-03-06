'use strict';
import { languages, ExtensionContext } from 'vscode';

import PropTypesCompletionItemProvider from './PropTypesCompletionItemProvider';

export function activate(context: ExtensionContext) {
    const propTypesCompletionItemProvider = new PropTypesCompletionItemProvider();

    languages.registerCompletionItemProvider(
        ['javascript', 'javascriptreact'],
        propTypesCompletionItemProvider
    );
}

export function deactivate() {}
