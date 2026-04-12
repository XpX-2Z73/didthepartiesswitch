/**
 * Immersive Storytelling JavaScript
 * Scroll-driven animations, progress tracking, and chapter navigation
 */

(function() {
  'use strict';

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // If user prefers reduced motion, skip animations — make everything visible immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Once revealed, stop observing for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
      }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // ============================================
  // PROGRESS BAR
  // ============================================
  function initProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (!progressFill) return;

    let ticking = false;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.width = progress + '%';
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    // Initial call
    updateProgress();
  }

  // ============================================
  // HERO PARALLAX (SUBTLE)
  // ============================================
  function initHeroParallax() {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const hero = document.querySelector('.hero');
    const heroContent = hero ? hero.querySelector('.hero__content-wrapper') : null;
    const scrollPrompt = hero ? hero.querySelector('.scroll-prompt') : null;
    if (!hero || !heroContent) return;

    let ticking = false;

    function updateParallax() {
      const scrollTop = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollTop < heroHeight) {
        const opacity = 1 - (scrollTop / heroHeight) * 0.8;
        const translateY = scrollTop * 0.3;
        hero.style.opacity = Math.max(0, opacity);
        // Apply parallax to entire content wrapper, not just title
        heroContent.style.transform = `translateY(${translateY}px)`;

        // Fade out scroll prompt faster so it disappears before overlapping with buttons
        if (scrollPrompt) {
          const promptOpacity = 1 - (scrollTop / (heroHeight * 0.15));
          scrollPrompt.style.opacity = Math.max(0, promptOpacity);
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // CSV DOWNLOAD
  // ============================================
  function initCSVDownload() {
    const downloadButton = document.getElementById('download-csv');
    if (!downloadButton) return;

    downloadButton.addEventListener('click', () => {
      const table = document.getElementById('election-table');
      if (!table) return;

      const rows = [];
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
      rows.push(headers);

      table.querySelectorAll('tbody tr').forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
        rows.push(cells);
      });

      const csv = rows
        .map(row => row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(','))
        .join('\r\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'civil-war-election-data.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // ============================================
  // BINGO CARD GENERATION
  // ============================================

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function generateBingoCard() {
    const bingoGrid = document.getElementById('bingo-grid');
    if (!bingoGrid || !window.allBingoSquares) return;

    // Separate free-space from other squares
    const freeSpace = window.allBingoSquares.find(s => s.id === 'free-space');
    const otherSquares = window.allBingoSquares.filter(s => s.id !== 'free-space');

    // Shuffle and pick 24 random squares
    const shuffled = shuffleArray(otherSquares);
    const selected = shuffled.slice(0, 24);

    // Insert free-space at position 12 (center of 5x5 grid)
    const cardSquares = [...selected.slice(0, 12), freeSpace, ...selected.slice(12)];

    // Clear existing grid
    bingoGrid.innerHTML = '';

    // Render the 25 squares
    cardSquares.forEach(square => {
      const button = document.createElement('button');
      button.className = 'bingo-cell' + (square.id === 'free-space' ? ' free-space' : '');
      button.dataset.id = square.id;
      button.dataset.myth = square.myth;
      button.dataset.rebuttal = square.rebuttal;
      button.dataset.quote = square.quote;
      button.dataset.source = square.source;
      button.dataset.sourceUrl = square.sourceUrl;

      if (square.contentWarning) {
        button.dataset.contentWarning = 'true';
        button.dataset.warningText = square.warningText;
      }

      button.setAttribute('aria-label',
        square.id === 'free-space'
          ? 'Free space - automatically marked'
          : `Click to learn about: ${square.myth}`
      );
      button.setAttribute('role', 'gridcell');
      // aria-selected communicates marked state within the grid context
      button.setAttribute('aria-selected', square.id === 'free-space' ? 'true' : 'false');

      button.innerHTML = `
        <span class="bingo-cell__text">${square.myth}</span>
        <span class="bingo-cell__hint">Click for response</span>
      `;

      bingoGrid.appendChild(button);
    });
  }

  function initBingoCard() {
    const shuffleBtn = document.getElementById('shuffle-bingo');

    // Generate initial card
    generateBingoCard();

    // Shuffle button
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', () => {
        generateBingoCard();
      });
    }
  }

  // ============================================
  // BINGO INTERACTION WITH MODAL
  // ============================================
  let currentBingoCell = null;

  function initBingoInteraction() {
    const bingoGrid = document.querySelector('.bingo-grid');
    const claimsList = document.querySelector('.claims-list');
    const modal = document.getElementById('rebuttal-modal');
    if (!modal) return;

    // Get modal elements
    const modalBackdrop = modal.querySelector('.rebuttal-modal__backdrop');
    const modalClose = modal.querySelector('.rebuttal-modal__close');
    const modalMythEl = document.getElementById('modal-myth');
    const modalRebuttalEl = document.getElementById('modal-rebuttal');
    const modalQuoteEl = document.getElementById('modal-quote');
    const modalSourceEl = document.getElementById('modal-source');
    const modalSourceLink = document.getElementById('modal-source-link');
    const modalMarkBtn = document.getElementById('modal-mark');
    const modalContentWarning = document.getElementById('modal-content-warning');
    const modalWarningText = document.getElementById('modal-warning-text');

    // Helper function to populate and open modal
    function showClaimModal(element, isBingoCell) {
      if (isBingoCell) {
        currentBingoCell = element;
      } else {
        currentBingoCell = null;
      }

      // Get data from element
      const myth = element.dataset.myth;
      const rebuttal = element.dataset.rebuttal;
      const quote = element.dataset.quote;
      const source = element.dataset.source;
      const sourceUrl = element.dataset.sourceUrl;
      const contentWarning = element.dataset.contentWarning;
      const warningText = element.dataset.warningText;

      // Populate modal
      modalMythEl.textContent = myth;
      modalRebuttalEl.textContent = rebuttal;
      modalQuoteEl.textContent = `"${quote}"`;
      modalSourceEl.textContent = `— ${source}`;
      modalSourceLink.href = sourceUrl;

      // Handle content warning
      if (contentWarning && modalContentWarning && modalWarningText) {
        modalWarningText.textContent = warningText;
        modalContentWarning.style.display = 'flex';
      } else if (modalContentWarning) {
        modalContentWarning.style.display = 'none';
      }

      // Update mark button visibility/text based on context
      if (!isBingoCell || element.classList.contains('free-space')) {
        modalMarkBtn.style.display = 'none';
      } else if (element.classList.contains('marked')) {
        modalMarkBtn.textContent = 'Unmark Square';
        modalMarkBtn.style.display = '';
      } else {
        modalMarkBtn.textContent = 'Mark Square';
        modalMarkBtn.style.display = '';
      }

      // Show modal
      openModal(modal);
    }

    // Click on bingo cell - open modal
    if (bingoGrid) {
      bingoGrid.addEventListener('click', (e) => {
        const cell = e.target.closest('.bingo-cell');
        if (!cell) return;
        showClaimModal(cell, true);
      });
    }

    // Click on claims list item - open modal
    if (claimsList) {
      claimsList.addEventListener('click', (e) => {
        const item = e.target.closest('.bingo-cell-trigger');
        if (!item) return;
        showClaimModal(item, false);
      });
    }

    // Close modal on backdrop click
    modalBackdrop.addEventListener('click', () => {
      closeModal(modal);
    });

    // Close modal on close button click
    modalClose.addEventListener('click', () => {
      closeModal(modal);
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal(modal);
      }
    });

    // Close modal when clicking outside the modal content
    document.addEventListener('click', (e) => {
      if (!modal.classList.contains('is-open')) return;

      const modalContent = modal.querySelector('.rebuttal-modal__content');
      // If click is outside modal content and not on a bingo cell or claims list item, close modal
      if (!modalContent.contains(e.target) &&
          !e.target.closest('.bingo-cell') &&
          !e.target.closest('.bingo-cell-trigger')) {
        closeModal(modal);
      }
    });

    // Mark square button
    modalMarkBtn.addEventListener('click', () => {
      if (currentBingoCell && !currentBingoCell.classList.contains('free-space')) {
        currentBingoCell.classList.toggle('marked');
        const isMarked = currentBingoCell.classList.contains('marked');

        // Sync aria-selected so screen readers know the cell is marked
        currentBingoCell.setAttribute('aria-selected', isMarked ? 'true' : 'false');

        // Update button text
        modalMarkBtn.textContent = isMarked ? 'Unmark Square' : 'Mark Square';

        // Check for bingo
        checkBingo(bingoGrid);
      }
    });
  }

  function openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const focusableElements = modal.querySelectorAll('button, a[href]');
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the cell that opened the modal
    if (currentBingoCell) {
      currentBingoCell.focus();
    }
  }

  function checkBingo(grid) {
    const cells = Array.from(grid.querySelectorAll('.bingo-cell'));
    const size = 5;

    // Create a 2D array of marked status
    const marked = cells.map(cell =>
      cell.classList.contains('marked') || cell.classList.contains('free-space')
    );

    // Check rows
    for (let i = 0; i < size; i++) {
      if (marked.slice(i * size, (i + 1) * size).every(Boolean)) {
        celebrateBingo();
        return;
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      const col = [];
      for (let j = 0; j < size; j++) {
        col.push(marked[j * size + i]);
      }
      if (col.every(Boolean)) {
        celebrateBingo();
        return;
      }
    }

    // Check diagonals
    const diag1 = [0, 6, 12, 18, 24].map(i => marked[i]);
    const diag2 = [4, 8, 12, 16, 20].map(i => marked[i]);

    if (diag1.every(Boolean) || diag2.every(Boolean)) {
      celebrateBingo();
    }
  }

  // celebrateBingo is defined later with confetti support

  // ============================================
  // STATE REALIGNMENT MODAL
  // ============================================
  let currentStateTile = null;

  function initStateModal() {
    const stateTiles = document.querySelectorAll('.state-tile--interactive');
    const modal = document.getElementById('state-modal');
    if (!stateTiles.length || !modal) return;

    // Get modal elements
    const modalBackdrop = modal.querySelector('.state-modal__backdrop');
    const modalClose = modal.querySelector('.state-modal__close');
    const modalAbbr = document.getElementById('modal-state-abbr');
    const modalStateName = document.getElementById('modal-state-name');
    const modalHeadline = document.getElementById('modal-headline');
    const modalFlipYear = document.getElementById('modal-flip-year');
    const modalKeyFigure = document.getElementById('modal-key-figure');
    const modalKeyFigureRole = document.getElementById('modal-key-figure-role');
    const modalSummary = document.getElementById('modal-summary');
    const modalQuote = document.getElementById('modal-quote');
    const modalQuoteAttribution = document.getElementById('modal-quote-attribution');
    const modalTimeline = document.getElementById('modal-timeline');
    const modalSourceLink = document.getElementById('modal-source-link');

    // Click on state tile - open modal
    stateTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        currentStateTile = tile;

        // Get data from tile
        const abbr = tile.dataset.abbr;
        const state = tile.dataset.state;
        const flipYear = tile.dataset.flipYear;
        const keyFigure = tile.dataset.keyFigure;
        const keyFigureRole = tile.dataset.keyFigureRole;
        const headline = tile.dataset.headline;
        const summary = tile.dataset.summary;
        const quote = tile.dataset.quote;
        const quoteAttribution = tile.dataset.quoteAttribution;
        const sourceUrl = tile.dataset.sourceUrl;
        let events = [];

        try {
          events = JSON.parse(tile.dataset.events || '[]');
        } catch (e) {
          events = [];
        }

        // Populate modal
        modalAbbr.textContent = abbr;
        modalStateName.textContent = state;
        modalHeadline.textContent = headline;
        modalFlipYear.textContent = flipYear;
        modalKeyFigure.textContent = keyFigure;
        modalKeyFigureRole.textContent = keyFigureRole;
        modalSummary.textContent = summary;
        modalQuote.textContent = `"${quote}"`;
        modalQuoteAttribution.textContent = `— ${quoteAttribution}`;
        modalSourceLink.href = sourceUrl;

        // Build timeline
        modalTimeline.innerHTML = events.map(event => `
          <div class="state-modal__timeline-item">
            <span class="state-modal__timeline-year">${event.year}</span>
            <span class="state-modal__timeline-event">${event.event}</span>
          </div>
        `).join('');

        // Show modal
        openStateModal(modal);
      });
    });

    // Close modal on backdrop click
    modalBackdrop.addEventListener('click', () => {
      closeStateModal(modal);
    });

    // Close modal on close button click
    modalClose.addEventListener('click', () => {
      closeStateModal(modal);
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeStateModal(modal);
      }
    });
  }

  function openStateModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const focusableElements = modal.querySelectorAll('button, a[href]');
    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  }

  function closeStateModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the tile that opened the modal
    if (currentStateTile) {
      currentStateTile.focus();
    }
  }

  // ============================================
  // QUIZ FUNCTIONALITY
  // ============================================
  function initQuiz() {
    const quizContainer = document.querySelector('.quiz');
    if (!quizContainer) return;

    const scoreDisplay = document.getElementById('quiz-score');
    const fixedScoreDisplay = document.getElementById('quiz-score-fixed-value');
    const fixedBar = document.getElementById('quiz-score-fixed');
    const heroScoreContainer = document.getElementById('quiz-score-hero');
    let score = 0;
    let answered = 0;

    // Fisher-Yates shuffle for randomizing arrays
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // 1. Shuffle question order
    const questionsArray = Array.from(quizContainer.querySelectorAll('.quiz-question'));
    shuffleArray(questionsArray);

    // Re-append questions in shuffled order and renumber them
    questionsArray.forEach((question, index) => {
      const questionText = question.querySelector('.quiz-question__text');
      if (questionText) {
        // Update question number (format: "1. Question text?")
        const originalText = questionText.textContent;
        const questionContent = originalText.replace(/^\d+\.\s*/, ''); // Remove old number
        questionText.textContent = `${index + 1}. ${questionContent}`;
      }
      question.setAttribute('data-question-id', index + 1);
      quizContainer.appendChild(question);
    });

    // 2. Shuffle options within each question
    const letters = ['A', 'B', 'C', 'D'];
    questionsArray.forEach((question) => {
      const optionsContainer = question.querySelector('.quiz-options');
      const options = Array.from(optionsContainer.querySelectorAll('.quiz-option'));

      // Shuffle the options array
      shuffleArray(options);

      // Re-append in shuffled order and update labels
      options.forEach((option, index) => {
        // Extract the answer text (after "X. ") - trim first to handle template whitespace
        const originalText = option.textContent.trim();
        const answerText = originalText.replace(/^[A-D]\.\s*/, ''); // Remove "A. ", "B. ", etc.

        // Store the new letter on the element for later reference
        option.dataset.letter = letters[index];

        // Update with new letter
        option.textContent = `${letters[index]}. ${answerText}`;
        option.setAttribute('aria-label', `${letters[index]}. ${answerText}`);

        // Re-append to container (this reorders the DOM)
        optionsContainer.appendChild(option);
      });
    });

    // 3. Reveal quiz after shuffling (prevent flash of unshuffled content)
    quizContainer.classList.add('is-ready');

    // Get fresh reference to questions after shuffling
    const questions = quizContainer.querySelectorAll('.quiz-question');

    // Function to update both score displays
    function updateScore() {
      const scoreText = `${score} / ${answered}`;
      if (scoreDisplay) {
        scoreDisplay.textContent = scoreText;
      }
      if (fixedScoreDisplay) {
        fixedScoreDisplay.textContent = scoreText;
      }
    }

    // Show fixed bar when hero score is not visible
    if (fixedBar && heroScoreContainer) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Hero score visible - hide fixed bar
              fixedBar.classList.remove('is-visible');
            } else {
              // Hero score NOT visible - show fixed bar
              fixedBar.classList.add('is-visible');
            }
          });
        },
        {
          root: null,
          threshold: 0,
          rootMargin: '-50px 0px 0px 0px'
        }
      );
      observer.observe(heroScoreContainer);
    }

    questions.forEach((question) => {
      const options = question.querySelectorAll('.quiz-option');

      options.forEach((option) => {
        option.addEventListener('click', () => {
          // Already answered
          if (question.classList.contains('answered')) return;

          question.classList.add('answered');
          answered++;

          const isCorrect = option.dataset.correct === 'true';

          // Find the correct answer and its letter
          let correctLetter = '';
          options.forEach((opt) => {
            if (opt.dataset.correct === 'true') {
              correctLetter = opt.dataset.letter;
            }
          });

          if (isCorrect) {
            option.classList.add('correct');
            score++;
          } else {
            option.classList.add('incorrect');
            // Highlight correct answer
            options.forEach((opt) => {
              if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
              }
            });
          }

          // Update both score displays
          updateScore();

          // Show explanation if exists
          const explanation = question.querySelector('.quiz-explanation');
          if (explanation) {
            explanation.classList.add('show');
            explanation.setAttribute('aria-hidden', 'false');

            // Add correct answer indicator at the top of explanation
            const explanationContent = explanation.querySelector('.quiz-explanation__content');
            if (explanationContent && !explanationContent.querySelector('.quiz-answer-indicator')) {
              const indicator = document.createElement('div');
              indicator.className = 'quiz-answer-indicator';
              indicator.innerHTML = isCorrect
                ? `<span class="quiz-answer-indicator--correct">Correct! The answer was ${correctLetter}.</span>`
                : `<span class="quiz-answer-indicator--incorrect">Incorrect. The answer was ${correctLetter}.</span>`;
              explanationContent.insertBefore(indicator, explanationContent.firstChild);
            }

            // Smooth scroll to show explanation if it's below the fold
            setTimeout(() => {
              const rect = explanation.getBoundingClientRect();
              if (rect.bottom > window.innerHeight) {
                explanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }, 100);
          }

          // Check if main quiz is complete - reveal advanced quiz
          if (answered === questions.length) {
            const advancedSection = document.getElementById('advanced-quiz-section');
            const lockedPreview = document.getElementById('advanced-quiz-locked');
            if (advancedSection && !advancedSection.classList.contains('is-visible')) {
              // Small delay to let user see their final score
              setTimeout(() => {
                // Hide the locked preview
                if (lockedPreview) {
                  lockedPreview.classList.add('is-hidden');
                }
                advancedSection.classList.add('is-visible');
                // Also reveal all .reveal elements inside the advanced section
                advancedSection.querySelectorAll('.reveal').forEach(el => {
                  el.classList.add('is-visible');
                });
                initAdvancedQuiz();
                // Scroll to reveal the advanced quiz
                setTimeout(() => {
                  advancedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
              }, 1500);
            }
          }
        });
      });
    });
  }

  // ============================================
  // ADVANCED QUIZ (Scholar's Challenge)
  // ============================================
  function initAdvancedQuiz() {
    const advancedQuizContainer = document.getElementById('advanced-quiz');
    if (!advancedQuizContainer) return;

    const scoreDisplay = document.getElementById('advanced-quiz-score');
    let score = 0;
    let answered = 0;

    // Fisher-Yates shuffle
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Shuffle question order
    const questionsArray = Array.from(advancedQuizContainer.querySelectorAll('.quiz-question'));
    shuffleArray(questionsArray);

    // Re-append questions in shuffled order and renumber them
    questionsArray.forEach((question, index) => {
      const questionText = question.querySelector('.quiz-question__text');
      if (questionText) {
        const originalText = questionText.textContent;
        const questionContent = originalText.replace(/^\d+\.\s*/, '');
        questionText.textContent = `${index + 1}. ${questionContent}`;
      }
      question.setAttribute('data-question-id', index + 1);
      advancedQuizContainer.appendChild(question);
    });

    // Shuffle options within each question
    const letters = ['A', 'B', 'C', 'D'];
    questionsArray.forEach((question) => {
      const optionsContainer = question.querySelector('.quiz-options');
      const options = Array.from(optionsContainer.querySelectorAll('.quiz-option'));

      shuffleArray(options);

      options.forEach((option, index) => {
        // Trim first to handle template whitespace, then use regex to remove letter prefix
        const originalText = option.textContent.trim();
        const answerText = originalText.replace(/^[A-D]\.\s*/, '');
        option.dataset.letter = letters[index];
        option.textContent = `${letters[index]}. ${answerText}`;
        option.setAttribute('aria-label', `${letters[index]}. ${answerText}`);
        optionsContainer.appendChild(option);
      });
    });

    // Reveal quiz after shuffling
    advancedQuizContainer.classList.add('is-ready');

    // Get fresh reference to questions
    const questions = advancedQuizContainer.querySelectorAll('.quiz-question');

    // Update score display
    function updateScore() {
      if (scoreDisplay) {
        scoreDisplay.textContent = `${score} / ${answered}`;
      }
    }

    // Add click handlers
    questions.forEach((question) => {
      const options = question.querySelectorAll('.quiz-option');

      options.forEach((option) => {
        option.addEventListener('click', () => {
          if (question.classList.contains('answered')) return;

          question.classList.add('answered');
          answered++;

          const isCorrect = option.dataset.correct === 'true';

          let correctLetter = '';
          options.forEach((opt) => {
            if (opt.dataset.correct === 'true') {
              correctLetter = opt.dataset.letter;
            }
          });

          if (isCorrect) {
            option.classList.add('correct');
            score++;
          } else {
            option.classList.add('incorrect');
            options.forEach((opt) => {
              if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
              }
            });
          }

          updateScore();

          const explanation = question.querySelector('.quiz-explanation');
          if (explanation) {
            explanation.classList.add('show');
            explanation.setAttribute('aria-hidden', 'false');

            const explanationContent = explanation.querySelector('.quiz-explanation__content');
            if (explanationContent && !explanationContent.querySelector('.quiz-answer-indicator')) {
              const indicator = document.createElement('div');
              indicator.className = 'quiz-answer-indicator';
              indicator.innerHTML = isCorrect
                ? `<span class="quiz-answer-indicator--correct">Correct! The answer was ${correctLetter}.</span>`
                : `<span class="quiz-answer-indicator--incorrect">Incorrect. The answer was ${correctLetter}.</span>`;
              explanationContent.insertBefore(indicator, explanationContent.firstChild);
            }

            setTimeout(() => {
              const rect = explanation.getBoundingClientRect();
              if (rect.bottom > window.innerHeight) {
                explanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }, 100);
          }
        });
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  function initKeyboardNav() {
    const chapters = document.querySelectorAll('[data-chapter]');
    if (!chapters.length) return;

    let currentIndex = 0;

    document.addEventListener('keydown', (e) => {
      // Only if not in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, chapters.length - 1);
        chapters[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
        chapters[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Update currentIndex based on scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentIndex = Array.from(chapters).indexOf(entry.target);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    chapters.forEach((chapter) => observer.observe(chapter));
  }

  // ============================================
  // ANIMATED COUNTER
  // ============================================
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    // If user prefers reduced motion, set final values immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(el => { el.textContent = el.dataset.count; });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            animateCounter(el, target);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function animateCounter(el, target) {
    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeOut);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // QUOTE SHARE
  // ============================================
  function initQuoteShare() {
    const shareButtons = document.querySelectorAll('.quote-card__share');
    if (!shareButtons.length) return;

    shareButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const quote = button.dataset.quote;
        const text = `"${quote}" - Mississippi Declaration of Secession, 1861\n\nLearn more: ${window.location.origin}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Civil War Primary Source',
              text: text,
              url: window.location.href
            });
          } catch (err) {
            if (err.name !== 'AbortError') {
              copyToClipboard(text, button);
            }
          }
        } else {
          copyToClipboard(text, button);
        }
      });
    });
  }

  function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
      button.style.color = '#4caf50';
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.color = '';
      }, 2000);
    });
  }

  // ============================================
  // CONFETTI CELEBRATION
  // ============================================
  function createConfetti() {
    const colors = ['#d4a853', '#c4a882', '#f5f5f7', '#8b3a3a', '#3a5a8b'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        if (Math.random() > 0.5) {
          confetti.style.borderRadius = '50%';
        }

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
      }, i * 20);
    }
  }

  // Enhanced bingo celebration
  function celebrateBingo() {
    const existing = document.querySelector('.bingo-celebration');
    if (existing) return;

    // Create confetti
    createConfetti();

    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.className = 'bingo-celebration';
    celebration.innerHTML = '<span>BINGO!</span>';
    document.body.appendChild(celebration);

    setTimeout(() => {
      celebration.classList.add('show');
    }, 10);

    setTimeout(() => {
      celebration.classList.remove('show');
      setTimeout(() => celebration.remove(), 500);
    }, 3000);
  }

  // ============================================
  // COALITION CHART ANIMATION
  // ============================================
  function initCoalitionChart() {
    const chartBars = document.querySelectorAll('.chart-fill');
    if (!chartBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    chartBars.forEach((bar) => observer.observe(bar));

    // Handle expandable quote rows
    const quoteRows = document.querySelectorAll('.chart-row--has-quotes');
    quoteRows.forEach((row) => {
      row.addEventListener('click', () => {
        const wasExpanded = row.classList.contains('is-expanded');

        // Close all other expanded rows
        quoteRows.forEach((r) => {
          r.classList.remove('is-expanded');
          r.setAttribute('aria-expanded', 'false');
          const quotes = r.querySelector('.chart-quotes');
          if (quotes) quotes.setAttribute('aria-hidden', 'true');
        });

        // Toggle this row
        if (!wasExpanded) {
          row.classList.add('is-expanded');
          row.setAttribute('aria-expanded', 'true');
          const quotes = row.querySelector('.chart-quotes');
          if (quotes) quotes.setAttribute('aria-hidden', 'false');
        }
      });

      // Keyboard support
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          row.click();
        }
      });
    });
  }

  // ============================================
  // MONUMENTS TIMELINE CHART
  // ============================================
  function initMonumentsChart() {
    const container = document.getElementById('monuments-chart');
    const detail = document.getElementById('monuments-chart-detail');
    if (!container || !window.monumentsData) return;

    const data = window.monumentsData;
    const nonRemoval = data.filter(d => !d.isRemoval);
    const maxCount = Math.max(...nonRemoval.map(d => d.count));

    data.forEach((decade, index) => {
      const bar = document.createElement('button');
      bar.type = 'button';
      bar.className = 'monument-bar';
      if (decade.isPeak) bar.classList.add('monument-bar--peak');
      if (decade.isRemoval) bar.classList.add('monument-bar--removal');

      const heightPct = decade.isRemoval ? 12 : Math.max(3, (decade.count / maxCount) * 100);
      bar.style.height = heightPct + '%';

      bar.setAttribute('aria-label', `${decade.decade}: ${decade.isRemoval ? 'Removal wave' : decade.count + ' monuments'}`);

      const countEl = document.createElement('span');
      countEl.className = 'monument-bar__count';
      countEl.textContent = decade.isRemoval ? '↓' : decade.count;
      bar.appendChild(countEl);

      const labelEl = document.createElement('span');
      labelEl.className = 'monument-bar__label';
      labelEl.textContent = decade.label;
      bar.appendChild(labelEl);

      bar.addEventListener('click', () => {
        container.querySelectorAll('.monument-bar').forEach(b => b.classList.remove('is-active'));
        bar.classList.add('is-active');
        renderDetail(decade);
      });

      container.appendChild(bar);
    });

    function renderDetail(decade) {
      const countText = decade.isRemoval
        ? '<span class="monuments-chart__detail-removal">Removal wave — over 160 symbols removed 2015–2021</span>'
        : `<p class="monuments-chart__detail-count">${decade.count} monuments documented</p>`;

      const eventsHtml = decade.events && decade.events.length
        ? `<ul class="monuments-chart__detail-events">${decade.events.map(e => `<li>${e}</li>`).join('')}</ul>`
        : '';

      detail.innerHTML = `
        <div class="monuments-chart__detail-inner">
          <p class="monuments-chart__detail-decade">${decade.decade}</p>
          ${countText}
          <p class="monuments-chart__detail-context">${decade.context}</p>
          ${eventsHtml}
        </div>
      `;
    }
  }

  // ============================================
  // DESKTOP DROPDOWN NAVIGATION
  // ============================================
  function initNavDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    if (!dropdowns.length) return;

    function closeAll() {
      dropdowns.forEach(d => {
        d.classList.remove('is-open');
        d.querySelector('.nav-dropdown__trigger').setAttribute('aria-expanded', 'false');
      });
    }

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.nav-dropdown__trigger');
      const menu = dropdown.querySelector('.nav-dropdown__menu');
      const items = Array.from(menu.querySelectorAll('.nav-dropdown__item'));

      trigger.addEventListener('click', () => {
        const isOpen = dropdown.classList.contains('is-open');
        closeAll();
        if (!isOpen) {
          dropdown.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          dropdown.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          items[0]?.focus();
        }
        if (e.key === 'Escape') closeAll();
      });

      items.forEach((item, i) => {
        item.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); items[i + 1]?.focus(); }
          if (e.key === 'ArrowUp') { e.preventDefault(); (i === 0 ? trigger : items[i - 1]).focus(); }
          if (e.key === 'Escape') { closeAll(); trigger.focus(); }
          if (e.key === 'Tab' && !e.shiftKey && i === items.length - 1) closeAll();
        });
      });
    });

    // Close on outside click (only when clicking outside any dropdown)
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) closeAll();
    });
    // Close on Escape anywhere
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
  }

  // ============================================
  // MOBILE NAVIGATION (bottom bar + drawer)
  // ============================================
  function initMobileNav() {
    if (window.innerWidth > 768) return;
    if (document.querySelector('.mobile-bar')) return;

    const path = window.location.pathname;
    const historyPages = ['/reconstruction/', '/jim-crow/', '/monuments/', '/convict-leasing/', '/lost-cause/', '/lynching/', '/tulsa/', '/redlining/', '/great-migration/', '/civil-rights/', '/southern-strategy/'];
    const explorePages = ['/quiz/', '/bingo/'];
    const isHistory = historyPages.includes(path);
    const isExplore = explorePages.includes(path);

    // --- Bottom bar ---
    const bar = document.createElement('nav');
    bar.className = 'mobile-bar';
    bar.setAttribute('aria-label', 'Mobile navigation');
    bar.innerHTML = `
      <div class="mobile-bar__inner">
        <a href="/" class="mobile-bar__item ${path === '/' ? 'is-active' : ''}" ${path === '/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          Home
        </a>
        <button class="mobile-bar__item ${isHistory ? 'is-active' : ''}" id="mobile-bar-history" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Browse history pages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          History
        </button>
        <a href="/sources/" class="mobile-bar__item ${path === '/sources/' ? 'is-active' : ''}" ${path === '/sources/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
          Evidence
        </a>
        <button class="mobile-bar__item ${isExplore ? 'is-active' : ''}" id="mobile-bar-explore" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Browse explore pages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
          Explore
        </button>
      </div>
    `;
    document.body.appendChild(bar);

    // --- Slide-up drawer ---
    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.id = 'mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Navigation menu');
    drawer.innerHTML = `
      <div class="mobile-drawer__backdrop"></div>
      <div class="mobile-drawer__panel">
        <div class="mobile-drawer__handle" aria-hidden="true"></div>
        <div class="mobile-drawer__header">
          <span class="mobile-drawer__title">Did the Parties Switch?</span>
          <button class="mobile-drawer__close" id="mobile-drawer-close" aria-label="Close menu">&times;</button>
        </div>
        <div class="mobile-drawer__body">
          <div class="mobile-drawer__section">
            <span class="mobile-drawer__section-label">History</span>
            <a href="/reconstruction/" class="mobile-drawer__link ${path === '/reconstruction/' ? 'is-active' : ''}" ${path === '/reconstruction/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              Reconstruction
            </a>
            <a href="/jim-crow/" class="mobile-drawer__link ${path === '/jim-crow/' ? 'is-active' : ''}" ${path === '/jim-crow/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              Jim Crow
            </a>
            <a href="/monuments/" class="mobile-drawer__link ${path === '/monuments/' ? 'is-active' : ''}" ${path === '/monuments/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>
              Monuments
            </a>
            <a href="/convict-leasing/" class="mobile-drawer__link ${path === '/convict-leasing/' ? 'is-active' : ''}" ${path === '/convict-leasing/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              Convict Leasing
            </a>
            <a href="/lost-cause/" class="mobile-drawer__link ${path === '/lost-cause/' ? 'is-active' : ''}" ${path === '/lost-cause/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Lost Cause
            </a>
            <a href="/lynching/" class="mobile-drawer__link ${path === '/lynching/' ? 'is-active' : ''}" ${path === '/lynching/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Racial Terror
            </a>
            <a href="/tulsa/" class="mobile-drawer__link ${path === '/tulsa/' ? 'is-active' : ''}" ${path === '/tulsa/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              Tulsa 1921
            </a>
            <a href="/redlining/" class="mobile-drawer__link ${path === '/redlining/' ? 'is-active' : ''}" ${path === '/redlining/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              Redlining
            </a>
            <a href="/great-migration/" class="mobile-drawer__link ${path === '/great-migration/' ? 'is-active' : ''}" ${path === '/great-migration/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              Great Migration
            </a>
            <a href="/civil-rights/" class="mobile-drawer__link ${path === '/civil-rights/' ? 'is-active' : ''}" ${path === '/civil-rights/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              Civil Rights
            </a>
            <a href="/southern-strategy/" class="mobile-drawer__link ${path === '/southern-strategy/' ? 'is-active' : ''}" ${path === '/southern-strategy/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Southern Strategy
            </a>
          </div>
          <div class="mobile-drawer__section">
            <span class="mobile-drawer__section-label">Evidence &amp; Today</span>
            <a href="/sources/" class="mobile-drawer__link ${path === '/sources/' ? 'is-active' : ''}" ${path === '/sources/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
              Evidence
            </a>
            <a href="/voting-access/" class="mobile-drawer__link ${path === '/voting-access/' ? 'is-active' : ''}" ${path === '/voting-access/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              Voting Today
            </a>
          </div>
          <div class="mobile-drawer__section">
            <span class="mobile-drawer__section-label">Explore</span>
            <a href="/quiz/" class="mobile-drawer__link ${path === '/quiz/' ? 'is-active' : ''}" ${path === '/quiz/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
              Quiz
            </a>
            <a href="/bingo/" class="mobile-drawer__link ${path === '/bingo/' ? 'is-active' : ''}" ${path === '/bingo/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
              Bingo
            </a>
            <a href="/about/" class="mobile-drawer__link ${path === '/about/' ? 'is-active' : ''}" ${path === '/about/' ? 'aria-current="page"' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              About
            </a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(drawer);

    // Drawer open/close helpers
    function openDrawer() {
      drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // Focus first link in drawer
      setTimeout(() => {
        drawer.querySelector('.mobile-drawer__link, .mobile-drawer__close')?.focus();
      }, 50);
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Bottom bar buttons open drawer
    document.getElementById('mobile-bar-history').addEventListener('click', openDrawer);
    document.getElementById('mobile-bar-explore').addEventListener('click', openDrawer);

    // Close button
    document.getElementById('mobile-drawer-close').addEventListener('click', closeDrawer);

    // Backdrop click closes
    drawer.querySelector('.mobile-drawer__backdrop').addEventListener('click', closeDrawer);

    // Escape key closes
    drawer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Focus trap inside drawer
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // ============================================
  // SEARCH MODAL (Pagefind)
  // ============================================
  function initSearch() {
    const modal = document.getElementById('search-modal');
    const openBtn = document.getElementById('search-open');
    const closeBtn = document.getElementById('search-close');
    const backdrop = document.getElementById('search-backdrop');
    if (!modal || !openBtn) return;

    let initialized = false;

    function openSearch() {
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      // Lazy-initialize Pagefind UI on first open
      if (!initialized) {
        initialized = true;
        import('/pagefind/pagefind-ui.js').then(() => {
          new window.PagefindUI({
            element: '#search-container',
            showSubResults: true,
            resetStyles: false
          });
          // Auto-focus the search input after init
          setTimeout(() => {
            modal.querySelector('input[type="text"], input[type="search"]')?.focus();
          }, 100);
        }).catch(() => {
          document.getElementById('search-container').innerHTML =
            '<p style="padding:1rem;color:var(--text-muted);font-size:0.9rem;">Search is available on the live site after build.</p>';
        });
      } else {
        setTimeout(() => {
          modal.querySelector('input[type="text"], input[type="search"]')?.focus();
        }, 50);
      }
    }

    function closeSearch() {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      openBtn?.focus();
    }

    openBtn.addEventListener('click', openSearch);
    closeBtn?.addEventListener('click', closeSearch);
    backdrop?.addEventListener('click', closeSearch);

    // Keyboard: / to open, Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && modal.hasAttribute('hidden') && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeSearch();
      }
    });
  }

  // ============================================
  // IN-PAGE TABLE OF CONTENTS
  // ============================================
  function initTOC() {
    const sections = Array.from(document.querySelectorAll('[data-chapter]'));
    if (sections.length < 3) return; // Not worth showing for very short pages

    // Filter out utility sections
    const ignore = ['Introduction', 'Mission'];
    const items = sections.filter(s => !ignore.includes(s.dataset.chapter));
    if (items.length < 2) return;

    function buildLinks(cls) {
      return items.map((s, i) => `
        <li class="${cls}__item">
          <a href="#${s.id || ''}" class="${cls}__link" data-toc-index="${i}">${s.dataset.chapter}</a>
        </li>`).join('');
    }

    // Desktop sidebar TOC
    const toc = document.createElement('nav');
    toc.className = 'toc';
    toc.setAttribute('aria-label', 'Page contents');
    toc.innerHTML = `<ul class="toc__list">${buildLinks('toc')}</ul>`;
    document.body.appendChild(toc);

    // Mobile FAB TOC
    const tocMobile = document.createElement('div');
    tocMobile.className = 'toc-mobile';
    tocMobile.innerHTML = `
      <div class="toc-mobile__panel" role="navigation" aria-label="Page contents">
        <ul class="toc-mobile__list">${buildLinks('toc-mobile')}</ul>
      </div>
      <button class="toc-mobile__btn" aria-label="Table of contents" aria-expanded="false">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    document.body.appendChild(tocMobile);

    const tocBtn = tocMobile.querySelector('.toc-mobile__btn');
    tocBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = tocMobile.classList.toggle('is-open');
      tocBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      tocMobile.classList.remove('is-open');
      tocBtn.setAttribute('aria-expanded', 'false');
    });

    // Smooth scroll for all TOC links
    document.querySelectorAll('.toc__link, .toc-mobile__link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = 70; // header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        tocMobile.classList.remove('is-open');
        tocBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Scroll spy — highlight active section
    const allTocLinks = Array.from(document.querySelectorAll('.toc__link, .toc-mobile__link'));

    function updateActive() {
      const scrollY = window.scrollY + 120;
      let activeIdx = 0;
      items.forEach((section, i) => {
        if (section.getBoundingClientRect().top + window.scrollY <= scrollY) {
          activeIdx = i;
        }
      });
      allTocLinks.forEach(link => {
        const matches = parseInt(link.dataset.tocIndex) === activeIdx;
        link.classList.toggle('is-active', matches);
      });
    }

    // Show/hide desktop TOC based on scroll position
    let tocShown = false;
    function handleScroll() {
      updateActive();
      const scrolled = window.scrollY > 200;
      if (scrolled !== tocShown) {
        tocShown = scrolled;
        toc.classList.toggle('is-visible', scrolled);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ============================================
  // EXTERNAL LINK ACCESSIBILITY
  // Appends a screen-reader-only "(opens in new tab)" label to every
  // target="_blank" link that does not already have an aria-label.
  // Also adds the visual ↗ indicator via a CSS class.
  // ============================================
  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      link.classList.add('ext-link');
      if (!link.getAttribute('aria-label')) {
        const visibleText = link.textContent.trim();
        if (visibleText) {
          link.setAttribute('aria-label', `${visibleText} (opens in new tab)`);
        }
      }
    });
  }

  // ============================================
  // INITIALIZE
  // ============================================
  function init() {
    initScrollReveal();
    initProgressBar();
    initHeroParallax();
    initCSVDownload();
    initBingoCard();
    initBingoInteraction();
    initStateModal();
    initQuiz();
    initSmoothScroll();
    initKeyboardNav();
    initAnimatedCounters();
    initQuoteShare();
    initCoalitionChart();
    initMonumentsChart();
    initNavDropdowns();
    initMobileNav();
    initTOC();
    initSearch();
    initExternalLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
