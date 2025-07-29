document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        

        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        body.className = 'dark-theme';
        updateThemeIcon('dark-theme');
        
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                updateThemeIcon('light-theme');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                updateThemeIcon('dark-theme');
            }
        });
        
        function openPdf(pdfPath) {
            const modal = document.getElementById('pdfModal');
            const iframe = document.getElementById('pdfFrame');
    

            iframe.src = pdfPath;
    
    
            modal.classList.add('active');
    
   
            document.body.style.overflow = 'hidden';
        }

        function closePdf() {
            const modal = document.getElementById('pdfModal');
            const iframe = document.getElementById('pdfFrame');
    
   
            modal.classList.remove('active');
    
    
            setTimeout(() => {
                iframe.src = '';
            }, 300);
    
    
            document.body.style.overflow = 'auto';
        }


        document.getElementById('closePdf').addEventListener('click', closePdf);


        document.getElementById('pdfModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closePdf();
            }
        });


        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closePdf();
            }
        });


        function updateThemeIcon(theme) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark-theme') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
        

        const observerOptions = {
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.animate').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        

        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.padding = '15px 0';
            } else {
                navbar.style.padding = '20px 0';
            }
        });