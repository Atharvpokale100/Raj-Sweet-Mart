// diwali-specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('itemModal');
    const modalClose = document.getElementById('modalClose');
    const sweetItems = document.querySelectorAll('.sweet-item');
    const searchInput = document.getElementById('navSearchInput');
    const mobileSearchInput = document.getElementById('menuSearchInput');
    const diwaliSearchInput = document.getElementById('diwaliSearchInput');

    // Function to open the modal
    const openModal = (e) => {
        // Find the clicked sweet-item
        const item = e.currentTarget;
        
        // Get data from attributes
        const name = item.dataset.name;
        const description = item.dataset.description;
        const price = item.dataset.price;
        //const ingredients = item.dataset.ingredients;
        const weights = item.dataset.weights;
        const category = item.dataset.category;

// Populate modal
document.getElementById('modalCategory').textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Sweets';
document.getElementById('modalName').textContent = name;
document.getElementById('modalDescription').textContent = description;
document.getElementById('modalPrice').innerHTML = `<strong>Price:</strong> ${price}`;
//document.getElementById('modalIngredients').innerHTML = `<strong>Ingredients:</strong> ${ingredients}`;
document.getElementById('modalWeights').innerHTML = `<strong>Available Weights:</strong> ${weights}`;;
        
        // Show modal
        modal.style.display = 'flex';
    };

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // CATEGORY FILTERING FUNCTIONALITY
    const filterCategory = (category) => {
        // Update active button
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Filter items with smooth animations
        sweetItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                // Show item with staggered animation
                setTimeout(() => {
                    item.style.display = '';
                    item.classList.remove('hidden');
                    item.classList.add('visible');
                }, index * 50); // Stagger the animations
            } else {
                // Hide item with animation
                item.classList.remove('visible');
                item.classList.add('hidden');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

    };

    // Make filterCategory function globally available
    window.filterCategory = filterCategory;

    // SEARCH FUNCTIONALITY
    let currentSearchTerm = '';
    
    // Function to perform search
    const performSearch = (query) => {
        const searchTerm = query.toLowerCase().trim();
        
        sweetItems.forEach(item => {
            const name = item.dataset.name.toLowerCase();
            const description = (item.dataset.description || '').toLowerCase();
            const matches = name.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          searchTerm === '';

            if (matches) {
                item.style.display = '';
                item.classList.remove('hidden');
                item.classList.add('visible');
            } else {
                item.style.display = 'none';
                item.classList.remove('visible');
                item.classList.add('hidden');
            }
        });
    };

    // Desktop search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
    }

    // Mobile search
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        mobileSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(mobileSearchInput.value);
            }
        });
    }

    // Diwali page specific search
    if (diwaliSearchInput) {
        diwaliSearchInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });

        diwaliSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(diwaliSearchInput.value);
            }
        });
    }

    // Prevent form submission
    document.querySelectorAll('form.search-below-heading').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });

    // Add click listeners to all sweet items
    sweetItems.forEach(item => {
        item.addEventListener('click', openModal);
    });

    // Add click listener for the close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Add click listener for the modal background to close it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Initialize with all items visible
    filterCategory('all');

    // Slider functionality
    const sliderContainer = document.querySelector('.slider-container');
    const images = document.querySelectorAll('.slider-image');
    
    // Clone first image and add to end for smooth infinite loop
    const firstImageClone = images[0].cloneNode(true);
    sliderContainer.appendChild(firstImageClone);
    
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex++;
        sliderContainer.style.transition = 'transform 0.5s ease';
        sliderContainer.style.transform = `translateX(-${currentIndex * 20}%)`;
        
        if(currentIndex === images.length) {
            setTimeout(() => {
                sliderContainer.style.transition = 'none';
                currentIndex = 0;
                sliderContainer.style.transform = 'translateX(0)';
            }, 500);
        }
    }, 2000);

    // Pre-cache category items for faster filtering
    const categoryCache = new Map();
    
    // Initialize cache
    sweetItems.forEach(item => {
        const category = item.dataset.category.toLowerCase();
        if (!categoryCache.has(category)) {
            categoryCache.set(category, []);
        }
        categoryCache.get(category).push(item);
    });

    // Optimized filter function
    window.filterCategory = function(category) {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        event.target.classList.add('active');

        const targetCategory = category.toLowerCase();

        requestAnimationFrame(() => {
            sweetItems.forEach(item => {
                const itemCategory = item.dataset.category.toLowerCase();
                const shouldShow = category === 'all' || itemCategory === targetCategory;
                
                item.style.display = shouldShow ? '' : 'none';
                item.classList.toggle('visible', shouldShow);
                item.classList.toggle('hidden', !shouldShow);
            });
        });
    };

    // Initial load - show all items
    filterCategory('all');
});


// Scroll to Top Button JavaScript
;(() => {
  console.log("[v0] Scroll to top script starting...")

  // Configuration
  const config = {
    showAfter: 300, // Show button after scrolling 300px
    scrollDuration: 800, // Smooth scroll duration in ms
    progressIndicator: false, // Set to true to enable progress indicator
  }

  // Get the scroll to top button
  const scrollButton = document.querySelector(".scroll-to-top")
  console.log("[v0] Button found:", scrollButton)

  if (!scrollButton) {
    console.warn("[v0] Scroll to top button not found - make sure HTML has class 'scroll-to-top'")
    return
  }

  // Show/hide button based on scroll position
  function toggleButtonVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    console.log("[v0] Scroll position:", scrollTop, "Show after:", config.showAfter)

    if (scrollTop > config.showAfter) {
      scrollButton.classList.add("show")
      console.log("[v0] Button should be visible - added 'show' class")
    } else {
      scrollButton.classList.remove("show")
      console.log("[v0] Button should be hidden - removed 'show' class")
    }

    // Update progress indicator if enabled
    if (config.progressIndicator && scrollButton.classList.contains("progress")) {
      updateProgressIndicator(scrollTop)
    }
  }

  // Update progress indicator
  function updateProgressIndicator(scrollTop) {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = (scrollTop / documentHeight) * 360
    scrollButton.style.setProperty("--progress", `${progress}deg`)
  }

  // Smooth scroll to top
  function scrollToTop() {
    console.log("[v0] Scroll to top clicked")
    const startPosition = window.pageYOffset
    const startTime = performance.now()

    function animation(currentTime) {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / config.scrollDuration, 1)

      // Easing function (ease-out-cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)

      window.scrollTo(0, startPosition * (1 - easeOutCubic))

      if (progress < 1) {
        requestAnimationFrame(animation)
      } else {
        console.log("[v0] Scroll animation completed")
      }
    }

    requestAnimationFrame(animation)
  }

  // Event listeners
  window.addEventListener("scroll", toggleButtonVisibility, { passive: true })
  window.addEventListener("resize", toggleButtonVisibility, { passive: true })
  console.log("[v0] Scroll and resize event listeners added")

  scrollButton.addEventListener("click", (e) => {
    e.preventDefault()
    console.log("[v0] Button clicked")
    scrollToTop()
  })

  // Handle keyboard navigation
  scrollButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      console.log("[v0] Button activated via keyboard")
      scrollToTop()
    }
  })

  // Initialize on page load
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[v0] DOM loaded, initializing button visibility")
    toggleButtonVisibility()
  })

  // Handle page visibility changes
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      toggleButtonVisibility()
    }
  })

  console.log("[v0] Scroll to top script initialized successfully")
})()













