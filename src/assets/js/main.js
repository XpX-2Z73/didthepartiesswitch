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
    const heroContent = hero?.querySelector('.hero__content-wrapper');
    const scrollPrompt = hero?.querySelector('.scroll-prompt');
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

      if (square.id === 'free-space') {
        button.setAttribute('aria-pressed', 'true');
      }

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
      if (isBingoCell && element.classList.contains('marked')) {
        modalMarkBtn.textContent = 'Unmark Square';
        modalMarkBtn.style.display = '';
      } else if (isBingoCell) {
        modalMarkBtn.textContent = 'Mark Square';
        modalMarkBtn.style.display = '';
      } else {
        // Hide mark button for claims list (not part of bingo game)
        modalMarkBtn.style.display = 'none';
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

        // Update button text
        if (currentBingoCell.classList.contains('marked')) {
          modalMarkBtn.textContent = 'Unmark Square';
        } else {
          modalMarkBtn.textContent = 'Mark Square';
        }

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
            if (advancedSection && !advancedSection.classList.contains('is-visible')) {
              // Small delay to let user see their final score
              setTimeout(() => {
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
  // MOBILE NAVIGATION
  // ============================================
  function initMobileNav() {
    // Only create if on mobile and nav doesn't exist
    if (window.innerWidth > 768 || document.querySelector('.mobile-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'mobile-nav';
    nav.innerHTML = `
      <div class="mobile-nav__inner">
        <a href="/" class="mobile-nav__item ${window.location.pathname === '/' ? 'is-active' : ''}" ${window.location.pathname === '/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          Home
        </a>
        <a href="/quiz/" class="mobile-nav__item ${window.location.pathname === '/quiz/' ? 'is-active' : ''}" ${window.location.pathname === '/quiz/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
          Quiz
        </a>
        <a href="/bingo/" class="mobile-nav__item ${window.location.pathname === '/bingo/' ? 'is-active' : ''}" ${window.location.pathname === '/bingo/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
          Bingo
        </a>
        <a href="/reconstruction/" class="mobile-nav__item ${window.location.pathname === '/reconstruction/' ? 'is-active' : ''}" ${window.location.pathname === '/reconstruction/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          History
        </a>
        <a href="/sources/" class="mobile-nav__item ${window.location.pathname === '/sources/' ? 'is-active' : ''}" ${window.location.pathname === '/sources/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
          Evidence
        </a>
        <a href="/voting-access/" class="mobile-nav__item ${window.location.pathname === '/voting-access/' ? 'is-active' : ''}" ${window.location.pathname === '/voting-access/' ? 'aria-current="page"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          Voting
        </a>
      </div>
    `;
    document.body.appendChild(nav);
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
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
