# Micah Detamore - Professional Portfolio Website

A modern, responsive, and professional portfolio website built with HTML5, CSS3, and JavaScript. This portfolio showcases your skills, experience, projects, and allows potential clients to contact you.

## 🎨 Features

- **Modern Design**: Clean and professional aesthetic with gradient accents
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging transitions and scroll effects
- **Interactive Navigation**: Hamburger menu for mobile, active link indicators
- **Hero Section**: Eye-catching introduction with call-to-action buttons
- **About Section**: Personal introduction with statistics
- **Skills Section**: Organized technical skills by category
- **Experience Timeline**: Professional work history in a timeline format
- **Projects Showcase**: Grid layout for featured projects with descriptions
- **Contact Form**: Functional contact form with validation
- **Social Links**: Quick access to LinkedIn, GitHub, and other profiles
- **Dark Mode Ready**: CSS variables for easy theme customization
- **SEO Friendly**: Semantic HTML structure

## 📁 Project Structure

```
Portfolio/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main styles and components
│   └── responsive.css     # Mobile and tablet responsive styles
├── js/
│   └── script.js          # Interactive functionality
├── assets/                # (Optional) For images and media
└── README.md             # This file
```

## 🚀 How to Customize

### 1. Basic Information

Edit the following in `index.html`:

- **Name**: Change "Micah Detamore" to your name in:
  - Navigation logo
  - Hero title
  - Browser tab title
  - Footer copyright

- **Social Links**: Update the href attributes for:
  - LinkedIn profile
  - GitHub profile
  - Twitter profile

- **Contact Information**:
  - Email address (line with `micah@example.com`)
  - Phone number (line with `+1 (234) 567-8900`)
  - Location (line with "Your City, State")

### 2. About Section

Update the "About Me" text in the about section:
```html
<p>
    I'm a Software Engineer with a passion for creating elegant solutions...
</p>
```

Update the statistics to reflect your actual experience:
```html
<div class="stat">
    <h3>5+</h3>             <!-- Change this number -->
    <p>Years Experience</p>
</div>
```

### 3. Skills Section

Modify the skill categories and add your actual skills:

```html
<div class="skill-category">
    <h3>Frontend</h3>
    <ul>
        <li>React.js</li>      <!-- Add/remove skills as needed -->
        <li>TypeScript</li>
        <li>HTML5 & CSS3</li>
    </ul>
</div>
```

### 4. Experience Section

Update the professional experience timeline:

```html
<div class="timeline-item">
    <div class="timeline-header">
        <h3>Senior Software Engineer</h3>  <!-- Your job title -->
        <span class="company">Tech Company Inc.</span>  <!-- Company name -->
    </div>
    <p class="timeline-date">2021 - Present</p>  <!-- Dates -->
    <p class="timeline-description">
        Your job description and achievements...
    </p>
</div>
```

### 5. Projects Section

Replace the featured projects with your actual work:

```html
<div class="project-card">
    <div class="project-header">
        <i class="fas fa-globe"></i>  <!-- Icon -->
    </div>
    <h3>Project Name</h3>
    <p>Project description...</p>
    <div class="project-tags">
        <span class="tag">Technology1</span>
        <span class="tag">Technology2</span>
    </div>
    <a href="#" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
</div>
```

**Available Icons** (from Font Awesome):
- `fa-globe` - Website/E-commerce
- `fa-chart-line` - Analytics/Dashboard
- `fa-users` - Social/Networking
- `fa-container` - DevOps/Container
- `fa-mobile-alt` - Mobile app
- `fa-lock` - Security/Tools

### 6. Contact Form

The contact form is pre-configured but you may want to:

- Set up backend processing for form submissions
- Connect to a service like Formspree, EmailJS, or your own API
- Update the form validation rules if needed

Current setup logs form data to console and shows success/error messages.

### 7. Update Resume Link

Add a link to your resume (PDF):
1. Place your resume PDF in the assets folder
2. Update the button or add a link:
```html
<a href="assets/resume.pdf" target="_blank" class="btn btn-primary">Download Resume</a>
```

## 🎨 Customizing Colors

The portfolio uses CSS variables for easy color customization. Edit these in `css/style.css`:

```css
:root {
    --primary-color: #6366f1;      /* Main accent color (purple-blue) */
    --secondary-color: #10b981;    /* Secondary color (green) */
    --accent-color: #f59e0b;       /* Accent color (amber) */
    --dark-bg: #0f172a;            /* Dark background */
    --text-dark: #1e293b;          /* Dark text */
    --text-light: #64748b;         /* Light text */
}
```

### Color Schemes

**Cool Blue (Default)**
```css
--primary-color: #6366f1;
--secondary-color: #10b981;
```

**Warm Orange**
```css
--primary-color: #ea580c;
--secondary-color: #f59e0b;
```

**Professional Purple**
```css
--primary-color: #7c3aed;
--secondary-color: #6366f1;
```

## 📱 Responsive Features

The portfolio is mobile-first and responsive across:
- **Desktop**: 1440px+
- **Large Screens**: 1200px+
- **Tablets**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: 320px - 479px

## ⚡ Performance Tips

1. **Optimize Images**: Replace placeholder images with optimized versions
2. **Minify Files**: For production, minify CSS and JavaScript
3. **Lazy Loading**: Consider lazy loading images if adding many
4. **Caching**: Set up browser caching with proper headers

## 🔧 Adding Portfolio Entries

### Add a New Skill Category

```html
<div class="skill-category">
    <h3>Your Category</h3>
    <ul>
        <li>Skill 1</li>
        <li>Skill 2</li>
        <li>Skill 3</li>
    </ul>
</div>
```

### Add a New Project

```html
<div class="project-card">
    <div class="project-header">
        <i class="fas fa-icon-name"></i>
    </div>
    <h3>Your Project Title</h3>
    <p>Project description goes here...</p>
    <div class="project-tags">
        <span class="tag">Tech1</span>
        <span class="tag">Tech2</span>
    </div>
    <a href="your-project-link" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
</div>
```

### Add a New Experience Entry

```html
<div class="timeline-item">
    <div class="timeline-header">
        <h3>Your Job Title</h3>
        <span class="company">Your Company</span>
    </div>
    <p class="timeline-date">2023 - 2024</p>
    <p class="timeline-description">
        Your job description and key achievements...
    </p>
</div>
```

## 🔗 External Services

To make the contact form fully functional, you can integrate with:

### Option 1: Formspree (Recommended for beginners)
1. Visit https://formspree.io/
2. Create an account and add your form
3. Update the form action attribute

### Option 2: EmailJS
1. Visit https://www.emailjs.com/
2. Set up your email service
3. Install EmailJS SDK and configure in `script.js`

### Option 3: Backend API
Set up your own backend server to handle form submissions.

## 🎯 SEO Optimization

1. **Meta Tags**: Already included in `<head>`
2. **Structured Data**: Consider adding schema.org markup
3. **Mobile Friendly**: Already implemented
4. **Fast Load Time**: Optimize images and use CDN
5. **Keywords**: Update page title and meta description with your keywords

Example meta tags to customize:
```html
<meta name="description" content="Your professional portfolio description">
<title>Your Name - Your Professional Title</title>
```

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## 🚢 Deployment

### Deploy to GitHub Pages
1. Create a GitHub repository named `your-username.github.io`
2. Push your portfolio files to the repository
3. Your site will be live at `https://your-username.github.io`

### Deploy to Netlify
1. Visit https://netlify.com
2. Connect your GitHub repository
3. Click "Deploy site"
4. Your portfolio is live!

### Deploy to Vercel
1. Visit https://vercel.com
2. Import your repository
3. Click "Deploy"

## 📝 Important Notes

- Replace all placeholder text with your actual information
- Update social media links with your profiles
- Test the form submission (currently logs to console)
- Ensure all links are working correctly
- Test on mobile devices before publishing

## 🐛 Troubleshooting

### Form not working?
- Check browser console for errors
- Ensure the contact form handling is configured
- Verify input fields have correct `id` attributes

### Mobile menu not closing?
- Check that JavaScript is loaded
- Verify no console errors
- Try clearing browser cache

### Animations not showing?
- Check CSS file is loaded correctly
- Verify browser supports CSS animations
- Check if JavaScript is enabled

## 📚 Resources

- **Font Awesome Icons**: https://fontawesome.com/icons
- **Font Family**: Segoe UI (system font)
- **CSS Grid**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **Flexbox**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/

## 📄 License

Feel free to use this portfolio template for personal and professional use.

## 💡 Enhancement Ideas

- [ ] Add a blog section
- [ ] Implement dark mode toggle
- [ ] Add testimonials/reviews section
- [ ] Create case studies for major projects
- [ ] Add download resume button
- [ ] Implement newsletter signup
- [ ] Add client logos section
- [ ] Create an admin dashboard to manage content
- [ ] Add Google Analytics tracking
- [ ] Implement email notifications for form submissions

## 🤝 Support

For issues or questions, refer to the original code comments or consider:
- Checking browser developer console for errors
- Validating CSS/HTML with W3C validators
- Testing on different devices and browsers

---

**Last Updated**: March 2024
**Version**: 1.0

Good luck with your portfolio! Remember to keep it updated with your latest projects and achievements. 🚀
