/**
 * Level Test Quiz Module
 * 
 * This module provides a self-assessment quiz for ESL learners to determine
 * their level (beginner, intermediate, or advanced).
 */
const LevelTestQuiz = (function() {
  // Private variables to store question banks for each level
  const questionBanks = {
    beginner: [
      {
        question: "What ____ your name?",
        options: ["is", "are", "am", "be"],
        correctAnswer: 0
      },
      {
        question: "She ____ TV every evening.",
        options: ["watch", "watching", "watches", "is watch"],
        correctAnswer: 2
      },
      {
        question: "We ____ students.",
        options: ["is", "am", "are", "be"],
        correctAnswer: 2
      },
      {
        question: "I ____ coffee now.",
        options: ["drink", "drinking", "am drinking", "drinks"],
        correctAnswer: 2
      },
      {
        question: "He ____ like spicy food.",
        options: ["don't", "not", "doesn't", "isn't"],
        correctAnswer: 2
      },
      {
        question: "Where ____ you live?",
        options: ["are", "do", "does", "is"],
        correctAnswer: 1
      },
      {
        question: "They ____ at home yesterday.",
        options: ["are", "was", "were", "is"],
        correctAnswer: 2
      },
      {
        question: "I ____ breakfast every morning.",
        options: ["having", "have", "has", "am having"],
        correctAnswer: 1
      },
      {
        question: "She ____ English and Spanish.",
        options: ["speak", "speaks", "speaking", "is speaking"],
        correctAnswer: 1
      },
      {
        question: "We ____ to the park tomorrow.",
        options: ["go", "goes", "going", "are going"],
        correctAnswer: 3
      },
      {
        question: "____ is that? It's my brother.",
        options: ["Who", "What", "Where", "When"],
        correctAnswer: 0
      },
      {
        question: "There ____ a book on the table.",
        options: ["is", "are", "be", "has"],
        correctAnswer: 0
      },
      {
        question: "I ____ like pizza.",
        options: ["very", "much", "many", "a lot"],
        correctAnswer: 1
      },
      {
        question: "She ____ have a cat.",
        options: ["no", "don't", "not", "doesn't"],
        correctAnswer: 3
      },
      {
        question: "We ____ watching a movie now.",
        options: ["is", "am", "are", "be"],
        correctAnswer: 2
      },
      {
        question: "He ____ to work by bus.",
        options: ["go", "goes", "going", "went"],
        correctAnswer: 1
      },
      {
        question: "I ____ 25 years old.",
        options: ["is", "am", "are", "be"],
        correctAnswer: 1
      },
      {
        question: "They ____ like classical music.",
        options: ["doesn't", "isn't", "aren't", "don't"],
        correctAnswer: 3
      },
      {
        question: "What time ____ you wake up?",
        options: ["are", "do", "does", "is"],
        correctAnswer: 1
      },
      {
        question: "The children ____ playing outside.",
        options: ["is", "am", "are", "be"],
        correctAnswer: 2
      }
    ],
    
    intermediate: [
      {
        question: "I ____ in London for five years.",
        options: ["live", "am living", "have lived", "lived"],
        correctAnswer: 2
      },
      {
        question: "If I ____ rich, I would travel the world.",
        options: ["am", "was", "were", "will be"],
        correctAnswer: 2
      },
      {
        question: "The book ____ by millions of people.",
        options: ["has read", "has been read", "have read", "have been read"],
        correctAnswer: 1
      },
      {
        question: "She told me that she ____ the movie the night before.",
        options: ["watched", "had watched", "has watched", "was watching"],
        correctAnswer: 1
      },
      {
        question: "I wish I ____ speak French fluently.",
        options: ["can", "could", "will", "would"],
        correctAnswer: 1
      },
      {
        question: "The weather is getting ____.",
        options: ["more bad", "worse", "more worse", "badder"],
        correctAnswer: 1
      },
      {
        question: "You ____ have told me about the meeting earlier.",
        options: ["should", "must", "could", "would"],
        correctAnswer: 0
      },
      {
        question: "The project will be finished ____ next month.",
        options: ["until", "by", "since", "for"],
        correctAnswer: 1
      },
      {
        question: "I ____ studying English since I was ten years old.",
        options: ["am", "was", "have been", "had been"],
        correctAnswer: 2
      },
      {
        question: "If he ____ harder, he would have passed the exam.",
        options: ["studied", "had studied", "studies", "was studying"],
        correctAnswer: 1
      },
      {
        question: "The house ____ painted last summer.",
        options: ["is", "was", "has been", "had been"],
        correctAnswer: 1
      },
      {
        question: "I'd rather you ____ smoke in here.",
        options: ["don't", "didn't", "won't", "wouldn't"],
        correctAnswer: 1
      },
      {
        question: "She's the most intelligent person I've ____ met.",
        options: ["never", "ever", "always", "often"],
        correctAnswer: 1
      },
      {
        question: "By the time we arrived, the concert ____.",
        options: ["started", "had started", "has started", "was starting"],
        correctAnswer: 1
      },
      {
        question: "I'm used to ____ early in the morning.",
        options: ["wake up", "waking up", "wake", "woken up"],
        correctAnswer: 1
      },
      {
        question: "The more you practice, ____ you'll become.",
        options: ["better", "the better", "good", "the good"],
        correctAnswer: 1
      },
      {
        question: "She asked me where ____.",
        options: ["do I live", "I live", "did I live", "I lived"],
        correctAnswer: 3
      },
      {
        question: "I can't stand ____ to loud music.",
        options: ["listen", "listening", "to listen", "listened"],
        correctAnswer: 1
      },
      {
        question: "He speaks English ____ he's lived here all his life.",
        options: ["as if", "like", "such as", "so that"],
        correctAnswer: 0
      },
      {
        question: "I'll call you ____ I arrive.",
        options: ["while", "during", "as soon as", "until"],
        correctAnswer: 2
      }
    ],
    
    advanced: [
      {
        question: "Had I known about the traffic, I ____ earlier.",
        options: ["would leave", "would have left", "will leave", "left"],
        correctAnswer: 1
      },
      {
        question: "The task needs ____.",
        options: ["completed", "complete", "completing", "been completed"],
        correctAnswer: 0
      },
      {
        question: "It is imperative that the document ____ before the deadline.",
        options: ["is submitted", "be submitted", "will be submitted", "submitted"],
        correctAnswer: 1
      },
      {
        question: "Should the flight ____ due to bad weather, passengers will be accommodated.",
        options: ["be delayed", "delays", "is delayed", "delayed"],
        correctAnswer: 0
      },
      {
        question: "Only after checking the results twice ____ the announcement.",
        options: ["he made", "did he make", "made he", "he had made"],
        correctAnswer: 1
      },
      {
        question: "Not for a moment ____ that she would fail.",
        options: ["I thought", "did I think", "I had thought", "had I thought"],
        correctAnswer: 1
      },
      {
        question: "The proposal ____ by the committee next week.",
        options: ["will consider", "will be considered", "considers", "is considering"],
        correctAnswer: 1
      },
      {
        question: "____ the weather been better, we would have had the picnic.",
        options: ["If", "Had", "Should", "Were"],
        correctAnswer: 1
      },
      {
        question: "It's high time you ____ responsibility for your actions.",
        options: ["take", "took", "taken", "taking"],
        correctAnswer: 1
      },
      {
        question: "No sooner ____ the door than the phone rang.",
        options: ["I had opened", "had I opened", "I opened", "did I open"],
        correctAnswer: 1
      },
      {
        question: "The meeting is supposed to ____ started by now.",
        options: ["be", "have", "had", "being"],
        correctAnswer: 1
      },
      {
        question: "Little ____ he know what awaited him.",
        options: ["does", "did", "had", "would"],
        correctAnswer: 1
      },
      {
        question: "I'd sooner ____ than apologize to him.",
        options: ["die", "dying", "died", "to die"],
        correctAnswer: 0
      },
      {
        question: "The phenomenon ____ by scientists for decades.",
        options: ["has been studying", "has been studied", "is studying", "was studying"],
        correctAnswer: 1
      },
      {
        question: "Were it not for your help, I ____ succeeded.",
        options: ["wouldn't have", "won't have", "didn't", "haven't"],
        correctAnswer: 0
      },
      {
        question: "Rarely ____ such dedication in young people.",
        options: ["we see", "do we see", "we have seen", "have we seen"],
        correctAnswer: 1
      },
      {
        question: "The legislation ____ effect next year.",
        options: ["will come into", "comes into", "came into", "has come into"],
        correctAnswer: 0
      },
      {
        question: "But for his intervention, the situation ____ much worse.",
        options: ["would be", "would have been", "will be", "was"],
        correctAnswer: 1
      },
      {
        question: "Scarcely ____ when it started to rain.",
        options: ["we had arrived", "had we arrived", "we arrived", "did we arrive"],
        correctAnswer: 1
      },
      {
        question: "The accused ____ to have committed the crime.",
        options: ["is alleging", "is alleged", "alleges", "has alleged"],
        correctAnswer: 1
      }
    ]
  };
  
  // Variables to track current state
  let currentLevel = "beginner";
  let currentQuestions = [];
  let userAnswers = {};
  let score = 0;
  
  /**
   * Initializes the quiz module
   */
  function init() {
    // Set up tab switching
    setupTabs();
    
    // Load initial questions for beginner level
    loadQuestions("beginner");
    
    // Set up event listeners for level-specific buttons
    setupButtonListeners("beginner");
    setupButtonListeners("intermediate");
    setupButtonListeners("advanced");
    
    console.log("Level Test Quiz initialized");
  }
  
  /**
   * Sets up tab switching functionality
   */
  function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const level = this.getAttribute('data-tab');
        
        // Deactivate all tabs and content
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Activate selected tab and content
        this.classList.add('active');
        document.getElementById(`${level}-tab`).classList.add('active');
        
        // Load questions for this level
        loadQuestions(level);
        
        // Update current level
        currentLevel = level;
      });
    });
  }
  
  /**
   * Sets up button listeners for a specific level
   * 
   * @param {string} level - The level (beginner, intermediate, advanced)
   */
  function setupButtonListeners(level) {
    // Check answers button
    const checkButton = document.getElementById(`${level}-check`);
    if (checkButton) {
      checkButton.addEventListener('click', function() {
        checkAnswers(level);
      });
    }
    
    // Try new quiz button
    const tryNewButton = document.getElementById(`${level}-try-new`);
    if (tryNewButton) {
      tryNewButton.addEventListener('click', function() {
        loadQuestions(level);
        
        // Hide results
        document.getElementById(`${level}-result`).style.display = 'none';
      });
    }
  }
  
  /**
   * Loads random questions for a specific level
   * 
   * @param {string} level - The level (beginner, intermediate, advanced)
   */
  function loadQuestions(level) {
    const questions = questionBanks[level];
    const quizContainer = document.getElementById(`${level}-quiz`);
    
    // Randomly select 5 questions
    currentQuestions = getRandomQuestions(questions, 5);
    
    // Reset user answers
    userAnswers = {};
    
    // Generate HTML for questions
    let questionsHTML = '';
    
    currentQuestions.forEach((question, index) => {
      const questionId = `${level}-q${index + 1}`;
      
      questionsHTML += `
        <div class="question" id="${questionId}">
          <p class="mcq-question">${index + 1}. ${question.question}</p>
          <div class="options">
            ${question.options.map((option, optIndex) => `
              <div class="option" data-index="${optIndex}">
                <span>${String.fromCharCode(65 + optIndex)}. ${option}</span>
              </div>
            `).join('')}
          </div>
          <div class="feedback"></div>
        </div>
      `;
    });
    
    // Update DOM
    quizContainer.innerHTML = questionsHTML;
    
    // Attach click handlers to options
    setupOptionClickHandlers(level);
  }
  
  /**
   * Gets random questions from a question bank
   * 
   * @param {Array} questions - Array of all questions
   * @param {number} count - Number of questions to select
   * @returns {Array} - Selected random questions
   */
  function getRandomQuestions(questions, count) {
    // Make a copy of the questions array
    const questionsCopy = [...questions];
    const result = [];
    
    // Select 'count' random questions
    for (let i = 0; i < count && questionsCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * questionsCopy.length);
      result.push(questionsCopy.splice(randomIndex, 1)[0]);
    }
    
    return result;
  }
  
  /**
   * Sets up click handlers for option selection
   * 
   * @param {string} level - The level (beginner, intermediate, advanced)
   */
  function setupOptionClickHandlers(level) {
    const quizContainer = document.getElementById(`${level}-quiz`);
    const options = quizContainer.querySelectorAll('.option');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const questionElement = this.closest('.question');
        const questionId = questionElement.id;
        const optionIndex = parseInt(this.getAttribute('data-index'));
        
        // Clear previous selection for this question
        questionElement.querySelectorAll('.option').forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Select this option
        this.classList.add('selected');
        
        // Store user's answer
        userAnswers[questionId] = optionIndex;
      });
    });
  }
  
  /**
   * Checks answers and displays feedback
   * 
   * @param {string} level - The level (beginner, intermediate, advanced)
   */
  function checkAnswers(level) {
    const quizContainer = document.getElementById(`${level}-quiz`);
    const questions = quizContainer.querySelectorAll('.question');
    
    // Calculate score
    score = 0;
    let answeredQuestions = 0;
    
    questions.forEach((question, index) => {
      const questionId = question.id;
      const userAnswer = userAnswers[questionId];
      const correctAnswer = currentQuestions[index].correctAnswer;
      const feedbackElement = question.querySelector('.feedback');
      
      // If the question wasn't answered
      if (userAnswer === undefined) {
        feedbackElement.textContent = `Not answered. The correct answer is: ${currentQuestions[index].options[correctAnswer]}`;
        feedbackElement.className = "feedback incorrect";
        
        // Highlight the correct option
        const options = question.querySelectorAll('.option');
        options.forEach((option, optIndex) => {
          if (optIndex === correctAnswer) {
            option.classList.add('correct');
          }
        });
      } 
      // If the question was answered
      else {
        // Count this as an answered question
        answeredQuestions++;
        
        const isCorrect = userAnswer === correctAnswer;
        
        // Update feedback
        if (isCorrect) {
          feedbackElement.textContent = "Correct!";
          feedbackElement.className = "feedback correct";
          score++;
        } else {
          feedbackElement.textContent = `Incorrect. The correct answer is: ${currentQuestions[index].options[correctAnswer]}`;
          feedbackElement.className = "feedback incorrect";
        }
        
        // Highlight correct and incorrect options
        const options = question.querySelectorAll('.option');
        
        options.forEach((option, optIndex) => {
          if (optIndex === correctAnswer) {
            option.classList.add('correct');
          } else if (optIndex === userAnswer && userAnswer !== correctAnswer) {
            option.classList.add('incorrect');
          }
        });
      }
    });
    
    // Update score display
    document.getElementById(`${level}-score`).textContent = score;
    
    // Show message about number of questions answered if not all were answered
    const recommendationElement = document.getElementById(`${level}-recommendation`);
    if (answeredQuestions < questions.length) {
      recommendationElement.textContent = `You answered ${answeredQuestions} out of ${questions.length} questions, with ${score} correct.`;
    } else {
      // Update recommendation based on score
      updateRecommendation(level, score);
    }
    
    // **NEW CELEBRATION LOGIC FOR HIGH SCORES**
    if (score >= 4) {
      // Show celebration animation
      const celebrationContainer = document.getElementById(`${level}-celebration`);
      if (celebrationContainer) {
        celebrationContainer.classList.add('show');
      }
      
      // Add glow effect to score
      const scoreElement = document.querySelector(`#${level}-result .result-score`);
      if (scoreElement) {
        scoreElement.classList.add('high-score');
      }
    } else {
      // Hide celebration if score is low
      const celebrationContainer = document.getElementById(`${level}-celebration`);
      if (celebrationContainer) {
        celebrationContainer.classList.remove('show');
      }
      
      // Remove glow effect from score
      const scoreElement = document.querySelector(`#${level}-result .result-score`);
      if (scoreElement) {
        scoreElement.classList.remove('high-score');
      }
    }
    
    // Show results
    document.getElementById(`${level}-result`).style.display = 'block';
  }
  
  /**
   * Updates the level recommendation based on score
   * 
   * @param {string} level - The level (beginner, intermediate, advanced)
   * @param {number} score - The user's score
   */
  function updateRecommendation(level, score) {
    const recommendationElement = document.getElementById(`${level}-recommendation`);
    
    if (score <= 1) {
      if (level === "beginner") {
        recommendationElement.textContent = "This level is perfect for you to start with. Focus on the basics first.";
      } else if (level === "intermediate") {
        recommendationElement.textContent = "You should start with the Beginner level to build a strong foundation.";
      } else {
        recommendationElement.textContent = "This level is challenging for you. We recommend starting with Intermediate or Beginner level.";
      }
    } else if (score <= 3) {
      if (level === "beginner") {
        recommendationElement.textContent = "You know some basics. Continue with Beginner level, but you'll be ready for Intermediate soon.";
      } else if (level === "intermediate") {
        recommendationElement.textContent = "You have some intermediate knowledge. Continue at this level to strengthen your skills.";
      } else {
        recommendationElement.textContent = "This level is challenging for you. Practice more at the Intermediate level first.";
      }
    } else {
      if (level === "beginner") {
        recommendationElement.textContent = "Great job! You're ready to move to the Intermediate level.";
      } else if (level === "intermediate") {
        recommendationElement.textContent = "Excellent! You're ready to tackle the Advanced level.";
      } else {
        recommendationElement.textContent = "Outstanding! This level is appropriate for you.";
      }
    }
  }
  
  // Return public API
  return {
    init: init,
    loadQuestions: loadQuestions,
    checkAnswers: checkAnswers
  };
})();

// Initialize the quiz when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  LevelTestQuiz.init();
});