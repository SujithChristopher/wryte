import { invoke } from '@tauri-apps/api/core';
import './style.css';

class WryteEditor {
  constructor() {
    // Core elements
    this.editor = document.getElementById('editor');
    this.wordCountEl = document.getElementById('word-count');
    this.charCountEl = document.getElementById('char-count');
    this.zoomLevel = 100;
    this.zoomLevelEl = document.getElementById('zoom-level');
    
    // Search functionality
    this.currentSearchResults = [];
    this.currentSearchIndex = -1;
    
    // Color state
    this.currentTextColor = '#000000';
    this.currentHighlightColor = '#ffff00';
    
    this.initializeEventListeners();
    this.updateStats();
  }

  initializeEventListeners() {
    this.initializeFormattingControls();
    this.initializeFontControls();
    this.initializeParagraphControls();
    this.initializeClipboardControls();
    this.initializeSearchControls();
    this.initializeTableControls();
    this.initializeViewControls();
    this.initializeTabControls();
    this.initializeEditorEvents();
  }

  // === FORMATTING CONTROLS ===
  initializeFormattingControls() {
    // Basic formatting buttons
    document.getElementById('bold-btn').addEventListener('click', () => {
      this.execCommand('bold');
    });

    document.getElementById('italic-btn').addEventListener('click', () => {
      this.execCommand('italic');
    });

    document.getElementById('underline-btn').addEventListener('click', () => {
      this.execCommand('underline');
    });

    document.getElementById('strikethrough-btn').addEventListener('click', () => {
      this.execCommand('strikeThrough');
    });

    // Undo/Redo
    document.getElementById('undo-btn').addEventListener('click', () => {
      this.execCommand('undo');
    });

    document.getElementById('redo-btn').addEventListener('click', () => {
      this.execCommand('redo');
    });
  }

  // === FONT CONTROLS ===
  initializeFontControls() {
    // Font family and size
    const fontFamily = document.getElementById('font-family');
    if (fontFamily) {
      fontFamily.addEventListener('change', (e) => {
        this.execCommand('fontName', e.target.value);
      });
    }

    const fontSize = document.getElementById('font-size');
    if (fontSize) {
      fontSize.addEventListener('change', (e) => {
        this.execCommand('fontSize', e.target.value);
      });
    }

    // Font size controls
    const growFontBtn = document.getElementById('grow-font-btn');
    if (growFontBtn) {
      growFontBtn.addEventListener('click', () => {
        this.changeFontSize(1);
      });
    }

    const shrinkFontBtn = document.getElementById('shrink-font-btn');
    if (shrinkFontBtn) {
      shrinkFontBtn.addEventListener('click', () => {
        this.changeFontSize(-1);
      });
    }

    // Subscript and superscript
    const subscriptBtn = document.getElementById('subscript-btn');
    if (subscriptBtn) {
      subscriptBtn.addEventListener('click', () => {
        this.toggleSubscript();
      });
    }

    const superscriptBtn = document.getElementById('superscript-btn');
    if (superscriptBtn) {
      superscriptBtn.addEventListener('click', () => {
        this.toggleSuperscript();
      });
    }

    // Text color controls
    const textColorBtn = document.getElementById('text-color-btn');
    if (textColorBtn) {
      textColorBtn.addEventListener('click', () => {
        this.applyTextColor(this.currentTextColor);
      });
    }

    const textColorDropdown = document.getElementById('text-color-dropdown');
    const textColorPicker = document.getElementById('text-color-picker');
    if (textColorDropdown && textColorPicker) {
      textColorDropdown.addEventListener('click', () => {
        textColorPicker.click();
      });
    }

    if (textColorPicker) {
      textColorPicker.addEventListener('change', (e) => {
        this.currentTextColor = e.target.value;
        this.updateColorBar('text-color-bar', e.target.value);
        this.applyTextColor(e.target.value);
      });
    }

    // Highlight color controls
    const highlightColorBtn = document.getElementById('highlight-color-btn');
    if (highlightColorBtn) {
      highlightColorBtn.addEventListener('click', () => {
        this.applyHighlightColor(this.currentHighlightColor);
      });
    }

    const highlightColorDropdown = document.getElementById('highlight-color-dropdown');
    const highlightColorPicker = document.getElementById('highlight-color-picker');
    if (highlightColorDropdown && highlightColorPicker) {
      highlightColorDropdown.addEventListener('click', () => {
        highlightColorPicker.click();
      });
    }

    if (highlightColorPicker) {
      highlightColorPicker.addEventListener('change', (e) => {
        this.currentHighlightColor = e.target.value;
        this.updateColorBar('highlight-color-bar', e.target.value);
        this.applyHighlightColor(e.target.value);
      });
    }
  }

  // === PARAGRAPH CONTROLS ===
  initializeParagraphControls() {
    // Lists
    document.getElementById('bullets-btn').addEventListener('click', () => {
      this.execCommand('insertUnorderedList');
    });

    document.getElementById('numbering-btn').addEventListener('click', () => {
      this.execCommand('insertOrderedList');
    });

    // Indentation
    document.getElementById('indent-btn').addEventListener('click', () => {
      this.execCommand('indent');
    });

    document.getElementById('outdent-btn').addEventListener('click', () => {
      this.execCommand('outdent');
    });

    // Alignment
    document.getElementById('align-left-btn').addEventListener('click', () => {
      this.execCommand('justifyLeft');
    });

    document.getElementById('align-center-btn').addEventListener('click', () => {
      this.execCommand('justifyCenter');
    });

    document.getElementById('align-right-btn').addEventListener('click', () => {
      this.execCommand('justifyRight');
    });

    document.getElementById('align-justify-btn').addEventListener('click', () => {
      this.execCommand('justifyFull');
    });

    document.getElementById('line-spacing-btn').addEventListener('click', () => {
      this.toggleLineSpacing();
    });
  }

  // === CLIPBOARD CONTROLS ===
  initializeClipboardControls() {
    const cutBtn = document.getElementById('cut-btn');
    if (cutBtn) {
      cutBtn.addEventListener('click', () => {
        this.handleClipboardOperation('cut');
      });
    }

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.handleClipboardOperation('copy');
      });
    }

    const pasteBtn = document.getElementById('paste-btn');
    if (pasteBtn) {
      pasteBtn.addEventListener('click', () => {
        this.handleClipboardOperation('paste');
      });
    }

    const selectAllBtn = document.getElementById('select-all-btn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        this.execCommand('selectAll');
      });
    }
  }

  // === FILE CONTROLS ===
  initializeFileControls() {





    // File operations
    document.getElementById('new-btn').addEventListener('click', () => {
      this.newDocument();
    });

    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveDocument();
    });

    document.getElementById('open-btn').addEventListener('click', () => {
      this.openDocument();
    });
  }

  // === SEARCH CONTROLS ===
  initializeSearchControls() {
    const findBtn = document.getElementById('find-btn');
    if (findBtn) {
      findBtn.addEventListener('click', () => {
        this.openFindDialog();
      });
    }

    const closeFindDialog = document.getElementById('close-find-dialog');
    if (closeFindDialog) {
      closeFindDialog.addEventListener('click', () => {
        this.closeFindDialog();
      });
    }

    const findNextBtn = document.getElementById('find-next-btn');
    if (findNextBtn) {
      findNextBtn.addEventListener('click', () => {
        this.findNext();
      });
    }

    const findPrevBtn = document.getElementById('find-prev-btn');
    if (findPrevBtn) {
      findPrevBtn.addEventListener('click', () => {
        this.findPrevious();
      });
    }

    const replaceBtn = document.getElementById('replace-btn');
    if (replaceBtn) {
      replaceBtn.addEventListener('click', () => {
        this.replaceCurrent();
      });
    }

    const replaceAllBtn = document.getElementById('replace-all-btn');
    if (replaceAllBtn) {
      replaceAllBtn.addEventListener('click', () => {
        this.replaceAll();
      });
    }

    const findInput = document.getElementById('find-input');
    if (findInput) {
      findInput.addEventListener('input', () => {
        this.performSearch();
      });
    }
  }

  // === TABLE CONTROLS ===
  initializeTableControls() {
    document.getElementById('insert-table-btn').addEventListener('click', () => {
      this.insertTable();
    });

    document.getElementById('table-rows-btn').addEventListener('click', () => {
      this.insertTableRow();
    });

    document.getElementById('table-cols-btn').addEventListener('click', () => {
      this.insertTableColumn();
    });
  }

  // === VIEW CONTROLS ===
  initializeViewControls() {
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
      this.adjustZoom(10);
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
      this.adjustZoom(-10);
    });

    document.getElementById('zoom-reset-btn').addEventListener('click', () => {
      this.setZoom(100);
    });
  }

  // === TAB CONTROLS ===
  initializeTabControls() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });
  }

  // === EDITOR EVENTS ===
  initializeEditorEvents() {

    this.editor.addEventListener('input', () => {
      this.updateStats();
    });

    this.editor.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Update button states when selection changes
    document.addEventListener('selectionchange', () => {
      this.updateButtonStates();
    });
  }

  // === COMMAND EXECUTION ===
  execCommand(command, value = null) {
    document.execCommand(command, false, value);
    this.editor.focus();
    this.updateButtonStates();
  }

  applyTextColor(color) {
    this.execCommand('foreColor', color);
    this.updateColorBar('text-color-bar', color);
  }

  applyHighlightColor(color) {
    this.execCommand('hiliteColor', color);
    this.updateColorBar('highlight-color-bar', color);
  }

  updateColorBar(elementId, color) {
    const colorBar = document.getElementById(elementId);
    if (colorBar) {
      colorBar.style.backgroundColor = color;
    }
  }

  changeFontSize(direction) {
    const sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
    
    // Get current font size from selection or default
    let currentSize;
    try {
      const fontSize = document.queryCommandValue('fontSize');
      currentSize = parseInt(fontSize) || 11;
    } catch (e) {
      currentSize = 11;
    }
    
    // Find closest size in our array
    let currentIndex = sizes.findIndex(size => size >= currentSize);
    if (currentIndex === -1) currentIndex = sizes.length - 1;
    if (sizes[currentIndex] !== currentSize && currentIndex > 0) {
      currentIndex--;
    }
    
    // Calculate new size
    let newIndex;
    if (direction > 0) {
      newIndex = Math.min(currentIndex + 1, sizes.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }
    
    const newSize = sizes[newIndex];
    
    // Apply the new size
    this.execCommand('fontSize', newSize);
    
    // Update the dropdown to reflect the change
    const sizeSelect = document.getElementById('font-size');
    sizeSelect.value = newSize;
  }

  handleClipboardOperation(operation) {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && operation !== 'paste') {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const selectedText = selection.toString();
          if (selectedText) {
            if (operation === 'copy') {
              navigator.clipboard.writeText(selectedText);
              this.showNotification('Text copied to clipboard', 'success');
            } else if (operation === 'cut') {
              navigator.clipboard.writeText(selectedText);
              this.execCommand('delete');
              this.showNotification('Text cut to clipboard', 'success');
            }
            return;
          }
        }
      }
      
      // Fallback to document.execCommand
      const success = this.execCommand(operation);
      if (success !== false) {
        this.showNotification(`${operation.charAt(0).toUpperCase() + operation.slice(1)} operation completed`, 'success');
      } else {
        this.showNotification(`${operation.charAt(0).toUpperCase() + operation.slice(1)} operation failed. Use Ctrl+${operation.charAt(0).toUpperCase()} instead.`, 'error');
      }
    } catch (error) {
      this.showNotification(`Use keyboard shortcuts: Ctrl+C (copy), Ctrl+X (cut), Ctrl+V (paste)`, 'error');
    }
  }

  toggleSubscript() {
    // Clear superscript first if it's active
    if (document.queryCommandState('superscript')) {
      this.execCommand('superscript');
    }
    this.execCommand('subscript');
  }

  toggleSuperscript() {
    // Clear subscript first if it's active
    if (document.queryCommandState('subscript')) {
      this.execCommand('subscript');
    }
    this.execCommand('superscript');
  }

  // === BUTTON STATE UPDATES ===
  updateButtonStates() {
    // Format buttons
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const strikethroughBtn = document.getElementById('strikethrough-btn');
    
    // Alignment buttons
    const alignLeftBtn = document.getElementById('align-left-btn');
    const alignCenterBtn = document.getElementById('align-center-btn');
    const alignRightBtn = document.getElementById('align-right-btn');
    const alignJustifyBtn = document.getElementById('align-justify-btn');

    // Update format button states
    boldBtn.classList.toggle('active', document.queryCommandState('bold'));
    italicBtn.classList.toggle('active', document.queryCommandState('italic'));
    underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
    strikethroughBtn.classList.toggle('active', document.queryCommandState('strikeThrough'));
    
    // Update subscript/superscript buttons if they exist
    const subscriptBtn = document.getElementById('subscript-btn');
    const superscriptBtn = document.getElementById('superscript-btn');
    if (subscriptBtn) subscriptBtn.classList.toggle('active', document.queryCommandState('subscript'));
    if (superscriptBtn) superscriptBtn.classList.toggle('active', document.queryCommandState('superscript'));
    
    // Update list buttons
    const bulletsBtn = document.getElementById('bullets-btn');
    const numberingBtn = document.getElementById('numbering-btn');
    if (bulletsBtn) bulletsBtn.classList.toggle('active', document.queryCommandState('insertUnorderedList'));
    if (numberingBtn) numberingBtn.classList.toggle('active', document.queryCommandState('insertOrderedList'));
    
    // Update alignment button states
    alignLeftBtn.classList.toggle('active', document.queryCommandState('justifyLeft'));
    alignCenterBtn.classList.toggle('active', document.queryCommandState('justifyCenter'));
    alignRightBtn.classList.toggle('active', document.queryCommandState('justifyRight'));
    alignJustifyBtn.classList.toggle('active', document.queryCommandState('justifyFull'));
    
    // Update font controls to show current values
    this.updateFontControls();
  }

  updateFontControls() {
    try {
      const fontFamily = document.queryCommandValue('fontName');
      const fontSize = document.queryCommandValue('fontSize');
      
      if (fontFamily) {
        const fontSelect = document.getElementById('font-family');
        // Clean up font name (remove quotes)
        const cleanFontName = fontFamily.replace(/[\"']/g, '');
        if (fontSelect.querySelector(`option[value=\"${cleanFontName}\"]`)) {
          fontSelect.value = cleanFontName;
        }
      }
      
      if (fontSize) {
        const sizeSelect = document.getElementById('font-size');
        if (sizeSelect.querySelector(`option[value=\"${fontSize}\"]`)) {
          sizeSelect.value = fontSize;
        }
      }
    } catch (e) {
      // Ignore errors from queryCommandValue
    }
  }

  toggleLineSpacing() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const element = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
      
      // Find the closest block element
      let blockElement = element;
      while (blockElement && !this.isBlockElement(blockElement)) {
        blockElement = blockElement.parentNode;
      }
      
      if (blockElement && blockElement !== this.editor) {
        const currentSpacing = blockElement.style.lineHeight;
        if (currentSpacing === '2') {
          blockElement.style.lineHeight = '1.5';
        } else if (currentSpacing === '1.5') {
          blockElement.style.lineHeight = '1';
        } else {
          blockElement.style.lineHeight = '2';
        }
      }
    }
  }

  isBlockElement(element) {
    const blockElements = ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE'];
    return blockElements.includes(element.tagName);
  }

  updateStats() {
    const text = this.editor.textContent || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    this.wordCountEl.textContent = `Words: ${words}`;
    this.charCountEl.textContent = `Characters: ${chars}`;
  }

  // === KEYBOARD SHORTCUTS ===
  handleKeydown(e) {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          this.execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          this.execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          this.execCommand('underline');
          break;
        case 'd':
          e.preventDefault();
          this.execCommand('strikeThrough');
          break;
        case 's':
          e.preventDefault();
          this.saveDocument();
          break;
        case 'n':
          e.preventDefault();
          this.newDocument();
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            this.execCommand('redo');
          } else {
            this.execCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          this.execCommand('redo');
          break;
        case '=':
        case '+':
          e.preventDefault();
          this.adjustZoom(10);
          break;
        case '-':
          e.preventDefault();
          this.adjustZoom(-10);
          break;
        case '0':
          e.preventDefault();
          this.setZoom(100);
          break;
        case 'f':
          e.preventDefault();
          this.openFindDialog();
          break;
      }
    }
  }

  // === FILE OPERATIONS ===
  newDocument() {
    if (confirm('Are you sure you want to create a new document? Unsaved changes will be lost.')) {
      this.editor.innerHTML = '';
      this.updateStats();
    }
  }

  async saveDocument() {
    try {
      const content = this.editor.innerHTML;
      const result = await invoke('save_document', { content });
      this.showNotification('Document saved successfully!', 'success');
      console.log('Document saved:', result);
    } catch (error) {
      this.showNotification('Error saving document: ' + error, 'error');
      console.error('Error saving document:', error);
    }
  }

  async openDocument() {
    try {
      if (this.editor.innerHTML.trim() && !confirm('Are you sure you want to open a new document? Unsaved changes will be lost.')) {
        return;
      }
      
      const content = await invoke('load_document');
      this.editor.innerHTML = content;
      this.updateStats();
      this.showNotification('Document loaded successfully!', 'success');
      console.log('Document loaded');
    } catch (error) {
      this.showNotification('Error loading document: ' + error, 'error');
      console.error('Error loading document:', error);
    }
  }

  showNotification(message, type) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      border-radius: 4px;
      z-index: 1000;
      font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // === ZOOM CONTROLS ===
  adjustZoom(delta) {
    const newZoom = Math.max(25, Math.min(400, this.zoomLevel + delta));
    this.setZoom(newZoom);
  }

  setZoom(level) {
    this.zoomLevel = level;
    this.zoomLevelEl.textContent = `${level}%`;
    
    // Apply zoom to the document page
    const documentPage = document.querySelector('.document-page');
    documentPage.style.transform = `scale(${level / 100})`;
    documentPage.style.transformOrigin = 'top center';
    
    // Adjust container to prevent clipping
    const container = document.querySelector('.editor-container');
    container.style.paddingTop = level > 100 ? `${(level - 100) * 0.5}px` : '20px';
    container.style.paddingBottom = level > 100 ? `${(level - 100) * 0.5}px` : '20px';
  }

  // === FIND & REPLACE ===
  openFindDialog() {
    const dialog = document.getElementById('find-replace-dialog');
    dialog.classList.remove('hidden');
    document.getElementById('find-input').focus();
  }

  closeFindDialog() {
    const dialog = document.getElementById('find-replace-dialog');
    dialog.classList.add('hidden');
    this.clearSearchHighlights();
  }

  performSearch() {
    const searchText = document.getElementById('find-input').value;
    const matchCase = document.getElementById('match-case').checked;
    const wholeWord = document.getElementById('whole-word').checked;

    this.clearSearchHighlights();
    this.currentSearchResults = [];
    this.currentSearchIndex = -1;

    if (!searchText) return;

    const content = this.editor.innerHTML;
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach((textNode, nodeIndex) => {
      const text = textNode.textContent;
      let searchPattern = matchCase ? searchText : searchText.toLowerCase();
      let nodeText = matchCase ? text : text.toLowerCase();

      if (wholeWord) {
        searchPattern = `\\b${searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`;
        const regex = new RegExp(searchPattern, 'g');
        let match;
        while ((match = regex.exec(nodeText)) !== null) {
          this.currentSearchResults.push({
            node: textNode,
            start: match.index,
            end: match.index + searchText.length
          });
        }
      } else {
        let index = 0;
        while ((index = nodeText.indexOf(searchPattern, index)) !== -1) {
          this.currentSearchResults.push({
            node: textNode,
            start: index,
            end: index + searchText.length
          });
          index++;
        }
      }
    });

    this.highlightSearchResults();
    if (this.currentSearchResults.length > 0) {
      this.currentSearchIndex = 0;
      this.scrollToCurrentResult();
    }
  }

  highlightSearchResults() {
    this.currentSearchResults.forEach((result, index) => {
      const range = document.createRange();
      range.setStart(result.node, result.start);
      range.setEnd(result.node, result.end);

      const span = document.createElement('span');
      span.className = index === this.currentSearchIndex ? 'search-highlight current' : 'search-highlight';
      span.appendChild(range.extractContents());
      range.insertNode(span);
    });
  }

  clearSearchHighlights() {
    const highlights = this.editor.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      parent.insertBefore(document.createTextNode(highlight.textContent), highlight);
      parent.removeChild(highlight);
      parent.normalize();
    });
  }

  findNext() {
    if (this.currentSearchResults.length === 0) {
      this.performSearch();
      return;
    }

    this.currentSearchIndex = (this.currentSearchIndex + 1) % this.currentSearchResults.length;
    this.updateHighlights();
    this.scrollToCurrentResult();
  }

  findPrevious() {
    if (this.currentSearchResults.length === 0) {
      this.performSearch();
      return;
    }

    this.currentSearchIndex = this.currentSearchIndex <= 0 
      ? this.currentSearchResults.length - 1 
      : this.currentSearchIndex - 1;
    this.updateHighlights();
    this.scrollToCurrentResult();
  }

  updateHighlights() {
    const highlights = this.editor.querySelectorAll('.search-highlight');
    highlights.forEach((highlight, index) => {
      highlight.className = index === this.currentSearchIndex ? 'search-highlight current' : 'search-highlight';
    });
  }

  scrollToCurrentResult() {
    if (this.currentSearchIndex >= 0 && this.currentSearchResults.length > 0) {
      const currentHighlight = this.editor.querySelector('.search-highlight.current');
      if (currentHighlight) {
        currentHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  replaceCurrent() {
    if (this.currentSearchIndex < 0 || this.currentSearchResults.length === 0) return;

    const replaceText = document.getElementById('replace-input').value;
    const currentHighlight = this.editor.querySelector('.search-highlight.current');
    
    if (currentHighlight) {
      currentHighlight.textContent = replaceText;
      currentHighlight.className = 'replaced-text';
      
      // Refresh search results
      setTimeout(() => {
        this.performSearch();
      }, 100);
    }
  }

  replaceAll() {
    const replaceText = document.getElementById('replace-input').value;
    const searchText = document.getElementById('find-input').value;
    
    if (!searchText) return;

    let count = 0;
    const highlights = this.editor.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
      highlight.textContent = replaceText;
      highlight.className = 'replaced-text';
      count++;
    });

    this.showNotification(`Replaced ${count} occurrence(s)`, 'success');
    this.clearSearchHighlights();
    this.currentSearchResults = [];
    this.currentSearchIndex = -1;
  }

  // === TAB MANAGEMENT ===
  switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  // === TABLE OPERATIONS ===
  insertTable() {
    const rows = prompt('Number of rows (1-10):', '3');
    const cols = prompt('Number of columns (1-10):', '3');
    
    if (!rows || !cols || isNaN(rows) || isNaN(cols)) return;
    
    const numRows = Math.max(1, Math.min(10, parseInt(rows)));
    const numCols = Math.max(1, Math.min(10, parseInt(cols)));
    
    let tableHTML = '<table class="wryte-table" border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
    
    for (let i = 0; i < numRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < numCols; j++) {
        tableHTML += '<td style="border: 1px solid #ccc; padding: 8px; min-width: 100px; min-height: 30px;">&nbsp;</td>';
      }
      tableHTML += '</tr>';
    }
    
    tableHTML += '</table>';
    
    // Insert table at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const tableNode = document.createElement('div');
      tableNode.innerHTML = tableHTML;
      range.insertNode(tableNode.firstChild);
      range.collapse(false);
    }
    
    this.showNotification(`Inserted ${numRows}x${numCols} table`, 'success');
  }

  insertTableRow() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.showNotification('Please place cursor in a table to insert a row', 'error');
      return;
    }

    const range = selection.getRangeAt(0);
    const cell = this.findParentElement(range.startContainer, 'TD');
    if (!cell) {
      this.showNotification('Please place cursor in a table cell', 'error');
      return;
    }

    const row = cell.parentNode;
    const colCount = row.cells.length;

    // Create new row
    const newRow = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
      const newCell = document.createElement('td');
      newCell.style.cssText = 'border: 1px solid #ccc; padding: 8px; min-width: 100px; min-height: 30px;';
      newCell.innerHTML = '&nbsp;';
      newRow.appendChild(newCell);
    }

    // Insert row after current row
    row.parentNode.insertBefore(newRow, row.nextSibling);
    this.showNotification('Row inserted successfully', 'success');
  }

  insertTableColumn() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.showNotification('Please place cursor in a table to insert a column', 'error');
      return;
    }

    const range = selection.getRangeAt(0);
    const cell = this.findParentElement(range.startContainer, 'TD');
    if (!cell) {
      this.showNotification('Please place cursor in a table cell', 'error');
      return;
    }

    const cellIndex = Array.from(cell.parentNode.cells).indexOf(cell);
    const table = this.findParentElement(cell, 'TABLE');

    // Insert column in all rows
    Array.from(table.rows).forEach(row => {
      const newCell = document.createElement('td');
      newCell.style.cssText = 'border: 1px solid #ccc; padding: 8px; min-width: 100px; min-height: 30px;';
      newCell.innerHTML = '&nbsp;';
      
      if (cellIndex + 1 < row.cells.length) {
        row.insertBefore(newCell, row.cells[cellIndex + 1]);
      } else {
        row.appendChild(newCell);
      }
    });

    this.showNotification('Column inserted successfully', 'success');
  }

  findParentElement(node, tagName) {
    let current = node;
    while (current && current !== this.editor) {
      if (current.tagName === tagName) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  }
}

// Initialize the editor when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WryteEditor();
});

// Test Tauri functionality
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const message = await invoke('greet', { name: 'Wryte User' });
    console.log(message);
  } catch (error) {
    console.error('Error:', error);
  }
});