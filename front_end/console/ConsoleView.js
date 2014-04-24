/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @extends {WebInspector.VBox}
 * @implements {WebInspector.Searchable}
 * @constructor
 * @implements {WebInspector.TargetManager.Observer}
 * @param {boolean} hideContextSelector
 */
WebInspector.ConsoleView = function(hideContextSelector)
{
    WebInspector.VBox.call(this);
    this.registerRequiredCSS("filter.css");

    this._searchableView = new WebInspector.SearchableView(this);
    this._searchableView.setMinimalSearchQuerySize(0);
    this._searchableView.show(this.element);

    this._contentsElement = this._searchableView.element;
    this._contentsElement.classList.add("console-view");
    this._visibleViewMessages = [];
    this._urlToMessageCount = {};
    this._hiddenByFilterCount = 0;

    this._clearConsoleButton = new WebInspector.StatusBarButton(WebInspector.UIString("Clear console log."), "clear-status-bar-item");
    this._clearConsoleButton.addEventListener("click", this._requestClearMessages, this);

    this._executionContextSelector = new WebInspector.StatusBarComboBox(this._executionContextChanged.bind(this), "console-context");
    this._topLevelOptionByContextListId = {};
    this._subOptionsByContextListId = {};

    this._filter = new WebInspector.ConsoleViewFilter(this);
    this._filter.addEventListener(WebInspector.ConsoleViewFilter.Events.FilterChanged, this._updateMessageList.bind(this));

    if (hideContextSelector)
        this._executionContextSelector.element.classList.add("hidden");

    this._filterBar = new WebInspector.FilterBar();

    var statusBarElement = this._contentsElement.createChild("div", "console-status-bar");
    statusBarElement.appendChild(this._clearConsoleButton.element);
    statusBarElement.appendChild(this._filterBar.filterButton().element);
    statusBarElement.appendChild(this._executionContextSelector.element);

    this._filtersContainer = this._contentsElement.createChild("div", "console-filters-header hidden");
    this._filtersContainer.appendChild(this._filterBar.filtersElement());
    this._filterBar.addEventListener(WebInspector.FilterBar.Events.FiltersToggled, this._onFiltersToggled, this);
    this._filterBar.setName("consoleView");
    this._filter.addFilters(this._filterBar);

    this._messagesElement = this._contentsElement.createChild("div", "monospace");
    this._messagesElement.id = "console-messages";
    this._messagesElement.addEventListener("click", this._messagesClicked.bind(this), true);
    this._scrolledToBottom = true;

    this._filterStatusMessageElement = this._messagesElement.createChild("div", "console-message");
    this._filterStatusTextElement = this._filterStatusMessageElement.createChild("span", "console-info");
    this._filterStatusMessageElement.createTextChild(" ");
    var resetFiltersLink = this._filterStatusMessageElement.createChild("span", "console-info node-link");
    resetFiltersLink.textContent = WebInspector.UIString("Show all messages.");
    resetFiltersLink.addEventListener("click", this._filter.reset.bind(this._filter), true);

    this._topGroup = new WebInspector.ConsoleGroup(null, null);
    this._currentGroup = this._topGroup;
    this._messagesElement.appendChild(this._topGroup.element);

    this._promptElement = this._messagesElement.createChild("div", "source-code");
    this._promptElement.id = "console-prompt";
    this._promptElement.spellcheck = false;
    this._promptElement.addEventListener("paste", this._onPasteIntoPrompt.bind(this), false);
    this._promptElement.addEventListener("drop", this._onPasteIntoPrompt.bind(this), false);
    this._messagesElement.appendChild(this._promptElement);
    this._messagesElement.appendChild(document.createElement("br"));

    this._showAllMessagesCheckbox = new WebInspector.StatusBarCheckbox(WebInspector.UIString("Show all messages"));
    this._showAllMessagesCheckbox.inputElement.checked = true;
    this._showAllMessagesCheckbox.inputElement.addEventListener("change", this._updateMessageList.bind(this), false);

    if (!WebInspector.experimentsSettings.workersInMainWindow.isEnabled())
        this._showAllMessagesCheckbox.element.classList.add("hidden");

    statusBarElement.appendChild(this._showAllMessagesCheckbox.element);

    this._registerShortcuts();
    this.registerRequiredCSS("suggestBox.css");

    this._messagesElement.addEventListener("contextmenu", this._handleContextMenuEvent.bind(this), false);

    this._linkifier = new WebInspector.Linkifier();

    /** @type {!Array.<!WebInspector.ConsoleViewMessage>} */
    this._consoleMessages = [];

    this._prompt = new WebInspector.TextPromptWithHistory(WebInspector.ExecutionContextSelector.completionsForTextPromptInCurrentContext);
    this._prompt.setSuggestBoxEnabled(true);
    this._prompt.renderAsBlock();
    this._prompt.attach(this._promptElement);
    this._prompt.proxyElement.addEventListener("keydown", this._promptKeyDown.bind(this), false);
    this._prompt.setHistoryData(WebInspector.settings.consoleHistory.get());
    var historyData = WebInspector.settings.consoleHistory.get();
    this._prompt.setHistoryData(historyData);
    if (!WebInspector.settings.allowPastingJavaScript.get() && historyData && historyData.length > 10)
        WebInspector.settings.allowPastingJavaScript.set(true);

    this._updateFilterStatus();
    WebInspector.settings.consoleTimestampsEnabled.addChangeListener(this._consoleTimestampsSettingChanged, this);

    WebInspector.targetManager.observeTargets(this);
}

WebInspector.ConsoleView.prototype = {
    /**
     * @param {!WebInspector.Target} target
     */
    targetAdded: function(target)
    {
        /**
         * @param {!WebInspector.ConsoleMessage} message
         * @this {WebInspector.ConsoleView}
         */
        function appendMessage(message)
        {
             var viewMessage = this._createViewMessage(message);
             this._consoleMessageAdded(viewMessage);
        }

        target.consoleModel.addEventListener(WebInspector.ConsoleModel.Events.MessageAdded, this._onConsoleMessageAdded, this);
        target.consoleModel.addEventListener(WebInspector.ConsoleModel.Events.ConsoleCleared, this._consoleCleared, this);
        target.consoleModel.addEventListener(WebInspector.ConsoleModel.Events.CommandEvaluated, this._commandEvaluated, this);
        target.consoleModel.messages.forEach(appendMessage, this);

        /**
         * @param {!WebInspector.ExecutionContextList} contextList
         * @this {WebInspector.ConsoleView}
         */
        function loadContextList(contextList)
        {
            this._addExecutionContextList(contextList);
            this._contextListChanged(contextList);
        }
        target.runtimeModel.contextLists().forEach(loadContextList, this);
        target.runtimeModel.addEventListener(WebInspector.RuntimeModel.Events.ExecutionContextListAdded, this._executionContextListAdded, this);
        target.runtimeModel.addEventListener(WebInspector.RuntimeModel.Events.ExecutionContextListRemoved, this._executionContextListRemoved, this);
    },

    /**
     * @param {!WebInspector.Target} target
     */
    targetRemoved: function(target)
    {
        target.consoleModel.removeEventListener(WebInspector.ConsoleModel.Events.MessageAdded, this._onConsoleMessageAdded, this);
        target.consoleModel.removeEventListener(WebInspector.ConsoleModel.Events.ConsoleCleared, this._consoleCleared, this);
        target.consoleModel.removeEventListener(WebInspector.ConsoleModel.Events.CommandEvaluated, this._commandEvaluated, this);
        target.runtimeModel.removeEventListener(WebInspector.RuntimeModel.Events.ExecutionContextListAdded, this._executionContextListAdded, this);
        target.runtimeModel.removeEventListener(WebInspector.RuntimeModel.Events.ExecutionContextListRemoved, this._executionContextListRemoved, this);
    },

    /**
     * @param {!WebInspector.Event} event
     */
    _consoleTimestampsSettingChanged: function(event)
    {
        var enabled = /** @type {boolean} */ (event.data);
        this._updateMessageList();
        this._consoleMessages.forEach(function(viewMessage) {
            viewMessage.updateTimestamp(enabled);
        });
    },

    /**
     * @return {!Element}
     */
    defaultFocusedElement: function()
    {
        return this._promptElement
    },

    _onFiltersToggled: function(event)
    {
        var toggled = /** @type {boolean} */ (event.data);
        this._filtersContainer.classList.toggle("hidden", !toggled);
    },

    /**
     * @param {!WebInspector.Event} event
     */
    _executionContextListAdded: function(event)
    {
        var contextList = /** @type {!WebInspector.ExecutionContextList} */ (event.data);
        this._addExecutionContextList(contextList);
    },

    /**
     * @param {!WebInspector.ExecutionContextList} contextList
     */
    _addExecutionContextList: function(contextList)
    {
        var maxLength = 50;
        var topLevelOption = this._executionContextSelector.createOption(contextList.displayName().trimMiddle(maxLength), contextList.url());
        topLevelOption._executionContext = null;
        this._topLevelOptionByContextListId[contextList.id()] = topLevelOption;
        this._subOptionsByContextListId[contextList.id()] = [];

        contextList.addEventListener(WebInspector.ExecutionContextList.EventTypes.Reset, this._contextListReset, this);
        contextList.addEventListener(WebInspector.ExecutionContextList.EventTypes.ContextAdded, this._contextListChanged.bind(this, contextList));
    },

    /**
     * @param {!WebInspector.Event} event
     */
    _executionContextListRemoved: function(event)
    {
        var contextList = /** @type {!WebInspector.ExecutionContextList} */ (event.data);

        this._removeSubOptions(contextList.id());
        var topLevelOption = this._topLevelOptionByContextListId[contextList.id()];
        this._executionContextSelector.removeOption(topLevelOption);
        delete this._topLevelOptionByContextListId[contextList.id()];
        delete this._subOptionsByContextListId[contextList.id()];
        this._executionContextChanged();
    },

    /**
     * @param {string} contextListId
     * @return {boolean}
     */
    _removeSubOptions: function(contextListId)
    {
        var selectedOptionRemoved = false;
        var subOptions = this._subOptionsByContextListId[contextListId];
        for (var i = 0; i < subOptions.length; ++i) {
            selectedOptionRemoved |= this._executionContextSelector.selectedOption() === subOptions[i];
            this._executionContextSelector.removeOption(subOptions[i]);
        }
        this._subOptionsByContextListId[contextListId] = [];
        return selectedOptionRemoved;
    },

    _executionContextChanged: function()
    {
        var newContext = this._currentExecutionContext();
        WebInspector.context.setFlavor(WebInspector.ExecutionContext, newContext);
        this._prompt.clearAutoComplete(true);
        if (!this._showAllMessagesCheckbox.checked())
            this._updateMessageList();
    },

    /**
     * @return {?WebInspector.ExecutionContext}
     */
    _currentExecutionContext: function()
    {
        var option = this._executionContextSelector.selectedOption();
        return option ? option._executionContext : null;
    },

    /**
     * @param {!WebInspector.Event} event
     */
    _contextListReset: function(event)
    {
        var contextList = /** @type {!WebInspector.ExecutionContextList} */ (event.data);
        var option = this._topLevelOptionByContextListId[contextList.id()];
        var maxLength = 50;
        option.text = contextList.displayName().trimMiddle(maxLength);
        option.title = contextList.url();

        var selectedRemoved = this._removeSubOptions(contextList.id());

        if (selectedRemoved) {
            this._executionContextSelector.select(option);
            this._executionContextChanged();
        }
    },

    /**
     * @param {!WebInspector.ExecutionContextList} contextList
     */
    _contextListChanged: function(contextList)
    {
        var currentExecutionContext = WebInspector.context.flavor(WebInspector.ExecutionContext);
        var shouldSelectOption = this._removeSubOptions(contextList.id());

        var topLevelOption = this._topLevelOptionByContextListId[contextList.id()];
        var nextTopLevelOption = topLevelOption.nextSibling;
        var subOptions = this._subOptionsByContextListId[contextList.id()];
        var executionContexts = contextList.executionContexts();
        for (var i = 0; i < executionContexts.length; ++i) {
            if (executionContexts[i].isMainWorldContext) {
                topLevelOption._executionContext = executionContexts[i];
                continue;
            }
            var subOption = document.createElement("option");
            subOption.text = "\u00a0\u00a0\u00a0\u00a0" + executionContexts[i].name;
            subOption._executionContext = executionContexts[i];
            this._executionContextSelector.selectElement().insertBefore(subOption, nextTopLevelOption);
            subOptions.push(subOption);

            if (shouldSelectOption && executionContexts[i] === currentExecutionContext) {
                this._executionContextSelector.select(subOption);
                shouldSelectOption = false;
            }
        }

        if (shouldSelectOption)
            this._executionContextSelector.select(topLevelOption);

        this._executionContextChanged();
    },

    willHide: function()
    {
        this._prompt.hideSuggestBox();
        this._prompt.clearAutoComplete(true);
    },

    wasShown: function()
    {
        if (!this._prompt.isCaretInsidePrompt())
            this._prompt.moveCaretToEndOfPrompt();
    },

    focus: function()
    {
        if (this._promptElement === WebInspector.currentFocusElement())
            return;
        WebInspector.setCurrentFocusElement(this._promptElement);
        this._prompt.moveCaretToEndOfPrompt();
    },

    storeScrollPositions: function()
    {
        WebInspector.View.prototype.storeScrollPositions.call(this);
        this._scrolledToBottom = this._messagesElement.isScrolledToBottom();
    },

    restoreScrollPositions: function()
    {
        if (this._scrolledToBottom)
            this._immediatelyScrollIntoView();
        else
            WebInspector.View.prototype.restoreScrollPositions.call(this);
    },

    onResize: function()
    {
        this._prompt.hideSuggestBox();
        this.restoreScrollPositions();
    },

    _isScrollIntoViewScheduled: function()
    {
        return !!this._scrollIntoViewTimer;
    },

    _scheduleScrollIntoView: function()
    {
        if (this._scrollIntoViewTimer)
            return;

        /**
         * @this {WebInspector.ConsoleView}
         */
        function scrollIntoView()
        {
            delete this._scrollIntoViewTimer;
            this._messagesElement.scrollTop = this._messagesElement.scrollHeight;
        }
        this._scrollIntoViewTimer = setTimeout(scrollIntoView.bind(this), 20);
    },

    _immediatelyScrollIntoView: function()
    {
        this._promptElement.scrollIntoView(true);
        this._cancelScheduledScrollIntoView();
    },

    _cancelScheduledScrollIntoView: function()
    {
        if (!this._isScrollIntoViewScheduled())
            return;

        clearTimeout(this._scrollIntoViewTimer);
        delete this._scrollIntoViewTimer;
    },

    _updateFilterStatus: function()
    {
        this._filterStatusTextElement.textContent = WebInspector.UIString(this._hiddenByFilterCount === 1 ? "%d message is hidden by filters." : "%d messages are hidden by filters.", this._hiddenByFilterCount);
        this._filterStatusMessageElement.style.display = this._hiddenByFilterCount ? "" : "none";
    },

    /**
     * @param {!WebInspector.ConsoleViewMessage} viewMessage
     */
    _consoleMessageAdded: function(viewMessage)
    {
        /**
         * @param {!WebInspector.ConsoleViewMessage} viewMessage1
         * @param {!WebInspector.ConsoleViewMessage} viewMessage2
         * @return {number}
         */
        function compareTimestamps(viewMessage1, viewMessage2)
        {
            return WebInspector.ConsoleMessage.timestampComparator(viewMessage1.consoleMessage(), viewMessage2.consoleMessage());
        }
        var insertAt = insertionIndexForObjectInListSortedByFunction(viewMessage, this._consoleMessages, compareTimestamps, true);
        this._consoleMessages.splice(insertAt, 0, viewMessage);

        var message = viewMessage.consoleMessage();
        if (this._urlToMessageCount[message.url])
            this._urlToMessageCount[message.url]++;
        else
            this._urlToMessageCount[message.url] = 1;

        if (this._tryToCollapseMessages(viewMessage, this._visibleViewMessages.peekLast()))
            return;

        if (this._filter.shouldBeVisible(viewMessage))
            this._showConsoleMessage(viewMessage)
        else {
            this._hiddenByFilterCount++;
            this._updateFilterStatus();
        }
    },

    /**
     * @param {!WebInspector.Event} event
     */
    _onConsoleMessageAdded: function(event)
    {
        var message = /** @type {!WebInspector.ConsoleMessage} */ (event.data);
        var viewMessage = this._createViewMessage(message);
        this._consoleMessageAdded(viewMessage);
    },

    /**
     * @param {!WebInspector.ConsoleViewMessage} viewMessage
     */
    _showConsoleMessage: function(viewMessage)
    {
        var message = viewMessage.consoleMessage();

        // this._messagesElement.isScrolledToBottom() is forcing style recalculation.
        // We just skip it if the scroll action has been scheduled.
        if (!this._isScrollIntoViewScheduled() && ((viewMessage instanceof WebInspector.ConsoleCommandResult) || this._messagesElement.isScrolledToBottom()))
            this._scheduleScrollIntoView();

        this._visibleViewMessages.push(viewMessage);

        if (message.type === WebInspector.ConsoleMessage.MessageType.EndGroup)
            this._currentGroup = this._currentGroup.parentGroup() || this._currentGroup;
        else if (WebInspector.ConsoleGroup.isGroupStartMessage(viewMessage))
            this._currentGroup = this._currentGroup.createChildGroup(viewMessage);
        else
            this._currentGroup.addMessage(viewMessage);

        if (this._searchRegex && viewMessage.matchesRegex(this._searchRegex)) {
            this._searchResults.push(viewMessage);
            this._searchableView.updateSearchMatchesCount(this._searchResults.length);
        }
    },

    /**
     * @param {!WebInspector.ConsoleMessage} message
     * @return {!WebInspector.ConsoleViewMessage}
     */
    _createViewMessage: function(message)
    {
        switch (message.type) {
        case WebInspector.ConsoleMessage.MessageType.Command:
            return new WebInspector.ConsoleCommand(message);
        case WebInspector.ConsoleMessage.MessageType.Result:
            return new WebInspector.ConsoleCommandResult(message, this._linkifier);
        default:
            return new WebInspector.ConsoleViewMessage(message, this._linkifier);
        }
    },

    _consoleCleared: function()
    {
        this._scrolledToBottom = true;
        this._clearCurrentSearchResultHighlight();
        this._updateFilterStatus();

        for (var i = 0; i < this._visibleViewMessages.length; ++i)
            this._visibleViewMessages[i].willHide();

        this._visibleViewMessages = [];
        this._searchResults = [];
        this._consoleMessages = [];

        if (this._searchRegex)
            this._searchableView.updateSearchMatchesCount(0);

        this._currentGroup = this._topGroup;
        this._topGroup._messagesElement.removeChildren();

        this._linkifier.reset();
    },

    _handleContextMenuEvent: function(event)
    {
        if (event.target.enclosingNodeOrSelfWithNodeName("a"))
            return;

        var contextMenu = new WebInspector.ContextMenu(event);

        function monitoringXHRItemAction()
        {
            WebInspector.settings.monitoringXHREnabled.set(!WebInspector.settings.monitoringXHREnabled.get());
        }
        contextMenu.appendCheckboxItem(WebInspector.UIString("Log XMLHttpRequests"), monitoringXHRItemAction, WebInspector.settings.monitoringXHREnabled.get());

        function preserveLogItemAction()
        {
            WebInspector.settings.preserveConsoleLog.set(!WebInspector.settings.preserveConsoleLog.get());
        }
        contextMenu.appendCheckboxItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles() ? "Preserve log upon navigation" : "Preserve Log upon Navigation"), preserveLogItemAction, WebInspector.settings.preserveConsoleLog.get());

        var sourceElement = event.target.enclosingNodeOrSelfWithClass("console-message");

        var filterSubMenu = contextMenu.appendSubMenuItem(WebInspector.UIString("Filter"));

        if (sourceElement && sourceElement.message.url) {
            var menuTitle = WebInspector.UIString(WebInspector.useLowerCaseMenuTitles() ? "Hide messages from %s" : "Hide Messages from %s", new WebInspector.ParsedURL(sourceElement.message.url).displayName);
            filterSubMenu.appendItem(menuTitle, this._filter.addMessageURLFilter.bind(this._filter, sourceElement.message.url));
        }

        filterSubMenu.appendSeparator();
        var unhideAll = filterSubMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles() ? "Unhide all" : "Unhide All"), this._filter.removeMessageURLFilter.bind(this._filter));
        filterSubMenu.appendSeparator();

        var hasFilters = false;

        for (var url in this._filter.messageURLFilters) {
            filterSubMenu.appendCheckboxItem(String.sprintf("%s (%d)", new WebInspector.ParsedURL(url).displayName, this._urlToMessageCount[url]), this._filter.removeMessageURLFilter.bind(this._filter, url), true);
            hasFilters = true;
        }

        filterSubMenu.setEnabled(hasFilters || (sourceElement && sourceElement.message.url));
        unhideAll.setEnabled(hasFilters);

        contextMenu.appendSeparator();
        contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles() ? "Clear console" : "Clear Console"), this._requestClearMessages.bind(this));

        var request = (sourceElement && sourceElement.message) ? sourceElement.message.request : null;
        if (request && request.type === WebInspector.resourceTypes.XHR) {
            contextMenu.appendSeparator();
            contextMenu.appendItem(WebInspector.UIString("Replay XHR"), NetworkAgent.replayXHR.bind(null, request.requestId));
        }

        contextMenu.show();
    },

    /**
     * @param {!WebInspector.ConsoleViewMessage} lastMessage
     * @param {?WebInspector.ConsoleViewMessage} viewMessage
     * @return {boolean}
     */
    _tryToCollapseMessages: function(lastMessage, viewMessage)
    {
        if (!WebInspector.settings.consoleTimestampsEnabled.get() && viewMessage && !lastMessage.consoleMessage().isGroupMessage() && lastMessage.consoleMessage().isEqual(viewMessage.consoleMessage())) {
            viewMessage.incrementRepeatCount();
            return true;
        }

        return false;
    },

    _updateMessageList: function()
    {
        var currentGroup = this._topGroup;
        var newVisibleMessages = [];
        /**
         * @param {!WebInspector.ConsoleViewMessage} consoleMessage
         * @param {?WebInspector.ConsoleViewMessage} beforeVisibleMessage
         * @this {WebInspector.ConsoleView}
         */
        function insertConsoleMessage(consoleMessage, beforeVisibleMessage)
        {
            if (!this._filter.shouldBeVisible(consoleMessage)) {
                this._hiddenByFilterCount++;
                return;
            }
            if (this._tryToCollapseMessages(consoleMessage, newVisibleMessages.peekLast()))
                return;
            currentGroup.addMessage(consoleMessage, beforeVisibleMessage);
            newVisibleMessages.push(consoleMessage);
            consoleMessage.resetIncrementRepeatCount();
        }

        this._hiddenByFilterCount = 0;
        var consoleMessageIndex = 0;
        for (var i = 0; i < this._visibleViewMessages.length; ++i) {
            var visibleMessage = this._visibleViewMessages[i];
            for (; visibleMessage !== this._consoleMessages[consoleMessageIndex]; ++consoleMessageIndex)
                insertConsoleMessage.call(this, this._consoleMessages[consoleMessageIndex], visibleMessage)

            ++consoleMessageIndex;
            if (!this._filter.shouldBeVisible(visibleMessage)) {
                currentGroup.removeMessage(visibleMessage);
                this._hiddenByFilterCount++;
                continue;
            }
            if (this._tryToCollapseMessages(visibleMessage, newVisibleMessages.peekLast())) {
                currentGroup.removeMessage(visibleMessage);
                continue;
            }

            newVisibleMessages.push(visibleMessage);
            visibleMessage.resetIncrementRepeatCount();
            if (visibleMessage.consoleMessage().type === WebInspector.ConsoleMessage.MessageType.EndGroup)
                currentGroup = currentGroup.parentGroup() || currentGroup;
            else if (WebInspector.ConsoleGroup.isGroupStartMessage(visibleMessage))
                currentGroup = visibleMessage._group;
        }
        for (; consoleMessageIndex < this._consoleMessages.length; ++consoleMessageIndex)
            insertConsoleMessage.call(this, this._consoleMessages[consoleMessageIndex], null);

        if (this._searchRegex) {
            this._searchResults = [];
            for (var i = 0; i < newVisibleMessages.length; ++i) {
                var viewMessage = newVisibleMessages[i];
                if (viewMessage.matchesRegex(this._searchRegex))
                    this._searchResults.push(viewMessage);
            }
            this._searchableView.updateSearchMatchesCount(this._searchResults.length);
        }

        this._visibleViewMessages = newVisibleMessages;
        this._updateFilterStatus();
    },

    /**
     * @param {!WebInspector.Target} target
     * @param {!WebInspector.Event} event
     */
    _monitoringXHREnabledSettingChanged: function(target, event)
    {
        var enabled = /** @type {boolean} */ (event.data);
        WebInspector.targetManager.targets().forEach(function(target) {target.consoleAgent().setMonitoringXHREnabled(enabled);});
    },

    _messagesClicked: function()
    {
        if (!this._prompt.isCaretInsidePrompt() && window.getSelection().isCollapsed)
            this._prompt.moveCaretToEndOfPrompt();
    },

    _registerShortcuts: function()
    {
        this._shortcuts = {};

        var shortcut = WebInspector.KeyboardShortcut;
        var section = WebInspector.shortcutsScreen.section(WebInspector.UIString("Console"));

        var shortcutL = shortcut.makeDescriptor("l", WebInspector.KeyboardShortcut.Modifiers.Ctrl);
        this._shortcuts[shortcutL.key] = this._requestClearMessages.bind(this);
        var keys = [shortcutL];
        if (WebInspector.isMac()) {
            var shortcutK = shortcut.makeDescriptor("k", WebInspector.KeyboardShortcut.Modifiers.Meta);
            this._shortcuts[shortcutK.key] = this._requestClearMessages.bind(this);
            keys.unshift(shortcutK);
        }
        section.addAlternateKeys(keys, WebInspector.UIString("Clear console"));

        section.addKey(shortcut.makeDescriptor(shortcut.Keys.Tab), WebInspector.UIString("Autocomplete common prefix"));
        section.addKey(shortcut.makeDescriptor(shortcut.Keys.Right), WebInspector.UIString("Accept suggestion"));

        var shortcutU = shortcut.makeDescriptor("u", WebInspector.KeyboardShortcut.Modifiers.Ctrl);
        this._shortcuts[shortcutU.key] = this._clearPromptBackwards.bind(this);
        section.addAlternateKeys([shortcutU], WebInspector.UIString("Clear console prompt"));

        keys = [
            shortcut.makeDescriptor(shortcut.Keys.Down),
            shortcut.makeDescriptor(shortcut.Keys.Up)
        ];
        section.addRelatedKeys(keys, WebInspector.UIString("Next/previous line"));

        if (WebInspector.isMac()) {
            keys = [
                shortcut.makeDescriptor("N", shortcut.Modifiers.Alt),
                shortcut.makeDescriptor("P", shortcut.Modifiers.Alt)
            ];
            section.addRelatedKeys(keys, WebInspector.UIString("Next/previous command"));
        }

        section.addKey(shortcut.makeDescriptor(shortcut.Keys.Enter), WebInspector.UIString("Execute command"));
    },

    _clearPromptBackwards: function()
    {
        this._prompt.text = "";
    },

    _requestClearMessages: function()
    {
        WebInspector.console.requestClearMessages();
    },

    _promptKeyDown: function(event)
    {
        if (isEnterKey(event)) {
            this._enterKeyPressed(event);
            return;
        }

        var shortcut = WebInspector.KeyboardShortcut.makeKeyFromEvent(event);
        var handler = this._shortcuts[shortcut];
        if (handler) {
            handler();
            event.preventDefault();
        }
    },

    _enterKeyPressed: function(event)
    {
        if (event.altKey || event.ctrlKey || event.shiftKey)
            return;

        event.consume(true);

        this._prompt.clearAutoComplete(true);

        var str = this._prompt.text;
        if (!str.length)
            return;
        this._appendCommand(str, true);
    },

    /**
     * @param {?WebInspector.RemoteObject} result
     * @param {boolean} wasThrown
     * @param {!WebInspector.ConsoleMessage} originatingConsoleMessage
     */
    _printResult: function(result, wasThrown, originatingConsoleMessage)
    {
        if (!result)
            return;

        var target = result.target();
        /**
         * @param {string=} url
         * @param {number=} lineNumber
         * @param {number=} columnNumber
         */
        function addMessage(url, lineNumber, columnNumber)
        {
            var level = wasThrown ? WebInspector.ConsoleMessage.MessageLevel.Error : WebInspector.ConsoleMessage.MessageLevel.Log;
            var message = new WebInspector.ConsoleMessage(target, WebInspector.ConsoleMessage.MessageSource.JS, level, "", WebInspector.ConsoleMessage.MessageType.Result, url, lineNumber, columnNumber, undefined, [result]);
            message.setOriginatingMessage(originatingConsoleMessage);
            target.consoleModel.addMessage(message);
        }

        if (result.type !== "function") {
            addMessage();
            return;
        }

        result.functionDetails(didGetDetails);

        /**
         * @param {?DebuggerAgent.FunctionDetails} response
         */
        function didGetDetails(response)
        {
            if (!response) {
                addMessage();
                return;
            }

            var url;
            var lineNumber;
            var columnNumber;
            var script = target.debuggerModel.scriptForId(response.location.scriptId);
            if (script && script.sourceURL) {
                url = script.sourceURL;
                lineNumber = response.location.lineNumber + 1;
                columnNumber = response.location.columnNumber + 1;
            }
            // FIXME: this should be using live location.
            addMessage(url, lineNumber, columnNumber);
        }
    },

    /**
     * @param {string} text
     * @param {boolean} useCommandLineAPI
     */
    _appendCommand: function(text, useCommandLineAPI)
    {

        this._prompt.text = "";
        var currentExecutionContext = WebInspector.context.flavor(WebInspector.ExecutionContext);
        if (currentExecutionContext)
            WebInspector.ConsoleModel.evaluateCommandInConsole(currentExecutionContext, text, useCommandLineAPI);
    },

    /**
     * @param {!WebInspector.Event} event
     */
    _commandEvaluated: function(event)
    {
        var data = /**{{result: ?WebInspector.RemoteObject, wasThrown: boolean, text: string, commandMessage: !WebInspector.ConsoleMessage}} */ (event.data);
        this._prompt.pushHistoryItem(data.text);
        WebInspector.settings.consoleHistory.set(this._prompt.historyData.slice(-30));
        this._printResult(data.result, data.wasThrown, data.commandMessage);
    },

    /**
     * @return {!Array.<!Element>}
     */
    elementsToRestoreScrollPositionsFor: function()
    {
        return [this._messagesElement];
    },

    searchCanceled: function()
    {
        this._clearCurrentSearchResultHighlight();
        delete this._searchResults;
        delete this._searchRegex;
    },

    /**
     * @param {string} query
     * @param {boolean} shouldJump
     * @param {boolean=} jumpBackwards
     */
    performSearch: function(query, shouldJump, jumpBackwards)
    {
        this.searchCanceled();
        this._searchableView.updateSearchMatchesCount(0);
        this._searchRegex = createPlainTextSearchRegex(query, "gi");

        this._searchResults = [];
        for (var i = 0; i < this._visibleViewMessages.length; i++) {
            if (this._visibleViewMessages[i].matchesRegex(this._searchRegex))
                this._searchResults.push(this._visibleViewMessages[i]);
        }
        this._searchableView.updateSearchMatchesCount(this._searchResults.length);
        this._currentSearchResultIndex = -1;
        if (shouldJump && this._searchResults.length)
            this._jumpToSearchResult(jumpBackwards ? -1 : 0);
    },

    jumpToNextSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        this._jumpToSearchResult(this._currentSearchResultIndex + 1);
    },

    jumpToPreviousSearchResult: function()
    {
        if (!this._searchResults || !this._searchResults.length)
            return;
        this._jumpToSearchResult(this._currentSearchResultIndex - 1);
    },

    _clearCurrentSearchResultHighlight: function()
    {
        if (!this._searchResults)
            return;

        var highlightedViewMessage = this._searchResults[this._currentSearchResultIndex];
        if (highlightedViewMessage)
            highlightedViewMessage.clearHighlight();
        this._currentSearchResultIndex = -1;
    },

    _jumpToSearchResult: function(index)
    {
        index %= this._searchResults.length;
        this._clearCurrentSearchResultHighlight();
        this._currentSearchResultIndex = index;
        this._searchableView.updateCurrentMatchIndex(this._currentSearchResultIndex);
        this._searchResults[index].highlightSearchResults(this._searchRegex);
    },

    /**
     * @param {?Event} e
     */
    _onPasteIntoPrompt: function(e)
    {
        if (WebInspector.settings.allowPastingJavaScript.get())
            return;
        var result = prompt(WebInspector.UIString("You may be a victim of a scam. Executing this code is probably bad for you. \n\nType 'always allow' in the input field below to allow this action"));
        if (result === "always allow") {
            WebInspector.settings.allowPastingJavaScript.set(true);
            return;
        }
        e.consume(true);
    },

    __proto__: WebInspector.VBox.prototype
}

/**
 * @constructor
 * @extends {WebInspector.Object}
 * @param {!WebInspector.ConsoleView} view
 */
WebInspector.ConsoleViewFilter = function(view)
{
    this._view = view;
    this._messageURLFilters = WebInspector.settings.messageURLFilters.get();
    this._filterChanged = this.dispatchEventToListeners.bind(this, WebInspector.ConsoleViewFilter.Events.FilterChanged);
};

WebInspector.ConsoleViewFilter.Events = {
    FilterChanged: "FilterChanged"
};

WebInspector.ConsoleViewFilter.prototype = {
    addFilters: function(filterBar)
    {
        this._textFilterUI = new WebInspector.TextFilterUI(true);
        this._textFilterUI.addEventListener(WebInspector.FilterUI.Events.FilterChanged, this._textFilterChanged, this);
        filterBar.addFilter(this._textFilterUI);

        var levels = [
            {name: "error", label: WebInspector.UIString("Errors")},
            {name: "warning", label: WebInspector.UIString("Warnings")},
            {name: "info", label: WebInspector.UIString("Info")},
            {name: "log", label: WebInspector.UIString("Logs")},
            {name: "debug", label: WebInspector.UIString("Debug")}
        ];
        this._levelFilterUI = new WebInspector.NamedBitSetFilterUI(levels, WebInspector.settings.messageLevelFilters);
        this._levelFilterUI.addEventListener(WebInspector.FilterUI.Events.FilterChanged, this._filterChanged, this);
        filterBar.addFilter(this._levelFilterUI);
    },

    _textFilterChanged: function(event)
    {
        this._filterRegex = this._textFilterUI.regex();

        this._filterChanged();
    },

    /**
     * @param {string} url
     */
    addMessageURLFilter: function(url)
    {
        this._messageURLFilters[url] = true;
        WebInspector.settings.messageURLFilters.set(this._messageURLFilters);
        this._filterChanged();
    },

    /**
     * @param {string} url
     */
    removeMessageURLFilter: function(url)
    {
        if (!url)
            this._messageURLFilters = {};
        else
            delete this._messageURLFilters[url];

        WebInspector.settings.messageURLFilters.set(this._messageURLFilters);
        this._filterChanged();
    },

    /**
     * @returns {!Object}
     */
    get messageURLFilters()
    {
        return this._messageURLFilters;
    },

    /**
     * @param {!WebInspector.ConsoleViewMessage} viewMessage
     * @return {boolean}
     */
    shouldBeVisible: function(viewMessage)
    {
        var message = viewMessage.consoleMessage();
        var executionContext = WebInspector.context.flavor(WebInspector.ExecutionContext);
        if (!this._view._showAllMessagesCheckbox.checked() && executionContext && (message.target() !== executionContext.target() || message.executionContextId !== executionContext.id))
            return false;

        if (WebInspector.ConsoleGroup.isGroupStartMessage(viewMessage) || message.type === WebInspector.ConsoleMessage.MessageType.EndGroup)
            return true;

        if (message.type === WebInspector.ConsoleMessage.MessageType.Result || message.type === WebInspector.ConsoleMessage.MessageType.Command)
            return true;

        if (message.url && this._messageURLFilters[message.url])
            return false;

        if (message.level && !this._levelFilterUI.accept(message.level))
            return false;

        if (this._filterRegex) {
            this._filterRegex.lastIndex = 0;
            if (!viewMessage.matchesRegex(this._filterRegex))
                return false;
        }

        return true;
    },

    reset: function()
    {
        this._messageURLFilters = {};
        WebInspector.settings.messageURLFilters.set(this._messageURLFilters);
        WebInspector.settings.messageLevelFilters.set({});
        this._view._showAllMessagesCheckbox.inputElement.checked = true;
        this._textFilterUI.setValue("");
        this._filterChanged();
    },

    __proto__: WebInspector.Object.prototype
};


/**
 * @constructor
 * @extends {WebInspector.ConsoleViewMessage}
 * @param {!WebInspector.ConsoleMessage} message
 */
WebInspector.ConsoleCommand = function(message)
{
    WebInspector.ConsoleViewMessage.call(this, message, null);
}

WebInspector.ConsoleCommand.prototype = {
    wasShown: function()
    {
    },

    willHide: function()
    {
    },

    clearHighlight: function()
    {
        var highlightedMessage = this._formattedCommand;
        delete this._formattedCommand;
        this._formatCommand();
        this._element.replaceChild(this._formattedCommand, highlightedMessage);
    },

    /**
     * @param {!RegExp} regexObject
     */
    highlightSearchResults: function(regexObject)
    {
        regexObject.lastIndex = 0;
        var match = regexObject.exec(this.text);
        var matchRanges = [];
        while (match) {
            matchRanges.push(new WebInspector.SourceRange(match.index, match[0].length));
            match = regexObject.exec(this.text);
        }
        WebInspector.highlightSearchResults(this._formattedCommand, matchRanges);
        this._element.scrollIntoViewIfNeeded();
    },

    /**
     * @param {!RegExp} regexObject
     * @return {boolean}
     */
    matchesRegex: function(regexObject)
    {
        regexObject.lastIndex = 0;
        return regexObject.test(this.text);
    },

    /**
     * @return {!Element}
     */
    toMessageElement: function()
    {
        if (!this._element) {
            this._element = document.createElement("div");
            this._element.message = this;
            this._element.className = "console-user-command";

            this._formatCommand();
            this._element.appendChild(this._formattedCommand);
        }
        return this._element;
    },

    _formatCommand: function()
    {
        this._formattedCommand = document.createElement("span");
        this._formattedCommand.className = "console-message-text source-code";
        this._formattedCommand.textContent = this.text;
    },

    __proto__: WebInspector.ConsoleViewMessage.prototype
}

/**
 * @constructor
 * @extends {WebInspector.ConsoleViewMessage}
 * @param {!WebInspector.ConsoleMessage} message
 * @param {!WebInspector.Linkifier} linkifier
 */
WebInspector.ConsoleCommandResult = function(message, linkifier)
{
    WebInspector.ConsoleViewMessage.call(this, message, linkifier);
}

WebInspector.ConsoleCommandResult.prototype = {
    /**
     * @override
     * @param {!WebInspector.RemoteObject} array
     * @return {boolean}
     */
    useArrayPreviewInFormatter: function(array)
    {
        return false;
    },

    /**
     * @return {!Element}
     */
    toMessageElement: function()
    {
        var element = WebInspector.ConsoleViewMessage.prototype.toMessageElement.call(this);
        element.classList.add("console-user-command-result");
        return element;
    },

    __proto__: WebInspector.ConsoleViewMessage.prototype
}

/**
 * @constructor
 * @param {?WebInspector.ConsoleGroup} parentGroup
 * @param {?WebInspector.ConsoleViewMessage} groupMessage
 */
WebInspector.ConsoleGroup = function(parentGroup, groupMessage)
{
    this._parentGroup = parentGroup;
    this.element = document.createElement("div");
    this.element.className = "console-group";
    this.element.group = this;

    if (groupMessage) {
        this.element.createChild("div", "console-group-bracket");
        groupMessage._group = this;
        this._titleElement = groupMessage.toMessageElement();
        this.element.appendChild(this._titleElement);
        this._titleElement.addEventListener("click", this._titleClicked.bind(this), false);
        if (groupMessage.consoleMessage().type === WebInspector.ConsoleMessage.MessageType.StartGroupCollapsed)
            this.element.classList.add("collapsed");
    }

    this._messagesElement = this.element.createChild("div", "console-group-messages");
}

/**
 * @param {!WebInspector.ConsoleViewMessage} viewMessage
 * @return {boolean}
 */
WebInspector.ConsoleGroup.isGroupStartMessage = function(viewMessage)
{
    var messageType = viewMessage.consoleMessage().type;
    return messageType === WebInspector.ConsoleMessage.MessageType.StartGroup || messageType === WebInspector.ConsoleMessage.MessageType.StartGroupCollapsed;
}

WebInspector.ConsoleGroup.prototype = {
    /**
     * @param {!WebInspector.ConsoleViewMessage} viewMessage
     * @return {!WebInspector.ConsoleGroup}
     */
    createChildGroup: function(viewMessage)
    {
        var group = new WebInspector.ConsoleGroup(this, viewMessage);
        this._messagesElement.appendChild(group.element);
        return group;
    },

    /**
     * @return {?WebInspector.ConsoleGroup}
     */
    parentGroup: function()
    {
        return this._parentGroup;
    },

    /**
     * @param {!WebInspector.ConsoleViewMessage} viewMessage
     * @param {!WebInspector.ConsoleViewMessage=} insertBefore
     */
    addMessage: function(viewMessage, insertBefore)
    {
        var message = viewMessage.consoleMessage();
        var element = viewMessage.toMessageElement();
        var anchor = null;
        if (insertBefore && insertBefore.consoleMessage().type !== WebInspector.ConsoleMessage.MessageType.EndGroup)
            anchor = insertBefore._group ? insertBefore._group.element : insertBefore.toMessageElement();
        this._messagesElement.insertBefore(element, anchor);
        viewMessage.wasShown();

        var originatingMessage = viewMessage.consoleMessage().originatingMessage();
        if (element.previousSibling && originatingMessage && element.previousSibling.message && element.previousSibling.message.consoleMessage() === originatingMessage)
            element.previousSibling.classList.add("console-adjacent-user-command-result");
    },

    /**
     * @param {!WebInspector.ConsoleViewMessage} visibleViewMessage
     */
    removeMessage: function(visibleViewMessage)
    {
        visibleViewMessage.willHide();
        visibleViewMessage.toMessageElement().remove();
    },

    /**
     * @param {?Event} event
     */
    _titleClicked: function(event)
    {
        if (!this.element.classList.toggle("collapsed"))
            this.wasShown();
        this._titleElement.scrollIntoViewIfNeeded(true);
        event.consume(true);
    },

    wasShown: function()
    {
        if (this.element.classList.contains("collapsed"))
            return;
        var node = this._messagesElement.firstChild;
        while (node) {
            if (node.classList.contains("console-message") && node.message)
                node.message.wasShown();
            if (node.classList.contains("console-group") && node.group)
                node.group.wasShown();
            node = node.nextSibling;
        }
    }
}

/**
 * @constructor
 * @implements {WebInspector.ActionDelegate}
 */
WebInspector.ConsoleView.ShowConsoleActionDelegate = function()
{
}

WebInspector.ConsoleView.ShowConsoleActionDelegate.prototype = {
    /**
     * @return {boolean}
     */
    handleAction: function()
    {
        WebInspector.console.show();
        return true;
    }
}
