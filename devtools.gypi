#
# Copyright (C) 2013 Google Inc. All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#
#         * Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#         * Redistributions in binary form must reproduce the above
# copyright notice, this list of conditions and the following disclaimer
# in the documentation and/or other materials provided with the
# distribution.
#         * Neither the name of Google Inc. nor the names of its
# contributors may be used to endorse or promote products derived from
# this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#

{
    'variables': {
        # If debug_devtools is set to 1, JavaScript files for DevTools are
        # stored as is. Otherwise, a concatenated file is stored.
        'debug_devtools%': 0,
        # This list should contain all "autostart" modules from all apps.
        'devtools_core_files': [
            '<@(devtools_bindings_js_files)',
            '<@(devtools_common_js_files)',
            '<@(devtools_components_js_files)',
            '<@(devtools_core_base_files)',
            '<@(devtools_devtools_app_js_files)',
            '<@(devtools_host_js_files)',
            '<@(devtools_main_js_files)',
            '<@(devtools_platform_js_files)',
            '<@(devtools_sdk_js_files)',
            '<@(devtools_toolbox_bootstrap_js_files)',
            '<@(devtools_toolbox_js_files)',
            '<@(devtools_ui_js_files)',
            '<@(devtools_workspace_js_files)',
            '<@(devtools_core_css_files)',
        ],
        'devtools_core_base_files': [
            'front_end/devtools.css',
            'front_end/devtools.js',
            'front_end/devtools.json',
            'front_end/inspector.css',
            'front_end/inspector.js',
            'front_end/inspector.json',
            'front_end/toolbox.css',
            'front_end/toolbox.js',
            'front_end/toolbox.json',
            'front_end/Runtime.js',
        ],
        'devtools_core_css_files': [
            'front_end/dialog.css',
            'front_end/inspectorCommon.css',
            'front_end/inspectorStyle.css',
            'front_end/inspectorSyntaxHighlight.css',
            'front_end/popover.css',
            'front_end/sidebarPane.css',
        ],
        'devtools_common_js_files': [
            'front_end/common/Color.js',
            'front_end/common/Console.js',
            'front_end/common/ContentProvider.js',
            'front_end/common/Geometry.js',
            'front_end/common/Lock.js',
            'front_end/common/ModuleExtensionInterfaces.js',
            'front_end/common/NotificationService.js',
            'front_end/common/Object.js',
            'front_end/common/ParsedURL.js',
            'front_end/common/Progress.js',
            'front_end/common/ResourceType.js',
            'front_end/common/Settings.js',
            'front_end/common/StaticContentProvider.js',
            'front_end/common/Streams.js',
            'front_end/common/TextDictionary.js',
            'front_end/common/TextRange.js',
            'front_end/common/TextUtils.js',
            'front_end/common/Throttler.js',
            'front_end/common/UIString.js',
            'front_end/common/WebInspector.js',
            'front_end/common/WorkerRuntime.js',
        ],
        'devtools_components_js_files': [
            'front_end/components/breakpointsList.css',
            'front_end/components/nodeLink.css',
            'front_end/components/DebuggerPresentationUtils.js',
            'front_end/components/DockController.js',
            'front_end/components/DOMBreakpointsSidebarPane.js',
            'front_end/components/DOMPresentationUtils.js',
            'front_end/components/Drawer.js',
            'front_end/components/ExecutionContextSelector.js',
            'front_end/components/HandlerRegistry.js',
            'front_end/components/InspectElementModeController.js',
            'front_end/components/InspectorView.js',
            'front_end/components/NativeBreakpointsSidebarPane.js',
            'front_end/components/ObjectPopoverHelper.js',
            'front_end/components/ObjectPropertiesSection.js',
            'front_end/components/ShortcutsScreen.js',
        ],
        'devtools_host_js_files': [
            'front_end/host/InspectorFrontendHost.js',
            'front_end/host/Platform.js',
            'front_end/host/UserMetrics.js',
        ],
        'devtools_screencast_js_files': [
            'front_end/screencast/screencastView.css',
            'front_end/screencast/ScreencastApp.js',
            'front_end/screencast/ScreencastView.js',
        ],
        'devtools_sdk_js_files': [
            'front_end/sdk/AccessibilityModel.js',
            'front_end/sdk/AnimationModel.js',
            'front_end/sdk/ApplicationCacheModel.js',
            'front_end/sdk/BlackboxSupport.js',
            'front_end/sdk/ConsoleModel.js',
            'front_end/sdk/ContentProviders.js',
            'front_end/sdk/CookieParser.js',
            'front_end/sdk/CPUProfileDataModel.js',
            'front_end/sdk/CPUProfilerModel.js',
            'front_end/sdk/CSSMetadata.js',
            'front_end/sdk/CSSParser.js',
            'front_end/sdk/CSSStyleModel.js',
            'front_end/sdk/Database.js',
            'front_end/sdk/DebuggerModel.js',
            'front_end/sdk/DOMModel.js',
            'front_end/sdk/DOMStorage.js',
            'front_end/sdk/FileSystemModel.js',
            'front_end/sdk/HAREntry.js',
            'front_end/sdk/HeapProfilerModel.js',
            'front_end/sdk/IndexedDBModel.js',
            'front_end/sdk/InspectorBackend.js',
            'front_end/sdk/LayerTreeModel.js',
            'front_end/sdk/NetworkLog.js',
            'front_end/sdk/NetworkManager.js',
            'front_end/sdk/NetworkRequest.js',
            'front_end/sdk/OverridesSupport.js',
            'front_end/sdk/PaintProfiler.js',
            'front_end/sdk/RemoteObject.js',
            'front_end/sdk/Resource.js',
            'front_end/sdk/ResourceTreeModel.js',
            'front_end/sdk/RuntimeModel.js',
            'front_end/sdk/Script.js',
            'front_end/sdk/SnippetStorage.js',
            'front_end/sdk/SourceMap.js',
            'front_end/sdk/Target.js',
            'front_end/sdk/TracingManager.js',
            'front_end/sdk/TracingModel.js',
            'front_end/sdk/WorkerManager.js',
            'front_end/sdk/WorkerTargetManager.js',
        ],
        'devtools_workspace_js_files': [
            'front_end/workspace/ExcludedFolderManager.js',
            'front_end/workspace/FileManager.js',
            'front_end/workspace/FileSystemMapping.js',
            'front_end/workspace/IsolatedFileSystem.js',
            'front_end/workspace/IsolatedFileSystemManager.js',
            'front_end/workspace/SearchConfig.js',
            'front_end/workspace/UISourceCode.js',
            'front_end/workspace/Workspace.js',
        ],
        'devtools_bindings_js_files': [
            'front_end/bindings/BreakpointManager.js',
            'front_end/bindings/CompilerScriptMapping.js',
            'front_end/bindings/ContentProviderBasedProjectDelegate.js',
            'front_end/bindings/CSSWorkspaceBinding.js',
            'front_end/bindings/DebuggerWorkspaceBinding.js',
            'front_end/bindings/DefaultScriptMapping.js',
            'front_end/bindings/ContentScriptProjectDecorator.js',
            'front_end/bindings/FileSystemWorkspaceBinding.js',
            'front_end/bindings/FileUtils.js',
            'front_end/bindings/Linkifier.js',
            'front_end/bindings/LiveLocation.js',
            'front_end/bindings/NetworkMapping.js',
            'front_end/bindings/NetworkProject.js',
            'front_end/bindings/PresentationConsoleMessageHelper.js',
            'front_end/bindings/ResourceScriptMapping.js',
            'front_end/bindings/ResourceUtils.js',
            'front_end/bindings/SASSSourceMapping.js',
            'front_end/bindings/ScriptSnippetModel.js',
            'front_end/bindings/StylesSourceMapping.js',
            'front_end/bindings/TempFile.js',
            'front_end/bindings/WorkspaceController.js',
        ],
        'devtools_devtools_app_js_files': [
            'front_end/devtools_app/DevToolsAPI.js',
            'front_end/devtools_app/DevToolsApp.js',
            'front_end/devtools_app/InspectorFrontendHostImpl.js',
            'front_end/devtools_app/UITests.js',
        ],
        'devtools_platform_js_files': [
            'front_end/platform/DOMExtension.js',
            'front_end/platform/utilities.js',
        ],
        'devtools_toolbox_bootstrap_js_files': [
            'front_end/toolbox_bootstrap/Toolbox.js',
        ],
        'devtools_toolbox_js_files': [
            'front_end/toolbox/responsiveDesignView.css',
            'front_end/toolbox/EmulatedDevices.js',
            'front_end/toolbox/InspectedPagePlaceholder.js',
            'front_end/toolbox/MediaQueryInspector.js',
            'front_end/toolbox/OverridesUI.js',
            'front_end/toolbox/ResponsiveDesignView.js',
        ],
        'devtools_ui_js_files': [
            'front_end/ui/checkboxTextLabel.css',
            'front_end/ui/dropTarget.css',
            'front_end/ui/emptyView.css',
            'front_end/ui/filter.css',
            'front_end/ui/helpScreen.css',
            'front_end/ui/panelEnablerView.css',
            'front_end/ui/progressIndicator.css',
            'front_end/ui/propertiesSection.css',
            'front_end/ui/radioButton.css',
            'front_end/ui/searchableView.css',
            'front_end/ui/section.css',
            'front_end/ui/softContextMenu.css',
            'front_end/ui/smallIcon.css',
            'front_end/ui/splitView.css',
            'front_end/ui/statusBar.css',
            'front_end/ui/suggestBox.css',
            'front_end/ui/tabbedPane.css',
            'front_end/ui/textButton.css',
            'front_end/ui/textPrompt.css',
            'front_end/ui/treeoutline.css',
            'front_end/ui/ActionRegistry.js',
            'front_end/ui/Context.js',
            'front_end/ui/ContextMenu.js',
            'front_end/ui/Dialog.js',
            'front_end/ui/DOMSyntaxHighlighter.js',
            'front_end/ui/DropDownMenu.js',
            'front_end/ui/DropTarget.js',
            'front_end/ui/EmptyView.js',
            'front_end/ui/FilterBar.js',
            'front_end/ui/ForwardedInputEventHandler.js',
            'front_end/ui/HelpScreen.js',
            'front_end/ui/InplaceEditor.js',
            'front_end/ui/KeyboardShortcut.js',
            'front_end/ui/Panel.js',
            'front_end/ui/Popover.js',
            'front_end/ui/ProgressIndicator.js',
            'front_end/ui/ResizerWidget.js',
            'front_end/ui/RootView.js',
            'front_end/ui/SearchableView.js',
            'front_end/ui/Section.js',
            'front_end/ui/SettingsUI.js',
            'front_end/ui/ShortcutRegistry.js',
            'front_end/ui/SidebarPane.js',
            'front_end/ui/SidebarTreeElement.js',
            'front_end/ui/SoftContextMenu.js',
            'front_end/ui/SplitView.js',
            'front_end/ui/StackView.js',
            'front_end/ui/StatusBar.js',
            'front_end/ui/SuggestBox.js',
            'front_end/ui/TabbedPane.js',
            'front_end/ui/TextPrompt.js',
            'front_end/ui/UIUtils.js',
            'front_end/ui/View.js',
            'front_end/ui/ViewportControl.js',
            'front_end/ui/ZoomManager.js',
            'front_end/ui/treeoutline.js',
        ],
        'devtools_main_js_files': [
            'front_end/main/accelerometer.css',
            'front_end/main/overrides.css',
            'front_end/main/AdvancedApp.js',
            'front_end/main/HelpScreenUntilReload.js',
            'front_end/main/Main.js',
            'front_end/main/OverridesView.js',
            'front_end/main/RenderingOptions.js',
            'front_end/main/SimpleApp.js',
            'front_end/main/Tests.js',
            'front_end/main/TestController.js',
        ],
        'devtools_module_json_files': [
            'front_end/audits/module.json',
            'front_end/bindings/module.json',
            'front_end/common/module.json',
            'front_end/components/module.json',
            'front_end/components_lazy/module.json',
            'front_end/console/module.json',
            'front_end/devices/module.json',
            'front_end/devtools_app/module.json',
            'front_end/elements/module.json',
            'front_end/emulated_devices/module.json',
            'front_end/extensions/module.json',
            'front_end/heap_snapshot_worker/module.json',
            'front_end/host/module.json',
            'front_end/layers/module.json',
            'front_end/main/module.json',
            'front_end/network/module.json',
            'front_end/platform/module.json',
            'front_end/profiler/module.json',
            'front_end/promises/module.json',
            'front_end/resources/module.json',
            'front_end/screencast/module.json',
            'front_end/script_formatter_worker/module.json',
            'front_end/sdk/module.json',
            'front_end/settings/module.json',
            'front_end/source_frame/module.json',
            'front_end/sources/module.json',
            'front_end/temp_storage_shared_worker/module.json',
            'front_end/timeline/module.json',
            'front_end/toolbox/module.json',
            'front_end/toolbox_bootstrap/module.json',
            'front_end/ui/module.json',
            'front_end/ui_lazy/module.json',
            'front_end/workspace/module.json',
        ],
        'all_devtools_files': [
            '<@(devtools_cm_css_files)',
            '<@(devtools_cm_js_files)',
            '<@(devtools_core_files)',
            '<@(devtools_module_json_files)',
            '<@(devtools_modules_js_files)',
            '<@(devtools_uglify_files)',
        ],

        # Lazy-loaded modules.
        'devtools_audits_js_files': [
            'front_end/audits/auditsPanel.css',
            'front_end/audits/AuditCategories.js',
            'front_end/audits/AuditCategory.js',
            'front_end/audits/AuditController.js',
            'front_end/audits/AuditExtensionCategory.js',
            'front_end/audits/AuditFormatters.js',
            'front_end/audits/AuditLauncherView.js',
            'front_end/audits/AuditResultView.js',
            'front_end/audits/AuditRules.js',
            'front_end/audits/AuditsPanel.js',
        ],
        'devtools_components_lazy_js_files': [
            'front_end/components_lazy/CookiesTable.js',
        ],
        'devtools_console_js_files': [
            'front_end/console/consoleView.css',
            'front_end/console/ConsolePanel.js',
            'front_end/console/ConsoleView.js',
            'front_end/console/ConsoleViewMessage.js',
            'front_end/console/CustomPreviewSection.js',
        ],
        'devtools_devices_js_files': [
            'front_end/devices/devicesView.css',
            'front_end/devices/DevicesView.js',
        ],
        'devtools_elements_js_files': [
            'front_end/elements/animationTimeline.css',
            'front_end/elements/bezierEditor.css',
            'front_end/elements/breadcrumbs.css',
            'front_end/elements/elementsPanel.css',
            'front_end/elements/elementsTreeOutline.css',
            'front_end/elements/spectrum.css',
            'front_end/elements/AccessibilitySidebarPane.js',
            'front_end/elements/AnimationTimeline.js',
            'front_end/elements/AnimationsSidebarPane.js',
            'front_end/elements/BezierEditor.js',
            'front_end/elements/BezierUI.js',
            'front_end/elements/ElementsBreadcrumbs.js',
            'front_end/elements/ElementsPanel.js',
            'front_end/elements/ElementsSidebarPane.js',
            'front_end/elements/ElementsTreeElement.js',
            'front_end/elements/ElementsTreeOutline.js',
            'front_end/elements/EventListenersSidebarPane.js',
            'front_end/elements/MetricsSidebarPane.js',
            'front_end/elements/PlatformFontsSidebarPane.js',
            'front_end/elements/PropertiesSidebarPane.js',
            'front_end/elements/Spectrum.js',
            'front_end/elements/StylesPopoverHelper.js',
            'front_end/elements/StylesSectionModel.js',
            'front_end/elements/StylesSidebarPane.js',
            'front_end/elements/ComputedStyleSidebarPane.js',
        ],
        'devtools_emulated_devices_js_files': [
        ],
        'devtools_extensions_js_files': [
            'front_end/extensions/ExtensionAuditCategory.js',
            'front_end/extensions/ExtensionPanel.js',
            'front_end/extensions/ExtensionRegistryStub.js',
            'front_end/extensions/ExtensionServer.js',
            'front_end/extensions/ExtensionView.js',
            '<@(devtools_extension_api_files)',
        ],
        'devtools_promises_js_files': [
            'front_end/promises/promisePane.css',
            'front_end/promises/PromisePane.js',
        ],
        'devtools_heap_snapshot_worker_js_files': [
            'front_end/common/TextUtils.js',
            'front_end/common/UIString.js',
            'front_end/heap_snapshot_worker/AllocationProfile.js',
            'front_end/heap_snapshot_worker/HeapSnapshot.js',
            'front_end/heap_snapshot_worker/HeapSnapshotLoader.js',
            'front_end/heap_snapshot_worker/HeapSnapshotWorker.js',
            'front_end/heap_snapshot_worker/HeapSnapshotWorkerDispatcher.js',
            'front_end/heap_snapshot_worker/JSHeapSnapshot.js',
            'front_end/platform/utilities.js',
            'front_end/profiler/HeapSnapshotCommon.js',
        ],
        'devtools_layers_js_files': [
            'front_end/layers/LayerPaintProfilerView.js',
            'front_end/layers/LayersPanel.js',
        ],
        'devtools_network_js_files': [
            'front_end/network/eventSourceMessagesView.css',
            'front_end/network/networkLogView.css',
            'front_end/network/networkPanel.css',
            'front_end/network/requestCookiesView.css',
            'front_end/network/requestHeadersView.css',
            'front_end/network/webSocketFrameView.css',
            'front_end/network/xmlView.css',
            'front_end/network/EventSourceMessagesView.js',
            'front_end/network/FilterSuggestionBuilder.js',
            'front_end/network/HARWriter.js',
            'front_end/network/NetworkDataGridNode.js',
            'front_end/network/NetworkItemView.js',
            'front_end/network/NetworkLogView.js',
            'front_end/network/NetworkPanel.js',
            'front_end/network/NetworkTimeCalculator.js',
            'front_end/network/RequestCookiesView.js',
            'front_end/network/RequestHeadersView.js',
            'front_end/network/RequestHTMLView.js',
            'front_end/network/RequestJSONView.js',
            'front_end/network/RequestPreviewView.js',
            'front_end/network/RequestResponseView.js',
            'front_end/network/RequestTimingView.js',
            'front_end/network/RequestView.js',
            'front_end/network/ResourceWebSocketFrameView.js',
            'front_end/network/XMLView.js',
        ],
        'devtools_profiler_js_files': [
            'front_end/profiler/canvasProfiler.css',
            'front_end/profiler/heapProfiler.css',
            'front_end/profiler/profilesPanel.css',
            'front_end/profiler/CanvasProfileView.js',
            'front_end/profiler/CanvasReplayStateView.js',
            'front_end/profiler/CPUProfileBottomUpDataGrid.js',
            'front_end/profiler/CPUProfileDataGrid.js',
            'front_end/profiler/CPUProfileFlameChart.js',
            'front_end/profiler/CPUProfileTopDownDataGrid.js',
            'front_end/profiler/CPUProfileView.js',
            'front_end/profiler/HeapSnapshotCommon.js',
            'front_end/profiler/HeapSnapshotDataGrids.js',
            'front_end/profiler/HeapSnapshotGridNodes.js',
            'front_end/profiler/HeapSnapshotProxy.js',
            'front_end/profiler/HeapSnapshotView.js',
            'front_end/profiler/ProfileLauncherView.js',
            'front_end/profiler/ProfilesPanel.js',
            'front_end/profiler/ProfileTypeRegistry.js',
            'front_end/profiler/TargetsComboBoxController.js',
        ],
        'devtools_resources_js_files': [
            'front_end/resources/indexedDBViews.css',
            'front_end/resources/resourcesPanel.css',
            'front_end/resources/ApplicationCacheItemsView.js',
            'front_end/resources/CookieItemsView.js',
            'front_end/resources/DatabaseQueryView.js',
            'front_end/resources/DatabaseTableView.js',
            'front_end/resources/DirectoryContentView.js',
            'front_end/resources/DOMStorageItemsView.js',
            'front_end/resources/FileContentView.js',
            'front_end/resources/FileSystemView.js',
            'front_end/resources/IndexedDBViews.js',
            'front_end/resources/ResourcesPanel.js',
        ],
        'devtools_script_formatter_worker_js_files': [
            'front_end/cm/css.js',
            'front_end/cm/headlesscodemirror.js',
            'front_end/cm/htmlmixed.js',
            'front_end/cm/javascript.js',
            'front_end/cm/xml.js',
            'front_end/common/WebInspector.js',
            'front_end/platform/utilities.js',
            'front_end/script_formatter_worker/CSSFormatter.js',
            'front_end/script_formatter_worker/JavaScriptFormatter.js',
            'front_end/script_formatter_worker/ScriptFormatterWorker.js',
        ],
        'devtools_settings_js_files': [
            'front_end/settings/EditFileSystemDialog.js',
            'front_end/settings/FrameworkBlackboxDialog.js',
            'front_end/settings/SettingsScreen.js',
        ],
        'devtools_source_frame_js_files': [
            'front_end/source_frame/cmdevtools.css',
            'front_end/source_frame/fontView.css',
            'front_end/source_frame/imageView.css',
            'front_end/source_frame/resourceSourceFrame.css',
            'front_end/source_frame/CodeMirrorDictionary.js',
            'front_end/source_frame/CodeMirrorTextEditor.js',
            'front_end/source_frame/CodeMirrorUtils.js',
            'front_end/source_frame/FontView.js',
            'front_end/source_frame/GoToLineDialog.js',
            'front_end/source_frame/ImageView.js',
            'front_end/source_frame/ResourceSourceFrame.js',
            'front_end/source_frame/SourceFrame.js',
            'front_end/source_frame/TextEditorAutocompleteController.js',
        ],
        'devtools_sources_js_files': [
            'front_end/sources/filteredItemSelectionDialog.css',
            'front_end/sources/navigatorView.css',
            'front_end/sources/revisionHistory.css',
            'front_end/sources/sourcesPanel.css',
            'front_end/sources/sourcesSearch.css',
            'front_end/sources/sourcesView.css',
            'front_end/sources/uiList.css',
            'front_end/sources/AddSourceMapURLDialog.js',
            'front_end/sources/AdvancedSearchView.js',
            'front_end/sources/AsyncOperationsSidebarPane.js',
            'front_end/sources/BreakpointsSidebarPane.js',
            'front_end/sources/CallStackSidebarPane.js',
            'front_end/sources/CSSSourceFrame.js',
            'front_end/sources/EditingLocationHistoryManager.js',
            'front_end/sources/FileBasedSearchResultsPane.js',
            'front_end/sources/FilePathScoreFunction.js',
            'front_end/sources/FilteredItemSelectionDialog.js',
            'front_end/sources/InplaceFormatterEditorAction.js',
            'front_end/sources/JavaScriptCompiler.js',
            'front_end/sources/JavaScriptSourceFrame.js',
            'front_end/sources/jsdifflib.js',
            'front_end/sources/NavigatorView.js',
            'front_end/sources/RevisionHistoryView.js',
            'front_end/sources/ScopeChainSidebarPane.js',
            'front_end/sources/ScriptFormatter.js',
            'front_end/sources/ScriptFormatterEditorAction.js',
            'front_end/sources/SimpleHistoryManager.js',
            'front_end/sources/SourcesNavigator.js',
            'front_end/sources/SourcesPanel.js',
            'front_end/sources/SourcesSearchScope.js',
            'front_end/sources/SourcesView.js',
            'front_end/sources/StyleSheetOutlineDialog.js',
            'front_end/sources/TabbedEditorContainer.js',
            'front_end/sources/ThreadsSidebarPane.js',
            'front_end/sources/UIList.js',
            'front_end/sources/UISourceCodeFrame.js',
            'front_end/sources/WatchExpressionsSidebarPane.js',
            'front_end/sources/WorkspaceMappingTip.js',
        ],
        'devtools_temp_storage_shared_worker_js_files': [
            'front_end/temp_storage_shared_worker/TempStorageSharedWorker.js',
        ],
        'devtools_timeline_js_files': [
            'front_end/timeline/timelinePanel.css',
            'front_end/timeline/CountersGraph.js',
            'front_end/timeline/LayerDetailsView.js',
            'front_end/timeline/LayerTreeOutline.js',
            'front_end/timeline/LayerViewHost.js',
            'front_end/timeline/Layers3DView.js',
            'front_end/timeline/MemoryCountersGraph.js',
            'front_end/timeline/PaintProfilerView.js',
            'front_end/timeline/TimelineEventOverview.js',
            'front_end/timeline/TimelineFlameChart.js',
            'front_end/timeline/TimelineFrameModel.js',
            'front_end/timeline/TimelineFrameOverview.js',
            'front_end/timeline/TimelineJSProfile.js',
            'front_end/timeline/TimelineLayersView.js',
            'front_end/timeline/TimelineMemoryOverview.js',
            'front_end/timeline/TimelineModel.js',
            'front_end/timeline/TimelineOverviewPane.js',
            'front_end/timeline/TimelinePaintProfilerView.js',
            'front_end/timeline/TimelinePanel.js',
            'front_end/timeline/TimelinePresentationModel.js',
            'front_end/timeline/TimelineUIUtils.js',
            'front_end/timeline/TimelineView.js',
            'front_end/timeline/TransformController.js',
        ],
        'devtools_ui_lazy_js_files': [
            'front_end/ui_lazy/dataGrid.css',
            'front_end/ui_lazy/flameChart.css',
            'front_end/ui_lazy/overviewGrid.css',
            'front_end/ui_lazy/pieChart.css',
            'front_end/ui_lazy/timelineGrid.css',
            'front_end/ui_lazy/DataGrid.js',
            'front_end/ui_lazy/FlameChart.js',
            'front_end/ui_lazy/OverviewGrid.js',
            'front_end/ui_lazy/PieChart.js',
            'front_end/ui_lazy/ShowMoreDataGridNode.js',
            'front_end/ui_lazy/SortableDataGrid.js',
            'front_end/ui_lazy/TimelineGrid.js',
            'front_end/ui_lazy/ViewportDataGrid.js',
        ],

        # Third-party code.
        'devtools_cm_css_files': [
            'front_end/cm/codemirror.css',
        ],
        'devtools_cm_js_files': [
            'front_end/cm/clike.js',
            'front_end/cm/closebrackets.js',
            'front_end/cm/codemirror.js',
            'front_end/cm/coffeescript.js',
            'front_end/cm/comment.js',
            'front_end/cm/css.js',
            'front_end/cm/headlesscodemirror.js',
            'front_end/cm/htmlembedded.js',
            'front_end/cm/htmlmixed.js',
            'front_end/cm/javascript.js',
            'front_end/cm/markselection.js',
            'front_end/cm/matchbrackets.js',
            'front_end/cm/overlay.js',
            'front_end/cm/php.js',
            'front_end/cm/python.js',
            'front_end/cm/shell.js',
            'front_end/cm/xml.js',
        ],
        'devtools_uglify_files': [
            'front_end/UglifyJS/parse-js.js',
        ],

        'devtools_modules_js_files': [
            '<@(devtools_audits_js_files)',
            '<@(devtools_components_lazy_js_files)',
            '<@(devtools_console_js_files)',
            '<@(devtools_devices_js_files)',
            '<@(devtools_elements_js_files)',
            '<@(devtools_emulated_devices_js_files)',
            '<@(devtools_extensions_js_files)',
            '<@(devtools_heap_snapshot_worker_js_files)',
            '<@(devtools_layers_js_files)',
            '<@(devtools_network_js_files)',
            '<@(devtools_profiler_js_files)',
            '<@(devtools_promises_js_files)',
            '<@(devtools_resources_js_files)',
            '<@(devtools_screencast_js_files)',
            '<@(devtools_script_formatter_worker_js_files)',
            '<@(devtools_settings_js_files)',
            '<@(devtools_source_frame_js_files)',
            '<@(devtools_sources_js_files)',
            '<@(devtools_temp_storage_shared_worker_js_files)',
            '<@(devtools_timeline_js_files)',
            '<@(devtools_ui_lazy_js_files)',
        ],
        'devtools_image_files': [
            'front_end/Images/applicationCache.png',
            'front_end/Images/breakpoint.png',
            'front_end/Images/breakpoint_2x.png',
            'front_end/Images/breakpointConditional.png',
            'front_end/Images/breakpointConditional_2x.png',
            'front_end/Images/checker.png',
            'front_end/Images/cookie.png',
            'front_end/Images/chromeDisabledSelect.png',
            'front_end/Images/chromeDisabledSelect_2x.png',
            'front_end/Images/chromeLeft.png',
            'front_end/Images/chromeMiddle.png',
            'front_end/Images/chromeRight.png',
            'front_end/Images/chromeSelect.png',
            'front_end/Images/chromeSelect_2x.png',
            'front_end/Images/database.png',
            'front_end/Images/databaseTable.png',
            'front_end/Images/deleteIcon.png',
            'front_end/Images/domain.png',
            'front_end/Images/errorWave.png',
            'front_end/Images/errorWave_2x.png',
            'front_end/Images/fileSystem.png',
            'front_end/Images/forward.png',
            'front_end/Images/frame.png',
            'front_end/Images/graphLabelCalloutLeft.png',
            'front_end/Images/graphLabelCalloutRight.png',
            'front_end/Images/indexedDB.png',
            'front_end/Images/indexedDBIndex.png',
            'front_end/Images/indexedDBObjectStore.png',
            'front_end/Images/localStorage.png',
            'front_end/Images/navigationControls.png',
            'front_end/Images/navigationControls_2x.png',
            'front_end/Images/paneAddButtons.png',
            'front_end/Images/paneAnimationsButtons.png',
            'front_end/Images/paneElementStateButtons.png',
            'front_end/Images/paneFilterButtons.png',
            'front_end/Images/paneRefreshButtons.png',
            'front_end/Images/popoverArrows.png',
            'front_end/Images/popoverBackground.png',
            'front_end/Images/profileGroupIcon.png',
            'front_end/Images/profileIcon.png',
            'front_end/Images/profileSmallIcon.png',
            'front_end/Images/radioDot.png',
            'front_end/Images/resourceCSSIcon.png',
            'front_end/Images/resourceDocumentIcon.png',
            'front_end/Images/resourceDocumentIconSmall.png',
            'front_end/Images/resourceJSIcon.png',
            'front_end/Images/resourcePlainIcon.png',
            'front_end/Images/resourcePlainIconSmall.png',
            'front_end/Images/resourcesTimeGraphIcon.png',
            'front_end/Images/responsiveDesign.png',
            'front_end/Images/responsiveDesign_2x.png',
            'front_end/Images/searchNext.png',
            'front_end/Images/searchPrev.png',
            'front_end/Images/sessionStorage.png',
            'front_end/Images/settingsListRemove.png',
            'front_end/Images/settingsListRemove_2x.png',
            'front_end/Images/statusbarButtonGlyphs.png',
            'front_end/Images/statusbarButtonGlyphs_2x.png',
            'front_end/Images/statusbarResizerHorizontal.png',
            'front_end/Images/statusbarResizerVertical.png',
            'front_end/Images/thumbActiveHoriz.png',
            'front_end/Images/thumbActiveVert.png',
            'front_end/Images/thumbHoriz.png',
            'front_end/Images/thumbHoverHoriz.png',
            'front_end/Images/thumbHoverVert.png',
            'front_end/Images/thumbVert.png',
            'front_end/Images/toolbarItemSelected.png',
            'front_end/Images/touchCursor.png',
            'front_end/Images/touchCursor_2x.png',
        ],
        'devtools_extension_api_files': [
            'front_end/extensions/ExtensionAPI.js',
        ],
    },
}
