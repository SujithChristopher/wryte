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
    
    // Document structure
    this.currentPage = 1;
    this.documentWrapper = document.querySelector('.document-wrapper');
    this.pageHeight = 11; // inches
    
    // Search functionality
    this.currentSearchResults = [];
    this.currentSearchIndex = -1;
    
    // Color state
    this.currentTextColor = '#000000';
    this.currentHighlightColor = '#ffff00';
    
    // Spell checking state
    this.spellCheckEnabled = true;
    this.customDictionary = new Set();
    this.ignoredWords = new Set();
    
    this.initializeEventListeners();
    this.updateStats();
  }

  initializeEventListeners() {
    this.initializeFormattingControls();
    this.initializeFontControls();
    this.initializeParagraphControls();
    this.initializeClipboardControls();
    this.initializeStylesControls();
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

  // === STYLES CONTROLS ===
  initializeStylesControls() {
    document.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const style = e.target.dataset.style;
        this.applyStyle(style);
      });
    });
  }

  applyStyle(styleName) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let element;

    if (range.collapsed) {
      // No selection - apply to current block
      element = this.findParentBlock(range.startContainer);
    } else {
      // Has selection - wrap in new element
      element = this.wrapSelection(range);
    }

    if (element) {
      this.clearElementStyles(element);
      this.applyStyleToElement(element, styleName);
      this.updateStyleButtons();
    }
  }

  findParentBlock(node) {
    const blockElements = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    let current = node;

    while (current && current !== this.editor) {
      if (current.nodeType === Node.ELEMENT_NODE && blockElements.includes(current.tagName)) {
        return current;
      }
      current = current.parentNode;
    }

    // Create a new paragraph if none found
    const p = document.createElement('p');
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentNode;
      parent.insertBefore(p, node);
      p.appendChild(node);
    }
    return p;
  }

  wrapSelection(range) {
    const p = document.createElement('p');
    try {
      p.appendChild(range.extractContents());
      range.insertNode(p);
      return p;
    } catch (e) {
      return null;
    }
  }

  clearElementStyles(element) {
    element.className = '';
    element.style.cssText = '';
  }

  applyStyleToElement(element, styleName) {
    const styles = {
      normal: {
        tagName: 'P',
        styles: {
          fontFamily: 'Times New Roman, serif',
          fontSize: '14px',
          fontWeight: 'normal',
          color: '#333',
          textAlign: 'left',
          lineHeight: '1.6'
        }
      },
      heading1: {
        tagName: 'H1',
        styles: {
          fontFamily: 'Times New Roman, serif',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2e4a6b',
          marginBottom: '12px',
          marginTop: '24px'
        }
      },
      heading2: {
        tagName: 'H2',
        styles: {
          fontFamily: 'Times New Roman, serif',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#2e4a6b',
          marginBottom: '10px',
          marginTop: '18px'
        }
      },
      title: {
        tagName: 'H1',
        styles: {
          fontFamily: 'Times New Roman, serif',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#000',
          textAlign: 'center',
          marginBottom: '24px',
          marginTop: '0'
        }
      }
    };

    const style = styles[styleName] || styles.normal;
    
    // Change tag name if needed
    if (element.tagName !== style.tagName) {
      const newElement = document.createElement(style.tagName);
      newElement.innerHTML = element.innerHTML;
      element.parentNode.replaceChild(newElement, element);
      element = newElement;
    }

    // Apply styles
    Object.assign(element.style, style.styles);
    element.className = `style-${styleName}`;

    return element;
  }

  updateStyleButtons() {
    const buttons = document.querySelectorAll('.style-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const element = this.findParentBlock(selection.getRangeAt(0).startContainer);
      if (element && element.className) {
        const styleMatch = element.className.match(/style-(\w+)/);
        if (styleMatch) {
          const btn = document.querySelector(`[data-style="${styleMatch[1]}"]`);
          if (btn) btn.classList.add('active');
        }
      }
    }
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

    // Export controls
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this.exportToPDF();
      });
    }

    const exportTxtBtn = document.getElementById('export-txt-btn');
    if (exportTxtBtn) {
      exportTxtBtn.addEventListener('click', () => {
        this.exportToText();
      });
    }

    const exportHtmlBtn = document.getElementById('export-html-btn');
    if (exportHtmlBtn) {
      exportHtmlBtn.addEventListener('click', () => {
        this.exportToHTML();
      });
    }

    // Collaborative controls
    const addCommentBtn = document.getElementById('add-comment-btn');
    if (addCommentBtn) {
      addCommentBtn.addEventListener('click', () => {
        this.addComment();
      });
    }

    const trackChangesBtn = document.getElementById('track-changes-btn');
    if (trackChangesBtn) {
      trackChangesBtn.addEventListener('click', () => {
        this.toggleTrackChanges();
      });
    }

    const showCommentsBtn = document.getElementById('show-comments-btn');
    if (showCommentsBtn) {
      showCommentsBtn.addEventListener('click', () => {
        this.toggleShowComments();
      });
    }
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

    // Print controls
    const printPreviewBtn = document.getElementById('print-preview-btn');
    if (printPreviewBtn) {
      printPreviewBtn.addEventListener('click', () => {
        this.openPrintPreview();
      });
    }

    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        this.printDocument();
      });
    }

    const pageSetupBtn = document.getElementById('page-setup-btn');
    if (pageSetupBtn) {
      pageSetupBtn.addEventListener('click', () => {
        this.openPageSetup();
      });
    }

    // Spell checking controls
    const spellCheckBtn = document.getElementById('spell-check-btn');
    if (spellCheckBtn) {
      spellCheckBtn.addEventListener('click', () => {
        this.toggleSpellCheck();
      });
    }

    const ignoreAllBtn = document.getElementById('ignore-all-btn');
    if (ignoreAllBtn) {
      ignoreAllBtn.addEventListener('click', () => {
        this.ignoreAllSpellingErrors();
      });
    }

    const addToDictBtn = document.getElementById('add-to-dict-btn');
    if (addToDictBtn) {
      addToDictBtn.addEventListener('click', () => {
        this.addSelectedWordToDictionary();
      });
    }
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
      this.checkForPageBreak();
      this.updatePageNumbers();
    });

    this.editor.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Update button states when selection changes
    document.addEventListener('selectionchange', () => {
      this.updateButtonStates();
      this.updatePageNumbers();
    });
  }

  // === COMMAND EXECUTION ===
  execCommand(command, value = null) {
    document.execCommand(command, false, value);
    this.editor.focus();
    this.updateButtonStates();
  }

  applyTextColor(color) {
    // Ensure editor is focused
    this.editor.focus();
    
    // Use a more reliable method for text color
    try {
      // Try the standard command first
      if (!document.execCommand('foreColor', false, color)) {
        // Fallback: wrap selection in span with style
        this.wrapSelectionWithStyle('color', color);
      }
    } catch (e) {
      // Fallback method
      this.wrapSelectionWithStyle('color', color);
    }
    
    this.updateColorBar('text-color-bar', color);
  }

  applyHighlightColor(color) {
    // Ensure editor is focused
    this.editor.focus();
    
    try {
      // Try hiliteColor first, then backColor as fallback
      if (!document.execCommand('hiliteColor', false, color)) {
        if (!document.execCommand('backColor', false, color)) {
          this.wrapSelectionWithStyle('background-color', color);
        }
      }
    } catch (e) {
      this.wrapSelectionWithStyle('background-color', color);
    }
    
    this.updateColorBar('highlight-color-bar', color);
  }

  wrapSelectionWithStyle(property, value) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement('span');
        span.style[property] = value;
        
        try {
          span.appendChild(range.extractContents());
          range.insertNode(span);
        } catch (e) {
          console.warn('Could not apply style:', e);
        }
      }
    }
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
    this.editor.focus();
    
    try {
      // Clear superscript first if it's active
      if (document.queryCommandState('superscript')) {
        this.execCommand('superscript');
      }
      
      // Try execCommand first
      if (!this.execCommand('subscript')) {
        // Fallback: manual implementation
        this.toggleVerticalAlign('sub');
      }
    } catch (e) {
      this.toggleVerticalAlign('sub');
    }
  }

  toggleSuperscript() {
    this.editor.focus();
    
    try {
      // Clear subscript first if it's active
      if (document.queryCommandState('subscript')) {
        this.execCommand('subscript');
      }
      
      // Try execCommand first
      if (!this.execCommand('superscript')) {
        // Fallback: manual implementation
        this.toggleVerticalAlign('super');
      }
    } catch (e) {
      this.toggleVerticalAlign('super');
    }
  }

  toggleVerticalAlign(alignType) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const selectedContent = range.extractContents();
        
        // Create appropriate element
        const element = alignType === 'sub' ? document.createElement('sub') : document.createElement('sup');
        element.appendChild(selectedContent);
        
        try {
          range.insertNode(element);
          
          // Restore selection after the inserted element
          range.setStartAfter(element);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          console.warn('Could not apply vertical alignment:', e);
        }
      }
    }
  }

  // === DOCUMENT STRUCTURE ===
  createNewPage() {
    this.currentPage++;
    const newPage = document.createElement('div');
    newPage.className = 'document-page';
    newPage.id = `page-${this.currentPage}`;
    
    newPage.innerHTML = `
      <div class="page-header" contenteditable="true" placeholder="Header"></div>
      <div class="editor-page" contenteditable="true"></div>
      <div class="page-footer" contenteditable="true" placeholder="Footer"></div>
    `;
    
    this.documentWrapper.appendChild(newPage);
    return newPage;
  }

  checkForPageBreak() {
    const editorHeight = this.editor.scrollHeight;
    const maxHeight = (this.pageHeight - 2) * 96; // Convert inches to pixels (96 DPI) minus margins
    
    if (editorHeight > maxHeight) {
      this.createNewPage();
    }
  }

  updatePageNumbers() {
    const pages = document.querySelectorAll('.document-page');
    const totalPages = pages.length;
    
    pages.forEach((page, index) => {
      const pageNumber = index + 1;
      const footer = page.querySelector('.page-footer');
      if (footer && footer.textContent.trim() === '') {
        footer.innerHTML = `Page ${pageNumber} of ${totalPages}`;
      }
    });
    
    // Update status bar
    const statusPageInfo = document.querySelector('.status-bar span:last-child');
    if (statusPageInfo) {
      statusPageInfo.textContent = `Page ${this.getCurrentPageNumber()} of ${totalPages}`;
    }
  }

  getCurrentPageNumber() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let currentElement = range.startContainer;
      
      while (currentElement && !currentElement.classList?.contains('document-page')) {
        currentElement = currentElement.parentNode;
      }
      
      if (currentElement) {
        const pageId = currentElement.id;
        const pageNum = pageId.replace('page-', '');
        return parseInt(pageNum) || 1;
      }
    }
    return 1;
  }

  // === PRINT FUNCTIONALITY ===
  printDocument() {
    // Prepare document for printing
    const originalTitle = document.title;
    document.title = 'Wryte Document - Print';
    
    // Apply print styles
    document.body.classList.add('printing');
    
    try {
      window.print();
    } finally {
      // Restore after printing
      document.body.classList.remove('printing');
      document.title = originalTitle;
    }
  }

  openPrintPreview() {
    // Create print preview modal
    const modal = this.createPrintPreviewModal();
    document.body.appendChild(modal);
  }

  createPrintPreviewModal() {
    const modal = document.createElement('div');
    modal.className = 'print-preview-modal';
    modal.innerHTML = `
      <div class="print-preview-content">
        <div class="print-preview-header">
          <h3>Print Preview</h3>
          <div class="print-preview-controls">
            <button id="print-preview-print">Print</button>
            <button id="print-preview-close">Close</button>
          </div>
        </div>
        <div class="print-preview-body">
          <div class="print-preview-pages">
            ${this.generatePrintPreview()}
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('#print-preview-print').addEventListener('click', () => {
      modal.remove();
      this.printDocument();
    });

    modal.querySelector('#print-preview-close').addEventListener('click', () => {
      modal.remove();
    });

    return modal;
  }

  generatePrintPreview() {
    const pages = document.querySelectorAll('.document-page');
    let previewHTML = '';
    
    pages.forEach(page => {
      previewHTML += `
        <div class="print-preview-page">
          ${page.outerHTML}
        </div>
      `;
    });
    
    return previewHTML;
  }

  openPageSetup() {
    alert('Page Setup functionality would integrate with the browser\'s print settings.\nUse your browser\'s print dialog (Ctrl+P) to configure page settings.');
  }

  // === SPELL CHECKING ===
  toggleSpellCheck() {
    this.spellCheckEnabled = !this.spellCheckEnabled;
    const btn = document.getElementById('spell-check-btn');
    
    if (this.spellCheckEnabled) {
      btn.classList.add('active');
      this.editor.setAttribute('spellcheck', 'true');
      this.showNotification('Spell check enabled', 'success');
    } else {
      btn.classList.remove('active');
      this.editor.setAttribute('spellcheck', 'false');
      this.showNotification('Spell check disabled', 'success');
    }
  }

  ignoreAllSpellingErrors() {
    const misspelledWords = this.editor.querySelectorAll('[spellcheck="false"]');
    let count = 0;
    
    misspelledWords.forEach(element => {
      const word = element.textContent.trim().toLowerCase();
      if (word) {
        this.ignoredWords.add(word);
        element.style.textDecoration = 'none';
        count++;
      }
    });
    
    if (count > 0) {
      this.showNotification(`Ignored ${count} spelling errors`, 'success');
    } else {
      this.showNotification('No spelling errors found to ignore', 'info');
    }
  }

  addSelectedWordToDictionary() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.showNotification('Please select a word to add to dictionary', 'error');
      return;
    }

    const selectedText = selection.toString().trim().toLowerCase();
    if (selectedText) {
      this.customDictionary.add(selectedText);
      this.showNotification(`"${selectedText}" added to personal dictionary`, 'success');
      
      // Remove spelling error styling from all instances
      this.removeSpellingErrorsForWord(selectedText);
    } else {
      this.showNotification('Please select a word to add to dictionary', 'error');
    }
  }

  removeSpellingErrorsForWord(word) {
    const walker = document.createTreeWalker(
      this.editor,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.toLowerCase().includes(word)) {
        const parent = node.parentElement;
        if (parent && parent.style.textDecoration === 'underline wavy red') {
          parent.style.textDecoration = 'none';
        }
      }
    }
  }

  // === EXPORT FUNCTIONALITY ===
  exportToPDF() {
    // Use browser's built-in PDF export
    const originalTitle = document.title;
    document.title = 'Wryte Document';
    
    // Apply print styles
    document.body.classList.add('printing');
    
    // Show print dialog which can save as PDF
    try {
      window.print();
      this.showNotification('Use "Save as PDF" in the print dialog to export as PDF', 'info');
    } finally {
      document.body.classList.remove('printing');
      document.title = originalTitle;
    }
  }

  exportToText() {
    const textContent = this.editor.textContent || '';
    const blob = new Blob([textContent], { type: 'text/plain' });
    this.downloadFile(blob, 'wryte-document.txt');
  }

  exportToHTML() {
    const pages = document.querySelectorAll('.document-page');
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wryte Document</title>
  <style>
    body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; }
    .page { page-break-after: always; margin-bottom: 40px; }
    .page:last-child { page-break-after: avoid; }
    .page-header { border-bottom: 1px solid #ccc; margin-bottom: 20px; padding-bottom: 10px; font-size: 10px; color: #666; text-align: center; }
    .page-footer { border-top: 1px solid #ccc; margin-top: 20px; padding-top: 10px; font-size: 10px; color: #666; text-align: center; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    td { border: 1px solid #ccc; padding: 8px; }
  </style>
</head>
<body>
`;

    pages.forEach((page, index) => {
      const header = page.querySelector('.page-header').innerHTML;
      const content = page.querySelector('.editor').innerHTML;
      const footer = page.querySelector('.page-footer').innerHTML;
      
      htmlContent += `
  <div class="page">
    <div class="page-header">${header}</div>
    <div class="page-content">${content}</div>
    <div class="page-footer">${footer}</div>
  </div>
`;
    });

    htmlContent += `
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    this.downloadFile(blob, 'wryte-document.html');
  }

  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification(`${filename} downloaded successfully`, 'success');
  }

  // === COLLABORATIVE FEATURES ===
  addComment() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || selection.toString().trim() === '') {
      this.showNotification('Please select text to comment on', 'error');
      return;
    }

    const commentText = prompt('Enter your comment:');
    if (!commentText || commentText.trim() === '') return;

    const range = selection.getRangeAt(0);
    const commentId = 'comment-' + Date.now();
    
    // Wrap selected text with comment span
    const commentSpan = document.createElement('span');
    commentSpan.className = 'commented-text';
    commentSpan.setAttribute('data-comment-id', commentId);
    commentSpan.setAttribute('data-comment', commentText);
    commentSpan.setAttribute('title', `Comment: ${commentText}`);
    commentSpan.style.backgroundColor = '#fff2cc';
    commentSpan.style.borderLeft = '3px solid #f1c40f';
    commentSpan.style.paddingLeft = '2px';
    commentSpan.style.cursor = 'help';
    
    try {
      commentSpan.appendChild(range.extractContents());
      range.insertNode(commentSpan);
      this.showNotification('Comment added successfully', 'success');
    } catch (e) {
      this.showNotification('Could not add comment', 'error');
    }
  }

  toggleTrackChanges() {
    const btn = document.getElementById('track-changes-btn');
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
      btn.classList.remove('active');
      this.showNotification('Track changes disabled', 'success');
    } else {
      btn.classList.add('active');
      this.showNotification('Track changes enabled - changes will be highlighted', 'success');
      
      // Add mutation observer for tracking changes
      this.startTrackingChanges();
    }
  }

  startTrackingChanges() {
    if (this.changeObserver) {
      this.changeObserver.disconnect();
    }

    this.changeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              this.highlightChange(node, 'added');
            }
          });
        }
      });
    });

    this.changeObserver.observe(this.editor, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  highlightChange(node, type) {
    const span = document.createElement('span');
    span.className = `tracked-${type}`;
    span.style.backgroundColor = type === 'added' ? '#c8e6c9' : '#ffcdd2';
    span.style.borderLeft = `2px solid ${type === 'added' ? '#4caf50' : '#f44336'}`;
    
    if (node.parentNode && node.nodeType === Node.TEXT_NODE) {
      node.parentNode.insertBefore(span, node);
      span.appendChild(node);
    }
  }

  toggleShowComments() {
    const btn = document.getElementById('show-comments-btn');
    const comments = document.querySelectorAll('.commented-text');
    const isActive = btn.classList.contains('active');
    
    if (isActive) {
      btn.classList.remove('active');
      comments.forEach(comment => {
        comment.style.backgroundColor = '';
        comment.style.borderLeft = '';
      });
      this.showNotification('Comments hidden', 'success');
    } else {
      btn.classList.add('active');
      comments.forEach(comment => {
        comment.style.backgroundColor = '#fff2cc';
        comment.style.borderLeft = '3px solid #f1c40f';
      });
      this.showNotification('Comments shown', 'success');
    }
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
    
    // Update style buttons
    this.updateStyleButtons();
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
        case 'p':
          e.preventDefault();
          this.printDocument();
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